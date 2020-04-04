import { KibanaResponseFactory } from 'kibana/server';
import { Client, RequestParams } from '@elastic/elasticsearch'
import * as messages from '../protos/stenographer_pb';
import * as services from '../protos/stenographer_grpc_pb'
import grpc from 'grpc';
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import Promise from 'promise';
import { Stream } from "stream";

async function sendQuery(
  config: { pcapPath: string; stenoKey: string; stenoCert: string; stenoCaCert: string; stenoHost: string },
  request: { query: string, start: string, end: string}
){
  let
    callError: undefined,
    callStatus: {
      code: number;
    },
    pcapBytes: number = 0;

  const
    stenoKey = fs.readFileSync(config.stenoKey),
    stenoCert = fs.readFileSync(config.stenoCert),
    stenoCaCert = fs.readFileSync(config.stenoCaCert),
    stenoCreds = grpc.credentials.createSsl(
      Buffer.from(stenoCaCert),
      Buffer.from(stenoKey),
      Buffer.from(stenoCert)
    ),
    client = new services.StenographerClient(config.stenoHost, stenoCreds),
    uid = uuidv4(),
    fileName = config.pcapPath + '/' + uid,
    query = new messages.PcapRequest;


  console.log(request.query);

  query.setQuery(request.query);
  query.setUid(uid);

  const call = client.retrievePcap(query);

  return new Promise(function(resolve, reject) {
    call.on('data', function(pcap) {
      fs.appendFileSync(fileName, Buffer.from(pcap.array[1]), { flag: 'a' });
      // @ts-ignore
      pcapBytes += Buffer.from(pcap.array[1]).byteLength;
    });

    call.on('error', function(error: any) {
      console.log('received error event');
      callError = error;
    });

    call.on('status', function(status) {
      console.log('received status event');
      callStatus = status;
      console.log(callStatus);
      const statusMessage = {
        'uid': uid,
        'status': callStatus,
        'bytes': pcapBytes,
        'query': request.query,
        'start': request.start,
        'end': request.end,
        'host': config.stenoHost
      }
      if (callError) {
        reject(statusMessage)
      } else {
        resolve(statusMessage);
      }
    });

    call.on('end', function() {
      console.log('received end event');

    });
  });
}

async function writeResultToEs(client:Client, document:RequestParams.Index) {
  await client.index(document).then( response => {
    console.log(response);
  }).catch( error => { console.error(error) })
}

export async function queryStenographer(config: {
  pcapPath: string;
  stenoKey: string;
  stenoCert: string;
  stenoCaCert: string;
  stenoHost: string; },
  esClient: Client,
  request: { timestamp: string, query: string, start: string, end: string },
  response: KibanaResponseFactory,
) {

 return sendQuery(config, request)
    .then(function(queryResult:any) {
      console.log('status\n', queryResult.status, '\nbytes\n', queryResult.bytes, '\nuid\n', queryResult.uid);
      writeResultToEs(esClient,
        {
          id: queryResult.uid,
          index: 'docket',
          body: {
            '\u0040timestamp': request.timestamp,
            'stenographer': {
              'host': queryResult.host
            },
            request: {
              'query': queryResult.query,
              'start': queryResult.start,
              'end': queryResult.end
            },
            response: {
              'status': queryResult.status,
              'bytes': queryResult.bytes
            }
          },
        },
      )
      if (queryResult.status.code === 0) {
        if (isNaN(queryResult.bytes)) {
          return response.noContent();
        } else {
          return response.ok({
            body: {
              uid: queryResult.uid,
              pcapSize: queryResult.pcapLength
            }
          });
        }
      } else {
        return response.internalError({body: 'gRPC status code: ' + queryResult.status.code})
      }
    }).catch(error => {
      writeResultToEs(esClient,
        {
          id: error.uid,
          index: 'docket',
          body: {
            '\u0040timestamp': request.timestamp,
            'stenographer': {
              'host': error.host
            },
            request: {
              'query': error.query,
              'start': error.start,
              'end': error.end
            },
            response: {
              'status': error.status,
              'bytes': error.bytes
            }
          },
        },
      );
      return response.internalError({ body: error });
    })
}



export async function getFile(
  config: { pcapPath: string; },
  esClient: Client,
  uid: string,
  response: KibanaResponseFactory)
{

  const stream = new Stream.PassThrough();
  const fileName = config.pcapPath + '/' + uid;
  fs.createReadStream(fileName).pipe(stream);

  return response.ok({
    headers: {
      'Content-Type': 'application/vnd.tcpdump.pcap',
    },
    body: stream
  })

}

import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import grpc from 'grpc';
import { KibanaResponseFactory } from 'kibana/server';
import Promise from 'promise';
import { Stream } from 'stream';
import uid from 'uid';
import * as services from '../protos/stenographer_grpc_pb';
import * as messages from '../protos/stenographer_pb';
import { writeToEs } from './elasticsearch';

async function sendQuery(
  certPath: string,
  pcapPath: string,
  host: { label: string; id: string },
  query: string,
  start: string,
  end: string
) {
  let callError: undefined;
  let callStatus: {
    code: number;
  };
  let pcapBytes: number = 0;

  const path = certPath + '/' + host.id;
  const clientKey = fs.readFileSync(`${path}.key`);
  const clientCert = fs.readFileSync(`${path}.crt`);
  const clientCaCert = fs.readFileSync(`${path}.ca_crt`);
  const clientCreds = grpc.credentials.createSsl(
    Buffer.from(clientCaCert),
    Buffer.from(clientKey),
    Buffer.from(clientCert)
  );
  const client = new services.StenographerClient(host.label, clientCreds);
  const hostId = host.id;
  const requestId = uid(16);
  const fileName = pcapPath + '/' + requestId + '_' + hostId;
  const request = new messages.PcapRequest();

  request.setQuery(query);
  request.setUid(requestId);

  const call = client.retrievePcap(request);

  return new Promise(function(resolve, reject) {
    call.on('data', function(pcap) {
      fs.appendFileSync(fileName, Buffer.from(pcap.array[1]), { flag: 'a' });
      // @ts-ignore
      pcapBytes += Buffer.from(pcap.array[1]).byteLength;
    });

    call.on('error', function(error: any) {
      callError = error;
    });

    call.on('status', function(status) {
      callStatus = status;
      const statusMessage = {
        hostId,
        requestId,
        status: callStatus,
        bytes: pcapBytes,
        query,
        start,
        end,
        host: host.label,
      };
      if (callError) {
        reject(statusMessage);
      } else {
        resolve(statusMessage);
      }
    });
  });
}

export async function queryStenographer(
  config: {
    certPath: string;
    pcapPath: string;
  },
  esClient: Client,
  request: {
    timestamp: string;
    hosts: Array<{ label: string; id: string }>;
    query: string;
    start: string;
    end: string;
  },
  response: KibanaResponseFactory
) {
  Promise.all([
    request.hosts.forEach(host => {
      sendQuery(config.certPath, config.pcapPath, host, request.query, request.start, request.end)
        .then(function(queryResult: any) {
          writeToEs(esClient, response, {
            index: '.docket',
            body: {
              timestamp: request.timestamp,
              stenographer: {
                host: queryResult.host,
                id: queryResult.hostId,
              },
              request: {
                query: queryResult.query,
                start: queryResult.start,
                end: queryResult.end,
                id: queryResult.requestId,
              },
              response: {
                status: queryResult.status,
                bytes: queryResult.bytes,
              },
            },
          });
        })
        .catch(error => {
          writeToEs(esClient, response, {
            index: '.docket',
            body: {
              timestamp: request.timestamp,
              stenographer: {
                host: error.host,
                id: error.hostId,
              },
              request: {
                query: error.query,
                start: error.start,
                end: error.end,
                id: error.requestId,
              },
              response: {
                status: error.status,
                bytes: error.bytes,
              },
            },
          });
        });
    }),
  ]);
  return response.ok();
}

export async function getFile(
  config: { pcapPath: string },
  id: string,
  response: KibanaResponseFactory
) {
  const stream = new Stream.PassThrough();
  const fileName = config.pcapPath + '/' + id;
  fs.createReadStream(fileName).pipe(stream);

  return response.ok({
    headers: {
      'Content-Type': 'application/vnd.tcpdump.pcap',
    },
    body: stream,
  });
}

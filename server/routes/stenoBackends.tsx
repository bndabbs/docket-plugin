import { Client } from '@elastic/elasticsearch';
import fs from "fs";
import { KibanaResponseFactory } from 'kibana/server';
import uid from 'uid';
import { readPkcs12Keystore } from "../../../../src/core/server/utils/crypto";
import { writeToEs, deleteFromEs } from './elasticsearch';

export async function addStenoHost(
  config: {
    certPath: string;
  }, 
    esClient: Client, 
  request: {
    host: string;
    port: number;
    cert_bundle: File;
    cert_password?: string;
  }, 
  response: KibanaResponseFactory
) {
  const 
    id = uid(), 
    p12_path = config.certPath + '/' + id + '.p12', 
    key_path = config.certPath + '/' + id + '.key', 
    cert_path = config.certPath + '/' + id + '.crt', 
    ca_path = config.certPath + '/' + id + '_ca.crt';

  async function writeCerts() {
    fs.writeFileSync(p12_path, Buffer.from(request.cert_bundle));
    const certs = readPkcs12Keystore(p12_path, request.cert_password);
    fs.writeFile(key_path, certs.key, (err) => {
      if (err)
        return response.internalError({body: err});
    });
    fs.writeFile(cert_path, certs.cert, (err) => {
      if (err)
        return response.internalError({body: err});
    });
    fs.writeFile(ca_path, certs.ca, (err) => {
      if (err)
        return response.internalError({body: err});
    });
    return response.ok();
  }
  
  await writeCerts();
  return writeToEs(esClient, response, {
    id: id,
    index: '.docket-config',
    body: {
      'stenographer': {
        'host': request.host,
        'port': request.port
      }
    },
  });
}

export function deleteStenoHost(config: {
  certPath: string;
  },
  esClient: Client, 
  host: string, 
  response: KibanaResponseFactory
) {
  const 
    p12_path = config.certPath + '/' + host + '.p12', 
    key_path = config.certPath + '/' + host + '.key', 
    cert_path = config.certPath + '/' + host + '.crt', 
    ca_path = config.certPath + '/' + host + '_ca.crt';

  async function removeFile(file:string) {
    fs.unlink(file, (err) => {
      if (err) throw err;
      console.log(file + 'was deleted');
    });
  }

  removeFile(p12_path);
  removeFile(key_path);
  removeFile(cert_path);
  removeFile(ca_path);

  return deleteFromEs(esClient, response, {
    id: host,
    index: '.docket-config',
  });
}

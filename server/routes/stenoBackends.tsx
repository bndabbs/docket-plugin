import { Client } from '@elastic/elasticsearch';
import fs from "fs";
import { KibanaResponseFactory } from 'kibana/server';
import { v4 as uuidv4 } from 'uuid';
import { readPkcs12Keystore } from "../../../../src/core/server/utils/crypto";
import { writeToEs, deleteFromEs } from './elasticsearch';

export async function addStenoHost(config: {
  certPath: string;
}, esClient: Client, request: {
  host: string;
  port: number;
  cert_bundle: File;
  cert_password?: string;
}, response: KibanaResponseFactory) {
  const 
    id = uuidv4(), 
    p12_path = config.certPath + '/' + id + '.p12', 
    key_path = config.certPath + '/' + id + '.key', 
    cert_path = config.certPath + '/' + id + '.crt', 
    ca_path = config.certPath + '/' + id + '_ca.crt';

  async function writeCerts() {
    fs.writeFileSync(p12_path, Buffer.from(request.cert_bundle));
    const certs = readPkcs12Keystore(p12_path, request.cert_password);
    fs.writeFile(key_path, certs.key, (err) => {
      if (err)
        return response.internalError();
    });
    fs.writeFile(cert_path, certs.cert, (err) => {
      if (err)
        return response.internalError();
    });
    fs.writeFile(ca_path, certs.ca, (err) => {
      if (err)
        return response.internalError();
    });
    return response.ok();
  }
  
  writeToEs(esClient, {
    id: id,
    index: '.docket-config',
    body: {
      'stenographer': {
        'host': request.host,
        'port': request.port
      }
    },
  });
  return await writeCerts();
}

export async function deleteStenoHost(
    esClient: Client, 
    host: string, 
    response: KibanaResponseFactory
    ) {
        return await deleteFromEs(esClient, response, {
            id: host,
            index: '.docket-config',
    });
}

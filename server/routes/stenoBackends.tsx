import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import { KibanaResponseFactory } from 'kibana/server';
import uid from 'uid';
import { Stream } from 'stream';
import { readPkcs12Keystore } from '../../../../src/core/server/utils/crypto';
import { writeToEs, deleteFromEs } from './elasticsearch';

export async function addStenoHost(
  config: {
    certPath: string;
  },
  esClient: Client,
  request: {
    host: string;
    port: number;
    cert_bundle: Stream;
    cert_password: string;
  },
  response: KibanaResponseFactory
) {
  const id = uid();
  const path = config.certPath + '/' + id;

  async function writeCerts() {
    fs.writeFileSync(`${path}.p12`, Buffer.from(request.cert_bundle));
    const certs = readPkcs12Keystore(`${path}.p12`, request.cert_password);
    fs.writeFile(`${path}.key`, certs.key, err => {
      if (err) return response.internalError({ body: err });
    });
    fs.writeFile(`${path}.crt`, certs.cert, err => {
      if (err) return response.internalError({ body: err });
    });
    fs.writeFile(`${path}.ca_crt`, certs.ca, err => {
      if (err) return response.internalError({ body: err });
    });
    return response.ok();
  }

  await writeCerts();
  return writeToEs(esClient, response, {
    id,
    index: '.docket-config',
    body: {
      stenographer: {
        host: request.host,
        port: request.port,
      },
    },
  });
}

export function deleteStenoHost(
  config: {
    certPath: string;
  },
  esClient: Client,
  host: string,
  response: KibanaResponseFactory
) {
  const path = config.certPath + '/' + host;

  async function removeFile(file: string) {
    fs.unlink(file, err => {
      if (err) throw err;
    });
  }

  removeFile(`${path}.p12`);
  removeFile(`${path}.key`);
  removeFile(`${path}.crt`);
  removeFile(`${path}.ca_crt`);

  return deleteFromEs(esClient, response, {
    id: host,
    index: '.docket-config',
  });
}

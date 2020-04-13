import { Client, RequestParams } from '@elastic/elasticsearch';
import { KibanaResponseFactory } from 'kibana/server';

export async function writeToEs(client: Client, document: RequestParams.Index) {
  await client.index(document).then(response => {
    console.log(response);
  }).catch(error => { console.error(error); });
}

export async function deleteFromEs(client: Client, response: KibanaResponseFactory, document: RequestParams.Delete) {
  await client.delete(document).then(res => {
    return response.ok({ body: res });
  }).catch(error => {
    console.error(error);
    return response.internalError();
  });
}

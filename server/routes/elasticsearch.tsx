import { Client, RequestParams } from '@elastic/elasticsearch';
import { KibanaResponseFactory, IKibanaResponse } from 'kibana/server';

export async function writeToEs(client: Client, response: KibanaResponseFactory, document: RequestParams.Index) {
  let result:IKibanaResponse;

  async function sendToEs():Promise<IKibanaResponse> {
    await client.index(document).then(res => {
      console.log(res);
      result = response.ok({ body: res.body });
    }).catch(error => { 
      console.error(error);
      result = response.internalError({body: error});
    });
    return result;
  };

  return await sendToEs();
}

export async function deleteFromEs(client: Client, response: KibanaResponseFactory, document: RequestParams.Delete) {
  console.log(document)
  let result:IKibanaResponse;

  async function sendToEs():Promise<IKibanaResponse> {
    await client.delete(document).then(res => {
      console.log(res);
      result = response.ok({ body: res.body });
    }).catch(error => {
      console.error(error);
      result = response.internalError({body: error});
    })
    return result;
  };

  return await sendToEs();
}

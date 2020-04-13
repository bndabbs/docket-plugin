import { ApiResponse, Client } from '@elastic/elasticsearch';

async function indexExists(index: string, esClient: Client) {
  return esClient.indices.exists({index: index})
}

async function getIndex(index: string, esClient: Client) {
  return esClient.indices.get({index: index})
}

async function createIndex(index: string, mapping: object, esClient: Client) {
  return esClient.indices.create({
    index: index,
    body: {
      settings: {
        number_of_shards: 1,
        auto_expand_replicas: '0-1'
      },
      mappings: mapping
    }
  })
}

export async function SetupEsIndex (
  index:string,
  mapping: object,
  config: {
  esClientConf: object }
): Promise<ApiResponse> {
  const esClient = new Client(config.esClientConf);
  const exists = await indexExists(index, esClient)
  if (!exists.body) {
    console.log('index:', index, 'does not exist. Creating it now...\n')
    return await createIndex(index, mapping, esClient)
  } else {
    console.log('index:', index, 'already exists, getting index...\n')
    return await getIndex(index, esClient)
  }

}

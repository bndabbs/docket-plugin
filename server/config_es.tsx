import { ApiResponse, Client } from '@elastic/elasticsearch';

async function indexExists(index: string, esClient: Client) {
  return esClient.indices.exists({ index });
}

async function getIndex(index: string, esClient: Client) {
  return esClient.indices.get({ index });
}

async function createIndex(index: string, mapping: object, esClient: Client) {
  return esClient.indices.create({
    index,
    body: {
      settings: {
        number_of_shards: 1,
        auto_expand_replicas: '0-1',
      },
      mappings: mapping,
    },
  });
}

export async function SetupEsIndex(
  index: string,
  mapping: object,
  esClient: Client
): Promise<ApiResponse> {
  const exists = await indexExists(index, esClient);
  if (!exists.body) {
    return await createIndex(index, mapping, esClient);
  } else {
    return await getIndex(index, esClient);
  }
}

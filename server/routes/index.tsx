import { IRouter } from 'kibana/server';
import { schema } from '@kbn/config-schema';
import { queryStenographer, getFile } from './steno'
import { Client } from '@elastic/elasticsearch';

export async function StenoRoutes(router: IRouter, config: {
  esClientConf: object;
  pcapPath: string;
  stenoKey: string;
  stenoCert: string;
  stenoCaCert: string;
  stenoHost: string;
}) {

const esClient = new Client(config.esClientConf);

  router.post({
      path: '/api/docket/query',
      validate: {
        body: schema.object({
          timestamp: schema.string(),
          query: schema.string(),
          start: schema.string(),
          end: schema.string()
        }),
      },
    },
  async (_context, request, response) => {
      return await queryStenographer(config, esClient, request.body, response)
  });
    router.get({
      path: '/api/docket/download/{uid}',
      validate: {
        params: schema.object({
          uid: schema.string(),
        }),
      },
    },
    async(_context, request, response) =>  {
      return await getFile(config, esClient, request.params.uid, response)
    }
  )
}


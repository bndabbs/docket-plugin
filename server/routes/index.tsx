import { IRouter } from 'kibana/server';
import { schema } from '@kbn/config-schema';
import { Client } from '@elastic/elasticsearch';
import { queryStenographer, getFile } from './stenoQuery';
import { addStenoHost, deleteStenoHost } from './stenoBackends';

export async function StenoRoutes(
  router: IRouter,
  config: {
    esClientConf: object;
    pcapPath: string;
    stenoKey: string;
    stenoCert: string;
    stenoCaCert: string;
    stenoHost: string;
    certPath: string;
  }
) {
  const esClient = new Client(config.esClientConf);

  router.post(
    {
      path: '/api/docket/query',
      validate: {
        body: schema.object({
          timestamp: schema.string(),
          query: schema.string(),
          start: schema.string(),
          end: schema.string(),
          hosts: schema.arrayOf(
            schema.object({
              label: schema.string(),
              id: schema.string(),
            })
          ),
        }),
      },
    },
    async (_context, request, response) => {
      return await queryStenographer(config, esClient, request.body, response);
    }
  );

  router.post(
    {
      path: '/api/docket/host',
      validate: {
        body: schema.object({
          host: schema.string(),
          port: schema.number(),
          cert_password: schema.string(),
          cert_bundle: schema.stream(),
        }),
      },
    },
    async (_context, request, response) => {
      return await addStenoHost(config, esClient, request.body, response);
    }
  );

  router.delete(
    {
      path: '/api/docket/host/{host}',
      validate: {
        params: schema.object({
          host: schema.string(),
        }),
      },
    },
    async (_context, request, response) => {
      return deleteStenoHost(config, esClient, request.params.host, response);
    }
  );

  router.get(
    {
      path: '/api/docket/download/{id}',
      validate: {
        params: schema.object({
          id: schema.string(),
        }),
      },
    },
    async (_context, request, response) => {
      return await getFile(config, request.params.id, response);
    }
  );
}

import { schema } from '@kbn/config-schema';
import { Client } from '@elastic/elasticsearch';
import { IRouter } from '../../../../src/core/server';
import { queryStenographer, getFile } from './steno_query';
import { addStenoHost, deleteStenoHost } from './steno_backends';
import { DocketConfigType } from '../config';

export async function StenoRoutes(router: IRouter, config: DocketConfigType, esClient: Client) {
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
          cert_bundle: schema.any(),
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

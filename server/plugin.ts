import { take } from 'rxjs/operators';
import fs from 'fs';
import { Client, ClientOptions } from '@elastic/elasticsearch';
import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';
import { DocketSetup, DocketStart } from './types';
import { StenoRoutes } from './routes';
import { SetupEsIndex } from './config_es';
import { configMapping, queryMapping } from './assets/field_mappings';
import { DocketConfigType } from './config';

interface BasicAuth {
  username: string;
  password: string;
}

export class DocketPlugin implements Plugin<DocketSetup, DocketStart> {
  private config?: DocketConfigType;
  private readonly log: Logger;
  esClient?: Client;

  constructor(private readonly context: PluginInitializerContext) {
    this.log = context.logger.get();
  }

  async setup({ http }: CoreSetup) {
    this.log.debug('docket: Setup');
    const config$ = this.context.config.create<DocketConfigType>();
    this.config = await config$.pipe(take(1)).toPromise();

    fs.mkdirSync(this.config.certPath, { recursive: true });
    fs.mkdirSync(this.config.pcapPath, { recursive: true });

    const router = http.createRouter();

    function hasAuth(auth: ClientOptions['auth'] | any): auth is BasicAuth {
      return (
        (auth as BasicAuth).username !== undefined && (auth as BasicAuth).password !== undefined
      );
    }

    const auth: ClientOptions['auth'] = hasAuth(this.config.elasticsearch)
      ? {
          username: this.config.elasticsearch.username,
          password: this.config.elasticsearch.password,
        }
      : undefined;

    const esClient = new Client({ nodes: this.config.elasticsearch.hosts, auth });

    this.esClient = esClient;

    // Register server side APIs
    await StenoRoutes(router, this.config, this.esClient);

    return {};
  }

  public async start(core: CoreStart) {
    // Setup Docket indexes
    function hasClient(client: Client | any): client is Client {
      return (client as ClientOptions).nodes !== undefined;
    }
    if (hasClient(this.esClient)) {
      await SetupEsIndex('docket', queryMapping, this.esClient)
        .then((response) => this.log.debug((response.body as unknown) as string))
        .catch((error) => this.log.fatal(error));
      await SetupEsIndex('.docket-config', configMapping, this.esClient)
        .then((response) => this.log.debug((response.body as unknown) as string))
        .catch((error) => this.log.fatal(error));
      this.log.info('docket: Started');
    } else this.log.fatal('Could not retrieve ES client information');
    return {};
  }

  public stop() {}
}

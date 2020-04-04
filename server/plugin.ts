import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger
} from 'kibana/server';

import { DocketPluginSetup, DocketPluginStart } from './types';
import { StenoRoutes } from './routes';
import { loadYamlConfig } from './config';
import { SetupConfigIndex } from './configEs';
import { mapping } from './assets/field_mappings';

export class DocketPlugin implements Plugin<any, any, DocketPluginSetup, DocketPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public async setup(core: CoreSetup) {
    this.logger.debug('docket: Setup');
    const config = loadYamlConfig('/etc/docket/config.yaml')
    const router = core.http.createRouter();

    // Register server side APIs
    await StenoRoutes(router, config);

    return {};
  }

  public async start(core: CoreStart) {
    const config = loadYamlConfig('/etc/docket/config.yaml')
    await SetupConfigIndex('docket', mapping, config)
      .then(response => this.logger.info(response.body))
      .catch(error => this.logger.fatal(error));
    this.logger.info('docket: Started');
    return {};
  }

  public stop() {}
}

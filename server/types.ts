// eslint-disable-next-line @typescript-eslint/no-empty-interface
import { Logger, PluginInitializerContext } from 'kibana/server';

export interface DocketPluginSetup {
  initializerContext: PluginInitializerContext
  logger: Logger
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DocketPluginStart {
  logger: Logger
}

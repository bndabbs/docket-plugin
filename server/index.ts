import { PluginInitializerContext } from 'kibana/server';
import { DocketPlugin } from './plugin';

export { DocketPluginSetup, DocketPluginStart } from './types';

export function plugin(initializerContext: PluginInitializerContext) {
  return new DocketPlugin(initializerContext);
}

export { DocketPlugin as Plugin };
export * from '../common';

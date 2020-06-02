import { PluginConfigDescriptor, PluginInitializerContext } from '../../../src/core/server';
import { DocketPlugin } from './plugin';
import { DocketConfigType, config as configSchema } from './config';

export { DocketPluginSetup, DocketPluginStart } from './types';

export function plugin(context: PluginInitializerContext) {
  return new DocketPlugin(context);
}

export const config: PluginConfigDescriptor<DocketConfigType> = {
  schema: configSchema,
};

export { DocketPlugin as Plugin };
export * from '../common';

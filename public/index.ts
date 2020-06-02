// import { PluginInitializer } from 'kibana/public';
import { DocketPlugin } from './plugin';
export { DocketPlugin as Plugin };

export function plugin() {
  return new DocketPlugin();
}

export { DocketPluginSetup, DocketPluginStart } from './types';

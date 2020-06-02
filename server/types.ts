// eslint-disable-next-line @typescript-eslint/no-empty-interface
import { Logger, PluginInitializerContext } from '../../../src/core/server';
import { DocketPlugin } from './plugin';

/** @public */
export type DocketSetup = ReturnType<DocketPlugin['setup']> extends Promise<infer U>
  ? U
  : ReturnType<DocketPlugin['setup']>;

/** @public */
export type DocketStart = ReturnType<DocketPlugin['start']> extends Promise<infer U>
  ? U
  : ReturnType<DocketPlugin['start']>;

export interface DocketPluginSetup {
  context: PluginInitializerContext;
  logger: Logger;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DocketPluginStart {
  logger: Logger;
}

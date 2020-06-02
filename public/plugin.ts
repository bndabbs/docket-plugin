import { CoreSetup, Plugin, AppMountParameters, CoreStart } from '../../../src/core/public';
import {
  DocketPluginSetup,
  DocketPluginStart,
  DocketPluginSetupDeps,
  DocketPluginStartDeps,
} from './types';

export class DocketPlugin
  implements
    Plugin<DocketPluginSetup, DocketPluginStart, DocketPluginSetupDeps, DocketPluginStartDeps> {
  public setup(core: CoreSetup<DocketPluginStartDeps, DocketPluginStart>): DocketPluginSetup {
    // Register an application into the side navigation menu
    core.application.register({
      id: 'docket',
      title: 'Docket',
      async mount(params: AppMountParameters) {
        const [coreStart, depsStart] = await core.getStartServices();
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in kibana.json
        return renderApp(coreStart, depsStart as DocketPluginStartDeps, params);
      },
    });
    return {};
  }

  public start(core: CoreStart): DocketPluginStart {
    return {};
  }

  public stop() {}
}

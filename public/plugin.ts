import { AppMountParameters, CoreSetup, Plugin } from 'kibana/public';
import { AppPluginStartDependencies } from './types';

export class DocketPlugin implements Plugin {
  public setup(core: CoreSetup<AppPluginStartDependencies, void>) {
    core.application.register({
      id: 'docket',
      title: 'Docket',
      async mount(params: AppMountParameters) {
        const [coreStart, depsStart] = await core.getStartServices();
        const { renderApp } = await import('./application');
        return renderApp(coreStart, depsStart, params);
      },
    });
  }

  public start() {}
  public stop() {}
}

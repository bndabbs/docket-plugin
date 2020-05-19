import { CoreSetup, Plugin } from 'src/core/public';
import { AppMountParameters } from 'kibana/public';
import { FeaturesPluginSetup } from '../../../x-pack/plugins/features/public';
import { DocketProps } from './types';

export class DocketPlugin implements Plugin<void, void, {}, DocketProps> {
  public setup(core: CoreSetup<DocketProps>, _plugins: { feature: FeaturesPluginSetup }) {
    const notifications = core;
    core.application.register({
      id: 'docket',
      title: 'Docket',
      async mount(params: AppMountParameters) {
        const [coreStart, depsStart] = await core.getStartServices();
        const { renderApp } = await import('./application');

        return renderApp(
          coreStart.i18n,
          {
            application: coreStart.application,
            basename: params.appBasePath,
            data: depsStart.data,
            notifications: notifications.notifications,
          },
          params.element
        );
      },
    });
  }

  public start() {}

  public stop() {}
}

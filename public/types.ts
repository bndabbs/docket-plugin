import { RouteComponentProps } from 'react-router-dom';
import { IEsSearchResponse, DataPublicPluginStart } from '../../../src/plugins/data/public';
import { AppMountContext, CoreStart } from '../../../src/core/public';
import { KibanaLegacySetup, KibanaLegacyStart } from '../../../src/plugins/kibana_legacy/public';
import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DocketPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DocketPluginStart {}

export interface DocketPluginSetupDeps {
  kibanaLegacy: KibanaLegacySetup;
}
export interface DocketPluginStartDeps {
  data: DataPublicPluginStart;
  navigation: NavigationPublicPluginStart;
  notifications: CoreStart['notifications'];
  searchState?: SearchStateProps;
  kibanaLegacy: KibanaLegacyStart;
}
export interface DocketPluginProps {
  data: DataPublicPluginStart;
  navigation: NavigationPublicPluginStart;
  notifications: CoreStart['notifications'];
  searchState?: SearchStateProps;
}
export interface PageDef {
  title: string;
  id: string;
  component: React.ReactNode;
}

export interface SearchStateProps<T = unknown> {
  searching: boolean;
  shouldUpdate: boolean;
  error: Error | undefined;
  response: IEsSearchResponse<T>;
}

export interface StenoHosts {
  stenographer: {
    host: string;
    port: number;
  };
}

export interface StenoQueries {
  timestamp: Date;
  stenographer: {
    host: string;
    id: string;
  };
  request: {
    query: string;
    start: string;
    end: string;
    id: string;
  };
  response: {
    status: any;
    bytes: number;
  };
}

export type NavProps = RouteComponentProps & {
  navigateToApp: AppMountContext['core']['application']['navigateToApp'];
  pages: PageDef[];
};

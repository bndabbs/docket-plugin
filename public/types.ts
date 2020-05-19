import { DataPublicPluginStart, IEsSearchResponse } from 'src/plugins/data/public';
import { CoreStart, AppMountContext, AppMountParameters, CoreSetup } from 'kibana/public';
import { RouteComponentProps } from 'react-router-dom';

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

export interface DocketProps {
  application: CoreStart['application'];
  basename: AppMountParameters['appBasePath'];
  data: DataPublicPluginStart;
  notifications: CoreSetup['notifications'];
  searchState?: SearchStateProps;
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

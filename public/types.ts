import { CoreStart } from 'kibana/public';
import { DataPublicPluginStart } from '../../../src/plugins/data/public';

export interface AppPluginStartDependencies {
  data: DataPublicPluginStart;
}

export interface SearchBarComponentParams {
  application: CoreStart['application'];
  basename: string;
  data: DataPublicPluginStart;
}

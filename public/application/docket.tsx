import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { EuiPage } from '@elastic/eui';
import { AppMountParameters, CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';
import { ConfigPage, HomePage, Page, QueryPage, ResultsPage } from './pages';
import { DocketPluginProps, PageDef, SearchStateProps, StenoHosts, StenoQueries } from '../types';
import { Nav, search } from './components';
import { DataPublicPluginStart } from '../../../../src/plugins/data/public';

interface DocketAppDeps {
  application: CoreStart['application'];
  basename: string;
  notifications: CoreStart['notifications'];
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
}

const buildPage = (page: PageDef) => <Page title={page.title}>{page.component}</Page>;

export const DocketApp = ({
  application,
  basename,
  notifications,
  navigation,
  data,
}: DocketAppDeps) => {
  const [stenoHostsState, setStenoHostsState] = useState<SearchStateProps<StenoHosts> | any>({
    searching: true,
    shouldUpdate: true,
    error: undefined,
    response: undefined,
  });

  const [stenoResultsState, setStenoResultsState] = useState<SearchStateProps<StenoQueries> | any>({
    searching: true,
    shouldUpdate: true,
    error: undefined,
    response: undefined,
  });

  function request(index: string) {
    return {
      debug: true,
      params: {
        index,
        body: {
          query: {
            query_string: {
              query: '*',
            },
          },
        },
      },
    };
  }

  useEffect(() => {
    if (stenoHostsState.shouldUpdate) {
      search({
        ...{ ...data },
        request: request('.docket-config'),
        setSearchState: setStenoHostsState,
      });
    }
  }, [stenoHostsState.shouldUpdate, data]);

  useEffect(() => {
    if (stenoResultsState.shouldUpdate) {
      search({
        ...{ ...data },
        request: request('.docket'),
        setSearchState: setStenoResultsState,
      });
    }
  }, [stenoResultsState.shouldUpdate, data]);

  const pages: PageDef[] = [
    {
      id: 'home',
      title: 'About',
      component: <HomePage />,
    },
    {
      title: 'Query Builder',
      id: 'query',
      component: <QueryPage {...{ data, notifications, navigation }} />,
    },
    {
      title: 'Results Explorer',
      id: 'results',
      component: <ResultsPage {...{ data, notifications, navigation }} />,
    },
    {
      title: 'Configuration',
      id: 'config',
      component: <ConfigPage {...{ data, notifications, navigation }} />,
    },
  ];

  const routes = pages.map((page, i) => (
    <Route key={i} path={`/${page.id}`} render={() => buildPage(page)} />
  ));

  return (
    <Router basename={basename}>
      <navigation.ui.TopNavMenu appName="docket" showSearchBar={false} />
      <EuiPage>
        <Nav navigateToApp={application.navigateToApp} pages={pages} />
        <Route path="/" exact component={HomePage} />
        {routes}
      </EuiPage>
    </Router>
  );
};

export const renderApp = (
  { application, notifications }: CoreStart,
  { navigation, data }: DocketPluginProps,
  { appBasePath, element }: AppMountParameters
) => {
  ReactDOM.render(
    <DocketApp
      application={application}
      basename={appBasePath}
      notifications={notifications}
      navigation={navigation}
      data={data}
    />,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};

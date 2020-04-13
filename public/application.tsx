import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { AppPluginStartDependencies, SearchBarComponentParams } from './types';
import {
  BrowserRouter as Router,
  Route,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';

import {
  EuiPage,
  EuiSideNav,
  EuiPageSideBar,
} from '@elastic/eui';

import { Page } from './pages/page'
import { DocumentationPage } from './pages/documentation';
import { QueryPage } from './pages/query';
import { ConfigPage } from './pages/config';
import { ResultsPage } from './pages/results'

const Home = () => <DocumentationPage />;

interface PageDef {
  title: string;
  id: string;
  component: React.ReactNode;
}

type NavProps = RouteComponentProps & {
  navigateToApp: CoreStart['application']['navigateToApp'];
  pages: PageDef[];
};

const Nav = withRouter(({ history, pages }: NavProps) => {
  const navItems = pages.map(page => ({
    id: page.id,
    name: page.title,
    onClick: () => history.push(`/${page.id}`),
    'data-test-subj': page.id,
  }));

  return (
    <EuiSideNav
      items={[
        {
          name: 'Docket',
          id: 'home',
          items: [...navItems],
        },
      ]}
    />
  );
});

const buildPage = (page: PageDef) => <Page title={page.title}>{page.component}</Page>;

export const DocketApp = ({ basename, data, application }: SearchBarComponentParams ) => {
  const pages: PageDef[] = [
    {
      id: 'home',
      title: 'About',
      component: <Home />,
    },
    {
      title: 'Query Builder',
      id: 'query',
      component: <QueryPage />,
    },
    {
      title: 'Results Explorer',
      id: 'results',
      component: <ResultsPage search={data.search.search} />,
    },
    {
      title: 'Configuration',
      id: 'config',
      component: <ConfigPage search={data.search.search} />
    },
  ];

  const routes = pages.map((page, i) => (
    <Route key={i} path={`/${page.id}`} render={() => buildPage(page)} />
  ));

  return (
    <Router basename={basename}>
          <EuiPage>
            <EuiPageSideBar>
              <Nav navigateToApp={application.navigateToApp} pages={pages} />
            </EuiPageSideBar>
            <Route path="/" exact component={Home} />
            {routes}
          </EuiPage>
    </Router>
  );
};


export const renderApp = (
  coreStart: CoreStart,
  deps: AppPluginStartDependencies,
  { appBasePath, element }: AppMountParameters
) => {
  ReactDOM.render(
    <DocketApp
      basename={appBasePath}
      data={deps.data}
      application={coreStart.application}
    />,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CoreStart } from 'src/core/public';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { EuiPage } from '@elastic/eui';
import { ConfigPage, DocumentationPage, Page, QueryPage, ResultsPage } from './pages';
import { DocketProps, PageDef, SearchStateProps, StenoHosts, StenoQueries } from '../types';
import { Nav, search } from './components';

const Home = () => <DocumentationPage />;

const buildPage = (page: PageDef) => <Page title={page.title}>{page.component}</Page>;

export const DocketApp = ({ ...props }: DocketProps) => {
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
        ...{ ...props.data },
        request: request('.docket-config'),
        setSearchState: setStenoHostsState,
      });
    }
  }, [stenoHostsState.shouldUpdate, props.data]);

  useEffect(() => {
    if (stenoResultsState.shouldUpdate) {
      search({
        ...{ ...props.data },
        request: request('.docket'),
        setSearchState: setStenoResultsState,
      });
    }
  }, [stenoResultsState.shouldUpdate, props.data]);

  const pages: PageDef[] = [
    {
      id: 'home',
      title: 'About',
      component: <Home />,
    },
    {
      title: 'Query Builder',
      id: 'query',
      component: <QueryPage {...{ ...props }} />,
    },
    {
      title: 'Results Explorer',
      id: 'results',
      component: <ResultsPage {...{ ...props }} />,
    },
    {
      title: 'Configuration',
      id: 'config',
      component: <ConfigPage {...{ ...props }} />,
    },
  ];

  const routes = pages.map((page, i) => (
    <Route key={i} path={`/${page.id}`} render={() => buildPage(page)} />
  ));

  return (
    <Router basename={props.basename}>
      <EuiPage>
        <Nav navigateToApp={props.application.navigateToApp} pages={pages} />
        <Route path="/" exact component={Home} />
        {routes}
      </EuiPage>
    </Router>
  );
};

export const renderApp = (i18nStart: CoreStart['i18n'], props: DocketProps, element: Element) => {
  ReactDOM.render(
    <i18nStart.Context>
      <DocketApp {...props} />
    </i18nStart.Context>,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};

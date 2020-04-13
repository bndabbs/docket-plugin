import React, { Component, Fragment } from 'react';
import { ResultsTable } from '../components/resultsTable'
import { IEsSearchRequest, IEsSearchResponse } from '../../../../src/plugins/data/common/search/es_search';
import { ISearchGeneric } from '../../../../src/plugins/data/public/search';

interface ResultsProps {
  search: ISearchGeneric;
}

interface ResultsState {
  query: string;
  results?: IEsSearchResponse;
  index: string;
  request: IEsSearchRequest;
  strategy?: string;
  error?: any;
}

export class ResultsPage extends Component<ResultsProps, ResultsState> {
  constructor(props: ResultsProps) {
    super(props);

    this.state = {
      query: '*',
      index: '*',
      request: this.getRequest({ index: '*', query: '*' }),
    };
  }

  getRequest({ index, query }: { index: string; query: string }): IEsSearchRequest {
    return {
      debug: true,
      params: {
        index,
        body: {
          query: {
            query_string: {
              query,
            },
          },
        },
      },
    };
  }

  renderContent() {
    const request: IEsSearchRequest = this.getRequest({ index: 'docket*', query: '*' });
    return (
      <Fragment>
        <ResultsTable
          request={request}
          search={(signal: AbortSignal) => this.props.search(request, { signal })}
        />
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderContent()}
      </Fragment>
    );
  }
}

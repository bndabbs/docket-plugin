import React, { Component, Fragment } from 'react';
import { EuiButtonIcon, EuiFlexItem, EuiInMemoryTable, EuiLink, formatDate } from '@elastic/eui';
import {
  IKibanaSearchRequest, IKibanaSearchResponse,
} from '../../../../src/plugins/data/public/search';
import { Observable } from 'rxjs';

interface Props {
  request: IKibanaSearchRequest;
  strategy?: string;
  search: (signal: AbortSignal) => Observable<IKibanaSearchResponse>;
}

interface State {
  searching: boolean;
  response?: IKibanaSearchResponse;
  error?: any;
  hits: [];
}

export class ResultsTable extends Component<Props, State> {
  private abortController?: AbortController;

  constructor(props: Props) {
    super(props);

    this.state = {
      searching: false,
      response: undefined,
      error: undefined,
      hits: [],
    };

    this.search();
  }

  search = async () => {
    if (this.state.searching && this.abortController) {
      this.abortController.abort();
    }

    this.setState({
      searching: true,
      response: undefined,
      error: undefined,
      hits: [],
    });


    let hits = [];

    this.abortController = new AbortController();

    this.props.search(this.abortController.signal).subscribe(
      response => {
        response.rawResponse.hits.hits.forEach(function(hit) {
          hits.push(hit)
        })

        this.setState({
          response,
          hits: hits,
          error: undefined
        });

      },
      error => {
        this.setState({ error, searching: false, response: undefined });
      },
      () => {
        this.setState({ searching: false, error: undefined });
      }
    );
  };

  cancel = () => {
    if (this.abortController) {
      this.abortController.abort();
    }
  };


  async download(id: string) {
    const pathPrefix = window.location.pathname.replace(/app.*/, '');

    await fetch(
      window.location.origin + pathPrefix + 'api/docket/download/' + id, {
        method: 'GET',
        headers: {
          'kbn-xsrf': 'docket',
        },
      })
      .then(response => response.blob())
      .then(blob => {
        let link = document.createElement('a');
        link.download = id + '.pcap';
        link.href = URL.createObjectURL(blob);

        link.click();

        URL.revokeObjectURL(link.href);

        //return window.location.href = url
        });
  };

  formatBytes(bytes:number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  render() {
    const actions = [
      {
        render: (item: any) =>  {
          return (
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                iconType='importAction'
                aria-label="Download"
                onClick={() => this.download(item._id)}
              />
            </EuiFlexItem>
          );
        }, // TODO add delete action to remove from disk and add delete bool to es record
      },
    ];

    const columns = [
      {
        field: '_source.@timestamp',
        name: 'Timestamp',
        dataType: 'date',
        render: dateTime => formatDate(dateTime),
        sortable: true,
      },
      {
        field: '_source.response.bytes',
        name: 'Response Bytes',
        dataType: 'number',
        render: bytes => this.formatBytes(bytes),
      },
      {
        field: '_source.request.query',
        name: 'Query',
        truncateText: false,
        width: '40%',
      },
      {
        field: '_source.stenographer.host',
        name: 'Stenographer Host',
        sortable: true,
        truncateText: true,
      },
      {
        name: 'Actions',
        actions
      },
    ];
    // TODO fix search bar and pagination
    // const search = {
    //   box: {
    //     incremental: true,
    //     schema: true,
    //   },
    // };

    return (
      <Fragment>
        <EuiInMemoryTable
          items={this.state.hits}
          loading={this.state.searching}
          error={this.state.error}
          columns={columns}
          //search={search}
          pagination={false}
          sorting={false}
        />
      </Fragment>
    );
  }
}

import React, { Component, Fragment } from 'react';
import {
  EuiButtonIcon,
  EuiFlexItem,
  EuiInMemoryTable,
  EuiEmptyPrompt,
  EuiGlobalToastList
} from '@elastic/eui';
import {
  IKibanaSearchRequest,
  IKibanaSearchResponse,
} from '../../../../src/plugins/data/public/search';
import { Observable } from 'rxjs';
import { addToast, removeToast } from '../components/toasts'

interface Props {
  request: IKibanaSearchRequest;
  strategy?: string;
  search: (signal: AbortSignal) => Observable<IKibanaSearchResponse>;
}

interface State {
  searching: boolean;
  response?: IKibanaSearchResponse;
  error?: any;
  hits: any[];
  message: any;
  toasts: any[];
}

export class HostsTable extends Component<Props, State> {
  private abortController?: AbortController;

  constructor(props: Props) {
    super(props);

    this.state = {
      searching: false,
      response: undefined,
      error: undefined,
      hits: [],
      toasts: [],
      message: (
        <EuiEmptyPrompt
          iconType="minusInCircleFilled"
          title={<h2>No hosts</h2>}
          body={
            <Fragment>
              <p>
                It looks like you haven't added any stenographer hosts yet.
              </p>
              <p>Click the button above to add your first host!</p>
            </Fragment>
          }
        />
      )
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


    let hits:any[] = [];
    let message;

    this.abortController = new AbortController();

    this.props.search(this.abortController.signal).subscribe(
      response => {
        response.rawResponse.hits.hits.forEach(function(hit:any) {
          hits.push(hit)
        })

        if (hits.length > 0) {
          message = undefined
        } else message = this.state.message

        this.setState({
          response,
          hits: hits,
          error: undefined,
          message: message
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

  delete(id: string) {
    const pathPrefix = window.location.pathname.replace(/app.*/, '');
    fetch(
      window.location.origin + pathPrefix + 'api/docket/host/' + id, {
        method: 'DELETE',
        headers: {
          'kbn-xsrf': 'docket',
        },
      }).then(response => {
        return response.json()
      },err => {
      if (err) {
        this.setState({
          toasts: addToast(this.state.toasts, err.error, 'danger', err.message, 'alert')
        });
      }
    }).then(() => {
      this.setState({
        toasts: addToast(this.state.toasts, 'Success','success', 'Successfully removed host','check')
      });
    })
    .catch( err => console.error(err));

    this.search();
  };

  render() {
    const actions = [
      {
        render: (item: any) =>  {
          return (
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                iconType='trash'
                aria-label="Delete"
                onClick={() => this.delete(item._id)}
              />
            </EuiFlexItem>
          );
        },
      },
    ];

    const columns = [
      {
        field: '_id',
        name: 'Stenographer Host',
        sortable: true,
        truncateText: false,
        render: (id:string) => {
          function getDocById(hits:any) { 
            return hits._id === id;
          }
          const doc = this.state.hits.find(getDocById) 
          return `${doc._source.stenographer.host}:${doc._source.stenographer.port}`
        }
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
        <EuiGlobalToastList
          toasts={this.state.toasts}
          dismissToast={id => this.setState({
            toasts: removeToast(this.state.toasts, (id))
          })}
          toastLifeTimeMs={6000}
        />
        <EuiInMemoryTable
          items={this.state.hits}
          message={this.state.message}
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

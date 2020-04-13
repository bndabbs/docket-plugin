import React, { Component, Fragment } from 'react';

import { HostsTable } from '../components/hostsTable';
import { addToast, removeToast } from '../components/toasts'


import { IEsSearchRequest, IEsSearchResponse } from '../../../../src/plugins/data/common/search/es_search';
import { ISearchGeneric } from '../../../../src/plugins/data/public/search';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiForm,
  EuiFormControlLayoutDelimited,
  EuiFormLabel,
  EuiFormRow,
  EuiFilePicker,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
} from '@elastic/eui';
import { EuiFieldPassword } from '@elastic/eui';

interface ConfigProps {
  search: ISearchGeneric;
}

interface ConfigState {
  query: string;
  results?: IEsSearchResponse;
  index: string;
  request: IEsSearchRequest;
  strategy?: string;
  error?: any;
  toasts: any[];
  isFlyoutVisible: boolean;
  submitColor: any;
  submitLabel: string;
  submitLoading: boolean;
  host: string;
  port: number;
  certsList: FileList | undefined;
  cert_password?: string;
}

export class ConfigPage extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      query: '*',
      index: '*',
      request: this.getRequest({ index: '*', query: '*' }),
      isFlyoutVisible: false,
      toasts: [],
      submitColor: 'primary',
      submitLabel: 'Submit',
      submitLoading: false,
      host: 'localhost',
      port: 5000,
      certsList: undefined,
      cert_password: '',
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

  renderTable() {
    const request: IEsSearchRequest = this.getRequest({ index: '.docket-config', query: '*' });
    return (
      <Fragment>
        <HostsTable
          request={request}
          search={(signal: AbortSignal) => this.props.search(request, { signal })}
        />
      </Fragment>
    );
  }

  handleSave = async () => {
    // let hostForm = document.getElementById('hostForm');
    const formData = new FormData();
    const pathPrefix = window.location.pathname.replace(/app.*/, '');

    formData.append('host', this.state.host);
    formData.append('port', this.state.port.toString());
    formData.append('cert_bundle', this.state.certsList[0]);
    formData.append('cert_password', this.state.cert_password);

    console.log(formData.get('cert_bundle'));

    this.setSubmitButton('loading');

    await fetch(
      window.location.origin + pathPrefix + 'api/docket/host', {
        method: 'POST',
        body: formData,
        headers: {
          'kbn-xsrf': 'docket',
        },
      })
      .then(response => {
        this.setSubmitButton('reset')
        this.setState({
          isFlyoutVisible: false
        })

        if (response.status === 500) {
          throw { error: 'Internal server error', message: 'Check server logs for more information' };
        } else if (response.status !== 200) {
          throw { error: `Received HTTP ${response.status}`, message: 'Check server logs for more information' };
        } else return response;

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
          toasts: addToast(this.state.toasts, 'Success','success', 'Successfully added host','check')
        });
      })
      .catch( err => console.error(err));
    };

    setSubmitButton = (state:string) => {
      if (state === 'loading') {
        this.setState({
          submitLabel: 'Requesting...',
          submitLoading: true,
        })
      } if (state === 'error') {
        this.setState({
          submitColor: 'danger',
          submitLabel: 'Submit',
          submitLoading: false,
        })
      } if (state === 'reset') {
        this.setState({
          submitColor: 'primary',
          submitLabel: 'Submit',
          submitLoading: false,
        })
      }
    }

    onHostChange = (event: { target: { value: string; }; })  => {
      this.setState({
        host: event.target.value
      });
    };

    onPortChange = (event: { target: { value: string; }; })  => {
      const port = Number(event.target.value)
      this.setState({
        port: port
      });
    };

    onCertChange = (files: FileList| null )  => {
      const certs = (files)
      this.setState({
        certsList: certs
      });
    };

    onPasswordChange = (event: { target: { value: string; }; })  => {
      this.setState({
        cert_password: event.target.value
      });
    };

  renderFlyout() {
    let flyout;

    if (this.state.isFlyoutVisible) {
      flyout = (
        <EuiFlyout
          onClose={() => this.setState({
            isFlyoutVisible: false
          })}
          aria-labelledby='Add Stenographer Host'
          size='s'
          maxWidth={true}
          hideCloseButton={false}>
          <EuiFlyoutHeader hasBorder>
            <EuiTitle size='s'>
              <h2 id="hostFlyout">Add Stenographer Host</h2>
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <EuiForm id='hostForm' component='form'>
              <EuiFormRow
                helpText="Hostname or IP and Port">
                <EuiFormControlLayoutDelimited
                  prepend={<EuiFormLabel>Host: </EuiFormLabel>}
                  startControl={
                    <input
                      onChange={this.onHostChange}
                      type='text'
                      placeholder='localhost'
                      className="euiFieldText"
                      aria-label='Stenographer host'
                    />
                  }
                  delimiter=':'
                  endControl={
                    <input
                      onChange={this.onPortChange}
                      type='number'
                      placeholder='5000'
                      className="euiFieldNumber"
                      aria-label='Stenographer port'
                    />
                  }
                />
              </EuiFormRow>

              <EuiFormRow label="Certificate bundle">
                <EuiFilePicker
                  onChange={this.onCertChange}
                />
              </EuiFormRow>

              <EuiFormRow label="Certificate Password (optional)">
                <EuiFieldPassword
                  onChange={this.onPasswordChange}
                />
              </EuiFormRow>

            </EuiForm>
          </EuiFlyoutBody>
          <EuiFlyoutFooter>
            <EuiFlexGroup justifyContent="spaceBetween">
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty
                  iconType="cross"
                  onClick={() => this.setState({
                    isFlyoutVisible: false
                  })}
                  flush="left">
                  Cancel
                </EuiButtonEmpty>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton
                 onClick={this.handleSave}
                 color={this.state.submitColor}
                 isLoading={this.state.submitLoading}
                >
                 { this.state.submitLabel }
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlyoutFooter>
          </EuiFlyout>
      );
    }

    return (
      <div>
        <EuiButton onClick={() => this.setState({
          isFlyoutVisible: true
        })}>
          Add Stenographer Host
        </EuiButton>
        {flyout}
      </div>
    );
  };

  render() {
    return (
      <Fragment>
        {this.renderFlyout()}
        {this.renderTable()}
      </Fragment>
    );
  }
}

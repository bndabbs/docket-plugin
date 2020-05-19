import React, { Fragment, useState, useEffect } from 'react';
import {
  EuiButtonIcon,
  EuiFlexItem,
  EuiBasicTable,
  EuiEmptyPrompt,
  EuiForm,
  EuiFormRow,
  EuiFormControlLayoutDelimited,
  EuiFormLabel,
  EuiFilePicker,
  EuiFieldPassword,
  EuiFlyoutFooter,
  EuiFlexGroup,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiTitle,
  EuiButtonEmpty,
  EuiFlyoutBody,
} from '@elastic/eui';
import _ from 'lodash';
import { ButtonColor, EuiButton } from '@elastic/eui';
import { search } from '../components';
import { DocketProps, SearchStateProps, StenoHosts } from '../../types';

interface HostsList {
  _id: string;
  hostname: string;
}

interface Form {
  host: string;
  port: string;
  certs?: FileList;
  certIsValid: boolean;
  certPassword: string;
}

interface FormButton {
  color: ButtonColor;
  label: string;
  loading: boolean;
}

export const ConfigPage = (props: DocketProps) => {
  const [stenoHosts, setStenoHosts] = useState<HostsList[]>([]);
  const [message, setMessage] = useState<JSX.Element | undefined>();
  const [formValues, setFormValues] = useState<Form>({
    host: '',
    port: '',
    certs: undefined,
    certIsValid: true,
    certPassword: '',
  });
  const [submitButton, setSubmitButton] = useState<FormButton>({
    color: 'primary',
    label: 'Submit',
    loading: false,
  });
  const [flyoutVisible, setFlyoutVisible] = useState(false);
  const [stenoHostsState, setStenoHostsState] = useState<SearchStateProps<StenoHosts> | any>({
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
    search({
      ...{ ...props.data },
      request: request('.docket-config'),
      setSearchState: setStenoHostsState,
    });
  }, [stenoHostsState.shouldUpdate, props.data]);

  useEffect(() => {
    const emptyMessage = (
      <EuiEmptyPrompt
        iconType="minusInCircleFilled"
        title={<h2>No hosts</h2>}
        body={
          <Fragment>
            <p>It looks like you haven&apos;t added any stenographer hosts yet.</p>
            <p>Click the button above to add your first host!</p>
          </Fragment>
        }
      />
    );

    const hosts: HostsList[] = [];

    if (!stenoHostsState.error && stenoHostsState.response) {
      if (stenoHostsState.response.rawResponse.hits.total > 0)
        stenoHostsState.response.rawResponse.hits.hits.map(hit => {
          hosts.push({
            _id: hit._id,
            hostname: `${hit._source.stenographer.host}:${hit._source.stenographer.port}`,
          });
        });
    }
    setStenoHosts(hosts);

    if (hosts.length === 0) {
      setMessage(emptyMessage);
    }
  }, [stenoHostsState]);

  const updateSubmitButton = (button: string) => {
    switch (button) {
      case 'saving':
        setSubmitButton(prevState => {
          return { ...prevState, label: 'Saving...', loading: true };
        });
        break;
      case 'error':
        setSubmitButton({ color: 'danger', label: 'Submit', loading: false });
        break;
      case 'reset':
        setSubmitButton({ color: 'primary', label: 'Submit', loading: false });
        break;
    }
  };

  const handleHostButton = () => {
    setFlyoutVisible(true);
  };

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    if (e.target.value) {
      setFormValues({ ...formValues, [id]: value });
    }
  }

  const handleSave = async () => {
    if (!formValues.certs) {
      setFormValues(prevState => {
        return { ...prevState, certIsValid: false };
      });
    } else {
      const formData = new FormData();
      const pathPrefix = window.location.pathname.replace(/app.*/, '');

      formData.append('host', formValues.host);
      formData.append('port', formValues.port.toString());
      formData.append('cert_bundle', formValues.certs[0]);
      formData.append('cert_password', formValues.certPassword);

      updateSubmitButton('saving');

      await fetch(window.location.origin + pathPrefix + 'api/docket/host', {
        method: 'POST',
        body: formData,
        headers: {
          'kbn-xsrf': 'docket',
        },
      })
        .then(response => {
          updateSubmitButton('reset');
          setFlyoutVisible(false);
          if (response.status === 500) {
            throw new Error('Internal server error');
          } else if (response.status !== 200) {
            throw new Error(`Received HTTP ${response.status}`);
          } else return response;
        })
        .then(
          response => {
            return response.json();
          },
          err => {
            if (err) {
              props.notifications.toasts.addError(err, { title: 'Something went wrong!' });
            }
          }
        )
        .finally(() => {
          setStenoHostsState((prevState: SearchStateProps<StenoHosts>) => {
            return { ...prevState, shouldUpdate: true };
          });
          props.notifications.toasts.addSuccess('Successfully added host');
        });
    }
  };

  const deleteHost = (id: string) => {
    const pathPrefix = window.location.pathname.replace(/app.*/, '');
    fetch(window.location.origin + pathPrefix + 'api/docket/host/' + id, {
      method: 'DELETE',
      headers: {
        'kbn-xsrf': 'docket',
      },
    })
      .then(
        response => {
          return response.json();
        },
        err => {
          if (err) {
            props.notifications.toasts.addError(err, { title: 'Something went wrong!' });
          }
        }
      )
      .then(() => {
        props.notifications.toasts.addSuccess('Successfully removed host');
        setStenoHostsState((prevState: SearchStateProps<StenoHosts>) => {
          return { ...prevState, shouldUpdate: true };
        });
      });
  };

  const actions = [
    {
      render: (item: any) => {
        return (
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="trash"
              aria-label="Delete"
              onClick={() => deleteHost(item._id)}
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
      render: (id: string) => {
        if (stenoHosts) {
          const host = stenoHosts.find(({ _id }) => _id === id);
          return host?.hostname;
        }
      },
    },
    {
      name: 'Actions',
      actions,
    },
  ];

  return (
    <Fragment>
      <EuiButton onClick={() => handleHostButton()}>Add Host</EuiButton>
      <EuiBasicTable
        items={stenoHosts}
        noItemsMessage={message}
        loading={stenoHostsState.searching}
        columns={columns}
      />
      {flyoutVisible && (
        <>
          <EuiFlyout
            onClose={() => setFlyoutVisible(false)}
            aria-labelledby="Add Stenographer Host"
            size="s"
            maxWidth={true}
            hideCloseButton={false}
          >
            <EuiFlyoutHeader hasBorder>
              <EuiTitle size="s">
                <h2 id="hostFlyout">Add Stenographer Host</h2>
              </EuiTitle>
            </EuiFlyoutHeader>
            <EuiFlyoutBody>
              <EuiForm id="hostForm">
                <EuiFormRow helpText="Hostname or IP and Port">
                  <EuiFormControlLayoutDelimited
                    prepend={<EuiFormLabel>Host: </EuiFormLabel>}
                    startControl={
                      <input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleFormChange(e);
                        }}
                        id="host"
                        type="text"
                        className="euiFieldText"
                        aria-label="Stenographer host"
                      />
                    }
                    delimiter=":"
                    endControl={
                      <input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleFormChange(e);
                        }}
                        id="port"
                        type="number"
                        className="euiFieldNumber"
                        aria-label="Stenographer port"
                      />
                    }
                  />
                </EuiFormRow>
                <EuiFormRow label="Certificate bundle">
                  <EuiFilePicker
                    isInvalid={!formValues.certIsValid}
                    onChange={(files: FileList | null) => {
                      if (files && files?.length > 0) {
                        setFormValues(prevState => {
                          return { ...prevState, certs: files, certIsValid: true };
                        });
                      }
                    }}
                    required={true}
                  />
                </EuiFormRow>
                <EuiFormRow label="Certificate Password (optional)">
                  <EuiFieldPassword
                    id="certPassword"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleFormChange(e);
                    }}
                  />
                </EuiFormRow>
              </EuiForm>
            </EuiFlyoutBody>
            <EuiFlyoutFooter>
              <EuiFlexGroup justifyContent="spaceBetween">
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty
                    iconType="cross"
                    onClick={() => setFlyoutVisible(false)}
                    flush="left"
                  >
                    Cancel
                  </EuiButtonEmpty>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton
                    onClick={handleSave}
                    color={submitButton.color}
                    isLoading={submitButton.loading}
                  >
                    {submitButton.label}
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlyoutFooter>
          </EuiFlyout>
        </>
      )}
    </Fragment>
  );
};

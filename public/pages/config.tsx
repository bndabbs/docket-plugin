import React, { Component, Fragment } from 'react';

import { EuiDescribedFormGroup, EuiFieldText, EuiForm, EuiFormRow } from '@elastic/eui';

//TODO connect to Kibana keystore
//TODO Store config values in .docket index

interface ConfigProps {
}

interface ConfigState {
}

export class ConfigPage extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      pcapPath: '/var/spool/docket',
    };
  }

render() {

    return (
      <EuiForm>
        <EuiDescribedFormGroup
          title={<h3>Single text field</h3>}
          description={
            <Fragment>
              A single text field that can be used to display additional text.
              or any other type of content.
            </Fragment>
          }>
          <EuiFormRow label="Text field">
            <EuiFieldText name="first" aria-label="Example" />
          </EuiFormRow>
        </EuiDescribedFormGroup>

        <EuiDescribedFormGroup title={<h3>No description</h3>}>
          <EuiFormRow label="Text field">
            <EuiFieldText name="first" />
          </EuiFormRow>
        </EuiDescribedFormGroup>
      </EuiForm>
    );
  }
}

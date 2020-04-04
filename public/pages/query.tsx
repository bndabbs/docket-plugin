import React, { Component, Fragment } from 'react';
import {
  EuiButton,
  EuiFieldSearch,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiSwitch,
  EuiSuperDatePicker,
  EuiSuperDatePickerRecentRange, EuiGlobalToastList, EuiFlexGroup, EuiFlexItem,
} from '@elastic/eui';

import dateMath from '@elastic/datemath';
import { v4 as uuidv4 } from 'uuid';

interface QueryProps {
}

interface QueryState {
  stenoValue: string;
  invalidSteno: boolean;
  recentlyUsedRanges: EuiSuperDatePickerRecentRange[];
  showUpdateButton: boolean;
  isAutoRefreshOnly: boolean;
  timeDisabled: boolean;
  start: string;
  end: string;
  timeFilter: string;
  query: string;
  request: string;
  toasts: [];
  submitColor: any;
  submitLabel: string;
  submitLoading: boolean;
}

export class QueryPage extends Component<QueryProps, QueryState> {
  constructor(props: QueryProps) {
    super(props);
    this.state = {
      stenoValue: '',
      invalidSteno: false,
      recentlyUsedRanges: [],
      showUpdateButton: false,
      isAutoRefreshOnly: false,
      timeDisabled: false,
      start: 'now-30m',
      end: 'now',
      timeFilter: '',
      query: '*',
      request: '',
      toasts: [],
      submitColor: 'primary',
      submitLabel: 'Submit',
      submitLoading: false,
     };
   }

  isValidSteno = (value: string) => {
    let re = /^(tcp|udp|icmp|net|host|port|ip proto)+( |\d|\(|\)|\.|\/|\||&|and|or|mask|tcp|udp|icmp|net|host|port|ip proto)*?$/;
    if (value === '') {
      return true;
    } else {
      return value.match(re) !== null;
    }
  };

  onTimeChange = ({ start, end }: { start: string; end: string }) => {
   this.setState(prevState => {
     const recentlyUsedRanges = prevState.recentlyUsedRanges.filter(
       recentlyUsedRange => {
        const isDuplicate =
         recentlyUsedRange.start === start && recentlyUsedRange.end === end;
       return !isDuplicate;
     });
     recentlyUsedRanges.unshift({ start, end });
     return {
       start,
       end,
       recentlyUsedRanges:
         recentlyUsedRanges.length > 10
           ? recentlyUsedRanges.slice(0, 9)
           : recentlyUsedRanges,
     };
   });
     this.setState({
       start: start,
       end: end,
     } );
  };

  toggleTimeDisabled = () => {
    this.setState(prevState => ({
      timeDisabled: !prevState.timeDisabled,
    }));
  };

  onStenoChange = (event: { target: { value: string; }; })  => {
    this.setState({
      stenoValue: event.target.value,
    });
    if (!this.isValidSteno(event.target.value)) {

      this.setState({
        invalidSteno: true,
      });

      this.setSubmitButton('error')

    } else {

      this.setState({
        invalidSteno: false,
      });

      this.setSubmitButton('reset')
    }
  };

  addToast = (title:string, color:string, text:string | JSX.Element, icon:string) => {
    const toast = {
      title: title,
      color: color,
      text: text,
      iconType: icon,
      id: uuidv4(),
    };

    this.setState({
      toasts: this.state.toasts.concat(toast),
    });
  };

  removeToast = (removedToast: { id: any; }) => {
    // @ts-ignore
    this.setState(prevState => ({
      toasts: prevState.toasts.filter(toast => toast.id !== removedToast.id),
    }));
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
      });
  };

  timeFilter () {
    function formatDate(time:string, prefix:string) {
      let epochTime = dateMath.parse(time);
      let isoTime = epochTime?.toISOString();
      return prefix + ' ' + isoTime + ' ';
    }

    if (!this.state.timeDisabled) {
      let start = formatDate(this.state.start, 'after');
      let end = formatDate(this.state.end, 'and before');
      return start + end + 'and ';
    } else { return '' }
  }


  handleSubmit = async () => {
    if (this.state.invalidSteno) {
      return this.addToast('Invalid query', 'danger', 'Your Stenographer query is invalid', 'alert')
    } else {
      const pathPrefix = window.location.pathname.replace(/app.*/, '');
      const request = this.timeFilter() + this.state.stenoValue;
      const timestamp = new Date().toISOString();
      const body = JSON.stringify({
        timestamp: timestamp,
        query: request,
        start: this.state.start,
        end: this.state.end
      })
      this.setSubmitButton('loading');

      await fetch(
        window.location.origin + pathPrefix + 'api/docket/query', {
          method: 'POST',
          body: body,
          headers: {
            'kbn-xsrf': 'docket',
            'Content-Type': 'application/json'
          },
        })
        .then(response => {
          this.setSubmitButton('reset')

          if (response.status === 204) {
            throw { error: 'Empty Result', message: 'Stenographer couldn\'t find any packets matching your request' };
          } else if (response.status === 500) {
            throw { error: 'Internal server error', message: 'Check server logs for more information' };
          } else if (response.status !== 200) {
            throw { error: `Received HTTP ${response.status}`, message: 'Check server logs for more information' };
          } else return response;

        }).then(response => {
            return response.json()
          },err => {
          if (err.error === 'Empty result') {
            this.addToast(err.error, 'warning', err.message, 'bell')
          } else {
            this.addToast(err.error, 'danger', err.message, 'alert')
          }
        }).then( json => {
          let successText =
            <EuiFlexGroup justifyContent="flexEnd" gutterSize="s">
              <EuiFlexItem grow={false}>
                <EuiButton
                  size="s"
                  onClick={() => this.download(json.uid)}>
                  Download PCAP</EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>

          this.addToast('Success','success', successText,'check')
        })
        .catch( err => console.error(err));
      }
    };

   render() {
     return (
       <div>
       <Fragment>
         <EuiGlobalToastList
           toasts={this.state.toasts}
           dismissToast={this.removeToast}
           toastLifeTimeMs={6000}
         />
       </Fragment>
       <EuiForm>
         <EuiFormRow label="Stenographer">
             <EuiFieldSearch
               placeholder="Stenographer Query"
               value={this.state.stenoValue}
               onChange={this.onStenoChange}
               isInvalid={this.state.invalidSteno}
             />
         </EuiFormRow>

         <EuiFormRow label="Time">
           <Fragment>
             <EuiSuperDatePicker
               start={this.state.start}
               end={this.state.end}
               showUpdateButton={this.state.showUpdateButton}
               onTimeChange={this.onTimeChange}
               recentlyUsedRanges={this.state.recentlyUsedRanges}
               isAutoRefreshOnly={this.state.isAutoRefreshOnly}
               isDisabled={this.state.timeDisabled}
             />

             <EuiSpacer />

             <EuiSwitch
               label="Disable time filter"
               onChange={this.toggleTimeDisabled}
               checked={this.state.timeDisabled}
             />

             <EuiSpacer />
           </Fragment>
         </EuiFormRow>

         <EuiSpacer />

         <EuiButton
           onClick={this.handleSubmit}
           color={this.state.submitColor}
           isLoading={this.state.submitLoading}
         >
           { this.state.submitLabel }
         </EuiButton>
       </EuiForm>
       </div>
     );
   }
  }

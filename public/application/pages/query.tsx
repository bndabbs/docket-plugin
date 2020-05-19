import React, { Fragment, useState, useEffect } from 'react';
import {
  ButtonColor,
  EuiButton,
  EuiComboBox,
  EuiFieldSearch,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiSwitch,
  EuiSuperDatePicker,
} from '@elastic/eui';
import dateMath from '@elastic/datemath';
import lodashCloneDeep from 'lodash.clonedeep';
import { DocketProps, SearchStateProps, StenoHosts } from '../../types';
import { search } from '../components';

interface FormButton {
  color: ButtonColor;
  label: string;
  loading: boolean;
}

export const QueryPage = (props: DocketProps) => {
  const showUpdateButton = false;
  const isAutoRefreshOnly = false;

  const isValidSteno = (value: string) => {
    const re = /^(tcp|udp|icmp|net|host|port|ip proto)+( |\d|\(|\)|\.|\/|\||&|and|or|mask|tcp|udp|icmp|net|host|port|ip proto)*?$/;
    if (value === '') {
      return true;
    } else {
      return value.match(re) !== null;
    }
  };

  const formatDate = (time: string, prefix: string) => {
    const epochTime = dateMath.parse(time);
    const isoTime = epochTime?.toISOString();
    return prefix + ' ' + isoTime + ' ';
  };
  const [stenoValue, setStenoValue] = useState('');
  const [selectedHosts, setSelectedHosts] = useState([]);
  const [recentlyUsedRanges, setRecentlyUsedRanges] = useState<
    Array<{ start: string; end: string }>
  >([]);
  const [timeDisabled, setTimeDisabled] = useState(false);
  const [startTime, setStart] = useState('now-30m');
  const [endTime, setEnd] = useState('now');
  const [dateRange, setDateRange] = useState(
    formatDate(startTime, 'after') + formatDate(endTime, 'and before') + 'and '
  );
  const [submitButton, setSubmitButton] = useState<FormButton>({
    color: 'primary',
    label: 'Submit',
    loading: false,
  });
  const [stenoHosts, setStenoHosts] = useState<Array<{ label: string; id: string }> | undefined>([]);
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
    const hosts: Array<{ label: string; id: string }> = [];

    if (!stenoHostsState.error && stenoHostsState.response) {
      if (stenoHostsState.response.rawResponse.hits.total > 0)
        stenoHostsState.response.rawResponse.hits.hits.map((hit: any) => {
          hosts.push({
            label: `${hit._source.stenographer.host}:${hit._source.stenographer.port}`,
            id: `${hit._id}`,
          });
        });
    }
    setStenoHosts(hosts);
  }, [stenoHostsState]);

  const handleHostsChange = (hosts: []) => {
    if (hosts) {
      setSelectedHosts(hosts);
    }
  };

  const onTimeChange = ({ start, end }: { start: string; end: string }) => {
    const inputRange = { start, end };
    let clonedRanges = lodashCloneDeep(recentlyUsedRanges);

    clonedRanges = clonedRanges.filter(range => {
      const isDuplicate = range.start === start && range.end === end;
      return !isDuplicate;
    });

    clonedRanges = [inputRange, ...clonedRanges];

    setRecentlyUsedRanges(clonedRanges.length > 10 ? clonedRanges.slice(0, 9) : clonedRanges);

    setStart(start);
    setEnd(end);

    if (!timeDisabled) {
      setDateRange(formatDate(start, 'after') + formatDate(end, 'and before') + 'and ');
    } else {
      setDateRange('');
    }
  };

  const onStenoChange = (event: { target: { value: string } }) => {
    setStenoValue(event.target.value);
    if (isValidSteno(event.target.value)) {
      updateSubmitButton('reset');
    } else updateSubmitButton('error');
  };

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

  const handleSubmit = async () => {
    if (!isValidSteno(stenoValue)) {
      return props.notifications.toasts.addDanger('Invalid query');
    } else {
      const pathPrefix = window.location.pathname.replace(/app.*/, '');
      const query = dateRange + stenoValue;
      const timestamp = new Date().toISOString();
      const body = JSON.stringify({
        timestamp,
        hosts: selectedHosts,
        query,
        start: startTime,
        end: endTime,
      });
      updateSubmitButton('loading');

      await fetch(window.location.origin + pathPrefix + 'api/docket/query', {
        method: 'POST',
        body,
        headers: {
          'kbn-xsrf': 'docket',
          'Content-Type': 'application/json',
        },
      })
        .then(_response => {
          updateSubmitButton('reset');
          props.notifications.toasts.addSuccess({ text: 'Request submitted' });
        })
        .catch(err => props.notifications.toasts.addError(err, { title: 'Error' }));
    }
  };

  return (
    <Fragment>
      <EuiForm>
        <EuiFormRow label="Hosts">
          <EuiComboBox
            options={stenoHosts}
            selectedOptions={selectedHosts}
            onChange={handleHostsChange}
            isClearable={true}
            isLoading={props.searchState?.searching}
          />
        </EuiFormRow>
        <EuiFormRow label="Query">
          <EuiFieldSearch
            placeholder="Stenographer Query"
            value={stenoValue}
            onChange={e => onStenoChange(e)}
            isInvalid={!isValidSteno(stenoValue)}
          />
        </EuiFormRow>
        <EuiFormRow label="Time">
          <EuiSuperDatePicker
            start={startTime}
            end={endTime}
            showUpdateButton={showUpdateButton}
            onTimeChange={onTimeChange}
            recentlyUsedRanges={recentlyUsedRanges}
            isAutoRefreshOnly={isAutoRefreshOnly}
            isDisabled={timeDisabled}
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiFormRow>
          <EuiSwitch
            label="Disable time filter"
            onChange={e => setTimeDisabled(e.target.checked)}
            checked={timeDisabled}
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiButton
          onClick={handleSubmit}
          color={submitButton.color}
          isLoading={submitButton.loading}
        >
          {submitButton.label}
        </EuiButton>
      </EuiForm>
    </Fragment>
  );
};

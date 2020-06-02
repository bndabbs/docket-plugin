import React, { Fragment, useEffect, useState } from 'react';
import {
  EuiFlexItem,
  EuiFlexGroup,
  EuiButton,
  EuiButtonIcon,
  formatDate,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiSpacer,
} from '@elastic/eui';
import { DocketPluginProps, SearchStateProps, StenoQueries } from '../../types';
import { search } from '../components';

interface ResultsList {
  timestamp: Date;
  bytes: number;
  query: string;
  host: string;
  hostId: string;
  requestId: string;
}

export const ResultsPage = (props: DocketPluginProps) => {
  const [stenoResults, setStenoResults] = useState<ResultsList[]>([]);
  const [stenoResultsState, setStenoResultsState] = useState<SearchStateProps<StenoQueries> | any>({
    searching: true,
    shouldUpdate: true,
    error: undefined,
    response: undefined,
  });

  function hasResponse(
    stenoHostsState: SearchStateProps<StenoQueries> | any
  ): stenoHostsState is SearchStateProps<StenoQueries> {
    return (stenoHostsState as SearchStateProps<StenoQueries>).response !== undefined;
  }

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
      request: request('.docket'),
      setSearchState: setStenoResultsState,
    });
  }, [stenoResultsState.shouldUpdate, props.data]);

  useEffect(() => {
    const results: ResultsList[] = [];
    if (hasResponse(stenoResultsState)) {
      if (stenoResultsState.response.rawResponse.hits.total > 0)
        stenoResultsState.response.rawResponse.hits.hits.map((hit: { _source: StenoQueries }) => {
          const source = hit._source;
          results.push({
            timestamp: source.timestamp,
            bytes: source.response.bytes,
            query: source.request.query,
            host: source.stenographer.host,
            hostId: source.stenographer.id,
            requestId: source.request.id,
          });
        });
    }
    setStenoResults(results);
  }, [stenoResultsState]);

  const download = async (id: string) => {
    const pathPrefix = window.location.pathname.replace(/app.*/, '');

    await fetch(window.location.origin + pathPrefix + 'api/docket/download/' + id, {
      method: 'GET',
      headers: {
        'kbn-xsrf': 'docket',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.download = id + '.pcap';
        link.href = URL.createObjectURL(blob);

        link.click();

        URL.revokeObjectURL(link.href);
      });
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const actions = [
    {
      render: (item: any) => {
        return (
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="importAction"
              aria-label="Download"
              disabled={item.bytes === 0}
              onClick={() => download(item.requestId + '_' + item.hostId)}
            />
          </EuiFlexItem>
        );
      }, // TODO add delete action to remove from disk and add delete bool to es record
    },
  ];

  const items = (stenoResults as unknown) as string[];

  const columns: Array<EuiBasicTableColumn<string>> = [
    {
      field: 'timestamp',
      name: 'Timestamp',
      dataType: 'date',
      render: (dateTime: string) => formatDate(dateTime),
      sortable: true,
    },
    {
      field: 'bytes',
      name: 'Response Bytes',
      dataType: 'number',
      render: (bytes: number) => formatBytes(bytes),
    },
    {
      field: 'query',
      name: 'Query',
      truncateText: false,
      // width: '40%',
    },
    {
      field: 'host',
      name: 'Stenographer Host',
      sortable: true,
      truncateText: true,
    },
    {
      name: 'Actions',
      actions,
    },
  ];

  return (
    <Fragment>
      <EuiFlexGroup justifyContent="flexEnd">
        <EuiFlexItem grow={false}>
          <EuiButton
            iconType="refresh"
            aria-label="Refresh"
            color="secondary"
            isLoading={stenoResultsState.searching}
            onClick={() => setStenoResultsState({ ...stenoResultsState, shouldUpdate: true })}
          >
            Refresh
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      <EuiBasicTable items={items} loading={stenoResultsState.searching} columns={columns} />
    </Fragment>
  );
};

import { Dispatch, SetStateAction } from 'react';
import { IEsSearchRequest } from 'src/plugins/data/public';
import { DocketProps, SearchStateProps } from '../../types';

interface EsProps {
  search: DocketProps['data']['search'];
  request: IEsSearchRequest;
  setSearchState: Dispatch<SetStateAction<SearchStateProps>>;
}

export function search(props: EsProps) {
  props.setSearchState(prevState => {
    return { ...prevState, searching: true };
  });
  function observable() {
    props.search.search(props.request).subscribe(
      response => {
        props.setSearchState(prevState => {
          return { ...prevState, error: undefined, response };
        });
      },
      error => {
        props.setSearchState(prevState => {
          return { ...prevState, error, searching: false, shouldUpdate: false };
        });
      },
      () => {
        props.setSearchState(prevState => {
          return { ...prevState, shouldUpdate: false, searching: false, error: undefined };
        });
      }
    );
  }
  return observable();
}

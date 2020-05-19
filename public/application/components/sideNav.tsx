import React from 'react';
import { withRouter } from 'react-router-dom';
import { EuiPageSideBar, EuiSideNav } from '@elastic/eui';
import { NavProps } from '../../types';

export const Nav = withRouter(({ history, pages }: NavProps) => {
  const navItems = pages.map(page => ({
    id: page.id,
    name: page.title,
    onClick: () => history.push(`/${page.id}`),
    'data-test-subj': page.id,
  }));

  return (
    <EuiPageSideBar>
      <EuiSideNav
        items={[
          {
            name: 'Docket',
            id: 'home',
            items: [...navItems],
          },
        ]}
      />
    </EuiPageSideBar>
  );
});

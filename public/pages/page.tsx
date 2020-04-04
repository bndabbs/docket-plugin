import React from 'react';

import {
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader, EuiPageHeaderSection,
  EuiTitle,
} from '@elastic/eui';

interface PageProps {
  title: string;
  children: React.ReactNode;
}

export function Page({ title, children }: PageProps) {
  return (
    <EuiPageBody data-test-subj="docketPage">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <h1>{title}</h1>
            </EuiTitle>
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentBody>{children}</EuiPageContentBody>
        </EuiPageContent>
    </EuiPageBody>
  );
}

import React from 'react';

import { EuiText, EuiPageContentBody, EuiListGroup } from '@elastic/eui';

export const DocumentationPage = () => (
  <EuiPageContentBody>
    <EuiText>
      <p>
        Docket was created as part of the RockNSM project to provide a front-end for Google
        Stenographer.
      </p>
      <p>For more information, visit the Docket GitHub repo under the references section.</p>
      <h2>References</h2>
      <EuiListGroup
        listItems={[
          {
            label: 'Github',
            href: 'https://github.com/rocknsm/docket',
            iconType: 'logoGithub',
            size: 's',
          },
          {
            label: 'Community Forum',
            href: 'http://community.rocknsm.io',
            iconType: 'help',
            size: 's',
          },
          {
            label: 'RockNSM',
            href: 'https://github.com/rocknsm/rock',
            iconType: 'logoGithub',
            size: 's',
          },
          {
            label: 'Google Stenographer',
            href: 'https://github.com/google/stenographer',
            iconType: 'logoGithub',
            size: 's',
          },
        ]}
      />
    </EuiText>
  </EuiPageContentBody>
);

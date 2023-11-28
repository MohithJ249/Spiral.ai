import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import SharedPage from '../content/Shared'; // Import your LoginPage component
import { useGetAllSharedScriptsQuery } from '../generated/graphql'; // Import the hook to be mocked
import { useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

jest.mock('../generated/graphql', () => ({
    useGetAllSharedScriptsQuery: () => {
        return {
          data: {
            getAllSharedScripts: [{
                  title: 'testTitle',
                  last_modified: '300000',
                  scriptid: 'testScriptId',
                  userid: 'testUserid',
                  owner_username: 'testOwnerUsername'
              }]
          },
        };
      },
}));

jest.mock('react-router-dom', () => ({
    useLocation: () => ({
      pathname: '/SharedScripts',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }),
}));

describe('Shared script component', () => {
  it('renders the Shared component with mock data', async () => {
    render(
      <MockedProvider addTypename={false}>
        <SharedPage />
      </MockedProvider>
    );

    const titleField = screen.getByText('testTitle');
    expect(titleField).toBeInTheDocument();

    const lastModifiedField = screen.getByText('Last Modified: 300000');
    expect(lastModifiedField).toBeInTheDocument();

    const scriptidField = screen.queryByText('testId');
    expect(scriptidField).not.toBeInTheDocument();

    const userIdField = screen.queryByText('testUserid');
    expect(userIdField).not.toBeInTheDocument();

    const ownerField = screen.getByText('Owner: testOwnerUsername');
    expect(ownerField).toBeInTheDocument();
  });
});
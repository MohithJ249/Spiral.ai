import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import MyScripts from '../content/MyScripts'; // Import your LoginPage component
import { useGetAllUserScriptsQuery } from '../generated/graphql'; // Import the hook to be mocked
import { useLocation } from 'react-router-dom';

jest.mock('../generated/graphql', () => ({
    useGetAllUserScriptsQuery: () => {
      return {
        data: {
            getAllUserScripts: [{
                title: 'testTitle',
                last_modified: '300000',
                scriptid: 'testId'
            }]
        },
      };
    },
}));

jest.mock('react-router-dom', () => ({
    useLocation: () => ({
      pathname: '/MyScripts',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }),
}));

describe('My Scripts Page component', () => {
  it('renders the My Scripts Page component with mock data', async () => {
    render(
      <MockedProvider addTypename={false}>
        <MyScripts />
      </MockedProvider>
    );

    const titleField = screen.getByText('testTitle');
    expect(titleField).toBeInTheDocument();

    const lastModifiedField = screen.getByText('Last Modified: 300000');
    expect(lastModifiedField).toBeInTheDocument();

    const scriptidField = screen.queryByText('testId');
    expect(scriptidField).not.toBeInTheDocument();
  });
});
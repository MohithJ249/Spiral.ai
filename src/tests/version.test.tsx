import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import VersionHistory from '../content/VersionHistory'; // Import your LoginPage component
import { useGetScriptVersionsQuery, useCreateScriptVersionMutation } from '../generated/graphql'; // Import the hook to be mocked
import { useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

jest.mock('../generated/graphql', () => ({
    useGetScriptVersionsQuery: () => {
        return {
            data: {
                getScriptVersions: [{
                    versionid: 'testVersionId',
                    time_saved: '300000',
                }]
            }
        };
    },
    useCreateScriptVersionMutation: () => [jest.fn()]
}));

jest.mock('react-router-dom', () => ({
    useLocation: () => ({
      pathname: '/RecordingsPage',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }),
}));


describe('Version history component', () => {
  it('renders the version history component with mock data', async () => {
    // difficult to do due to recordings and faking the blob
    // one alternative is to always render the page instead of returning and empty div
    jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue("MockSearchParam");

    render(
      <MockedProvider addTypename={false}>
        <VersionHistory />
      </MockedProvider>
    );

    const returnToEditingButton = screen.getByText('Return to Editing', { selector: 'button' });
    expect(returnToEditingButton).toBeInTheDocument();
    expect(returnToEditingButton).toBeEnabled();

    const recoverSelectedVersionButton = screen.getByText('Recover Selected Version', { selector: 'button' });
    expect(recoverSelectedVersionButton).toBeInTheDocument();
    expect(recoverSelectedVersionButton).not.toBeEnabled();

    const titleText = screen.getByText('Version History for MockSearchParam');
    expect(titleText).toBeInTheDocument();

    const scriptContentField = screen.getByText('Please select a version.');
    expect(scriptContentField).toBeInTheDocument();
  });
});
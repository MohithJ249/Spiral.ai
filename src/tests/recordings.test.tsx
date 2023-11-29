import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import RecordingsPage from '../content/Recordings'; // Import your LoginPage component
import { useGetScriptRecordingsLazyQuery, useDeleteRecordingMutation, useSaveRecordingMutation } from '../generated/graphql'; // Import the hook to be mocked
import { useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { Storage } from 'aws-amplify';

jest.mock('../generated/graphql', () => ({
    useGetScriptRecordingsLazyQuery: () => [jest.fn(), { data: mockData, refetch: jest.fn()}],
    useDeleteRecordingMutation: () => [jest.fn()],
    useSaveRecordingMutation: () => [jest.fn(), { loading: false, error: {} }],
}));

const mockData = {
    getScriptRecordings: [{ name: 'testName' }]
};  

jest.mock('react-router-dom', () => ({
    useLocation: () => ({
      pathname: '/RecordingsPage',
      search: '',
      hash: '',
      state: null,
      key: '5nvxpbdafa',
    }),
}));

jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue("some value");

describe('Recordings component', () => {
  it('renders the Recordings component with mock data', async () => {
    jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue("MockSearchParam");
    jest.spyOn(Storage, "get").mockResolvedValue("aaa");

    render(
      <MockedProvider addTypename={false}>
        <RecordingsPage />
      </MockedProvider>
    );

    const returnButton = screen.getByText('Return to Script', { selector: 'button' });
    expect(returnButton).toBeInTheDocument();

    const playbackText = screen.getByText('Select a recording to playback.');
    expect(playbackText).toBeInTheDocument();
  });
});
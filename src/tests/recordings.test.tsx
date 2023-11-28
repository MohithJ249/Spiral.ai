import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import RecordingsPage from '../content/Recordings'; // Import your LoginPage component
import { useGetScriptRecordingsLazyQuery, useDeleteRecordingMutation } from '../generated/graphql'; // Import the hook to be mocked
import { useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

jest.mock('../generated/graphql', () => ({
    useGetScriptRecordingsLazyQuery: () => [jest.fn(), { data: mockData, refetch: jest.fn()}],
    useDeleteRecordingMutation: () => [jest.fn()]
}));

const mockData = {
    // Your mock data goes here
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
    // difficult to do due to recordings and faking the blob
    // one alternative is to always render the page instead of returning and empty div
    render(
      <MockedProvider addTypename={false}>
        <RecordingsPage />
      </MockedProvider>
    );

    const returnButton = screen.getByText('Return to Script', { selector: 'button' });
    expect(returnButton).toBeInTheDocument();
  });
});
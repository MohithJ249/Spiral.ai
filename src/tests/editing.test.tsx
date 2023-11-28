import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import EditingPage from '../content/Editing'; // Import your LoginPage component
import { useGetAllScriptCommentsLazyQuery, useDeleteCommentMutation, useDeleteScriptMutation, useGetScriptRecordingsQuery, useGetScriptVersionsQuery } from '../generated/graphql'; // Import the hook to be mocked
import axios from 'axios';

jest.mock('../generated/graphql', () => ({
  useGetAllScriptCommentsLazyQuery: () => [jest.fn(), { data: mockData, refetch: jest.fn() }],
  useDeleteCommentMutation: () => [jest.fn()],
  useDeleteScriptMutation: () => [jest.fn()],
  useGetScriptRecordingsQuery: () => { return {data: {}};},
  useGetScriptVersionsQuery: () => { return {data: {}};},
  axios: jest.fn(() => ({ data: {} })),
}));

const mockData = {
  // Your mock data goes here
};

describe('Editing component', () => {
  it('renders the Editing component with mock data', async () => {
    render(
      <MockedProvider addTypename={false}>
        <EditingPage />
      </MockedProvider>
    );
    screen.debug();
    const comments = screen.getByText('Comments');
    expect(comments).toBeInTheDocument();
  });
});
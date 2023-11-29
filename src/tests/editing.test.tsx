import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import EditingPage from '../content/Editing'; // Import your LoginPage component
import { useDeleteScriptMutation, useGetScriptVersionsQuery, useGetScriptRecordingsQuery, useGetAllScriptCommentsLazyQuery, useDeleteCommentMutation, useSaveRecordingMutation, useCreateScriptVersionMutation, useAddCollaboratorMutation, useRemoveCollaboratorMutation, useGetAllScriptCollaboratorsLazyQuery } from '../generated/graphql'; // Import the hook to be mocked
import axios from 'axios';
import { Storage } from 'aws-amplify';

jest.mock('../generated/graphql', () => ({
  useGetAllScriptCommentsLazyQuery: () => [jest.fn(), { data: mockData, refetch: jest.fn() }],
  useDeleteCommentMutation: () => [jest.fn()],
  useDeleteScriptMutation: () => [jest.fn()],
  useGetScriptRecordingsQuery: () => { return {data: {}};},
  useGetScriptVersionsQuery: () => { return {data: {}};},
  useSaveRecordingMutation: () => [jest.fn(), { loading: false, error: {} }],
  useCreateScriptVersionMutation: () => [jest.fn()],
  useAddCollaboratorMutation: () => [jest.fn()],
  useRemoveCollaboratorMutation: () => [jest.fn()],
  useGetAllScriptCollaboratorsLazyQuery: () => [jest.fn(), { data: {}, refetch: jest.fn() }],
}));

jest.mock('axios', () => ({
  post: jest.fn(() => ({ data: {} })),
}));

const mockData = {
  // Your mock data goes here
};

describe('Editing component', () => {
  it('renders the Editing component with mock data', async () => {
    jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue("MockSearchParam");
    jest.spyOn(Storage, "get").mockResolvedValue("aaa");

    render(
      <MockedProvider addTypename={false}>
        <EditingPage />
      </MockedProvider>
    );

    const selectTextButton = screen.getByText('Select Text', { selector: 'button' });
    expect(selectTextButton).toBeInTheDocument();

    const plagiarismButton = screen.getByText('Calculate Plagiarism', { selector: 'button' });
    expect(plagiarismButton).toBeInTheDocument();
    expect(plagiarismButton).toBeEnabled();

    const generateButton = screen.getByText('Generate', { selector: 'button' });
    expect(generateButton).toBeInTheDocument();
    expect(generateButton).toBeDisabled();

    const replaceButton = screen.getByText('Replace', { selector: 'button' });
    expect(replaceButton).toBeInTheDocument();
    expect(replaceButton).toBeDisabled();

    const selectedTextField = screen.getByTestId('selectedTextField');
    expect(selectedTextField).toBeInTheDocument();

    const modifyDropdown = screen.getByTestId('modifyDropdown');
    expect(modifyDropdown).toBeInTheDocument();

    const toneDropdown = screen.getByTestId('toneDropdown');
    expect(toneDropdown).toBeInTheDocument();

    const generatedTextField = screen.getByTestId('generatedTextField');
    expect(generatedTextField).toBeInTheDocument();
  });
});
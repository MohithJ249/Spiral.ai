import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; 
import EditingPage from '../content/Editing';
import { useDeleteScriptMutation, useGetScriptVersionsQuery, useGetScriptRecordingsQuery, useGetAllScriptCommentsLazyQuery, useDeleteCommentMutation, useSaveRecordingMutation, useCreateScriptVersionMutation, useAddCollaboratorMutation, useRemoveCollaboratorMutation, useGetAllScriptCollaboratorsLazyQuery } from '../generated/graphql';
import axios from 'axios';
import { Storage } from 'aws-amplify';

jest.mock('../generated/graphql', () => ({
  useGetAllScriptCommentsLazyQuery: () => {
    return [jest.fn(),{
                        data: {
                            getAllScriptComments: [{
                                commentid: 'testVersionId',
                                text_content: 'testTextContent',
                                username: 'testUsername',
                                time_saved: '300000',
                                text_ref: 'testTextRef'
                            }]
                        },
                        refetch: jest.fn()
                    }];
  },
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

  it('disables replace button when generated text is empty', async () => {
    jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue("MockSearchParam");
    jest.spyOn(Storage, "get").mockResolvedValue("aaa");

    render(
      <MockedProvider addTypename={false}>
        <EditingPage />
      </MockedProvider>
    );

    const replaceButton = screen.getByText('Replace', { selector: 'button' });
    expect(replaceButton).toBeInTheDocument();
    expect(replaceButton).toBeDisabled();

    const generatedTextField = screen.getByTestId('generatedTextField');
    fireEvent.change(generatedTextField, { target: { value: 'newly generated text' } });
    expect(replaceButton).toBeEnabled();
  });

  it('shows comments on the page', async () => {
    jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue("MockSearchParam");
    jest.spyOn(Storage, "get").mockResolvedValue("aaa");

    render(
      <MockedProvider addTypename={false}>
        <EditingPage />
      </MockedProvider>
    );

    const textRef = screen.getByText('testTextRef');
    expect(textRef).toBeInTheDocument();

    const textContent = screen.getByText('testTextContent');
    expect(textContent).toBeInTheDocument();

    const username = screen.getByText('testUsername');
    expect(username).toBeInTheDocument();

    const timeSaved = screen.getByText('300000');
    expect(timeSaved).toBeInTheDocument();
  });
});
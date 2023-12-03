import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ViewShared from '../content/ViewShared';
import { useGetAllScriptCommentsLazyQuery, usePostCommentMutation, useDeleteCommentMutation } from '../generated/graphql';
import { useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
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
    usePostCommentMutation: () => [jest.fn()],
    useDeleteCommentMutation: () => [jest.fn()]
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
    jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue("MockSearchParam");
    jest.spyOn(Storage, "get").mockResolvedValue("aaa");

    render(
      <MockedProvider addTypename={false}>
        <ViewShared />
      </MockedProvider>
    );

    const selectTextButton = screen.getByText('Select Text', { selector: 'button' });
    expect(selectTextButton).toBeInTheDocument();

    const postCommentButton = screen.getByText('Post Comment', { selector: 'button' });
    expect(postCommentButton).toBeInTheDocument();

    const scriptTitle = screen.getByText('MockSearchParam');
    expect(scriptTitle).toBeInTheDocument();

    const textRef = screen.getByText('testTextRef');
    expect(textRef).toBeInTheDocument();

    const textContent = screen.getByText('testTextContent');
    expect(textContent).toBeInTheDocument();

    const username = screen.getByText('Posted by testUsername');
    expect(username).toBeInTheDocument();

    const timeSaved = screen.getByText('300000');
    expect(timeSaved).toBeInTheDocument();
  });
});
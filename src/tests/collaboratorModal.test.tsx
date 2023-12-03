import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import { useAddCollaboratorMutation, useRemoveCollaboratorMutation, useGetAllScriptCollaboratorsLazyQuery} from '../generated/graphql'; // Import the hook to be mocked
import { Storage } from 'aws-amplify';
import CollaboratorModal from '../components/CollaboratorModal';

jest.mock('../generated/graphql', () => ({
  useAddCollaboratorMutation: () => [jest.fn()],
  useRemoveCollaboratorMutation: () => [jest.fn()],
  useGetAllScriptCollaboratorsLazyQuery: () => [jest.fn(), { data: {}, refetch: jest.fn() }],
}));

describe('Collaborator Modal component', () => {
  it('renders the collaborator modal component with mock data', async () => {
    jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue("MockSearchParam");
    jest.spyOn(Storage, "get").mockResolvedValue("aaa");

    render(
      <MockedProvider addTypename={false}>
        <CollaboratorModal scriptid='11' onShowNotification={jest.fn()}/>
      </MockedProvider>
    );

    const shareScriptButton = screen.getByLabelText('Share Script');

    act(() => {
        shareScriptButton.click();
    });
    
    const addCollaboratorText = screen.getByText('Add a collaborator:');
    expect(addCollaboratorText).toBeInTheDocument();

    const shareButton = screen.getByText('Share', { selector: 'button' });
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toBeDisabled();

    const currentCollaboratorsText = screen.getByText('Current Collaborators:');
    expect(currentCollaboratorsText).toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import { Storage } from 'aws-amplify';
import DeleteModal from '../components/DeleteModal';

describe('Delete Model component', () => {
  it('renders the delete modal component with mock data', async () => {
    render(
      <MockedProvider addTypename={false}>
        <DeleteModal onDelete={jest.fn()} deleteText='TestDeleteText'/>
      </MockedProvider>
    );

    const deleteModalButton = screen.getByLabelText('Delete Script');

    act(() => {
        deleteModalButton.click();
    });
    
    const deleteText = screen.getByText('TestDeleteText');
    expect(deleteText).toBeInTheDocument();

    screen.debug();

    const yesButton = screen.getByText('Yes', { selector: 'button' });
    expect(yesButton).toBeInTheDocument();

    const noButton = screen.getByText('No', { selector: 'button' });
    expect(noButton).toBeInTheDocument();
  });
});
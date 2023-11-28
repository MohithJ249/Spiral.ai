import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import NewScriptPage from '../content/NewScript'; // Import your LoginPage component
import { useCreateScriptMutation } from '../generated/graphql'; // Import the hook to be mocked
import { useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

jest.mock('../generated/graphql', () => ({
    useCreateScriptMutation: () => [jest.fn()],
}));

jest.mock('react-router-dom', () => ({
    useLocation: () => ({
      pathname: '/NewScript',
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
        <NewScriptPage />
      </MockedProvider>
    );

    const titleField = screen.getByText('Title');
    expect(titleField).toBeInTheDocument();

    const promptField = screen.getByText('Prompt');
    expect(promptField).toBeInTheDocument();

    const additionalInformationField = screen.getByTestId('additionalInformation');
    expect(additionalInformationField).toBeInTheDocument();

    const speechLengthField =  screen.getByTestId('speechLength');
    expect(speechLengthField).toBeInTheDocument();

    const speechToneField =  screen.getByTestId('speechTone');
    expect(speechToneField).toBeInTheDocument();

    const generateButton = screen.getByText('Generate Script', { selector: 'button' });
    expect(generateButton).toBeInTheDocument();
  });

  it('renders a disabled Generate Script button when the title and prompt fields are empty', async () => {
    render(
      <MockedProvider addTypename={false}>
        <NewScriptPage />
      </MockedProvider>
    );

    const generateButton = screen.getByText('Generate Script', { selector: 'button' });
    expect(generateButton).toBeInTheDocument();
    expect(generateButton).toBeDisabled();
  });
});
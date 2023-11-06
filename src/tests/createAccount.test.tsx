import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import CreateAccount from '../content/CreateAccount'; // Import your LoginPage component
import { useCreateUserMutation } from '../generated/graphql'; // Import the hook to be mocked

jest.mock('../generated/graphql', () => ({
    useCreateUserMutation: () => [jest.fn(), { loading: false }],
}));

describe('CreateAccountPage component', () => {
  it('renders the CreateAccount component with mock data', async () => {
    render(
      <MockedProvider addTypename={false}>
        <CreateAccount />
      </MockedProvider>
    );

    const loginButton = screen.getByText('Login to Existing Account', { selector: 'button' });
    expect(loginButton).toBeInTheDocument();

    const createAccountButton = screen.getByText('Create Account', { selector: 'button' });
    expect(createAccountButton).toBeInTheDocument();

    const emailTextField = screen.getByText('Email');
    expect(emailTextField).toBeInTheDocument();

    const passwordTextField = screen.getByText('Password');
    expect(passwordTextField).toBeInTheDocument();

    const usernameTextField = screen.getByText('Username');
    expect(usernameTextField).toBeInTheDocument();
  });
});
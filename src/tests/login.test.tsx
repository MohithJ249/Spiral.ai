import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import LoginPage from '../content/Login'; // Import your LoginPage component
import { useLoginLazyQuery } from '../generated/graphql'; // Import the hook to be mocked

jest.mock('../generated/graphql', () => ({
  useLoginLazyQuery: () => [jest.fn(), { data: mockData, loading: false, error: null }],
}));

const mockData = {
  // Your mock data goes here
};

describe('LoginPage component', () => {
  it('renders the LoginPage component with mock data', async () => {
    render(
      <MockedProvider addTypename={false}>
        <LoginPage />
      </MockedProvider>
    );

    const signInButton = screen.getByText('Sign In', { selector: 'button' });
    expect(signInButton).toBeInTheDocument();

    const createAccountButton = screen.getByText('Create Account', { selector: 'button' });
    expect(createAccountButton).toBeInTheDocument();

    const emailTextField = screen.getByText('Email');
    expect(emailTextField).toBeInTheDocument();

    const passwordTextField = screen.getByText('Password');
    expect(passwordTextField).toBeInTheDocument();
  });
});
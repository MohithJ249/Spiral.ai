import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import LoginPage from '../content/Login';
import { useLoginLazyQuery } from '../generated/graphql';

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
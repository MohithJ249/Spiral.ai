import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import MakeVersionButton from '../components/MakeVersionButton';
import { useCreateScriptVersionMutation } from '../generated/graphql';
import { useLocation } from 'react-router-dom';

jest.mock('../generated/graphql', () => ({
  useCreateScriptVersionMutation: () => [jest.fn()],
}));

describe('Make Version Button component', () => {
  it('renders the Make Version Button component with mock data', async () => {
    render(
      <MockedProvider addTypename={false}>
        <MakeVersionButton scriptid='11' scriptContent='aaa' onShowNotification={jest.fn()}/>
      </MockedProvider>
    );

    const makeVersionButton = screen.getByLabelText('Make Version');
    expect(makeVersionButton).toBeInTheDocument();
  });
});
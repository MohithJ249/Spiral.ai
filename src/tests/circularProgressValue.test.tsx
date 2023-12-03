import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import AudioRecorder from '../components/CircularProgressValue'; // Import your LoginPage component
import CircularProgressValue from '../components/CircularProgressValue';

describe('CircularProgressValue component', () => {
  it('renders the CircularProgressValue component with mock data', async () => {
    render(
      <MockedProvider addTypename={false}>
        <CircularProgressValue value={30} />
      </MockedProvider>
    );

    const value = screen.getByText('30%');
    expect(value).toBeInTheDocument();
  });
});
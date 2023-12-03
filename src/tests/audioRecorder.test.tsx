import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing'; // Use the appropriate testing library
import AudioRecorder from '../components/AudioRecorder'; // Import your LoginPage component
import { useSaveRecordingMutation } from '../generated/graphql'; // Import the hook to be mocked

jest.mock('../generated/graphql', () => ({
    useSaveRecordingMutation: () => [jest.fn(), { loading: false, error: undefined }],
}));

describe('AudioRecorder component', () => {
  it('renders the AudioRecorder component with editing mode', async () => {
    render(
      <MockedProvider addTypename={false}>
        <AudioRecorder scriptid='11' recordingTitle='TestTitle' onShowNotification={jest.fn()} mode='Editing' />
      </MockedProvider>
    );

    const recordingTitleField = screen.queryByText('TestTitle');
    expect(recordingTitleField).not.toBeInTheDocument();
  });

  it('renders the AudioRecorder component with viewing mode', async () => {
    render(
      <MockedProvider addTypename={false}>
        <AudioRecorder scriptid='11' recordingTitle='TestTitle' onShowNotification={jest.fn()} mode='Viewing' />
      </MockedProvider>
    );

    const recordingTitleField = screen.getByText('TestTitle');
    expect(recordingTitleField).toBeInTheDocument();
  });
});
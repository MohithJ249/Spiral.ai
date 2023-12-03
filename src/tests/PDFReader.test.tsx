import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import PDFReader from '../components/PDFReader';

describe('Recordings component', () => {
  it('renders the Recordings component with mock data', async () => {
    render(
      <MockedProvider addTypename={false}>
        <PDFReader getExtractedText={jest.fn()} margin={1} addtionalInfo='TestAdditionalInfo' onSetAdditionalInfo={jest.fn()}/>
      </MockedProvider>
    );

    const uploadButton = screen.getByText('Upload Files');
    expect(uploadButton).toBeInTheDocument();

    const extractTextButton = screen.getByText('Extract All');
    expect(extractTextButton).toBeInTheDocument();

    const uploadedFilesText = screen.getByText('Uploaded PDF Files Will Be Shown Here');
    expect(uploadedFilesText).toBeInTheDocument();
  });
});
import { all } from 'axios';
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFReaderProps {
  getExtractedText: (text: string) => void;
}

function PDFReader({ getExtractedText } : PDFReaderProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [allText, setAllText] = useState<string>();
  const [textLoading, setTextLoading] = useState<boolean>(false);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const onDocumentLoadSuccess = async ({ numPages }: { numPages: number }) => {
    if(!textLoading && allText === undefined) {
      setNumPages(numPages);
      setTextLoading(true);

      // Get all pages' text
      const arrText: string[] = [];

      const promises: Promise<string>[] = [];

      for (let i = 1; i <= numPages; i++) {
        promises.push(
          (async () => {
            const buffer = await file?.arrayBuffer();
            const pdf = await pdfjs.getDocument(buffer!).promise;
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            const pageText = textContent.items
              .map((textItem) => ('str' in textItem ? textItem.str : ''))
              .join(' ');

            return pageText;
          })()
        );
      }

      const pageTexts = await Promise.all(promises);
      arrText.push(...pageTexts);

      const getAllText = arrText.join(' ');
      setAllText(getAllText); 
          
    }
  };

  useEffect(() => {
    const text = allText;
    if(text === undefined) {
      getExtractedText('');
    }
    else {
      getExtractedText(text);
    }
  }, [allText]);

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      {file && (
        <div>
          <Document file={URL.createObjectURL(file)} onLoadSuccess={onDocumentLoadSuccess}>
          </Document>
        </div>
      )}
      {numPages !== null && (
        <>
          {/* <p>Number of Pages: {numPages}</p>
          <p>All Text: {allText}</p> */}
        </>
      )}
    </div>
  );
}

export default PDFReader;
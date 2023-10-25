import { all } from 'axios';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PDFReader() {
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    if(!textLoading && allText === undefined) {
      setNumPages(numPages);
      setTextLoading(true);

      // Get all pages' text
      let allText = '';
      for (let i = 1; i <= numPages; i++) {
        file?.arrayBuffer().then((buffer) => {
          pdfjs.getDocument(buffer).promise.then((pdf) => {
            pdf.getPage(i).then((page) => {
              page.getTextContent().then((textContent) => {
                textContent.items.forEach((textItem) => {
                  if ('str' in textItem) {
                    allText += textItem.str + ' ';
                  }
                });
                setAllText(allText);
                console.log(allText);
              });
            });
          });
        });
      }
    }
  };

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
          <p>Number of Pages: {numPages}</p>
          <p>All Text: {allText}</p>
        </>
      )}
    </div>
  );
}

export default PDFReader;
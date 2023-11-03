import { MergeType, Upload } from '@mui/icons-material';
import { Box, Button, Chip, Container, Fab, FormHelperText, IconButton, ListItem, Paper, Stack, TextField } from '@mui/material';
import { all } from 'axios';
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFReaderProps {
  getExtractedText: (text: string) => void;
  margin: number
  addtionalInfo: string,
  onSetAdditionalInfo: (text: string) => void
}

function PDFReader({ getExtractedText, margin, addtionalInfo, onSetAdditionalInfo } : PDFReaderProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  // const [files, setFiles] = useState<File[]>([]);
  // const [filesURLS, setFilesURLS] = useState<string[]>([]);
  const [fileObjs, setFileObjs] = useState<{file : File, numPages : number}[]>([]);

  // const [allText, setAllText] = useState<string>();
  const [textLoading, setTextLoading] = useState<boolean>(false);

  const onFileChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if(selectedFiles) {
      const selectedFilesList: File[] = Array.from(selectedFiles);

      // get number of pages from each file
      var buildFileObjs : {file : File, numPages : number}[] = [];
      for(let i = 0; i < selectedFiles.length; i++) {
        const buffer = await selectedFiles[i].arrayBuffer();
        const pdf = await pdfjs.getDocument(buffer!).promise;
        const numPages = await pdf.numPages;

        buildFileObjs.push({file : selectedFilesList[i], numPages});
      }

      setFileObjs([...fileObjs, ...buildFileObjs]);
      
      const docs = selectedFilesList.map((file) => {
        return URL.createObjectURL(file);
      })

      // setFilesURLS(docs);

      // setFiles(docs);
    }


  };

  const loadDocs = async (obj: {file : File, numPages : number}) => {
    // if(!textLoading) {
      // setNumPages(numPages);
      setTextLoading(true);

      // Get all pages' text
      const arrText: string[] = [];

      const promises: Promise<string>[] = [];

      for (let i = 1; i <= obj.numPages; i++) {
        promises.push(
          (async () => {
            const buffer = await obj.file?.arrayBuffer();
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
      if(addtionalInfo === undefined) {
        onSetAdditionalInfo(getAllText);
      }
      else {
        var newAllText = addtionalInfo + '\n\n\n' + getAllText;
        onSetAdditionalInfo(newAllText); 
      }
      // setFiles([]);
    // }
  };

  useEffect(() => {
    const text = addtionalInfo;
    if(text === undefined) {
      getExtractedText('');
    }
    else {
      getExtractedText(text);
    }
  }, [addtionalInfo]);

  const handleDelete = (fileToBeDeleted : File) => () => {
    setFileObjs(fileObjs.filter((obj) => obj.file !== fileToBeDeleted));
  };

  const trial = () => {
    console.log(fileObjs);
    fileObjs.map((obj) => {
      loadDocs(obj);
    });

    setFileObjs([]);
  }

  return (
    <Box sx={{ margin: margin }}>
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} >
        <Fab variant='extended' component='label'>
          <Upload />
          Upload Files
          <input type="file" onChange={onFileChange} multiple hidden/>
        </Fab>
        <Fab variant='extended' onClick={trial}>
            <MergeType />
            Extract All
          </Fab>
      </Stack>
      {/* {file && (
        <div>
          <Document file={URL.createObjectURL(file)} onLoadSuccess={onDocumentLoadSuccess}>
          </Document>
        </div>
      )} */}
      <Box className='docsUploading' sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Paper elevation={5} sx={{
          justifyContent: 'center',
          flexWrap: 'wrap',
          listStyle: 'none',
          borderRadius: '5px',
          width: window.innerWidth * 0.2,
          height: window.innerHeight * 0.4,
          overflow: 'auto',
        }}
        component="ul">

          {fileObjs && fileObjs.map((eachFile, index) => {
            return (
              <ListItem key={index}>
                <Chip
                  label={eachFile.file.name}
                  onDelete={handleDelete(eachFile.file)}
                  // sx={{width: '100%'}}
                  />

                  {/*<Document file={URL.createObjectURL(eachFile)} onLoadSuccess={onDocumentLoadSuccess}></Document>*/}
              </ListItem>
            );
          })}
        </Paper>
        <FormHelperText sx={{ textAlign: 'center', fontWeight: 'bold'}}>Uploaded PDF Files Will Be Shown Here</FormHelperText>
        
      </Box>
    </Box>
  );
}

export default PDFReader;
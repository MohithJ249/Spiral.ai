import { MergeType, Upload } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Container,
    Fab,
    FormHelperText,
    IconButton,
    ListItem,
    Paper,
    Stack,
    TextField,
} from "@mui/material";
import { all } from "axios";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import JSZip from "jszip";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFReaderProps {
    getExtractedText: (text: string) => void;
    margin: number;
    addtionalInfo: string;
    onSetAdditionalInfo: (text: string) => void;
}

function getTextFromNodes(
    node: Document,
    tagName: string,
    namespaceURI: string
) {
    let text = "";
    const textNodes = node.getElementsByTagNameNS(namespaceURI, tagName);
    for (let i = 0; i < textNodes.length; i++) {
        text += textNodes[i].textContent + " ";
    }
    return text.trim();
}

function PDFReader({
    getExtractedText,
    margin,
    addtionalInfo,
    onSetAdditionalInfo,
}: PDFReaderProps) {
    const [fileObjs, setFileObjs] = useState<
        { file: File; numPages: number }[]
    >([]);
    const [localText, setLocalText] = useState<string>("");

    useEffect(() => {
        if (localText != '') {
            onSetAdditionalInfo(localText);
            setLocalText('')
        }
    }, [localText]);

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles?.length) {
            const selectedFilesList: File[] = Array.from(selectedFiles);
            // var fileName = "name" in obj.file ? obj.file.name : "";
            const isPDF = selectedFilesList[0].name.endsWith("pdf");

            // get number of pages from each file
            var buildFileObjs: { file: File; numPages: number }[] = [];
            for (let i = 0; i < selectedFiles.length; i++) {
                const buffer = await selectedFiles[i].arrayBuffer();
                var numPages = 1; // default for pptx
                if (isPDF) {
                    const pdf = await pdfjs.getDocument(buffer!).promise;
                    numPages = await pdf.numPages;
                }
                // add each file and number of pages to be parsed when the extract button is clicked
                buildFileObjs.push({ file: selectedFilesList[i], numPages });
            }

            setFileObjs([...fileObjs, ...buildFileObjs]);
        }
    };

    // when extract button is clicked, then all of the files stored in buildFileObjs should be parsed.
    const loadDocs = async (obj: { file: File; numPages: number }) => {
        const arrText: string[] = [];
        const promises: Promise<string>[] = [];

        for (let i = 1; i <= obj.numPages; i++) {
            promises.push(
                (async () => {
                    const buffer = await obj.file?.arrayBuffer();
                    var pageText = "";
                    var fileName = "name" in obj.file ? obj.file.name : "";
                    // pdfs are parsed differently compared to Powerpoints
                    if (fileName.endsWith("pdf")) {
                        const pdf = await pdfjs.getDocument(buffer!).promise;
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        pageText = textContent.items
                            .map((textItem) =>
                                "str" in textItem ? textItem.str : ""
                            )
                            .join(" ");
                    } else {
                        const zip = new JSZip();
                        await zip.loadAsync(buffer);
                        const aNamespace =
                            "http://schemas.openxmlformats.org/drawingml/2006/main";
                        let text = "";

                        let slideIndex = 1;
                        while (true) {
                            const slideFile = zip.file(
                                `ppt/slides/slide${slideIndex}.xml`
                            );

                            if (!slideFile) break;

                            const slideXmlStr = await slideFile.async("text");

                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(
                                slideXmlStr,
                                "application/xml"
                            );

                            text +=
                                getTextFromNodes(xmlDoc, "t", aNamespace) + " ";

                            slideIndex++;
                        }
                        pageText = text.trim();
                    }

                    return pageText;
                })()
            );
        }

        const pageTexts = await Promise.all(promises);
        arrText.push(...pageTexts);

        const getAllText = arrText.join("\n");
        if (localText === "") {
            // if there was nothing to begin with, just add file's content
            setLocalText(getAllText);
        } else {
            // make sure to add in addition to what already exists
            setLocalText(localText + "\n\n\n" + getAllText);
        }
    };


    // helper functions to handle file deletion and extracting shown on the UI
    const handleDelete = (fileToBeDeleted: File) => () => {
        setFileObjs(fileObjs.filter((obj) => obj.file !== fileToBeDeleted));
    };

    const handleExtractAll = () => {
        // extract each file
        fileObjs.map((obj) => {
            loadDocs(obj);
        });

        // clear fileObjs after extracting all of the previously parsed files
        setFileObjs([]);
        setLocalText("");
        // console.log(localText)
    };

    const FabStyling = {
        color: "white",
        backgroundColor: "#1976d2",
        "&:hover": {
            color: "white",
            backgroundColor: "#1565c0",
        },
    };

    return (
        <Box sx={{ margin: margin }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={2}
            >
                <Fab variant="extended" component="label" sx={FabStyling}>
                    <Upload />
                    Upload Files
                    <input
                        type="file"
                        onChange={onFileChange}
                        multiple
                        hidden
                    />
                </Fab>
                <Fab
                    variant="extended"
                    onClick={handleExtractAll}
                    sx={FabStyling}
                >
                    <MergeType />
                    Extract All
                </Fab>
            </Stack>
            <Box
                className="docsUploading"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Paper
                    elevation={5}
                    sx={{
                        justifyContent: "center",
                        flexWrap: "wrap",
                        listStyle: "none",
                        borderRadius: "5px",
                        width: window.innerWidth * 0.2,
                        height: window.innerHeight * 0.4,
                        overflow: "auto",
                    }}
                    component="ul"
                >
                    {fileObjs &&
                        fileObjs.map((eachFile, index) => {
                            return (
                                <ListItem key={index}>
                                    <Chip
                                        label={eachFile.file.name}
                                        onDelete={handleDelete(eachFile.file)}
                                    />
                                </ListItem>
                            );
                        })}
                </Paper>
                <FormHelperText
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                >
                    Uploaded PDF Files Will Be Shown Here
                </FormHelperText>
            </Box>
        </Box>
    );
}

export default PDFReader;

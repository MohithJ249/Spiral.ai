import { Button, Grid, Grow,  Typography, Card, CardActionArea, CardContent, Box, TextField, Paper, Fab, Stack, IconButton } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { useGetAllScriptCommentsLazyQuery, usePostCommentMutation, useDeleteCommentMutation } from '../../generated/graphql';
import { Close, Create, Done, PlaylistAddCheck } from '@mui/icons-material';
import Scrollbar from '../../components/scrollbar';
import { commentsStyling, cardContentStyling, deleteButtonCommentsStyling, textContentCommentsStyling, timeSavedCommentsStyling } from '../../styles/styles';

export default function ViewShared() {
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    const title = searchParams.get('title');
    const scriptid = searchParams.get('scriptid');
    const ownerid = searchParams.get('ownerid');

    const [commentText, setCommentText] = useState<string>('');
    const [scriptContent, setScriptContent] = useState<string>();
    const [selectedTextPosition, setSelectedTextPosition] = useState<[number, number] | undefined>(undefined);
    const [fetchScriptComments, { data, refetch: refetchComments }] = useGetAllScriptCommentsLazyQuery();
    const [postCommentMutation] = usePostCommentMutation();
    const [deleteCommentMutation] = useDeleteCommentMutation();

    const disabledBoxStyle = {
        color: 'initial',
        pointerEvents: 'none' as React.CSSProperties["pointerEvents"]
    };

    useEffect(() => {
        if(scriptid) {
            fetchScriptComments({
                variables: {
                    scriptid: scriptid || ''
                }
            });
            const fileName = "userid-"+ownerid+ "/scriptid-" + scriptid + "/"+title+".txt";
            Storage.get(fileName, { download: true })
            .then(fileContent => {
                return fileContent.Body?.text();
            })
            .then(textContent => {
                setScriptContent(textContent || '');
            })
            .catch(error => {
                console.error('Error downloading file:', error);
        });      
        }
    }, [scriptid]);

    const selectedText = useMemo(() => {
        if (selectedTextPosition) {
          const selectionStart = selectedTextPosition[0];
          const selectionEnd = selectedTextPosition[1] + 1;
      
          if(scriptContent) {
            return scriptContent.slice(selectionStart, selectionEnd);
          }
        }
        return '';
    }, [scriptContent, selectedTextPosition]);

    const textStyle = {
        color: 'initial',
        pointerEvents: 'auto' as React.CSSProperties["pointerEvents"]
    };

    const headerStyling = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const postComment = async () => {
        if(commentText) {
            await postCommentMutation({
                variables: {
                    scriptid: scriptid || '',
                    userid: localStorage.getItem('userid') || '',
                    textContent: commentText
                }
            });
            setCommentText('');
            refetchComments();
        }
    }

    const deleteComment = async (commentid: string) => {
        await deleteCommentMutation({
            variables: {
                commentid: commentid
            }
        });
        refetchComments();
    }

    const selectText = () => {
        const textField = document.getElementById('outlined-multiline-static') as HTMLInputElement;
      
        if (textField) {
            const selectionStart = textField.selectionStart;
            const selectionEnd = textField.selectionEnd;

      
            if(scriptContent !== undefined && selectionStart !== null && selectionEnd !== null)
            {
                var start = selectionStart;
                var end = selectionEnd - 1;

                console.log(scriptContent.charAt(start)+" "+scriptContent.charAt(end));

                while(scriptContent.charAt(start) === ' ') {
                    start++;
                }

                while(scriptContent.charAt(end) === ' ') {
                    end--;
                }

                setSelectedTextPosition([start, end]);
            }
        }
    }

    if(scriptid) {
        return (
            <>
                <div>
                    {/* <Typography variant="h3">{title}</Typography> */}
                    <Typography variant="h4" sx={{marginTop: '1%', marginBottom: '1%', backgroundColor: '#f1efee', fontFamily: 'MuseoSlab'}}>{title}</Typography>

                    <div style={{ flexGrow: 1, backgroundColor: '#f1efee' }}>
                        <Grid sx={{ flexGrow: 1, width: '100vw', height: '100vh' }} container justifyContent="center" spacing={8}>
                            
                            <Grow in key='CommentingPane' timeout={1000}>
                                <Grid item>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                        height: window.innerHeight * 0.9,
                                        width: window.innerWidth * 0.2,
                                        backgroundColor: '#f1efee',
                                        }}
                                    >
                                        <Stack direction="column" sx={{'& > :not(style)': { m: 1 }}}>
                                            <Fab  onClick={selectText} variant='extended'> 
                                                <Done />
                                                Select Text
                                            </Fab>
                                            <TextField
                                                id='selected-text'
                                                value={selectedText}
                                                multiline
                                                placeholder='Selected text will appear here.'
                                                style={disabledBoxStyle}
                                                rows={window.innerHeight * 0.2 / 24}
                                            />
                                            <Fab variant="extended" onClick={postComment} disabled={!commentText}>
                                                <Create />
                                                Post Comment
                                            </Fab>
                                            <TextField
                                                multiline
                                                rows={window.innerHeight * 0.9 / 100}
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder='Enter comment here.'
                                            >
                                            </TextField>

                                        </Stack>

                                        <Grow in timeout={1500}>

                                            <Paper
                                            elevation={0}
                                            sx={{
                                                flexWrap: 'wrap',
                                                borderRadius: '5px',
                                                width: window.innerWidth * 0.2,
                                                height: window.innerHeight * 0.6,
                                                overflow: 'auto',
                                                maxHeight: '60%',
                                                marginTop: '1%',
                                                backgroundColor: '#f1efee',
                                                '&::-webkit-scrollbar': {
                                                width: '0.5rem', 
                                                },
                                                '&::-webkit-scrollbar-thumb': {
                                                background: '#aaa', // Color of the scrollbar thumb
                                                borderRadius: '2px', // Adjust as needed
                                                },
                                                '&::-webkit-scrollbar-thumb:hover': {
                                                background: '#aaa', // Color on hover, adjust as needed
                                                },
                                            }}
                                            component="ul"
                                            >

                                                {data?.getAllScriptComments?.map((comment, index) => {
                                                    if (comment?.commentid && comment?.text_content && comment?.username && comment?.time_saved) {
                                                        return (
                                                            <Grow in key={index} timeout={1500 + index * 300}>
                                                                <Card key={comment.commentid} sx={commentsStyling}>
                                                                    <CardContent sx={cardContentStyling}>
                                                                        <Box sx={headerStyling}>
                                                                            <Typography variant="h6">Posted by {comment.username}</Typography>
                                                                            {comment.userid === localStorage.getItem('userid') ? (<IconButton onClick={() => deleteComment(comment.commentid)} sx={deleteButtonCommentsStyling}>
                                                                                <Close />
                                                                            </IconButton>
                                                                            ) : null}
                                                                        </Box>
                                                                        <Typography variant="caption" sx={timeSavedCommentsStyling}>{comment.time_saved}</Typography>
                                                                        <Typography variant="body1" sx={textContentCommentsStyling}>{comment.text_content}</Typography>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grow>
                                                        );
                                                    }
                                                    return null; // Or any other fallback you want when text_content is undefined or falsy
                                                })}
                                            </Paper>
                                        </Grow>
                                    </Paper>
                                </Grid>
                            </Grow>

                            <Grow in key='ViewScriptPane' timeout={1500}>
                                <Grid item>
                                    <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    // height of 1 row = 56px, so adjust accordingly
                                    rows={Math.ceil(window.innerHeight * 0.9 / 24)}
                                    variant="outlined"
                                    sx={{
                                        width: `${window.innerWidth * 0.6}px`,
                                        
                                    }}
                                    value={scriptContent}
                                    style={textStyle}
                                    />
                                </Grid>
                            </Grow>
                        </Grid>
                    </div>
                </div>
            </>
        );
    }
    else {
        return <></>
    }
}
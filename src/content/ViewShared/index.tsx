import { Grid, Grow,  Typography, Card, CardContent, Box, TextField, Paper, Fab, Stack, IconButton } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { useGetAllScriptCommentsLazyQuery, usePostCommentMutation, useDeleteCommentMutation } from '../../generated/graphql';
import { Close, Create, Done } from '@mui/icons-material';
import { commentsStyling, cardContentStyling, deleteButtonCommentsStyling, textContentCommentsStyling, timeSavedCommentsStyling, textContentStylingItalic } from '../../styles/styles';

export default function ViewShared() {
    // for retrival purposes
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    const title = searchParams.get('title');
    const scriptid = searchParams.get('scriptid');
    const ownerid = searchParams.get('ownerid');

    // for comments
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
            // make backend call to get this script's comments
            fetchScriptComments({
                variables: {
                    scriptid: scriptid || ''
                }
            });
            const fileName = "userid-"+ownerid+ "/scriptid-" + scriptid + "/"+title+".txt";
            // get from S3 and populate
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

    // follow similar highlighting text logic from editing page
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
            // make backend call to post comment, so it shows up for both this user and the owner of the script
            // whenever they login
            await postCommentMutation({
                variables: {
                    scriptid: scriptid || '',
                    userid: localStorage.getItem('userid') || '',
                    textContent: commentText,
                    textRef: selectedText
                }
            });
            // clear comment and refresh comments
            setCommentText('');
            refetchComments();
        }
    }

    // to delete comment so it doesn't show up
    const deleteComment = async (commentid: string) => {
        // backend call to delete comment
        await deleteCommentMutation({
            variables: {
                commentid: commentid
            }
        });
        // refresh comments
        refetchComments();
    }

    // store the selected text position
    const selectText = () => {
        const textField = document.getElementById('outlined-multiline-static') as HTMLInputElement;
      
        if (textField) {
            const selectionStart = textField.selectionStart;
            const selectionEnd = textField.selectionEnd;

      
            if(scriptContent !== undefined && selectionStart !== null && selectionEnd !== null)
            {
                var start = selectionStart;
                var end = selectionEnd - 1;

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
                    <Typography variant="h4" sx={{marginTop: '1%', marginBottom: '1%', backgroundColor: '#f1efee', fontFamily: 'MuseoSlab'}}>{title}</Typography>

                    <div style={{ flexGrow: 1, backgroundColor: '#f1efee' }}>
                        <Grid sx={{ flexGrow: 1, minHeight: '100vh' }} container justifyContent="center" spacing={2}>
                            
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
                                            <Fab variant="extended" onClick={postComment} disabled={!commentText || !selectedText}>
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
                                        width: `${window.innerWidth * 0.5}px`,
                                        
                                    }}
                                    value={scriptContent}
                                    style={textStyle}
                                    />
                                </Grid>
                            </Grow>
                            <Grow in key='CommentsPane' timeout={1750}>
                                <Grid item>
                                    <Grow in timeout={1500}>

                                        <Paper
                                        elevation={0}
                                        sx={{
                                            flexWrap: 'wrap',
                                            borderRadius: '5px',
                                            width: window.innerWidth * 0.2,
                                            height: window.innerHeight * 0.9,
                                            overflow: 'auto',
                                            maxHeight: '100%',
                                            marginTop: '0%',
                                            backgroundColor: '#f1efee',
                                            '&::-webkit-scrollbar': {
                                            width: '0.5rem', 
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                            background: '#aaa', 
                                            borderRadius: '2px', 
                                            },
                                            '&::-webkit-scrollbar-thumb:hover': {
                                            background: '#aaa', 
                                            },
                                        }}
                                        component="ul"
                                        >
                                            {/* map each comment to a new card on ui in this scrollable list */}
                                            {data?.getAllScriptComments?.map((comment, index) => {
                                                if (comment?.commentid && comment?.text_content && comment?.username && comment?.time_saved && comment?.text_ref) {
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
                                                                    <Typography variant="body1" sx={textContentStylingItalic}>{comment.text_ref}</Typography>
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
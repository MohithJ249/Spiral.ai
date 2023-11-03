import { Button, Grid, Grow,  Typography, Card, CardActionArea, CardContent, Box, TextField, Paper, Fab, Stack } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { useGetAllScriptCommentsLazyQuery, usePostCommentMutation, useDeleteCommentMutation } from '../../generated/graphql';
import { Create, PlaylistAddCheck } from '@mui/icons-material';
import Scrollbar from '../../components/scrollbar';

export default function ViewShared() {
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    const title = searchParams.get('title');
    const scriptid = searchParams.get('scriptid');
    const ownerid = searchParams.get('ownerid');

    const [commentText, setCommentText] = useState<string>('');
    const [scriptContent, setScriptContent] = useState<string>();
    const [fetchScriptComments, { data, refetch: refetchComments }] = useGetAllScriptCommentsLazyQuery();
    const [postCommentMutation] = usePostCommentMutation();
    const [deleteCommentMutation] = useDeleteCommentMutation();

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

    const textStyle = {
        color: 'initial',
        pointerEvents: 'none' as React.CSSProperties["pointerEvents"]
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

    if(scriptid) {
        return (
            <>
                <div>
                    <Typography variant="h3">{title}</Typography>

                    <div style={{ flexGrow: 1 }}>
                        <Grid sx={{ flexGrow: 1 }} container justifyContent="center" spacing={4}>
                            
                            <Grow in key='RecordingPane' timeout={1000}>
                                <Grid item>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                        height: window.innerHeight * 0.8,
                                        width: window.innerWidth * 0.2,
                                        backgroundColor: '#ffffff',
                                        }}
                                    >
                                        <Stack direction="column" sx={{'& > :not(style)': { m: 1 }}}>
                                            <Fab variant="extended" onClick={postComment} disabled={!commentText}>
                                                <Create />
                                                Post Comment
                                            </Fab>
                                            <TextField
                                            multiline
                                            rows={window.innerHeight * 0.8 / 100}
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            >
                                            </TextField>
                                            {data?.getAllScriptComments?.map(comment => {
                                                if (comment?.commentid && comment?.text_content && comment?.username && comment?.time_saved) {
                                                    return (
                                                        <Card key={comment.commentid}>
                                                            <CardContent>
                                                            <Typography variant="h6">Posted by {comment.username} at {comment.time_saved}</Typography>
                                                            <Typography variant="body1">{comment.text_content}</Typography>
                                                            {comment.userid === localStorage.getItem('userid') ? (
                                                                <Button onClick={() => deleteComment(comment.commentid)}>X</Button>
                                                            ) : null}
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                }
                                                return null; // Or any other fallback you want when text_content is undefined or falsy
                                            })}
                                        </Stack>
                                    </Paper>
                                </Grid>
                            </Grow>

                            <Grow in key='EditingPane' timeout={1500}>
                                <Grid item>
                                    <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    // height of 1 row = 56px, so adjust accordingly
                                    rows={window.innerHeight * 0.8 / 24}
                                    variant="outlined"
                                    sx={{
                                        height: window.innerHeight * 0.8,
                                        width: window.innerWidth * 0.6,
                                        '& fieldset': {
                                            borderRadius: '15px'
                                        }
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
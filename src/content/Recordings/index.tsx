import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TablePagination } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import axios from 'axios';
import { useGetScriptRecordingsQuery } from '../../generated/graphql';
import AudioRecorder from '../../components/AudioRecorder';

interface Column {
    id: 'name' | 'time_saved';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
  
const columns: readonly Column[] = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'time_saved', label: 'Time Saved', minWidth: 100 },
];
  
interface Recording {
    name: string;
    time_saved: string;
}
  
function createRecording(
    name: string,
    time_saved: string,
  ): Recording {
    return { name, time_saved };
  }
  

export default function RecordingsPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const url = window.location.search;
    const searchParams = useMemo(() => new URLSearchParams(url), [url]);
    const title = useMemo(() => searchParams.get('title'), [searchParams]);
    const scriptid = useMemo(() => searchParams.get('scriptid'), [searchParams]);

    const { data, loading, error } = useGetScriptRecordingsQuery({
        variables: {
            title: title || '',
            userid: localStorage.getItem('userid') || '',
        }
    });

    const recordings = useMemo(() => {
        console.log(data)
        const recordings: Recording[] = [];
        if(data?.getScriptRecordings) {
            for(let i = 0; i < data.getScriptRecordings.length; i++) {
                const recording = data.getScriptRecordings[i];
                const name = recording?.title;
                const time_saved = recording?.time_saved;
                recordings.push(createRecording(name || '', time_saved || ''));
            }
        }
        console.log(recordings)
        return recordings;
    }, [data]) || [] as Recording[];

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    if(scriptid && recordings!==undefined) {
        return (
            <>
                <Typography variant="h4"> Recordings </Typography>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                            >
                                {column.label}
                            </TableCell>
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {recordings
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                    <TableCell key={column.id} align={column.align} onClick={() => {console.log(value)}}>
                                        {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                    );
                                })}
                                </TableRow>
                            );
                            })}
                        </TableBody>
                    </Table>
                    </TableContainer>
                    <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={-1}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </>
        );
    }
    else {
        return (
            <>
                <Typography variant="h4"> Show all scripts and get recordings by script id</Typography>
            </>
        );
    }
}
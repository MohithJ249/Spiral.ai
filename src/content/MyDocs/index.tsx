import '../../components/selectionPage';
import Selection from '../../components/selectionPage';
import { Typography } from '@mui/material';

export default function MyDocs() {
    return (
        <>
            {/* <div>
                <Typography variant="h3">Test</Typography>            
            </div> */}
            <Typography variant='h2'>Welcome {localStorage.getItem('username')}</Typography>
            <Selection />
        </>
    );
}
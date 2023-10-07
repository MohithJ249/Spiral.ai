import { Typography } from '@mui/material';
import { useParams } from 'react-router';


export default function EditingPage() {
    const {extraParameter} = useParams();

    return (
        <>
            <div>
                <Typography variant="h3">Add editing page here. Check in content/Editing/index.tsx file</Typography>

                <Typography variant="h3">Test Parameter passing below</Typography>            

                <Typography variant="h3">Worked? {extraParameter}</Typography>
            </div>
        </>
    );
}
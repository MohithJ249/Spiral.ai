import '../../components/selectionPage';
import MyDocs from '../MyDocs';
import { Typography } from '@mui/material';
import { useGetAllUsersQuery } from '../../generated/graphql';

export default function MainPage() {
    const { data, loading, error } = useGetAllUsersQuery();
    console.log(data);

    return (
        <>
            <div>
                <Typography variant="h3">Add landing page here. Check in content/MainPage/index.tsx file</Typography>            
            </div>
        </>
    );
}
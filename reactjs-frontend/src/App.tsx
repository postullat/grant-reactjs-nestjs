import React from 'react';
import './App.css';
import GrantCard from "./component/grant/GrantCard";
import {GET_ALL_GRANTS, GET_NEW_MATCHED_GRANTS} from "./graphql/queries";
import {useQuery} from "@apollo/client";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DateFormatter from "./utils/DateFromatter";
import StatusComponent from "./component/blocks/status/StatusComponent";



function App() {
    const {loading: loadingMatched, error: errorMatched, data: dataMatched, refetch: refetchMatchedGrants} = useQuery(GET_NEW_MATCHED_GRANTS);
    const {loading, error, data,  refetch: refetchAllGrants} = useQuery(GET_ALL_GRANTS);

    const handleGrantUpdate = async (id: string, status: string) => {
        await refetchMatchedGrants();
        await refetchAllGrants();
    };

    if (loadingMatched) return <p>Loading Matches...</p>;
    if (errorMatched) return <p>Error Matches: {errorMatched.message}</p>;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (

        <div className="App">
            <h2>New Matched Grants</h2>
            <div className="grant-card-container">
                {dataMatched.getAllNewMatches.map((grant: any) => (
                    <GrantCard
                        id={grant.id}
                        foundationName={grant.foundationName}
                        grantName={grant.grantName}
                        amount={grant.amount}
                        deadline={grant.deadline}
                        status={grant.status}
                        description={grant.description}
                        onUpdateGrant={handleGrantUpdate}/>
                ))}
            </div>

            <h2>Available Grants</h2>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Foundation name</TableCell>
                            <TableCell>Grant name</TableCell>
                            <TableCell>Average amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Deadline</TableCell>
                            <TableCell>Match date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.getAllGrants.map((grant: any) => (
                            <TableRow
                                key={grant.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {grant.foundationName}
                                </TableCell>

                                <TableCell>{grant.grantName}</TableCell>
                                <TableCell>${grant.amount}</TableCell>
                                <TableCell>
                                    <StatusComponent status={grant.status}/>
                                </TableCell>
                                <TableCell><DateFormatter date={grant.deadline} /></TableCell>
                                <TableCell><DateFormatter date={grant.matchDate} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default App;

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
import moment from 'moment';
import numeral from "numeral";


function App() {
    const {
        loading: loadingMatched,
        error: errorMatched,
        data: dataMatched,
        refetch: refetchMatchedGrants
    } = useQuery(GET_NEW_MATCHED_GRANTS);
    const {loading, error, data, refetch: refetchAllGrants} = useQuery(GET_ALL_GRANTS);

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
            <h2 className="new-grant-title">New Matched Grants</h2>
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
                        location={grant.location}
                        onUpdateGrant={handleGrantUpdate}/>
                ))}
            </div>

            <div className="grant-table-container">
                <h2 className="all-grant-title">Available Grants</h2>
                <TableContainer className="grant-table" component={Paper}>
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
                                    <TableCell>{numeral(grant.amount).format('$0,0')}</TableCell>
                                    <TableCell>
                                        <StatusComponent status={grant.status}/>
                                    </TableCell>
                                    <TableCell><DateFormatter date={moment(grant.deadline).format('MMMM D')}/></TableCell>
                                    <TableCell><DateFormatter date={moment(grant.matchDate).format('DD MMMM YYYY')}/></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default App;

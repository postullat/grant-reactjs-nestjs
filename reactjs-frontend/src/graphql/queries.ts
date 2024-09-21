import { gql } from '@apollo/client';

export const GET_ALL_GRANTS = gql`
    query getAllGrants {
        getAllGrants {
            id
            foundationName
            description
            location
            grantName
            amount
            status
            deadline
            matchDate
            feedback
        }
    }
`;

export const GET_NEW_MATCHED_GRANTS = gql`
    query getAllNewMatches {
        getAllNewMatches {
            id
            foundationName
            description
            location
            grantName
            amount
            status
            deadline
            matchDate
            feedback
        }
    }
`;

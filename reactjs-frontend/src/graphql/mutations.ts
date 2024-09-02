import { gql } from '@apollo/client';

export const UPDATE_GRANT_STATUS = gql`
  mutation UpdateGrantStatus($id: String!, $status: String!, $feedback: String!) {
    updateGrantStatus(id: $id, status: $status, feedback: $feedback) {
      id
      status
      feedback
    }
  }
`;

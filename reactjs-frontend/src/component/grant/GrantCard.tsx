import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_GRANT_STATUS } from '../../graphql/mutations';
import './GrantCard.css';
import DateFormatter from '../../utils/DateFromatter'
import StatusComponent from "../blocks/status/StatusComponent";

interface GrantCardProps {
    id: string;
    foundationName: string;
    grantName: string;
    amount: number;
    deadline: string;
    status: 'rejected' | 'applied' | 'accepted';
    description: string;
    onUpdateGrant: (id: string, status: string) => void;
}

const GrantCard: React.FC<GrantCardProps> = ({ id, foundationName, grantName, amount, deadline,  status, description, onUpdateGrant}) => {
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [updateStatus] = useMutation(UPDATE_GRANT_STATUS);

    const handleFeedbackSubmit = async (status: string) => {
        await updateStatus({ variables: { id, status, feedback } });
        setShowFeedback(false);
        onUpdateGrant(id, status);
    };

    return (
        <div className="grant-card">
            <button onClick={() => setShowFeedback(true)}>👍</button>
            <button onClick={() => handleFeedbackSubmit('rejected')}>👎</button>

            {showFeedback && (
                <div>
                    <textarea onChange={(e) => setFeedback(e.target.value)} />
                    <button onClick={() => handleFeedbackSubmit('accepted')}>Submit Feedback</button>
                </div>
            )}
            <h3>{foundationName}</h3>
            <h3>{grantName}</h3>
            <p>{status}</p>
            <p>Avg Amount ${amount}</p>
            <p>Deadline: <DateFormatter date={deadline} /></p>
            <p>{description}</p>

    </div>
);
};

export default GrantCard;

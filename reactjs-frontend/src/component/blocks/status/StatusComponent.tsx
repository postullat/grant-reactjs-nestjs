import React from 'react';

interface StatusComponentProps {
    status: 'rejected' | 'applied' | 'accepted';
}

const StatusComponent: React.FC<StatusComponentProps> = ({ status }) => {
    const className = `status ${status === 'rejected' ? 'rejected-status' : status === 'applied' ? 'applied-status' : 'accepted-status'}`;

    return <span className={className}>{status}</span>;
};

export default StatusComponent;
import React, {useState} from 'react';
import {useMutation} from '@apollo/client';
import {UPDATE_GRANT_STATUS} from '../../graphql/mutations';
import './GrantCard.css';
import likeImg from '../../assets/images/like.png';
import dislikeImg from '../../assets/images/dislike.png';
import coinsImg from '../../assets/images/coin.png';
import numeral from 'numeral';
import moment from 'moment';

interface GrantCardProps {
    id: string;
    foundationName: string;
    grantName: string;
    amount: number;
    deadline: string;
    status: 'rejected' | 'applied' | 'accepted';
    description: string;
    location: string;
    onUpdateGrant: (id: string, status: string) => void;
}

const tags = [
    {
        name: 'Public Health Women'
    },
    {
        name: 'Culture Food'
    },
    {
        name: 'Public Health Women'
    },
    {
        name: 'Culture Food'
    },
    {
        name: 'Environment Art'
    }

]

const GrantCard: React.FC<GrantCardProps> = ({
                                                 id,
                                                 foundationName,
                                                 grantName,
                                                 amount,
                                                 deadline,
                                                 status,
                                                 description,
                                                 location,
                                                 onUpdateGrant
                                             }) => {
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [updateStatus] = useMutation(UPDATE_GRANT_STATUS);

    const handleFeedbackSubmit = async (status: string) => {
        await updateStatus({variables: {id, status, feedback}});
        setShowFeedback(false);
        onUpdateGrant(id, status);
    };

    return (
        <div className="grant-card">
            <div className="grant-card-header">
                <div className="logo-letter">{foundationName[0]}</div>

                <div className="grant-btn-wrapper">
                    <button className="grant-like-btn" onClick={() => setShowFeedback(true)}>
                        <img src={likeImg}/>
                    </button>
                    <button className="grant-dislike-btn" onClick={() => handleFeedbackSubmit('rejected')}>
                        <img src={dislikeImg}/>
                    </button>
                </div>
            </div>

            {showFeedback && (
                <div>
                    <textarea onChange={(e) => setFeedback(e.target.value)}/>
                    <button onClick={() => handleFeedbackSubmit('accepted')}>Submit Feedback</button>
                </div>
            )}
            <p className="grant-foundation-name">{foundationName}</p>
            <p className="grant-name">{grantName}</p>
            <div className="grant-amount-wrapper">
                <div className="grant-avg-amount">
                    <img src={coinsImg}/>
                    <div>
                        <div className="grant-amount-value">{numeral(amount).format('$0,0')}</div>
                        <div className="grant-amount-text">Avg Amount</div>
                    </div>
                </div>
                <div className="grant-deadline-wrapper">
                    <div className="grant-deadline-title">Deadline</div>
                    <div className="grant-deadline-value">{moment(deadline).format('MMMM D')}</div>
                    <div className="deadline-line-separator" />
                    <div className="grant-deadline-apply-title">Getting Started</div>
                    <div className="grant-deadline-apply-value">Apply Online</div>
                </div>
            </div>
            <div className="location-wrapper">
                <p>Location</p>
                <p className="grant-location-value">{location}</p>
            </div>
            <p className="grant-area-of-funding">Area of Funding</p>
            <div className="grant-tags-wrapper">
                {tags.map((tag) => (
                    <span className="grant-tag" key={tag.name}>{tag.name}</span>
                ))}
            </div>
            {/*           <p>{status}</p>
            <p>Avg Amount ${amount}</p>
            <p>Deadline: <DateFormatter date={deadline}/></p>
            <p>{description}</p>*/}

        </div>
    );
};

export default GrantCard;

import React from 'react';

interface DateFormatterProps {
    date: string | Date;
}

const DateFormatter: React.FC<DateFormatterProps> = ({ date }) => {
    // Ensure the date is a Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Format the date
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return <span>{formattedDate}</span>;
};

export default DateFormatter;

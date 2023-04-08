import React from 'react';
import Card from 'react-playing-card';

function UICard({ rank, suit }) {
    return (
        <Card rank={rank} suit={suit} />
    );
}

export default UICard;
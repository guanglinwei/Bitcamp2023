import React from 'react';
// import Card from 'react-playing-card';

function UICard({ rank, suit }) {
    return (
        <img src={`./cards/${rank}${suit}.svg`} />
    );
}

//comment

export default UICard;
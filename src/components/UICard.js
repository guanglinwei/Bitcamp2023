import React from 'react';
// import Card from 'react-playing-card';

function UICard({ rank, suit }) {
    return (
        <img src={`./cards/${rank}${suit}.svg`} style={{ width: 'auto', height: 'calc(25vh)' }} alt={`Card: ${rank}${suit}`}/>
    );
}

//comment

export default UICard;
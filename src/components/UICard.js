import React from 'react';
// import Card from 'react-playing-card';

function UICard({ rank, suit, highlighted }) {
    return (
        <div style={{ background: highlighted ? 'lightgrey' : 'none', padding: '8px', borderRadius: '8px'}}>
            <img src={`./cards/${rank}${suit}.svg`} style={{ width: 'auto', height: 'calc(24vh)' }} alt={`Card: ${rank}${suit}`} />
        </div>
    );
}

//comment

export default UICard;
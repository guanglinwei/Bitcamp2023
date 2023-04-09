import React from 'react';
// import Card from 'react-playing-card';

function UICard({ rank, suit, highlighted, flipped }) {
    return (
        <div className='card-container'
            style={{ background: highlighted ? 'lightgrey' : 'none', padding: '8px', borderRadius: '8px', position: 'relative', top: 0, left: 0 }}>
            {/* <img src={`${process.env.PUBLIC_URL}/cards/back.svg`}
                className={'card-back' + (flipped ? ' flipped' : '')} /> */}
            <img src={`${process.env.PUBLIC_URL}/cards/${rank}${suit}.svg`}
                className={'card-front' + (flipped ? ' flipped' : '')}
                alt={`Card: ${rank}${suit}`} />
        </div>
    );
}

//comment

export default UICard;
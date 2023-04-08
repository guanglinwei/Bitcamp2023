import React, { useEffect, useState } from 'react';
import UICard from './UICard';

function Board() {
    const [deck, setDeck] = useState([]);

    // Initialize the deck
    useEffect(() => {
        const _d = [];
        for (const rank of ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']) {
            for (const suit of ['S', 'H', 'C', 'D']) {
                // deck.push({
                //     rank: rank,
                //     suit: suit
                // });
                _d.push({
                    rank: rank,
                    suit: suit
                });
            }
        }
        setDeck(_d);
    }, []);

    return (
        <div>
            <h1>Poker Flip App</h1>
            <UICard rank={'A'} suit={'H'} />
            {deck.map((d, i) =>
                <div key={i}>
                    {d.rank} {d.suit}
                </div>)}
        </div>
    );
}

export default Board;
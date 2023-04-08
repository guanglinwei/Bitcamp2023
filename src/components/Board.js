import React, { useEffect, useRef } from 'react';
import UICard from './UICard';

function Board() {
    const deck = useRef([]);

    useEffect(() => {
        for (const rank of ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']) {
            for (const suit of ['S', 'H', 'C', 'D']) {
                // deck.push({
                //     rank: rank,
                //     suit: suit
                // });
                deck.current = [...deck.current, {
                    rank: rank,
                    suit: suit
                }];
            }
        }

        console.log(deck);
    }, []);

    return (
        <div>
            <h1>Poker Flip App</h1>
            <UICard rank={'A'} suit={'H'} />
        </div>
    );
}

export default Board;
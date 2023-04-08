import React, { useEffect, useRef, useState } from 'react';
import UICard from './UICard';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

function Board() {
    const baseDeck = useRef([]);
    const deck = useRef([]);
    const [hand1, setHand1] = useState([]);
    const [hand2, setHand2] = useState([]);

    // Initialize the deck
    useEffect(() => {
        const _d = [];
        for (const rank of ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']) {
            for (const suit of ['S', 'H', 'C', 'D']) {
                _d.push({
                    rank: rank,
                    suit: suit
                });
            }
        }
        // setDeck(_d);
        deck.current = _d;
        baseDeck.current = _d;
    }, []);

    // useEffect(() => {
    //     console.log(hand1);
    // }, [hand1]);

    // useEffect(() => {
    //     console.log(deck);
    // }, [deck]);

    function getRandomCard() {
        const rand = Math.floor(Math.random() * deck.current.length);
        const card = deck.current[rand];
        // setDeck(deck => deck.filter((v, i) => i !== rand));
        deck.current = deck.current.filter((v, i) => i !== rand);
        console.log(card);

        return card;
    }

    function deal() {
        deck.current = baseDeck.current;
        const card1 = getRandomCard();
        const card2 = getRandomCard();
        console.log(deck.current);
        console.log(baseDeck.current);
        setHand1([card1, card2]);
    }

    return (
        <div>
            <h1>Poker Flip App</h1>

            <Box sx={{ flexGrow: 1 }}>
                {hand1.map((card, i) =>
                    <Box key={i}>
                        <UICard rank={card.rank} suit={card.suit} />
                    </Box>
                )}
            </Box>
            <Button variant='contained' onClick={deal}>Deal</Button>
        </div>
    );
}

export default Board;
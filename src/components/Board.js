import React, { useEffect, useRef, useState } from 'react';
import UICard from './UICard';
import Button from '@mui/material/Button';
import { Box, Grid } from '@mui/material';

function Board() {
    const baseDeck = useRef([]);
    const deck = useRef([]);
    const rankToIntMap = useRef({});
    // const [hand1, setHand1] = useState([]);
    // const [hand2, setHand2] = useState([]);
    // const [river, setRiver] = useState([]);

    const [boardState, setBoardState] = useState({
        river: null,
        hand1: null,
        hand2: null,
        dealing: false
    });

    const [handRanking, setHandRanking] = useState("");

    // Initialize the deck
    useEffect(() => {
        const _d = [];
        let i = 2;
        for (const rank of ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']) {
            for (const suit of ['S', 'H', 'C', 'D']) {
                _d.push({
                    rank: rank,
                    suit: suit
                });
            }
            rankToIntMap.current[rank] = i++;
        }
        // setDeck(_d);
        deck.current = [..._d];
        baseDeck.current = _d;
    }, []);

    useEffect(() => {
        getPokerHandText();
    }, [boardState.river]);

    // useEffect(() => {
    //     console.log(hand1);
    // }, [hand1]);

    // useEffect(() => {
    //     console.log(deck);
    // }, [deck]);

    function getRandomCards(num) {
        const res = [];

        for (let i = 0; i < num; i++) {
            const rand = Math.floor(Math.random() * deck.current.length);
            const card = deck.current[rand];
            // setDeck(deck => deck.filter((v, i) => i !== rand));
            deck.current.splice(rand, 1);
            res.push(card);
        }

        console.log(res);

        return res;
    }

    function deal() {
        setBoardState({
            dealing: true
        })
        deck.current = [...baseDeck.current];
        // console.log(deck.current);
        // console.log(baseDeck.current);
        // setHand1(getRandomCards(2));
        // setRiver(getRandomCards(5));
        const hand1 = getRandomCards(2);
        const river = getRandomCards(5);

        setBoardState({
            river: river,
            hand1: hand1,
            hand2: null,
            dealing: false
        });
    }

    function getPokerHandText() {
        if (!boardState.river)
            return;

        console.log('here')
        const hands = ["4 of a Kind", "Straight Flush", "Straight", "Flush", "High Card",
            "1 Pair", "2 Pair", "Royal Flush", "3 of a Kind", "Full House"];

        const suitToNumMap = {
            'S': 1,
            'C': 2,
            'H': 4,
            'D': 8
        }

        setHandRanking(hands[rankPokerHand(boardState.river.map(v => rankToIntMap.current[v.rank]),
            boardState.river.map(v => suitToNumMap[v.suit]))]);

        console.log(rankPokerHand(boardState.river.map(v => rankToIntMap.current[v.rank]),
            boardState.river.map(v => suitToNumMap[v.suit])));
    }

    // https://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math
    function rankPokerHand(cs, ss) {
        console.log("ranking " + cs + ss);
        let v, i, o, s = (1 << cs[0]) | (1 << cs[1]) | (1 << cs[2]) | (1 << cs[3]) | (1 << cs[4]);
        for (i = -1, v = o = 0; i < 5; i++, o = Math.pow(2, cs[i] * 4)) { v += o * ((v / o & 15) + 1); }
        v = v % 15 - ((s / (s & -s) === 31) || (s === 0x403c) ? 3 : 1);
        v -= (ss[0] === (ss[1] | ss[2] | ss[3] | ss[4])) * ((s === 0x7c00) ? -5 : 1);

        return v;
        // document.write("Hand: " + hands[v] + (s == 0x403c ? " (Ace low)" : "") + "<br/>");
    }

    return (
        <Grid container justifyContent={'center'} alignItems={'center'}>
            <h1>Poker Flip App</h1>
            <Grid item xs={12} sx={{ height: '45vh', display: 'flex', justifyContent: 'center' }}>
                {boardState.river && boardState.river.map((card, i) =>
                    <Box key={i} sx={{ padding: '4px' }}>
                        <UICard rank={card.rank} suit={card.suit} />
                    </Box>
                )}
            </Grid>
            <Grid item xs={12} sx={{ height: '25vh', display: 'flex', justifyContent: 'center' }}>
                {boardState.hand1 && boardState.hand1.map((card, i) =>
                    <Box key={i} sx={{ padding: '4px' }}>
                        <UICard rank={card.rank} suit={card.suit} />
                    </Box>
                )}
            </Grid>
            <Grid item xs={12} sx={{ height: '5vh', marginTop: '8px' }}>
                <div>{handRanking}</div>
            </Grid>
            <Grid item sx={{ height: '5vh' }}>
            <Button variant='contained' onClick={deal}>Deal</Button>
            </Grid>
        </Grid>
    );
}

export default Board;
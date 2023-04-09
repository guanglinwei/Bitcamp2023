import React, { useEffect, useRef, useState } from 'react';
import UICard from './UICard';
import Button from '@mui/material/Button';
import { Box, Grid } from '@mui/material';

function Board() {
    const baseDeck = useRef([]);
    const deck = useRef([]);
    const rankToIntMap = useRef({});
    const tied = useRef(false);
    // const [hand1, setHand1] = useState([]);
    // const [hand2, setHand2] = useState([]);
    // const [river, setRiver] = useState([]);
    const canDeal = useRef(true);

    const [boardState, setBoardState] = useState({
        river: null,
        hand1: null,
        hand2: null,
        dealing: false
    });

    const [handRanking1, setHandRanking1] = useState("");
    const [handRanking2, setHandRanking2] = useState("");
    const [bestHand, setBestHand] = useState([]);
    const [bestHand1, setBestHand1] = useState([]);
    const [bestHand2, setBestHand2] = useState([]);

    // Initialize the deck
    useEffect(() => {
        const _d = [];
        let i = 2;
        for (const rank of ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']) {
            for (const suit of ['S', 'H', 'C', 'D']) {
                _d.push({
                    rank: rank,
                    suit: suit,
                    flipped: false
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
        canDeal.current = true;
        if (!boardState.river) return;
        for (const c of boardState.river)
            c.flipped = true;
    }, [boardState.river]);

    useEffect(() => {
        if (!boardState.hand1) return;
        for (const c of boardState.hand1)
            c.flipped = true;
    }, [boardState.hand1]);

    useEffect(() => {
        if (!boardState.hand2) return;
        for (const c of boardState.hand2)
            c.flipped = true;
    }, [boardState.hand2]);

    function getRandomCards(num) {
        const res = [];

        for (let i = 0; i < num; i++) {
            const rand = Math.floor(Math.random() * deck.current.length);
            const card = deck.current[rand];
            // setDeck(deck => deck.filter((v, i) => i !== rand));
            deck.current.splice(rand, 1);
            res.push(card);
        }

        return res;
    }

    function deal() {
        if (!canDeal.current) return;

        if (!boardState.river || boardState.river.length === 0) {
            const hand1 = getRandomCards(2);
            const hand2 = getRandomCards(2);
            const river = getRandomCards(3);

            canDeal.current = false;
            setBoardState({
                river: river,
                hand1: hand1,
                hand2: hand2,
                dealing: true
            });
        }
        else if (boardState.river.length === 3) {
            setBoardState({ ...boardState, river: [...boardState.river, ...getRandomCards(1)] })
            // setFlipped(false);
        }
        else if (boardState.river.length === 4) {
            setBoardState({ ...boardState, river: [...boardState.river, ...getRandomCards(1)] })
        }
        else {
            setBoardState({
                dealing: false
            });

            setBestHand([]);
            setBestHand1([]);
            setBestHand2([]);
            tied.current = false;
            setHandRanking1('');
            setHandRanking2('');

            deck.current = [...baseDeck.current];
            for (const c of deck.current)
                c.flipped = false;
        }
        // river = [...river, ...getRandomCards(1)];
        // river = [...river, ...getRandomCards(1)];


    }

    function getPokerHandText() {
        if (!boardState.river)
            return;

        const hands = ["4 of a Kind", "Straight Flush", "Straight", "Flush", "High Card",
            "1 Pair", "2 Pair", "Royal Flush", "3 of a Kind", "Full House"];

        const suitToNumMap = {
            'S': 1,
            'C': 2,
            'H': 4,
            'D': 8
        };

        let possibleHands1 = boardState.river.concat(boardState.hand1);
        possibleHands1 = possibleHands1.reduce((subsets, value) =>
            subsets.concat(
                subsets.map(set => [value, ...set])
            ), [[]]
        ).filter(v => v.length === 5);

        const _bestHand1 = possibleHands1.reduce((prev, curr) =>
            handDetailsToScore(getHandDetails(prev)) < handDetailsToScore(getHandDetails(curr)) ? prev : curr
        );

        setHandRanking1(hands[rankPokerHand(_bestHand1.map(v => rankToIntMap.current[v.rank]),
            _bestHand1.map(v => suitToNumMap[v.suit]))]);

        setBestHand1(_bestHand1);

        let possibleHands2 = boardState.river.concat(boardState.hand2);
        possibleHands2 = possibleHands2.reduce((subsets, value) =>
            subsets.concat(
                subsets.map(set => [value, ...set])
            ), [[]]
        ).filter(v => v.length === 5);

        const _bestHand2 = possibleHands2.reduce((prev, curr) =>
            handDetailsToScore(getHandDetails(prev)) < handDetailsToScore(getHandDetails(curr)) ? prev : curr
        );

        setHandRanking2(hands[rankPokerHand(_bestHand2.map(v => rankToIntMap.current[v.rank]),
            _bestHand2.map(v => suitToNumMap[v.suit]))]);

        setBestHand2(_bestHand2);

        const hand1Score = handDetailsToScore(getHandDetails(_bestHand1));
        const hand2Score = handDetailsToScore(getHandDetails(_bestHand2));
        setBestHand(hand1Score < hand2Score ? _bestHand1 : _bestHand2);
        tied.current = hand1Score === hand2Score;

        // sethandRanking1(hands[rankPokerHand(boardState.river.map(v => rankToIntMap.current[v.rank]),
        //     boardState.river.map(v => suitToNumMap[v.suit]))]);

        // console.log(rankPokerHand(boardState.river.map(v => rankToIntMap.current[v.rank]),
        //     boardState.river.map(v => suitToNumMap[v.suit])));
    }

    // https://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math
    function rankPokerHand(cs, ss) {
        let v, i, o, s = (1 << cs[0]) | (1 << cs[1]) | (1 << cs[2]) | (1 << cs[3]) | (1 << cs[4]);
        for (i = -1, v = o = 0; i < 5; i++, o = Math.pow(2, cs[i] * 4)) { v += o * ((v / o & 15) + 1); }
        v = v % 15 - ((s / (s & -s) === 31) || (s === 0x403c) ? 3 : 1);
        v -= (ss[0] === (ss[1] | ss[2] | ss[3] | ss[4])) * ((s === 0x7c00) ? -5 : 1);

        return v;
        // document.write("Hand: " + hands[v] + (s == 0x403c ? " (Ace low)" : "") + "<br/>");
    }

    // https://dev.to/miketalbot/real-world-javascript-map-reduce-solving-the-poker-hand-problem-3eie
    const order = "23456789TJQKA"
    function getHandDetails(hand) {
        const cards = hand;
        const faces = cards.map(a => String.fromCharCode([77 - order.indexOf(a.rank)])).sort();
        const suits = cards.map(a => a.suit).sort();
        const counts = faces.reduce(count, {});
        const duplicates = Object.values(counts).reduce(count, {});
        const flush = suits[0] === suits[4];
        const first = faces[0].charCodeAt(0);
        //Also handle low straight
        const lowStraight = faces.join("") === "AJKLM";
        faces[0] = lowStraight ? "N" : faces[0];
        const straight = lowStraight || faces.every((f, index) => f.charCodeAt(0) - first === index);
        let rank =
            (flush && straight && 1) ||
            (duplicates[4] && 2) ||
            (duplicates[3] && duplicates[2] && 3) ||
            (flush && 4) ||
            (straight && 5) ||
            (duplicates[3] && 6) ||
            (duplicates[2] > 1 && 7) ||
            (duplicates[2] && 8) ||
            9;

        return { rank, value: faces.sort(byCountFirst).join("") }

        function byCountFirst(a, b) {
            //Counts are in reverse order - bigger is better
            const countDiff = counts[b] - counts[a]
            if (countDiff) return countDiff // If counts don't match return
            return b > a ? -1 : b === a ? 0 : 1
        }
        function count(c, a) {
            c[a] = (c[a] || 0) + 1
            return c
        }
    }

    // Lower score is better
    function handDetailsToScore(details) {
        return details.rank + details.value;
    }

    function compareCards(c1, c2) {
        return c1.rank === c2.rank && c1.suit === c2.suit;
    }

    function cardIsInHand(card, hand) {
        return card && hand && hand.find(c => compareCards(c, card));
    }

    return (
        <Grid container justifyContent={'center'} alignItems={'center'}>
            <h1>Poker Flip App</h1>
            <Grid item xs={12} sx={{ height: '45vh', display: 'flex', justifyContent: 'center' }}>
                {boardState.river && boardState.river.map((card, i) =>
                    <Box key={i} sx={{ padding: '4px' }}>
                        <UICard
                            rank={card.rank}
                            suit={card.suit}
                            highlighted={cardIsInHand(card, bestHand)}
                            flipped={card.flipped} />
                    </Box>
                )}
            </Grid>
            <Grid item xs={6} sx={{ height: '28vh', display: 'flex', justifyContent: 'center' }}>
                {boardState.hand1 && boardState.hand1.map((card, i) =>
                    <Box key={i} sx={{ padding: '4px' }}>
                        <UICard
                            rank={card.rank}
                            suit={card.suit}
                            highlighted={(tied.current || bestHand === bestHand1) && cardIsInHand(card, bestHand1)}
                            flipped={card.flipped} />
                    </Box>
                )}
            </Grid>
            <Grid item xs={6} sx={{ height: '28vh', display: 'flex', justifyContent: 'center' }}>
                {boardState.hand2 && boardState.hand2.map((card, i) =>
                    <Box key={i} sx={{ padding: '4px' }}>
                        <UICard
                            rank={card.rank}
                            suit={card.suit}
                            highlighted={(tied.current || bestHand === bestHand2) && cardIsInHand(card, bestHand2)}
                            flipped={card.flipped} />
                    </Box>
                )}
            </Grid>
            <Grid item xs={6} sx={{ height: '5vh', marginTop: '8px' }}>
                {canDeal.current &&
                    <>
                        <div>{bestHand && handRanking1}</div>
                        <div>{(tied.current && 'tie') || (bestHand === bestHand1 && (boardState.river.length === 5 ? 'win' : 'ahead'))}</div>
                    </>
                }
            </Grid>
            <Grid item xs={6} sx={{ height: '5vh', marginTop: '8px' }}>
                {canDeal.current &&
                    <>
                        <div>{handRanking2}</div>
                        <div>{(tied.current && 'tie') || (bestHand === bestHand2 && (boardState.river.length === 5 ? 'win' : 'ahead'))}</div>
                    </>
                }
            </Grid>
            <Grid item sx={{ height: '5vh' }}>
                <Button variant='contained' onClick={deal}>Deal</Button>
            </Grid>
        </Grid>
    );
}

export default Board;
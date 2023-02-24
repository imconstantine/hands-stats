const HAND_REG_EX = /"Your hand is ([^\r\n]+)(\W), ([^\r\n]+)(\W)",([^\r\n]+),/gm

const ranks = {
  'A': 12,
  'K': 11,
  'Q': 10,
  'J': 9,
  'T': 8,
  '9': 7,
  '8': 6,
  '7': 5,
  '6': 4,
  '5': 3,
  '4': 2,
  '3': 1,
  '2': 0
}

export async function parseHands(file?: File): Promise<Hand[]> {
  const fileData = await file.arrayBuffer();
  const string = new TextDecoder('utf-8').decode(fileData);
  const array = [];

  for (const match of string.matchAll(HAND_REG_EX)) {
    const hand = format(match);
    array.push(hand);
  }

  return array;
}

function format(hand) {
  replaceTens(hand);
  const sortedHand: Card[] = ([{ value: hand[1], suit: hand[2] }, { value: hand[3], suit: hand[4] }]).sort((a, b) => ranks[a] < ranks[b] ? 0 : -1);

  return {
    hand: sortedHand,
    at: hand[5]
  }
  // return (isSuited(hand) ? sortedHand[0] + sortedHand[1] : sortedHand[1] + sortedHand[0]) + (isPocket(hand) ? '' : isSuited(hand) ? 's' : 'o')
}

function replaceTens(entries) {
  entries[1] = entries[1].replace('10', 'T');
  entries[3] = entries[3].replace('10', 'T');
}

type Card = { value: string; suit: string }

export type Hand = {
  hand: Card[]
  at: string
}
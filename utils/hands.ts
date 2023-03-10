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

const suitsReplaceLetter = {
  '♣': 'c',
  '♠': 's',
  '♥': 'h',
  '♦': 'd'
}

export async function parseHands(file?: File): Promise<Hand[]> {
  if (!file) {
    throw new Error('Missing file');
  }

  const array = [];
  const fileData = await file.arrayBuffer();
  const string = new TextDecoder('utf-8').decode(fileData);

  if (hasExtensionOf(file, '.json')) {
    const jsonHistory: History = JSON.parse(string);
    for (const item of jsonHistory.hands) {
      const date = new Date(item.startedAt);
      const player = item.players.find(player => player.id === jsonHistory.playerId);

      if (!player) {
        continue;
      }
      
      const hand = format([, ...player?.hand[0], ...player?.hand[1], date.toISOString()]);
      array.push(hand);
    }
  } else if (hasExtensionOf(file, '.csv')) {
    for (const match of string.matchAll(HAND_REG_EX)) {
      replaceSuitsByLetters(match);
      const hand = format(match);
      array.push(hand);
    }
  } else {
    throw new Error('Invalid file extension');
  }

  return array;
}

function hasExtensionOf(file: File, extension: string): boolean {
  return file.name.endsWith(extension);
}

function format(hand) {
  replaceTens(hand);
  const sortedHand: Card[] = ([{ value: hand[1], suit: hand[2] }, { value: hand[3], suit: hand[4] }]).sort((a, b) => ranks[a] < ranks[b] ? 0 : -1);

  return {
    hand: sortedHand,
    at: hand[5]
  }
}

function replaceSuitsByLetters(entries: string[]) {
  entries[2] = suitsReplaceLetter[entries[2]];
  entries[4] = suitsReplaceLetter[entries[4]];
}

function replaceTens(entries: string[]) {
  entries[1] = entries[1].replace('10', 'T');
  entries[3] = entries[3].replace('10', 'T');
}

type Card = { value: string; suit: string }

export type Hand = {
  hand: Card[]
  at: string
}

type History = {
  playerId: string;
  hands: {
    startedAt: number;
    players: {
      id: string;
      hand: string[]
    }[]
  }[]
}
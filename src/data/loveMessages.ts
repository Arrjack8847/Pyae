export type LoveMessage = {
  id: string
  label: string
  note: string
  x: number
  y: number
  floatDuration: number
  z: number
  scale: number
  rotate: number
  drift: number
  delay: number
  tone: 'near' | 'middle' | 'far'
}

export const loveMessages: LoveMessage[] = [
  {
    id: 'favorite-person',
    label: 'still my favorite person 💗',
    note: 'Even after one month, you are still the person I want to talk to the most.',
    x: 650,
    y: 860,
    floatDuration: 12.4,
    z: 150,
    scale: 1.08,
    rotate: -9,
    drift: 24,
    delay: -0.8,
    tone: 'near',
  },
  {
    id: 'happy-month',
    label: 'happy 5 monthsary pr Pyae✨',
    note: '5 month with you already feels special. I hope this is only the beginning.',
    x: 1125,
    y: 980,
    floatDuration: 13.1,
    z: 90,
    scale: 0.9,
    rotate: 8,
    drift: -20,
    delay: -2.2,
    tone: 'middle',
  },
  {
    id: 'smile',
    label: 'you make me smile',
    note: 'Sometimes I smile just because I am thinking about you.',
    x: 505,
    y: 1210,
    floatDuration: 11.8,
    z: 220,
    scale: 0.96,
    rotate: -2,
    drift: 16,
    delay: -1.3,
    tone: 'near',
  },
  {
    id: 'better-days',
    label: 'you make every day better',
    note: 'You make normal days feel softer, lighter, and worth remembering.',
    x: 1000,
    y: 1440,
    floatDuration: 14,
    z: 70,
    scale: 0.84,
    rotate: 7,
    drift: 18,
    delay: -3.1,
    tone: 'far',
  },
  {
    id: 'thank-you',
    label: 'thank you for being you',
    note: 'Thank you for being sweet, funny, stubborn, cute, and somehow exactly you.',
    x: 1390,
    y: 1285,
    floatDuration: 12.6,
    z: 80,
    scale: 0.92,
    rotate: -7,
    drift: -18,
    delay: -0.4,
    tone: 'middle',
  },
  {
    id: 'normal-days',
    label: 'normal days special',
    note: 'The tiny moments with you already mean more to me than big days without you.',
    x: 355,
    y: 1030,
    floatDuration: 15.2,
    z: 60,
    scale: 0.78,
    rotate: 6,
    drift: -26,
    delay: -4.4,
    tone: 'far',
  },
  {
    id: 'beginning',
    label: 'this is just the beginning',
    note: 'I hope we get many more months, more jokes, more memories, and more reasons to choose each other.',
    x: 650,
    y: 1515,
    floatDuration: 13.6,
    z: 120,
    scale: 0.92,
    rotate: 4,
    drift: 22,
    delay: -1.9,
    tone: 'middle',
  },
  {
    id: 'flowers',
    label: 'look at me later 💐',
    note: 'Not yet baby... finish the little sky first 😉',
    x: 1235,
    y: 1580,
    floatDuration: 14.4,
    z: 90,
    scale: 0.88,
    rotate: -8,
    drift: -22,
    delay: -5,
    tone: 'middle',
  },
]

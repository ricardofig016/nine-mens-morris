const levels = {
  mini: {
    size: 3,
    pieces: 3,
    firstOctantConnections: [
      [
        [0, 0],
        [0, 1],
      ],
      [
        [0, 0],
        [1, 1],
      ],
      [
        [0, 1],
        [1, 1],
      ],
    ],
  },
  small: {
    size: 5,
    pieces: 6,
    firstOctantConnections: [
      [
        [0, 0],
        [0, 2],
      ],
      [
        [0, 2],
        [1, 2],
      ],
      [
        [1, 1],
        [1, 2],
      ],
    ],
  },
  normal: {
    size: 7,
    pieces: 9,
    firstOctantConnections: [
      [
        [0, 0],
        [0, 3],
      ],
      [
        [0, 3],
        [1, 3],
      ],
      [
        [1, 1],
        [1, 3],
      ],
      [
        [1, 3],
        [2, 3],
      ],
      [
        [2, 2],
        [2, 3],
      ],
    ],
  },
  big: {
    size: 7,
    pieces: 12,
    firstOctantConnections: [
      [
        [0, 0],
        [0, 3],
      ],
      [
        [0, 0],
        [1, 1],
      ],
      [
        [0, 3],
        [1, 3],
      ],
      [
        [1, 1],
        [1, 3],
      ],
      [
        [1, 1],
        [2, 2],
      ],
      [
        [1, 3],
        [2, 3],
      ],
      [
        [2, 2],
        [2, 3],
      ],
    ],
  },
};

export default levels;

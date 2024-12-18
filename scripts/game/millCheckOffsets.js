const millCheckOffsets = [
  [
    { offset: [-1, 0], distance: 1 }, // upwards
    { offset: [-1, 0], distance: 2 },
  ],
  [
    { offset: [1, 0], distance: 1 }, // downwards
    { offset: [1, 0], distance: 2 },
  ],
  [
    { offset: [-1, 0], distance: 1 }, // up 1 and down 1
    { offset: [1, 0], distance: 1 },
  ],
  [
    { offset: [0, -1], distance: 1 }, // leftwards
    { offset: [0, -1], distance: 2 },
  ],
  [
    { offset: [0, 1], distance: 1 }, // rightwards
    { offset: [0, 1], distance: 2 },
  ],
  [
    { offset: [0, -1], distance: 1 }, // left 1 and right 1
    { offset: [0, 1], distance: 1 },
  ],
  [
    { offset: [-1, -1], distance: 1 }, // up-leftwards
    { offset: [-1, -1], distance: 2 },
  ],
  [
    { offset: [1, 1], distance: 1 }, // down-rightwards
    { offset: [1, 1], distance: 2 },
  ],
  [
    { offset: [-1, -1], distance: 1 }, // up-left 1 and down-right 1
    { offset: [1, 1], distance: 1 },
  ],
  [
    { offset: [-1, 1], distance: 1 }, // up-rightwards
    { offset: [-1, 1], distance: 2 },
  ],
  [
    { offset: [1, -1], distance: 1 }, // down-leftwards
    { offset: [1, -1], distance: 2 },
  ],
  [
    { offset: [-1, 1], distance: 1 }, // up-right 1 and down-left 1
    { offset: [1, -1], distance: 1 },
  ],
];

export default millCheckOffsets;

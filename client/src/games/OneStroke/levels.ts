// levels.ts
// This file defines all the puzzles for the One Stroke game.
// Each level has:
//   - a name and difficulty
//   - a list of NODES, with id and x/y position
//   - a list of EDGES 
// The player must draw through ALL edges exactly once (Eulerian path)

export interface Node {
  id: number       // unique identifier for each dot
  x: number        // horizontal position (0 to 100, like a percentage)
  y: number        // vertical position (0 to 100, like a percentage)
}

export interface Edge {
  from: number     // id of the starting dot
  to: number       // id of the ending dot
}

export interface Level {
  id: number
  name: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Challenge'
  nodes: Node[]
  edges: Edge[]
}

// LEVEL 1 : EASY — Star (5 points)
//        0 (top)
//      /   \
//    4       1
//     \     /
//      3 - 2
const starLevel: Level = {
  id: 1,
  name: 'Star',
  difficulty: 'Easy',
  nodes: [
    { id: 0, x: 50, y: 10 },   // top
    { id: 1, x: 85, y: 40 },   // right
    { id: 2, x: 70, y: 80 },   // bottom-right
    { id: 3, x: 30, y: 80 },   // bottom-left
    { id: 4, x: 15, y: 40 },   // left
  ],
  edges: [
    { from: 0, to: 2 },  // top → bottom-right
    { from: 2, to: 4 },  // bottom-right → left
    { from: 4, to: 1 },  // left → right
    { from: 1, to: 3 },  // right → bottom-left
    { from: 3, to: 0 },  // bottom-left → top
  ]
}

// LEVEL 2 — MEDIUM — House (6 points)
//      0
//    1 - 2
//    |   |
//    3 - 4
const houseLevel: Level = {
  id: 2,
  name: 'House',
  difficulty: 'Medium',
  nodes: [
    { id: 0, x: 50, y: 10 },   // roof top
    { id: 1, x: 25, y: 35 },   // roof left
    { id: 2, x: 75, y: 35 },   // roof right
    { id: 3, x: 25, y: 70 },   // bottom-left
    { id: 4, x: 75, y: 70 },   // bottom-right
  ],
  edges: [
    { from: 0, to: 1 },  // roof top → roof left
    { from: 0, to: 2 },  // roof top → roof right
    { from: 1, to: 2 },  // roof left → roof right
    { from: 1, to: 3 },  // roof left → bottom-left
    { from: 2, to: 4 },  // roof right → bottom-right
    { from: 3, to: 4 },  // bottom-left → bottom-right
  ]
}

// LEVEL 3 — HARD — 3D Rectangle (8 points)
// Front face: 0,1,2,3  Back face: 4,5,6
//   4 ──── 5
//   |╲       ╲
//   |  0 ──── 1
//   |  |      |
//   6  |      |
//    \ |      |
//      3 ──── 2

const rectLevel: Level = {
  id: 3,
  name: '3D Rectangle',
  difficulty: 'Hard',
  nodes: [
  { id: 0, x: 42, y: 40 },  // front top-left
  { id: 1, x: 75, y: 40 },  // front top-right
  { id: 2, x: 75, y: 75 },  // front bottom-right
  { id: 3, x: 42, y: 75 },  // front bottom-left
  { id: 4, x: 22, y: 20 },  // back top-left
  { id: 5, x: 55, y: 20 },  // back top-right
  { id: 6, x: 22, y: 57 },  // back bottom-left
],
  edges: [
    // Front face (square)
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 0 },
    // Back visible edges
    { from: 4, to: 5 },
    { from: 4, to: 6 },
    // Depth lines (front to back)
    { from: 0, to: 4 },
    { from: 1, to: 5 },
    { from: 3, to: 6 },
    { from: 1, to: 3 },
  ]
}

// LEVEL 4 : CHALLENGE — Flower (9 points)
// Outer octagon: 1-8, Inner octagon: 9-16
const flowerLevel: Level = {
  id: 4,
  name: 'Flower',
  difficulty: 'Challenge',
   nodes: [
    // Outer octagon (clockwise from top-left)
    { id: 1,  x: 20, y: 20 },  // top-left
    { id: 2,  x: 50, y: 7  },  // top
    { id: 3,  x: 80, y: 20 },  // top-right
    { id: 4,  x: 93, y: 50 },  // right
    { id: 5,  x: 80, y: 80 },  // bottom-right
    { id: 6,  x: 50, y: 93 },  // bottom
    { id: 7,  x: 20, y: 80 },  // bottom-left
    { id: 8,  x: 7,  y: 50 },  // left
    // Inner octagon (same angles, smaller)
    { id: 9,  x: 35, y: 35 },  // inner top-left
    { id: 10, x: 50, y: 29 },  // inner top
    { id: 11, x: 65, y: 35 },  // inner top-right
    { id: 12, x: 71, y: 50 },  // inner right
    { id: 13, x: 65, y: 65 },  // inner bottom-right
    { id: 14, x: 50, y: 71 },  // inner bottom
    { id: 15, x: 35, y: 65 },  // inner bottom-left
    { id: 16, x: 29, y: 50 },  // inner left
  ],
  edges: [
    // Outer octagon
    { from: 1, to: 2 }, 
    { from: 2, to: 3 }, 
    { from: 3, to: 4 },
    { from: 4, to: 5 }, 
    { from: 5, to: 6 }, 
    { from: 6, to: 7 },
    { from: 7, to: 8 }, 
    { from: 8, to: 1 },
    // Big flower
    { from: 1,  to: 10 }, { from: 2,  to: 11 },
    { from: 10, to: 3  }, { from: 11, to: 4  },
    { from: 3,  to: 12 }, { from: 4,  to: 13 },
    { from: 12, to: 5  }, { from: 13, to: 6  },
    { from: 5,  to: 14 }, { from: 6,  to: 15 },
    { from: 14, to: 7  }, { from: 15, to: 8  },
    { from: 7,  to: 16 }, { from: 8,  to: 9  },
    { from: 16, to: 1  }, { from: 9,  to: 2  },
    // Small flower 
    { from: 9,  to: 12 },
    { from: 12, to: 15 }, 
    { from: 15, to: 10 }, 
    { from: 10, to: 13 },
    { from: 13, to: 16 },
    { from: 16, to: 11 },
    { from: 11, to: 14 },
    { from: 14, to: 9 },
  ]
}

// Export all levels in order
export const levels: Level[] = [
  starLevel,
  houseLevel,
  rectLevel,
  flowerLevel,
]
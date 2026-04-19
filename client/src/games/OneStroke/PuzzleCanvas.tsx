import React, { useState } from 'react';
import { Level } from './levels';

interface Props {
  level: Level; 
  onWin: () => void;  
  onFirstMove: () => void; 
  onRetry: () => void; 
}

interface DrawnEdge {
  from: number;
  to: number;
}

export default function PuzzleCanvas({ level, onWin, onFirstMove, onRetry }: Props) {
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [drawnEdges, setDrawnEdges] = useState<DrawnEdge[]>([]);
  const [visitedPath, setVisitedPath] = useState<number[]>([]);

  function edgeExists(a: number, b: number): boolean {
    return level.edges.some(
      e => (e.from === a && e.to === b) || (e.from === b && e.to === a)
    );
  }

  function edgeAlreadyDrawn(a: number, b: number): boolean {
    return drawnEdges.some(
      e => (e.from === a && e.to === b) || (e.from === b && e.to === a)
    );
  }

  function handleNodeClick(nodeId: number) {

    // Start case 1 : 
    if (currentNode === null) {
      onFirstMove();
      setCurrentNode(nodeId);
      setVisitedPath([nodeId]);
      return;
    }

    // Case 2: Player clicked the same node → deselect (reset start)
    if (currentNode === nodeId) {
      return;
    }

    // Case 3: Edge doesn't exist = invalid move, no action
    if (!edgeExists(currentNode, nodeId)) return;

    // Case 4: Edge already drawn = invalid move, no action
    if (edgeAlreadyDrawn(currentNode, nodeId)) return;

    // Case 5: Valid move! Draw the edge
    const newDrawnEdges = [...drawnEdges, { from: currentNode, to: nodeId }];
    const newPath = [...visitedPath, nodeId];

    setDrawnEdges(newDrawnEdges);
    setVisitedPath(newPath);
    setCurrentNode(nodeId);

    // Check if all edges are drawn → player wins!
    if (newDrawnEdges.length === level.edges.length) {
      setTimeout(onWin, 400); // small delay to let the player sees the last line
    }
  }

  // Reset the puzzle 
  function handleReset() {
    setCurrentNode(null);
    setDrawnEdges([]);
    setVisitedPath([]);
    onRetry();
  }

  // SVG viewBox is 100x100 —> node coordinates in levels.ts are % based 
  const SIZE = 100;

  return (
    <div className="puzzle-wrapper">

      {/* The SVG canvas */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="puzzle-svg"
      >
        {/* ── LAYER 1: Ghost edges (full pattern, always visible) ── */}
        {level.edges.map((edge, i) => {
          const fromNode = level.nodes.find(n => n.id === edge.from)!;
          const toNode   = level.nodes.find(n => n.id === edge.to)!;
          return (
            <line
              key={`ghost-${i}`}
              x1={fromNode.x} 
              y1={fromNode.y}
              x2={toNode.x} 
              y2={toNode.y}
              stroke="var(--edge-ghost)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        {/* ── LAYER 2: Drawn edges (player's path so far) ── */}
        {drawnEdges.map((edge, i) => {
          const fromNode = level.nodes.find(n => n.id === edge.from)!;
          const toNode   = level.nodes.find(n => n.id === edge.to)!;
          return (
            <line
              key={`drawn-${i}`}
              x1={fromNode.x} 
              y1={fromNode.y}
              x2={toNode.x} 
              y2={toNode.y}
              stroke="var(--edge-drawn)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* ── LAYER 3: Nodes (dots) ── */}
        {level.nodes.map(node => {
          const isActive  = node.id === currentNode;
          const isVisited = visitedPath.includes(node.id);

          return (
            <circle
              key={`node-${node.id}`}
              cx={node.x}
              cy={node.y}
              r={isActive ? 4.5 : 3.5}
              fill={
                isActive  ? 'var(--node-active)' :
                isVisited ? 'var(--node-color)'  :
                            'var(--node-ghost)'
              }
              stroke={isActive ? 'var(--node-color)' : 'none'}
              strokeWidth="1.5"
              onClick={() => handleNodeClick(node.id)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}
      </svg>

      {/* Reset button */}
      <button className="reset-btn" onClick={handleReset}>
        ↺ Reset
      </button>

    </div>
  );
}
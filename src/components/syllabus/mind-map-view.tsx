"use client";

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type DefaultEdgeOptions,
  type FitViewOptions,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { type SyllabusTopic } from '@/lib/syllabus-data';

interface MindMapViewProps {
  data: SyllabusTopic[];
}

const nodeWidth = 200;
const nodeHeight = 50; // Estimated height, actual might vary
const verticalGap = 20;
const horizontalGap = 280;

// A recursive function to lay out the nodes in a tree structure.
const generateLayout = (
  topics: SyllabusTopic[],
  level = 0,
  yOffset = 0,
  parent: SyllabusTopic | null = null
): { nodes: Node[]; edges: Edge[]; height: number } => {
  const allNodes: Node[] = [];
  const allEdges: Edge[] = [];
  let currentY = yOffset;

  topics.forEach((topic) => {
    const nodeId = topic.id;

    // First, process children to get their layout and total height
    let subTreeHeight = 0;
    if (topic.subtopics && topic.subtopics.length > 0) {
      const { nodes: childNodes, edges: childEdges, height } = generateLayout(
        topic.subtopics,
        level + 1,
        currentY,
        topic
      );
      allNodes.push(...childNodes);
      allEdges.push(...childEdges);
      subTreeHeight = height;
    }

    // Now, position the current node.
    // It's placed vertically in the middle of the area its children occupy.
    const nodeX = level * horizontalGap;
    const nodeY =
      currentY + (subTreeHeight > 0 ? subTreeHeight / 2 - nodeHeight / 2 : 0);
    
    allNodes.push({
      id: nodeId,
      data: { label: topic.title },
      position: { x: nodeX, y: nodeY },
      type: 'default',
      style: {
        width: nodeWidth,
        textAlign: 'center',
        fontSize: '12px',
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        border: '1px solid hsl(var(--border))',
      },
      sourcePosition: 'right',
      targetPosition: 'left',
    });

    // Add edge from parent to the current node
    if (parent) {
      allEdges.push({
        id: `e-${parent.id}-${nodeId}`,
        source: parent.id,
        target: nodeId,
        type: 'smoothstep',
      });
    }

    // The Y for the next sibling starts after the current node's subtree
    currentY += Math.max(nodeHeight, subTreeHeight) + verticalGap;
  });
  
  const totalHeight = currentY - yOffset - (topics.length > 0 ? verticalGap : 0);

  return { nodes: allNodes, edges: allEdges, height: totalHeight };
};

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {};

export default function MindMapView({ data }: MindMapViewProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => generateLayout(data),
    [data]
  );
  
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  React.useEffect(() => {
    // Recalculate layout if data changes
    const { nodes: newNodes, edges: newEdges } = generateLayout(data);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [data]);

  return (
    <div className="h-[75vh] w-full rounded-lg border bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

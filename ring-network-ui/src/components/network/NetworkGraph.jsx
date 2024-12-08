import { useEffect, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import { PowerSettingsNew as PowerIcon, Delete as DeleteIcon } from '@mui/icons-material';

const NetworkGraph = ({ nodes, messages, onNodeClick, onToggleStatus, onDeleteNode }) => {
  const fgRef = useRef();

  const graphData = {
    nodes: nodes.map(node => ({
      ...node,
      id: node.nodeId,
      status: node.status,
      inboxSize: node.inboxSize || 0,
    })),
    links: nodes.map(node => ({
      source: node.nodeId,
      target: node.rightNeighbor,
      direction: 'right'
    }))
  };

  // Arrange nodes in a circle
  const arrangeNodesInRing = useCallback(() => {
    const angleStep = (2 * Math.PI) / nodes.length;
    const radius = 200;

    nodes.forEach((node, i) => {
      const angle = i * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      node.x = x;
      node.y = y;
      node.fx = x; // Fix X position
      node.fy = y; // Fix Y position
    });
  }, [nodes]);

  useEffect(() => {
    if (fgRef.current && nodes.length > 0) {
      arrangeNodesInRing();
      fgRef.current.zoomToFit(400);
    }
  }, [nodes, arrangeNodesInRing]);

  const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
    const label = `Node ${node.id}`;
    const fontSize = 12/globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const backgroundDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = node.status === 'ACTIVE' ? '#4caf50' : '#f44336';
    ctx.fill();

    // Draw node label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(
      node.x - backgroundDimensions[0] / 2,
      node.y + 8,
      backgroundDimensions[0],
      backgroundDimensions[1]
    );
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(label, node.x, node.y + 8 + fontSize/2);

    // Draw inbox count
    if (node.inboxSize > 0) {
      const inboxLabel = `${node.inboxSize}`;
      ctx.fillStyle = '#1976d2';
      ctx.beginPath();
      ctx.arc(node.x + 10, node.y - 10, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText(inboxLabel, node.x + 10, node.y - 10);
    }
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, height: '600px', width: '100%', position: 'relative' }}>
      <Box sx={{ height: '100%', width: '100%' }}>
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeCanvasObject={nodeCanvasObject}
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.2}
          linkWidth={1}
          onNodeClick={(node) => onNodeClick && onNodeClick(node)}
          cooldownTicks={50}
          onEngineStop={() => arrangeNodesInRing()}
        />
      </Box>
      {onToggleStatus && onDeleteNode && (
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <Tooltip title="Toggle Node Status">
            <IconButton onClick={() => onToggleStatus(selectedNode?.id)}>
              <PowerIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Node">
            <IconButton onClick={() => onDeleteNode(selectedNode?.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Paper>
  );
};

export default NetworkGraph; 
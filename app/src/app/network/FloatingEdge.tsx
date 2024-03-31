import { useCallback } from 'react';
import { useStore, getStraightPath, Edge, MarkerType } from 'reactflow';
import { getEdgeParams } from './utils';



function FloatingEdge({ id, source, target,  style } : Edge) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={MarkerType.Arrow}
      style={style}
    />
  );
}

export default FloatingEdge;

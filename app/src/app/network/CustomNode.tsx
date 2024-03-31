import { Node, Handle, Position, ReactFlowState, useStore, NodeProps } from 'reactflow';

export default function CustomNode(props : NodeProps<Node>) {

  const label = props.id;

  return (
    <div className="customNode">
        {label}
      </div>
    
  );
}

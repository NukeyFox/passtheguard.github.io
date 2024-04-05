import { Node, Handle, Position, ReactFlowState, useStore, NodeProps } from 'reactflow';
import "./nodestyle.css"
import { BJJPosition } from '../../database/db_node_components';
export default function CustomNode(props : NodeProps<BJJPosition>) {

  const label =  props.data.label || "Label";

  return (
    <div className="custom-node">
      <Handle id="undefined" type="source" position={Position.Top} className='handle-style'></Handle>
      <Handle id="undefined" type="target" position={Position.Bottom} className='handle-style'></Handle>
        <label>{label}</label>
      </div>
    
  );
}

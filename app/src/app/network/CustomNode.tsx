import { Handle, Position, NodeProps } from 'reactflow';
import "./nodestyle.css"
import { BJJPosition } from '../../database/db_node_components';
export default function CustomNode(props : NodeProps<BJJPosition>) {

  const label =  props.data.label || "Label";

  return (
    <div className="custom-node">
      <Handle id="src" type="source" position={props.sourcePosition || Position.Top} className='handle-style'></Handle>
      <Handle id="tgt" type="target" position={props.sourcePosition || Position.Bottom} className='handle-style'></Handle>
        <label>{label}</label>
      </div>
    
  );
}

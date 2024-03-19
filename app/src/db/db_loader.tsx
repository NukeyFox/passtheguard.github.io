import {BJJPosition} from "./db_node_components"
import { Node } from "reactflow"

function positionToNode(pos : BJJPosition) : Node {
    return { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } }
}

function GraphDB(){
    return "Database not implemented";
}
export default GraphDB;
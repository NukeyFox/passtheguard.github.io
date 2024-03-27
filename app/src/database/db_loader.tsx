import {BJJPosition, BJJPositionType, BJJTransition} from "./db_node_components"
import { Node } from "reactflow"
import graph from "./db.json"

function getNodes() : BJJPosition[]{
    let nodes : BJJPosition[] = (graph.nodes).map((entry) => ({
        name : entry.id,
        aliases : entry.attr.aliases,
        description : entry.attr.description,
        pos_type : BJJPositionType.Stance,
        valid_in_sports : [],
        reference : [],
        diagram : null,
        comments :  null}
    ));
    return nodes;
}

function GraphDB() {
    return "Database not implemented";
}
export default GraphDB;
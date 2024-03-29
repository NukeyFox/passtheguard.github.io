import {BJJPosition, BJJPositionType, BJJTransition, BJJTransitionType} from "./db_node_components"
import { Node, Edge, MarkerType } from "reactflow"
import graph from "./db.json"

type BJJPositionMap = Map<string, BJJPosition>;

function getNodes() : BJJPositionMap{
    const node_map = new Map<string, BJJPosition>();
    (graph.nodes).map((entry) => 
        (
            node_map.set(
                entry.id, 
                {
                    name : entry.id,
                    aliases : entry.attr.aliases,
                    description : entry.attr.description,
                    pos_type : BJJPositionType.Stance,
                    valid_in_sports : [],
                    reference : [],
                    diagram : null,
                    comments :  null}
                )
    ));
    return node_map;
}

function getLinks(node_map : BJJPositionMap ) : BJJTransition[]{
    let links : BJJTransition[] = (graph.links).map((entry) => ({
        name : entry.id, 
        from_pos : node_map.get(entry.source), 
        to_pos : node_map.get(entry.target),
        description : entry.attr.description,
        trans_type : BJJTransitionType.Takedown,
        aliases : entry.attr.reference,
        valid_in_sports : [],
        reference : [],
        diagram : null,
        comments : null
        }
    ));
    return links;
}

function createInitialNode(node_map : BJJPositionMap) : Node[]{
    var node_list : Node[] = []; 
    node_map.forEach((value, key, map) => (
        node_list.push({
            id : value.name,
            position : {x : Math.random()*600+50, y : Math.random()*600+50},
            data : {label : value.name}}
        )
    ));
    return node_list;
}

function createInitialEdge(edge_list : BJJTransition[]) : Edge[]{
    var edge_list_rf : Edge[] = [];
    edge_list.forEach((value, index, array) => (
        edge_list_rf.push({
            id : value.name || "",
            source : (value.from_pos?.name) || "",
            target : (value.to_pos?.name) || "",
            label : value.name,
            markerEnd: {
                type: MarkerType.Arrow,
                width: 20,
                height: 20,
              },
        })
    ));
    
    return  edge_list_rf;
}

function GraphDB() {
    const nodeMap = getNodes();
    const edgeList = getLinks(nodeMap);
    const initialNodes = createInitialNode(nodeMap);
    const initialEdges = createInitialEdge(edgeList);
    initialNodes.forEach(function (value) {
        console.log(value);
    });
    initialEdges.forEach(function (value) {
        console.log(value);
    });
    return {node_map : nodeMap, edge_list : edgeList, initial_nodes : initialNodes, initial_edges : initialEdges};
}
export default GraphDB;
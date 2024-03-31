import {BJJPosition, BJJPositionType, BJJTransition, BJJTransitionType, Sports} from "./db_node_components"
import { Node, Edge, MarkerType } from "reactflow"
import graph from "./db.json"
import "../app/network/nodestyle.css";
type BJJPositionMap = Map<string, BJJPosition>;

function getNodes() : BJJPositionMap{
    var i = 0;
    const node_map = new Map<string, BJJPosition>();
    (graph.nodes).map((entry) => 
        (
            node_map.set(
                entry.id, 
                {
                    id_no : i++,
                    name : entry.id,
                    aliases : entry.attr?.aliases || [],
                    description : entry.attr?.description || "",
                    pos_type : BJJPositionType[entry.attr.pos_type as keyof typeof BJJPositionType],
                    valid_in_sports : entry.attr?.valid_in_sports.map((sport) => Sports[sport as keyof typeof Sports]),
                    reference : [],
                    diagram : null,
                    comments :  entry.attr.comments}
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
            id : value.id_no.toString(),
            position : {x : Math.random()*600+50, y : Math.random()*600+50},
            data : {label : value.name},
            connectable: false,
            //type : "custom"
            }
        )
    ));
    return node_list;
}

function createInitialEdge(edge_list : BJJTransition[], node_map : BJJPositionMap) : Edge[]{
    var edge_list_rf : Edge[] = [];
    edge_list.forEach((value, index, array) => (
        edge_list_rf.push({
            id : value.name || "",
            source : node_map.get((value.from_pos?.name) || "")?.id_no.toString() || "",
            target : node_map.get((value.to_pos?.name) || "")?.id_no.toString() || "",
            label : value.name,
            markerEnd: {
                type: MarkerType.Arrow,
                width: 20,
                height: 20,
              },
              type : "floating"
        })
    ));
    
    return  edge_list_rf;
}

function GraphDB() {
    const nodeMap = getNodes();
    const edgeList = getLinks(nodeMap);
    const initialNodes = createInitialNode(nodeMap);
    const initialEdges = createInitialEdge(edgeList, nodeMap);
  
    return {node_map : nodeMap, edge_list : edgeList, initial_nodes : initialNodes, initial_edges : initialEdges};
}
export default GraphDB;
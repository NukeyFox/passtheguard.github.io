import React, {useState, useEffect, useCallback, useMemo} from 'react';
import './App.css';
import ReactFlow, { Node as RFNode, Edge, useNodesState, useEdgesState, useReactFlow, useStore, ReactFlowProvider, addEdge, useOnSelectionChange } from 'reactflow'
import GraphDB from "../database/db_loader";
import { Choices } from './infopanel/infopanel_components';
import PanelOverlay from "./infopanel/InfoPanel"
import { forceSimulation, forceLink, forceManyBody, forceX, forceY, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import collide from './collide';
import 'reactflow/dist/style.css';
import FloatingEdge from './network/FloatingEdge';
import CustomNode from './network/CustomNode';
import SelectedNode from "./network/SelectedNode"
import { BJJPosition, BJJPositionType, BJJTransition } from '../database/db_node_components';
import { Path } from "./functions/depthfirst";


interface SimNode extends SimulationNodeDatum{
  data : RFNode<BJJPosition>
}
const edgeTypes = {
  floating: FloatingEdge,
};
const nodeTypes = {
  custom: CustomNode,
  selected : SelectedNode
};

function StartUp(){


}

function App() {
 

  const data = useMemo(() => GraphDB(),[]);

 
  const [nodes, setNodes, onNodesChange] = useNodesState<BJJPosition>(data.initial_nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<BJJTransition>(data.initial_edges);
  const [choice, setChoice] = useState<Choices>(Choices.None)

  const [isOpen, setIsOpen] = useState(false);


  const [selectedElem, setselectedElem] = useState<BJJPosition|BJJTransition|undefined>(undefined);
  const [searchPath, setSearchPath] = useState<Path>([]);
  const [adjustNodes, setAdjustNodes] = useState<boolean>(true);

  const onNodeClick = useCallback((event: React.MouseEvent<Element>, node: RFNode<BJJPosition>) => {
      resetNodesEdges();
      setselectedElem(node.data); 
      highlightNode(node)
      setChoice(Choices.BJJPositionSelection)}, [selectedElem]);

  const resetNodesEdges = (() => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => 
        ({ ...n, type : 'custom' })));
    setEdges((prevEdge) =>
      prevEdge.map((e) => 
        ({ ...e, style : {...e.style, stroke : "white"}})));
  });

  const highlightNode = ((node : RFNode<BJJPosition>) => (
      setNodes((prevNodes) =>
        prevNodes.map((n) => 
          (n.id === node.id) ? { ...n, type : 'selected' } : n))
  ));

  const highlightEdge = ((edge : Edge<BJJTransition>) => (
    setEdges((prevNodes) =>
      prevNodes.map((e) => 
        (edge.id === e.id ? { ...e, style : {...e.style, stroke : "red"}} : e)))
));

  const highlightPath = (path : Path) => {
    resetNodesEdges();
    for (var elem of path){
      if (elem.data !== undefined) {
          if (elem.data.type == "BJJPosition"){
          highlightNode(elem as RFNode<BJJPosition>);
        } else {
          highlightEdge(elem as Edge<BJJTransition>);
        }
    }
    }
  };


  const onEdgeClick = useCallback((event: React.MouseEvent<Element>, edge: Edge<BJJTransition>) => {
      resetNodesEdges();
      setselectedElem(edge.data); 
      highlightEdge(edge)
      setChoice(Choices.BJJTransitionSelection);
  }, [selectedElem]);

  const simulation = forceSimulation()
      .force('charge', forceManyBody().strength(-2000))
      .force('x', forceX().x(0).strength(0.1))
      .force('y', forceY().y(0).strength(0.1))
      .force('collide', collide())
      .alphaTarget(0.05)
      .stop();

  const useLayoutedElements = () => {
        const { getNodes, setNodes, getEdges, fitView } = useReactFlow<BJJPosition, BJJTransition>();
        const initialised = useStore((store) =>
          [...store.nodeInternals.values()].every((node) => node.width && node.height)
        );
  
    return useMemo(() => {
      let nodes : SimNode[] = getNodes().map((node,i) => ({ index : parseInt(node.id), x: node.position.x, y: node.position.y, data : node}));
      let edges : SimulationLinkDatum<SimNode>[] = getEdges().map((edge) => ({source : parseInt(edge.source), target : parseInt(edge.target)}));
      
      //let edgeCenters = getEdges().map((edge,i) => {index : parseInt()}
  
      simulation.nodes(nodes).force(
        'link',
        forceLink(edges)
          .id((d) => d.index || 0)
          .strength(0.05)
          .distance(350)
      );
  
      // The tick function is called every animation frame while the simulation is
      // running and progresses the simulation one step forward each time.
      const tick = () => {
    
        simulation.tick();
        setNodes(nodes.map((node) => ({ ...node.data, position: { x: node.x || node.data.position.x, y: node.y || node.data.position.y} })));
        window.requestAnimationFrame(() => {
        fitView();
        if (simulation.alpha() < 0.5) simulation.stop();
        else tick();
        
        });
      };
      
     
      window.requestAnimationFrame(tick);

      simulation.stop()
      return initialised;
    }, [fitView, getEdges, initialised]);
  };

 // useEffect(highlightNode, [highlightNode, selectedElem]);
  useLayoutedElements();
  //const onConnect = useCallback((params : Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);


  return (
    <div className="App">
        <div style={{ width: "70vw", height: "100vh"}}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              fitView
              edgeTypes={edgeTypes}
              nodeTypes={nodeTypes}
              style={{backgroundColor:"#000000"}}
            />
          </div>
       {<PanelOverlay selection={choice}
                      data={selectedElem}
                      pathHighlight={highlightPath}
                      nullFunc={() => {setChoice(Choices.None); resetNodesEdges();}}>children 
        </PanelOverlay>}
        </div>

  );
}

export default function () {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

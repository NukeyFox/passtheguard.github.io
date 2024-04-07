import React, {useState, useEffect, useCallback, useMemo} from 'react';
import './App.css';
import ReactFlow, { Node, Edge, useNodesState, useEdgesState, useReactFlow, useStore, ReactFlowProvider, addEdge } from 'reactflow'
import GraphDB from "../database/db_loader";
import { Choices } from './infopanel/infopanel_components';
import PanelOverlay from "./infopanel/InfoPanel"
import { forceSimulation, forceLink, forceManyBody, forceX, forceY, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import collide from './collide';
import 'reactflow/dist/style.css';
import FloatingEdge from './network/FloatingEdge';
import CustomNode from './network/CustomNode';
import { BJJPosition, BJJTransition } from '../database/db_node_components';


interface SimNode extends SimulationNodeDatum{
  data : Node<BJJPosition>
}
const edgeTypes = {
  floating: FloatingEdge,
};
const nodeTypes = {
  custom: CustomNode,
};

function App() {
  const data = GraphDB();
  const [nodes, setNodes, onNodesChange] = useNodesState<BJJPosition>(data.initial_nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<BJJTransition>(data.initial_edges);
  const [choice, setChoice] = useState<Choices>(Choices.None)

  const [isOpen, setIsOpen] = useState(false);


  const [selectedElem, setselectedElem] = useState<BJJPosition|BJJTransition|undefined>(undefined);
  const onNodeClick = useCallback((event: React.MouseEvent<Element>, node: Node<BJJPosition>) => {
    if (selectedElem === node.data) 
      {setselectedElem(undefined); }
    else
     {setselectedElem(node.data); 
      setChoice(Choices.BJJPositionSelection)};
  }, [selectedElem]);

  const onEdgeClick = useCallback((event: React.MouseEvent<Element>, edge: Edge<BJJTransition>) => {
    if (selectedElem === edge.data) 
    {setselectedElem(undefined); }
    else
    {
      setselectedElem(edge.data); 
      setChoice(Choices.BJJTransitionSelection)
    };
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
    }, [fitView, getEdges, getNodes, initialised, setNodes]);
  };

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
                      data={selectedElem }>children 
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

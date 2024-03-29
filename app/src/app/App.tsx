import React, {useState, useEffect, useCallback} from 'react';
import logo from './logo.svg';
import './App.css';
import ReactFlow, { Node, Edge, useNodesState, useEdgesState } from 'reactflow'
import GraphDB from "../database/db_loader";
import graph from "../database/db.json"

import 'reactflow/dist/style.css';
 



function App() {
  const data = GraphDB();
  const [nodes, setNodes, onNodesChange] = useNodesState(data.initial_nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.initial_edges);



  return (
    <div className="App">
      <header className="App-header">
        <p style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        />
      </p>
      </header>
    </div>

  );
}

export default App;

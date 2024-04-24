import json
import os
from typing import Optional, Any
from networkx import MultiDiGraph, draw
from networkx.readwrite import json_graph
import matplotlib.pyplot as plt



class GraphManager(MultiDiGraph):
    def __init__(self, graph_filename : str, **attr):
        """
        Load the graph from file
        """
        self.graph_filename = graph_filename
        if os.path.exists(graph_filename):
            with open(graph_filename, "r") as f:
                js_graph = json.load(f)
            self.graph = MultiDiGraph(json_graph.node_link_graph(js_graph))
        else:
            self.graph = MultiDiGraph()
            g_json = json_graph.node_link_data(self.graph)
            with open(graph_filename,"w+") as f:
                json.dump(g_json,f,indent=2)
        super().__init__(incoming_graph_data=self.graph, **attr)

    def save_graph(self, output_file : Optional[str] = None) -> None:
        output_file = self.graph_filename if output_file is None else output_file
        g_json = json_graph.node_link_data(self)
        with open(output_file,"w") as f:
                json.dump(g_json,f,indent=2)

    def get_parallel_edges(self, source : str, target : str):
        filter_target = lambda tgt : lambda x : x[1] == tgt
        outgoing = filter(filter_target(target), self.edges(source, data=False, keys=True))
        incoming = filter(filter_target(source), self.edges(target, data=False, keys=True))
        res = list(set(outgoing).union(set(incoming)))
        return res

    def add_node_safe(self, 
                    name : str,
                    aliases : list[str] = [],
                    description : str = "",
                    pos_type : str = "",
                    variations : list[str] = [],
                    valid_in_sports : list[str] = [],
                    references : list[dict[str,str]] = [],
                    comments : str = ""  ):
        self.add_node(name, 
                      attr= {"aliases" : aliases,
                        "description" : description,
                        "pos_type" : pos_type,
                        "valid_in_sports" : valid_in_sports,
                        "variations" : variations,
                        "reference" : references, 
                        "comments" :comments })
        
    def update_link_attr(self, 
                    name : str,
                    from_pos : str, 
                    to_pos : str,
                    updates : dict[str,Any]):
        for key, val in updates.items():
            self[from_pos][to_pos][name]["attr"][key] = val

    def add_link_safe(self, 
                    name : str,
                    from_pos : str = "",
                    to_pos : str = "",
                    description : str = "",
                    trans_type : str = "",
                    variations : list[str] = [],
                    aliases : list[str] = [],
                    valid_in_sports : list[str] = [],
                    references : list[str] = [],
                    initiatedBy : str = "None",
                    comments : str = ""  ):
        para_edges = self.get_parallel_edges(from_pos,to_pos)
        if self.has_edge(from_pos,to_pos,name):
            return #Don't do anything if edge exists already
        p = len(para_edges)
        self.add_edge(u_for_edge= from_pos,
                      v_for_edge=to_pos, 
                      id = name,
                      key = name,
                      attr= {
                        "aliases" : aliases,
                        "description" : description,
                        "valid_in_sports" : valid_in_sports,
                        "trans_type" : trans_type,
                        "reference" : references,
                        "variations" : variations,
                        "initiatedBy" : initiatedBy,
                        "comments" :comments,
                        "parallel_edges" : p+1,
                        "edge_no" : p})
        for from_pos, to_pos, key in para_edges:
            self.update_link_attr(key,from_pos,to_pos,{"parallel_edges" : p+1})
        
GRAPH = GraphManager("./app/src/database/db.json")

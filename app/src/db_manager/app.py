import dbreader
from graph_functions import GRAPH

if __name__ == "__main__":
    dbreader.add_nodes_to_graph()
    GRAPH.save_graph()
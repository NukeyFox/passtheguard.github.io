import dbreader
from graph_functions import GRAPH
import os

if __name__ == "__main__":
    if os.path.exists("./app/src/database/db.json"):
        os.remove("./app/src/database/db.json")
    dbreader.add_nodes_to_graph()
    dbreader.add_links_to_graph()
    GRAPH.save_graph()
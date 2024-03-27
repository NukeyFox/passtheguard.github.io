import json

import flask
import networkx as nx

#json.dump(d, open("./graph.json", "w"))

# Serve the file over http to allow for cross origin requests
app = flask.Flask(__name__, static_folder="force")


@app.route("/")
def static_proxy():
    pass

app.run(port=8000)
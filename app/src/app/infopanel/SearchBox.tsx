import { Dispatch, SetStateAction, useState } from "react"
import Select, { ActionMeta, SingleValue } from "react-select";
import GraphDB from "../../database/db_loader";
import { BJJPosition, BJJTransition } from "../../database/db_node_components";
import {Node, Edge} from "reactflow"

interface SearchBoxProp{
    selectionCallback : Dispatch<SetStateAction<Node<BJJPosition> | Edge<BJJTransition> | undefined>>
}

export interface SearchItem{
    value : string,
    label : string,
    type : string
} 

function comp(o1 : SearchItem, o2 : SearchItem) : number{
    if (o1.label > o2.label) return 1; 
    if (o1.label < o2.label) return -1;
    return 0;
}

export default function SearchBox({selectionCallback} : SearchBoxProp) {
    const data = GraphDB()
    const aliases = new Array<SearchItem>();
    const nodes = Array.from(data.node_map.keys());
    for (var node of nodes){
        aliases.push({value : node, label : node, type : "BJJPosition"});
        const names = data.node_map.get(node)?.data.aliases;
        if (names !== undefined){
            for (var nalias of names){
                aliases.push({value : node, label : nalias, type : "BJJPosition"});
            }
        }
    }
    aliases.sort(comp)
    for (var edge of data.initial_edges){
        if (edge.data !== undefined){
            const name = edge.data.name;
            if (name !== null){
                aliases.push({value : name, label : name, type : "BJJTransition"});
                for (var ealias of edge.data?.aliases){
                    aliases.push({value : name, label : ealias, type : "BJJTransition"})
                }
            }
        }
        
    }


    function setState(selected:  SingleValue<SearchItem>, action : ActionMeta<SearchItem>){
        
        if (selected === null) {selectionCallback(undefined);}
        else {
            if (selected.type === "BJJPosition"){
                const elem = data.node_map.get(selected?.value)
                selectionCallback(elem)}
            else {
                const elem = data.initial_edges.find((edge) => edge.data?.name === selected.value);
                selectionCallback(elem);
            }
    }
    }

    return (
        <div>
        <p>Search for Position or Move </p>
        <Select
            options={aliases}
            onChange={setState}
        />
        </div>
    );

}
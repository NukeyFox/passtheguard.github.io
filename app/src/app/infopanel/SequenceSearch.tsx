import { useMemo, useState } from "react";
import Select, { ActionMeta } from 'react-select';
import GraphDB from "../../database/db_loader";
import { DepthFirst, Path} from "../functions/depthfirst";

interface SequenceSearchProp {
    pathHighlight : (path : Path) => void;
}

interface OptionSelection{
    value : number,
    label : string,
}

function* count() : Generator<number,any,any> {
    var n = 0;
    while(true) {
        yield n;
        n++;
    }
}

function comp(o1 : OptionSelection, o2 : OptionSelection) : number{
    if (o1.label > o2.label) return 1; 
    if (o1.label < o2.label) return -1;
    return 0;
}

function SequenceSearch({pathHighlight} : SequenceSearchProp) {
    const data = GraphDB()
    const nodes = Array.from(data.node_map.keys());
    const [options, setOptions] = useState<OptionSelection[]>([]);
    const [selectedPath, setSelectedPath] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<readonly OptionSelection[]>([]);
    const counter = useMemo(() => count(),[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useMemo(() => setOptions(nodes.map((x) => ({value : counter.next().value, label : x})).sort(comp)),[])
    
    const onSelect = (selectedList : readonly OptionSelection[], action : ActionMeta<OptionSelection>) => {
    if (action.action === "select-option" && action.option !== undefined)
       { 
        setSelectedPath(selectedList.map((x)=>x.label));
        setSelectedOptions(selectedList);
        const opt = [...options, {value : counter.next().value, label : action.option.label}].sort(comp);
        setOptions(opt);
        } else 
    if (action.action === "remove-value") {
        setSelectedPath(selectedList.map((x)=>x.label));
        setSelectedOptions(selectedList);
        const opt = [...options.filter((x) => action.removedValue.label !== x.label), 
                        {value : counter.next().value, label : action.removedValue.label}
        ].sort(comp);
        setOptions(opt);
        }
    };


    const onSearchClick = (()=>{
        var path : Path = [];
        const n = selectedOptions.length;
        var validPath :boolean = true;
        if (n >= 2){
            for (var i = 0; i < n-1; i++){
                var source = data.node_map.get(selectedPath[i]);
                var target = data.node_map.get(selectedPath[i+1]);
                var r = DepthFirst(source,target,data.adjMap);
                const p = r.next();
                if (p.value !== undefined) path = path.concat(p.value);
                else {validPath = false; break;}
            }
            if (validPath) pathHighlight(path);
            else {console.log("No valid path found...")}
        }
    }
        
        
    );
  
    return (
        <div>
        <p>Sequence Search: </p>
        <Select
            isMulti // Enables multi-selection
            options={options}
            onChange={onSelect}
            value={selectedOptions}
        />
        <button onClick={onSearchClick}>Search</button>
        </div>
    );

}
export default SequenceSearch;
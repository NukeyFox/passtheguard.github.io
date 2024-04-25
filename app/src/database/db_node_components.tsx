import {Node} from "reactflow"

export enum Sports {
    MMA = "MMA", 
    BJJ = "BJJ", 
    MuayThai = "Muay Thai", 
    FreestyleWrestling = "Freestyle Wrestling", 
    NoGiBJJ = "No-gi BJJ", 
    Judo = "Judo"
}

export function SportsToString(sport : Sports) : string{
    switch(sport){
        case Sports.MMA: return "MMA";
        case Sports.BJJ: return  "BJJ";
        case Sports.MuayThai: return "Muay Thai"; 
        case Sports.FreestyleWrestling : return"Freestyle Wrestling";
        case Sports.NoGiBJJ : return"No-gi BJJ";
        case Sports.Judo : return "Judo"
    }
}

export function StringToSport(str : string) : Sports{
    switch(str){
        case "MMA" : return Sports.MMA;
        case "BJJ" : return Sports.BJJ;
        case "Muay Thai" : return Sports.MuayThai;
        case "Freestyle Wrestling" : return Sports.FreestyleWrestling;
        case "No-gi BJJ" : return Sports.NoGiBJJ;
        case "Judo" : return Sports.Judo; 
        default:
            return Sports.MMA;
    }
}

export enum ResourceType {
    Image = "Image",
    YoutubeVideo = "YoutubeVideo",
    Article = "Article",
    Instructional = "Instructional"
}


export enum BJJPositionType {
    Stance = "Stance", 
    Guard = "Guard", 
    Clinch = "Clinch",
    Pin = "Pin", 
    Grip = "Grip",
    Choke = "Choke",
    Submission = "Submission",
    SubmissionSetup = "Submission Setup"
}

export enum BJJTransitionType {
    Takedown,
    Sweep,
    Reversal,
    Escape,
    Transition,
    Submission
}

export type Reference = {
    resource_type : ResourceType,
    resource_name : string | null,
    resource : string,
}

export type BJJPosition = {
    id_no : number,
    label: string,
    aliases : string[],
    description : string,
    variations : string[],
    pos_type : BJJPositionType,
    valid_in_sports : Sports[], 
    reference : Reference[],
    comments : string | null,
    type : string
}

export enum Players {
    Top, 
    Bottom, 
    Any, 
    None
}


export type BJJTransition = {

    name : string | null, 
    from_pos : Node<BJJPosition> | undefined, 
    to_pos : Node<BJJPosition> | undefined,
    description : string,
    trans_type : BJJTransitionType,
    variations : string[],
    aliases : string[],
    parallel_edges : number,
    edge_no : number,
    valid_in_sports : Sports[],
    reference : Reference[],
    comments : string | null,
    initiatedBy : Players,
    type : string,


}
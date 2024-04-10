export enum Sports {
    MMA = "MMA", 
    BJJ = "BJJ", 
    MuayThai = "Muay Thai", 
    FreestyleWrestling = "Freestyle Wrestling", 
    NoGiBJJ = "No-gi BJJ", 
    Judo = "Judo"
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
    Pin = "Pin", 
    Grip = "Grip",
    Choke = "Choke",
    Submission = "Submission"
}

export enum BJJTransitionType {
    Takedown,
    Sweep,
    Reversal
}

export type Reference = {
    resource_type : ResourceType,
    resource_name : string | null,
    resource : string
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
}



export type BJJTransition = {

    name : string | null, 
    from_pos : BJJPosition | undefined, 
    to_pos : BJJPosition | undefined,
    description : string,
    trans_type : BJJTransitionType,
    variations : string[],
    aliases : string[],
    parallel_edges : number,
    edge_no : number,
    valid_in_sports : Sports[],
    reference : Reference[],
    comments : string | null,


}
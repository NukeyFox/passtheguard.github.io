export enum Sports {
    MMA, BJJ, MuayThai, Wrestling, NoGiBJJ, Judo 
}

export enum BJJPositionType {
    Stance, 
    Guard, 
    Pin, 
    Grip,
    Choke,
    Submission
}

export enum BJJTransitionType {
    Takedown,
    Sweep,
    Reversal
}

export interface Reference{
    resource_type : string,
    resource_name : string | null,
    resource : string
}

export type BJJPosition = {
    name: string,
    aliases : string[],
    description : string,
    pos_type : BJJPositionType,
    valid_in_sports : Sports[], 
    reference : Reference[],
    diagram : HTMLImageElement | string | File | null,
    comments : string | null
}



export type BJJTransition = {
    name : string | null, 
    from_pos : BJJPosition | undefined, 
    to_pos : BJJPosition | undefined,
    description : string,
    trans_type : BJJTransitionType,
    aliases : string[],
    valid_in_sports : Sports[],
    reference : Reference[],
    diagram : HTMLImageElement | string | File | null,
    comments : string | null

}
export enum Sports {
    MMA = "MMA", 
    BJJ = "BJJ", 
    MuayThai = "Muay Thai", 
    FreestyleWrestling = "Freestyle Wrestling", 
    NoGiBJJ = "No-gi BJJ", 
    Judo = "Judo"
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
    resource_type : string,
    resource_name : string | null,
    resource : string
}

export type BJJPosition = {
    id_no : number,
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
import {Node} from 'reactflow'
import internal from 'stream'

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

export interface Reference{
    resource_type : string,
    resource_name : string | null,
    resource : string
}

export type BJJPosition = {
    name: string,
    aliases : [string?],
    description : string,
    type : BJJPositionType,
    valid_in_sports : [Sports?], 
    reference : [Reference?],
    diagram : HTMLImageElement | string | File | null,
    comments : string | null
}

export type BJJTransition = {
    name : string | null, 
    from : BJJPosition, 
    to : BJJPosition,
    reference : [Reference?],
    diagram : HTMLImageElement | string | File | null,
    comments : string | null

}
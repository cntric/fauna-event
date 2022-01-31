import {query as q, values, Client} from "faunadb";
import { FaunaEvents } from "./Collection";

export const FaunaEventClerkId = 0;

export type FaunaEventClerk = values.Document<{
    /** the id of the current event head. */
    head : number,
    /** the id of the end of the tail. */
    tail : number,
    /** the depth of an event document. */
    depth : number,
    /** the length of the tail (the documents that can be populated).  */
    length : number,
    /** the width at which the tail length should be increased. */
    threshold : number,
    /** Clerk typename. */
    _type : "Clerk"
}>

export interface FaunaEvent {
    body : {
        eventType : string,
        data : any
    }
}

export const isFaunaEvent = (obj : any) : obj is FaunaEvent =>{
    return typeof (obj === "object") 
    && obj.body !== undefined 
    && (typeof obj.body.eventType === "string") 
    && obj.body.data !== undefined;
}

export type FaunaEventDoc = values.Document<{
    [key : string] : FaunaEvent
}>


export const CreateFaunaEventClerk = () : FaunaEventClerk =>{
    return q.If(
        q.Exists(q.Ref(FaunaEvents(), FaunaEventClerkId)),
        q.Get(q.Ref(FaunaEvents(), FaunaEventClerkId)),
        q.Create(q.Ref(FaunaEvents(), FaunaEventClerkId), {
            data : {
                head : 1,
                tail : 1, 
                depth : 100,
                length : 16,
                threshold : 8, 
                _type : "Clerk"
            }
        })
    ) as FaunaEventClerk
}

export const deployFaunaEventClerk = (client : Client)=>{
    return client.query(CreateFaunaEventClerk());
}

export const FaunaEventClerkRef = ()=>{
    return q.If(
        q.Exists(q.Ref(FaunaEvents(), FaunaEventClerkId)),
        q.Ref(FaunaEvents(), FaunaEventClerkId),
        q.Abort("FaunaEvent clerk does not exist.")
    )
}

export const FaunaEventClerkDoc = ()=>{
    return q.Get(FaunaEventClerkRef())
}

export const InitTail = ()=>IncrementTail();

export const initTail = (client : Client)=>client.query(InitTail());

export const EventHead = (val : number | false = false)=>{
    return q.If(
        q.Not(q.Equals(false, val)),
        q.Do([
            q.Update(
                FaunaEventClerkRef(),
                {
                    data : {
                        head : val
                    }
                }
            ),
            q.Select(["data", "head"], FaunaEventClerkDoc())
        ]),
        q.Select(["data", "head"], FaunaEventClerkDoc())
    )
}

export const EventTail = (val : number | false = false)=>{
    return q.If(
        q.Not(q.Equals(false, val)),
        q.Do([
            q.Update(
                FaunaEventClerkRef(),
                {
                    data : {
                        tail : val
                    }
                }
            ),
            q.Select(["data", "tail"], FaunaEventClerkDoc())
        ]),
        q.Select(["data", "tail"], FaunaEventClerkDoc())
    )
}

export const EventTailLength = (val : number | false = false)=>{
    return q.If(
        q.Not(q.Equals(false, val)),
        q.Do([
            q.Update(
                FaunaEventClerkRef(),
                {
                    data : {
                        legnth : val
                    }
                }
            ),
            q.Select(["data", "length"], FaunaEventClerkDoc())
        ]),
        q.Select(["data", "length"], FaunaEventClerkDoc())
    )
}

export const EventDepth= (val : number | false = false)=>{
    return q.If(
        q.Not(q.Equals(false, val)),
        q.Do([
            q.Update(
                FaunaEventClerkRef(),
                {
                    data : {
                        depth : val
                    }
                }
            ),
            q.Select(["data", "depth"], FaunaEventClerkDoc())
        ]),
        q.Select(["data", "depth"], FaunaEventClerkDoc())
    )
}

export const EventThreshold = (val : number | false = false)=>{
    return q.If(
        q.Not(q.Equals(false, val)),
        q.Do([
            q.Update(
                FaunaEventClerkRef(),
                {
                    data : {
                        threshold : val
                    }
                }
            ),
            q.Select(["data", "threshold"], FaunaEventClerkDoc())
        ]),
        q.Select(["data", "threshold"], FaunaEventClerkDoc())
    )
}

export const CreateEventDoc = (params : any, id : number) : FaunaEventDoc =>{
    return q.Create(q.Ref(FaunaEvents(), id), {
        data : params
    }) as FaunaEventDoc
}



/**
 * Increments the tail.
 * @param item 
 * @returns 
 */
export const _IncrementTail = (i : number  = 0)=>{
    return q.If(
        q.LT(q.Sum([EventHead(), i]), q.Sum([EventHead(), EventTailLength(), 1])),
        q.Do(
            q.If(
                q.Not(q.Exists(q.Ref(FaunaEvents(), i))),
                CreateEventDoc({
                    first : "key"
                }, i),
                i
            ),
            IncrementTail(q.Sum([i, 1]) as number)
        ),
        q.Sum([i, -1])
    )
}

export const IncrementTailFunctionName = "IncrementTail";
export const deployIncrementTail = async (client : Client)=>{

    
    return await client.query(q.If(
        q.Exists(
            q.Function(IncrementTailFunctionName)
        ),
        q.Update(
            q.Function(IncrementTailFunctionName),
            {
                body : q.Query(
                    q.Lambda(
                        ["i"],
                        _IncrementTail(
                            q.Var("i") as number
                        )
                    )
                )
            }
        ),
        q.CreateFunction({
            name : IncrementTailFunctionName,
            body : q.Query(
                q.Lambda(
                    ["i"],
                    _IncrementTail(
                        q.Var("i") as number
                    )
                )
            )
        })
    ))
}

export const IncrementTail = (
    i : number = 0
) :  number =>{
    return q.If(
        q.Exists(q.Function(IncrementTailFunctionName)),
        q.Call(
            q.Function(IncrementTailFunctionName),
            i
        ),
        q.Abort("IncrementTail has not yet been dpeloyed.")
    ) as number
}

/**
 * Lays the shards that need to added in front of the event tail.
 * @returns 
 */
 export const LayShards = ()=>{
    return EventTail(IncrementTail())
};

/**
 * 
 */
export const EventHeadDocumentRef = ()=>{
    return q.If(
        q.Exists(q.Ref(FaunaEvents(), EventHead())),
        q.Ref(FaunaEvents(), EventHead()),
        q.Abort("The EventHead document does not exist.")
    )
};

/**
 * Gets the EventHead documnet.
 * @returns 
 */
export const EventHeadDocument = ()=>{
    return q.Get(EventHeadDocumentRef())
};

export const GetEventHeadDocumentKeyCount = ()=>{
    return q.Count(q.ToArray(q.Select('data', EventHeadDocument())));
};

export const HeadDocumentHasSlotsAvailable = ()=>{
    return q.LT(GetEventHeadDocumentKeyCount(), EventDepth());
};

export const IncrementEventHead = ()=>{
    return q.Do(
        IncrementTail(),
        EventHead(q.Sum([EventHead(), 1]) as number)
    )
}

/**
 * Writes a new event at the head. Handles head incrementing if necessary.
 * @param event 
 * @returns 
 */
 export const NewEvent = (event : FaunaEvent)=>{
    return q.If(
        HeadDocumentHasSlotsAvailable(),
        q.Update(
            EventHeadDocumentRef(),
            {
                data : q.ToObject([
                    [q.NewId(), event]
                ])
            }
        ),
        q.Do(
            IncrementEventHead(),
            q.Update(
                EventHeadDocumentRef(),
                {
                    data : q.ToObject([
                        [q.NewId(), event]
                    ])
                }
            ),
        )
    )
}


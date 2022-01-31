import {Client, values, query as q} from "faunadb";
import { FaunaEvents } from "./Collection";
import { FaunaEvent, FaunaEventClerk, FaunaEventClerkDoc, FaunaEventClerkRef, FaunaEventDoc, isFaunaEvent } from "./FaunaEventClerk";


export interface FaunaEventTaillike {
    subscriptions : {
        [key : string] : ReturnType<Client["stream"]["document"]>
    },
    trackedEventDocumentStates : {
        [key : string] : Set<string>
    };
};

export interface FaunaEventHandlerlike {
    (event : FaunaEvent) : void
}

export interface FaunaEventClientlike {
    client : Client,
    eventHandlers : {
        [key : string] : ((event : FaunaEvent)=>void)[]
    },
    head : ReturnType<Client["stream"]["document"]>,
    tail : FaunaEventTaillike,
};

export class FaunaEventClient implements FaunaEventClientlike {

    client : Client;
    eventHandlers : {
        [key : string] : FaunaEventHandlerlike[]
    };
    head : ReturnType<Client["stream"]["document"]>;
    tail : FaunaEventTaillike;
   

    constructor(client : Client){
        this.client = client;
        this.eventHandlers = {};
        this.head = client.stream.document(FaunaEventClerkRef());
        this.tail = {
            subscriptions : {},
            trackedEventDocumentStates : {}
        };

        this.initHead();

    };

    /**
     * Manages subscriptions by removing those that are out of bounds,
     * and adding new ones where necessary.
     * @param clerk 
     */
    manageSubscriptions(clerk : FaunaEventClerk){
        const start = clerk.data.head - clerk.data.threshold > 0 ? clerk.data.head - clerk.data.threshold : 0;
        const end = clerk.data.head + clerk.data.threshold;
        for(let key of Object.keys(this.tail.subscriptions))
            if(parseInt(key) < start || parseInt(key) > end){
                this.tail.subscriptions[key].close();
                delete this.tail.subscriptions[key];
                delete this.tail.trackedEventDocumentStates[key];
            }
        
        for(let i = start; i < end + 1; i++)
            if(!this.tail.subscriptions[i]) this.initEventDocumentSteam(i);
    }


    /**
     * Initializes the head.
     */
    initHead(){
        console.log("Initializing head.");
        this.head
        .on("start", (payload)=>{
            this.client.query<FaunaEventClerk>(FaunaEventClerkDoc())
            .then((doc)=>{
                this.manageSubscriptions(doc);
            }).catch((err)=>{
                throw err;
            });
        })
        .on("version", (payload)=>{
            payload.document && this.manageSubscriptions(payload.document as FaunaEventClerk);
        }).start()
    };

    /**
     * Updates which keys have been tracked.
     * Every key in an EventDocument at the time 
     * of the initial query we'll be considerd 
     * to be tracked.
     * @param i 
     */
    updateTrackedKeys(i : number){
        this.client.query<FaunaEventDoc>(q.Get(q.Ref(FaunaEvents(), i)))
        .then((data)=>{
            this.tail.trackedEventDocumentStates[i] = new Set(Object.keys(data.data));
        }).catch((err)=>{
            throw err;
        })
    }

    /**
     * Initiailizes a Fauna document stream.
     * @param i 
     */
    initEventDocumentSteam(i : number){
        this.tail.subscriptions[i] = this.client.stream.document(q.Ref(FaunaEvents(), i));
        this.tail.subscriptions[i]
        .on("start", ()=>{
            this.updateTrackedKeys(i);
        })
        .on("version", (payload)=>{
            if(payload.action === "update" && this.tail.trackedEventDocumentStates[i]) // if the action is an update and we've begun tracking
                payload.document && (payload.document as any).data && this.reportEvents((payload.document as any).data, i);
        }).start();
    }

    /**
     * Reports all events stored on an object.
     * @param obj 
     * @param i 
     */
    reportEvents(obj : any, i : number){
        for(let key of Object.keys(obj))
            if(
                !this.tail.trackedEventDocumentStates[i].has(key) // we haven't already tracked this key
                && isFaunaEvent(obj[key]) // and the value is a Fauna event.
            ) this.dispatchEvent(obj[key]);
    }


    /**
     * Dispatches an event.
     * @param event 
     */
    dispatchEvent(event : FaunaEvent){
        if(this.eventHandlers[event.body.eventType])
            for(let cb of this.eventHandlers[event.body.eventType]) cb(event);
    }

    /**
     * Binds an event handler.
     * @param event 
     * @param cb 
     */
    on(event : string, cb : FaunaEventHandlerlike){
        if(!this.eventHandlers[event]) this.eventHandlers[event] = [];
        this.eventHandlers[event].push(cb);
    }

}

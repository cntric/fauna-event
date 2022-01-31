import { Client } from "faunadb";
import { FaunaEvent, FaunaEventClerk } from "./FaunaEventClerk";
export interface FaunaEventTaillike {
    subscriptions: {
        [key: string]: ReturnType<Client["stream"]["document"]>;
    };
    trackedEventDocumentStates: {
        [key: string]: Set<string>;
    };
}
export interface FaunaEventHandlerlike {
    (event: FaunaEvent): void;
}
export interface FaunaEventClientlike {
    client: Client;
    eventHandlers: {
        [key: string]: ((event: FaunaEvent) => void)[];
    };
    head: ReturnType<Client["stream"]["document"]>;
    tail: FaunaEventTaillike;
}
export declare class FaunaEventClient implements FaunaEventClientlike {
    client: Client;
    eventHandlers: {
        [key: string]: FaunaEventHandlerlike[];
    };
    head: ReturnType<Client["stream"]["document"]>;
    tail: FaunaEventTaillike;
    constructor(client: Client);
    /**
     * Manages subscriptions by removing those that are out of bounds,
     * and adding new ones where necessary.
     * @param clerk
     */
    manageSubscriptions(clerk: FaunaEventClerk): void;
    /**
     * Initializes the head.
     */
    initHead(): void;
    /**
     * Updates which keys have been tracked.
     * Every key in an EventDocument at the time
     * of the initial query we'll be considerd
     * to be tracked.
     * @param i
     */
    updateTrackedKeys(i: number): void;
    /**
     * Initiailizes a Fauna document stream.
     * @param i
     */
    initEventDocumentSteam(i: number): void;
    /**
     * Reports all events stored on an object.
     * @param obj
     * @param i
     */
    reportEvents(obj: any, i: number): void;
    /**
     * Dispatches an event.
     * @param event
     */
    dispatchEvent(event: FaunaEvent): void;
    /**
     * Binds an event handler.
     * @param event
     * @param cb
     */
    on(event: string, cb: FaunaEventHandlerlike): void;
}

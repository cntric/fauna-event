import { values, Client } from "faunadb";
export declare const FaunaEventClerkId = 0;
export declare type FaunaEventClerk = values.Document<{
    /** the id of the current event head. */
    head: number;
    /** the id of the end of the tail. */
    tail: number;
    /** the depth of an event document. */
    depth: number;
    /** the length of the tail (the documents that can be populated).  */
    length: number;
    /** the width at which the tail length should be increased. */
    threshold: number;
    /** Clerk typename. */
    _type: "Clerk";
}>;
export interface FaunaEvent {
    body: {
        eventType: string;
        data: any;
    };
}
export declare const isFaunaEvent: (obj: any) => obj is FaunaEvent;
export declare type FaunaEventDoc = values.Document<{
    [key: string]: FaunaEvent;
}>;
export declare const CreateFaunaEventClerk: () => FaunaEventClerk;
export declare const deployFaunaEventClerk: (client: Client) => Promise<object>;
export declare const FaunaEventClerkRef: () => import("faunadb").Expr;
export declare const FaunaEventClerkDoc: () => import("faunadb").Expr;
export declare const InitTail: () => number;
export declare const initTail: (client: Client) => Promise<object>;
export declare const EventHead: (val?: number | false) => import("faunadb").Expr;
export declare const EventTail: (val?: number | false) => import("faunadb").Expr;
export declare const EventTailLength: (val?: number | false) => import("faunadb").Expr;
export declare const EventDepth: (val?: number | false) => import("faunadb").Expr;
export declare const EventThreshold: (val?: number | false) => import("faunadb").Expr;
export declare const CreateEventDoc: (params: any, id: number) => FaunaEventDoc;
/**
 * Increments the tail.
 * @param item
 * @returns
 */
export declare const _IncrementTail: (i?: number) => import("faunadb").Expr;
export declare const IncrementTailFunctionName = "IncrementTail";
export declare const deployIncrementTail: (client: Client) => Promise<object>;
export declare const IncrementTail: (i?: number) => number;
/**
 * Lays the shards that need to added in front of the event tail.
 * @returns
 */
export declare const LayShards: () => import("faunadb").Expr;
/**
 *
 */
export declare const EventHeadDocumentRef: () => import("faunadb").Expr;
/**
 * Gets the EventHead documnet.
 * @returns
 */
export declare const EventHeadDocument: () => import("faunadb").Expr;
export declare const GetEventHeadDocumentKeyCount: () => import("faunadb").Expr;
export declare const HeadDocumentHasSlotsAvailable: () => import("faunadb").Expr;
export declare const IncrementEventHead: () => import("faunadb").Expr;
/**
 * Writes a new event at the head. Handles head incrementing if necessary.
 * @param event
 * @returns
 */
export declare const NewEvent: (event: FaunaEvent) => import("faunadb").Expr;

import { Client } from "faunadb";
export declare const FaunaEventCollectionName = "FaunaEvents";
export declare const CreateFaunaEventCollection: () => import("faunadb").Expr;
export declare const FaunaEvents: () => import("faunadb").Expr;
export declare const deployFaunaEventsCollection: (client: Client) => Promise<void>;

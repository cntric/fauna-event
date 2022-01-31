import { Client } from "faunadb";
/**
 *
 * @param client is the client against which FaunaEvents should be deployed.
 */
export declare const deployFaunaEvents: (client: Client) => Promise<void>;

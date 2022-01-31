import { deployFaunaEventClerk, deployIncrementTail, deployFaunaEventsCollection, initTail } from "../FaunaEvent";
/**
 *
 * @param client is the client against which FaunaEvents should be deployed.
 */
export const deployFaunaEvents = async (client) => {
    await deployFaunaEventsCollection(client);
    await deployFaunaEventClerk(client);
    await deployIncrementTail(client);
    await initTail(client);
};

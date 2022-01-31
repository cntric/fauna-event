require('dotenv').config();
import {FaunaTestDb} from "fauna-test-setup";
import {deployFaunaEvents} from "./src";
import {client} from "./src/test"

module.exports = async ()=>{
    const db = await FaunaTestDb();
    await deployFaunaEvents(db.client);
    await deployFaunaEvents(client);
}
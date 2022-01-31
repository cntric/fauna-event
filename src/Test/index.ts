require('dotenv').config();
import { Client } from "faunadb";

export const client = new Client({
    secret : process.env.FAUNA_SECRET as string,
    scheme : "https",
    domain : "db.us.fauna.com"
})
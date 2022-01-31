import { FaunaTestDb, FaunaTestDbI, teardown } from "fauna-test-setup";
import {Lambda, query as q} from "faunadb";
import { EventHead, EventTailLength, FaunaEventClerkDoc, IncrementTail, NewEvent } from "./FaunaEventClerk";
import { FaunaEventClerk } from "./FaunaEventClerk";
import {to} from "await-to-js";
import { FaunaEvents } from "./Collection";



export const EventClerkSuiteA = ()=>{


    describe("Event clerk operations", ()=>{

        let db : FaunaTestDbI;

        beforeAll(async()=>{
            db = await FaunaTestDb();
        })

        test("Event clerk available", async ()=>{
           await db.client.query(FaunaEventClerkDoc());
        });

        test("Increments tail", async ()=>{
            const tail = await db.client.query(IncrementTail());
            const [head, length] = await db.client.query<[number, number]>([
                EventHead(),
                EventTailLength()
            ]);
            expect(tail).toBe(length);
            const exists = await db.client.query(Array(length).fill(null).map((index)=>{
                return q.Exists(q.Ref(FaunaEvents(), head + index))
            }));
            expect(exists).toStrictEqual(Array(length).fill(null).map((index)=>{
                return true;
            }))
        });
        

    })


}; EventClerkSuiteA();
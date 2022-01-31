import { FaunaTestDb } from "fauna-test-setup";
import { query as q } from "faunadb";
import { EventHead, EventTailLength, FaunaEventClerkDoc, IncrementTail } from "./FaunaEventClerk";
import { FaunaEvents } from "./Collection";
export const EventClerkSuiteA = () => {
    describe("Event clerk operations", () => {
        let db;
        beforeAll(async () => {
            db = await FaunaTestDb();
        });
        test("Event clerk available", async () => {
            await db.client.query(FaunaEventClerkDoc());
        });
        test("Increments tail", async () => {
            const tail = await db.client.query(IncrementTail());
            const [head, length] = await db.client.query([
                EventHead(),
                EventTailLength()
            ]);
            expect(tail).toBe(length);
            const exists = await db.client.query(Array(length).fill(null).map((index) => {
                return q.Exists(q.Ref(FaunaEvents(), head + index));
            }));
            expect(exists).toStrictEqual(Array(length).fill(null).map((index) => {
                return true;
            }));
        });
    });
};
EventClerkSuiteA();

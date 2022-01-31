import { FaunaTestDb } from "fauna-test-setup";
import { NewEvent } from "./FaunaEventClerk";
import { FaunaEventClient } from "./FaunaEventClient";
import { client } from "../Test";
const serverEventClient = new FaunaEventClient(client);
export const EventClientSuiteA = () => {
    describe("Gets users for item", () => {
        let db;
        let eventClient;
        beforeAll(async () => {
            db = await FaunaTestDb();
            eventClient = new FaunaEventClient(db.client);
        });
        test("Gets event.", async () => {
            const value = await new Promise((resolve) => {
                eventClient.on("hello", (event) => {
                    resolve(event.body.data);
                });
                db.client.query(NewEvent({
                    body: {
                        eventType: "hello",
                        data: "world"
                    }
                }));
            });
            expect(value).toBe("world");
        });
        test("One event.", async () => {
            let counter = 0;
            eventClient.on("one", (event) => {
                counter++;
            });
            db.client.query(NewEvent({
                body: {
                    eventType: "one",
                    data: "world"
                }
            }));
            // wait
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 5000);
            });
            expect(counter).toBe(1);
        });
        test("Many events.", async () => {
            let counter = 0;
            eventClient.on("one", (event) => {
                counter++;
            });
            for (let i = 0; i < 10; ++i)
                db.client.query(NewEvent({
                    body: {
                        eventType: "many",
                        data: "worlds"
                    }
                }));
            // wait
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 10000);
            });
            expect(counter).toBe(10);
        });
    });
};
EventClientSuiteA();

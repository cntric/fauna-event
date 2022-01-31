"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventClientSuiteA = void 0;
const fauna_test_setup_1 = require("fauna-test-setup");
const FaunaEventClerk_1 = require("./FaunaEventClerk");
const FaunaEventClient_1 = require("./FaunaEventClient");
const Test_1 = require("../Test");
const serverEventClient = new FaunaEventClient_1.FaunaEventClient(Test_1.client);
const EventClientSuiteA = () => {
    describe("Gets users for item", () => {
        let db;
        let eventClient;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            db = yield (0, fauna_test_setup_1.FaunaTestDb)();
            eventClient = new FaunaEventClient_1.FaunaEventClient(db.client);
        }));
        test("Gets event.", () => __awaiter(void 0, void 0, void 0, function* () {
            const value = yield new Promise((resolve) => {
                eventClient.on("hello", (event) => {
                    resolve(event.body.data);
                });
                db.client.query((0, FaunaEventClerk_1.NewEvent)({
                    body: {
                        eventType: "hello",
                        data: "world"
                    }
                }));
            });
            expect(value).toBe("world");
        }));
        test("One event.", () => __awaiter(void 0, void 0, void 0, function* () {
            let counter = 0;
            eventClient.on("one", (event) => {
                counter++;
            });
            db.client.query((0, FaunaEventClerk_1.NewEvent)({
                body: {
                    eventType: "one",
                    data: "world"
                }
            }));
            // wait
            yield new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 5000);
            });
            expect(counter).toBe(1);
        }));
        test("Many events.", () => __awaiter(void 0, void 0, void 0, function* () {
            let counter = 0;
            eventClient.on("one", (event) => {
                counter++;
            });
            for (let i = 0; i < 10; ++i)
                db.client.query((0, FaunaEventClerk_1.NewEvent)({
                    body: {
                        eventType: "many",
                        data: "worlds"
                    }
                }));
            // wait
            yield new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 10000);
            });
            expect(counter).toBe(10);
        }));
    });
};
exports.EventClientSuiteA = EventClientSuiteA;
(0, exports.EventClientSuiteA)();

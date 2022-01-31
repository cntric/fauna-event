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
exports.EventClerkSuiteA = void 0;
const fauna_test_setup_1 = require("fauna-test-setup");
const faunadb_1 = require("faunadb");
const FaunaEventClerk_1 = require("./FaunaEventClerk");
const Collection_1 = require("./Collection");
const EventClerkSuiteA = () => {
    describe("Event clerk operations", () => {
        let db;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            db = yield (0, fauna_test_setup_1.FaunaTestDb)();
        }));
        test("Event clerk available", () => __awaiter(void 0, void 0, void 0, function* () {
            yield db.client.query((0, FaunaEventClerk_1.FaunaEventClerkDoc)());
        }));
        test("Increments tail", () => __awaiter(void 0, void 0, void 0, function* () {
            const tail = yield db.client.query((0, FaunaEventClerk_1.IncrementTail)());
            const [head, length] = yield db.client.query([
                (0, FaunaEventClerk_1.EventHead)(),
                (0, FaunaEventClerk_1.EventTailLength)()
            ]);
            expect(tail).toBe(length);
            const exists = yield db.client.query(Array(length).fill(null).map((index) => {
                return faunadb_1.query.Exists(faunadb_1.query.Ref((0, Collection_1.FaunaEvents)(), head + index));
            }));
            expect(exists).toStrictEqual(Array(length).fill(null).map((index) => {
                return true;
            }));
        }));
    });
};
exports.EventClerkSuiteA = EventClerkSuiteA;
(0, exports.EventClerkSuiteA)();

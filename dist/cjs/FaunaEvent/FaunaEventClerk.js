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
exports.NewEvent = exports.IncrementEventHead = exports.HeadDocumentHasSlotsAvailable = exports.GetEventHeadDocumentKeyCount = exports.EventHeadDocument = exports.EventHeadDocumentRef = exports.LayShards = exports.IncrementTail = exports.deployIncrementTail = exports.IncrementTailFunctionName = exports._IncrementTail = exports.CreateEventDoc = exports.EventThreshold = exports.EventDepth = exports.EventTailLength = exports.EventTail = exports.EventHead = exports.initTail = exports.InitTail = exports.FaunaEventClerkDoc = exports.FaunaEventClerkRef = exports.deployFaunaEventClerk = exports.CreateFaunaEventClerk = exports.isFaunaEvent = exports.FaunaEventClerkId = void 0;
const faunadb_1 = require("faunadb");
const Collection_1 = require("./Collection");
exports.FaunaEventClerkId = 0;
const isFaunaEvent = (obj) => {
    return typeof (obj === "object")
        && obj.body !== undefined
        && (typeof obj.body.eventType === "string")
        && obj.body.data !== undefined;
};
exports.isFaunaEvent = isFaunaEvent;
const CreateFaunaEventClerk = () => {
    return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Ref((0, Collection_1.FaunaEvents)(), exports.FaunaEventClerkId)), faunadb_1.query.Get(faunadb_1.query.Ref((0, Collection_1.FaunaEvents)(), exports.FaunaEventClerkId)), faunadb_1.query.Create(faunadb_1.query.Ref((0, Collection_1.FaunaEvents)(), exports.FaunaEventClerkId), {
        data: {
            head: 1,
            tail: 1,
            depth: 100,
            length: 16,
            threshold: 8,
            _type: "Clerk"
        }
    }));
};
exports.CreateFaunaEventClerk = CreateFaunaEventClerk;
const deployFaunaEventClerk = (client) => {
    return client.query((0, exports.CreateFaunaEventClerk)());
};
exports.deployFaunaEventClerk = deployFaunaEventClerk;
const FaunaEventClerkRef = () => {
    return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Ref((0, Collection_1.FaunaEvents)(), exports.FaunaEventClerkId)), faunadb_1.query.Ref((0, Collection_1.FaunaEvents)(), exports.FaunaEventClerkId), faunadb_1.query.Abort("FaunaEvent clerk does not exist."));
};
exports.FaunaEventClerkRef = FaunaEventClerkRef;
const FaunaEventClerkDoc = () => {
    return faunadb_1.query.Get((0, exports.FaunaEventClerkRef)());
};
exports.FaunaEventClerkDoc = FaunaEventClerkDoc;
const InitTail = () => (0, exports.IncrementTail)();
exports.InitTail = InitTail;
const initTail = (client) => client.query((0, exports.InitTail)());
exports.initTail = initTail;
const EventHead = (val = false) => {
    return faunadb_1.query.If(faunadb_1.query.Not(faunadb_1.query.Equals(false, val)), faunadb_1.query.Do([
        faunadb_1.query.Update((0, exports.FaunaEventClerkRef)(), {
            data: {
                head: val
            }
        }),
        faunadb_1.query.Select(["data", "head"], (0, exports.FaunaEventClerkDoc)())
    ]), faunadb_1.query.Select(["data", "head"], (0, exports.FaunaEventClerkDoc)()));
};
exports.EventHead = EventHead;
const EventTail = (val = false) => {
    return faunadb_1.query.If(faunadb_1.query.Not(faunadb_1.query.Equals(false, val)), faunadb_1.query.Do([
        faunadb_1.query.Update((0, exports.FaunaEventClerkRef)(), {
            data: {
                tail: val
            }
        }),
        faunadb_1.query.Select(["data", "tail"], (0, exports.FaunaEventClerkDoc)())
    ]), faunadb_1.query.Select(["data", "tail"], (0, exports.FaunaEventClerkDoc)()));
};
exports.EventTail = EventTail;
const EventTailLength = (val = false) => {
    return faunadb_1.query.If(faunadb_1.query.Not(faunadb_1.query.Equals(false, val)), faunadb_1.query.Do([
        faunadb_1.query.Update((0, exports.FaunaEventClerkRef)(), {
            data: {
                legnth: val
            }
        }),
        faunadb_1.query.Select(["data", "length"], (0, exports.FaunaEventClerkDoc)())
    ]), faunadb_1.query.Select(["data", "length"], (0, exports.FaunaEventClerkDoc)()));
};
exports.EventTailLength = EventTailLength;
const EventDepth = (val = false) => {
    return faunadb_1.query.If(faunadb_1.query.Not(faunadb_1.query.Equals(false, val)), faunadb_1.query.Do([
        faunadb_1.query.Update((0, exports.FaunaEventClerkRef)(), {
            data: {
                depth: val
            }
        }),
        faunadb_1.query.Select(["data", "depth"], (0, exports.FaunaEventClerkDoc)())
    ]), faunadb_1.query.Select(["data", "depth"], (0, exports.FaunaEventClerkDoc)()));
};
exports.EventDepth = EventDepth;
const EventThreshold = (val = false) => {
    return faunadb_1.query.If(faunadb_1.query.Not(faunadb_1.query.Equals(false, val)), faunadb_1.query.Do([
        faunadb_1.query.Update((0, exports.FaunaEventClerkRef)(), {
            data: {
                threshold: val
            }
        }),
        faunadb_1.query.Select(["data", "threshold"], (0, exports.FaunaEventClerkDoc)())
    ]), faunadb_1.query.Select(["data", "threshold"], (0, exports.FaunaEventClerkDoc)()));
};
exports.EventThreshold = EventThreshold;
const CreateEventDoc = (params, id) => {
    return faunadb_1.query.Create(faunadb_1.query.Ref((0, Collection_1.FaunaEvents)(), id), {
        data: params
    });
};
exports.CreateEventDoc = CreateEventDoc;
/**
 * Increments the tail.
 * @param item
 * @returns
 */
const _IncrementTail = (i = 0) => {
    return faunadb_1.query.If(faunadb_1.query.LT(faunadb_1.query.Sum([(0, exports.EventHead)(), i]), faunadb_1.query.Sum([(0, exports.EventHead)(), (0, exports.EventTailLength)(), 1])), faunadb_1.query.Do(faunadb_1.query.If(faunadb_1.query.Not(faunadb_1.query.Exists(faunadb_1.query.Ref((0, Collection_1.FaunaEvents)(), i))), (0, exports.CreateEventDoc)({
        first: "key"
    }, i), i), (0, exports.IncrementTail)(faunadb_1.query.Sum([i, 1]))), faunadb_1.query.Sum([i, -1]));
};
exports._IncrementTail = _IncrementTail;
exports.IncrementTailFunctionName = "IncrementTail";
const deployIncrementTail = (client) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client.query(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Function(exports.IncrementTailFunctionName)), faunadb_1.query.Update(faunadb_1.query.Function(exports.IncrementTailFunctionName), {
        body: faunadb_1.query.Query(faunadb_1.query.Lambda(["i"], (0, exports._IncrementTail)(faunadb_1.query.Var("i"))))
    }), faunadb_1.query.CreateFunction({
        name: exports.IncrementTailFunctionName,
        body: faunadb_1.query.Query(faunadb_1.query.Lambda(["i"], (0, exports._IncrementTail)(faunadb_1.query.Var("i"))))
    })));
});
exports.deployIncrementTail = deployIncrementTail;
const IncrementTail = (i = 0) => {
    return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Function(exports.IncrementTailFunctionName)), faunadb_1.query.Call(faunadb_1.query.Function(exports.IncrementTailFunctionName), i), faunadb_1.query.Abort("IncrementTail has not yet been dpeloyed."));
};
exports.IncrementTail = IncrementTail;
/**
 * Lays the shards that need to added in front of the event tail.
 * @returns
 */
const LayShards = () => {
    return (0, exports.EventTail)((0, exports.IncrementTail)());
};
exports.LayShards = LayShards;
/**
 *
 */
const EventHeadDocumentRef = () => {
    return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Ref((0, Collection_1.FaunaEvents)(), (0, exports.EventHead)())), faunadb_1.query.Ref((0, Collection_1.FaunaEvents)(), (0, exports.EventHead)()), faunadb_1.query.Abort("The EventHead document does not exist."));
};
exports.EventHeadDocumentRef = EventHeadDocumentRef;
/**
 * Gets the EventHead documnet.
 * @returns
 */
const EventHeadDocument = () => {
    return faunadb_1.query.Get((0, exports.EventHeadDocumentRef)());
};
exports.EventHeadDocument = EventHeadDocument;
const GetEventHeadDocumentKeyCount = () => {
    return faunadb_1.query.Count(faunadb_1.query.ToArray(faunadb_1.query.Select('data', (0, exports.EventHeadDocument)())));
};
exports.GetEventHeadDocumentKeyCount = GetEventHeadDocumentKeyCount;
const HeadDocumentHasSlotsAvailable = () => {
    return faunadb_1.query.LT((0, exports.GetEventHeadDocumentKeyCount)(), (0, exports.EventDepth)());
};
exports.HeadDocumentHasSlotsAvailable = HeadDocumentHasSlotsAvailable;
const IncrementEventHead = () => {
    return faunadb_1.query.Do((0, exports.IncrementTail)(), (0, exports.EventHead)(faunadb_1.query.Sum([(0, exports.EventHead)(), 1])));
};
exports.IncrementEventHead = IncrementEventHead;
/**
 * Writes a new event at the head. Handles head incrementing if necessary.
 * @param event
 * @returns
 */
const NewEvent = (event) => {
    return faunadb_1.query.If((0, exports.HeadDocumentHasSlotsAvailable)(), faunadb_1.query.Update((0, exports.EventHeadDocumentRef)(), {
        data: faunadb_1.query.ToObject([
            [faunadb_1.query.NewId(), event]
        ])
    }), faunadb_1.query.Do((0, exports.IncrementEventHead)(), faunadb_1.query.Update((0, exports.EventHeadDocumentRef)(), {
        data: faunadb_1.query.ToObject([
            [faunadb_1.query.NewId(), event]
        ])
    })));
};
exports.NewEvent = NewEvent;

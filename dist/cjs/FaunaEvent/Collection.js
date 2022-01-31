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
exports.deployFaunaEventsCollection = exports.FaunaEvents = exports.CreateFaunaEventCollection = exports.FaunaEventCollectionName = void 0;
const faunadb_1 = require("faunadb");
exports.FaunaEventCollectionName = "FaunaEvents";
const CreateFaunaEventCollection = () => {
    return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Collection(exports.FaunaEventCollectionName)), faunadb_1.query.Collection(exports.FaunaEventCollectionName), faunadb_1.query.CreateCollection({
        name: exports.FaunaEventCollectionName
    }));
};
exports.CreateFaunaEventCollection = CreateFaunaEventCollection;
const FaunaEvents = () => {
    return faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Collection(exports.FaunaEventCollectionName)), faunadb_1.query.Collection(exports.FaunaEventCollectionName), faunadb_1.query.Abort(exports.FaunaEventCollectionName + " does not exist."));
};
exports.FaunaEvents = FaunaEvents;
const deployFaunaEventsCollection = (client) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.query((0, exports.CreateFaunaEventCollection)());
});
exports.deployFaunaEventsCollection = deployFaunaEventsCollection;

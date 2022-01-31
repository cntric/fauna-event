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
exports.deployFaunaEvents = void 0;
const FaunaEvent_1 = require("../FaunaEvent");
/**
 *
 * @param client is the client against which FaunaEvents should be deployed.
 */
const deployFaunaEvents = (client) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, FaunaEvent_1.deployFaunaEventsCollection)(client);
    yield (0, FaunaEvent_1.deployFaunaEventClerk)(client);
    yield (0, FaunaEvent_1.deployIncrementTail)(client);
    yield (0, FaunaEvent_1.initTail)(client);
});
exports.deployFaunaEvents = deployFaunaEvents;

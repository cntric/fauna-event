"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
require('dotenv').config();
const faunadb_1 = require("faunadb");
exports.client = new faunadb_1.Client({
    secret: process.env.FAUNA_SECRET,
    scheme: "https",
    domain: "db.us.fauna.com"
});

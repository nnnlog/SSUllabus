import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { graphqlServer } from '@hono/graphql-server';
import {Database, OPEN_READONLY, verbose} from "sqlite3";

import schema from "./graphql/schema";
import query from "./graphql/query";
import {serveStatic} from "@hono/node-server/serve-static";
import * as path from "node:path";

import "dotenv/config";

const db = new (verbose().Database)(`${__dirname}/../subjects.db`, OPEN_READONLY , () => {});

const app = new Hono();

app.use("/graphql", graphqlServer({
  schema,
  rootResolver: query(db),
}));

app.use("/*", serveStatic({
  root: "./static/dist/",
}));

const port = parseInt(process.env.PORT ?? "3000");
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

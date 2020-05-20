import Koa from "koa";
import consola from "consola";
import { Nuxt, Builder } from "nuxt";
//Mongoose为模型提供了一种直接的，基于scheme结构去定义你的数据模型。
import mongoose from "mongoose";
//A body parser for koa, based on co-body. support json, form and text type body.
import bodyParse from "koa-bodyparser";
//支持Sentinel和集群的Koa会话中间件/缓存的Redis存储
import Redis from "koa-redis";
//用于koa的通用会话中间件，易于与自定义存储（如redis或mongo）一起使用，支持defer session getter
import session from "koa-generic-session";
import json from "koa-json";
import dbConfig from "./dbs/config.js";
import register from "./interface/register";
const app = new Koa();

app.keys = ["mt", "keyskeys"];
app.proxy = true;
app.use(
  session({
    key: "mt",
    prefix: "mt:uid",
    store: new Redis()
  })
);
app.use(
  bodyParse({
    extendTypes: ["json", "form", "text"]
  })
);
app.use(json());

// Import and Set Nuxt.js options
import config from "../nuxt.config";
config.dev = app.env !== "production";

mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  const {
    host = process.env.HOST || "127.0.0.1",
    port = process.env.PORT || 3000
  } = nuxt.options.server;

  await nuxt.ready();
  app.use(register.routes()).use(register.allowedMethods());
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(ctx => {
    ctx.status = 200;
    ctx.respond = false; // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res);
  });

  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start();

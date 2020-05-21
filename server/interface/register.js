import Router from "koa-router";
import Redis from "koa-redis";
import axios from "./utils/axios.js";
import mds from "crypto-js/md5";
import register from "../dbs/models/register";
let router = new Router({
  prefix: "/register"
});
let Store = new Redis().client;
router.post("/registerPhone", async ctx => {
  let phone = ctx.request.body.phone;
  let time = new Date();
  ctx.body = {
    code: 1,
    codeNum: parseInt(Math.random() * 1000000)
  };
});
export default router;

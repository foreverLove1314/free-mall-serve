import Router from "koa-router";
import axios from "./utils/axios.js";
import mds from "crypto-js/md5";
import register from "../dbs/models/register";
let router = new Router({
  prefix: "/register"
});
router.get("/registerPhone", async ctx => {
  let phone = ctx.request.body;
  let time = new Date();
  ctx.body = {
    code: 0,
    codeNum: ParseInt(Math.random() * 100000)
  };
});
export default router
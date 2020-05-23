import Router from "koa-router";
import Redis from "koa-redis";
import nodeMailer from "nodemailer";
import axios from "./utils/axios.js";
import registerPhone from "../dbs/models/registerPhone";
import Passport from "./utils/passport";
import config from "../dbs/config";
let router = new Router({
  prefix: "/register"
});
let Store = new Redis().client;
//发送手机验证码
router.post("/getPhoneCode", async (ctx, next) => {
  let username = ctx.request.body.username;
  let phone = ctx.request.body.phone;
  //获取过期时间
  const savaExpire = await Store.hget(`phone:${username}`, "expire");
  // console.log("getPhoneCode", savaExpire, new Date().getTime());
  /*  if (savaExpire && new Date().getTime() - savaExpire < 0) {
    ctx.body = {
      code: -1,
      msg: "验证码过于频繁，一分钟一次"
    };
    return false;
  } */
  let ko = {
    code: config.smtp.code(),
    expire: config.smtp.expire(),
    user: username,
    phone
  };
  Store.hmset(
    `phone:${ko.user}`,
    "code",
    ko.code,
    "expire",
    ko.expire,
    "phone",
    ko.phone
  );
  ctx.body = {
    code: 0,
    codeNum: ko.code,
    msg: "验证码已发送，可能会延时，有效期一分钟"
  };
});
//注册手机
router.post("/signUpPhone", async (ctx, next) => {
  const { username, password, code, phone } = ctx.request.body;
  if (code) {
    //获取存储在Redis的code，code与每个username关联
    const saveCode = await Store.hget(`phone:${username}`, "code");
    //获取存储在Redis的过期时间，过期时间与每个username关联
    const saveExpire = await Store.hget(`phone:${username}`, "expire");
    console.log(saveCode, saveExpire);
    //对比验证码
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: "验证码已过期"
        };
        return false;
      }
    } else {
      ctx.body = {
        code: -1,
        msg: "验证码错误"
      };
      return false;
    }
  } else {
    ctx.body = {
      code: -1,
      msg: "请填写验证码"
    };
    return false;
  }
  //查询文档列表，判断用户名是否已经注册
  let phoneUser = await registerPhone.find({
    username
  });
  if (phoneUser.length) {
    ctx.body = {
      code: -1,
      msg: "用户名已经被注册"
    };
    return;
  }
  //查询文档列表，判断电话号码是否被注册
  let phoneDoc = await registerPhone.find({
    phone
  });
  if (phoneDoc.length) {
    ctx.body = {
      code: -1,
      msg: "电话号码已经被注册"
    };
    return;
  }
  //写入数据库
  let nuser = registerPhone.create({
    username,
    phone,
    password
  });
  if (nuser) {
    let res = await axios.get("/register/signInPhone", {
      phone,
      password
    });
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: "登录成功",
        user: res.data.user
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "登录失败"
      };
    }
  } else {
    ctx.body = {
      code: -1,
      msg: "注册失败"
    };
  }
});
//登录手机
router.post("/signInPhone", async (ctx, next) => {
  let { phone, password } = ctx.request.body;
  let phoneDoc = registerPhone.find({
    phone
  });
  if (!phone) {
    ctx.body = {
      code: -1,
      msg: "电话号码不能为空"
    };
    return false;
  }
  if (!password) {
    ctx.body = {
      code: -1,
      msg: "密码不能为空"
    };
  }
  /* if (phoneDoc.phone === phone && phoneDoc.password === password) {
    ctx.body = {
      code: 0,
      msg: "登录成功"
    };
  } else {
    ctx.body = {
      code: -1,
      msg: "手机或者密码错误"
    };
  } */
  //登录验证
  //Passport 是 Node 的认证中间件，它的存在只有一个单一的目的，就是认证请求
  return Passport.authenticate("lacal", (err, user, info, status) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      };
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: "登录成功",
          user
        };
        return ctx.login(user);
      } else {
        //没有拿到用户
        ctx.body = {
          code: 1,
          msg: info
        };
      }
    }
  })(ctx, next);
});
export default router;

//利用koa-passport可以简便的实现登录注册功能，不但包括本地验证，还有很多提供第三方登录的模块可以使用。
import passport from "koa-passport";
// 使用用户名和密码进行身份验证的Passport策略。
// 此模块允许您在Node.js节点应用。通过插入Passport，本地身份验证可以轻松而不受干扰地集成到任何支持Connect风格中间件（包括Express）的应用程序或框架中
import LocalStrategy from "passport-local";
import UserModel from "../../dbs/models/registerPhone";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    let where = {
      username
    };
    let result = await UserModel.findOne(where);
    if (result != null) {
      if (result.password === password) {
        return done(null, result);
      } else {
        return done(null, false, "密码错误");
      }
    } else {
      return done(null, false, "用户不存在");
    }
  })
);
//序列化
passport.serializeUser((user, done) => {
  done(null, user);
});
//反序列化
passport.deserializeUser((user, done) => {
  return done(null, user);
});

export default passport;

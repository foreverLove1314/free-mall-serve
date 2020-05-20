<template>
  <div>
    <el-row>
      <el-col :span="12"
              :offset="3">
        <a href="https://www.mi.com/index.html"
           class="logo"></a>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6"
              :offset="14">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"
                  class="registerTab">
              <i class="el-icon-user-solid"></i>
              手机注册
            </span>
            <el-form :model="ruleForm"
                     status-icon
                     :rules="rules"
                     ref="ruleForm"
                     class="demo-ruleForm">
              <el-form-item prop="account">
                <el-input v-model="ruleForm.account"
                          autocomplete="off"
                          placeholder="手机/邮箱"></el-input>

                <span class="status">{{ statusMsg }}</span>
              </el-form-item>
              <el-form-item>
                <el-button style="width:100%;"
                           @click="sendMsg">发送验证码</el-button>
              </el-form-item>
              <el-form-item prop="verificationCode">
                <el-input v-model="ruleForm.verificationCode"
                          autocomplete="off"
                          placeholder="请输入验证码"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password"
                          v-model="ruleForm.password"
                          autocomplete="off"
                          placeholder="密码"></el-input>
              </el-form-item>
              <el-form-item prop="rePassword">
                <el-input type="password"
                          v-model="ruleForm.rePassword"
                          autocomplete="off"
                          placeholder="确认密码"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="danger"
                           style="width: 100%;"
                           @click="login('ruleForm')">立即注册</el-button>
                <p class="aboutAccount">
                  <a href="/login"
                     class="register">用户密码登录</a>
                  <a class="noCode">收不到验证码？</a>
                </p>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"
                  class="registerTab">
              <i class="el-icon-full-screen"></i>
              扫描注册
            </span>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "login",
  data () {
    return {
      statusMsg: "",
      ruleForm: {
        account: "",
        verificationCode: "",
        password: ""
      },
      rules: {
        account: [
          {
            require: true,
            trigger: ["blur"],
            validator: (rule, value, callback) => {
              let phone = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
              let email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
              if (value === "") {
                callback(new Error("请输入账号！"));
              } else if (!phone.test(value) && !email.test(value)) {
                callback(new Error("账号不是手机号或者邮箱！"));
              } else {
                callback();
              }
            }
          }
        ],
        verificationCode: [
          {
            require: true,
            trigger: ["blur"],
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入验证码"));
              } else {
                callback();
              }
            }
          }
        ],
        password: [
          {
            require: true,
            trigger: ["blur"],
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入密码！"));
              } else {
                callback();
              }
            }
          }
        ],
        rePassword: [
          {
            require: true,
            trigger: ["blur"],
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请输入密码！"));
              } else if (value !== this.ruleForm.password) {
                callback(new Error("两次密码不一致！"));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    sendMsg () {
      
    },
    login (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message("submit!");
        } else {
          this.$message.error("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
@import url("@/assets/css/Register/Register.css");
</style>

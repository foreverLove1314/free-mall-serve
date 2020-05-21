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
                     ref="phoneForm"
                     class="demo-ruleForm">
              <el-form-item prop="phoneAccount">
                <el-input v-model="ruleForm.phoneAccount"
                          autocomplete="off"
                          placeholder="手机"></el-input>
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
              <el-form-item prop="verificationCode">
                <el-input v-model="ruleForm.verificationCode"
                          autocomplete="off"
                          placeholder="请输入验证码"></el-input>
                <el-button size="mini"
                           round
                           @click="sendPhoneMsg">发送验证码</el-button>
                <span class="status">{{ phoneStatusMsg }}</span>
              </el-form-item>
              <el-form-item>
                <el-button type="danger"
                           style="width: 100%;"
                           @click="phoneRegister('phoneForm')">立即注册</el-button>
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
              <i class="el-icon-message"></i>
              邮箱注册
            </span>
            <el-form :model="ruleForm"
                     status-icon
                     :rules="rules"
                     ref="emailForm"
                     class="demo-ruleForm">
              <el-form-item prop="emailAccount">
                <el-input v-model="ruleForm.emailAccount"
                          autocomplete="off"
                          placeholder="邮箱"></el-input>
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
              <el-form-item prop="verificationCode">
                <el-input v-model="ruleForm.verificationCode"
                          autocomplete="off"
                          placeholder="请输入验证码"></el-input>
                <el-button size="mini"
                           round
                           @click="sendEmailMsg">发送验证码</el-button>
                <span class="status">{{ emailStatusMsg }}</span>
              </el-form-item>
              <el-form-item>
                <el-button type="danger"
                           style="width: 100%;"
                           @click="emailRegister('emailForm')">立即注册</el-button>
                <p class="aboutAccount">
                  <a href="/login"
                     class="register">用户密码登录</a>
                  <a class="noCode">收不到验证码？</a>
                </p>
              </el-form-item>
            </el-form>
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
      phoneStatusMsg: "",
      emailStatusMsg: "",
      ruleForm: {
        phoneAccount: "",
        emailAccount: "",
        verificationCode: "",
        password: "",
        rePassword: ""
      },
      timerid: "",
      rules: {
        phoneAccount: [
          {
            require: true,
            trigger: ["blur"],
            validator: (rule, value, callback) => {
              let phone = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
              if (value === "") {
                callback(new Error("请输入账号！"));
              } else if (!phone.test(value)) {
                callback(new Error("账号不是手机号！"));
              } else {
                callback();
              }
            }
          }
        ],
        emailAccount: [
          {
            require: true,
            trigger: ["blur"],
            validator: (rule, value, callback) => {
              let email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
              if (value === "") {
                callback(new Error("请输入账号！"));
              } else if (!email.test(value)) {
                callback(new Error("账号不是者邮箱！"));
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
    sendPhoneMsg () {
      if (this.timerid) {
        return false;
      }
      this.$refs["phoneForm"].validateField("phoneAccount", (valid) => {
        if (!valid) {
          this.$axios.post("/register/registerPhone", {
            phone: this.ruleForm.phoneAccount
          }).then(({ status, data }) => {
            console.log(status, data);
            if (!status) {
              this.$message.error('获取失败');
              return;
            }
            let count = 60;
            this.phoneStatusMsg = `验证码已发送，剩余${--count}s`;
            this.timerid = setInterval(() => {
              this.phoneStatusMsg = `验证码已发送，剩余${--count}s`;
              if (count === 0) {
                clearInterval(this.timerid)
              }
            }, 1000);
            this.$message({
              showClose: true,
              message: '验证码：' + data.codeNum,
              type: 'success',
              duration: 20000
            });
          })
        }
      })
    },
    sendEmailMsg () {

    },
    phoneRegister (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message("submit!");
        } else {
          this.$message.error("error submit!!");
          return false;
        }
      });
    },
    emailRegister () {
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

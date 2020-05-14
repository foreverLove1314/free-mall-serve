<template>
  <div>
    <el-row>
      <el-col :span="12" :offset="3">
        <a href="https://www.mi.com/index.html" class="logo"></a>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" :offset="14">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label" class="loginTab">
              <i class="el-icon-user-solid"></i>
              登录
            </span>
            <el-form
              :model="ruleForm"
              status-icon
              :rules="rules"
              ref="ruleForm"
              class="demo-ruleForm"
            >
              <el-form-item prop="account">
                <el-input
                  v-model="ruleForm.account"
                  autocomplete="off"
                  placeholder="手机/邮箱"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model="ruleForm.password"
                  autocomplete="off"
                  placeholder="密码"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="danger"
                  style="width: 100%;"
                  @click="login('ruleForm')"
                  >登录</el-button
                >
                <p>
                  还没有账号？
                  <a href="/register" class="register">免费注册</a> |
                  <a href="" class="forgetAccount">忘记账号？</a>
                </p>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" class="loginTab">
              <i class="el-icon-full-screen"></i>
              扫码登录
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
  data() {
    return {
      ruleForm: {
        account: "",
        password: ""
      },
      rules: {
        account: [
          {
            require: true,
            trigger: ["blur", "change"],
            validator: (rule, value, callback) => {
              let phone = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
              let email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
              if (value === "") {
                callback(new Error("请输入账号"));
              } else if (!phone.test(value) && !email.test(value)) {
                callback(new Error("请输入手机号或者邮箱"));
              } else {
                callback();
              }
            }
          }
        ],
        password: [
          {
            require: true,
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  methods: {
    login(formName) {
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
@import url("@/assets/css/login/login.css");
</style>

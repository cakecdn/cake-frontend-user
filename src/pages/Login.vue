<template>
  <div class="container-fluid">
    <div class="row login-main">
      <div
        class="col-xs-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4"
      >
        <el-form
          :model="loginForm"
          :rules="loginFormRule"
          ref="loginForm"
          label-position="left"
          label-width="0px"
          class="demo-ruleForm login-container"
        >
          <h3 class="title">CakeCDN 登录</h3>
          <el-form-item prop="account">
            <el-input
              type="text"
              v-model="loginForm.account"
              auto-complete="off"
              placeholder="用户名"
              @keyup.enter.native="handleLogin"
            ></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input
              type="password"
              v-model="loginForm.checkPass"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            ></el-input>
          </el-form-item>
          <el-checkbox v-model="checked" checked class="remember"
            >保持登录
          </el-checkbox>
          <el-form-item style="width:100%;">
            <el-button
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
              :loading="loggingIn"
              >登录
            </el-button>
          </el-form-item>
          <!--<a @click="redirect('/register')">注册新用户</a>&nbsp;&nbsp;&nbsp;&nbsp;<a @click="redirect('/forgot_password')">忘记账号/密码</a>-->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { requestLogin } from "../api/account";
import axios from "axios";
// import store from "../vuex/store.js";

let Base64 = require("js-base64").Base64;

export default {
  data: function() {
    return {
      loggingIn: false,
      loginForm: {
        account: "",
        checkPass: ""
      },
      loginFormRule: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        checkPass: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loggingIn = true;
          let loginParams = {
            username: this.loginForm.account,
            password: this.loginForm.checkPass
          };

          requestLogin(loginParams)
            .then(resdata => {
              this.loggingIn = false;
              let { meta, data } = resdata;
              if (meta.success === false) {
                this.$message({
                  message: meta.message,
                  type: "error"
                });
              } else {
                sessionStorage.setItem(
                  "JSONWebToken",
                  JSON.stringify(data)
                );
                let tokenBody = data.split(".")[1];
                let userData = JSON.parse(Base64.decode(tokenBody));
                let name = userData.sub;
                let group = userData.auth;
                let wizard = userData.wizard;
                let avatarUrl = userData.avatar;
                let groupName = "非法用户";
                if (group.includes("ROLE_ADMIN")) {
                  groupName = "系统管理员";
                } else if (group.includes("ROLE_BROKER")) {
                  groupName = "运营专员";
                } else if (group.includes("ROLE_USER")) {
                  groupName = "注册用户";
                }
                if (!group.includes("ROLE_USER")) {
                  this.$message({
                    message: "用户权限不足！",
                    type: "error"
                  });
                  return;
                }
                this.$store.commit("loginInit", [
                  name,
                  groupName,
                  wizard,
                  avatarUrl
                ]);
                axios.defaults.headers.common["Authorization"] = data;
                this.$router.push({ path: "/" });
              }
            })
            .catch(error => {
              this.$message({
                message:
                  "连接超时！若刷新页面可访问，请联系管理员修复系统：" + error,
                type: "error"
              });
            });
        } else {
          this.$message({
            message: "用户名和密码不能为空！",
            type: "warning"
          });
          return false;
        }
      });
    },
    redirect($url) {
      this.$router.push($url);
    }
  },
  mounted: function() {}
};
</script>

<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 12vh auto;
  width: 90%;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0 auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0 0 35px 0;
  }
}

a:hover {
  cursor: pointer;
}
</style>

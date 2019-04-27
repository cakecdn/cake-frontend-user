<template>
  <card class="card" title="编辑资料">
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-5">
            <fg-input
              type="text"
              label="用户名"
              :disabled="true"
              placeholder="username"
              v-model="user.username"
            >
            </fg-input>
          </div>
          <div class="col-md-3">
            <fg-input
              type="text"
              label="昵称"
              placeholder="昵称"
              v-model="user.nickname"
            >
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input
              type="email"
              label="Email"
              placeholder="电子邮件"
              v-model="user.email"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fg-input
              type="text"
              label="名字"
              placeholder="First Name"
              v-model="user.firstName"
            >
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input
              type="text"
              label="姓氏"
              placeholder="Last Name"
              v-model="user.lastName"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <fg-input
              type="text"
              label="地址"
              placeholder="Home Address"
              v-model="user.address"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <fg-input
              type="text"
              label="城市"
              placeholder="City"
              v-model="user.city"
            >
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input
              type="text"
              label="国家 / 地区"
              placeholder="Country / Region"
              v-model="user.country"
            >
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input
              type="number"
              label="邮编"
              placeholder="ZIP Code"
              v-model="user.postalCode"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>一句话介绍</label>
              <textarea
                rows="5"
                class="form-control border-input"
                placeholder="Here can be your description"
                v-model="user.aboutMe"
              >
              </textarea>
            </div>
          </div>
        </div>
        <div class="text-center">
          <p-button type="info" round @click.native.prevent="updateProfile">
            Update Profile
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </card>
</template>
<script>
export default {
  data() {
    return {
      user: {
        username: "admin",
        nickname: "系统管理员",
        email: "admin@cakecdn.net",
        firstName: "Joe",
        lastName: "Frank",
        address: "Melbourne, Australia",
        city: "melbourne",
        postalCode: "",
        aboutMe: `Oh so, your weak rhyme. You doubt I'll bother, reading into it.I'll probably won't, left to my own devices. But that's the difference in our opinions.`
      }
    };
  },
  methods: {
    updateProfile() {
    }
  }
};
</script>
<style></style>

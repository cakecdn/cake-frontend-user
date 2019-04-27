<template>
  <card title="用户管理" class="col-12">
    <div class="col-xl-12 col-lg-12 col-md-12">
      <el-table
        :data="users"
        style="width: 100%"
        @selection-change="selecting"
        v-loading="usersListLoading"
      >
        <el-table-column type="selection" min-width="30"></el-table-column>
        <el-table-column prop="id" label="uid" align="center" min-width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          align="center"
          min-width="150"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          min-width="250"
        >
        </el-table-column>
        <el-table-column
          prop="cellphone"
          label="手机"
          align="center"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="created"
          label="创建时间"
          align="center"
          min-width="200"
          default="0"
          type="date"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column
          prop="roles"
          label="用户组"
          align="center"
          default="0"
          min-width="200"
          type="date"
          :formatter="roleFormat"
        ></el-table-column>
        <el-table-column
          label="操作"
          min-width="150"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <el-button size="mini" @click="editUser(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="removeUser(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<edit-profile-form></edit-profile-form>-->
    </div>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="addUser" icon="fa fa-plus"
        >添加用户
      </el-button>
      <el-button
        type="danger"
        @click="batchRemove"
        :disabled="this.usersSelected.length === 0"
        icon="fa fa-trash"
        >批量删除
      </el-button>
      <el-pagination
        layout="prev, pager, next"
        @current-change="paging"
        :page-size="pager.size"
        :total="pager.total"
        style="float:right;"
      >
      </el-pagination>
    </el-col>

    <!-- 添加用户 -->
    <el-dialog
      title="添加新用户"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form :model="form" label-width="90px" :rules="formRules" ref="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            auto-complete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码确认" prop="retypePassword">
          <el-input
            v-model="form.retypePassword"
            auto-complete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="form.email"
            auto-complete="off"
            type="email"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="cellphone">
          <el-input
            v-model="form.cellphone"
            auto-complete="off"
            type="email"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户组" prop="roles">
          <el-select
            v-model="form.roles"
            multiple
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select style="width:40%;" v-model="form.status">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="addSubmit"
          :loading="formSubmitting"
          >提交
        </el-button>
      </div>
    </el-dialog>
  </card>
</template>

<script>
import { mapGetters } from "vuex";
import { listUsers, addUser } from "../../api/users";

export default {
  name: "UserListTable",
  data: function() {
    return {
      users: [],
      usersSelected: [],
      usersListLoading: false,
      pager: {
        page: 1,
        size: 10,
        total: 0
      },
      form: {
        username: null,
        password: null,
        retypePassword: null,
        email: null,
        cellphone: null,
        roles: [],
        status: 0
      },
      formRules: {
        username: [
          { required: true, message: "用户名不能为空。", trigger: "blur" },
          {
            pattern: "^[a-zA-Z]{1}[a-zA-Z0-9_]{5,16}$",
            message:
              "6-12个字符，包含大小写英文字母、数字和下划线，必须以大小写英文字母开头。",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空。", trigger: "blur" },
          { pattern: "^.{8,}$", message: "不能少于8个字符。", trigger: "blur" }
        ],
        retypePassword: [
          { required: true, message: "请再输入一次密码。", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空。", trigger: "blur" },
          {
            pattern:
              "^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$",
            message: "正确的邮箱格式示例：sample@cakecdn.net。",
            trigger: "blur"
          }
        ],
        cellphone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: "^1[0-9]{10}$",
            message: "仅支持中国大陆地区11位手机号。",
            trigger: "blur"
          }
        ],
        roles: [
          {
            required: true,
            message: "用户组不能为空。",
            trigger: "change",
            type: "array"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择用户状态。",
            trigger: "change"
          }
        ]
      },
      formVisible: false,
      formSubmitting: false,
      roleOptions: [
        { label: "管理员", value: "ROLE_ADMIN" },
        { label: "客户专员", value: "ROLE_TENANT" },
        { label: "注册用户", value: "ROLE_USER" }
      ]
    };
  },
  methods: {
    listUsers() {
      this.usersListLoading = true;
      let params = {
        page: this.pager.page - 1,
        size: this.pager.size
      };
      listUsers(params)
        .then(resp => {
          this.usersListLoading = false;
          this.users = resp.data.list;
        })
        .then(error => {
          this.usersListLoading = false;
        });
    },
    dateFormat(row, column) {
      // row, column, cellValue, index
      const daterc = row[column.property];
      if (daterc != null) {
        const dateMat = new Date(daterc);
        const year = dateMat.getFullYear();
        const month = dateMat.getMonth() + 1;
        const day = dateMat.getDate();
        const hh = dateMat.getHours();
        const mm = dateMat.getMinutes();
        const ss = dateMat.getSeconds();
        return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
      }
    },
    roleFormat(row, column) {
      const rolerc = row[column.property];
      let role = "";
      for (let i in rolerc) {
        switch (rolerc[i]) {
          case "ROLE_ADMIN":
            role += " " + "管理员";
            break;
          case "ROLE_TENANT":
            role += " " + "客户专员";
            break;
          case "ROLE_USER":
            role += " " + "注册用户";
            break;
          default:
            role += " " + rolerc[i];
        }
      }
      return role;
    },
    addUser() {
      this.formVisible = true;
    },
    addSubmit() {
      addUser(this.form)
        .then(resp => {
          this.formVisible = false;
          this.$message.success("用户添加成功！");
          this.listUsers();
        })
        .catch(error => {
          this.formVisible = false;
          this.$message.error("用户添加失败：" + error);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    },
    editUser(row) {},
    batchRemove() {},
    removeUser(row) {
      if (this.currentUser.name === row.username) {
        this.$message.warning("不允许删除当前登录的管理员用户！");
      }
    },
    paging(val) {
      this.page = val;
      this.listUsers();
    },
    selecting(sels) {
      this.usersSelected = sels;
    }
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  mounted: function() {
    this.listUsers();
  }
};
</script>

<style scoped lang="scss">
.toolbar {
  padding: 10px;
  //border:1px solid #dfe6ec;
  margin: 10px 0;
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>

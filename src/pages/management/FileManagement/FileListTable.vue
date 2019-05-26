<template>
  <card title="文件管理" class="col-12">
    <div class="col-xl-12 col-lg-12 col-md-12">
      <el-table
        :data="files"
        style="width: 100%"
        @selection-change="selecting"
        v-loading="fileListLoading"
      >
        <el-table-column type="selection" min-width="30"></el-table-column>
        <el-table-column
          prop="name"
          label="文件名"
          align="left"
          min-width="500"
        >
        </el-table-column>
        <el-table-column
          prop="sizeBytes"
          label="文件大小"
          align="center"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="created"
          label="最后修改时间"
          align="center"
          min-width="200"
          default="0"
          type="date"
          :formatter="dateFormat"
        >
        </el-table-column>
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
        >上传文件
      </el-button>
      <el-button
        type="danger"
        @click="batchRemove"
        :disabled="this.filesSelected.length === 0"
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

    <!-- 文件表单 -->
    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </card>
</template>

<script>
import { mapGetters } from "vuex";
import { listUsers, addUser, editUser, deleteUser } from "../../../api/users";

export default {
  name: "UserListTable",
  data: function() {
    return {
      files: [],
      filesSelected: [],
      fileListLoading: false,
      pager: {
        page: 1,
        size: 10,
        total: 0
      },
      form: {
        filename: null,
        password: null,
        retypePassword: null,
        email: null,
        cellphone: null,
        roles: ["ROLE_USER"],
        disabled: false
      },
      isAdd: true,
      addRules: {
        filename: [
          { required: true, message: "文件名不能为空。", trigger: "blur" },
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
            message: "文件组不能为空。",
            trigger: "change",
            type: "array"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择文件状态。",
            trigger: "change"
          }
        ]
      },
      editRules: {
        filename: [
          { required: true, message: "文件名不能为空。", trigger: "blur" },
          {
            pattern: "^[a-zA-Z]{1}[a-zA-Z0-9_]{5,16}$",
            message:
              "6-12个字符，包含大小写英文字母、数字和下划线，必须以大小写英文字母开头。",
            trigger: "blur"
          }
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
            message: "文件组不能为空。",
            trigger: "change",
            type: "array"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择文件状态。",
            trigger: "change"
          }
        ]
      },
      formVisible: false,
      formSubmitting: false,
      roleOptions: [
        { label: "注册文件", value: "ROLE_USER" },
        { label: "客户专员", value: "ROLE_TENANT" },
        { label: "管理员", value: "ROLE_ADMIN" }
      ]
    };
  },
  methods: {
    listUsers() {
      this.fileListLoading = true;
      let params = {
        page: this.pager.page - 1,
        size: this.pager.size
      };
      listUsers(params)
        .then(resp => {
          this.fileListLoading = false;
          this.files = resp.data.list;
        })
        .catch(error => {
          this.fileListLoading = false;
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
            role += " " + "注册文件";
            break;
          default:
            role += " " + rolerc[i];
        }
      }
      return role;
    },
    addUser() {
      this.form = {
        filename: null,
        password: null,
        retypePassword: null,
        email: null,
        cellphone: null,
        roles: ["ROLE_USER"],
        status: 0
      };
      this.isAdd = true;
      this.formVisible = true;
    },
    formSubmit() {
      if (this.isAdd) {
        addUser(this.form)
          .then(resp => {
            this.formVisible = false;
            this.$message.success("文件上传成功！");
            this.listUsers();
          })
          .catch(error => {
            this.formVisible = false;
            this.$message.error("文件上传失败：" + error);
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
      } else {
        console.log(this.form);
        editUser(this.form, [this.form.id])
          .then(resp => {
            this.formVisible = false;
            this.$message.success("文件修改成功！");
            this.listUsers();
          })
          .catch(err => {
            this.$message.warning("文件修改失败：" + err);
          });
      }
    },
    editUser(row) {
      this.formVisible = true;
      this.form = JSON.parse(JSON.stringify(row));
      this.isAdd = false;
    },
    batchRemove() {},
    removeUser(row) {
      if (this.currentUser.name === row.filename) {
        this.$message.warning("不允许删除当前登录的管理员文件！");
        return;
      }
      deleteUser([row.id])
        .then(resp => {
          this.$message.success("文件删除成功！");
          this.listUsers();
        })
        .catch(err => {
          this.$message.error("文件删除失败：" + err);
        });
    },
    paging(val) {
      this.page = val;
      this.listUsers();
    },
    selecting(sels) {
      this.filesSelected = sels;
    }
  },
  computed: {
    ...mapGetters(["currentUser"]),
    formTitle: function() {
      return this.isAdd ? "上传文件" : "编辑文件";
    }
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

<template>
  <card title="文件管理" class="col-12">
    <div style="margin-left: 24px">目录：{{ this.directory }}</div>
    <div class="col-xl-12 col-lg-12 col-md-12">
      <el-table
        :data="files"
        style="width: 100%"
        @selection-change="selecting"
        v-loading="fileListLoading"
      >
        <el-table-column type="selection" min-width="30"></el-table-column>
        <!--<el-table-column min-width="30">
          <template slot-scope="scope">
            <i :class="fileIcon(scope.row)"></i>
          </template>
        </el-table-column>-->
        <el-table-column label="文件名" align="left" min-width="250">
          <template slot-scope="scope">
            <i :class="fileIcon(scope.row)"></i>
            <a
              href="javascript:"
              style="color: #777;"
              @click="fileLinkClick(scope.row)"
            >
              {{ scope.row.name }}</a
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="sizeBytes"
          label="文件大小"
          align="center"
          min-width="100"
          :formatter="fileSizeFormat"
        >
        </el-table-column>
        <el-table-column
          prop="lastModified"
          label="最后修改时间"
          align="center"
          width="200"
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
            <el-button
              size="mini"
              @click="editFile(scope.row)"
              v-if="scope.row.type !== 'PARENT_DIRECTORY'"
            >编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.type !== 'PARENT_DIRECTORY'"
              @click="removeFile(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<edit-profile-form></edit-profile-form>-->
    </div>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="addFile" icon="el-icon-upload2"
      >&nbsp;&nbsp;上传文件
      </el-button>
      <el-button type="primary" @click="addFolder" icon="fa fa-folder"
      >&nbsp;&nbsp;新建目录
      </el-button>
      <el-button
        type="danger"
        @click="batchRemove"
        :disabled="this.filesSelected.length === 0"
        icon="el-icon-delete"
      >&nbsp;&nbsp;批量删除
      </el-button>
      <!--<el-pagination
        layout="prev, pager, next"
        @current-change="paging"
        :page-size="pager.size"
        :total="pager.total"
        style="float:right;"
      >
      </el-pagination>-->
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

    <!-- 文件概况窗口 -->
    <el-dialog
      :title="chosenFile.name"
      :visible.sync="linkDialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-input v-model="chosenFile.url" placeholder="无链接" @focus="copyUrl">
        <el-button
          slot="append"
          icon="fa fa-external-link"
          @click="browserOpen(chosenFile.url)"
        ></el-button>
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="linkDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </card>
</template>

<script>
  import {mapGetters} from "vuex";
  import {listFiles} from "../../../api/files";

  export default {
    name: "FileListTable",
    data: function () {
      return {
        chosenFile: {},
        directoryStack: [],
        files: [],
        filesSelected: [],
        fileListLoading: false,
        formVisible: false,
        linkDialogVisible: false,
        pager: {
          page: 1,
          size: 10,
          total: 0
        }
      };
    },
    methods: {
      listFiles() {
        this.fileListLoading = true;
        let params = {
          page: this.pager.page - 1,
          size: this.pager.size
        };
        let url = this.node.downloadUrl;
        let uid = this.currentUser.uid;
        listFiles(url, uid, this.directory)
          .then(resp => {
            this.fileListLoading = false;
            this.files = [];
            if (this.directory !== "/") {
              this.files.push({
                name: "(上层目录)",
                type: "PARENT_DIRECTORY"
              });
            }
            this.files = this.files.concat(resp.data.paths);
            this.files = this.files.concat(resp.data.files);
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
      fileSizeFormat(row, column) {
        const fileSize = row[column.property];
        let fileSizeStr = fileSize + "B";
        if (fileSize > 1024) fileSizeStr = (fileSize / 1024).toFixed(2) + "KB";
        if (fileSize > 1024 * 1024)
          fileSizeStr = (fileSize / 1024 / 1024).toFixed(2) + "MB";
        if (fileSize > 1024 * 1024 * 1024)
          fileSizeStr = (fileSize / 1024 / 1024 / 1024).toFixed(2) + "GB";
        if (typeof fileSize === "undefined") return "";
        return fileSizeStr;
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
      addFile() {
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
      addFolder() {
      },
      editFile(row) {
        this.formVisible = true;
        this.form = JSON.parse(JSON.stringify(row));
        this.isAdd = false;
      },
      batchRemove() {
      },
      paging(val) {
        this.page = val;
        this.listFiles();
      },
      selecting(sels) {
        this.filesSelected = sels;
      },
      contains(a, obj) {
        let i = a.length;
        while (i--) {
          if (a[i] === obj) {
            return i;
          }
        }
        return false;
      },
      fileIcon(row) {
        if (row.type === "DIRECTORY") return "fa fa-folder-o";
        if (row.type === "PARENT_DIRECTORY") return "fa fa-level-up";
        else return "fa fa-file-o";
      },
      fileLinkClick(row) {
        if (row.type === "PARENT_DIRECTORY") {
          this.directoryStack.pop();
        } else if (row.type === "DIRECTORY") {
          this.directoryStack.push(row.name);
        } else if (row.type === "FILE") {
          this.chosenFile = row;
          this.linkDialogVisible = true;
        }
        this.listFiles();
      },
      queryPath(path) {
        if (path.charAt(0) === "/") path = path.substr(1, path.length);
        if (path.charAt(path.length - 1) === "/")
          path = path.substr(0, path.length - 1);
        return path;
      },
      copyUrl() {
        let that = this;
        this.$copyText(this.chosenFile.url).then(
          function () {
            that.$message.success("URL复制成功！");
          },
          function () {
            that.$message.error("URL复制失败！");
          }
        );
      },
      browserOpen(url) {
        window.open(url, '_blank');
      }
    },
    computed: {
      ...mapGetters(["node", "currentUser"]),
      formTitle: function () {
        return this.isAdd ? "上传文件" : "编辑文件";
      },
      directory() {
        let path = "/";
        for (let i in this.directoryStack) {
          if (this.directoryStack.hasOwnProperty(i)) {
            path += this.directoryStack[i];
          }
        }
        return path;
      }
    },
    mounted: function () {
      let path = "/";
      if (this.$route.query.hasOwnProperty("path")) {
        path = path + this.$route.query.path;
      }
      path = this.queryPath(path);
      this.directoryStack = path.split("/");
      if (this.directoryStack[0] === "") this.directoryStack = [];
      this.listFiles();
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

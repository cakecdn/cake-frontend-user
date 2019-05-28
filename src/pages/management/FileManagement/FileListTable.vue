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
              @click="deleteFile(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<edit-profile-form></edit-profile-form>-->
    </div>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button
        type="primary"
        @click.native="uploadVisible = true"
        icon="el-icon-upload2"
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

    <!-- 文件修改窗口 -->
    <el-dialog
      title="编辑文件"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form>
        <el-form-item label="文件名称">
          <el-input v-model="chosenFile.name">
            <el-button slot="append" @click="saveFileName">保存</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 文件上传窗口 -->
    <el-dialog
      title="上载文件"
      :visible.sync="uploadVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="600px"
    >
      <div style="margin-left: 100px">
        <el-upload class="upload-demo" drag :action="path" multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">文件大小不得超过100M</div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUploadWindow">关闭</el-button>
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
import { mapGetters } from "vuex";
import {
  listFiles,
  addFolder,
  deleteFileOrFolder,
  rename
} from "../../../api/files";

export default {
  name: "FileListTable",
  data: function() {
    return {
      chosenFile: {},
      directoryStack: [],
      files: [],
      filesSelected: [],
      fileListLoading: false,
      editDialogVisible: false,
      linkDialogVisible: false,
      uploadVisible: false,
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
      let dir = this.directory;
      listFiles(url, uid, dir)
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
    deleteFile(row) {
      let url = this.node.downloadUrl;
      let uid = this.currentUser.uid;
      let dir = this.directory + "/" + row.name;
      deleteFileOrFolder(url, uid, dir)
        .then(() => {
          this.$message.success("删除成功！");
          this.listFiles();
        })
        .catch(error => {
          this.$message.error("删除失败：" + error);
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
      if (fileSize >= 1024) fileSizeStr = (fileSize / 1024).toFixed(2) + "KB";
      if (fileSize >= 1024 * 1024)
        fileSizeStr = (fileSize / 1024 / 1024).toFixed(2) + "MB";
      if (fileSize >= 1024 * 1024 * 1024)
        fileSizeStr = (fileSize / 1024 / 1024 / 1024).toFixed(2) + "GB";
      if (typeof fileSize === "undefined") return "";
      return fileSizeStr;
    },
    roleFormat(row, column) {
      const rolerc = row[column.property];
      let role = "";
      for (let i in rolerc) {
        if (rolerc.hasOwnProperty(i)) {
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
      }
      return role;
    },
    saveFileName() {
      let body = {
        src: this.chosenFile.oldFileName,
        dst: this.chosenFile.name
      };
      let url = this.node.downloadUrl;
      let uid = this.currentUser.uid;
      let dir = this.directory;
      rename(url, uid, dir, body)
        .then(resp => {
          this.$message.success("重命名成功！");
          this.listFiles();
        })
        .catch(err => {
          this.$message.error("重命名失败！");
        });
    },
    addFolder() {
      this.$prompt("请输入目录名", "添加目录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[^\\/:\\*\\?"<>|]{1,120}$/,
        inputErrorMessage: "120个字符以内，不能含有：? * < > : | \\ /"
      }).then(({ value }) => {
        let url = this.node.downloadUrl;
        let uid = this.currentUser.uid;
        let dir = this.directory;
        let body = {
          value: value
        };
        addFolder(url, uid, dir, body)
          .then(resp => {
            this.$message({
              type: "success",
              message: "目录添加成功！"
            });
            this.listFiles();
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: "目录添加失败！"
            });
          });
      });
    },
    editFile(row) {
      this.chosenFile = JSON.parse(JSON.stringify(row));
      this.chosenFile.oldFileName = this.chosenFile.name;
      this.editDialogVisible = true;
    },
    batchRemove() {},
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
      if (row.type === "DIRECTORY") return "fa fa-folder";
      if (row.type === "PARENT_DIRECTORY") return "fa fa-level-up";
      else return "fa fa-file-o";
    },
    fileLinkClick(row) {
      if (row.type === "PARENT_DIRECTORY") {
        this.directoryStack.pop();
      } else if (row.type === "DIRECTORY") {
        this.directoryStack.push(row.name);
      } else if (row.type === "FILE") {
        this.chosenFile = JSON.parse(JSON.stringify(row));
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
        function() {
          that.$message.success("URL复制成功！");
        },
        function() {
          that.$message.error("URL复制失败！");
        }
      );
    },
    browserOpen(url) {
      window.open(url, "_blank");
    },
    closeUploadWindow() {
      this.uploadVisible = false;
      this.listFiles();
    }
  },
  computed: {
    ...mapGetters(["node", "currentUser"]),
    directory() {
      let path = "/";
      for (let i in this.directoryStack) {
        if (this.directoryStack.hasOwnProperty(i)) {
          path += this.directoryStack[i];
          path += "/";
        }
      }
      return path;
    },
    path() {
      return (
        this.node.uploadUrl + "/" + this.currentUser.uid + "/" + this.directory
      );
    }
  },
  mounted: function() {
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

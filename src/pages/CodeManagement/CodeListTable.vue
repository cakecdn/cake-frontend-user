<template>
  <card title="充值码管理" class="col-12">
    <div class="col-xl-12 col-lg-12 col-md-12">
      <el-table
        :data="codes"
        style="width: 100%"
        @selection-change="selecting"
        @cell-click="handleCellClick"
        v-loading="codeListLoading"
      >
        <el-table-column type="selection" min-width="30"></el-table-column>
        <el-table-column prop="id" label="uid" align="center" min-width="50">
        </el-table-column>
        <el-table-column
          prop="traffic"
          label="流量大小"
          align="center"
          min-width="150"
          default="0"
          type="date"
          :formatter="trafficFormat"
        >
        </el-table-column>
        <el-table-column
          prop="created"
          label="创建时间"
          align="center"
          min-width="150"
          default="0"
          type="date"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column
          prop="expire"
          label="到期时间"
          align="center"
          min-width="150"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="80"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="removeCode(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<edit-profile-form></edit-profile-form>-->
    </div>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="addCodes" icon="fa fa-plus"
        >添加充值码
      </el-button>
      <el-button
        type="danger"
        @click="batchRemove"
        :disabled="this.codesSelected.length === 0"
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

    <el-dialog
      title="查看充值码"
      :visible.sync="codeVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-input
        v-model="codeWindow.code"
        placeholder="无效充值码"
        readonly
      ></el-input>
    </el-dialog>

    <!-- 用户表单 -->
    <el-dialog
      title="添加充值码"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form
        :model="form"
        label-width="90px"
        :rules="isAdd ? addRules : editRules"
        ref="form"
      >
        <el-form-item label="流量大小" prop="traffic">
          <el-input v-model="form.traffic" auto-complete="off">
            <el-select
              v-model="form.trafficLabel"
              slot="append"
              placeholder="请选择"
            >
              <el-option label="B" value="B"></el-option>
              <el-option label="KB" value="KB"></el-option>
              <el-option label="MB" value="MB"></el-option>
              <el-option label="GB" value="GB"></el-option>
              <el-option label="TB" value="TB"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="留存天数" prop="days">
          <el-input-number
            style="width: 100%"
            v-model="form.days"
            auto-complete="off"
            :min="1"
            :max="500"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="新增数量" prop="number">
          <el-input-number
            style="width: 100%"
            v-model="form.number"
            auto-complete="off"
            :min="1"
            :max="50"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="formSubmit"
          :loading="formSubmitting"
          >提交
        </el-button>
      </div>
    </el-dialog>
  </card>
</template>

<script>
import {
  listCodes,
  addCode,
  deleteCode,
  batchDeleteCodes
} from "../../api/codes";

export default {
  name: "CodesListTable",
  data: function() {
    return {
      codes: [],
      codesSelected: [],
      codeListLoading: false,
      pager: {
        page: 1,
        size: 10,
        total: 0
      },
      form: {
        traffic: "100",
        trafficLabel: "GB",
        days: 30,
        number: 1
      },
      isAdd: true,
      addRules: {
        traffic: [
          { required: true, message: "流量不能为空。", trigger: "blur" },
          {
            pattern: "^[1-9][0-9]{1,18}$",
            message: "必须是1-9223372036854775807的整型数字。",
            trigger: "blur"
          }
        ],
        days: [
          { required: true, message: "留存天数不能为空。", trigger: "blur" }
        ],
        number: [
          { required: true, message: "新增数量不能为空。", trigger: "blur" }
        ]
      },
      formVisible: false,
      formSubmitting: false,
      roleOptions: [
        { label: "注册用户", value: "ROLE_USER" },
        { label: "客户专员", value: "ROLE_TENANT" },
        { label: "管理员", value: "ROLE_ADMIN" }
      ],
      codeVisible: false,
      codeWindow: {
        code: ""
      }
    };
  },
  methods: {
    listCodes() {
      this.codeListLoading = true;
      let params = {
        page: this.pager.page - 1,
        size: this.pager.size
      };
      listCodes(params)
        .then(resp => {
          this.codeListLoading = false;
          this.codes = resp.data.list;
          this.pager.page = resp.data.page + 1;
          this.pager.total = resp.data.total;
        })
        .then(error => {
          this.codeListLoading = false;
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
    trafficFormat(row) {
      let traffic = row.trafficBytes;
      let formattedTrafficBytes = "";
      if (traffic > 1024) {
        formattedTrafficBytes = (traffic / 1024).toFixed(2) + "KB";
      }
      if (traffic > 1024 * 1024) {
        formattedTrafficBytes = (traffic / (1024 * 1024)).toFixed(2) + "MB";
      }
      if (traffic > 1024 * 1024 * 1024) {
        formattedTrafficBytes =
          (traffic / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }
      if (traffic > 1024 * 1024 * 1024 * 1024) {
        formattedTrafficBytes =
          (traffic / (1024 * 1024 * 1024 * 1024)).toFixed(2) + "TB";
      }
      return formattedTrafficBytes;
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
    handleCellClick(row, column) {
      if (column.label !== "操作" && column.label !== "uid") {
        this.codeVisible = true;
        this.codeWindow.code = JSON.parse(JSON.stringify(row.code));
      }
    },
    addCodes() {
      this.form = {
        traffic: "100",
        trafficLabel: "GB",
        days: 30,
        number: 1
      };
      this.isAdd = true;
      this.formVisible = true;
    },
    formSubmit() {
      let trafficBytes = 0;
      switch (this.form.trafficLabel) {
        case "B":
          trafficBytes = this.form.traffic;
          break;
        case "KB":
          trafficBytes = this.form.traffic * 1024;
          break;
        case "MB":
          trafficBytes = this.form.traffic * 1024 * 1024;
          break;
        case "GB":
          trafficBytes = this.form.traffic * 1024 * 1024 * 1024;
          break;
        case "TB":
          trafficBytes = this.form.traffic * 1024 * 1024 * 1024 * 1024;
          break;
      }
      let params = {
        number: this.form.number,
        days: this.form.days,
        trafficBytes: trafficBytes
      };
      addCode(params)
        .then(resp => {
          this.formVisible = false;
          this.$message.success("充值码添加成功！");
          this.listCodes();
        })
        .catch(error => {
          this.formVisible = false;
          this.$message.error("充值码添加失败：" + error);
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
    batchRemove() {
      let codeIds = [];
      for (let i in this.codesSelected) {
        codeIds.push(this.codesSelected[i].id);
      }
      batchDeleteCodes(codeIds)
        .then(resp => {
          this.$message.success("充值码删除成功！");
          this.listCodes();
        })
        .catch(error => {
          this.$message.error("充值码删除失败：" + error);
        });
    },
    removeCode(row) {
      deleteCode([row.id])
        .then(resp => {
          this.$message.success("充值码删除成功！");
          this.listCodes();
        })
        .catch(err => {
          this.$message.error("充值码删除失败：" + err);
        });
    },
    paging(val) {
      this.pager.page = val;
      this.listCodes();
    },
    selecting(sels) {
      this.codesSelected = sels;
    }
  },
  mounted: function() {
    this.listCodes();
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

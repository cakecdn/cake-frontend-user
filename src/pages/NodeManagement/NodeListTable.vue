<template>
  <card title="节点管理" class="col-12">
    <div class="col-xl-12 col-lg-12 col-md-12">
      <el-table
        :data="nodes"
        style="width: 100%"
        @selection-change="selecting"
        v-loading="nodesListLoading"
      >
        <el-table-column type="selection" width="30"></el-table-column>
        <el-table-column prop="id" label="uid" align="center" width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="节点名称"
          align="center"
          width="300"
        >
        </el-table-column>
        <el-table-column
          prop="healthStatus"
          label="健康状态"
          align="center"
          width="90"
          type="date"
        >
        </el-table-column>
        <el-table-column
          prop="totalTrafficBytes"
          label="总流量(GB)"
          align="center"
          width="200"
          type="date"
          :formatter="trafficFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="usedTrafficBytes"
          label="已用流量(GB)"
          align="center"
          width="200"
          type="date"
          :formatter="trafficFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="uploadUrl"
          label="上传地址"
          align="center"
          width="500"
          type="date"
        >
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="removeNode(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<edit-profile-form></edit-profile-form>-->
    </div>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="addNode" icon="fa fa-plus"
        >添加节点</el-button
      >
      <el-button
        type="danger"
        @click="batchRemove"
        icon="fa fa-trash"
        :disabled="this.nodesSelected.length === 0"
      >
        批量删除
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

    <!-- 添加节点 -->
    <el-dialog
      title="添加新节点"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form :model="form" label-width="90px" :rules="formRules" ref="form">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上传地址" prop="uploadUrl">
          <el-input
            v-model="form.uploadUrl"
            auto-complete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="下载地址" prop="downloadUrl">
          <el-input
            v-model="form.downloadUrl"
            auto-complete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="健康检查" prop="healthCheckUrl">
          <el-input
            v-model="form.healthCheckUrl"
            auto-complete="off"
            type="email"
          ></el-input>
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
import { listNodes } from "../../api/nodes";

export default {
  name: "NodeListTable",
  data: function() {
    return {
      nodes: [],
      nodesSelected: [],
      nodesListLoading: false,
      pager: {
        page: 1,
        size: 10,
        total: 0
      },
      form: {
        name: null,
        uploadUrl: null,
        downloadUrl: null,
        healthCheckUrl: null,
        roles: [],
        status: 0
      },
      formRules: {
        name: [
          { required: true, message: "用户名不能为空。", trigger: "blur" },
          {
            pattern: "^[a-zA-Z]{1}[a-zA-Z0-9_]{5,16}$",
            message:
              "6-12个字符，包含大小写英文字母、数字和下划线，必须以大小写英文字母开头。",
            trigger: "blur"
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
    listNodes() {
      this.nodesListLoading = true;
      let params = {
        page: this.pager.page - 1,
        size: this.pager.size
      };
      listNodes(params)
        .then(resp => {
          this.nodesListLoading = false;
          this.nodes = resp.data.list;
        })
        .then(error => {
          this.nodesListLoading = false;
        });
    },
    addNode() {
      this.formVisible = true;
    },
    addSubmit() {},
    batchRemove() {},
    removeNode(row) {},
    paging(val) {
      this.page = val;
      this.listNodes();
    },
    selecting(sels) {
      this.nodesSelected = sels;
    },
    trafficFormatter(row, column) {
      const trafficrc = row[column.property];
      return (trafficrc / 1073741824).toFixed(4);
    }
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  mounted: function() {
    this.listNodes();
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

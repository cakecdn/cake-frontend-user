<template>
  <div class="row">
    <card title="流量充值" class="col-12">
      <el-form>
        <el-form-item label="请输入充值码">
          <el-input
            v-model="rechargeCode"
            placeholder="请输入充值码查询有效性"
            @keyup.enter="getRechargeCode"
          >
            <el-button slot="append" @click="getRechargeCode"
              >查询充值码
            </el-button>
          </el-input>
        </el-form-item>
        <el-alert
          :title="flag.content"
          v-if="flag.show"
          type="warning"
          @close="closeAlert"
        >
        </el-alert>
      </el-form>
      <div class="col-12" v-if="showInfo">
        <table style="width: 80%; margin: 12px auto 0">
          <tr>
            <th style="width: 20%; text-align: center">流量大小：</th>
            <td style="width: 20%; text-align: center">
              {{ rechargeCodeInfo.traffics }}
            </td>
            <th style="width: 20%; text-align: center">过期时间：</th>
            <td style="width: 20%; text-align: center">
              {{ rechargeCodeInfo.expire }}
            </td>
            <td style="width: 20%; text-align: center">
              <el-button :disabled="disableUseButton" @click="useCode"
                >确认使用
              </el-button>
            </td>
          </tr>
        </table>
      </div>
    </card>
  </div>
</template>
<script>
import UserListTable from "./FileManagement/FileListTable";
import { getRechargeCode, useRechargeCode } from "../../api/recharge-code";
import { fileSizeFormatter, dateTimeFormatter } from "../../utils/formatter";
import { mapActions } from "vuex";

export default {
  data: function() {
    return {
      rechargeCode: "",
      rechargeCodeInfo: {
        traffics: 0,
        expire: null
      },
      showInfo: false,
      disableUseButton: false,
      flag: {
        show: false,
        content: ""
      }
    };
  },
  methods: {
    ...mapActions(["fetchUserProfiles"]),
    getRechargeCode() {
      this.disableUseButton = false;
      this.flag.show = false;
      let now = new Date();
      getRechargeCode([this.rechargeCode])
        .then(resp => {
          if (resp.meta.success === true) {
            if (resp.data.userId !== null) {
              this.flag.show = true;
              this.flag.content = "充值码已被使用！";
              this.disableUseButton = true;
            } else if (new Date(resp.data.expire) - now < 0) {
              this.flag.show = true;
              this.flag.content = "充值码过期！";
              this.disableUseButton = true;
            }
            this.rechargeCodeInfo.traffics = fileSizeFormatter(
              resp.data.trafficBytes
            );
            this.rechargeCodeInfo.expire = dateTimeFormatter(resp.data.expire);
            this.showInfo = true;
          } else {
            this.flag.show = true;
            this.flag.content = "没有找到充值码，请重新输入！";
            this.showInfo = false;
          }
        })
        .catch(error => {});
    },
    useCode() {
      useRechargeCode([this.rechargeCode])
        .then(resp => {
          this.$message.success("充值成功！");
          this.fetchUserProfiles();
          this.showInfo = false;
        })
        .catch(error=>{
          this.$message.error("充值失败！");
        });
    },
    closeAlert() {
      this.flag.show = false;
    }
  },
  components: {
    UserListTable
  },
  mounted: function() {}
};
</script>
<style></style>

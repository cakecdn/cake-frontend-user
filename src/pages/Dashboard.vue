<template>
  <div>
    <!--Stats cards-->
    <div class="row">
      <div
        class="col-md-12 col-xl-4"
        v-for="stats in statsCards"
        :key="stats.title"
      >
        <stats-card>
          <div
            class="icon-big text-center"
            :class="`icon-${stats.type}`"
            slot="header"
          >
            <i :class="stats.icon"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{ stats.title }}</p>
            {{ stats.value }}
          </div>
          <div
            class="stats"
            slot="footer"
            style="cursor: pointer"
            @click="refreshTraffics"
          >
            <i :class="stats.footerIcon"></i> {{ stats.footerText }}
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div class="col-12" v-if="refreshingTrafficChart">
        <chart-card
          title="流量压力"
          sub-title="24 小时内"
          :chart-data="trafficChart.data"
          :chart-options="trafficChart.options"
        >
          <span slot="footer" style="cursor: pointer" @click="refreshTrend"
            ><i class="ti-reload"></i> 3 分钟前刷新
          </span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> 出口流量({{ trafficUnit }})
          </div>
        </chart-card>
      </div>
    </div>
  </div>
</template>
<script>
import { StatsCard, ChartCard } from "@/components/index";
import Chartist from "chartist";
import { mapGetters, mapActions } from "vuex";
import { fileSizeFormatter } from "../utils/formatter";
import { getTrafficTrend } from "../api/traffic-trend";

export default {
  components: {
    StatsCard,
    ChartCard
  },
  data() {
    return {
      statsCards: [
        {
          type: "success",
          icon: "fa fa-pie-chart",
          title: "剩余流量",
          value: "0 B",
          footerText: "刚刚刷新",
          footerIcon: "ti-reload"
        },
        {
          type: "warning",
          icon: "fa fa-area-chart",
          title: "24小时内使用",
          value: "0 B",
          footerText: "刚刚刷新",
          footerIcon: "ti-reload"
        },
        {
          type: "danger",
          icon: "fa fa-server",
          title: "可用节点",
          value: "0 个",
          footerText: "刚刚刷新",
          footerIcon: "ti-reload"
        }
      ],
      refreshingTrafficChart: true,
      trafficUnit: "B",
      trafficChart: {
        data: {
          labels: ["00:00", "01:00", "02:00", "03:00"],
          series: [[5000, 101, 2008, 7453]]
        },
        options: {
          low: 0,
          high: 10000,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false
        }
      }
    };
  },
  computed: {
    ...mapGetters(["currentUser", "userTraffic", "node"])
  },
  mounted() {
    this.refreshTraffics();
    this.refreshTrend();
    this.statsCards[2].value = this.node.selections.length + " 个";
  },
  methods: {
    ...mapActions(["fetchUserTraffic"]),
    refreshTraffics() {
      this.refreshTrend();
      this.fetchUserTraffic()
        .then(() => {
          this.showTraffics();
        })
        .catch(err => {
          this.$message.error("流量获取失败！");
        });
    },
    showTraffics() {
      if (this.userTraffic.hasOwnProperty("remainingTrafficBytes"))
        this.statsCards[0].value = fileSizeFormatter(
          this.userTraffic.remainingTrafficBytes
        );
    },
    refreshTrend() {
      let userId = this.currentUser.uid;
      this.refreshingTrafficChart = false;
      getTrafficTrend([userId])
        .then(resp => {
          this.trafficChart.data.labels = resp.data.labels;
          this.trafficChart.data.series[0] = resp.data.series;
          this.trafficChart.options.low = resp.data.min;
          this.trafficChart.options.high = resp.data.max;
          this.refreshingTrafficChart = true;
          this.trafficUnit = resp.data.trafficUnit;
          this.statsCards[1].value = fileSizeFormatter(resp.data.totalBytes);
        })
        .catch(error => {
          this.$message.error("流量记录获取失败！");
        });
    }
  }
};
</script>
<style></style>

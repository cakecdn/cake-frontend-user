<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">{{ routeName }}</a>
      <button
        class="navbar-toggler navbar-burger"
        type="button"
        @click="toggleSidebar"
        :aria-expanded="$sidebar.showSidebar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
      </button>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <drop-down
            class="nav-item"
            :title="selectedEndpoint"
            title-classes="nav-link"
            icon="ti-world"
            style="width: 100px;margin-right: 120px"
          >
            <a
              class="dropdown-item"
              href="#"
              v-if="endpoints.length === 0"
              @click="clickEndpointMenu(item)"
              >无可用存储节点</a
            >
            <a
              class="dropdown-item"
              href="#"
              v-for="item in endpoints"
              :key="item.name"
              @click="clickEndpointMenu(item)"
              >{{ endpointOmittedName(item.name) }}</a
            >
          </drop-down>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import { listNodes } from "../../api/nodes";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["node"]),
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    }
  },
  data() {
    return {
      activeNotifications: false,
      endpoints: [],
      selectedEndpoint: "无可用存储节点"
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    clickEndpointMenu(item) {
      this.selectedEndpoint = item.name;
      this.$store.commit("setUrls", [
        item.name,
        item.downloadUrl,
        item.uploadUrl
      ]);
    },
    endpointOmittedName(name) {
      if (name.length > 8) {
        return name.substr(0, 8) + "...";
      }
    }
  },
  mounted: function() {
    listNodes().then(resp => {
      this.endpoints = resp.data;
      this.clickEndpointMenu(this.endpoints[0]);
    });
  }
};
</script>

<style>
.dropdown-item {
  margin: 0 auto;
}
</style>

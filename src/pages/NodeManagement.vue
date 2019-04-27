<template>
  <div class="row">
    <node-list-table></node-list-table>
  </div>
</template>
<script>
  import NodeListTable from './NodeManagement/NodeListTable'

  export default {
    data: function () {
      return {
        nodes: []
      };
    },
    methods: {},
    components: {
      NodeListTable
    },
    mounted: function () {
    }
  };
</script>
<style></style>

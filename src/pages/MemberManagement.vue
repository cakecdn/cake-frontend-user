<template>
  <div class="row">
    <user-list-table></user-list-table>
  </div>
</template>
<script>
  import UserListTable from './MemberManagement/UserListTable'

  export default {
    data: function () {
      return {
        users: []
      };
    },
    methods: {},
    components: {
      UserListTable
    },
    mounted: function () {
    }
  };
</script>
<style></style>

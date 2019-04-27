<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul>
          <li>
            <router-link :to="{ path: '/' }">仪表盘</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright d-flex flex-wrap"> Powered by <a href="https://github.com/cakecdn"
                                                             target="_blank">CakeCDN</a>
      </div>
    </div>
  </footer>
</template>
<script>
  export default {};
</script>
<style>
  .copyright a {
    margin-left: 6px;
  }
</style>

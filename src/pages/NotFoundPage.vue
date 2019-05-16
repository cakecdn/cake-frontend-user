<template>
  <div class="contact-us full-screen">
    <div class="wrapper wrapper-full-page section content">
      <div class="">
        <div class="container">
          <div class="row">
            <div class="col-md-8 col-md-offset-2 text-center">
              <h2 class="title text-danger">404 Not Found</h2>
              <h2 class="title">
                您访问的页面不存在，请检查地址是否正确。
              </h2>
              <p>
                <router-link :to="{ path: '/' }">返回首页</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer-demo"></footer>
  </div>
</template>

<script>
export default {};
</script>

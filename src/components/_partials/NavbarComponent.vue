<template>
  <section class="top-bar">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-6 col-md-6 top-bar-left">
          <div>
            <a href="#"
              ><img
                src="@/assets/secure-check-logo.png"
                class=""
                alt="secure-check-logo"
            /></a>
          </div>
        </div>
        <div class="col col-6 col-md-6 top-bar-right">
          <div class="account-login-button">
            <router-link to="/sign-in" class="login-button">
              Login In
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

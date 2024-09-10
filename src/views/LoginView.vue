<script setup>
</script>

<template>
  <section class="background-gradi login-meeting">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="popup-logo">
            <a href="#"
              ><img
                src="@/assets/secure-check-logo.png"
                class=""
                alt="secure-check-logo"
            /></a>
          </div>
          <form action="">
            <div>
              <label for="client-email">Email</label>
              <input
                type="email"
                id="client-email"
                name="client-email"
                value=""
              /><br />
            </div>
            <div>
              <label for="pwd">Password</label>
              <input type="password" id="pwd" name="pwd" value="" />
            </div>
            <div class="submit-button">
              <input type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<template>
  <section class="secure-datatable-heading-back">
    <div class="container">
      <div class="row align-items-center">
        <div class="col col-12 col-md-12 col-sm-12">
          <div class="left-back">
            <router-link :to="{ name: 'Menu' }">
              <img src="@/assets/back-arrow-table.png" alt="back-arrow" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="scanner_camera">
    <h1>Login with QR Code</h1>
    <video ref="video" width="640" height="480" autoplay></video>
    <canvas ref="canvas" width="640" height="480" style="display: none;"></canvas>
    <p>{{ qrResult }}</p>
    <p>{{ status }}</p>
  </div>
</template>

<script>
import jsQR from "jsqr";

export default {
  data() {
    return {
      qrResult: "Waiting for QR code...",
      status: "Status: Logged Out",
      stream: null,
      loggedIn: false,
      currentUser: "",
      scanInProgress: false,
    };
  },
  mounted() {
    this.startCamera();
  },
  methods: {
    startCamera() {
      const video = this.$refs.video;
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          this.stream = stream;
          video.srcObject = stream;
          video.play();
          this.scanQRCode();
        })
        .catch((err) => {
          console.error("Error accessing camera: ", err);
        });
    },

    scanQRCode() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");

      const scan = () => {
        if (!this.scanInProgress) {
          this.scanInProgress = true;

          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);

          if (code) {
            const qrData = code.data;
            console.log(qrData);

            if (this.isValidURL(qrData)) {
              // If QR code contains a valid URL, redirect to it
              window.location.href = qrData;
            } else if (this.isValidEmail(qrData)) {
              this.handleLoginLogout(qrData);
            } else {
              this.qrResult = `Invalid QR Code: ${qrData}`;
            }
          } else {
            this.qrResult = "No QR code detected.";
          }

          setTimeout(() => {
            this.scanInProgress = false;
          }, 1000);
        }

        setTimeout(() => requestAnimationFrame(scan), 500);
      };

      requestAnimationFrame(scan);
    },

    handleLoginLogout(email) {
      if (!this.loggedIn) {
        this.loggedIn = true;
        this.currentUser = email;
        this.status = `Status: Logged In as ${email}`;
        this.qrResult = `Login successful for ${email}`;
      } else if (this.loggedIn && this.currentUser === email) {
        this.loggedIn = false;
        this.currentUser = "";
        this.status = "Status: Logged Out";
        this.qrResult = "Logout successful!";
      } else {
        this.qrResult = `Already logged in as ${this.currentUser}. Please log out first.`;
      }

      this.scanInProgress = true;
      setTimeout(() => {
        this.scanInProgress = false;
      }, 2000);
    },

    isValidEmail(string) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(string);
    },

    isValidURL(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    },
  },
  beforeUnmount() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  },
};
</script>

<style scoped>
video {
  border: 1px solid black;
}
</style>

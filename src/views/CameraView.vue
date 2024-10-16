<script>
export default {
  name: 'CameraAccess',
  mounted() {
    this.startCamera();
  },
  methods: {
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = stream;
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    },
    capture() {
      const canvas = this.$refs.canvas;
      const context = canvas.getContext('2d');
      context.drawImage(this.$refs.video, 0, 0, canvas.width, canvas.height);
    },
  },
};
</script>

<template>
  <div>
    <h1>Access Your Camera</h1>
    <video ref="video" width="640" height="480" autoplay></video>
    <button @click="capture">Capture</button>
    <canvas ref="canvas" width="640" height="480"></canvas>
  </div>
</template>

<style scoped>
/* Add any styles here if needed */
</style>

<template>
  <div>
    <StreamQrcodeBarcodeReader
      capture="shoot"
      @onloading="onLoading"
      @result="onResult"
      class="rounded-2xl"
      ref="refCamera"
    >
      <template #actions="{ onCanPlay, isReset, onReset }">
        <button class="bg-green-300 px-6 py-1 rounded-md" @click="onCanPlay">
          Stream
        </button>
        <button
          v-if="isReset"
          class="bg-blue-300 px-6 py-1 rounded-md ms-2"
          @click="onReset"
        >
          Reset
        </button>
      </template>

      <template #action-stop="{ onCanStop }">
        <div class="container-btn-stop">
          <button class="bg-pink-300 px-6 py-1 rounded-md" @click="onCanStop">
            Stop
          </button>
        </div>
      </template>

      <template #action-facemode="{ onChangeFacemode }">
        <div class="container-btn-facemode">
          <button
            class="bg-red-300 w-10 h-10 p-2 inline-flex justify-center items-center rounded-full"
            @click="onChangeFacemode"
          >
            <IconCameraVue />
          </button>
        </div>
      </template>
    </StreamQrcodeBarcodeReader>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { StreamQrcodeBarcodeReader } from "vue3-barcode-qrcode-reader";

const decode = ref(null);
const isLoading = ref(false);

function onResult(data) {
  decode.value = data;
}

function onLoading(loading) {
  isLoading.value = loading;
}

// define ref for component
const refCamera = ref(null);

// function handleOnCanPlay() {
//   if (refCamera.value) {
//     refCamera.value.onCanPlay();
//   }
// }

// function handleOnReset() {
//   if (refCamera.value) {
//     refCamera.value.onReset();
//   }
// }

// function handleFacemode() {
//   if (refCamera.value) {
//     refCamera.value.onChangeFacemode();
//   }
// }

// function handleOnCanStop() {
//   if (refCamera.value) {
//     refCamera.value.onCanStop();
//   }
// }
</script>

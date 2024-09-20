<script setup>
import { ref } from "vue";
const open = ref();
</script>

<template>
  <div class="container">
    <ui-button raised @click="open = true">Show scrolling dialog</ui-button>

    <ui-dialog v-model="open" scrollable @confirm="onConfirm">
      <ui-dialog-title>Choose a Ringtone</ui-dialog-title>
      <ui-dialog-content>
        <ui-list>
          <ui-item v-for="i in 3" :key="i">
            <ui-item-text-content>Line item</ui-item-text-content>
          </ui-item>
        </ui-list>
      </ui-dialog-content>
      <ui-dialog-actions></ui-dialog-actions>
    </ui-dialog>
  </div>
</template>

<script setup lang="ts">
import { useSnackbar } from '#imports'

const { state, close } = useSnackbar()
</script>

<template>
  <v-snackbar
    v-model="state.visible"
    :color="state.color"
    :timeout="-1"
    :location="state.location"
  >
    <div class="d-flex align-center">
      <v-icon
        v-if="state. icon"
        :icon="state.icon"
        class="mr-2"
      />
      {{ state.message }}
    </div>

    <template #actions>
      <v-btn
        variant="text"
        @click="close"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

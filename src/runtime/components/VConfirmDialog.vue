<script setup lang="ts">
import { useConfirmDialog } from '#imports'

const { state, handleConfirm, handleCancel } = useConfirmDialog()
</script>

<template>
  <v-dialog
    v-model="state.visible"
    max-width="400"
    :persistent="state.persistent"
  >
    <v-card>
      <v-card-title>{{ state.title }}</v-card-title>
      <v-card-text>{{ state.message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :color="state.cancelColor"
          variant="text"
          @click="handleCancel"
        >
          {{ state.cancelText }}
        </v-btn>
        <v-btn
          :color="state.confirmColor"
          variant="elevated"
          @click="handleConfirm"
        >
          {{ state.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

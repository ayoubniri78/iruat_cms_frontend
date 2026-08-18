<script setup lang="ts">
defineProps<{
  type: 'error' | 'success'
  message: string
}>()
</script>

<template>
  <div
    v-if="message"
    :class="[
      'mb-6 border-4 p-4 font-bold text-sm',
      type === 'error'
        ? 'border-accent bg-red-50 text-accent'
        : 'border-green-600 bg-green-50 text-green-700',
    ]"
    :style="`box-shadow: 3px 3px 0px 0px ${type === 'error' ? '#E53935' : '#16a34a'};`"
  >
    {{ message }}
  </div>
</template>

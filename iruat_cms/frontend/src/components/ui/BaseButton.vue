<script setup lang="ts">
defineProps<{
  loading?: boolean
  type?: 'submit' | 'button'
  variant?: 'primary' | 'secondary'
}>()
</script>

<template>
  <button
    :type="type ?? 'submit'"
    :disabled="loading"
    :class="[
      'w-full py-4 text-sm font-black uppercase tracking-widest border-4 border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
      variant === 'secondary'
        ? 'bg-white text-black hover:bg-black hover:text-white'
        : 'bg-[#E53935] text-white hover:bg-[#C62828]',
    ]"
    style="box-shadow: 4px 4px 0px 0px #000;"
  >
    <template v-if="loading">CHARGEMENT...</template>
    <template v-else><slot /></template>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
  dir?: 'ltr' | 'rtl'
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div>
    <label class="text-xs font-bold uppercase tracking-[0.2em] text-ink/60 mb-1.5 block">{{ label }}</label>
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :dir="dir ?? 'ltr'"
      class="w-full border-4 border-ink px-4 py-3 text-sm bg-cream font-medium placeholder:text-ink/30 focus:outline-none focus:bg-parchment focus:shadow-brutal-sm transition-all"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1.5 text-xs font-bold text-accent">{{ error }}</p>
  </div>
</template>

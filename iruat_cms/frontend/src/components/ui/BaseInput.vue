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
    <label class="text-xs font-black uppercase tracking-wider text-gray-600 mb-1 block">{{ label }}</label>
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :dir="dir ?? 'ltr'"
      class="w-full border-4 border-black px-4 py-3 text-sm bg-[#FAFAF5] focus:outline-none focus:bg-white placeholder:text-gray-400 font-medium"
      style="box-shadow: 3px 3px 0px 0px #000;"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1 text-xs font-bold text-[#E53935]">{{ error }}</p>
  </div>
</template>

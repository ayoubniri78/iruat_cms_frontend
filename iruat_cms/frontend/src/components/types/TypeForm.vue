<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'

const props = defineProps<{
  loading?: boolean
  error?: string
  initialName?: string
}>()

const emit = defineEmits<{
  submit: [name: string]
}>()

const name = ref(props.initialName ?? '')

watch(
  () => props.initialName,
  (val) => {
    name.value = val ?? ''
  },
)

function handleSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed) return
  emit('submit', trimmed)
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <AlertMessage v-if="error" type="error" :message="error" />

    <BaseInput
      v-model="name"
      label="NOM DU TYPE"
      placeholder="Ex: Article, Interview, Reportage..."
      :required="true"
    />

    <BaseButton :loading="loading" type="submit">
      {{ initialName ? 'METTRE À JOUR' : 'CRÉER LE TYPE' }}
    </BaseButton>
  </form>
</template>

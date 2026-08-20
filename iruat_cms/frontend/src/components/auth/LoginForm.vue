<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'

defineProps<{
  loading?: boolean
  error?: string
}>()

const emit = defineEmits<{
  submit: [email: string, password: string]
}>()

const email = ref('')
const password = ref('')

function handleSubmit() {
  emit('submit', email.value, password.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <AlertMessage v-if="error" type="error" :message="error" />

    <BaseInput
      v-model="email"
      label="Adresse e-mail"
      type="email"
      placeholder="vous@exemple.com"
      :required="true"
    />

    <BaseInput
      v-model="password"
      label="Mot de passe"
      type="password"
      placeholder="••••••••"
      :required="true"
    />

    <BaseButton :loading="loading">
      SE CONNECTER
    </BaseButton>
  </form>
</template>

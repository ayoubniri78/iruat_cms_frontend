<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton.vue'

defineProps<{
  loading?: boolean
  error?: string
}>()

const emit = defineEmits<{
  submit: [email: string, password: string]
  googleLogin: []
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

    <GoogleLoginButton :loading="loading" @click="$emit('googleLogin')" />

    <p class="mt-6 text-center text-sm text-gray-500 font-medium">
      Pas encore de compte ?
      <router-link to="/register" class="text-[#E53935] font-black uppercase tracking-wider hover:underline">
        S'inscrire
      </router-link>
    </p>
  </form>
</template>

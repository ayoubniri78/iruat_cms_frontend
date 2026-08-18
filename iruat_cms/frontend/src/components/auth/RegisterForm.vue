<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton.vue'

defineProps<{
  loading?: boolean
  error?: string
  success?: string
}>()

const emit = defineEmits<{
  submit: [firstName: string, lastName: string, email: string, password: string]
  googleLogin: []
}>()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const clientError = ref('')

function validateForm(): boolean {
  if (!firstName.value.trim()) {
    clientError.value = 'Le prénom est requis.'
    return false
  }
  if (!lastName.value.trim()) {
    clientError.value = 'Le nom est requis.'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    clientError.value = 'Veuillez entrer une adresse e-mail valide.'
    return false
  }

  if (password.value.length < 6) {
    clientError.value = 'Le mot de passe doit contenir au moins 6 caractères.'
    return false
  }

  if (password.value !== confirmPassword.value) {
    clientError.value = 'Les mots de passe ne correspondent pas.'
    return false
  }

  clientError.value = ''
  return true
}

function handleSubmit() {
  if (!validateForm()) return
  emit('submit', firstName.value, lastName.value, email.value, password.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <AlertMessage v-if="error" type="error" :message="error" />
    <AlertMessage v-if="success" type="success" :message="success" />

    <template v-if="!success">
      <BaseInput
        v-model="firstName"
        label="Prénom"
        placeholder="Jean"
        :required="true"
      />

      <BaseInput
        v-model="lastName"
        label="Nom"
        placeholder="Dupont"
        :required="true"
      />

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

      <BaseInput
        v-model="confirmPassword"
        label="Confirmer le mot de passe"
        type="password"
        placeholder="••••••••"
        :required="true"
      />

      <p v-if="clientError" class="text-xs font-bold text-[#E53935]">{{ clientError }}</p>

      <BaseButton :loading="loading">
        CRÉER MON COMPTE
      </BaseButton>

      <GoogleLoginButton :loading="loading" @click="$emit('googleLogin')" />
    </template>

    <p class="mt-6 text-center text-sm text-gray-500 font-medium">
      Déjà un compte ?
      <router-link to="/login" class="text-[#E53935] font-black uppercase tracking-wider hover:underline">
        Se connecter
      </router-link>
    </p>
  </form>
</template>

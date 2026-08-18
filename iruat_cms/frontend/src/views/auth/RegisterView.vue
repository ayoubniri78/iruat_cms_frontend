<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import AuthLayout from '@/layouts/AuthLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const authStore = useAuthStore()
const successMessage = ref('')

async function handleRegister(firstName: string, lastName: string, email: string, password: string) {
  const result = await authStore.register(email, password, firstName, lastName)
  if (result.success) {
    successMessage.value = 'Vérifiez votre email pour confirmer votre inscription.'
  }
}

async function handleGoogleLogin() {
  await authStore.loginWithGoogle()
}
</script>

<template>
  <AuthLayout>
    <!-- Stamp badge -->
    <div class="absolute -top-3 -right-3 bg-[#E53935] text-white border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest rotate-6">
      NOUVEAU
    </div>

    <!-- Heading -->
    <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-1 leading-none">
      Rejoignez-nous
    </h1>
    <p class="text-sm text-gray-500 mb-8 font-medium">
      Créez votre compte
    </p>

    <RegisterForm
      :loading="authStore.loading"
      :error="authStore.error"
      :success="successMessage"
      @submit="handleRegister"
      @google-login="handleGoogleLogin"
    />
  </AuthLayout>
</template>

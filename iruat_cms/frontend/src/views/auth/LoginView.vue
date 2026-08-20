<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { supabase } from '@/lib/supabase'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogin(email: string, password: string) {
  const result = await authStore.login(email, password)

  if (result.success) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log('Session:', session)
    console.log('Access Token:', session?.access_token)

    router.push('/dashboard')
  }
}

</script>

<template>
  <AuthLayout>
    <!-- Stamp badge -->
    <div class="absolute -top-3 -right-3 bg-[#E53935] text-white border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest rotate-6">
      MEMBER
    </div>

    <!-- Heading -->
    <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-1 leading-none">
      Bon retour
    </h1>
    <p class="text-sm text-gray-500 mb-8 font-medium">
      Connectez-vous à votre compte
    </p>

    <LoginForm
      :loading="authStore.loading"
      :error="authStore.error"
      @submit="handleLogin"
    />
  </AuthLayout>
</template>

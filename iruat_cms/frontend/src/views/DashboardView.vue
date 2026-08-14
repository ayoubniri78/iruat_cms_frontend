<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const userEmail = computed(() => authStore.user?.email ?? 'inconnu')

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#F5F0E8] font-sans flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Decorative tape strips -->
      <div class="relative">
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#FFFACD] border border-black/20 rotate-1 z-10"></div>
        <div class="absolute -top-3 left-8 w-16 h-5 bg-[#FFE4E1] border border-black/20 -rotate-2 z-10"></div>
      </div>

      <!-- Card -->
      <div
        class="bg-white border-4 border-black p-8 pt-10 -rotate-[0.5deg]"
        style="box-shadow: 6px 6px 0px 0px #000;"
      >
        <!-- Stamp badge -->
        <div class="absolute -top-3 -right-3 bg-[#E53935] text-white border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest rotate-6">
          CONNECTÉ
        </div>

        <h1 class="text-4xl font-black tracking-tight mb-4">Tableau de bord</h1>
        <p class="text-sm text-gray-500 font-medium mb-6">
          Connecté en tant que <span class="text-black font-bold">{{ userEmail }}</span>
        </p>

        <div class="flex flex-col gap-4">
          <router-link
            to="/profile"
            class="block w-full text-center py-4 text-sm font-black uppercase tracking-widest border-4 border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
            style="box-shadow: 4px 4px 0px 0px #000;"
          >
            MON PROFIL
          </router-link>

          <BaseButton :loading="authStore.loading" @click="handleLogout">
            DÉCONNEXION
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

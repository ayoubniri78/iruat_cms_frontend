<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import AdminLayout from '@/layouts/AdminLayout.vue'

const authStore = useAuthStore()

const displayName = computed(() => {
  const u = authStore.user as any
  const parts = [u?.first_name, u?.last_name].filter(Boolean)
  return parts.length ? parts.join(' ') : u?.email ?? '—'
})
</script>

<template>
  <AdminLayout>
    <!-- Breadcrumb -->
    <nav class="mb-6">
      <span class="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">PROFIL</span>
    </nav>

    <!-- Page header -->
    <div class="mb-8">
      <h1 class="font-display text-2xl sm:text-3xl font-bold text-ink">MON PROFIL</h1>
    </div>

    <!-- Profile card -->
    <div class="max-w-lg">
      <div class="bg-cream border-4 border-ink shadow-brutal p-8 sm:p-12">
        <!-- Avatar -->
        <div class="w-20 h-20 mx-auto bg-parchment border-4 border-ink flex items-center justify-center mb-6 shadow-brutal-sm">
          <span class="material-symbols-outlined text-[40px]">person</span>
        </div>

        <!-- Name -->
        <h2 class="font-display text-xl font-bold text-ink text-center uppercase tracking-wider mb-2">
          {{ displayName }}
        </h2>

        <!-- Email -->
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-ink/50 text-center mb-8">
          {{ authStore.user?.email ?? '—' }}
        </p>

        <!-- Divider -->
        <div class="border-t-4 border-ink pt-6">
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 text-center">
            INFORMATIONS DU COMPTE
          </p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

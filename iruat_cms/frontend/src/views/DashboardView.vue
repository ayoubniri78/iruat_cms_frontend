<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.store'
import AdminLayout from '@/layouts/AdminLayout.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import RecentArticles from '@/components/dashboard/RecentArticles.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchDashboard()
})
</script>

<template>
  <AdminLayout>
    <!-- Loading -->
    <div v-if="dashboardStore.loading" class="flex items-center justify-center py-24">
      <div class="flex items-center gap-3 text-ink/50">
        <span class="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
        <span class="text-xs font-bold uppercase tracking-[0.2em]">CHARGEMENT...</span>
      </div>
    </div>

    <!-- Error -->
    <AlertMessage
      v-else-if="dashboardStore.error"
      type="error"
      :message="dashboardStore.error"
    />

    <!-- Content -->
    <div v-else>
      <!-- Page header -->
      <div class="mb-8">
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-ink">
          TABLEAU DE BORD
        </h1>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-ink/50 mt-2">
          Vue d'ensemble du contenu
        </p>
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="TOTAL ARTICLES"
          :value="dashboardStore.articleCount"
          icon="description"
        />
        <StatCard
          title="TOTAL TYPES"
          :value="dashboardStore.typeCount"
          icon="category"
        />
        <router-link to="/articles/create" class="block">
          <div
            class="bg-accent border-4 border-ink p-6 shadow-brutal relative overflow-hidden group hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all cursor-pointer h-full"
          >
            <div class="absolute top-0 right-0 w-16 h-16 bg-white/10 -rotate-12 translate-x-4 -translate-y-4" />
            <span class="material-symbols-outlined text-white/60 text-[32px] mb-4 block">
              add_circle
            </span>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-1">
              ACTION RAPIDE
            </p>
            <p class="font-display text-lg font-bold text-white">
              CRÉER UN ARTICLE
            </p>
          </div>
        </router-link>
      </div>

      <!-- Recent articles -->
      <RecentArticles :articles="dashboardStore.recentArticles" />
    </div>
  </AdminLayout>
</template>

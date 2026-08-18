<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const authStore = useAuthStore()

const sidebarOpen = ref(false)

const navItems = [
  { to: '/dashboard', label: 'TABLEAU DE BORD', icon: 'grid_view' },
  { to: '/articles', label: 'ARTICLES', icon: 'description' },
  { to: '/types', label: 'TYPES', icon: 'category' },
  { to: '/profile', label: 'PROFIL', icon: 'person' },
]

// Close sidebar on route change (mobile)
watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
  },
)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-parchment">
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/60 z-[45] lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-0 h-screen w-64 bg-ink border-r-4 border-ink flex flex-col z-50 transition-transform duration-300 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Brand -->
      <div class="p-6 border-b-4 border-ink">
        <h1 class="font-display text-xl font-bold text-parchment tracking-tight">IRUAT CMS</h1>
        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-parchment/50 mt-1">Admin Dashboard</p>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-4 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all"
          :class="
            route.path === item.to || route.path.startsWith(item.to + '/')
              ? 'bg-accent text-white border-l-[5px] border-accent shadow-brutal-sm'
              : 'text-parchment/60 hover:text-parchment hover:bg-parchment/10 border-l-[5px] border-transparent'
          "
          @click="sidebarOpen = false"
        >
          <span class="material-symbols-outlined text-[18px]">{{ item.icon }}</span>
          {{ item.label }}
        </router-link>
      </nav>

      <!-- CTA + User -->
      <div class="p-4 border-t-4 border-ink space-y-4">
        <router-link
          to="/articles/create"
          class="flex items-center justify-center gap-2 w-full py-3 bg-accent text-white text-sm font-bold uppercase tracking-widest border-4 border-ink hover:bg-accent-dark transition-colors shadow-brutal-sm"
          @click="sidebarOpen = false"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          NOUVEL ARTICLE
        </router-link>
        <div v-if="authStore.user" class="flex items-center gap-3 px-2">
          <div class="w-10 h-10 bg-parchment/20 border-3 border-parchment/30 flex items-center justify-center">
            <span class="font-display text-sm font-bold text-parchment">
              {{ (authStore.user.email?.[0] ?? 'U').toUpperCase() }}
            </span>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-parchment truncate">{{ authStore.user.email }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="lg:ml-64">
      <!-- Top bar -->
      <header class="sticky top-0 z-40 h-16 bg-cream border-b-4 border-ink flex items-center justify-between px-4 sm:px-8 gap-3">
        <!-- Hamburger (mobile) -->
        <button
          class="lg:hidden w-10 h-10 flex items-center justify-center border-4 border-ink hover:bg-ink hover:text-parchment transition-all shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px] shrink-0"
          @click="toggleSidebar"
        >
          <span class="material-symbols-outlined text-[20px]">{{ sidebarOpen ? 'close' : 'menu' }}</span>
        </button>

        <!-- Search (hidden on very small screens) -->
        <div class="flex-1 max-w-md hidden sm:block">
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Rechercher..."
              class="w-full pl-10 pr-4 py-2 bg-parchment border-4 border-ink text-sm font-bold placeholder:text-ink/30 focus:outline-none focus:shadow-brutal-sm focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all"
            />
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-4 shrink-0">
          <button class="w-10 h-10 flex items-center justify-center border-4 border-ink hover:bg-ink hover:text-parchment transition-all shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px]">
            <span class="material-symbols-outlined text-[18px]">notifications</span>
          </button>
          <button
            @click="authStore.logout()"
            class="hidden sm:flex px-4 py-2 border-4 border-ink text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-ink hover:text-parchment transition-all shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            DÉCONNEXION
          </button>
          <button
            @click="authStore.logout()"
            class="sm:hidden w-10 h-10 flex items-center justify-center border-4 border-ink hover:bg-ink hover:text-parchment transition-all shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px]"
            title="Déconnexion"
          >
            <span class="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

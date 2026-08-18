<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTypesStore } from '@/stores/types.store'
import type { CmsType } from '@/types/type'
import AdminLayout from '@/layouts/AdminLayout.vue'
import TypeCard from '@/components/types/TypeCard.vue'
import TypeForm from '@/components/types/TypeForm.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'

const typesStore = useTypesStore()

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingType = ref<CmsType | null>(null)
const deletingType = ref<CmsType | null>(null)

// Local error for modal operations
const modalError = ref('')

const sortedTypes = computed(() => {
  return [...typesStore.types].sort((a, b) => a.name.localeCompare(b.name))
})

const deleteConfirmMessage = computed(() => {
  const name = deletingType.value?.name ?? ''
  return `Êtes-vous sûr de vouloir supprimer le type « ${name} » ? Cette action est irréversible.`
})

onMounted(() => {
  typesStore.fetchTypes()
})

function openCreateModal() {
  modalError.value = ''
  showCreateModal.value = true
}

function openEditModal(type: CmsType) {
  modalError.value = ''
  editingType.value = type
  showEditModal.value = true
}

function openDeleteModal(type: CmsType) {
  deletingType.value = type
  showDeleteModal.value = true
}

async function handleCreate(name: string) {
  modalError.value = ''
  await typesStore.createType(name)
  if (typesStore.error) {
    modalError.value = typesStore.error
  } else {
    showCreateModal.value = false
  }
}

async function handleEdit(name: string) {
  if (!editingType.value) return
  modalError.value = ''
  await typesStore.updateType(editingType.value.id, name)
  if (typesStore.error) {
    modalError.value = typesStore.error
  } else {
    showEditModal.value = false
    editingType.value = null
  }
}

async function handleDelete() {
  if (!deletingType.value) return
  await typesStore.deleteType(deletingType.value.id)
  showDeleteModal.value = false
  deletingType.value = null
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  editingType.value = null
  deletingType.value = null
  modalError.value = ''
}
</script>

<template>
  <AdminLayout>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-ink uppercase tracking-wider">
          TYPES
        </h1>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-ink/50 mt-1">
          Gérer les catégories d'articles
        </p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] border-4 border-ink bg-accent text-white hover:bg-accent-dark transition-colors shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] self-start sm:self-auto"
        @click="openCreateModal"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        CRÉER UN TYPE
      </button>
    </div>

    <!-- Global error -->
    <AlertMessage v-if="typesStore.error && !showCreateModal && !showEditModal" type="error" :message="typesStore.error" />

    <!-- Loading -->
    <div v-if="typesStore.loading && sortedTypes.length === 0" class="flex items-center justify-center py-20">
      <div class="flex items-center gap-3 text-ink/50">
        <span class="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
        <span class="text-xs font-bold uppercase tracking-[0.2em]">CHARGEMENT...</span>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!typesStore.loading && sortedTypes.length === 0"
      class="bg-cream border-4 border-ink shadow-brutal p-8 sm:p-12 text-center"
    >
      <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-parchment border-4 border-ink flex items-center justify-center mb-6 shadow-brutal-sm">
        <span class="material-symbols-outlined text-[36px] text-ink/30">category</span>
      </div>
      <h2 class="font-display text-lg sm:text-xl font-bold text-ink uppercase tracking-wider mb-2">
        AUCUN TYPE
      </h2>
      <p class="text-sm text-ink/50 font-medium mb-6">
        Créez votre premier type pour organiser vos articles.
      </p>
      <button
        class="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] border-4 border-ink bg-accent text-white hover:bg-accent-dark transition-colors shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px]"
        @click="openCreateModal"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        CRÉER UN TYPE
      </button>
    </div>

    <!-- Types list -->
    <div
      v-else
      class="bg-cream border-4 border-ink shadow-brutal"
    >
      <!-- List header -->
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b-4 border-ink bg-parchment">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
          {{ sortedTypes.length }} TYPE{{ sortedTypes.length > 1 ? 'S' : '' }}
        </p>
      </div>

      <!-- Loading overlay -->
      <div v-if="typesStore.loading" class="relative">
        <div class="absolute inset-0 bg-cream/80 flex items-center justify-center z-10">
          <span class="material-symbols-outlined text-[24px] animate-spin text-accent">progress_activity</span>
        </div>
      </div>

      <!-- Items -->
      <TypeCard
        v-for="type in sortedTypes"
        :key="type.id"
        :type="type"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
    </div>

    <!-- Create modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showCreateModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div class="absolute inset-0 bg-black/60" @click="closeModals" />
          <div class="relative z-10 w-full max-w-md bg-cream border-4 border-ink shadow-brutal-lg p-6 sm:p-8">
            <button
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-2 border-ink hover:bg-ink hover:text-parchment transition-colors"
              @click="closeModals"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>

            <h2 class="font-display text-xl font-bold text-ink uppercase tracking-wider mb-6">
              NOUVEAU TYPE
            </h2>

            <TypeForm
              :loading="typesStore.loading"
              :error="modalError"
              @submit="handleCreate"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showEditModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div class="absolute inset-0 bg-black/60" @click="closeModals" />
          <div class="relative z-10 w-full max-w-md bg-cream border-4 border-ink shadow-brutal-lg p-6 sm:p-8">
            <button
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-2 border-ink hover:bg-ink hover:text-parchment transition-colors"
              @click="closeModals"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>

            <h2 class="font-display text-xl font-bold text-ink uppercase tracking-wider mb-6">
              MODIFIER LE TYPE
            </h2>

            <TypeForm
              :loading="typesStore.loading"
              :error="modalError"
              :initial-name="editingType?.name"
              @submit="handleEdit"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete confirmation modal -->
    <ConfirmModal
      :show="showDeleteModal"
      title="SUPPRIMER LE TYPE"
      :message="deleteConfirmMessage"
      confirm-label="SUPPRIMER"
      @confirm="handleDelete"
      @cancel="closeModals"
    />
  </AdminLayout>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

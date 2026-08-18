<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
  confirmLabel?: string
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/60"
          @click="$emit('cancel')"
        />

        <!-- Modal -->
        <div class="relative z-10 w-full max-w-md bg-cream border-4 border-ink shadow-brutal-lg p-6 sm:p-8">
          <!-- Close button -->
          <button
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-2 border-ink hover:bg-ink hover:text-parchment transition-colors"
            @click="$emit('cancel')"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>

          <!-- Warning icon -->
          <div class="flex justify-center mb-6">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-accent border-4 border-ink flex items-center justify-center shadow-brutal">
              <span class="material-symbols-outlined text-white text-[28px] sm:text-[32px]">warning</span>
            </div>
          </div>

          <!-- Content -->
          <h2 class="font-display text-lg sm:text-xl font-bold text-ink text-center uppercase tracking-wider mb-3">
            {{ title }}
          </h2>
          <p class="text-sm text-ink/70 text-center font-medium mb-8">
            {{ message }}
          </p>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              class="flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] border-4 border-ink bg-white text-ink hover:bg-ink hover:text-parchment transition-colors shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px]"
              @click="$emit('cancel')"
            >
              ANNULER
            </button>
            <button
              class="flex-1 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] border-4 border-ink bg-accent text-white hover:bg-accent-dark transition-colors shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px]"
              @click="$emit('confirm')"
            >
              {{ confirmLabel ?? 'SUPPRIMER' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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

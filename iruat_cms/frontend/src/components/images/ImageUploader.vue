<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  articleId: string
  loading?: boolean
  hasImage?: boolean
}>(), {
  hasImage: false,
})

const emit = defineEmits<{
  uploaded: []
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const progress = ref(0)
const isDragOver = ref(false)
const error = ref('')

function triggerFileInput() {
  if (!isUploading.value) {
    fileInput.value?.click()
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
}

function handleDragLeave() {
  isDragOver.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    uploadFile(files[0])
  }
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    uploadFile(files[0])
  }
  // Reset input so same file can be selected again
  target.value = ''
}

function uploadFile(file: File) {
  if (!file.type.startsWith('image/')) {
    error.value = 'Veuillez sélectionner un fichier image.'
    return
  }

  error.value = ''
  isUploading.value = true
  progress.value = 0

  const formData = new FormData()
  formData.append('image', file)
  formData.append('articleId', props.articleId)
  formData.append('is_main', props.hasImage ? 'false' : 'true')

  const xhr = new XMLHttpRequest()

  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      progress.value = Math.round((e.loaded / e.total) * 100)
    }
  })

  xhr.addEventListener('load', () => {
    isUploading.value = false
    progress.value = 0
    if (xhr.status >= 200 && xhr.status < 300) {
      emit('uploaded')
    } else {
      error.value = "Erreur lors de l'upload. Veuillez réessayer."
    }
  })

  xhr.addEventListener('error', () => {
    isUploading.value = false
    progress.value = 0
    error.value = "Erreur réseau. Veuillez vérifier votre connexion."
  })

  // Use axios instance's baseURL for consistency
  const baseURL = import.meta.env.VITE_API_URL || '/api'
  xhr.open('POST', `${baseURL}/article-images`)

  // Add auth token from supabase session
  import('@/lib/supabase').then(({ supabase }) => {
    supabase.auth.getSession().then(({ data }) => {
      const token = data.session?.access_token
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
      xhr.send(formData)
    })
  })
}
</script>

<template>
  <div>
    <!-- Drop zone -->
    <button
      type="button"
      :disabled="isUploading || loading"
      class="w-full border-4 border-dashed border-ink/30 bg-cream p-8 text-center transition-all duration-200 hover:border-accent hover:bg-parchment focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
      :class="{
        'border-accent bg-parchment': isDragOver,
      }"
      @click="triggerFileInput"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <!-- Upload progress -->
      <template v-if="isUploading">
        <div class="flex flex-col items-center gap-4">
          <span class="material-symbols-outlined text-accent text-[40px] animate-pulse">cloud_upload</span>
          <p class="font-display text-sm font-bold text-ink uppercase tracking-wider">
            UPLOAD EN COURS...
          </p>
          <div class="w-full max-w-xs h-3 bg-ink/10 border-2 border-ink overflow-hidden">
            <div
              class="h-full bg-accent transition-all duration-300"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <p class="font-mono text-xs font-bold text-ink/50">{{ progress }}%</p>
        </div>
      </template>

      <!-- Idle state -->
      <template v-else>
        <span class="material-symbols-outlined text-ink/20 text-[48px] block mb-3">add_photo_alternate</span>
        <p class="font-display text-sm font-bold text-ink uppercase tracking-wider mb-1">
          CLIQUEZ POUR UPLOADER
        </p>
        <p class="text-xs text-ink/40 font-medium">
          ou glissez une image ici
        </p>
      </template>
    </button>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Error message -->
    <p
      v-if="error"
      class="mt-2 text-xs font-bold text-accent uppercase tracking-wider"
    >
      {{ error }}
    </p>
  </div>
</template>

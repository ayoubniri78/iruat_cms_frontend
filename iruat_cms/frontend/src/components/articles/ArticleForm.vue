<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTypesStore } from '@/stores/types.store'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'

const props = withDefaults(
  defineProps<{
    mode: 'create' | 'edit'
    initialTitle?: string
    initialSlug?: string
    initialContent?: string
    initialTypeId?: string
    loading?: boolean
    error?: string
  }>(),
  {
    initialTitle: '',
    initialSlug: '',
    initialContent: '',
    initialTypeId: '',
    loading: false,
    error: '',
  }
)

const emit = defineEmits<{
  submit: [payload: { title: string; slug: string; content: string; type_id: string }]
}>()

const typesStore = useTypesStore()

const title = ref(props.initialTitle)
const slug = ref(props.initialSlug)
const content = ref(props.initialContent)
const typeId = ref(props.initialTypeId)

// Sync when props change (for edit mode pre-fill)
watch(
  () => props.initialTitle,
  (val) => { title.value = val }
)
watch(
  () => props.initialSlug,
  (val) => { slug.value = val }
)
watch(
  () => props.initialContent,
  (val) => { content.value = val }
)
watch(
  () => props.initialTypeId,
  (val) => { typeId.value = val }
)

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

let slugManuallyEdited = false

watch(title, (val) => {
  if (!slugManuallyEdited && props.mode === 'create') {
    slug.value = generateSlug(val)
  }
})

function onSlugInput(val: string) {
  slugManuallyEdited = val.length > 0
  slug.value = val
}

function handleSubmit() {
  emit('submit', {
    title: title.value.trim(),
    slug: slug.value || generateSlug(title.value),
    content: content.value.trim(),
    type_id: typeId.value,
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <AlertMessage v-if="error" type="error" :message="error" />

    <!-- Title -->
    <BaseInput
      v-model="title"
      label="TITRE"
      placeholder="Titre de l'article"
      :required="true"
    />

    <!-- Slug -->
    <BaseInput
      :model-value="slug"
      label="SLUG"
      placeholder="slug-de-l-article"
      :required="true"
      @update:model-value="onSlugInput"
    />

    <!-- Content -->
    <div>
      <label class="text-xs font-black uppercase tracking-wider text-gray-600 mb-1 block">
        CONTENU
      </label>
      <textarea
        v-model="content"
        rows="12"
        placeholder="Rédigez le contenu de votre article..."
        required
        class="w-full border-4 border-black px-4 py-3 text-sm bg-[#FAFAF5] focus:outline-none focus:bg-white placeholder:text-gray-400 font-medium resize-y min-h-[200px]"
        style="box-shadow: 3px 3px 0px 0px #000;"
      />
    </div>

    <!-- Type select -->
    <div>
      <label class="text-xs font-black uppercase tracking-wider text-gray-600 mb-1 block">
        TYPE
      </label>
      <select
        v-model="typeId"
        required
        class="w-full border-4 border-black px-4 py-3 text-sm bg-[#FAFAF5] focus:outline-none focus:bg-white font-medium appearance-none"
        style="box-shadow: 3px 3px 0px 0px #000;"
      >
        <option value="" disabled>Sélectionner un type</option>
        <option
          v-for="type in typesStore.types"
          :key="type.id"
          :value="type.id"
        >
          {{ type.name }}
        </option>
      </select>
      <p v-if="typesStore.loading" class="mt-1 text-xs font-bold text-ink/40">
        Chargement des types...
      </p>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-4 pt-4">
      <router-link
        to="/articles"
        class="px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] border-4 border-ink bg-white text-ink hover:bg-ink hover:text-parchment transition-colors shadow-brutal-sm hover:translate-x-[-2px] hover:translate-y-[-2px]"
      >
        ANNULER
      </router-link>
      <div class="flex-1">
        <BaseButton :loading="loading" type="submit">
          {{ mode === 'create' ? "CRÉER L'ARTICLE" : 'ENREGISTRER' }}
        </BaseButton>
      </div>
    </div>
  </form>
</template>

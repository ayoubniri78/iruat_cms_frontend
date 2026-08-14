<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AlertMessage from '@/components/ui/AlertMessage.vue'

type ProfileData = {
  first_name: string
  last_name: string
  first_name_ar: string
  last_name_ar: string
}

const props = withDefaults(
  defineProps<{
    loading?: boolean
    error?: string
    success?: string
    initialData?: Partial<ProfileData> | null
  }>(),
  {
    loading: false,
    error: '',
    success: '',
    initialData: null,
  }
)

const emit = defineEmits<{
  submit: [payload: ProfileData]
}>()

const form = reactive<ProfileData>({
  first_name: props.initialData?.first_name ?? '',
  last_name: props.initialData?.last_name ?? '',
  first_name_ar: props.initialData?.first_name_ar ?? '',
  last_name_ar: props.initialData?.last_name_ar ?? '',
})

const clientError = ref('')

function syncForm(data: Partial<ProfileData> | null | undefined) {
  form.first_name = data?.first_name ?? ''
  form.last_name = data?.last_name ?? ''
  form.first_name_ar = data?.first_name_ar ?? ''
  form.last_name_ar = data?.last_name_ar ?? ''
}

watch(
  () => props.initialData,
  (data) => syncForm(data),
  { deep: true }
)

function handleSubmit() {
  if (
    !form.first_name.trim() ||
    !form.last_name.trim() ||
    !form.first_name_ar.trim() ||
    !form.last_name_ar.trim()
  ) {
    clientError.value = 'Tous les champs sont obligatoires.'
    return
  }

  clientError.value = ''
  emit('submit', {
    first_name: form.first_name,
    last_name: form.last_name,
    first_name_ar: form.first_name_ar,
    last_name_ar: form.last_name_ar,
  })
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit" class="space-y-4">
    <AlertMessage v-if="error" type="error" :message="error" />
    <AlertMessage v-if="success" type="success" :message="success" />

    <template v-if="!success">
      <!-- NOM EN FRANÇAIS -->
      <div class="border-t-4 border-black pt-4 mt-4">
        <h2 class="text-xs font-black uppercase tracking-widest text-black mb-4">Nom en français</h2>
        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model="form.first_name"
            label="Prénom"
            placeholder="Jean"
            :required="true"
          />
          <BaseInput
            v-model="form.last_name"
            label="Nom"
            placeholder="Dupont"
            :required="true"
          />
        </div>
      </div>

      <!-- NOM EN ARABE -->
      <div class="border-t-4 border-black pt-4 mt-4">
        <h2 class="text-xs font-black uppercase tracking-widest text-black mb-4">Nom en arabe</h2>
        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model="form.first_name_ar"
            label="Prénom"
            placeholder="الاسم"
            dir="rtl"
            :required="true"
          />
          <BaseInput
            v-model="form.last_name_ar"
            label="Nom"
            placeholder="اللقب"
            dir="rtl"
            :required="true"
          />
        </div>
      </div>

      <p v-if="clientError" class="text-xs font-bold text-[#E53935]">{{ clientError }}</p>

      <BaseButton type="submit" :loading="loading">
        ENREGISTRER LES MODIFICATIONS
      </BaseButton>
    </template>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  employee?: Record<string, any> | null
}>()

const employee = computed(() => props.employee ?? null)

const fallback = {
  email: 'jean.dupont@example.com',
  grade: 'AGENT',
  position: 'Agent administratif',
  recruitment_date: '15/01/2024',
  status: 'ACTIF',
  role: 'AGENT',
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '---'
  return String(value)
}

function formatDate(value: unknown): string {
  if (value === null || value === undefined || value === '') return '---'

  const raw = String(value)
  const parts = raw.split('-')
  if (parts.length !== 3) return raw

  const [year, month, day] = parts.map((p) => p.padStart(2, '0'))
  if (!year || !month || !day) return raw
  return `${day}/${month}/${year}`
}

function statusLabel(status: unknown): string {
  if (status === null || status === undefined || status === '') return '---'
  const normalized = String(status).toUpperCase()
  if (normalized === 'ACTIF' || normalized === 'ACTIVE') return 'ACTIF'
  if (normalized === 'INACTIF' || normalized === 'INACTIVE') return 'INACTIF'
  return normalized
}

const rows = computed(() => {
  const data = (employee.value ?? fallback) as Record<string, any>

  return [
    { label: 'E-mail', value: displayValue(data.email) },
    { label: 'Grade', value: displayValue(data.grade) },
    { label: 'Poste', value: displayValue(data.position) },
    { label: 'Département', value: displayValue(data.department_id) },
    { label: "Date d'embauche", value: formatDate(data.recruitment_date) },
    { label: 'Statut', value: statusLabel(data.status) },
    { label: 'Rôle', value: displayValue(data.role) },
  ]
})
</script>

<template>
  <div>
    <h2 class="text-xs font-black uppercase tracking-widest text-black mb-2 border-t-4 border-black pt-4 mt-6">
      Informations du compte
    </h2>
    <div
      v-for="row in rows"
      :key="row.label"
      class="flex justify-between py-2 border-b border-black/10"
    >
      <span class="text-xs font-black uppercase tracking-wider text-gray-600">{{ row.label }}</span>
      <span class="text-sm font-bold text-right">{{ row.value }}</span>
    </div>
  </div>
</template>

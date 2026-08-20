import { supabase } from '@/lib/supabase'

const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Identifiants incorrects. Veuillez réessayer.',
}

function mapError(message: string): string {
  return ERROR_MAP[message] ?? message
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error: error ? { message: mapError(error.message) } : null }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  return { error: error ? { message: mapError(error.message) } : null }
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()

  return { data, error: error ? { message: mapError(error.message) } : null }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()

  return { data, error: error ? { message: mapError(error.message) } : null }
}

export function onAuthStateChange(callback: (event: string, session: Record<string, unknown> | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session as Record<string, unknown> | null)
  })
}

import { supabase } from '@/lib/supabase'

const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Identifiants incorrects. Veuillez réessayer.',
  'User already registered': 'Un compte existe déjà avec cette adresse e-mail.',
}

function mapError(message: string): string {
  return ERROR_MAP[message] ?? message
}

export async function register(email: string, password: string, firstName: string , lastName: string ) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  return { data, error: error ? { message: mapError(error.message) } : null }
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error: error ? { message: mapError(error.message) } : null }
}

export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
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

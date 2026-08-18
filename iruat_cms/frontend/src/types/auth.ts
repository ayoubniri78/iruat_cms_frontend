export interface AuthUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
}

export interface AuthError {
  message: string
}

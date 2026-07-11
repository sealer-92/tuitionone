import { auth } from './auth'

/** Returns the admin session, or null if the caller is not an authenticated admin. */
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') return null
  return session
}

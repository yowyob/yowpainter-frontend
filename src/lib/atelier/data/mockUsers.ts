export type UserRole = 'peintre' | 'admin'
export type AccountStatus = 'active' | 'suspended'

export type ProfileData = {
  name: string
  handle: string
  email: string
  bio: string
  city: string
  expertise: string
  specialties: string[]
}

export type DemoUser = {
  id: string
  email: string
  password: string
  name: string
  handle: string
  role: UserRole
  bio: string
  city: string
  expertise: string
  specialties: string[]
  status?: AccountStatus
}

export type DemoSession = {
  userId: string
  email: string
  name: string
  handle: string
  role: UserRole
  bio: string
  city: string
  expertise: string
  specialties: string[]
  status: AccountStatus
}

export const DEMO_PASSWORD = 'demo'

const ADMIN_EMAIL = 'admin@artplastique.demo'

export const demoUsers: DemoUser[] = [
  {
    id: 'admin',
    email: ADMIN_EMAIL,
    password: DEMO_PASSWORD,
    name: 'Super Admin',
    handle: 'admin',
    role: 'admin',
    bio: 'Administrateur de la plateforme ArtPlastique.',
    city: 'Paris',
    expertise: 'Gestion de contenu',
    specialties: ['📋 Modération', '📊 Analytiques', '👥 Communauté'],
  },
]

export function isAdminEmail(email: string) {
  return email.trim().toLowerCase() === ADMIN_EMAIL
}

export function findDemoUser(email: string) {
  const normalized = email.trim().toLowerCase()
  return demoUsers.find((user) => user.email.toLowerCase() === normalized) ?? null
}

export function toSession(user: DemoUser): DemoSession {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    handle: user.handle,
    role: user.role,
    bio: user.bio,
    city: user.city,
    expertise: user.expertise,
    specialties: [...user.specialties],
    status: user.status ?? 'active',
  }
}

export function createDefaultSession(name: string, email: string, id: string): DemoSession {
  const handle = name.toLowerCase().replace(/\s+/g, '.')
  return {
    userId: id,
    email: email.trim().toLowerCase(),
    name: name.trim(),
    handle,
    role: 'peintre',
    bio: '',
    city: '',
    expertise: '',
    specialties: ['🎨 Peinture'],
    status: 'active',
  }
}

export function homePathForRole(role: UserRole) {
  return role === 'admin' ? '/admin' : '/dashboard/peintre'
}

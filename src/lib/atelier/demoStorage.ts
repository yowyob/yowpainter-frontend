import type { DemoSession, DemoUser } from './data/mockUsers'
import type { DemoData } from './types'

const SESSION_KEY = 'artplastique-demo-session'
const DATA_KEY = 'artplastique-demo-data'
const USERS_KEY = 'artplastique-registered-users'

export function loadSession(): DemoSession | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as DemoSession
  } catch {
    return null
  }
}

export function saveSession(session: DemoSession) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_KEY)
}

export function loadDemoData(): DemoData | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(DATA_KEY)
    if (!raw) return null
    return JSON.parse(raw) as DemoData
  } catch {
    return null
  }
}

export function saveDemoData(data: DemoData) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(DATA_KEY, JSON.stringify(data))
}

export function clearDemoData() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(DATA_KEY)
}

export function clearAllDemoStorage() {
  clearSession()
  clearDemoData()
}

// Registered users (peintres inscrits via formulaire + seed fictifs)
export function loadRegisteredUsers(): DemoUser[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DemoUser[]
  } catch {
    return []
  }
}

export function saveRegisteredUsers(users: DemoUser[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findRegisteredUser(email: string): DemoUser | null {
  const normalized = email.trim().toLowerCase()
  return loadRegisteredUsers().find((u) => u.email.toLowerCase() === normalized) ?? null
}

export function upsertRegisteredUser(user: DemoUser) {
  const users = loadRegisteredUsers()
  const idx = users.findIndex((u) => u.id === user.id)
  if (idx >= 0) {
    users[idx] = user
  } else {
    users.push(user)
  }
  saveRegisteredUsers(users)
}

export function deleteRegisteredUser(userId: string): boolean {
  const users = loadRegisteredUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx < 0) return false
  users.splice(idx, 1)
  saveRegisteredUsers(users)
  return true
}

export function suspendRegisteredUser(userId: string): boolean {
  const users = loadRegisteredUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx < 0) return false
  users[idx] = { ...users[idx], status: 'suspended' }
  saveRegisteredUsers(users)
  return true
}

export function unsuspendRegisteredUser(userId: string): boolean {
  const users = loadRegisteredUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx < 0) return false
  users[idx] = { ...users[idx], status: 'active' }
  saveRegisteredUsers(users)
  return true
}

export function clearRegisteredUsers() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(USERS_KEY)
}

export function seedFictionalPainters() {
  const existing = loadRegisteredUsers()
  if (existing.length > 0) return // already seeded

  const painters: DemoUser[] = [
    { id: 'peintre-cl', email: 'claire@email.fr', password: 'demo', name: 'Claire Lescure', handle: 'claire.lescure', role: 'peintre', bio: '', city: 'Lyon', expertise: 'Huile', specialties: ['Huile', 'Portrait'] },
    { id: 'peintre-mr', email: 'm.renaud@gmail.com', password: 'demo', name: 'Marc Renaud', handle: 'marc.renaud', role: 'peintre', bio: '', city: 'Paris', expertise: 'Aquarelle', specialties: ['Aquarelle', 'Paysage'] },
    { id: 'peintre-sd', email: 'sophie.d@art.fr', password: 'demo', name: 'Sophie Dumas', handle: 'sophie.dumas', role: 'peintre', bio: '', city: 'Bordeaux', expertise: 'Acrylique', specialties: ['Acrylique', 'Abstrait'] },
    { id: 'peintre-jm', email: 'jmo@artelier.net', password: 'demo', name: 'Jean-Marc Olivier', handle: 'jean-marc.olivier', role: 'peintre', bio: '', city: 'Marseille', expertise: 'Fresque', specialties: ['Fresque', 'Encaustique'] },
    { id: 'peintre-ab', email: 'aurelie.bonnet@free.fr', password: 'demo', name: 'Aurélie Bonnet', handle: 'aurelie.bonnet', role: 'peintre', bio: '', city: 'Nantes', expertise: 'Dessin', specialties: ['Dessin', 'Graphite'] },
    { id: 'peintre-pl', email: 'p.lavigne@atelierpl.fr', password: 'demo', name: 'Pierre Lavigne', handle: 'pierre.lavigne', role: 'peintre', bio: '', city: 'Strasbourg', expertise: 'Huile', specialties: ['Huile', 'Nature morte'] },
    { id: 'peintre-mh', email: 'mhvu@studio-couleur.fr', password: 'demo', name: 'Marie-Hélène Vu', handle: 'marie-helene.vu', role: 'peintre', bio: '', city: 'Paris', expertise: 'Aquarelle', specialties: ['Aquarelle', 'Botaniques'] },
    { id: 'peintre-gf', email: 'g.ferrand@atelier.com', password: 'demo', name: 'Guillaume Ferrand', handle: 'guillaume.ferrand', role: 'peintre', bio: '', city: 'Toulouse', expertise: 'Sculpture', specialties: ['Sculpture', 'Modelage'] },
    { id: 'peintre-np', email: 'nperrin@colorlabs.fr', password: 'demo', name: 'Nathalie Perrin', handle: 'nathalie.perrin', role: 'peintre', bio: '', city: 'Grenoble', expertise: 'Couleur', specialties: ['Couleur', 'Pigments'] },
    { id: 'peintre-tc', email: 't.collet@gmail.com', password: 'demo', name: 'Thomas Collet', handle: 'thomas.collet', role: 'peintre', bio: '', city: 'Lille', expertise: 'Gravure', specialties: ['Gravure', 'Linogravure'] },
    { id: 'peintre-ep', email: 'elise@pontierart.com', password: 'demo', name: 'Élise Pontier', handle: 'elise.pontier', role: 'peintre', bio: '', city: 'Nice', expertise: 'Pastel', specialties: ['Pastel', 'Paysage'] },
    { id: 'peintre-rb', email: 'raphael.b@studio.fr', password: 'demo', name: 'Raphaël Bouvier', handle: 'raphael.bouvier', role: 'peintre', bio: '', city: 'Montpellier', expertise: 'Tempera', specialties: ['Tempera', 'Icônes'] },
    { id: 'peintre-ls', email: 'lucie.s@ateliercouleurs.fr', password: 'demo', name: 'Lucie Saunier', handle: 'lucie.saunier', role: 'peintre', bio: '', city: 'Rennes', expertise: 'Gouache', specialties: ['Gouache', 'Illustration'] },
    { id: 'peintre-hd', email: 'h.desjardins@art.ca', password: 'demo', name: 'Hugo Desjardins', handle: 'hugo.desjardins', role: 'peintre', bio: '', city: 'Québec', expertise: 'Huile', specialties: ['Huile', 'Marine'] },
  ]

  saveRegisteredUsers(painters)
}

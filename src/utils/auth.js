const AUTH_KEY = 'admin-auth'
const USER_KEY = 'admin-user'

export function login(username, password) {
  if (username !== 'admin' || password !== 'admin123') return false
  sessionStorage.setItem(AUTH_KEY, 'authenticated')
  sessionStorage.setItem(USER_KEY, JSON.stringify({ name: '郑管理员', role: '超级管理员' }))
  return true
}

export function updateCurrentUser(profile) {
  const user = { ...getCurrentUser(), name: profile.name.trim(), email: profile.email.trim(), bio: profile.bio.trim(), avatarColor: profile.avatarColor }
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'authenticated'
}

export function getCurrentUser() {
  try {
    const user = JSON.parse(sessionStorage.getItem(USER_KEY))
    if (user?.name === '林管理员') user.name = '郑管理员'
    return user || { name: '郑管理员', role: '超级管理员' }
  } catch {
    return { name: '郑管理员', role: '超级管理员' }
  }
}

'use client'

export const getCurrentTheme = () => {
  if (typeof window !== "undefined") {
    const theme = localStorage.getItem('family-grocery-darkmode')
    return theme === "true" // salvi come stringa
  }
  return false
}

export const toggleTheme = () => {
  if (typeof window !== "undefined") {
    const newTheme = !getCurrentTheme()
    localStorage.setItem('family-grocery-darkmode', newTheme.toString())

    if (newTheme) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }

    return newTheme
  }
  return false
}

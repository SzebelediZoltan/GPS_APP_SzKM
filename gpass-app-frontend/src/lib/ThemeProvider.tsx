import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "gpass-theme"

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === "light" || saved === "dark") return saved

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
  return prefersDark ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === "dark") root.classList.add("dark")
  else root.classList.remove("dark")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")

  useEffect(() => {
    const initial = getInitialTheme()
    setThemeState(initial)
    applyTheme(initial)
  }, [])

  function setTheme(t: Theme) {
    localStorage.setItem(STORAGE_KEY, t)
    applyTheme(t)
    setThemeState(t)
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider")
  return ctx
}

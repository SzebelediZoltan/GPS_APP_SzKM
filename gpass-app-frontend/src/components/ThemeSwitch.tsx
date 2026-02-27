import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/ThemeProvider"

type ThemeSwitchProps = {
  className?: string
  variant?: "outline" | "ghost"
  size?: "icon" | "sm" | "default"
}

export default function ThemeSwitch({
  className,
  variant = "outline",
  size = "icon",
}: ThemeSwitchProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={toggleTheme}
      aria-label="Téma váltása"
      className={cn(
        "rounded-xl border-border/70 bg-card/50 text-muted-foreground shadow-sm hover:bg-card/70 hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
        className
      )}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}

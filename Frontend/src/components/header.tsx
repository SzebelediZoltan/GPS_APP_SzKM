import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Menu } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

export default function Header() {
  const [open, setOpen] = useState(false)

  const nav = useNavigate()
  return (
    <header className="border-b bg-background sticky w-full top-0 z-1000">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide">
          GP ASS<span className="text-primary"> App</span>
        </h1>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 hover:text-primary cursor-pointer" onClick={()=>{nav({to:"/"})}}>
                Főoldal
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 hover:text-primary cursor-pointer" onClick={()=>{nav({to:"/map"})}}>
                Térkép
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 hover:text-primary cursor-pointer">
                Rólunk
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 hover:text-primary cursor-pointer">
                Kapcsolat
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col space-y-4 mt-8 text-lg">
                <button onClick={() => setOpen(false)} className="text-left hover:text-primary">
                  Főoldal
                </button>
                <button onClick={() => setOpen(false)} className="text-left hover:text-primary">
                  Térkép
                </button>
                <button onClick={() => setOpen(false)} className="text-left hover:text-primary">
                  Rólunk
                </button>
                <button onClick={() => setOpen(false)} className="text-left hover:text-primary">
                  Kapcsolat
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

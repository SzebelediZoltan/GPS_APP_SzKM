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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"

type User = {
  username: string,
  email: string,
}


const getUser = () => {
  return axios.get<User>("http://localhost:4000/api/auth/status", { withCredentials: true })
}

const logOut = () => {
  return axios.delete("http://localhost:4000/api/auth/logout", { withCredentials: true })
}

export default function Header() {
  const [open, setOpen] = useState(false)

  const { mutate: logout } = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      nav({
        to: "/auth/login"
      })
    }
  })

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser
  })

  const nav = useNavigate()
  return (
    <header className="border-b bg-background sticky w-full top-0 z-1000">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide">
          GP ASS<span className="text-primary"> App</span>
        </h1>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex select-none">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 hover:text-primary cursor-pointer" onClick={() => { nav({ to: "/" }) }}>
                Mainpage_
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 hover:text-primary cursor-pointer" onClick={() => { nav({ to: "/map" }) }}>
                Map_
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 hover:text-primary cursor-pointer">
                About Us_
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 hover:text-primary cursor-pointer">
                Contact_
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer" asChild>
                  <Button variant="outline">{user?.data.username}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-max z-1001" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Friends
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                    <Button className="m-2 cursor-pointer" onClick={() => logout()} >Log Out</Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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
            <SheetContent side="right" className="w-64 z-1001">
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

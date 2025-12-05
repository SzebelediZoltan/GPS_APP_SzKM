import Header from '@/components/header'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { Riple } from "react-loading-indicators"
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"
import Footer from '@/components/footer'


export const Route = createFileRoute('/')({
  component: RouteComponent,
})

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

function RouteComponent() {

  const nav = useNavigate()

  const { mutate: logout } = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      nav({
        to: "/auth/login"
      })
    }
  })

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser
  })

  if (isLoading) return (
  <div className='h-dvh'>
    <div className='h-dvh w-dvw flex justify-center items-center'>
      <Riple color="#000000" size="large" />
    </div>
  </div>
  )

  if (!user) return nav({
    to: "/auth/login"
  })

  
  return <>
    <Header />
    <div className='min-h-full'>
      <div className='p-30 bg-linear-to-br from-blue-50 to-slate-100 flex flex-col items-center'>
        <h1 className="scroll-m-20 text-center text-6xl font-semibold tracking-tight text-balance">Hi</h1>
        <p className="scroll-m-20 text-center text-2xl tracking-tight mt-1">{user.data.username}</p>
        <div className='mt-6 flex gap-2'>
          <Button onClick={ () =>{nav({ to:"/map"})}}>Map_</Button>
          <Button onClick={ () =>{logout()}}>Log Out_</Button>
        </div>
      </div>
      <div className='w-full h-flex p-20 justify-center'>
        <Carousel
          opts={{
            align: "center",
            loop: true,
            dragFree: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
            })
          ]}
          className="w-full max-w-ms"
        >
          <CarouselContent>
            {Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-3xl font-semibold">{index + 1}_</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
    <Footer></Footer>
  </>
}

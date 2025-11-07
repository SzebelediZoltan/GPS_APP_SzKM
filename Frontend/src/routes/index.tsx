import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import axios from 'axios'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

type User = {
  username: string,
  email: string,
}

const getUser = ()=> {
  return axios.get<User>("http://localhost:4000/api/auth/status",{withCredentials:true})
}

const logOut = () => {
  return axios.delete("http://localhost:4000/api/auth/logout", {withCredentials:true})
}

function RouteComponent() {

  const nav = useNavigate()

  const {mutate: logout} = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      nav({
        to: "/auth/login"
      })
    }
  })

  const {data: user,isLoading} = useQuery({
    queryKey: ["user"],
    queryFn: getUser
  })

  if(isLoading) return <p>Töltés</p>
  if(!user) return <p>Nincs felhasználó</p>
  
  

  return <div><Header></Header>
    Hello {user.data.username} <Button onClick={()=>{logout()}}>Log Out</Button>
    </div>
}

import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import axios from 'axios'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

type User = {
  name: string,
  email: string,
}

const getUser = ()=> {
  return axios.get<User>("http://localhost:4000/api/auth/status")
}

function RouteComponent() {

  const nav = useNavigate()

  const {data: user,isLoading} = useQuery({
    queryKey: ["user"],
    queryFn: getUser
  })

  if(isLoading) return <p>Töltés</p>
  if(!user) return nav({to: "/auth/register"})
  console.log(user)

  return <div>Hello user</div>
}

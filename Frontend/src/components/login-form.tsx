import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { email, z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import { User } from "lucide-react"
import { Navigate, useNavigate } from "@tanstack/react-router"

type User = z.infer<typeof UserSchema>

const UserSchema = z.object({
  userID: z.string().min(8).nonempty(),
  password: z.string().min(8).nonempty(),
})

const loginUser = (userData: User) => {
  return axios.post("http://localhost:4000/api/auth/login", userData, {withCredentials:true})
}


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const nav = useNavigate()

  const form = useForm<User>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      userID: "",
      password: "",
    },
  })

  function onSubmit(values: User) {
    console.log(values)
    login(values)
  }

  const {mutate: login}= useMutation({
    mutationFn: (userData: User) => loginUser(userData),
    mutationKey: ["user"],
    onSuccess: () => nav({to: "/"})
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Log in to your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="userID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <Button type="submit">Log in</Button>
              <p>Need a new account? <Button className="px-0" variant={"link"} onClick={() => {
                nav({
                  to: "/auth/register"
                })
              }}>Register One</Button></p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

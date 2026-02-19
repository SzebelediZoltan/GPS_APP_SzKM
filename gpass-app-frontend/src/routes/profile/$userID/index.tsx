import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$userID/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profile/$userID"!</div>
}

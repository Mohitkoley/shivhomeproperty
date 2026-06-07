import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
})

export const config = {
  // Protect all routes under /admin except /admin/login
  matcher: ["/admin/((?!login).*)"],
}

import { UserRole } from '@prisma/client'
import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      role?: UserRole | string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string | null
    name: string | null
    role: UserRole | string
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    role?: UserRole | string
  }
}
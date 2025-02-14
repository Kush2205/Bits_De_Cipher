import { url } from "inspector";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log("Authorizing credentials:", credentials);
        if (!credentials) return { id: "0", name: "Guest" };
        const { username, password } = credentials;
        console.log("Credentials received:", username, password);
        // Replace with your authentication logic
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };
        return user;
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  pages: {
    signIn: "/signin",
  },

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
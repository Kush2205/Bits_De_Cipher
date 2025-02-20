import { authOptions } from "../../../../utils/authOptions";
import NextAuth from "next-auth";
const handler = NextAuth(authOptions);

// ✅ Use named exports for Next.js App Router (Next 13+)
export { handler as GET, handler as POST };

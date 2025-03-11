import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ['/'],
    debug:true
});

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // Ensures middleware runs on relevant routes
};


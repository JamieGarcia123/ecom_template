import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("services", "routes/services.tsx"),
  route("login", "routes/login.tsx"),
  route("provider-dashboard", "routes/provider-dashboard.tsx"),
] satisfies RouteConfig;

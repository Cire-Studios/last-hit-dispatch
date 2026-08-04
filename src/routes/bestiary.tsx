import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/bestiary")({
  component: Outlet,
});

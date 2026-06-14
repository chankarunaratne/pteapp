import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function Home() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect("/practice");
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold text-slate-800">
        Home page will live here
      </h1>
    </div>
  );
}

import { redirect } from "next/navigation";
import ProfileSettings from "@/components/profile-settings";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-background px-4 py-6 text-on-background sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <ProfileSettings initialUser={user} />
      </div>
    </main>
  );
}

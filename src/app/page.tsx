import { getArenaData } from "@/lib/arena";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialData = await getArenaData(false);

  return <HomeClient initialData={initialData} />;
}

import { revalidatePath } from "next/cache";
import { notifyIndexNow } from "@/lib/indexnow";
import { getSiteUrl } from "@/lib/site";

export async function revalidateMarketplace(username?: string) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (username) {
    revalidatePath(`/${username}`);
    revalidatePath("/x-banner-ad-pricing-index");
  }
  const urls = [getSiteUrl(), username ? `${getSiteUrl()}/${username}` : null].filter(Boolean) as string[];
  await notifyIndexNow(urls).catch(() => {});
}

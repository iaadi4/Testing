import { getSiteUrl } from "@/lib/site";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "twitterbanner-indexnow-key";

export function getIndexNowKey() {
  return INDEXNOW_KEY;
}

export async function notifyIndexNow(urls: string[]) {
  if (process.env.NODE_ENV !== "production" || urls.length === 0) return;
  const host = new URL(getSiteUrl()).host;
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${getSiteUrl()}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  await Promise.allSettled([
    fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    }),
    fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    }),
  ]);
}

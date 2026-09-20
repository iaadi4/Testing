import { SITE_NAME, SITE_URL } from "@/lib/site";

export function jsonLdScript(data: unknown, nonce?: string) {
  return {
    type: "application/ld+json" as const,
    nonce,
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    },
  };
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  sameAs: ["https://x.com/iaadi8"],
  founder: {
    "@type": "Person",
    name: "Aditya",
    url: "https://x.com/iaadi8",
  },
  areaServed: ["United States", "United Kingdom", "India", "European Union", "Worldwide"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://x.com/iaadi8",
  },
};

export const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

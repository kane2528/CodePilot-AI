import Head from "next/head";

const SITE_URL = "https://codepilotai.com";
const SITE_NAME = "CodePilot AI";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export default function SEO({
  title = "AI Tools for Developers | CodePilot AI",
  description = "CodePilot AI gives developers superpowers. Explain code, generate SQL queries, create regex patterns, review code, and build ATS-ready resumes — all powered by AI.",
  keywords = "AI tools for developers, AI code explainer, SQL query generator AI, AI resume builder, regex generator, AI code reviewer",
  ogImage = DEFAULT_OG_IMAGE,
  canonical,
  noindex = false,
}) {
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <Head>
      {/* Primary Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="CodePilot AI" />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@codepilotai" />
    </Head>
  );
}

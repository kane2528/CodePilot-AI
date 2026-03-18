import { Html, Head, Main, NextScript } from "next/document";

const SITE_URL = "https://codepilotai.com";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Character Set & Viewport handled by Next.js automatically */}
        <meta charSet="utf-8" />

        {/* Default Fallback Meta (overridden per-page by SEO component) */}
        <meta
          name="description"
          content="CodePilot AI — AI-powered tools for developers. Explain code, generate SQL, create regex, review code, and build resumes with AI."
        />
        <meta name="theme-color" content="#0f0a1e" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Defaults */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CodePilot AI" />
        <meta property="og:image" content={`${SITE_URL}/og-default.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Defaults */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@codepilotai" />
        <meta name="twitter:image" content={`${SITE_URL}/og-default.png`} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <NextScript />
      </body>
    </Html>
  );
}

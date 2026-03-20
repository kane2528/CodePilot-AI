/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://code-pilot-ai-swart.vercel.app/",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,

  // Exclude protected / private routes
  exclude: [
    "/dashboard",
    "/dashboard/*",
    "/profile",
    "/profile/*",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password/*",
    "/oauth-success",
    "/api/*",
  ],

  // Per-page priority overrides
  transform: async (config, path) => {
    const highPriority = ["/", "/tools", "/resume-builder", "/blog", "/faq"];
    const toolPaths = path.startsWith("/tools/");
    const blogPaths = path.startsWith("/blog/");

    let priority = 0.7;
    if (highPriority.includes(path)) priority = 1.0;
    else if (toolPaths) priority = 0.9;
    else if (blogPaths) priority = 0.8;

    return {
      loc: path,
      changefreq: blogPaths ? "weekly" : "monthly",
      priority,
      lastmod: new Date().toISOString(),
    };
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/profile",
          "/signin",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/oauth-success",
          "/api/",
        ],
      },
    ],
    additionalSitemaps: [`${process.env.SITE_URL || "https://code-pilot-ai-swart.vercel.app/"}/sitemap.xml`],
  },
};

module.exports = config;

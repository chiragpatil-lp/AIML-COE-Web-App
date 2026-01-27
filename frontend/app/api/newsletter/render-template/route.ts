import { NextResponse } from "next/server";
import { getAllPosts, getFeaturedPosts } from "@/lib/newsletter/content";
import { CATEGORIES } from "@/lib/newsletter/constants";

export async function GET() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://nexus.example.com";

  const successStories = allPosts
    .filter((post) => post.categories.includes("Customer Success Story"))
    .slice(0, 5);

  const mainFeatured = featuredPosts[0] || allPosts[0];

  // Logic to find other categories with posts (excluding Success Stories which is already handled)
  const otherCategories = CATEGORIES.filter(
    (category) => category.name !== "Customer Success Story",
  )
    .map((category) => {
      const posts = allPosts
        .filter((post) => post.categories.includes(category.name))
        .filter((post) => post.id !== mainFeatured?.id) // Exclude featured post to avoid duplicates
        .slice(0, 3);
      return {
        categoryName: category.name,
        posts: posts.map((post) => ({
          id: post.id,
          title: post.title,
          type: "Article",
          link: `${BASE_URL}/newsletter/${post.slug}`,
        })),
      };
    })
    .filter((category) => category.posts.length > 0);

  const newsletterData = {
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    issue: "#43",
    intro:
      "Welcome to this month's edition of the Nexus Newsletter. Discover the latest AI innovations, insights, and success stories from our team and the broader AI community.",
  };

  const techUpdates = [
    {
      title: "Meet TaxMate: Your AI Tax Assistant",
      description: `With the January 17th deadline for Investment Proof submission approaching, we've developed TaxMate to simplify your queries:
• Clarify valid proofs for Investment Declarations (80C, 80D, etc.)
• Answer queries on specific claims (NPS, HRA, etc.)
• Guide you on Darwinbox upload requirements

Try the AI Assistant here: TaxMate`,
      icon: "🤖",
    },
    {
      title: "Nexus Core Platform Update",
      description:
        "We've successfully rebranded and updated our strategic pillars to better serve enterprise AI needs.",
      icon: "🚀",
    },
  ];

  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nexus Newsletter</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Plus Jakarta Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa">
      <tbody>
        <tr>
          <td align="center" style="padding: 40px 20px">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; boxShadow: 0 4px 16px rgba(0,0,0,0.08);">
              <thead>
                <tr>
                  <td style="background: linear-gradient(135deg, #146e96 0%, #0f5a7a 100%); padding: 40px 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; fontSize: 28px; fontWeight: 600; letter-spacing: 0.5px;">Nexus</h1>
                    <p style="margin: 12px 0 0; color: rgba(255,255,255,0.8); fontSize: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      Newsletter ${newsletterData.issue} • ${newsletterData.date}
                    </p>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 40px 40px 32px">
                    <p style="margin: 0; color: #202020; fontSize: 16px; line-height: 1.75;">${newsletterData.intro}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px">
                    <h3 style="margin: 0 0 24px; color: #202020; fontSize: 20px; fontWeight: 600;">⭐ Featured Article</h3>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 2px solid #f35959; border-radius: 14px; overflow: hidden;">
                      <tbody>
                        <tr>
                          <td>
                            <img src="${mainFeatured?.coverImage || ''}" alt="${mainFeatured?.title || 'Featured Image'}" width="520" height="240" style="display: block; width: 100%; height: 240px; object-fit: cover;" />
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 28px 26px; background-color: #ffffff;">
                            <div style="display: inline-block; background-color: #f35959; color: #ffffff; padding: 6px 14px; border-radius: 20px; fontSize: 12px; margin-bottom: 14px; fontWeight: 600;">${mainFeatured?.readingTime} min read</div>
                            <h4 style="margin: 0 0 14px; color: #202020; fontSize: 22px; fontWeight: 600; line-height: 1.35;">${mainFeatured?.title}</h4>
                            <p style="margin: 0 0 24px; color: #666666; fontSize: 15px; line-height: 1.7;">${mainFeatured?.excerpt}</p>
                            <a href="${BASE_URL}/newsletter/${mainFeatured?.slug}" style="display: inline-block; background-color: #f35959; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 26px; fontSize: 14px; fontWeight: 600;">Read Full Article →</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px 24px">
                    <h3 style="margin: 0 0 24px; color: #202020; fontSize: 20px; fontWeight: 600;">🚀 Success Stories</h3>
                  </td>
                </tr>
                ${successStories
                  .map(
                    (story) => `
                <tr>
                  <td style="padding: 0 40px 20px">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
                      <tbody>
                        <tr>
                          <td width="200" style="vertical-align: top">
                            <img src="${story.coverImage}" alt="${story.title}" width="200" height="180" style="display: block; width: 200px; height: 180px; object-fit: cover;" />
                          </td>
                          <td style="padding: 24px 20px; vertical-align: top">
                            <div style="display: inline-block; background-color: #ffe6e6; color: #f35959; padding: 5px 12px; border-radius: 6px; fontSize: 11px; fontWeight: 600; marginBottom: 10px; text-transform: uppercase;">Customer Success</div>
                            <h4 style="margin: 0 0 10px; color: #202020; fontSize: 17px; fontWeight: 600; line-height: 1.4;">${story.title}</h4>
                            <p style="margin: 0 0 14px; color: #666666; fontSize: 14px; line-height: 1.6;">${story.excerpt}</p>
                            <a href="${BASE_URL}/newsletter/${story.slug}" style="color: #f35959; text-decoration: none; fontSize: 14px; fontWeight: 600;">Read Case Study →</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                `,
                  )
                  .join("")}
                <tr>
                  <td style="padding: 30px 40px 24px">
                    <h3 style="margin: 0 0 24px; color: #202020; fontSize: 20px; fontWeight: 600;">💡 Tech Updates</h3>
                  </td>
                </tr>
                ${techUpdates
                  .map(
                    (update) => `
                <tr>
                  <td style="padding: 0 40px 18px">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tbody>
                        <tr>
                          <td width="48" style="vertical-align: top; padding-top: 2px">
                            <div style="width: 48px; height: 48px; background-color: #e0f2f1; border-radius: 10px; display: flex; align-items: center; justify-content: center; fontSize: 22px;">${update.icon}</div>
                          </td>
                          <td style="paddingLeft: 18px; vertical-align: top">
                            <h4 style="margin: 0 0 8px; color: #202020; fontSize: 16px; fontWeight: 600; line-height: 1.4;">${update.title}</h4>
                            <div style="margin: 0; color: #666666; fontSize: 14px; line-height: 1.6; white-space: pre-wrap;">${update.description}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                `,
                  )
                  .join("")}
                ${otherCategories
                  .map(
                    (category) => `
                <tr>
                  <td style="padding: 30px 40px 24px">
                    <h3 style="margin: 0 0 24px; color: #202020; fontSize: 20px; fontWeight: 600;">📚 ${category.categoryName}</h3>
                  </td>
                </tr>
                ${category.posts
                  .map(
                    (post) => `
                <tr>
                  <td style="padding: 0 40px 14px">
                    <a href="${post.link}" style="display: block; padding: 18px 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; color: #202020; transition: all 0.2s;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tbody>
                          <tr>
                            <td style="vertical-align: middle">
                              <div style="font-size: 15px; font-weight: 600; color: #202020; margin-bottom: 6px; line-height: 1.4; font-family: 'Plus Jakarta Sans', sans-serif;">${post.title}</div>
                              <div style="font-size: 13px; color: #666666; line-height: 1.4;">${post.type}</div>
                            </td>
                            <td width="30" align="right" style="vertical-align: middle">
                              <div style="color: #f35959; font-size: 20px; font-weight: bold;">→</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </a>
                  </td>
                </tr>
                `,
                  )
                  .join("")}
                `,
                  )
                  .join("")}
                <tr>
                  <td style="background-color: #f8fafb; padding: 36px 40px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 14px; color: #202020; fontSize: 15px; fontWeight: 600;">Nexus</p>
                    <p style="margin: 0 0 20px; color: #666666; fontSize: 13px; line-height: 1.7; max-width: 380px; margin-left: auto; margin-right: auto;">Driving innovation and excellence in Artificial Intelligence</p>
                  </td>
                </tr>
              </tbody>
            </table>
            <p style="text-align: center; margin-top: 24px; color: #94a3b8; fontSize: 12px;">&copy; 2026 Onix Networking Corp. All rights reserved.</p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
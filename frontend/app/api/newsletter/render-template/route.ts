import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, getFeaturedPosts } from "@/lib/newsletter/content";

export async function GET(request: NextRequest) {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();

  const BASE_URL = "https://aiml-coe-web-app-36231825761.us-central1.run.app";

  // Section 2: AI Delivery Wins (Customer Success Stories)
  // Logic: Post with newsletterSection === 'delivery-wins'
  const deliveryWins = allPosts
    .filter((post) => post.newsletterSection === "delivery-wins")
    .slice(0, 5)
    .map((post) => ({
      ...post,
      tags: [post.tag],
    }));

  // Section 1: Flagship Achievement (Featured Post)
  // Logic: Post with newsletterSection === 'flagship'
  const flagshipAchievement =
    allPosts.find((post) => post.newsletterSection === "flagship") ||
    allPosts[0];

  // Section 3: COE Execution Updates (Static for now, matching user request)
  const coeUpdates = [
    {
      title: "🚀 Agentic Demo Platform Expanded",
      description:
        "Transformed the Interactive Demo Hub into a state-of-the-art Agentic Platform, featuring a sophisticated constellation of autonomous agents. This upgrade demonstrates the potential of next-generation cognitive architectures to drive enterprise value.",
      date: "Week of Jan 20, 2026",
    },
    {
      title: "📰 Nexus Newsletter System Live",
      description:
        "Successfully operationalized the Nexus Newsletter Engine, an automated content ecosystem. This platform synthesizes internal engineering wins and global market signals into a unified intelligence briefing.",
      date: "Week of Jan 30, 2026",
    },
  ];

  // Section 4: AI Industry Signals (Updated based on Jan 2026 search)
  // Focus: LLMs, Agents, and AgentOps
  const hardcodedSignals = [
    {
      category: "Google Cloud",
      categoryColor: "bg-teal-50 text-teal-800",
      title: "Agentic Vision with Gemini 3 Flash",
      description:
        "Google introduces Gemini 3 Flash, designed for high-frequency agentic workflows with enhanced vision capabilities, enabling developers to build faster, more responsive multimodal agents.",
      source: "Google Blog • Jan 29, 2026",
      link: "https://blog.google/innovation-and-ai/technology/developers-tools/agentic-vision-gemini-3-flash/",
      style: {
        bg: "#e0f2f1",
        color: "#00695c",
      },
    },
    {
      category: "AI Startups",
      title: "Viral 'Moltbot' AI Assistant Automates Your Digital Life",
      description:
        "TechCrunch breaks down the rise of Moltbot (formerly Clawdbot), the personal AI agent that autonomously manages emails, scheduling, and apps, now rebranding as it scales.",
      source: "TechCrunch • Jan 27, 2026",
      link: "https://techcrunch.com/2026/01/27/everything-you-need-to-know-about-viral-personal-ai-assistant-clawdbot-now-moltbot/",
      style: {
        bg: "#eff6ff",
        color: "#1e40af",
      },
    },
  ];

  const blogSignals = allPosts
    .filter((post) => post.newsletterSection === "industry-signals")
    .map((post) => ({
      category: post.tag || "Blog Update",
      categoryColor: "bg-blue-50 text-blue-800",
      title: post.title,
      description: post.excerpt,
      source: "Nexus Blog • " + new Date(post.publishedAt).toLocaleDateString(),
      link: `${BASE_URL}/newsletter/${post.slug}`,
      style: {
        bg: "#eff6ff",
        color: "#1e40af",
      },
    }));

  const industrySignals = [...hardcodedSignals, ...blogSignals];

  const newsletterData = {
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    issue: "#1", // Resetting issue number as per new template
    intro:
      "Welcome to this month's Nexus (AI CoE) Newsletter. This edition highlights our key Nexus (AI CoE) initiatives, recent AI delivery wins, and key AI trends shaping the AI landscape.",
  };

  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nexus Newsletter</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #fafafa;
      font-family:
        &quot;Plus Jakarta Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica,
        Arial, sans-serif;
    "
  >
    <table
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="background-color: #fafafa"
    >
      <tbody>
        <tr>
          <td align="center" style="padding: 40px 20px">
            <!-- Main Content Container -->
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              width="600"
              style="
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
              "
            >
              <!-- Header with Brand -->
              <thead>
                <tr>
                  <td
                    style="
                      background: linear-gradient(
                        135deg,
                        #146e96 0%,
                        #0f5a7a 100%
                      );
                      padding: 40px 40px 30px;
                      text-align: center;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 28px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        font-family: &quot;Plus Jakarta Sans&quot;, sans-serif;
                      "
                    >
                      Nexus
                    </h1>
                    <p
                      style="
                        margin: 12px 0 0;
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                      "
                    >
                      Newsletter ${newsletterData.issue} • ${newsletterData.date}
                    </p>
                  </td>
                </tr>
              </thead>

              <!-- Body -->
              <tbody>
                <!-- Intro Section -->
                <tr>
                  <td style="padding: 40px 40px 32px">
                    <p
                      style="
                        margin: 0;
                        color: #202020;
                        font-size: 16px;
                        line-height: 1.75;
                        font-family: &quot;Plus Jakarta Sans&quot;, sans-serif;
                      "
                    >
                      ${newsletterData.intro}
                    </p>
                  </td>
                </tr>

                <!-- Section 1: COE Spotlight (Flagship Achievement) -->
                <tr>
                  <td style="padding: 30px 40px">
                    <h3
                      style="
                        margin: 0 0 24px;
                        color: #202020;
                        font-size: 20px;
                        font-weight: 600;
                        font-family: &quot;Plus Jakarta Sans&quot;, sans-serif;
                      "
                    >
                      🎯 Flagship Achievement
                    </h3>
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      width="100%"
                      style="
                        border: 2px solid #f35959;
                        border-radius: 14px;
                        overflow: hidden;
                        box-shadow: 0 4px 8px rgba(243, 89, 89, 0.1);
                      "
                    >
                      <tbody>
                        <tr>
                          <td>
                            <img
                              src="${flagshipAchievement?.coverImage || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600"}"
                              alt="${flagshipAchievement?.title || "Flagship Achievement"}"
                              width="520"
                              height="240"
                              style="
                                display: block;
                                width: 100%;
                                height: 240px;
                                object-fit: cover;
                              "
                            />
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              padding: 28px 26px;
                              background-color: #ffffff;
                            "
                          >
                            <div
                              style="
                                display: inline-block;
                                background-color: #f35959;
                                color: #ffffff;
                                padding: 6px 14px;
                                border-radius: 20px;
                                font-size: 12px;
                                margin-bottom: 14px;
                                font-weight: 600;
                                letter-spacing: 0.3px;
                              "
                            >
                              Milestone
                            </div>
                            <h4
                              style="
                                margin: 0 0 14px;
                                color: #202020;
                                font-size: 22px;
                                font-weight: 600;
                                line-height: 1.35;
                                font-family:
                                  &quot;Plus Jakarta Sans&quot;, sans-serif;
                              "
                            >
                              ${flagshipAchievement?.title || "Introducing Nexus: Our AI COE Platform"}
                            </h4>
                            <p
                              style="
                                margin: 0 0 24px;
                                color: #666666;
                                font-size: 15px;
                                line-height: 1.7;
                              "
                            >
                              ${flagshipAchievement?.excerpt || "Nexus, our new AI COE platform, is now operational in its first phase, featuring the Interactive Demo Hub, the automated newsletter system, and AI accelerators."}
                            </p>
                            <a
                              href="${BASE_URL}/newsletter/${flagshipAchievement?.slug}"
                              style="
                                display: inline-block;
                                background-color: #f35959;
                                color: #ffffff;
                                text-decoration: none;
                                padding: 13px 28px;
                                border-radius: 26px;
                                font-size: 14px;
                                font-weight: 600;
                                font-family:
                                  &quot;Plus Jakarta Sans&quot;, sans-serif;
                                box-shadow: 0 2px 8px rgba(243, 89, 89, 0.2);
                              "
                            >
                              Read Full Story →
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Section 2: Project Delivery Wins -->
                <tr>
                  <td style="padding: 30px 40px">
                    <h3
                      style="
                        margin: 0 0 24px;
                        color: #202020;
                        font-size: 20px;
                        font-weight: 600;
                        font-family: &quot;Plus Jakarta Sans&quot;, sans-serif;
                      "
                    >
                      ✅ AI Delivery Wins
                    </h3>

                    ${deliveryWins
                      .map(
                        (win) => `
                    <!-- Success Story Card -->
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      width="100%"
                      style="
                        border: 1px solid #e5e7eb;
                        border-radius: 12px;
                        overflow: hidden;
                        margin-bottom: 20px;
                      "
                    >
                      <tbody>
                        <tr>
                          <td style="padding: 24px 26px">
                            <div
                              style="
                                display: inline-block;
                                background-color: #10b981;
                                color: #ffffff;
                                padding: 5px 12px;
                                border-radius: 16px;
                                font-size: 11px;
                                margin-bottom: 12px;
                                font-weight: 600;
                                text-transform: uppercase;
                                letter-spacing: 0.3px;
                              "
                            >
                              Completed
                            </div>
                            <h4
                              style="
                                margin: 0 0 12px;
                                color: #202020;
                                font-size: 18px;
                                font-weight: 600;
                                line-height: 1.4;
                                font-family:
                                  &quot;Plus Jakarta Sans&quot;, sans-serif;
                              "
                            >
                              ${win.title}
                            </h4>
                            <p
                              style="
                                margin: 0 0 16px;
                                color: #666666;
                                font-size: 14px;
                                line-height: 1.7;
                              "
                            >
                              ${win.excerpt}
                            </p>
                            <div style="margin-bottom: 12px">
                              ${win.tags
                                .slice(0, 3)
                                .map(
                                  (tag) => `
                              <span
                                style="
                                  display: inline-block;
                                  background-color: #f0f9ff;
                                  color: #0369a1;
                                  padding: 4px 10px;
                                  border-radius: 12px;
                                  font-size: 12px;
                                  margin-right: 6px;
                                  margin-bottom: 6px;
                                "
                              >
                                ${tag}
                              </span>
                              `,
                                )
                                .join("")}
                            </div>
                            <a
                              href="${BASE_URL}/newsletter/${win.slug}"
                              style="
                                color: #f35959;
                                text-decoration: none;
                                font-size: 14px;
                                font-weight: 600;
                              "
                            >
                              Read Case Study →
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    `,
                      )
                      .join("")}
                  </td>
                </tr>

                <!-- Section 3: COE Updates & Initiatives -->
                <tr>
                  <td style="padding: 30px 40px">
                    <h3
                      style="
                        margin: 0 0 24px;
                        color: #202020;
                        font-size: 20px;
                        font-weight: 600;
                        font-family: &quot;Plus Jakarta Sans&quot;, sans-serif;
                      "
                    >
                      📋 Nexus (AI CoE) Execution Updates
                    </h3>

                    ${coeUpdates
                      .map(
                        (update) => `
                    <!-- Update Item -->
                    <div
                      style="
                        margin-bottom: 24px;
                        padding-bottom: 24px;
                        border-bottom: 1px solid #e5e7eb;
                      "
                    >
                      <h4
                        style="
                        margin: 0 0 8px;
                          color: #202020;
                          font-size: 16px;
                          font-weight: 600;
                          font-family:
                            &quot;Plus Jakarta Sans&quot;, sans-serif;
                        "
                      >
                        ${update.title}
                      </h4>
                      <p
                        style="
                          margin: 0 0 8px;
                          color: #666666;
                          font-size: 14px;
                          line-height: 1.7;
                        "
                      >
                        ${update.description}
                      </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 12px">
                        ${update.date}
                      </p>
                    </div>
                    `,
                      )
                      .join("")}
                  </td>
                </tr>

                <!-- Section 4: AI World Roundup (Industry Signals) -->
                <tr>
                  <td style="padding: 30px 40px">
                    <h3
                      style="
                        margin: 0 0 24px;
                        color: #202020;
                        font-size: 20px;
                        font-weight: 600;
                        font-family: &quot;Plus Jakarta Sans&quot;, sans-serif;
                      "
                    >
                      🌍 AI Industry Signals
                    </h3>

                    ${industrySignals
                      .map(
                        (signal) => `
                    <!-- News Item -->
                    <a
                      href="${signal.link}"
                      style="
                        display: block;
                        text-decoration: none;
                        margin-bottom: 20px;
                      "
                    >
                      <table
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        width="100%"
                        style="
                          border: 1px solid #e5e7eb;
                          border-radius: 10px;
                          overflow: hidden;
                          background-color: #ffffff;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              style="padding: 20px 22px; vertical-align: top;"
                              width="85%"
                              align="left"
                            >
                              <div
                                style="
                                  display: inline-block;
                                  background-color: ${signal.style.bg};
                                  color: ${signal.style.color};
                                  padding: 4px 10px;
                                  border-radius: 12px;
                                  font-size: 11px;
                                  margin-bottom: 10px;
                                  font-weight: 600;
                                  text-transform: uppercase;
                                "
                              >
                                ${signal.category}
                              </div>
                              <h5
                                style="
                                  margin: 0 0 10px;
                                  color: #202020;
                                  font-size: 15px;
                                  font-weight: 600;
                                  line-height: 1.4;
                                  font-family:
                                    &quot;Plus Jakarta Sans&quot;, sans-serif;
                                "
                              >
                                ${signal.title}
                              </h5>
                              <p
                                style="
                                  margin: 0 0 8px;
                                  color: #666666;
                                  font-size: 13px;
                                  line-height: 1.6;
                                "
                              >
                                ${signal.description}
                              </p>
                              <p
                                style="
                                  margin: 0;
                                  color: #94a3b8;
                                  font-size: 11px;
                                "
                              >
                                ${signal.source}
                              </p>
                            </td>
                            <td
                              width="15%"
                              align="right"
                              style="vertical-align: middle"
                            >
                              <div
                                style="
                                  color: #f35959;
                                  font-size: 20px;
                                  font-weight: bold;
                                "
                              >
                                →
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </a>
                    `,
                      )
                      .join("")}
                  </td>
                </tr>

                <!-- CTA Section -->
                <tr>
                  <td style="padding: 40px 40px 35px">
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      width="100%"
                      style="
                        background: linear-gradient(
                          135deg,
                          #146e96 0%,
                          #0f5a7a 100%
                        );
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(20, 110, 150, 0.15);
                      "
                    >
                      <tbody>
                        <tr>
                        <td style="padding: 40px 32px; text-align: center">
                            <h3
                              style="
                                margin: 0 0 16px;
                                color: #ffffff;
                                font-size: 24px;
                                font-weight: 600;
                                line-height: 1.3;
                                font-family:
                                  &quot;Plus Jakarta Sans&quot;, sans-serif;
                              "
                            >
                              Want to contribute?
                            </h3>
                            <p
                              style="
                                margin: 0 0 28px;
                                color: rgba(255, 255, 255, 0.92);
                                font-size: 15px;
                                line-height: 1.7;
                                max-width: 400px;
                                margin-left: auto;
                                margin-right: auto;
                              "
                            >
                              Share your AI projects, insights, or success
                              stories with the Nexus (AI CoE) community
                            </p>
                            <a
                              href="mailto:aiml_coe@onixnet.com"
                              style="
                                display: inline-block;
                                background-color: #ffffff;
                                color: #146e96;
                                text-decoration: none;
                                padding: 14px 32px;
                                border-radius: 28px;
                                font-size: 15px;
                                font-weight: 600;
                                font-family:
                                  &quot;Plus Jakarta Sans&quot;, sans-serif;
                                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                              "
                            >
                              Submit Your Story →
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      background-color: #f8fafb;
                      padding: 36px 40px 32px;
                      text-align: center;
                      border-top: 1px solid #e5e7eb;
                    "
                  >
                    <p
                      style="
                        margin: 0 0 14px;
                        color: #202020;
                        font-size: 15px;
                        font-weight: 600;
                        font-family: &quot;Plus Jakarta Sans&quot;, sans-serif;
                      "
                    >
                      Nexus (AI CoE)
                    </p>
                    <p
                      style="
                        margin: 0 0 20px;
                        color: #666666;
                        font-size: 13px;
                        line-height: 1.7;
                        max-width: 380px;
                        margin-left: auto;
                        margin-right: auto;
                      "
                    >
                      Driving innovation and excellence in Artificial
                      Intelligence and Machine Learning
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- End Main Content -->

            <p
              style="
              text-align: center;
                margin-top: 24px;
                color: #94a3b8;
                font-size: 12px;
              "
            >
              &copy; 2026 Onix Networking Corp. All rights reserved.
            </p>
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

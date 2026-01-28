import { NextResponse } from "next/server";
import { getAllPosts, getFeaturedPosts } from "@/lib/newsletter/content";

export async function GET() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL || "https://nexus.example.com";

  // Section 2: AI Delivery Wins (Customer Success Stories)
  const deliveryWins = allPosts
    .filter((post) => post.tag !== "AI Trends")
    .slice(0, 5)
    .map((post) => ({
      ...post,
      tags: [post.tag],
    }));

  // Section 1: Flagship Achievement (Featured Post)
  // Prefer a post tagged 'Milestone' or just the first featured post
  const flagshipAchievement =
    featuredPosts.length > 0 ? featuredPosts[0] : allPosts[0];

  // Section 3: COE Execution Updates (Static for now, matching user request)
  const coeUpdates = [
    {
      title: "🚀 Interactive Demo Hub Expanded",
      description:
        "Added five new conversational agents: OrderFlow AI for order processing, ThinkStack for reasoning workflows, and SQLGenie for SQL generation. All agents now support live sales demonstrations with pre-loaded datasets.",
      date: "Week of Jan 20, 2026",
    },
    {
      title: "📰 AI Newsletter System Live",
      description:
        "Phase 1 MVP deployed with manual content creation and SendGrid integration. Archive functionality allows browsing past editions. Phase 2 AI news aggregation module begins development next sprint.",
      date: "Week of Jan 13, 2026",
    },
    {
      title: "🛠️ MLOps Templates Development",
      description:
        "Building reusable Vertex AI Pipeline templates for common ML workflows. First template covers data preprocessing, model training, and deployment automation. Documentation and best practices guide in progress.",
      date: "In Progress",
    },
  ];

  // Section 4: AI Industry Signals (Static for now, matching user request)
  const industrySignals = [
    {
      category: "LLMs",
      categoryColor: "bg-blue-50 text-blue-800", // Tailwind classes for reference, mapped to inline styles below
      title: "OpenAI Releases GPT-5 with Multimodal Reasoning",
      description:
        "Latest model demonstrates significant improvements in complex reasoning tasks, combining text, image, and audio inputs seamlessly.",
      source: "TechCrunch • Jan 24, 2026",
      link: "#",
      style: {
        bg: "#eff6ff",
        color: "#1e40af",
      },
    },
    {
      category: "AI Agents",
      title: "Google Vertex AI Adds Native Agent Builder",
      description:
        "New low-code platform enables rapid development of AI agents with built-in tool integration and monitoring capabilities for enterprise use cases.",
      source: "Google Cloud Blog • Jan 22, 2026",
      link: "#",
      style: {
        bg: "#f0fdf4",
        color: "#15803d",
      },
    },
    {
      category: "MLOps",
      title: "Databricks Launches Unified ML Pipeline Framework",
      description:
        "New framework streamlines ML workflows from data preparation to production deployment with automated versioning and lineage tracking.",
      source: "VentureBeat • Jan 20, 2026",
      link: "#",
      style: {
        bg: "#fef3c7",
        color: "#92400e",
      },
    },
  ];

  const newsletterData = {
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    issue: "#1", // Resetting issue number as per new template
    intro:
      "Welcome to this month's AI Newsletter. This edition highlights our key COE initiatives, recent AI delivery wins, and key AI trends shaping the AI landscape.",
  };

  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AIML COE Newsletter</title>
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
                      AI Center of Excellence
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
                      📋 COE Execution Updates
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
                              stories with the COE community
                            </p>
                            <a
                              href="#"
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
                      AI Center of Excellence
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
                    <div style="margin-bottom: 20px">
                      <a
                        href="#"
                        style="
                          display: inline-block;
                          margin: 0 10px;
                          color: #146e96;
                          text-decoration: none;
                          font-size: 13px;
                          font-weight: 500;
                        "
                        >LinkedIn</a
                      >
                      <span style="color: #cbd5e1; margin: 0 4px">•</span>
                      <a
                        href="#"
                        style="
                          display: inline-block;
                          margin: 0 10px;
                          color: #146e96;
                          text-decoration: none;
                          font-size: 13px;
                          font-weight: 500;
                        "
                        >Twitter</a
                      >
                      <span style="color: #cbd5e1; margin: 0 4px">•</span>
                      <a
                        href="#"
                        style="
                          display: inline-block;
                          margin: 0 10px;
                          color: #146e96;
                          text-decoration: none;
                          font-size: 13px;
                          font-weight: 500;
                        "
                        >Website</a
                      >
                    </div>
                    <p
                      style="
                        margin: 0;
                        color: #94a3b8;
                        font-size: 12px;
                        line-height: 1.6;
                      "
                    >
                      <a
                        href="#"
                        style="color: #94a3b8; text-decoration: underline"
                        >Unsubscribe</a
                      >
                      <span style="margin: 0 6px">•</span>
                      <a
                        href="#"
                        style="color: #94a3b8; text-decoration: underline"
                        >View in Browser</a
                      >
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

/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";

// Mock Data
const NEWSLETTER_DATA = {
  date: "January 15, 2026",
  issue: "#42",
  intro:
    "Welcome to this month's edition of the AIML COE Newsletter. Discover the latest AI innovations, insights, and success stories from our team and the broader AI community.",
};

const FEATURED_ARTICLE = {
  title: "The Future of Generative AI in Enterprise",
  excerpt:
    "Exploring how large language models are transforming business operations, customer service, and product development across industries.",
  image:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
  link: "#",
  readTime: "8 min read",
};

const SUCCESS_STORIES = [
  {
    id: 3,
    title: "Staples: Personalization at Scale",
    description:
      "Implemented a recommendation engine that personalizes the B2B shopping experience, driving higher engagement and repeat purchases.",
    impact: "12% rev. uplift",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600",
    link: "#",
  },
];

const TECH_UPDATES = [
  {
    title: "Cummins Delivery Team Enablement",
    description:
      "COE helped Cummins delivery team set up Authentication and CI-CD pipelines, streamlining their deployment process.",
    icon: "🤝",
  },
  {
    title: "New Model Training Pipeline",
    description:
      "Our team deployed a new distributed training framework, reducing model training time by 40%.",
    icon: "🚀",
  },
  {
    title: "MLOps Dashboard v2.0",
    description:
      "Enhanced monitoring capabilities with real-time performance metrics and automated alerts.",
    icon: "📊",
  },
  {
    title: "Ethics & Governance Framework",
    description:
      "Launched comprehensive AI ethics guidelines ensuring responsible AI development.",
    icon: "⚖️",
  },
];

const RESOURCES = [
  {
    title: "Best Practices Guide: LLM Fine-tuning",
    type: "PDF Guide",
    link: "#",
  },
  {
    title: "Video Tutorial: Building RAG Applications",
    type: "Video Series",
    link: "#",
  },
  {
    title: "Research Paper: Multimodal AI Systems",
    type: "Research",
    link: "#",
  },
];

export default function EmailTemplatePreview() {
  const emailRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState("Copy Email Content");

  const handleCopy = () => {
    if (emailRef.current) {
      // Create a range to select the node
      const range = document.createRange();
      range.selectNode(emailRef.current);

      // Select the text
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);

        // Execute copy command
        try {
          document.execCommand("copy");
          setCopyStatus("Copied!");
          setTimeout(() => setCopyStatus("Copy Email Content"), 2000);
        } catch (err) {
          console.error("Failed to copy", err);
          setCopyStatus("Failed to Copy");
        }

        // Deselect
        selection.removeAllRanges();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
        <div>
          <h1
            className="text-3xl font-medium text-[#202020] mb-1"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            Newsletter Template Preview
          </h1>
          <p className="text-sm text-[#666666]">
            Test your email design before sending
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="bg-[#f35959] hover:bg-[#d94444] text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          {copyStatus}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Email Preview Container */}
        <div className="flex-1 bg-white shadow-xl rounded-lg overflow-hidden">
          {/*
                EMAIL TEMPLATE START
                Using inline styles for maximum email client compatibility.
            */}
          <div
            ref={emailRef}
            style={{
              margin: 0,
              padding: 0,
              backgroundColor: "#fafafa",
              fontFamily:
                "'Plus Jakarta Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            <table
              cellPadding="0"
              cellSpacing="0"
              border={0}
              width="100%"
              style={{ backgroundColor: "#fafafa" }}
            >
              <tbody>
                <tr>
                  <td align="center" style={{ padding: "40px 20px" }}>
                    {/* Main Content Container */}
                    <table
                      cellPadding="0"
                      cellSpacing="0"
                      border={0}
                      width="600"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      }}
                    >
                      {/* Header with Brand */}
                      <thead>
                        <tr>
                          <td
                            style={{
                              background:
                                "linear-gradient(135deg, #146e96 0%, #0f5a7a 100%)",
                              padding: "40px 40px 30px",
                              textAlign: "center",
                            }}
                          >
                            <h1
                              style={{
                                margin: 0,
                                color: "#ffffff",
                                fontSize: "28px",
                                fontWeight: "600",
                                letterSpacing: "0.5px",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              AI/ML Center of Excellence
                            </h1>
                            <p
                              style={{
                                margin: "12px 0 0",
                                color: "rgba(255,255,255,0.8)",
                                fontSize: "14px",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                              }}
                            >
                              Newsletter {NEWSLETTER_DATA.issue} •{" "}
                              {NEWSLETTER_DATA.date}
                            </p>
                          </td>
                        </tr>
                      </thead>

                      {/* Body */}
                      <tbody>
                        {/* Intro Section */}
                        <tr>
                          <td style={{ padding: "40px 40px 32px" }}>
                            <p
                              style={{
                                margin: "0",
                                color: "#202020",
                                fontSize: "16px",
                                lineHeight: "1.75",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              {NEWSLETTER_DATA.intro}
                            </p>
                          </td>
                        </tr>

                        {/* Featured Article */}
                        <tr>
                          <td style={{ padding: "30px 40px" }}>
                            <h3
                              style={{
                                margin: "0 0 24px",
                                color: "#202020",
                                fontSize: "20px",
                                fontWeight: "600",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              ⭐ Featured Article
                            </h3>
                            <table
                              cellPadding="0"
                              cellSpacing="0"
                              border={0}
                              width="100%"
                              style={{
                                border: "2px solid #f35959",
                                borderRadius: "14px",
                                overflow: "hidden",
                                boxShadow: "0 4px 8px rgba(243, 89, 89, 0.1)",
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <img
                                      src={FEATURED_ARTICLE.image}
                                      alt={FEATURED_ARTICLE.title}
                                      width="520"
                                      height="240"
                                      style={{
                                        display: "block",
                                        width: "100%",
                                        height: "240px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      padding: "28px 26px",
                                      backgroundColor: "#ffffff",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "inline-block",
                                        backgroundColor: "#f35959",
                                        color: "#ffffff",
                                        padding: "6px 14px",
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        marginBottom: "14px",
                                        fontWeight: "600",
                                        letterSpacing: "0.3px",
                                      }}
                                    >
                                      {FEATURED_ARTICLE.readTime}
                                    </div>
                                    <h4
                                      style={{
                                        margin: "0 0 14px",
                                        color: "#202020",
                                        fontSize: "22px",
                                        fontWeight: "600",
                                        lineHeight: "1.35",
                                        fontFamily:
                                          "'Plus Jakarta Sans', sans-serif",
                                      }}
                                    >
                                      {FEATURED_ARTICLE.title}
                                    </h4>
                                    <p
                                      style={{
                                        margin: "0 0 24px",
                                        color: "#666666",
                                        fontSize: "15px",
                                        lineHeight: "1.7",
                                      }}
                                    >
                                      {FEATURED_ARTICLE.excerpt}
                                    </p>
                                    <a
                                      href={FEATURED_ARTICLE.link}
                                      style={{
                                        display: "inline-block",
                                        backgroundColor: "#f35959",
                                        color: "#ffffff",
                                        textDecoration: "none",
                                        padding: "13px 28px",
                                        borderRadius: "26px",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        fontFamily:
                                          "'Plus Jakarta Sans', sans-serif",
                                        boxShadow:
                                          "0 2px 8px rgba(243, 89, 89, 0.2)",
                                      }}
                                    >
                                      Read Full Article →
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        {/* Success Stories */}
                        <tr>
                          <td style={{ padding: "30px 40px 24px" }}>
                            <h3
                              style={{
                                margin: "0 0 24px",
                                color: "#202020",
                                fontSize: "20px",
                                fontWeight: "600",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              🚀 Success Stories
                            </h3>
                          </td>
                        </tr>

                        {SUCCESS_STORIES.map((story) => (
                          <tr key={story.id}>
                            <td style={{ padding: "0 40px 20px" }}>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border={0}
                                width="100%"
                                style={{
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "10px",
                                  overflow: "hidden",
                                  backgroundColor: "#ffffff",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                                }}
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      width="200"
                                      style={{ verticalAlign: "top" }}
                                    >
                                      <img
                                        src={story.image}
                                        alt={story.title}
                                        width="200"
                                        height="180"
                                        style={{
                                          display: "block",
                                          width: "200px",
                                          height: "180px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </td>
                                    <td
                                      style={{
                                        padding: "24px 20px",
                                        verticalAlign: "top",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "inline-block",
                                          backgroundColor: "#ffe6e6",
                                          color: "#f35959",
                                          padding: "5px 12px",
                                          borderRadius: "6px",
                                          fontSize: "11px",
                                          fontWeight: "600",
                                          marginBottom: "10px",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.3px",
                                        }}
                                      >
                                        {story.impact}
                                      </div>
                                      <h4
                                        style={{
                                          margin: "0 0 10px",
                                          color: "#202020",
                                          fontSize: "17px",
                                          fontWeight: "600",
                                          lineHeight: "1.4",
                                          fontFamily:
                                            "'Plus Jakarta Sans', sans-serif",
                                        }}
                                      >
                                        {story.title}
                                      </h4>
                                      <p
                                        style={{
                                          margin: "0 0 14px",
                                          color: "#666666",
                                          fontSize: "14px",
                                          lineHeight: "1.6",
                                        }}
                                      >
                                        {story.description}
                                      </p>
                                      <a
                                        href={story.link}
                                        style={{
                                          color: "#f35959",
                                          textDecoration: "none",
                                          fontSize: "14px",
                                          fontWeight: "600",
                                          fontFamily:
                                            "'Plus Jakarta Sans', sans-serif",
                                        }}
                                      >
                                        Read Case Study →
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        ))}

                        {/* Tech Updates */}
                        <tr>
                          <td style={{ padding: "30px 40px 24px" }}>
                            <h3
                              style={{
                                margin: "0 0 24px",
                                color: "#202020",
                                fontSize: "20px",
                                fontWeight: "600",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              💡 Tech Updates
                            </h3>
                          </td>
                        </tr>

                        {TECH_UPDATES.map((update, index) => (
                          <tr key={index}>
                            <td style={{ padding: "0 40px 18px" }}>
                              <table
                                cellPadding="0"
                                cellSpacing="0"
                                border={0}
                                width="100%"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      width="48"
                                      style={{
                                        verticalAlign: "top",
                                        paddingTop: "2px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "48px",
                                          height: "48px",
                                          backgroundColor: "#e0f2f1",
                                          borderRadius: "10px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "22px",
                                        }}
                                      >
                                        {update.icon}
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        paddingLeft: "18px",
                                        verticalAlign: "top",
                                      }}
                                    >
                                      <h4
                                        style={{
                                          margin: "0 0 8px",
                                          color: "#202020",
                                          fontSize: "16px",
                                          fontWeight: "600",
                                          lineHeight: "1.4",
                                          fontFamily:
                                            "'Plus Jakarta Sans', sans-serif",
                                        }}
                                      >
                                        {update.title}
                                      </h4>
                                      <p
                                        style={{
                                          margin: 0,
                                          color: "#666666",
                                          fontSize: "14px",
                                          lineHeight: "1.6",
                                        }}
                                      >
                                        {update.description}
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        ))}

                        {/* Resources */}
                        <tr>
                          <td style={{ padding: "30px 40px 24px" }}>
                            <h3
                              style={{
                                margin: "0 0 24px",
                                color: "#202020",
                                fontSize: "20px",
                                fontWeight: "600",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              📚 Resources & Learning
                            </h3>
                          </td>
                        </tr>

                        {RESOURCES.map((resource, index) => (
                          <tr key={index}>
                            <td style={{ padding: "0 40px 14px" }}>
                              <a
                                href={resource.link}
                                style={{
                                  display: "block",
                                  padding: "18px 20px",
                                  backgroundColor: "#ffffff",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "8px",
                                  textDecoration: "none",
                                  color: "#202020",
                                  transition: "all 0.2s",
                                }}
                              >
                                <table
                                  cellPadding="0"
                                  cellSpacing="0"
                                  border={0}
                                  width="100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td style={{ verticalAlign: "middle" }}>
                                        <div
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: "600",
                                            color: "#202020",
                                            marginBottom: "6px",
                                            lineHeight: "1.4",
                                            fontFamily:
                                              "'Plus Jakarta Sans', sans-serif",
                                          }}
                                        >
                                          {resource.title}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "13px",
                                            color: "#666666",
                                            lineHeight: "1.4",
                                          }}
                                        >
                                          {resource.type}
                                        </div>
                                      </td>
                                      <td
                                        width="30"
                                        align="right"
                                        style={{ verticalAlign: "middle" }}
                                      >
                                        <div
                                          style={{
                                            color: "#f35959",
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          →
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </a>
                            </td>
                          </tr>
                        ))}

                        {/* CTA Section */}
                        <tr>
                          <td style={{ padding: "40px 40px 35px" }}>
                            <table
                              cellPadding="0"
                              cellSpacing="0"
                              border={0}
                              width="100%"
                              style={{
                                background:
                                  "linear-gradient(135deg, #146e96 0%, #0f5a7a 100%)",
                                borderRadius: "16px",
                                overflow: "hidden",
                                boxShadow:
                                  "0 4px 12px rgba(20, 110, 150, 0.15)",
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      padding: "40px 32px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <h3
                                      style={{
                                        margin: "0 0 16px",
                                        color: "#ffffff",
                                        fontSize: "24px",
                                        fontWeight: "600",
                                        lineHeight: "1.3",
                                        fontFamily:
                                          "'Plus Jakarta Sans', sans-serif",
                                      }}
                                    >
                                      Want to contribute?
                                    </h3>
                                    <p
                                      style={{
                                        margin: "0 0 28px",
                                        color: "rgba(255,255,255,0.92)",
                                        fontSize: "15px",
                                        lineHeight: "1.7",
                                        maxWidth: "400px",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                      }}
                                    >
                                      Share your AI projects, insights, or
                                      research with the community
                                    </p>
                                    <a
                                      href="#"
                                      style={{
                                        display: "inline-block",
                                        backgroundColor: "#ffffff",
                                        color: "#146e96",
                                        textDecoration: "none",
                                        padding: "14px 32px",
                                        borderRadius: "28px",
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        fontFamily:
                                          "'Plus Jakarta Sans', sans-serif",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                      }}
                                    >
                                      Submit Your Story →
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        {/* Footer */}
                        <tr>
                          <td
                            style={{
                              backgroundColor: "#f8fafb",
                              padding: "36px 40px 32px",
                              textAlign: "center",
                              borderTop: "1px solid #e5e7eb",
                            }}
                          >
                            <p
                              style={{
                                margin: "0 0 14px",
                                color: "#202020",
                                fontSize: "15px",
                                fontWeight: "600",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              AI/ML Center of Excellence
                            </p>
                            <p
                              style={{
                                margin: "0 0 20px",
                                color: "#666666",
                                fontSize: "13px",
                                lineHeight: "1.7",
                                maxWidth: "380px",
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                            >
                              Driving innovation and excellence in Artificial
                              Intelligence and Machine Learning
                            </p>
                            <div style={{ marginBottom: "20px" }}>
                              <a
                                href="#"
                                style={{
                                  display: "inline-block",
                                  margin: "0 10px",
                                  color: "#146e96",
                                  textDecoration: "none",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                }}
                              >
                                LinkedIn
                              </a>
                              <span
                                style={{ color: "#cbd5e1", margin: "0 4px" }}
                              >
                                •
                              </span>
                              <a
                                href="#"
                                style={{
                                  display: "inline-block",
                                  margin: "0 10px",
                                  color: "#146e96",
                                  textDecoration: "none",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                }}
                              >
                                Twitter
                              </a>
                              <span
                                style={{ color: "#cbd5e1", margin: "0 4px" }}
                              >
                                •
                              </span>
                              <a
                                href="#"
                                style={{
                                  display: "inline-block",
                                  margin: "0 10px",
                                  color: "#146e96",
                                  textDecoration: "none",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                }}
                              >
                                Website
                              </a>
                            </div>
                            <p
                              style={{
                                margin: 0,
                                color: "#94a3b8",
                                fontSize: "12px",
                                lineHeight: "1.6",
                              }}
                            >
                              <a
                                href="#"
                                style={{
                                  color: "#94a3b8",
                                  textDecoration: "underline",
                                }}
                              >
                                Unsubscribe
                              </a>
                              <span style={{ margin: "0 6px" }}>•</span>
                              <a
                                href="#"
                                style={{
                                  color: "#94a3b8",
                                  textDecoration: "underline",
                                }}
                              >
                                View in Browser
                              </a>
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {/* End Main Content */}

                    <p
                      style={{
                        textAlign: "center",
                        marginTop: "24px",
                        color: "#94a3b8",
                        fontSize: "12px",
                      }}
                    >
                      &copy; 2026 Onix Networking Corp. All rights reserved.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* EMAIL TEMPLATE END */}
        </div>

        {/* Sidebar for Instructions */}
        <div className="w-80 shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-8">
            <h2
              className="text-xl font-semibold text-[#202020] mb-4"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              Testing Guide
            </h2>

            <div className="space-y-4">
              <div className="bg-[#fff5f5] p-4 rounded-lg border border-[#f35959]/20">
                <h3
                  className="font-semibold text-[#f35959] text-sm mb-2 flex items-center gap-2"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                >
                  <span>✓</span> Quick Test
                </h3>
                <ol className="list-decimal list-inside text-sm text-[#202020] space-y-2 leading-relaxed">
                  <li>
                    Click <strong>Copy Email Content</strong>
                  </li>
                  <li>Open Gmail and compose new</li>
                  <li>Paste (Ctrl+V / Cmd+V) into body</li>
                  <li>Send test email to yourself</li>
                </ol>
              </div>

              <div className="bg-[#f8fafb] p-4 rounded-lg border border-gray-200">
                <h3
                  className="font-semibold text-[#202020] text-sm mb-2"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                >
                  Newsletter Sections
                </h3>
                <ul className="text-xs text-[#666666] space-y-1.5">
                  <li>• Featured Article</li>
                  <li>• Success Stories</li>
                  <li>• Tech Updates</li>
                  <li>• Upcoming Events</li>
                  <li>• Resources & Learning</li>
                  <li>• CTA Section</li>
                </ul>
              </div>

              <div className="bg-[#fff7ed] p-4 rounded-lg border border-[#ff9933]/20">
                <h3
                  className="font-semibold text-[#f97316] text-sm mb-2"
                  style={{ fontFamily: "Plus Jakarta Sans" }}
                >
                  Best Practices
                </h3>
                <ul className="text-xs text-[#666666] space-y-1.5 leading-relaxed">
                  <li>• Test on multiple email clients</li>
                  <li>• Check mobile responsiveness</li>
                  <li>• Verify all links work</li>
                  <li>• Review images load properly</li>
                  <li>• Proofread all content</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  This template uses inline CSS for maximum email client
                  compatibility and follows modern email design best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";

interface EmailPreviewClientProps {
  newsletterData: {
    date: string;
    issue: string;
    intro: string;
  };
  flagshipAchievement: {
    title: string;
    excerpt: string;
    image: string;
    link: string;
  };
  deliveryWins: Array<{
    id: string;
    title: string;
    excerpt: string;
    tags: string[];
    link: string;
  }>;
  coeUpdates: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  industrySignals: Array<{
    category: string;
    title: string;
    description: string;
    source: string;
    link: string;
    style: {
      bg: string;
      color: string;
    };
  }>;
}

export function EmailPreviewClient({
  newsletterData,
  flagshipAchievement,
  deliveryWins,
  coeUpdates,
  industrySignals,
}: EmailPreviewClientProps) {
  const emailRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState("Copy Email Content");

  const handleCopy = () => {
    if (emailRef.current) {
      const range = document.createRange();
      range.selectNode(emailRef.current);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        try {
          document.execCommand("copy");
          setCopyStatus("Copied!");
          setTimeout(() => setCopyStatus("Copy Email Content"), 2000);
        } catch (err) {
          console.error("Failed to copy", err);
          setCopyStatus("Failed to Copy");
        }
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
        <div className="flex-1 bg-white shadow-xl rounded-lg overflow-hidden">
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
                              AI Center of Excellence
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
                              Newsletter {newsletterData.issue} •{" "}
                              {newsletterData.date}
                            </p>
                          </td>
                        </tr>
                      </thead>

                      <tbody>
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
                              {newsletterData.intro}
                            </p>
                          </td>
                        </tr>

                        {/* Section 1: COE Spotlight */}
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
                              🎯 Flagship Achievement
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
                                      src={flagshipAchievement.image}
                                      alt={flagshipAchievement.title}
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
                                      Milestone
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
                                      {flagshipAchievement.title}
                                    </h4>
                                    <p
                                      style={{
                                        margin: "0 0 24px",
                                        color: "#666666",
                                        fontSize: "15px",
                                        lineHeight: "1.7",
                                      }}
                                    >
                                      {flagshipAchievement.excerpt}
                                    </p>
                                    <a
                                      href={flagshipAchievement.link}
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
                                      Read Full Story →
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        {/* Section 2: Project Delivery Wins */}
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
                              ✅ AI Delivery Wins
                            </h3>

                            {deliveryWins.map((win) => (
                              <table
                                key={win.id}
                                cellPadding="0"
                                cellSpacing="0"
                                border={0}
                                width="100%"
                                style={{
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "12px",
                                  overflow: "hidden",
                                  marginBottom: "20px",
                                }}
                              >
                                <tbody>
                                  <tr>
                                    <td style={{ padding: "24px 26px" }}>
                                      <div
                                        style={{
                                          display: "inline-block",
                                          backgroundColor: "#10b981",
                                          color: "#ffffff",
                                          padding: "5px 12px",
                                          borderRadius: "16px",
                                          fontSize: "11px",
                                          marginBottom: "12px",
                                          fontWeight: "600",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.3px",
                                        }}
                                      >
                                        Completed
                                      </div>
                                      <h4
                                        style={{
                                          margin: "0 0 12px",
                                          color: "#202020",
                                          fontSize: "18px",
                                          fontWeight: "600",
                                          lineHeight: "1.4",
                                          fontFamily:
                                            "'Plus Jakarta Sans', sans-serif",
                                        }}
                                      >
                                        {win.title}
                                      </h4>
                                      <p
                                        style={{
                                          margin: "0 0 16px",
                                          color: "#666666",
                                          fontSize: "14px",
                                          lineHeight: "1.7",
                                        }}
                                      >
                                        {win.excerpt}
                                      </p>
                                      <div style={{ marginBottom: "12px" }}>
                                        {win.tags.slice(0, 3).map((tag) => (
                                          <span
                                            key={tag}
                                            style={{
                                              display: "inline-block",
                                              backgroundColor: "#f0f9ff",
                                              color: "#0369a1",
                                              padding: "4px 10px",
                                              borderRadius: "12px",
                                              fontSize: "12px",
                                              marginRight: "6px",
                                              marginBottom: "6px",
                                            }}
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                      <a
                                        href={win.link}
                                        style={{
                                          color: "#f35959",
                                          textDecoration: "none",
                                          fontSize: "14px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        Read Case Study →
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            ))}
                          </td>
                        </tr>

                        {/* Section 3: COE Updates & Initiatives */}
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
                              📋 COE Execution Updates
                            </h3>

                            {coeUpdates.map((update, index) => (
                              <div
                                key={index}
                                style={{
                                  marginBottom: "24px",
                                  paddingBottom: "24px",
                                  borderBottom: "1px solid #e5e7eb",
                                }}
                              >
                                <h4
                                  style={{
                                    margin: "0 0 8px",
                                    color: "#202020",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    fontFamily:
                                      "'Plus Jakarta Sans', sans-serif",
                                  }}
                                >
                                  {update.title}
                                </h4>
                                <p
                                  style={{
                                    margin: "0 0 8px",
                                    color: "#666666",
                                    fontSize: "14px",
                                    lineHeight: "1.7",
                                  }}
                                >
                                  {update.description}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                    color: "#94a3b8",
                                    fontSize: "12px",
                                  }}
                                >
                                  {update.date}
                                </p>
                              </div>
                            ))}
                          </td>
                        </tr>

                        {/* Section 4: AI World Roundup */}
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
                              🌍 AI Industry Signals
                            </h3>

                            {industrySignals.map((signal, index) => (
                              <div
                                key={index}
                                style={{
                                  marginBottom: "20px",
                                }}
                              >
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
                                  }}
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          padding: "20px 22px",
                                          width: "100%",
                                          textAlign: "left",
                                          verticalAlign: "top",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "inline-block",
                                            backgroundColor: signal.style.bg,
                                            color: signal.style.color,
                                            padding: "4px 10px",
                                            borderRadius: "12px",
                                            fontSize: "11px",
                                            marginBottom: "10px",
                                            fontWeight: "600",
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          {signal.category}
                                        </div>
                                        <h5
                                          style={{
                                            margin: "0 0 10px",
                                            color: "#202020",
                                            fontSize: "15px",
                                            fontWeight: "600",
                                            lineHeight: "1.4",
                                            fontFamily:
                                              "'Plus Jakarta Sans', sans-serif",
                                          }}
                                        >
                                          {signal.title}
                                        </h5>
                                        <p
                                          style={{
                                            margin: "0 0 8px",
                                            color: "#666666",
                                            fontSize: "13px",
                                            lineHeight: "1.6",
                                          }}
                                        >
                                          {signal.description}
                                        </p>
                                        <p
                                          style={{
                                            margin: 0,
                                            color: "#94a3b8",
                                            fontSize: "11px",
                                          }}
                                        >
                                          {signal.source}
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </td>
                        </tr>

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
                                      success stories with the COE community
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
                              AI Center of Excellence
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
        </div>

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
                  <li>• Flagship Achievement</li>
                  <li>• AI Delivery Wins</li>
                  <li>• COE Updates</li>
                  <li>• Industry Signals</li>
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

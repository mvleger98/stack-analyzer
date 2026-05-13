"use client";
import { useState, useEffect } from "react";

// ── REPLACE THESE WITH YOUR REAL STRIPE LINKS ──
const STRIPE_ONE_TIME = "https://buy.stripe.com/YOUR_ONE_TIME_LINK";
const STRIPE_MONTHLY = "https://buy.stripe.com/YOUR_MONTHLY_LINK";
const FREE_LIMIT = 3;

const badgeColors = {
  Strong: { bg: "#E8F5E2", text: "#3A7D2C" },
  Moderate: { bg: "#FEF3CD", text: "#8A6200" },
  Limited: { bg: "#FFE8D6", text: "#A34A00" },
  Weak: { bg: "#FDECEA", text: "#9B2020" },
};

const timingColors = {
  Morning: { bg: "#FFF8E1", text: "#7C6200" },
  "With food": { bg: "#E8F5E2", text: "#3A7D2C" },
  Evening: { bg: "#EDE7F6", text: "#4A2080" },
  Night: { bg: "#E8EAF6", text: "#1A237E" },
  Anytime: { bg: "#F3F3F3", text: "#444" },
  "Pre-workout": { bg: "#FCE4EC", text: "#880E4F" },
};

function Badge({ label, colorMap }) {
  const colors = colorMap[label] || { bg: "#F3F3F3", text: "#444" };
  return (
    <span style={{
      background: colors.bg, color: colors.text,
      borderRadius: 20, padding: "3px 12px",
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function SupplementTag({ name, onRemove }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "#EEF3EE", color: "#3A5C39",
      border: "1px solid #C5D9C4", borderRadius: 20,
      padding: "5px 14px", fontSize: 13, fontWeight: 500,
    }}>
      {name}
      <button onClick={() => onRemove(name)} style={{
        background: "none", border: "none", cursor: "pointer",
        color: "#7C9E7A", fontSize: 16, lineHeight: 1, padding: 0,
      }}>×</button>
    </span>
  );
}

function ResultCard({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "#fff", border: "1px solid #E8E3DB",
      borderRadius: 16, overflow: "hidden",
      animation: `fadeUp 0.4s ease ${index * 0.07}s both`,
    }}>
      <div onClick={() => setOpen(!open)} style={{
        padding: "18px 22px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 12, cursor: "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 22 }}>{item.emoji}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{item.name}</div>
            <div style={{ fontSize: 12, color: "#8A8A8A", marginTop: 2 }}>{item.dose}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
          <Badge label={item.evidence} colorMap={badgeColors} />
          <Badge label={item.timing} colorMap={timingColors} />
          <span style={{ color: "#8A8A8A", fontSize: 18, marginLeft: 4 }}>{open ? "▾" : "▸"}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: "16px 22px 18px", borderTop: "1px solid #E8E3DB" }}>
          <p style={{ fontSize: 14, color: "#444", lineHeight: 1.6, marginBottom: 10 }}>{item.summary}</p>
          {item.warnings?.map((w, i) => (
            <div key={i} style={{
              display: "flex", gap: 8, alignItems: "flex-start",
              background: "#FFF8E1", border: "1px solid #FFE082",
              borderRadius: 10, padding: "8px 12px", marginBottom: 6,
              fontSize: 13, color: "#7C5C00",
            }}>
              <span>⚠️</span><span>{w}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaywallModal({ onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: 32,
        maxWidth: 400, width: "100%",
        animation: "modalIn 0.3s ease both",
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 24, color: "#1C2B1C", marginBottom: 8,
          }}>
            Unlock Unlimited Analyses
          </h2>
          <p style={{ fontSize: 14, color: "#8A8A8A", lineHeight: 1.6 }}>
            You've used your 3 free analyses. Upgrade to keep optimizing your stack.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <a href={STRIPE_ONE_TIME} target="_blank" rel="noopener noreferrer" style={{
            display: "block", background: "#1C2B1C", color: "#F7F4EF",
            borderRadius: 14, padding: "16px 20px", textDecoration: "none",
            textAlign: "center", fontWeight: 700, fontSize: 15,
          }}>
            $7.99 — One Time Forever
          </a>
          <a href={STRIPE_MONTHLY} target="_blank" rel="noopener noreferrer" style={{
            display: "block", background: "#EEF3EE", color: "#1C2B1C",
            border: "1px solid #C5D9C4",
            borderRadius: 14, padding: "16px 20px", textDecoration: "none",
            textAlign: "center", fontWeight: 700, fontSize: 15,
          }}>
            $4.99 / month
          </a>
        </div>

        <button onClick={onClose} style={{
          width: "100%", background: "none", border: "none",
          color: "#8A8A8A", fontSize: 13, cursor: "pointer", padding: 8,
        }}>
          Maybe later
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 12 }}>
          After payment, refresh the page and your access will be unlocked.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const count = parseInt(localStorage.getItem("sa_usage") || "0");
    const pro = localStorage.getItem("sa_pro") === "true";
    setUsageCount(count);
    setIsPro(pro);

    // Check if returning from Stripe
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      localStorage.setItem("sa_pro", "true");
      setIsPro(true);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const addSupplement = () => {
    const trimmed = input.trim();
    if (!trimmed || supplements.includes(trimmed)) { setInput(""); return; }
    setSupplements([...supplements, trimmed]);
    setInput("");
  };

  const analyze = async () => {
    if (supplements.length === 0) return;

    if (!isPro && usageCount >= FREE_LIMIT) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplements }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const newCount = usageCount + 1;
      localStorage.setItem("sa_usage", newCount.toString());
      setUsageCount(newCount);
      setResults(data);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analysesLeft = isPro ? "∞" : Math.max(0, FREE_LIMIT - usageCount);
  const scoreColor = results?.score >= 80 ? "#3A7D2C" : results?.score >= 60 ? "#8A6200" : "#9B2020";

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4EF", paddingBottom: 80 }}>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      {/* Header */}
      <div style={{
        background: "#1C2B1C", padding: "28px 24px 24px", textAlign: "center",
      }}>
        <div style={{
          fontSize: 12, color: "#7C9E7A", letterSpacing: 3,
          textTransform: "uppercase", marginBottom: 8, fontWeight: 600,
        }}>
          Evidence-Based
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 30, color: "#F7F4EF", letterSpacing: -0.5, margin: 0,
        }}>
          Stack Analyzer
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#9DB89B" }}>
          Know what you're taking. Know why.
        </p>
        <div style={{
          display: "inline-block", marginTop: 12,
          background: isPro ? "#3A7D2C" : "rgba(255,255,255,0.1)",
          borderRadius: 20, padding: "4px 14px",
          fontSize: 12, color: isPro ? "#fff" : "#9DB89B", fontWeight: 600,
        }}>
          {isPro ? "✨ Pro — Unlimited" : `${analysesLeft} free ${analysesLeft === 1 ? "analysis" : "analyses"} left`}
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px" }}>
        {/* Input card */}
        <div style={{
          background: "#fff", border: "1px solid #E8E3DB",
          borderRadius: 20, padding: 20, marginTop: 24,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: "#8A8A8A",
            letterSpacing: 1, textTransform: "uppercase", marginBottom: 12,
          }}>
            Your Supplements
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSupplement()}
              placeholder="e.g. Creatine, Magnesium, Vitamin D…"
              style={{
                flex: 1, padding: "11px 16px", borderRadius: 12,
                border: "1px solid #E8E3DB", fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                background: "#F7F4EF", color: "#1C1C1C", outline: "none",
              }}
            />
            <button onClick={addSupplement} style={{
              background: "#7C9E7A", color: "#fff", border: "none",
              borderRadius: 12, padding: "11px 18px",
              fontSize: 20, cursor: "pointer", fontWeight: 700,
            }}>+</button>
          </div>

          {supplements.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {supplements.map((s) => (
                <SupplementTag key={s} name={s} onRemove={(n) => setSupplements(supplements.filter(x => x !== n))} />
              ))}
            </div>
          )}

          <button
            onClick={analyze}
            disabled={supplements.length === 0 || loading}
            style={{
              width: "100%",
              background: supplements.length === 0 ? "#C8D9C7" : "#1C2B1C",
              color: supplements.length === 0 ? "#8A8A8A" : "#F7F4EF",
              border: "none", borderRadius: 14, padding: "14px 0",
              fontSize: 15, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              cursor: supplements.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Analyzing…" : `Analyze My Stack (${supplements.length})`}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "40px 0" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: "50%", background: "#7C9E7A",
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}

        {error && <p style={{ color: "#9B2020", textAlign: "center", marginTop: 20 }}>{error}</p>}

        {results && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Score */}
            <div style={{
              background: "#fff", border: "1px solid #E8E3DB",
              borderRadius: 20, padding: 20,
              display: "flex", alignItems: "center", gap: 18,
              animation: "fadeUp 0.4s ease both",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                border: `3px solid ${scoreColor}`,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{results.score}</span>
                <span style={{ fontSize: 9, color: "#8A8A8A" }}>/100</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: scoreColor }}>{results.scoreLabel}</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 4, lineHeight: 1.5 }}>{results.overall}</div>
              </div>
            </div>

            {/* Supplement cards */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8A8A8A", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
                Supplement Breakdown
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {results.items?.map((item, i) => <ResultCard key={item.name} item={item} index={i} />)}
              </div>
            </div>

            {/* Timing plan */}
            {results.timingPlan && Object.entries(results.timingPlan).filter(([, v]) => v?.length > 0).length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#8A8A8A", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
                  Daily Timing Plan
                </div>
                <div style={{ background: "#fff", border: "1px solid #E8E3DB", borderRadius: 16, overflow: "hidden" }}>
                  {Object.entries(results.timingPlan).filter(([, v]) => v?.length > 0).map(([time, supps], i, arr) => (
                    <div key={time} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 20px",
                      borderBottom: i < arr.length - 1 ? "1px solid #E8E3DB" : "none",
                    }}>
                      <div style={{ width: 80, fontSize: 11, fontWeight: 700, color: "#8A8A8A", letterSpacing: 0.5, textTransform: "uppercase", flexShrink: 0 }}>
                        {time}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {supps.map((s) => (
                          <span key={s} style={{
                            background: "#EEF3EE", color: "#3A5C39",
                            borderRadius: 20, padding: "4px 12px",
                            fontSize: 12, fontWeight: 600,
                          }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactions */}
            {results.interactions?.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#8A8A8A", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
                  Interactions & Synergies
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {results.interactions.map((item, i) => {
                    const s = item.severity;
                    const c = s === "Caution" ? { bg: "#FFF3E0", border: "#FFB74D", icon: "⚠️", text: "#7C4E00" }
                      : s === "Avoid" ? { bg: "#FDECEA", border: "#EF9A9A", icon: "🚫", text: "#7B1F1F" }
                      : { bg: "#E8F5E2", border: "#A5D6A7", icon: "💡", text: "#2E6B28" };
                    return (
                      <div key={i} style={{
                        background: c.bg, border: `1px solid ${c.border}`,
                        borderRadius: 12, padding: "14px 18px",
                        display: "flex", gap: 12,
                        animation: `fadeUp 0.4s ease ${i * 0.07}s both`,
                      }}>
                        <span style={{ fontSize: 20, flexShrink: 0 }}>{c.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: c.text, marginBottom: 4 }}>{item.supplements}</div>
                          <div style={{ fontSize: 13, color: c.text, lineHeight: 1.5 }}>{item.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Missing */}
            {results.missing?.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#8A8A8A", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
                  Consider Adding
                </div>
                <div style={{
                  background: "#fff", border: "1px solid #E8E3DB",
                  borderRadius: 16, padding: "14px 20px",
                  display: "flex", flexWrap: "wrap", gap: 8,
                }}>
                  {results.missing.map((s) => (
                    <span key={s} style={{
                      background: "#F3F0FF", color: "#4A2080",
                      border: "1px dashed #C5B8E8", borderRadius: 20,
                      padding: "5px 14px", fontSize: 13, fontWeight: 500,
                    }}>+ {s}</span>
                  ))}
                </div>
              </div>
            )}

            {!isPro && (
              <div style={{
                background: "#1C2B1C", borderRadius: 16, padding: 20, textAlign: "center",
              }}>
                <p style={{ color: "#9DB89B", fontSize: 13, marginBottom: 14 }}>
                  {analysesLeft === 0 ? "You've used all your free analyses." : `${analysesLeft} free ${analysesLeft === 1 ? "analysis" : "analyses"} remaining.`} Upgrade for unlimited access.
                </p>
                <a href={STRIPE_ONE_TIME} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-block", background: "#7C9E7A", color: "#fff",
                  borderRadius: 12, padding: "12px 28px",
                  textDecoration: "none", fontWeight: 700, fontSize: 14,
                }}>
                  Upgrade — $7.99 One Time
                </a>
              </div>
            )}

            <p style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 4 }}>
              For informational purposes only. Consult a healthcare provider before starting any supplement regimen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

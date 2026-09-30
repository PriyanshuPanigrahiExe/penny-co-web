import { useState } from "react";

function Premium() {
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);

    try {
      const response = await fetch(
        "http://localhost:3002/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(
          data.message || "Could not open Stripe Checkout."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert(
        "Could not open payment. Make sure stripe-server.js is running on port 3002."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      style={{
        background: "#f8f6f0",
        color: "#171717",
        minHeight: "calc(100vh - 100px)",
        padding: "70px 10%",
        fontFamily: "Arial, sans-serif"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          marginBottom: "55px",
          maxWidth: "650px"
        }}
      >
        <div
          style={{
            fontSize: "12px",
            letterSpacing: "4px",
            marginBottom: "20px"
          }}
        >
          03 / PREMIUM
        </div>

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(48px, 7vw, 82px)",
            lineHeight: "0.95",
            fontWeight: "400",
            margin: 0
          }}
        >
          More control.
          <br />
          <em>More clarity.</em>
        </h1>

        <p
          style={{
            fontSize: "17px",
            lineHeight: "1.7",
            color: "#666",
            maxWidth: "500px",
            marginTop: "25px"
          }}
        >
          Take your money management a little further
          with Penny & Co. Premium.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(250px, 1fr)",
          gap: "70px",
          alignItems: "start"
        }}
      >

        {/* PREMIUM CARD */}
        <div
          style={{
            border: "1px solid #cfcfcf",
            padding: "38px 45px",
            background: "#faf9f4"
          }}
        >
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "4px",
              marginBottom: "18px"
            }}
          >
            PENNY & CO. PREMIUM
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              borderBottom: "1px solid #d8d8d8",
              paddingBottom: "25px",
              marginBottom: "20px"
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "62px"
              }}
            >
              ₹49
            </span>

            <span
              style={{
                fontSize: "20px",
                color: "#555"
              }}
            >
              / month
            </span>
          </div>

          {/* FEATURES */}
          <div
            style={{
              display: "grid",
              gap: "13px",
              marginBottom: "30px"
            }}
          >
            {[
              "Advanced spending analytics",
              "Monthly budget planning",
              "Savings goals",
              "Personal spending insights",
              "Premium dashboard",
              "Expense report export"
            ].map((feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  fontSize: "15px"
                }}
              >
                <span style={{ fontSize: "18px" }}>✓</span>
                {feature}
              </div>
            ))}
          </div>

          {/* STRIPE BUTTON */}
          <button
            onClick={pay}
            disabled={busy}
            style={{
              width: "100%",
              border: "none",
              background: "#171717",
              color: "#fff",
              padding: "17px",
              fontSize: "12px",
              letterSpacing: "2px",
              cursor: busy ? "wait" : "pointer",
              opacity: busy ? 0.7 : 1
            }}
          >
            {busy
              ? "OPENING CHECKOUT..."
              : "GET PREMIUM — ₹49/MONTH   →"}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#888",
              marginTop: "15px"
            }}
          >
            Secure payment powered by Stripe
          </p>
        </div>

        {/* BENEFITS */}
        <div>

          <Benefit
            number="01"
            title="BETTER INSIGHTS"
            text="See where your money goes with clear, easy-to-read analytics."
          />

          <Benefit
            number="02"
            title="SMARTER PLANNING"
            text="Set monthly budgets and stay on track effortlessly."
          />

          <Benefit
            number="03"
            title="REACH YOUR GOALS"
            text="Build better habits and save for what matters."
          />

          <Benefit
            number="04"
            title="PERSONAL INSIGHTS"
            text="Get tailored insights for smarter spending."
          />

          <Benefit
            number="05"
            title="PREMIUM DASHBOARD"
            text="Access a cleaner, more powerful dashboard experience."
          />

          <Benefit
            number="06"
            title="EXPORT REPORTS"
            text="Download your expense reports anytime, anywhere."
          />

        </div>
      </div>

      {/* RESPONSIVE */}
      <style>
        {`
          @media (max-width: 800px) {
            section {
              padding: 50px 6% !important;
            }

            section > div:nth-child(2) {
              grid-template-columns: 1fr !important;
              gap: 45px !important;
            }

            section > div:first-child h1 {
              font-size: 52px !important;
            }

            section > div:nth-child(2) > div:first-child {
              padding: 30px !important;
            }
          }
        `}
      </style>
    </section>
  );
}

function Benefit({ number, title, text }) {
  return (
    <div
      style={{
        borderBottom: "1px solid #d8d8d8",
        padding: "0 0 24px",
        marginBottom: "24px"
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "18px"
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "20px",
            color: "#777"
          }}
        >
          {number}
        </span>

        <div>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "3px",
              marginBottom: "10px"
            }}
          >
            {title}
          </div>

          <p
            style={{
              margin: 0,
              color: "#666",
              lineHeight: "1.6",
              fontSize: "14px"
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Premium;
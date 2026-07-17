"use client";

import { useState } from "react";
import Link from "next/link";
import { plans } from "@/lib/constants";
import { Check } from "lucide-react";

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#5baab8] mb-3 font-mono">
            Pricing
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 font-sans">
            Start free, upgrade when you need more.
          </p>

          <div className="inline-flex items-center gap-3 bg-white border border-border rounded-full px-4 py-2 shadow-sm">
            <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"} font-sans`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-[#5baab8]" : "bg-[#a8d4dc]"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${annual ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"} font-sans`}>Annual <span className="text-[#5baab8]">Save 20%</span></span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl border p-8 relative flex flex-col ${
                plan.highlight ? "border-[#5baab8] shadow-xl ring-1 ring-[#5baab8]/20 scale-105" : "border-border"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5baab8] text-white text-xs font-bold px-4 py-1 rounded-full font-mono">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-lg font-bold text-foreground mb-1 font-heading">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground font-heading">
                  {annual && plan.price !== "$0" ? `$${parseInt(plan.price.slice(1)) * 10}` : plan.price}
                </span>
                <span className="text-sm text-muted-foreground ml-2 font-sans">/{annual ? "year" : plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground font-sans">
                    <Check className="w-4 h-4 text-[#5baab8] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === "Team" ? "/api-disclaimer" : "/sign-up"}
                className={`block text-center text-sm font-semibold py-3 rounded-xl transition-colors font-sans ${
                  plan.highlight
                    ? "bg-[#0d1f26] text-white hover:bg-[#1a3545]"
                    : "bg-[#eef6f8] text-foreground hover:bg-[#d4ecf0]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

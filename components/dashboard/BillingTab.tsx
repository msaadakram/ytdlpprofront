"use client";

import { Check, CreditCard, Download, AlertTriangle } from "lucide-react";

const planFeatures = [
  "Unlimited downloads", "4K Ultra HD video", "All formats incl. FLAC & WebP",
  "Priority processing", "200+ platforms", "Batch playlist downloads", "No ads",
];

const invoices = [
  { id: "INV-001", date: "Feb 1, 2025", amount: "$9.00", status: "Paid" },
  { id: "INV-002", date: "Jan 1, 2025", amount: "$9.00", status: "Paid" },
  { id: "INV-003", date: "Dec 1, 2024", amount: "$9.00", status: "Paid" },
];

export function BillingTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading">Current Plan</h3>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h4 className="text-xl font-extrabold text-foreground font-heading">Pro</h4>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full font-sans">Active</span>
            </div>
            <p className="text-sm text-muted-foreground font-sans">$9/month · Renews on Mar 1, 2025</p>
          </div>
          <button className="text-sm font-medium text-[#5baab8] hover:underline font-sans">Change Plan</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {planFeatures.map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-foreground font-sans">
              <Check className="w-4 h-4 text-[#5baab8]" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading">Payment Method</h3>
        <div className="flex items-center gap-4 p-4 bg-[#eef6f8] rounded-xl">
          <CreditCard className="w-8 h-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground font-sans">Visa ending in 4242</p>
            <p className="text-xs text-muted-foreground font-sans">Expires 12/26</p>
          </div>
          <button className="ml-auto text-sm font-medium text-[#5baab8] hover:underline font-sans">Update</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading">Invoice History</h3>
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-3 bg-[#eef6f8] rounded-xl">
              <div>
                <p className="text-sm font-medium text-foreground font-sans">{inv.id}</p>
                <p className="text-xs text-muted-foreground font-sans">{inv.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground font-sans">{inv.amount}</span>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-sans">{inv.status}</span>
                <button className="p-1.5 rounded-lg hover:bg-white transition-colors text-muted-foreground">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

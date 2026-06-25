"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SippCode {
  id: number; code: string; name: string; description: string | null;
  category: string; baseRatePerDay: number; isActive: boolean;
}
interface Market {
  id: number; marketName: string; marketCode: string; state: string | null;
  country: string; priceMultiplier: number; acquisitionCost: number; isActive: boolean;
}
interface PricingRule {
  id: number; ruleName: string; ruleType: string; conditionKey: string;
  conditionValue: string; multiplier: number; description: string | null;
  isActive: boolean; priority: number;
}

export default function AdminPricingPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"sipp" | "markets" | "rules">("sipp");
  const [sippCodes, setSippCodes] = useState<SippCode[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<SippCode | Market | PricingRule | null>(null);

  // Form state
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pricing");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      if (data.success) {
        setSippCodes(data.sippCodes || []);
        setMarkets(data.markets || []);
        setRules(data.rules || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (type: string, action: string, data: Record<string, string | number | boolean>) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, type, data }),
      });
      const result = await res.json();
      if (result.success) {
        setMessage("Saved successfully.");
        setShowForm(false);
        setEditItem(null);
        fetchData();
      } else {
        setMessage(result.error || "Failed to save.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: SippCode | Market | PricingRule) => {
    setEditItem(item);
    setFormData(item as unknown as Record<string, string | number | boolean>);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditItem(null);
    if (tab === "sipp") setFormData({ code: "", name: "", description: "", category: "economy", baseRatePerDay: 50, isActive: true });
    if (tab === "markets") setFormData({ marketName: "", marketCode: "", state: "", country: "US", priceMultiplier: 1.0, acquisitionCost: 15.0, isActive: true });
    if (tab === "rules") setFormData({ ruleName: "", ruleType: "season", conditionKey: "month", conditionValue: "", multiplier: 1.0, description: "", isActive: true, priority: 10 });
    setShowForm(true);
  };

  const formatCurrency = (n: number) => `$${Number(n).toFixed(2)}`;
  const formatMultiplier = (n: number) => `${(Number(n) * 100).toFixed(0)}%`;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white text-sm">← Admin</Link>
            <h1 className="text-xl font-bold text-white">Pricing Management</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/bidding" className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1.5 rounded">
              Bidding
            </Link>
            <Link href="/admin/settlements" className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1.5 rounded">
              Settlements
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["sipp", "markets", "rules"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setShowForm(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${
                tab === t ? "bg-red-600 text-white" : "bg-gray-900 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {t === "sipp" ? "SIPP Codes" : t === "markets" ? "Markets" : "Pricing Rules"}
            </button>
          ))}
          <button
            onClick={startCreate}
            className="ml-auto bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            + Add {tab === "sipp" ? "SIPP Code" : tab === "markets" ? "Market" : "Rule"}
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-900/30 text-green-300 border border-green-700" : "bg-red-900/30 text-red-300 border border-red-700"}`}>
            {message}
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {/* SIPP Codes Table */}
        {!loading && tab === "sipp" && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  {["Code", "Name", "Category", "Base Rate/Day", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-gray-400 text-xs font-bold px-4 py-3 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sippCodes.map((s) => (
                  <tr key={s.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-mono font-bold text-white">{s.code}</td>
                    <td className="px-4 py-3 text-gray-300">{s.name}</td>
                    <td className="px-4 py-3 text-gray-400 capitalize">{s.category}</td>
                    <td className="px-4 py-3 text-green-400 font-bold">{formatCurrency(s.baseRatePerDay)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${s.isActive ? "bg-green-900/50 text-green-300" : "bg-gray-800 text-gray-500"}`}>
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => startEdit(s)} className="text-blue-400 hover:text-blue-300 text-sm mr-3">Edit</button>
                      <button onClick={() => handleSave("sipp", "delete", { id: s.id })} className="text-red-400 hover:text-red-300 text-sm">Deactivate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Markets Table */}
        {!loading && tab === "markets" && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  {["Market", "Code", "State", "Price Multiplier", "Acq. Cost", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-gray-400 text-xs font-bold px-4 py-3 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {markets.map((m) => (
                  <tr key={m.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-bold text-white">{m.marketName}</td>
                    <td className="px-4 py-3 font-mono text-gray-300">{m.marketCode}</td>
                    <td className="px-4 py-3 text-gray-400">{m.state || "—"}</td>
                    <td className="px-4 py-3 text-yellow-400 font-bold">{formatMultiplier(m.priceMultiplier)}</td>
                    <td className="px-4 py-3 text-green-400">{formatCurrency(m.acquisitionCost)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${m.isActive ? "bg-green-900/50 text-green-300" : "bg-gray-800 text-gray-500"}`}>
                        {m.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => startEdit(m)} className="text-blue-400 hover:text-blue-300 text-sm mr-3">Edit</button>
                      <button onClick={() => handleSave("market", "delete", { id: m.id })} className="text-red-400 hover:text-red-300 text-sm">Deactivate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pricing Rules Table */}
        {!loading && tab === "rules" && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  {["Rule Name", "Type", "Condition", "Value", "Multiplier", "Priority", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-gray-400 text-xs font-bold px-4 py-3 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-bold text-white">{r.ruleName}</td>
                    <td className="px-4 py-3 text-gray-400 capitalize">{r.ruleType}</td>
                    <td className="px-4 py-3 font-mono text-gray-300 text-sm">{r.conditionKey}</td>
                    <td className="px-4 py-3 font-mono text-gray-300 text-sm">{r.conditionValue}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${Number(r.multiplier) > 1 ? "text-red-400" : "text-green-400"}`}>
                        {Number(r.multiplier) > 1 ? "+" : ""}{((Number(r.multiplier) - 1) * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{r.priority}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${r.isActive ? "bg-green-900/50 text-green-300" : "bg-gray-800 text-gray-500"}`}>
                        {r.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => startEdit(r)} className="text-blue-400 hover:text-blue-300 text-sm mr-3">Edit</button>
                      <button onClick={() => handleSave("rule", "delete", { id: r.id })} className="text-red-400 hover:text-red-300 text-sm">Deactivate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit/Create Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4">
                {editItem ? "Edit" : "Create"} {tab === "sipp" ? "SIPP Code" : tab === "markets" ? "Market" : "Pricing Rule"}
              </h3>

              <div className="space-y-3">
                {Object.entries(formData).filter(([k]) => k !== "id" && k !== "createdAt" && k !== "updatedAt").map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-gray-400 text-xs mb-1 capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                    {typeof value === "boolean" ? (
                      <select
                        value={String(value)}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value === "true" }))}
                        className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    ) : (
                      <input
                        type={typeof value === "number" ? "number" : "text"}
                        value={String(value)}
                        onChange={(e) => setFormData((prev) => ({
                          ...prev,
                          [key]: typeof value === "number" ? parseFloat(e.target.value) || 0 : e.target.value,
                        }))}
                        step={typeof value === "number" ? "0.0001" : undefined}
                        className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleSave(tab === "sipp" ? "sipp" : tab === "markets" ? "market" : "rule", editItem ? "update" : "create", formData)}
                  disabled={saving}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold py-2 rounded-lg transition-colors"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => { setShowForm(false); setEditItem(null); }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

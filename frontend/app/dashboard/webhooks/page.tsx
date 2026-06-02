"use client";

import React, { useState } from "react";
import {
  Webhook,
  Plus,
  Trash2,
  Play,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";

type WebhookStatus = "ACTIVE" | "DISABLED";
type DeliveryStatus = "SUCCESS" | "FAILED" | "PENDING";

interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  status: WebhookStatus;
  secret: string;
  description: string | null;
  createdAt: string;
}

interface DeliveryLog {
  id: string;
  eventName: string;
  status: DeliveryStatus;
  attempts: number;
  responseStatus: number | null;
  createdAt: string;
}

const MOCK_WEBHOOKS: WebhookSubscription[] = [
  {
    id: "wh-1",
    url: "https://myapp.example.com/webhooks",
    events: ["savings.deposit", "savings.withdrawal"],
    status: "ACTIVE",
    secret: "sk_test_a8f3b2c1d4e5f6a7b8c9d0",
    description: "Production deposit handler",
    createdAt: "2026-05-20T10:00:00Z",
  },
  {
    id: "wh-2",
    url: "https://staging.example.com/hooks",
    events: ["goal.completed"],
    status: "DISABLED",
    secret: "sk_test_b9g4c3d2e5f6a7b8c9d0e1",
    description: "Staging goal events",
    createdAt: "2026-05-22T14:00:00Z",
  },
];

const MOCK_DELIVERIES: Record<string, DeliveryLog[]> = {
  "wh-1": [
    { id: "d1", eventName: "savings.deposit", status: "SUCCESS", attempts: 1, responseStatus: 200, createdAt: "2026-06-02T02:55:00Z" },
    { id: "d2", eventName: "savings.withdrawal", status: "FAILED", attempts: 5, responseStatus: 503, createdAt: "2026-06-02T01:30:00Z" },
    { id: "d3", eventName: "savings.deposit", status: "PENDING", attempts: 2, responseStatus: null, createdAt: "2026-06-02T00:10:00Z" },
  ],
  "wh-2": [],
};

const ALL_EVENTS = ["savings.deposit", "savings.withdrawal", "savings.goal_completed", "savings.interest_accrued", "user.kyc_approved", "*"];

function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  const map: Record<DeliveryStatus, { icon: React.ElementType; cls: string }> = {
    SUCCESS: { icon: CheckCircle2, cls: "text-emerald-400 bg-emerald-400/10" },
    FAILED:  { icon: XCircle,      cls: "text-red-400 bg-red-400/10" },
    PENDING: { icon: Clock,        cls: "text-amber-400 bg-amber-400/10" },
  };
  const { icon: Icon, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      <Icon size={11} />{status}
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { void navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-[#4a7080] hover:text-cyan-300 transition-colors ml-1">
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

function CreateModal({ onClose, onCreate }: { onClose: () => void; onCreate: (s: WebhookSubscription) => void }) {
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [events, setEvents] = useState<string[]>([]);

  const toggle = (e: string) => setEvents(p => p.includes(e) ? p.filter(x => x !== e) : [...p, e]);

  const submit = () => {
    if (!url || events.length === 0) return;
    onCreate({ id: `wh-${Date.now()}`, url, events, status: "ACTIVE", secret: `sk_test_${Math.random().toString(36).slice(2)}`, description: desc || null, createdAt: new Date().toISOString() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 rounded-2xl border border-[rgba(8,120,120,0.2)] bg-[#060c10] p-6">
        <h2 className="text-lg font-bold text-white mb-5">Register Webhook</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-[#5e8c96] mb-1 block">Endpoint URL *</label>
            <input className="w-full rounded-xl bg-white/5 border border-white/10 text-white text-sm px-3 py-2 outline-none focus:border-cyan-500/50"
              placeholder="https://your-service.com/webhooks" value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[#5e8c96] mb-1 block">Description</label>
            <input className="w-full rounded-xl bg-white/5 border border-white/10 text-white text-sm px-3 py-2 outline-none focus:border-cyan-500/50"
              placeholder="Optional" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[#5e8c96] mb-2 block">Events *</label>
            <div className="flex flex-wrap gap-2">
              {ALL_EVENTS.map(ev => (
                <button key={ev} onClick={() => toggle(ev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${events.includes(ev) ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300" : "bg-white/5 border border-white/10 text-[#6e9aaa] hover:border-white/20"}`}>
                  {ev}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="outline" size="sm" onClick={submit} disabled={!url || events.length === 0}
            className="border-cyan-500/30 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25">
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}

function WebhookCard({ wh, onToggle, onDelete, onTest }: {
  wh: WebhookSubscription;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTest: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const deliveries = MOCK_DELIVERIES[wh.id] ?? [];
  const active = wh.status === "ACTIVE";

  return (
    <div className="rounded-2xl border border-[rgba(8,120,120,0.12)] bg-gradient-to-b from-[rgba(6,18,20,0.55)] to-[rgba(4,12,14,0.45)] overflow-hidden">
      <div className="flex items-start gap-4 p-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-cyan-400/10 text-cyan-400" : "bg-white/5 text-[#4a7080]"}`}>
          <Webhook size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white truncate">{wh.url}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${active ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-[#4a7080]"}`}>{wh.status}</span>
          </div>
          {wh.description && <p className="text-xs text-[#5e8c96] mt-0.5 m-0">{wh.description}</p>}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {wh.events.map(ev => (
              <span key={ev} className="px-2 py-0.5 rounded-md bg-white/5 text-xs font-mono text-[#6e9aaa] border border-white/5">{ev}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onTest(wh.id)} className="text-[#6e9aaa] hover:text-cyan-300" title="Test"><Play size={13} /></Button>
          <Button variant="ghost" size="sm" onClick={() => onToggle(wh.id)} className="text-[#6e9aaa] hover:text-cyan-300" title={active ? "Disable" : "Enable"}>
            {active ? <PauseCircle size={13} /> : <PlayCircle size={13} />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(wh.id)} className="text-[#6e9aaa] hover:text-red-400" title="Delete"><Trash2 size={13} /></Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(p => !p)} className="text-[#6e9aaa] hover:text-white">
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 px-4 pb-4 pt-3">
          <div className="mb-3 text-xs">
            <span className="text-[#4a7080]">Secret: </span>
            <span className="font-mono text-[#7aacb5]">{wh.secret.slice(0, 18)}…</span>
            <CopyBtn text={wh.secret} />
          </div>
          <p className="text-xs font-semibold text-[#5e8c96] uppercase tracking-wider mb-2">Recent Deliveries</p>
          {deliveries.length === 0
            ? <p className="text-xs text-[#4a7080]">No deliveries yet.</p>
            : deliveries.map(d => (
              <div key={d.id} className="flex items-center gap-3 text-xs py-1">
                <DeliveryStatusBadge status={d.status} />
                <span className="font-mono text-[#7aacb5]">{d.eventName}</span>
                {d.responseStatus && <span className="text-[#4a7080]">HTTP {d.responseStatus}</span>}
                <span className="text-[#4a7080]">×{d.attempts}</span>
                <span className="ml-auto text-[#4a7080]">{new Date(d.createdAt).toLocaleTimeString()}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>(MOCK_WEBHOOKS);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  const handleCreate = (s: WebhookSubscription) => { setWebhooks(p => [s, ...p]); notify("Webhook registered."); };
  const handleToggle = (id: string) => setWebhooks(p => p.map(w => w.id === id ? { ...w, status: w.status === "ACTIVE" ? "DISABLED" : "ACTIVE" } : w));
  const handleDelete = (id: string) => { setWebhooks(p => p.filter(w => w.id !== id)); notify("Webhook deleted."); };
  const handleTest   = (id: string) => notify(`Test event sent to …${id.slice(-4)}. Check delivery logs.`);

  const active = webhooks.filter(w => w.status === "ACTIVE").length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#063d3d] to-[#0a6f6f] flex items-center justify-center text-[#5de0e0]">
            <Webhook size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white m-0">Webhooks</h1>
            <p className="text-[#5e8c96] text-sm m-0">{active} active · {webhooks.length} total</p>
          </div>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowCreate(true)}
          className="border-cyan-500/30 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25">
          Register Webhook
        </Button>
      </div>

      {toast && (
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">{toast}</div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Active",           value: active,                                            color: "text-emerald-400" },
          { label: "Total",            value: webhooks.length,                                   color: "text-cyan-400" },
          { label: "Deliveries today", value: Object.values(MOCK_DELIVERIES).flat().length,      color: "text-violet-400" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-white/5 bg-white/2 p-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[#5e8c96] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {webhooks.length === 0 ? (
        <div className="text-center py-16 text-[#5e8c96]">
          <Webhook size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No webhooks registered yet.</p>
          <Button variant="outline" size="sm" className="mt-4 border-cyan-500/30 bg-cyan-500/15 text-cyan-300" onClick={() => setShowCreate(true)}>
            Register your first webhook
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {webhooks.map(wh => (
            <WebhookCard key={wh.id} wh={wh} onToggle={handleToggle} onDelete={handleDelete} onTest={handleTest} />
          ))}
        </div>
      )}

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}

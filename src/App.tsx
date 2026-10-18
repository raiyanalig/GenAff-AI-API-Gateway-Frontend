import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Zap,
  Shield,
  KeyRound,
  Cpu,
  TerminalSquare,
  BookOpen,
  BarChart3,
  ScrollText,
  Wallet,
  ReceiptText,
  Tag,
  User,
  Settings,
  LifeBuoy,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Plus,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Sun,
  Moon,
  LogOut,
  Lock,
  Mail,
  FileDown,
  Server,
  Activity,
  Code2,
  Play,
  Eye,
  EyeOff,
  Info,
  ExternalLink,
  HelpCircle,
  Sliders,
  Sparkles,
  Globe,
  Layers,
  CreditCard,
  X,
  Menu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// ============================================================================
// 1. CONFIGURATION & AUTHORITATIVE MODEL CATALOG (from src/utils/pricing.js)
// ============================================================================

const DEFAULT_API_BASE_URL = 'https://api.raiyanali.tech';
const USD_TO_INR = 86;
const MIN_TOPUP_INR = 10;

export type ProviderId = 'openai' | 'deepseek' | 'gemini' | 'nvidia';

export interface CatalogModel {
  id: string;
  provider: ProviderId;
  providerName: string;
  displayName: string;
  promptUsdPer1k: number;
  completionUsdPer1k: number;
  promptInrPer1k: number;
  completionInrPer1k: number;
  contextWindow: number;
  maxOutputTokens: number;
  capabilities: string[];
  description: string;
  defaultStatus: 'healthy' | 'degraded' | 'unknown';
}

const AUTHORITATIVE_MODEL_CATALOG: CatalogModel[] = [
  {
    id: 'openai/gpt-4o',
    provider: 'openai',
    providerName: 'OpenAI',
    displayName: 'GPT-4o',
    promptUsdPer1k: 0.0025,
    completionUsdPer1k: 0.01,
    promptInrPer1k: +(0.0025 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.01 * USD_TO_INR).toFixed(4),
    contextWindow: 128000,
    maxOutputTokens: 16384,
    capabilities: ['Chat Completions', 'System Prompts', 'Temperature Control', 'Code Synthesis'],
    description: 'Flagship high-intelligence OpenAI model routed through GenAff unified chat completions gateway.',
    defaultStatus: 'healthy',
  },
  {
    id: 'openai/gpt-4o-mini',
    provider: 'openai',
    providerName: 'OpenAI',
    displayName: 'GPT-4o Mini',
    promptUsdPer1k: 0.00015,
    completionUsdPer1k: 0.0006,
    promptInrPer1k: +(0.00015 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.0006 * USD_TO_INR).toFixed(4),
    contextWindow: 128000,
    maxOutputTokens: 16384,
    capabilities: ['Chat Completions', 'System Prompts', 'Low Latency', 'Cost-Efficient'],
    description: 'Fast, low-cost OpenAI model built for high-frequency production chat and structured extraction.',
    defaultStatus: 'healthy',
  },
  {
    id: 'openai/o1-mini',
    provider: 'openai',
    providerName: 'OpenAI',
    displayName: 'OpenAI o1-mini',
    promptUsdPer1k: 0.003,
    completionUsdPer1k: 0.012,
    promptInrPer1k: +(0.003 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.012 * USD_TO_INR).toFixed(4),
    contextWindow: 128000,
    maxOutputTokens: 65536,
    capabilities: ['Chat Completions', 'STEM & Coding Reasoning'],
    description: 'Specialized reasoning model optimized for algorithmic coding, debugging, and quantitative analysis.',
    defaultStatus: 'healthy',
  },
  {
    id: 'openai/o1-preview',
    provider: 'openai',
    providerName: 'OpenAI',
    displayName: 'OpenAI o1-preview',
    promptUsdPer1k: 0.015,
    completionUsdPer1k: 0.06,
    promptInrPer1k: +(0.015 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.06 * USD_TO_INR).toFixed(4),
    contextWindow: 128000,
    maxOutputTokens: 32768,
    capabilities: ['Chat Completions', 'Deep Multi-Step Reasoning'],
    description: 'Frontier reasoning model for complex systems architecture and scientific problem solving.',
    defaultStatus: 'healthy',
  },
  {
    id: 'deepseek/deepseek-chat',
    provider: 'deepseek',
    providerName: 'DeepSeek',
    displayName: 'DeepSeek Chat (V3)',
    promptUsdPer1k: 0.00014,
    completionUsdPer1k: 0.00028,
    promptInrPer1k: +(0.00014 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.00028 * USD_TO_INR).toFixed(4),
    contextWindow: 64000,
    maxOutputTokens: 8192,
    capabilities: ['Chat Completions', 'System Prompts', 'Code & Text Generation', 'Ultra-Low Cost'],
    description: 'High-efficiency general-purpose and coding model with industry-leading token economics.',
    defaultStatus: 'healthy',
  },
  {
    id: 'deepseek/deepseek-reasoner',
    provider: 'deepseek',
    providerName: 'DeepSeek',
    displayName: 'DeepSeek Reasoner (R1)',
    promptUsdPer1k: 0.00055,
    completionUsdPer1k: 0.00219,
    promptInrPer1k: +(0.00055 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.00219 * USD_TO_INR).toFixed(4),
    contextWindow: 64000,
    maxOutputTokens: 8192,
    capabilities: ['Chat Completions', 'Chain-of-Thought Reasoning', 'Math & Verification'],
    description: 'DeepSeek R1 reasoning model for multi-step deduction, formal verification, and code synthesis.',
    defaultStatus: 'healthy',
  },
  {
    id: 'gemini/gemini-1.5-flash',
    provider: 'gemini',
    providerName: 'Google Gemini',
    displayName: 'Gemini 1.5 Flash',
    promptUsdPer1k: 0.000075,
    completionUsdPer1k: 0.0003,
    promptInrPer1k: +(0.000075 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.0003 * USD_TO_INR).toFixed(4),
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    capabilities: ['Chat Completions', 'System Prompts', '1M Token Context', 'High Throughput'],
    description: 'Ultra-low-cost, high-speed Google Gemini model featuring a 1,000,000-token context window.',
    defaultStatus: 'healthy',
  },
  {
    id: 'gemini/gemini-1.5-pro',
    provider: 'gemini',
    providerName: 'Google Gemini',
    displayName: 'Gemini 1.5 Pro',
    promptUsdPer1k: 0.00125,
    completionUsdPer1k: 0.005,
    promptInrPer1k: +(0.00125 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.005 * USD_TO_INR).toFixed(4),
    contextWindow: 2000000,
    maxOutputTokens: 8192,
    capabilities: ['Chat Completions', 'System Prompts', '2M Token Context', 'Deep Synthesis'],
    description: 'Reasoning-grade Google Gemini model supporting up to 2,000,000 context tokens.',
    defaultStatus: 'healthy',
  },
  {
    id: 'gemini/gemini-2.0-flash-exp',
    provider: 'gemini',
    providerName: 'Google Gemini',
    displayName: 'Gemini 2.0 Flash Exp',
    promptUsdPer1k: 0.0001,
    completionUsdPer1k: 0.0004,
    promptInrPer1k: +(0.0001 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.0004 * USD_TO_INR).toFixed(4),
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    capabilities: ['Chat Completions', 'System Prompts', 'Next-Gen Low Latency'],
    description: 'Next-generation low-latency Gemini 2.0 Flash model configured in the GenAff pricing map.',
    defaultStatus: 'healthy',
  },
  {
    id: 'nvidia/meta/llama-3.1-405b-instruct',
    provider: 'nvidia',
    providerName: 'NVIDIA NIM',
    displayName: 'Llama 3.1 405B Instruct',
    promptUsdPer1k: 0.003,
    completionUsdPer1k: 0.003,
    promptInrPer1k: +(0.003 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.003 * USD_TO_INR).toFixed(4),
    contextWindow: 128000,
    maxOutputTokens: 4096,
    capabilities: ['Chat Completions', 'System Prompts', 'Frontier Open-Weights'],
    description: 'Meta Llama 3.1 405B flagship open-weights model served via NVIDIA NIM infrastructure.',
    defaultStatus: 'healthy',
  },
  {
    id: 'nvidia/meta/llama-3.1-70b-instruct',
    provider: 'nvidia',
    providerName: 'NVIDIA NIM',
    displayName: 'Llama 3.1 70B Instruct',
    promptUsdPer1k: 0.0007,
    completionUsdPer1k: 0.0007,
    promptInrPer1k: +(0.0007 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.0007 * USD_TO_INR).toFixed(4),
    contextWindow: 128000,
    maxOutputTokens: 4096,
    capabilities: ['Chat Completions', 'System Prompts', 'Enterprise Open-Weights'],
    description: 'Balanced 70B parameter instruction-tuned model hosted on NVIDIA NIM.',
    defaultStatus: 'healthy',
  },
  {
    id: 'nvidia/meta/llama-3.1-8b-instruct',
    provider: 'nvidia',
    providerName: 'NVIDIA NIM',
    displayName: 'Llama 3.1 8B Instruct',
    promptUsdPer1k: 0.0002,
    completionUsdPer1k: 0.0002,
    promptInrPer1k: +(0.0002 * USD_TO_INR).toFixed(4),
    completionInrPer1k: +(0.0002 * USD_TO_INR).toFixed(4),
    contextWindow: 128000,
    maxOutputTokens: 4096,
    capabilities: ['Chat Completions', 'System Prompts', 'High-Speed Inference'],
    description: 'Compact 8B parameter Llama 3.1 model for ultra-fast chat and text processing.',
    defaultStatus: 'healthy',
  },
];

function calculateCostInr(modelId: string, promptTokens: number, completionTokens: number): number {
  const model = AUTHORITATIVE_MODEL_CATALOG.find((m) => m.id === modelId);
  if (!model) {
    return (((promptTokens / 1000) * 0.001 + (completionTokens / 1000) * 0.002) * USD_TO_INR);
  }
  return (
    ((promptTokens / 1000) * model.promptUsdPer1k +
      (completionTokens / 1000) * model.completionUsdPer1k) *
    USD_TO_INR
  );
}

// ============================================================================
// 2. TYPES & FORMATTERS
// ============================================================================

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  is_verified: boolean;
  role?: 'USER' | 'ADMIN';
  status?: 'ACTIVE' | 'SUSPENDED';
  created_at: string;
}

interface ApiKeyRecord {
  id: string;
  key_prefix: string;
  name: string | null;
  created_at: string;
  last_used_at: string | null;
  revoked_at?: string | null;
}

interface TopUpRecord {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount_inr: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  created_at: string;
}

interface UsageRecord {
  id: string;
  provider: string;
  model: string;
  prompt_tokens?: number;
  completion_tokens?: number;
  tokens_used: number;
  cost_inr: number;
  created_at: string;
  api_key?: {
    key_prefix: string;
    name: string | null;
  } | null;
}

interface ToastMessage {
  id: string;
  tone: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  description?: string;
}

type PublicView =
  | 'home'
  | 'features'
  | 'models'
  | 'pricing'
  | 'docs'
  | 'signin'
  | 'signup'
  | 'privacy'
  | 'terms'
  | 'refund'
  | 'contact';

type DashboardView =
  | 'overview'
  | 'api-keys'
  | 'models'
  | 'playground'
  | 'docs'
  | 'analytics'
  | 'logs'
  | 'wallet'
  | 'transactions'
  | 'pricing'
  | 'profile'
  | 'settings'
  | 'support';

const inrStdFmt = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inrMicroFmt = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const numFmt = new Intl.NumberFormat('en-IN');

function formatInr(amount: number, micro = false): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return micro ? inrMicroFmt.format(safe) : inrStdFmt.format(safe);
}

function formatNumber(val: number): string {
  return numFmt.format(Number.isFinite(val) ? val : 0);
}

function formatDateTime(iso?: string | null): string {
  if (!iso) return 'Never';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

function copyTextToClipboard(text: string): boolean {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      void navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback below
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// 3. RAZORPAY CHECKOUT LOADER
// ============================================================================

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    const win = window as unknown as { Razorpay?: unknown };
    if (win.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(win.Razorpay)));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(Boolean(win.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ============================================================================
// 4. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // --- Theme state ---
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return window.localStorage.getItem('genaff_theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('genaff_theme', theme);
    } catch {
      // ignore storage restriction
    }
  }, [theme]);

  const isDark = theme === 'dark';

  // --- API & Environment Configuration ---
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(DEFAULT_API_BASE_URL);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>('');
  const [sandboxFallbackMode, setSandboxFallbackMode] = useState<boolean>(false);
  const [configModalOpen, setConfigModalOpen] = useState<boolean>(false);
  const [gatewayHealth, setGatewayHealth] = useState<'checking' | 'online' | 'unreachable'>('checking');

  // --- Navigation State ---
  const [mode, setMode] = useState<'public' | 'dashboard'>('public');
  const [publicView, setPublicView] = useState<PublicView>('home');
  const [dashboardView, setDashboardView] = useState<DashboardView>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // --- Toast Notifications ---
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const pushToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  // --- Authentication & Session State (in-memory + sessionStorage) ---
  const [jwtToken, setJwtToken] = useState<string | null>(() => {
    try {
      return window.sessionStorage.getItem('genaff_jwt');
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const raw = window.sessionStorage.getItem('genaff_user');
      return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
      return null;
    }
  });

  const saveSession = useCallback((token: string, profile: UserProfile) => {
    setJwtToken(token);
    setUser(profile);
    try {
      window.sessionStorage.setItem('genaff_jwt', token);
      window.sessionStorage.setItem('genaff_user', JSON.stringify(profile));
    } catch {
      // in-memory fallback
    }
  }, []);

  const clearSession = useCallback(() => {
    setJwtToken(null);
    setUser(null);
    try {
      window.sessionStorage.removeItem('genaff_jwt');
      window.sessionStorage.removeItem('genaff_user');
    } catch {
      // ignore
    }
  }, []);

  // --- Live Backend Data State (Never pre-populated with fake analytics) ---
  const [walletBalanceInr, setWalletBalanceInr] = useState<number>(0);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [topUpHistory, setTopUpHistory] = useState<TopUpRecord[]>([]);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [liveModelStatus, setLiveModelStatus] = useState<Record<string, string>>({});
  const [pendingOrder, setPendingOrder] = useState<TopUpRecord | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  // --- Check Gateway /health ---
  const checkBackendHealth = useCallback(async () => {
    if (sandboxFallbackMode) {
      setGatewayHealth('online');
      return;
    }
    try {
      setGatewayHealth('checking');
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 6000);
      const healthEndpoint = `${apiBaseUrl}/health`;
      const res = await fetch(healthEndpoint, { signal: controller.signal });
      clearTimeout(t);
      setGatewayHealth(res.ok ? 'online' : 'unreachable');
    } catch {
      setGatewayHealth('unreachable');
    }
  }, [apiBaseUrl, sandboxFallbackMode]);

  useEffect(() => {
    void checkBackendHealth();
  }, [checkBackendHealth]);

  // --- Centralized API Request Helper ---
  const apiCall = useCallback(
    async <T,>(
      path: string,
      options: {
        method?: string;
        body?: unknown;
        auth?: 'jwt' | 'apiKey' | 'none';
        apiKey?: string;
      } = {}
    ): Promise<T> => {
      const { method = 'GET', body, auth = 'jwt', apiKey } = options;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (auth === 'jwt') {
        if (!jwtToken) {
          throw new Error('Unauthorized: Please sign in to access this resource.');
        }
        headers.Authorization = `Bearer ${jwtToken}`;
      } else if (auth === 'apiKey') {
        if (!apiKey) {
          throw new Error('Unauthorized: Missing GenAff API key (genaff_sk_...).');
        }
        headers.Authorization = `Bearer ${apiKey.trim()}`;
      }

      const endpointUrl = `${apiBaseUrl}${path}`;
      const res = await fetch(endpointUrl, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (res.status === 401 && auth === 'jwt') {
        clearSession();
        setMode('public');
        setPublicView('signin');
      }

      const contentType = res.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        const msg =
          typeof payload === 'object' && payload !== null
            ? String(
                (payload as Record<string, unknown>).error ||
                  (payload as Record<string, unknown>).message ||
                  `HTTP ${res.status}`
              )
            : `Request failed (${res.status})`;
        throw new Error(msg);
      }
      return payload as T;
    },
    [apiBaseUrl, jwtToken, clearSession]
  );

  // --- Load Authenticated Dashboard Data ---
  const refreshDashboardData = useCallback(async () => {
    if (!jwtToken || sandboxFallbackMode) return;
    try {
      setDataLoading(true);
      const [meRes, keysRes, walletRes, historyRes, usageRes] = await Promise.allSettled([
        apiCall<Record<string, unknown>>('/auth/me'),
        apiCall<{ keys?: Array<Record<string, unknown>> }>('/keys'),
        apiCall<Record<string, unknown>>('/wallet'),
        apiCall<Record<string, unknown>>('/wallet/history?page=1&limit=50'),
        apiCall<Record<string, unknown>>('/wallet/usage?page=1&limit=100'),
      ]);

      if (meRes.status === 'fulfilled' && meRes.value) {
        const raw = meRes.value;
        const u = (raw.user || raw) as Record<string, unknown>;
        const w = (raw.wallet || {}) as Record<string, unknown>;
        setUser({
          id: String(u.id || ''),
          email: String(u.email || ''),
          name: u.name ? String(u.name) : null,
          is_verified: Boolean(u.is_verified ?? u.isEmailVerified ?? true),
          role: (u.role as 'USER' | 'ADMIN') || 'USER',
          status: (u.status as 'ACTIVE' | 'SUSPENDED') || 'ACTIVE',
          created_at: String(u.created_at || u.createdAt || new Date().toISOString()),
        });
        if (w.balance_inr !== undefined || w.balance !== undefined) {
          setWalletBalanceInr(Number(w.balance_inr ?? w.balance ?? 0));
        }
      }

      if (walletRes.status === 'fulfilled' && walletRes.value) {
        const wObj = (walletRes.value.wallet || walletRes.value) as Record<string, unknown>;
        setWalletBalanceInr(Number(wObj.balance_inr ?? wObj.balance ?? 0));
      }

      if (keysRes.status === 'fulfilled' && keysRes.value) {
        const list = Array.isArray(keysRes.value.keys) ? keysRes.value.keys : [];
        setApiKeys(
          list.map((k) => ({
            id: String(k.id || ''),
            key_prefix: String(k.key_prefix || k.keyPrefix || 'genaff_sk_...'),
            name: k.name ? String(k.name) : null,
            created_at: String(k.created_at || k.createdAt || new Date().toISOString()),
            last_used_at:
              k.last_used_at || k.lastUsedAt ? String(k.last_used_at || k.lastUsedAt) : null,
            revoked_at: k.revoked_at || k.revokedAt ? String(k.revoked_at || k.revokedAt) : null,
          }))
        );
      }

      if (historyRes.status === 'fulfilled' && historyRes.value) {
        const rawList = (historyRes.value.records ||
          historyRes.value.topups ||
          historyRes.value.history ||
          []) as Array<Record<string, unknown>>;
        setTopUpHistory(
          rawList.map((r) => ({
            id: String(r.id || ''),
            razorpay_order_id: String(r.razorpay_order_id || r.razorpayOrderId || ''),
            razorpay_payment_id:
              r.razorpay_payment_id || r.razorpayPaymentId
                ? String(r.razorpay_payment_id || r.razorpayPaymentId)
                : null,
            amount_inr: Number(r.amount_inr ?? r.amountINR ?? r.amount ?? 0),
            status: String(r.status || 'PENDING').toUpperCase() as TopUpRecord['status'],
            created_at: String(r.created_at || r.createdAt || new Date().toISOString()),
          }))
        );
      }

      if (usageRes.status === 'fulfilled' && usageRes.value) {
        const rawList = (usageRes.value.records ||
          usageRes.value.usages ||
          usageRes.value.usage ||
          []) as Array<Record<string, unknown>>;
        setUsageRecords(
          rawList.map((u) => {
            const ak = (u.api_key || u.apiKey) as Record<string, unknown> | undefined;
            return {
              id: String(u.id || ''),
              provider: String(u.provider || 'openai'),
              model: String(u.model || 'openai/gpt-4o-mini'),
              prompt_tokens:
                u.prompt_tokens !== undefined ? Number(u.prompt_tokens) : undefined,
              completion_tokens:
                u.completion_tokens !== undefined ? Number(u.completion_tokens) : undefined,
              tokens_used: Number(u.tokens_used ?? u.totalTokens ?? 0),
              cost_inr: Number(u.cost_inr ?? u.costINR ?? 0),
              created_at: String(u.created_at || u.createdAt || new Date().toISOString()),
              api_key: ak
                ? {
                    key_prefix: String(ak.key_prefix || ak.keyPrefix || ''),
                    name: ak.name ? String(ak.name) : null,
                  }
                : null,
            };
          })
        );
      }
    } finally {
      setDataLoading(false);
    }
  }, [jwtToken, sandboxFallbackMode, apiCall]);

  useEffect(() => {
    if (jwtToken && !sandboxFallbackMode) {
      void refreshDashboardData();
    }
  }, [jwtToken, sandboxFallbackMode, refreshDashboardData]);

  // --- Load Public Live Models ---
  const syncLiveModels = useCallback(async () => {
    if (sandboxFallbackMode) return;
    try {
      const res = await apiCall<{
        data?: Array<{ id: string; health?: string }>;
      }>('/v1/models', { auth: 'none' });
      const map: Record<string, string> = {};
      (res.data || []).forEach((m) => {
        map[m.id] = m.health || 'healthy';
      });
      setLiveModelStatus(map);
    } catch {
      // Keep static fallback statuses when unreachable
    }
  }, [apiCall, sandboxFallbackMode]);

  useEffect(() => {
    void syncLiveModels();
  }, [syncLiveModels]);

  // --- Auth Form States ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');

  // --- API Keys States ---
  const [newKeyName, setNewKeyName] = useState('');
  const [creatingKey, setCreatingKey] = useState(false);
  const [createdPlaintextKey, setCreatedPlaintextKey] = useState<string | null>(null);
  const [revokeKeyModal, setRevokeKeyModal] = useState<ApiKeyRecord | null>(null);

  // --- Models Explorer States ---
  const [modelSearch, setModelSearch] = useState('');
  const [modelProviderFilter, setModelProviderFilter] = useState<string>('all');
  const [selectedModelDetail, setSelectedModelDetail] = useState<CatalogModel>(
    AUTHORITATIVE_MODEL_CATALOG[0]
  );

  // --- Playground States ---
  const [pgModel, setPgModel] = useState<string>('openai/gpt-4o-mini');
  const [pgApiKey, setPgApiKey] = useState<string>('');
  const [pgSystemPrompt, setPgSystemPrompt] = useState<string>(
    'You are a concise, senior systems architect.'
  );
  const [pgUserPrompt, setPgUserPrompt] = useState<string>(
    'Summarize how a unified AI API gateway meters token usage and deducts prepaid INR wallet balances.'
  );
  const [pgTemp, setPgTemp] = useState<number>(0.7);
  const [pgMaxTokens, setPgMaxTokens] = useState<number>(512);
  const [pgSending, setPgSending] = useState<boolean>(false);
  const [pgResponse, setPgResponse] = useState<string | null>(null);
  const [pgError, setPgError] = useState<string | null>(null);
  const [pgLatencyMs, setPgLatencyMs] = useState<number | null>(null);
  const [pgUsage, setPgUsage] = useState<{
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost_inr: number;
  } | null>(null);
  const [pgCodeTab, setPgCodeTab] = useState<'curl' | 'js' | 'python'>('curl');

  // --- Analytics & Logs Filter States ---
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [analyticsProviderFilter, setAnalyticsProviderFilter] = useState<string>('all');
  const [analyticsModelFilter, setAnalyticsModelFilter] = useState<string>('all');
  const [analyticsKeyFilter, setAnalyticsKeyFilter] = useState<string>('all');
  const [selectedLogDrawer, setSelectedLogDrawer] = useState<UsageRecord | null>(null);
  const [logsPage, setLogsPage] = useState<number>(1);

  // --- Wallet & Transactions States ---
  const [topUpAmountInput, setTopUpAmountInput] = useState<string>('250');
  const [topUpProcessing, setTopUpProcessing] = useState<boolean>(false);
  const [walletStatusBanner, setWalletStatusBanner] = useState<{
    tone: 'success' | 'warning' | 'danger' | 'info';
    text: string;
  } | null>(null);
  const [txTypeFilter, setTxTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [txStatusFilter, setTxStatusFilter] = useState<string>('all');
  const [selectedTxModal, setSelectedTxModal] = useState<{
    id: string;
    type: 'TOPUP_CREDIT' | 'USAGE_DEBIT';
    reference: string;
    amount_inr: number;
    status: string;
    created_at: string;
    details: string;
  } | null>(null);

  // --- Pricing Estimator State ---
  const [calcModelId, setCalcModelId] = useState<string>('openai/gpt-4o-mini');
  const [calcInputTokens, setCalcInputTokens] = useState<number>(50000);
  const [calcOutputTokens, setCalcOutputTokens] = useState<number>(20000);

  // --- Protected Dashboard Navigation Helper ---
  const openDashboardView = (target: DashboardView = 'overview') => {
    if (!jwtToken) {
      setMode('public');
      setPublicView('signin');
      pushToast({
        tone: 'info',
        title: 'Sign in required',
        description: 'Authenticate with your GenAff account to access the developer dashboard.',
      });
      return;
    }
    setMode('dashboard');
    setDashboardView(target);
  };

  // --- Handlers: Auth ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authSubmitting) return;
    if (!loginEmail.includes('@') || loginPassword.length < 6) {
      pushToast({
        tone: 'danger',
        title: 'Validation Error',
        description: 'Enter a valid email address and password (minimum 6 characters).',
      });
      return;
    }

    try {
      setAuthSubmitting(true);
      if (sandboxFallbackMode) {
        const fakeProfile: UserProfile = {
          id: 'usr_sandbox_01',
          email: loginEmail.trim(),
          name: loginEmail.split('@')[0],
          is_verified: true,
          role: 'USER',
          status: 'ACTIVE',
          created_at: new Date().toISOString(),
        };
        saveSession('sandbox.jwt.token', fakeProfile);
        setMode('dashboard');
        setDashboardView('overview');
        pushToast({
          tone: 'success',
          title: 'Signed in (Sandbox Mode)',
          description: `Authenticated as ${fakeProfile.email}`,
        });
        return;
      }

      const res = await apiCall<Record<string, unknown>>('/auth/login', {
        method: 'POST',
        auth: 'none',
        body: { email: loginEmail.trim(), password: loginPassword },
      });

      const token = String(res.token || '');
      const u = (res.user || {}) as Record<string, unknown>;
      const profile: UserProfile = {
        id: String(u.id || ''),
        email: String(u.email || loginEmail.trim()),
        name: u.name ? String(u.name) : null,
        is_verified: Boolean(u.is_verified ?? u.isEmailVerified ?? true),
        role: (u.role as 'USER' | 'ADMIN') || 'USER',
        status: (u.status as 'ACTIVE' | 'SUSPENDED') || 'ACTIVE',
        created_at: String(u.created_at || new Date().toISOString()),
      };
      saveSession(token, profile);
      setMode('dashboard');
      setDashboardView('overview');
      pushToast({
        tone: 'success',
        title: 'Welcome back',
        description: `Signed in as ${profile.email}`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      pushToast({ tone: 'danger', title: 'Sign In Failed', description: msg });
      if (msg.toLowerCase().includes('verif')) {
        setOtpEmail(loginEmail.trim());
        setShowOtpModal(true);
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authSubmitting) return;
    if (!regEmail.includes('@') || regPassword.length < 8) {
      pushToast({
        tone: 'danger',
        title: 'Validation Error',
        description: 'Password must be at least 8 characters and include a valid email.',
      });
      return;
    }

    try {
      setAuthSubmitting(true);
      if (sandboxFallbackMode) {
        setOtpEmail(regEmail.trim());
        setShowOtpModal(true);
        pushToast({
          tone: 'success',
          title: 'Verification OTP Sent (Sandbox)',
          description: 'Enter any 6-digit code (e.g., 123456) to complete verification.',
        });
        return;
      }

      const res = await apiCall<{ message?: string }>('/auth/register', {
        method: 'POST',
        auth: 'none',
        body: {
          name: regName.trim() || undefined,
          email: regEmail.trim(),
          password: regPassword,
        },
      });
      setOtpEmail(regEmail.trim());
      setShowOtpModal(true);
      pushToast({
        tone: 'success',
        title: 'Account Created',
        description:
          res.message || 'Check your email for the 6-digit verification code (POST /auth/verify-otp).',
      });
    } catch (err) {
      pushToast({
        tone: 'danger',
        title: 'Registration Failed',
        description: err instanceof Error ? err.message : 'Could not register account',
      });
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otpCode.trim())) {
      pushToast({
        tone: 'danger',
        title: 'Invalid OTP Format',
        description: 'Enter the 6-digit numeric verification code.',
      });
      return;
    }
    try {
      setAuthSubmitting(true);
      if (!sandboxFallbackMode) {
        await apiCall('/auth/verify-otp', {
          method: 'POST',
          auth: 'none',
          body: { email: otpEmail.trim(), otp: otpCode.trim() },
        });
      }
      setShowOtpModal(false);
      setOtpCode('');
      setLoginEmail(otpEmail.trim());
      setPublicView('signin');
      pushToast({
        tone: 'success',
        title: 'Email Verified',
        description: 'Your email has been verified. You can now sign in.',
      });
    } catch (err) {
      pushToast({
        tone: 'danger',
        title: 'Verification Failed',
        description: err instanceof Error ? err.message : 'Invalid or expired OTP',
      });
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleResendVerification = async (targetEmail: string) => {
    if (!targetEmail) return;
    try {
      if (!sandboxFallbackMode) {
        await apiCall('/auth/resend-verification', {
          method: 'POST',
          auth: 'none',
          body: { email: targetEmail.trim() },
        });
      }
      pushToast({
        tone: 'info',
        title: 'Verification Code Sent',
        description: `A new 6-digit verification code was sent to ${targetEmail}.`,
      });
    } catch (err) {
      pushToast({
        tone: 'danger',
        title: 'Resend Failed',
        description: err instanceof Error ? err.message : 'Rate limit or server error',
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAuthSubmitting(true);
      if (!sandboxFallbackMode) {
        await apiCall('/auth/forgot-password', {
          method: 'POST',
          auth: 'none',
          body: { email: forgotEmail.trim() },
        });
      }
      setForgotStep('reset');
      pushToast({
        tone: 'info',
        title: 'Reset Code Dispatched',
        description: 'Check your email for the 6-digit password reset OTP.',
      });
    } catch (err) {
      pushToast({
        tone: 'danger',
        title: 'Request Failed',
        description: err instanceof Error ? err.message : 'Unable to send reset code',
      });
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(resetOtp.trim()) || resetNewPassword.length < 8) {
      pushToast({
        tone: 'danger',
        title: 'Validation Error',
        description: 'Provide the 6-digit OTP and a new password of at least 8 characters.',
      });
      return;
    }
    try {
      setAuthSubmitting(true);
      if (!sandboxFallbackMode) {
        await apiCall('/auth/reset-password', {
          method: 'POST',
          auth: 'none',
          body: {
            email: forgotEmail.trim(),
            otp: resetOtp.trim(),
            newPassword: resetNewPassword,
          },
        });
      }
      setForgotModalOpen(false);
      setForgotStep('request');
      setResetOtp('');
      setResetNewPassword('');
      pushToast({
        tone: 'success',
        title: 'Password Updated',
        description: 'Sign in with your new password.',
      });
    } catch (err) {
      pushToast({
        tone: 'danger',
        title: 'Password Reset Failed',
        description: err instanceof Error ? err.message : 'Could not reset password',
      });
    } finally {
      setAuthSubmitting(false);
    }
  };

  // --- Handlers: API Keys ---
  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creatingKey) return;
    const trimmed = newKeyName.trim();
    if (trimmed.length < 2) {
      pushToast({
        tone: 'danger',
        title: 'Invalid Key Name',
        description: 'Enter a descriptive name (at least 2 characters).',
      });
      return;
    }

    try {
      setCreatingKey(true);
      if (sandboxFallbackMode) {
        const randomHex = Array.from({ length: 28 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        const fullKey = `genaff_sk_${randomHex}`;
        const rec: ApiKeyRecord = {
          id: `key_${Date.now()}`,
          key_prefix: `${fullKey.slice(0, 14)}...`,
          name: trimmed,
          created_at: new Date().toISOString(),
          last_used_at: null,
        };
        setApiKeys((prev) => [rec, ...prev]);
        setCreatedPlaintextKey(fullKey);
        setPgApiKey(fullKey);
        setNewKeyName('');
        pushToast({
          tone: 'success',
          title: 'API Key Created',
          description: 'Copy your secret key now — it will never be displayed again.',
        });
        return;
      }

      const res = await apiCall<Record<string, unknown>>('/keys', {
        method: 'POST',
        body: { name: trimmed },
      });
      const fullSecret = String(res.key || '');
      setCreatedPlaintextKey(fullSecret);
      setNewKeyName('');
      await refreshDashboardData();
      pushToast({
        tone: 'success',
        title: 'API Key Generated',
        description: 'Save your secret key securely before closing the confirmation dialog.',
      });
    } catch (err) {
      pushToast({
        tone: 'danger',
        title: 'Could Not Create Key',
        description: err instanceof Error ? err.message : 'Error creating API key',
      });
    } finally {
      setCreatingKey(false);
    }
  };

  const handleConfirmRevokeKey = async () => {
    if (!revokeKeyModal) return;
    try {
      if (sandboxFallbackMode) {
        setApiKeys((prev) => prev.filter((k) => k.id !== revokeKeyModal.id));
      } else {
        await apiCall(`/keys/${encodeURIComponent(revokeKeyModal.id)}`, { method: 'DELETE' });
        await refreshDashboardData();
      }
      pushToast({
        tone: 'success',
        title: 'API Key Revoked',
        description: `${revokeKeyModal.name || revokeKeyModal.key_prefix} has been permanently revoked.`,
      });
      setRevokeKeyModal(null);
    } catch (err) {
      pushToast({
        tone: 'danger',
        title: 'Revocation Failed',
        description: err instanceof Error ? err.message : 'Unable to revoke API key',
      });
    }
  };

  // --- Handlers: Playground ---
  const handleCreateEphemeralSessionKey = async () => {
    try {
      if (sandboxFallbackMode) {
        const tempKey = `genaff_sk_sess_${Math.random().toString(36).slice(2, 14)}`;
        setPgApiKey(tempKey);
        pushToast({
          tone: 'success',
          title: 'Ephemeral Session Key Ready',
          description: 'Temporary 60-minute Playground API key populated.',
        });
        return;
      }
      const res = await apiCall<{
        api_key?: { key: string; expires_at: string };
      }>('/playground/sessions', {
        method: 'POST',
        body: { ttl_minutes: 60, title: 'Dashboard Playground Session' },
      });
      if (res.api_key?.key) {
        setPgApiKey(res.api_key.key);
        pushToast({
          tone: 'success',
          title: 'Playground Session Created',
          description: 'Temporary scoped key populated from POST /playground/sessions.',
        });
      }
    } catch (err) {
      pushToast({
        tone: 'danger',
        title: 'Session Provisioning Failed',
        description: err instanceof Error ? err.message : 'Failed to create playground session',
      });
    }
  };

  const handleSendPlaygroundRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pgSending) return;
    if (!pgApiKey.trim()) {
      setPgError(
        'Missing API Key: Paste an active genaff_sk_... key or click "Provision Temporary Session Key".'
      );
      return;
    }

    const startedAt = performance.now();
    try {
      setPgSending(true);
      setPgError(null);
      setPgResponse(null);
      setPgUsage(null);

      const messages = [
        ...(pgSystemPrompt.trim()
          ? [{ role: 'system' as const, content: pgSystemPrompt.trim() }]
          : []),
        { role: 'user' as const, content: pgUserPrompt.trim() },
      ];

      if (sandboxFallbackMode) {
        await new Promise((r) => setTimeout(r, 420));
        if (walletBalanceInr <= 0) {
          throw new Error(
            'Insufficient wallet balance (HTTP 402). Please top up your INR wallet to continue using API endpoints.'
          );
        }
        const promptTokens = Math.max(24, Math.ceil(pgUserPrompt.length / 4));
        const completionTokens = 96;
        const costInr = calculateCostInr(pgModel, promptTokens, completionTokens);
        const elapsed = Math.round(performance.now() - startedAt);
        setPgLatencyMs(elapsed);
        const reply = `[Sandbox Gateway Response via ${pgModel}]\n\nGenAff authenticated your request using Bearer ${pgApiKey
          .trim()
          .slice(0, 14)}..., metered ${
          promptTokens + completionTokens
        } total tokens, and deducted ${formatInr(costInr, true)} from your prepaid INR wallet.`;
        setPgResponse(reply);
        setPgUsage({
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens,
          cost_inr: costInr,
        });
        setWalletBalanceInr((b) => Math.max(0, +(b - costInr).toFixed(4)));
        const providerName = pgModel.split('/')[0] || 'openai';
        setUsageRecords((prev) => [
          {
            id: `req_${Date.now()}`,
            provider: providerName,
            model: pgModel,
            prompt_tokens: promptTokens,
            completion_tokens: completionTokens,
            tokens_used: promptTokens + completionTokens,
            cost_inr: costInr,
            created_at: new Date().toISOString(),
            api_key: {
              key_prefix: `${pgApiKey.trim().slice(0, 14)}...`,
              name: 'Playground Key',
            },
          },
          ...prev,
        ]);
        return;
      }

      const res = await apiCall<{
        id: string;
        model: string;
        choices?: Array<{ message?: { content?: string } }>;
        usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
      }>('/v1/chat/completions', {
        method: 'POST',
        auth: 'apiKey',
        apiKey: pgApiKey.trim(),
        body: {
          model: pgModel,
          messages,
          temperature: pgTemp,
          max_tokens: pgMaxTokens,
        },
      });

      const elapsed = Math.round(performance.now() - startedAt);
      setPgLatencyMs(elapsed);
      setPgResponse(res.choices?.[0]?.message?.content || JSON.stringify(res, null, 2));

      if (res.usage) {
        const cost = calculateCostInr(
          pgModel,
          res.usage.prompt_tokens || 0,
          res.usage.completion_tokens || 0
        );
        setPgUsage({
          prompt_tokens: res.usage.prompt_tokens || 0,
          completion_tokens: res.usage.completion_tokens || 0,
          total_tokens: res.usage.total_tokens || 0,
          cost_inr: cost,
        });
      }
      await refreshDashboardData();
    } catch (err) {
      setPgLatencyMs(Math.round(performance.now() - startedAt));
      setPgError(err instanceof Error ? err.message : 'Proxy request failed');
    } finally {
      setPgSending(false);
    }
  };

  // --- Handlers: Wallet & Razorpay Standard Checkout ---
  const handleInitiateTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topUpProcessing) return;

    const amountInr = Number(topUpAmountInput);
    if (!Number.isFinite(amountInr) || amountInr < MIN_TOPUP_INR) {
      setWalletStatusBanner({
        tone: 'danger',
        text: `Minimum top-up amount is ₹${MIN_TOPUP_INR} INR (enforced by backend MIN_TOPUP_INR).`,
      });
      return;
    }

    try {
      setTopUpProcessing(true);
      setWalletStatusBanner({
        tone: 'info',
        text: 'Step 1/3: Creating server-side Razorpay order via POST /wallet/topup/order...',
      });

      if (sandboxFallbackMode) {
        await new Promise((r) => setTimeout(r, 400));
        const mockOrderId = `order_RzpSandbox_${Date.now().toString().slice(-6)}`;
        const mockPayId = `pay_RzpSandbox_${Date.now().toString().slice(-6)}`;
        setWalletStatusBanner({
          tone: 'info',
          text: `Step 2/3: Verifying HMAC-SHA256 payment signature for ${mockOrderId} via POST /wallet/topup/verify...`,
        });
        await new Promise((r) => setTimeout(r, 400));
        setWalletBalanceInr((prev) => +(prev + amountInr).toFixed(2));
        setTopUpHistory((prev) => [
          {
            id: `topup_${Date.now()}`,
            razorpay_order_id: mockOrderId,
            razorpay_payment_id: mockPayId,
            amount_inr: amountInr,
            status: 'COMPLETED',
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        setWalletStatusBanner({
          tone: 'success',
          text: `Payment verified and wallet credited with ${formatInr(amountInr)} (Sandbox Simulation).`,
        });
        setTopUpProcessing(false);
        return;
      }

      const orderRes = await apiCall<{
        order_id?: string;
        orderId?: string;
        id?: string;
        amount?: number;
        currency?: string;
        razorpay_key_id?: string;
        key_id?: string;
      }>('/wallet/topup/order', {
        method: 'POST',
        body: { amount: amountInr, currency: 'INR' },
      });

      const orderId = String(orderRes.order_id || orderRes.orderId || orderRes.id || '');
      const keyId =
  orderRes.key_id || orderRes.razorpay_key_id || razorpayKeyId;

      if (!keyId) {
        throw new Error(
          'Missing public Razorpay Key ID. Configure VITE_RAZORPAY_KEY_ID in Connection Settings or return razorpay_key_id from /wallet/topup/order.'
        );
      }

      const scriptReady = await loadRazorpayScript();
      const win = window as unknown as {
        Razorpay?: new (opts: Record<string, unknown>) => {
          open: () => void;
          on: (ev: string, cb: (resp: { error?: { description?: string } }) => void) => void;
        };
      };

      if (!scriptReady || !win.Razorpay) {
        throw new Error('Could not load official Razorpay checkout.js script.');
      }

      const rzp = new win.Razorpay({
        key: keyId,
        amount: orderRes.amount ?? amountInr,
        currency: orderRes.currency || 'INR',
        name: 'GenAff AI API Gateway',
        description: `Prepaid Wallet Top-Up (${formatInr(amountInr)})`,
        order_id: orderId,
        prefill: {
          name: user?.name || undefined,
          email: user?.email || undefined,
        },
        theme: { color: '#4F46E5' },
        modal: {
          ondismiss: () => {
            setTopUpProcessing(false);
            setWalletStatusBanner({
              tone: 'warning',
              text: `Checkout modal dismissed by user. Order ${orderId} remains uncredited.`,
            });
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setWalletStatusBanner({
              tone: 'info',
              text: 'Step 3/3: Verifying signature with backend (POST /wallet/topup/verify)...',
            });
            const verified = await apiCall<{ message?: string; balance_inr?: number }>(
              '/wallet/topup/verify',
              {
                method: 'POST',
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              }
            );
            await refreshDashboardData();
            setWalletStatusBanner({
              tone: 'success',
              text:
                verified.message ||
                `Payment verified on server! Wallet credited with ${formatInr(amountInr)}.`,
            });
          } catch (verifyErr) {
            setWalletStatusBanner({
              tone: 'danger',
              text:
                verifyErr instanceof Error
                  ? `Verification failed: ${verifyErr.message}`
                  : 'Server signature verification failed.',
            });
          } finally {
            setTopUpProcessing(false);
          }
        },
      });

      rzp.on('payment.failed', (resp) => {
        setTopUpProcessing(false);
        setWalletStatusBanner({
          tone: 'danger',
          text: `Razorpay payment failed: ${resp.error?.description || 'Payment declined'}`,
        });
      });

      rzp.open();
    } catch (err) {
      setTopUpProcessing(false);
      setWalletStatusBanner({
        tone: 'danger',
        text: err instanceof Error ? err.message : 'Unable to create top-up order.',
      });
    }
  };

  // --- Computed Analytics from Real Usage Records ---
  const filteredUsageRecords = useMemo(() => {
    const now = Date.now();
    const rangeMs =
      timeRange === '24h'
        ? 24 * 3600 * 1000
        : timeRange === '7d'
        ? 7 * 24 * 3600 * 1000
        : timeRange === '30d'
        ? 30 * 24 * 3600 * 1000
        : 90 * 24 * 3600 * 1000;

    return usageRecords.filter((rec) => {
      const t = new Date(rec.created_at).getTime();
      const withinTime = Number.isNaN(t) ? true : now - t <= rangeMs;
      const matchesProvider =
        analyticsProviderFilter === 'all' || rec.provider === analyticsProviderFilter;
      const matchesModel = analyticsModelFilter === 'all' || rec.model === analyticsModelFilter;
      const matchesKey =
        analyticsKeyFilter === 'all' || rec.api_key?.key_prefix === analyticsKeyFilter;
      return withinTime && matchesProvider && matchesModel && matchesKey;
    });
  }, [
    usageRecords,
    timeRange,
    analyticsProviderFilter,
    analyticsModelFilter,
    analyticsKeyFilter,
  ]);

  const analyticsSummary = useMemo(() => {
    const totalRequests = filteredUsageRecords.length;
    const totalTokens = filteredUsageRecords.reduce((acc, r) => acc + r.tokens_used, 0);
    const totalSpendingInr = filteredUsageRecords.reduce((acc, r) => acc + r.cost_inr, 0);

    const byDateMap = new Map<
      string,
      { date: string; requests: number; tokens: number; costInr: number }
    >();
    const byProviderMap = new Map<
      string,
      { name: string; requests: number; tokens: number; costInr: number }
    >();
    const byModelMap = new Map<
      string,
      { model: string; requests: number; tokens: number; costInr: number }
    >();

    filteredUsageRecords.forEach((rec) => {
      const dayLabel = rec.created_at.slice(0, 10);
      const prevDay = byDateMap.get(dayLabel) || {
        date: dayLabel,
        requests: 0,
        tokens: 0,
        costInr: 0,
      };
      prevDay.requests += 1;
      prevDay.tokens += rec.tokens_used;
      prevDay.costInr = +(prevDay.costInr + rec.cost_inr).toFixed(4);
      byDateMap.set(dayLabel, prevDay);

      const prov = rec.provider || 'unknown';
      const prevProv = byProviderMap.get(prov) || {
        name: prov.toUpperCase(),
        requests: 0,
        tokens: 0,
        costInr: 0,
      };
      prevProv.requests += 1;
      prevProv.tokens += rec.tokens_used;
      prevProv.costInr = +(prevProv.costInr + rec.cost_inr).toFixed(4);
      byProviderMap.set(prov, prevProv);

      const mod = rec.model || 'unknown';
      const prevMod = byModelMap.get(mod) || {
        model: mod,
        requests: 0,
        tokens: 0,
        costInr: 0,
      };
      prevMod.requests += 1;
      prevMod.tokens += rec.tokens_used;
      prevMod.costInr = +(prevMod.costInr + rec.cost_inr).toFixed(4);
      byModelMap.set(mod, prevMod);
    });

    return {
      totalRequests,
      totalTokens,
      totalSpendingInr,
      timeSeries: Array.from(byDateMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
      byProvider: Array.from(byProviderMap.values()),
      byModel: Array.from(byModelMap.values()),
    };
  }, [filteredUsageRecords]);

  // --- Combined Transactions Ledger (TopUps + Usage Debits) ---
  const unifiedLedger = useMemo(() => {
    const credits = topUpHistory.map((t) => ({
      id: `topup_${t.id}`,
      type: 'TOPUP_CREDIT' as const,
      reference: t.razorpay_order_id || t.id,
      amount_inr: t.amount_inr,
      status: t.status,
      created_at: t.created_at,
      details: t.razorpay_payment_id
        ? `Razorpay Payment ${t.razorpay_payment_id}`
        : 'Razorpay Order',
    }));
    const debits = usageRecords.map((u) => ({
      id: `usage_${u.id}`,
      type: 'USAGE_DEBIT' as const,
      reference: u.id,
      amount_inr: u.cost_inr,
      status: 'COMPLETED',
      created_at: u.created_at,
      details: `${u.model} (${formatNumber(u.tokens_used)} tokens)`,
    }));

    return [...credits, ...debits]
      .filter((item) => {
        if (txTypeFilter === 'credit' && item.type !== 'TOPUP_CREDIT') return false;
        if (txTypeFilter === 'debit' && item.type !== 'USAGE_DEBIT') return false;
        if (txStatusFilter !== 'all' && item.status !== txStatusFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [topUpHistory, usageRecords, txTypeFilter, txStatusFilter]);

  const PIE_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#3B82F6'];

  // --- Shared Surface Classes ---
  const surfaceBg = isDark ? 'bg-[#070B14] text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardBg = isDark
    ? 'bg-[#0F1624] border-slate-800/80 text-slate-100'
    : 'bg-white border-slate-200 text-slate-900 shadow-xs';
  const inputBg = isDark
    ? 'bg-[#070B14] border-slate-700 text-white placeholder-slate-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400';

  // ============================================================================
  // 5. RENDER PUBLIC WEBSITE OR AUTHENTICATED DASHBOARD
  // ============================================================================

  return (
    <div className={`min-h-screen font-sans transition-colors ${surfaceBg}`}>
      {/* Toast Notifications Viewport */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl border p-4 shadow-xl backdrop-blur-md ${
              t.tone === 'success'
                ? 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100'
                : t.tone === 'danger'
                ? 'border-rose-500/40 bg-rose-950/90 text-rose-100'
                : t.tone === 'warning'
                ? 'border-amber-500/40 bg-amber-950/90 text-amber-100'
                : 'border-indigo-500/40 bg-indigo-950/90 text-indigo-100'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-semibold">{t.title}</div>
                {t.description && <div className="mt-1 text-xs opacity-90">{t.description}</div>}
              </div>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="opacity-70 hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Top System / Connection Status Bar */}
      <div className="border-b border-slate-800/80 bg-[#050811] px-4 py-1.5 text-[11px] text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  gatewayHealth === 'online'
                    ? 'bg-emerald-400'
                    : gatewayHealth === 'checking'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-400'
                }`}
              />
              <span className="font-mono text-slate-300">{apiBaseUrl}</span>
            </span>
            {sandboxFallbackMode && (
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                SANDBOX TEST SIMULATOR ACTIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setConfigModalOpen(true)}
              className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
            >
              <Sliders className="h-3 w-3" />
              <span>API & Checkout Config</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="inline-flex items-center gap-1 hover:text-white"
            >
              {isDark ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
              <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PUBLIC WEBSITE MODE */}
      {mode === 'public' ? (
        <div className="flex min-h-screen flex-col">
          {/* Public Header */}
          <header
            className={`sticky top-0 z-30 border-b backdrop-blur-md ${
              isDark
                ? 'border-slate-800/80 bg-[#070B14]/90'
                : 'border-slate-200 bg-white/90'
            }`}
          >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-8">
                <button
                  type="button"
                  onClick={() => setPublicView('home')}
                  className="flex items-center gap-2.5 text-left"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-lg font-bold tracking-tight">GenAff</span>
                    <span className="ml-2 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400">
                      AI GATEWAY
                    </span>
                  </div>
                </button>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                  {(
                    [
                      ['home', 'Home'],
                      ['features', 'Features'],
                      ['models', 'Supported Models'],
                      ['pricing', 'Pricing'],
                      ['docs', 'Documentation'],
                      ['contact', 'Support'],
                    ] as Array<[PublicView, string]>
                  ).map(([view, label]) => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => setPublicView(view)}
                      className={`transition-colors ${
                        publicView === view
                          ? 'text-indigo-400 font-semibold'
                          : isDark
                          ? 'text-slate-300 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-3">
                {jwtToken ? (
                  <button
                    type="button"
                    onClick={() => setMode('dashboard')}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Open Dashboard</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setPublicView('signin')}
                      className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setPublicView('signup')}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Public Main Content */}
          <main className="flex-1">
            {publicView === 'home' && (
              <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 space-y-20">
                {/* Hero */}
                <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Unified OpenAI-Compatible Inference & Prepaid INR Billing</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
                      One API. Every Model.{' '}
                      <span className="text-indigo-400">Smarter Spending.</span>
                    </h1>
                    <p className="max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
                      Route production requests to <strong>OpenAI</strong>,{' '}
                      <strong>Google Gemini</strong>, <strong>DeepSeek</strong>, and{' '}
                      <strong>NVIDIA NIM</strong> through a single{' '}
                      <code className="text-indigo-300">POST /v1/chat/completions</code> endpoint.
                      Manage scoped API keys, track token usage in real time, and top up your
                      prepaid INR wallet via Razorpay.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => (jwtToken ? setMode('dashboard') : setPublicView('signup'))}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
                      >
                        <span>{jwtToken ? 'Open Developer Dashboard' : 'Create Free Account'}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPublicView('models')}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold hover:bg-slate-800/60"
                      >
                        <span>Explore 12 Supported Models</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPublicView('docs')}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800/50"
                      >
                        <BookOpen className="h-4 w-4 text-indigo-400" />
                        <span>API Reference</span>
                      </button>
                    </div>
                  </div>

                  {/* Hero Code Preview */}
                  <div className={`lg:col-span-5 rounded-2xl border p-5 ${cardBg}`}>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                      <span className="font-mono text-indigo-400">
                        POST https://api.raiyanali.tech/v1/chat/completions
                      </span>
                      <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        OpenAI SDK Compatible
                      </span>
                    </div>
                    <pre className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-slate-300">
{`curl https://api.raiyanali.tech/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer genaff_sk_live_..." \\
  -d '{
    "model": "deepseek/deepseek-chat",
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "Hello from GenAff Gateway!" }
    ],
    "temperature": 0.7
  }'`}
                    </pre>
                    <div className="mt-4 grid grid-cols-4 gap-2 border-t border-slate-800 pt-4 text-center text-[11px]">
                      <div className="rounded-lg bg-slate-900/80 p-2">
                        <div className="font-semibold text-white">OpenAI</div>
                        <div className="text-slate-400">4 Models</div>
                      </div>
                      <div className="rounded-lg bg-slate-900/80 p-2">
                        <div className="font-semibold text-white">Gemini</div>
                        <div className="text-slate-400">3 Models</div>
                      </div>
                      <div className="rounded-lg bg-slate-900/80 p-2">
                        <div className="font-semibold text-white">DeepSeek</div>
                        <div className="text-slate-400">2 Models</div>
                      </div>
                      <div className="rounded-lg bg-slate-900/80 p-2">
                        <div className="font-semibold text-white">NVIDIA NIM</div>
                        <div className="text-slate-400">3 Models</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Core Pillars */}
                <div className="grid gap-6 md:grid-cols-3">
                  <div className={`rounded-xl border p-6 ${cardBg}`}>
                    <Layers className="h-6 w-6 text-indigo-400" />
                    <h3 className="mt-4 text-lg font-bold">Unified Multi-Provider Proxy</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      Switch between <code className="text-indigo-300">openai/gpt-4o</code>,{' '}
                      <code className="text-indigo-300">gemini/gemini-1.5-pro</code>,{' '}
                      <code className="text-indigo-300">deepseek/deepseek-reasoner</code>, and{' '}
                      <code className="text-indigo-300">nvidia/meta/llama-3.1-405b-instruct</code>{' '}
                      by changing a single model string.
                    </p>
                  </div>
                  <div className={`rounded-xl border p-6 ${cardBg}`}>
                    <Wallet className="h-6 w-6 text-emerald-400" />
                    <h3 className="mt-4 text-lg font-bold">Prepaid INR Wallet via Razorpay</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      Top up in Indian Rupees starting from ₹10 INR with Razorpay Standard Checkout.
                      Every completion automatically calculates token cost and deducts from your
                      verified wallet balance.
                    </p>
                  </div>
                  <div className={`rounded-xl border p-6 ${cardBg}`}>
                    <KeyRound className="h-6 w-6 text-amber-400" />
                    <h3 className="mt-4 text-lg font-bold">SHA-256 Scoped API Keys</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      Generate named <code className="text-indigo-300">genaff_sk_...</code> keys or
                      ephemeral playground session keys. Raw secrets are shown only once at creation
                      and stored as SHA-256 hashes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {publicView === 'features' && (
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-8">
                <div>
                  <h1 className="text-3xl font-bold">Platform Capabilities</h1>
                  <p className="mt-2 text-slate-400">
                    Built directly on the verified GenAff AI API Gateway backend architecture.
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: 'OpenAI-Compatible Chat Completions',
                      desc: 'Standard POST /v1/chat/completions schema supporting system prompts, multi-turn messages, temperature, and max_tokens.',
                    },
                    {
                      title: 'Automated Model Health Probes',
                      desc: 'Background health check scheduler probes provider endpoints and exposes live availability via GET /v1/models and GET /v1/models/health.',
                    },
                    {
                      title: 'Ephemeral Playground Sessions',
                      desc: 'POST /playground/sessions issues time-bound temporary keys with automatic background cleanup so you never expose production secrets.',
                    },
                    {
                      title: 'Cryptographic Razorpay Verification',
                      desc: 'POST /wallet/topup/verify validates razorpay_order_id, razorpay_payment_id, and razorpay_signature on the server before crediting INR.',
                    },
                    {
                      title: 'Downloadable PDF Invoices & Statements',
                      desc: 'Export GST/billing-ready PDF receipts for individual top-ups (/wallet/invoice/:id/pdf) or full wallet statements (/wallet/statement/pdf).',
                    },
                    {
                      title: 'Granular Rate Limiting & Protection',
                      desc: 'Protected by express-rate-limit across auth, OTP verification, password resets, and 60 RPM proxy inference routes.',
                    },
                  ].map((f) => (
                    <div key={f.title} className={`rounded-xl border p-6 ${cardBg}`}>
                      <h3 className="text-base font-bold">{f.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {publicView === 'models' && (
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h1 className="text-3xl font-bold">Supported AI Models</h1>
                    <p className="mt-1 text-sm text-slate-400">
                      12 production models across 4 providers configured in{' '}
                      <code className="text-indigo-300">src/utils/pricing.js</code> (Exchange rate:
                      1 USD = ₹{USD_TO_INR} INR).
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="search"
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      placeholder="Filter models..."
                      className={`rounded-lg border px-3 py-2 text-sm ${inputBg}`}
                    />
                    <select
                      value={modelProviderFilter}
                      onChange={(e) => setModelProviderFilter(e.target.value)}
                      className={`rounded-lg border px-3 py-2 text-sm ${inputBg}`}
                    >
                      <option value="all">All Providers</option>
                      <option value="openai">OpenAI</option>
                      <option value="deepseek">DeepSeek</option>
                      <option value="gemini">Google Gemini</option>
                      <option value="nvidia">NVIDIA NIM</option>
                    </select>
                  </div>
                </div>

                <div className={`overflow-x-auto rounded-xl border ${cardBg}`}>
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 text-xs uppercase text-slate-400">
                      <tr>
                        <th className="px-4 py-3.5">Provider</th>
                        <th className="px-4 py-3.5">Model ID</th>
                        <th className="px-4 py-3.5">Display Name</th>
                        <th className="px-4 py-3.5">Input / 1K Tokens</th>
                        <th className="px-4 py-3.5">Output / 1K Tokens</th>
                        <th className="px-4 py-3.5">Context Window</th>
                        <th className="px-4 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {AUTHORITATIVE_MODEL_CATALOG.filter((m) => {
                        const matchProv =
                          modelProviderFilter === 'all' || m.provider === modelProviderFilter;
                        const q = modelSearch.trim().toLowerCase();
                        const matchQ =
                          !q ||
                          m.id.toLowerCase().includes(q) ||
                          m.displayName.toLowerCase().includes(q);
                        return matchProv && matchQ;
                      }).map((m) => (
                        <tr key={m.id}>
                          <td className="px-4 py-3.5 font-medium">{m.providerName}</td>
                          <td className="px-4 py-3.5 font-mono text-xs text-indigo-400">{m.id}</td>
                          <td className="px-4 py-3.5 font-semibold">{m.displayName}</td>
                          <td className="px-4 py-3.5">
                            {formatInr(m.promptInrPer1k, true)}{' '}
                            <span className="text-xs text-slate-500">(${m.promptUsdPer1k})</span>
                          </td>
                          <td className="px-4 py-3.5">
                            {formatInr(m.completionInrPer1k, true)}{' '}
                            <span className="text-xs text-slate-500">
                              (${m.completionUsdPer1k})
                            </span>
                          </td>
                          <td className="px-4 py-3.5">{formatNumber(m.contextWindow)}</td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                              {liveModelStatus[m.id] || m.defaultStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {publicView === 'pricing' && (
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-10">
                <div>
                  <h1 className="text-3xl font-bold">Transparent Pay-As-You-Go INR Pricing</h1>
                  <p className="mt-2 text-slate-400">
                    No monthly subscriptions. Top up your prepaid INR wallet starting at ₹10 INR and
                    pay strictly for exact prompt and completion tokens consumed.
                  </p>
                </div>

                {/* Interactive Cost Estimator */}
                <div className={`rounded-xl border p-6 ${cardBg}`}>
                  <h2 className="text-lg font-bold">Interactive Token Cost Calculator</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-4">
                    <div>
                      <label className="block text-xs text-slate-400">Select Model</label>
                      <select
                        value={calcModelId}
                        onChange={(e) => setCalcModelId(e.target.value)}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputBg}`}
                      >
                        {AUTHORITATIVE_MODEL_CATALOG.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.displayName} ({m.id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400">Prompt Tokens</label>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={calcInputTokens}
                        onChange={(e) => setCalcInputTokens(Number(e.target.value))}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400">Completion Tokens</label>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={calcOutputTokens}
                        onChange={(e) => setCalcOutputTokens(Number(e.target.value))}
                        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm ${inputBg}`}
                      />
                    </div>
                    <div className="flex flex-col justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3">
                      <span className="text-xs text-indigo-300">Estimated Wallet Debit</span>
                      <span className="mt-1 text-2xl font-bold text-white">
                        {formatInr(
                          calculateCostInr(calcModelId, calcInputTokens, calcOutputTokens),
                          true
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Billing Mechanics */}
                <div className="grid gap-6 md:grid-cols-3">
                  <div className={`rounded-xl border p-5 ${cardBg}`}>
                    <h3 className="font-semibold">How Usage Is Measured</h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                      Every <code className="text-indigo-300">POST /v1/chat/completions</code> call
                      meters exact <code className="text-indigo-300">prompt_tokens</code> and{' '}
                      <code className="text-indigo-300">completion_tokens</code> reported by the
                      upstream provider and multiplies by the per-1K rate in{' '}
                      <code className="text-indigo-300">src/utils/pricing.js</code>.
                    </p>
                  </div>
                  <div className={`rounded-xl border p-5 ${cardBg}`}>
                    <h3 className="font-semibold">Minimum Top-Up & Wallet Debits</h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                      Minimum wallet top-up is <strong>₹{MIN_TOPUP_INR} INR</strong>. If your wallet
                      balance reaches ₹0.00, inference endpoints return{' '}
                      <code className="text-rose-400">402 Payment Required</code> until topped up.
                    </p>
                  </div>
                  <div className={`rounded-xl border p-5 ${cardBg}`}>
                    <h3 className="font-semibold">Refund & Cancellation Policy</h3>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                      Pending uncaptured orders can be cancelled immediately via{' '}
                      <code className="text-indigo-300">POST /wallet/topup/cancel</code>. Completed
                      wallet top-ups are non-refundable prepaid credits except in verified duplicate
                      charge cases.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {publicView === 'docs' && (
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-8">
                <div>
                  <h1 className="text-3xl font-bold">GenAff Developer Documentation</h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Complete specification generated from the production{' '}
                    <code className="text-indigo-300">GenAff-AI-API-Gateway-Backend</code>{' '}
                    implementation.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className={`rounded-xl border p-5 space-y-3 ${cardBg}`}>
                    <h3 className="font-bold text-indigo-400">1. Base URL & Auth Distinction</h3>
                    <p className="text-xs text-slate-300">
                      <strong>Base URL:</strong>{' '}
                      <code className="text-emerald-400">https://api.raiyanali.tech</code>
                    </p>
                    <p className="text-xs text-slate-400">
                      <strong>Account / Wallet Endpoints:</strong> Authenticate with your User JWT
                      obtained from <code className="text-indigo-300">POST /auth/login</code> via{' '}
                      <code className="text-indigo-300">Authorization: Bearer &lt;jwt_token&gt;</code>.
                    </p>
                    <p className="text-xs text-slate-400">
                      <strong>AI Proxy Inference (<code className="text-indigo-300">/v1/chat/completions</code>):</strong>{' '}
                      Authenticate with your GenAff API Key via{' '}
                      <code className="text-indigo-300">
                        Authorization: Bearer genaff_sk_...
                      </code>{' '}
                      (recommended for browser CORS compatibility) or{' '}
                      <code className="text-indigo-300">x-api-key: genaff_sk_...</code>.
                    </p>
                  </div>

                  <div className={`rounded-xl border p-5 space-y-3 ${cardBg}`}>
                    <h3 className="font-bold text-indigo-400">2. Rate Limits</h3>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      <li>• <strong>POST /auth/register:</strong> 5 requests / hour</li>
                      <li>• <strong>POST /auth/login:</strong> 10 requests / 15 minutes</li>
                      <li>• <strong>POST /auth/resend-verification:</strong> 3 requests / 15 minutes</li>
                      <li>• <strong>POST /auth/forgot-password:</strong> 3 requests / hour</li>
                      <li>• <strong>POST /v1/chat/completions:</strong> 60 requests / minute</li>
                      <li>• <strong>POST /playground/sessions:</strong> 10 requests / hour</li>
                    </ul>
                  </div>

                  <div className={`rounded-xl border p-5 space-y-3 ${cardBg}`}>
                    <h3 className="font-bold text-indigo-400">3. Standard Error Codes</h3>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      <li>• <strong>400 Bad Request:</strong> Unsupported model or invalid payload</li>
                      <li>• <strong>401 Unauthorized:</strong> Missing/expired JWT or revoked API key</li>
                      <li>• <strong>402 Payment Required:</strong> Insufficient INR wallet balance</li>
                      <li>• <strong>403 Forbidden:</strong> Account suspended or restricted model</li>
                      <li>• <strong>429 Too Many Requests:</strong> Rate limit window exceeded</li>
                      <li>• <strong>500 Internal Error:</strong> Upstream provider failure</li>
                    </ul>
                  </div>
                </div>

                <div className={`rounded-xl border p-6 ${cardBg}`}>
                  <h3 className="text-base font-bold">Code Examples (cURL, JavaScript, Python)</h3>
                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <div>
                      <div className="mb-1.5 text-xs font-semibold text-slate-400">cURL</div>
                      <pre className="rounded-lg bg-[#070B14] p-3 font-mono text-[11px] text-slate-200 overflow-x-auto">
{`curl -X POST https://api.raiyanali.tech/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer genaff_sk_..." \\
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
                      </pre>
                    </div>
                    <div>
                      <div className="mb-1.5 text-xs font-semibold text-slate-400">
                        JavaScript (Fetch)
                      </div>
                      <pre className="rounded-lg bg-[#070B14] p-3 font-mono text-[11px] text-slate-200 overflow-x-auto">
{`const res = await fetch('https://api.raiyanali.tech/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer genaff_sk_...'
  },
  body: JSON.stringify({
    model: 'gemini/gemini-1.5-flash',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});
const data = await res.json();`}
                      </pre>
                    </div>
                    <div>
                      <div className="mb-1.5 text-xs font-semibold text-slate-400">
                        Python (Requests)
                      </div>
                      <pre className="rounded-lg bg-[#070B14] p-3 font-mono text-[11px] text-slate-200 overflow-x-auto">
{`import requests

resp = requests.post(
    "https://api.raiyanali.tech/v1/chat/completions",
    headers={"Authorization": "Bearer genaff_sk_..."},
    json={
        "model": "deepseek/deepseek-chat",
        "messages": [{"role": "user", "content": "Hello!"}]
    }
)
print(resp.json())`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {publicView === 'signin' && (
              <div className="mx-auto max-w-md px-4 py-16">
                <div className={`rounded-2xl border p-6 space-y-5 ${cardBg}`}>
                  <div>
                    <h1 className="text-2xl font-bold">Sign In to GenAff</h1>
                    <p className="mt-1 text-xs text-slate-400">
                      Authenticate via <code className="text-indigo-300">POST /auth/login</code> to
                      manage keys and wallet balance.
                    </p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium">Email Address</label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm ${inputBg}`}
                        required
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-medium">Password</label>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotEmail(loginEmail);
                            setForgotModalOpen(true);
                          }}
                          className="text-indigo-400 hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm ${inputBg}`}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {authSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                  </form>
                  <div className="border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setPublicView('signup')}
                      className="font-semibold text-indigo-400 hover:underline"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {publicView === 'signup' && (
              <div className="mx-auto max-w-md px-4 py-16">
                <div className={`rounded-2xl border p-6 space-y-5 ${cardBg}`}>
                  <div>
                    <h1 className="text-2xl font-bold">Create Developer Account</h1>
                    <p className="mt-1 text-xs text-slate-400">
                      Registers via <code className="text-indigo-300">POST /auth/register</code> and
                      sends a 6-digit email verification code.
                    </p>
                  </div>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium">Name (optional)</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Raiyan Ali"
                        className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium">Email Address</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm ${inputBg}`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium">
                        Password (min 8 chars, letter + number)
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm ${inputBg}`}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {authSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </form>
                  <div className="border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setPublicView('signin')}
                      className="font-semibold text-indigo-400 hover:underline"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(publicView === 'privacy' ||
              publicView === 'terms' ||
              publicView === 'refund' ||
              publicView === 'contact') && (
              <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
                <div className={`rounded-2xl border p-8 space-y-6 ${cardBg}`}>
                  {publicView === 'privacy' && (
                    <>
                      <h1 className="text-2xl font-bold">Privacy Policy</h1>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        GenAff collects only the account and telemetry fields defined in{' '}
                        <code className="text-indigo-300">prisma/schema.prisma</code>: your email
                        address, bcrypt-hashed password (<code className="text-indigo-300">passwordHash</code>),
                        SHA-256 hashed API keys (<code className="text-indigo-300">keyHash</code> and{' '}
                        <code className="text-indigo-300">keyPrefix</code>), token usage counts (
                        <code className="text-indigo-300">Usage</code>), and Razorpay order/payment
                        references (<code className="text-indigo-300">TopUp</code>).
                      </p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        API proxy requests sent to <code className="text-indigo-300">POST /v1/chat/completions</code>{' '}
                        are forwarded directly to the selected upstream AI provider (OpenAI, Google
                        Gemini, DeepSeek, or NVIDIA NIM) and are not stored in the{' '}
                        <code className="text-indigo-300">Usage</code> table.
                      </p>
                    </>
                  )}
                  {publicView === 'terms' && (
                    <>
                      <h1 className="text-2xl font-bold">Terms of Service</h1>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        By accessing GenAff (<code className="text-indigo-300">https://raiyanali.tech</code> and{' '}
                        <code className="text-indigo-300">https://api.raiyanali.tech</code>), you agree to
                        maintain positive prepaid INR wallet balances for API inference, keep your{' '}
                        <code className="text-indigo-300">genaff_sk_...</code> keys confidential, and respect
                        platform rate limits (60 RPM on proxy endpoints). Accounts violating security
                        policies may be placed in <code className="text-rose-400">SUSPENDED</code> status.
                      </p>
                    </>
                  )}
                  {publicView === 'refund' && (
                    <>
                      <h1 className="text-2xl font-bold">Refund and Cancellation Policy</h1>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        1. <strong>Pending Top-Up Orders:</strong> Any uncaptured Razorpay order in{' '}
                        <code className="text-amber-300">PENDING</code> status can be cancelled by the user
                        via <code className="text-indigo-300">POST /wallet/topup/cancel</code>.
                      </p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        2. <strong>Completed Wallet Credits:</strong> Prepaid INR credits verified via{' '}
                        <code className="text-indigo-300">POST /wallet/topup/verify</code> are non-refundable
                        once credited, except in the event of a verified duplicate charge or gateway
                        settlement failure. Contact <code className="text-indigo-300">billing@genaff.ai</code>{' '}
                        with your <code className="text-indigo-300">razorpay_order_id</code> and{' '}
                        <code className="text-indigo-300">razorpay_payment_id</code> for resolution.
                      </p>
                    </>
                  )}
                  {publicView === 'contact' && (
                    <>
                      <h1 className="text-2xl font-bold">Contact & Developer Support</h1>
                      <div className="grid gap-4 sm:grid-cols-2 text-sm">
                        <div className="rounded-xl border border-slate-800 p-4">
                          <div className="font-semibold text-white">Technical Support</div>
                          <div className="mt-1 font-mono text-xs text-indigo-400">
                            support@genaff.ai
                          </div>
                          <p className="mt-2 text-xs text-slate-400">
                            Configured via SUPPORT_EMAIL in backend src/config/index.js.
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-800 p-4">
                          <div className="font-semibold text-white">Billing & Razorpay Inquiries</div>
                          <div className="mt-1 font-mono text-xs text-emerald-400">
                            billing@genaff.ai
                          </div>
                          <p className="mt-2 text-xs text-slate-400">
                            Include your Razorpay Order ID (order_...) and Payment ID (pay_...).
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* Public Footer */}
          <footer className="border-t border-slate-800/80 py-8 text-xs text-slate-400">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
              <div>
                <strong>GenAff</strong> — Unified AI API Gateway (`https://raiyanali.tech`)
              </div>
              <div className="flex flex-wrap gap-5">
                <button type="button" onClick={() => setPublicView('privacy')} className="hover:text-white">
                  Privacy Policy
                </button>
                <button type="button" onClick={() => setPublicView('terms')} className="hover:text-white">
                  Terms of Service
                </button>
                <button type="button" onClick={() => setPublicView('refund')} className="hover:text-white">
                  Refund & Cancellation
                </button>
                <button type="button" onClick={() => setPublicView('contact')} className="hover:text-white">
                  Contact & Support
                </button>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        /* AUTHENTICATED DEVELOPER DASHBOARD MODE */
        <div className="flex min-h-[calc(100vh-33px)]">
          {/* Collapsible Sidebar */}
          <aside
            className={`flex flex-col border-r transition-all duration-200 ${
              isDark ? 'border-slate-800/80 bg-[#0B1120]' : 'border-slate-200 bg-white'
            } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
          >
            <div className="flex h-16 items-center justify-between border-b border-slate-800/60 px-4">
              <button
                type="button"
                onClick={() => setMode('public')}
                className="flex items-center gap-2.5 overflow-hidden text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <Zap className="h-4 w-4" />
                </div>
                {!sidebarCollapsed && <span className="font-bold tracking-tight">GenAff</span>}
              </button>
              <button
                type="button"
                onClick={() => setSidebarCollapsed((c) => !c)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </div>

            <nav className="flex-1 space-y-5 overflow-y-auto p-3">
              {[
                {
                  group: 'Overview',
                  items: [{ id: 'overview' as const, label: 'Dashboard', icon: LayoutDashboard }],
                },
                {
                  group: 'Developer Tools',
                  items: [
                    { id: 'api-keys' as const, label: 'API Keys', icon: KeyRound },
                    { id: 'models' as const, label: 'Models & Providers', icon: Cpu },
                    { id: 'playground' as const, label: 'Playground', icon: TerminalSquare },
                    { id: 'docs' as const, label: 'API Documentation', icon: BookOpen },
                  ],
                },
                {
                  group: 'Analytics',
                  items: [
                    { id: 'analytics' as const, label: 'Usage Analytics', icon: BarChart3 },
                    { id: 'logs' as const, label: 'Request Logs', icon: ScrollText },
                  ],
                },
                {
                  group: 'Billing',
                  items: [
                    { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
                    { id: 'transactions' as const, label: 'Transactions', icon: ReceiptText },
                    { id: 'pricing' as const, label: 'Pricing', icon: Tag },
                  ],
                },
                {
                  group: 'Account',
                  items: [
                    { id: 'profile' as const, label: 'Profile', icon: User },
                    { id: 'settings' as const, label: 'Settings', icon: Settings },
                    { id: 'support' as const, label: 'Help & Support', icon: LifeBuoy },
                  ],
                },
              ].map((sec) => (
                <div key={sec.group}>
                  {!sidebarCollapsed && (
                    <div className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {sec.group}
                    </div>
                  )}
                  <div className="space-y-1">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const active = dashboardView === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDashboardView(item.id)}
                          className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                            active
                              ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                          }`}
                          title={sidebarCollapsed ? item.label : undefined}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {/* Dashboard Content Column */}
          <div className="flex flex-1 flex-col min-w-0">
            {/* Topbar */}
            <header
              className={`flex h-16 items-center justify-between border-b px-6 ${
                isDark ? 'border-slate-800/80 bg-[#0B1120]/80' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Dashboard</span>
                <span>/</span>
                <span className="font-semibold capitalize text-indigo-400">
                  {dashboardView.replace('-', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDashboardView('wallet')}
                  className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
                >
                  <Wallet className="h-3.5 w-3.5" />
                  <span>{formatInr(walletBalanceInr)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => void refreshDashboardData()}
                  className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white"
                  title="Sync with backend"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
                </button>

                {user && (
                  <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-semibold">{user.name || user.email}</div>
                      <div className="text-[10px] text-slate-400">{user.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        clearSession();
                        setMode('public');
                        setPublicView('home');
                      }}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </header>

            {/* Main View Switcher */}
            <main className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* 1. OVERVIEW DASHBOARD */}
              {dashboardView === 'overview' && (
                <div className="space-y-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h1 className="text-2xl font-bold">Developer Overview</h1>
                      <p className="text-xs text-slate-400">
                        Real-time metrics from <code className="text-indigo-300">GET /auth/me</code>,{' '}
                        <code className="text-indigo-300">GET /wallet</code>, and{' '}
                        <code className="text-indigo-300">GET /wallet/usage</code>.
                      </p>
                    </div>
                    <div className="flex gap-1.5 rounded-lg border border-slate-800 bg-[#0B1120] p-1">
                      {(['24h', '7d', '30d', '90d'] as const).map((rng) => (
                        <button
                          key={rng}
                          type="button"
                          onClick={() => setTimeRange(rng)}
                          className={`rounded-md px-3 py-1 text-xs font-medium ${
                            timeRange === rng
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {rng}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5 KPI Cards */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className={`rounded-xl border p-4 ${cardBg}`}>
                      <div className="text-xs text-slate-400">Wallet Balance (INR)</div>
                      <div className="mt-2 text-2xl font-bold text-emerald-400">
                        {formatInr(walletBalanceInr)}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">GET /wallet</div>
                    </div>
                    <div className={`rounded-xl border p-4 ${cardBg}`}>
                      <div className="text-xs text-slate-400">Total Requests ({timeRange})</div>
                      <div className="mt-2 text-2xl font-bold">
                        {formatNumber(analyticsSummary.totalRequests)}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">GET /wallet/usage</div>
                    </div>
                    <div className={`rounded-xl border p-4 ${cardBg}`}>
                      <div className="text-xs text-slate-400">Tokens Consumed ({timeRange})</div>
                      <div className="mt-2 text-2xl font-bold">
                        {formatNumber(analyticsSummary.totalTokens)}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">Metered completions</div>
                    </div>
                    <div className={`rounded-xl border p-4 ${cardBg}`}>
                      <div className="text-xs text-slate-400">Total Spending ({timeRange})</div>
                      <div className="mt-2 text-2xl font-bold text-indigo-400">
                        {formatInr(analyticsSummary.totalSpendingInr, true)}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">INR debited</div>
                    </div>
                    <div className={`rounded-xl border p-4 ${cardBg}`}>
                      <div className="text-xs text-slate-400">Active API Keys</div>
                      <div className="mt-2 text-2xl font-bold">{apiKeys.length}</div>
                      <div className="mt-1 text-[11px] text-slate-500">GET /keys</div>
                    </div>
                  </div>

                  {/* Charts or Honest Empty State */}
                  {filteredUsageRecords.length === 0 ? (
                    <div className={`rounded-xl border border-dashed p-10 text-center ${cardBg}`}>
                      <BarChart3 className="mx-auto h-8 w-8 text-slate-500" />
                      <h3 className="mt-3 text-base font-semibold">
                        No API usage recorded for the selected {timeRange} period
                      </h3>
                      <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
                        Charts render strictly from real backend usage records (<code className="text-indigo-300">GET /wallet/usage</code>). Send a test completion in the Playground to populate live telemetry.
                      </p>
                      <div className="mt-4 flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setDashboardView('playground')}
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                        >
                          Open Playground
                        </button>
                        <button
                          type="button"
                          onClick={() => setDashboardView('wallet')}
                          className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold hover:bg-slate-800"
                        >
                          Top Up Wallet
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className={`rounded-xl border p-5 ${cardBg}`}>
                        <h3 className="text-sm font-semibold">API Request Volume & Tokens</h3>
                        <div className="relative mt-4 h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsSummary.timeSeries}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                              <YAxis stroke="#94A3B8" fontSize={11} />
                              <Tooltip />
                              <Legend />
                              <Area
                                type="monotone"
                                dataKey="tokens"
                                name="Tokens"
                                stroke="#6366F1"
                                fill="#6366F1"
                                fillOpacity={0.2}
                              />
                              <Area
                                type="monotone"
                                dataKey="requests"
                                name="Requests"
                                stroke="#10B981"
                                fill="#10B981"
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className={`rounded-xl border p-5 ${cardBg}`}>
                        <h3 className="text-sm font-semibold">Spending Over Time (INR)</h3>
                        <div className="relative mt-4 h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analyticsSummary.timeSeries}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                              <YAxis stroke="#94A3B8" fontSize={11} />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="costInr"
                                name="Spend (INR)"
                                stroke="#10B981"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className={`rounded-xl border p-5 ${cardBg}`}>
                        <h3 className="text-sm font-semibold">Usage Distribution by Provider</h3>
                        <div className="relative mt-4 h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analyticsSummary.byProvider}
                                dataKey="tokens"
                                nameKey="name"
                                outerRadius={90}
                                label
                              >
                                {analyticsSummary.byProvider.map((_, idx) => (
                                  <Cell
                                    key={idx}
                                    fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className={`rounded-xl border p-5 ${cardBg}`}>
                        <h3 className="text-sm font-semibold">Usage Distribution by Model</h3>
                        <div className="relative mt-4 h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsSummary.byModel}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                              <XAxis dataKey="model" stroke="#94A3B8" fontSize={10} />
                              <YAxis stroke="#94A3B8" fontSize={11} />
                              <Tooltip />
                              <Bar dataKey="tokens" name="Tokens" fill="#6366F1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Activity Table */}
                  <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
                    <div className="border-b border-slate-800 px-5 py-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Recent Gateway Activity</h3>
                      <button
                        type="button"
                        onClick={() => setDashboardView('logs')}
                        className="text-xs text-indigo-400 hover:underline"
                      >
                        View All Logs →
                      </button>
                    </div>
                    {filteredUsageRecords.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No recent API requests recorded yet.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-800 text-slate-400 uppercase">
                          <tr>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">Provider</th>
                            <th className="px-4 py-3">Model</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Tokens</th>
                            <th className="px-4 py-3 text-right">Cost (INR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredUsageRecords.slice(0, 8).map((r) => (
                            <tr key={r.id}>
                              <td className="px-4 py-3 text-slate-400">
                                {formatDateTime(r.created_at)}
                              </td>
                              <td className="px-4 py-3 uppercase font-medium">{r.provider}</td>
                              <td className="px-4 py-3 font-mono text-indigo-400">{r.model}</td>
                              <td className="px-4 py-3">
                                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                  200 OK
                                </span>
                              </td>
                              <td className="px-4 py-3">{formatNumber(r.tokens_used)}</td>
                              <td className="px-4 py-3 text-right font-mono text-emerald-400">
                                {formatInr(r.cost_inr, true)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* 2. API KEYS VIEW */}
              {dashboardView === 'api-keys' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold">API Key Management</h1>
                    <p className="text-xs text-slate-400">
                      Generate and revoke <code className="text-indigo-300">genaff_sk_...</code>{' '}
                      keys via <code className="text-indigo-300">POST /keys</code>,{' '}
                      <code className="text-indigo-300">GET /keys</code>, and{' '}
                      <code className="text-indigo-300">DELETE /keys/:id</code>.
                    </p>
                  </div>

                  <div className={`rounded-xl border p-5 ${cardBg}`}>
                    <form
                      onSubmit={handleCreateApiKey}
                      className="flex flex-col gap-3 sm:flex-row sm:items-end"
                    >
                      <div className="flex-1">
                        <label className="block text-xs font-medium">Key Name</label>
                        <input
                          type="text"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          placeholder="e.g., Production Microservice, Mobile App Backend"
                          className={`mt-1 w-full rounded-lg border px-3.5 py-2 text-sm ${inputBg}`}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={creatingKey}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                        <span>{creatingKey ? 'Generating...' : 'Generate New Key'}</span>
                      </button>
                    </form>
                  </div>

                  {apiKeys.length === 0 ? (
                    <div className={`rounded-xl border border-dashed p-10 text-center ${cardBg}`}>
                      <KeyRound className="mx-auto h-7 w-7 text-slate-500" />
                      <h3 className="mt-2 text-sm font-semibold">No active API keys</h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Create your first key above to start making requests to{' '}
                        <code className="text-indigo-300">/v1/chat/completions</code>.
                      </p>
                    </div>
                  ) : (
                    <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-800 text-slate-400 uppercase">
                          <tr>
                            <th className="px-4 py-3.5">Name</th>
                            <th className="px-4 py-3.5">Masked Key Prefix</th>
                            <th className="px-4 py-3.5">Created</th>
                            <th className="px-4 py-3.5">Last Used</th>
                            <th className="px-4 py-3.5">Status</th>
                            <th className="px-4 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {apiKeys.map((k) => (
                            <tr key={k.id}>
                              <td className="px-4 py-3.5 font-semibold">
                                {k.name || 'Untitled Key'}
                              </td>
                              <td className="px-4 py-3.5 font-mono text-indigo-400">
                                {k.key_prefix}
                              </td>
                              <td className="px-4 py-3.5 text-slate-400">
                                {formatDateTime(k.created_at)}
                              </td>
                              <td className="px-4 py-3.5 text-slate-400">
                                {formatDateTime(k.last_used_at)}
                              </td>
                              <td className="px-4 py-3.5">
                                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                                  Active
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => setRevokeKeyModal(k)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-rose-600/15 px-2.5 py-1 text-xs font-medium text-rose-400 hover:bg-rose-600/25"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Revoke</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 3. MODELS & PROVIDERS EXPLORER */}
              {dashboardView === 'models' && (
                <div className="space-y-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h1 className="text-2xl font-bold">Models & AI Provider Explorer</h1>
                      <p className="text-xs text-slate-400">
                        Select any model to inspect capabilities, INR/USD token pricing, and open in
                        Playground.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void syncLiveModels()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-800"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Sync GET /v1/models</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="search"
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      placeholder="Search by model ID or display name..."
                      className={`flex-1 rounded-lg border px-3.5 py-2 text-sm ${inputBg}`}
                    />
                    <select
                      value={modelProviderFilter}
                      onChange={(e) => setModelProviderFilter(e.target.value)}
                      className={`rounded-lg border px-3.5 py-2 text-sm ${inputBg}`}
                    >
                      <option value="all">All Providers (4)</option>
                      <option value="openai">OpenAI</option>
                      <option value="deepseek">DeepSeek</option>
                      <option value="gemini">Google Gemini</option>
                      <option value="nvidia">NVIDIA NIM</option>
                    </select>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-3 lg:col-span-2">
                      {AUTHORITATIVE_MODEL_CATALOG.filter((m) => {
                        const matchP =
                          modelProviderFilter === 'all' || m.provider === modelProviderFilter;
                        const q = modelSearch.trim().toLowerCase();
                        const matchQ =
                          !q ||
                          m.id.toLowerCase().includes(q) ||
                          m.displayName.toLowerCase().includes(q);
                        return matchP && matchQ;
                      }).map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setSelectedModelDetail(m)}
                          className={`cursor-pointer rounded-xl border p-4 transition-colors ${cardBg} ${
                            selectedModelDetail.id === m.id
                              ? 'border-indigo-500 ring-1 ring-indigo-500/40'
                              : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{m.displayName}</span>
                                <span className="rounded bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
                                  {m.providerName}
                                </span>
                              </div>
                              <div className="mt-1 font-mono text-xs text-slate-400">{m.id}</div>
                              <p className="mt-2 text-xs text-slate-400">{m.description}</p>
                            </div>
                            <div className="text-right text-xs shrink-0">
                              <div>In: {formatInr(m.promptInrPer1k, true)}/1K</div>
                              <div className="mt-0.5">
                                Out: {formatInr(m.completionInrPer1k, true)}/1K
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={`rounded-xl border p-5 h-fit space-y-4 ${cardBg}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">{selectedModelDetail.displayName}</h3>
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                          {liveModelStatus[selectedModelDetail.id] ||
                            selectedModelDetail.defaultStatus}
                        </span>
                      </div>
                      <div className="rounded-lg bg-[#070B14] p-3 font-mono text-xs text-indigo-300">
                        {selectedModelDetail.id}
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Provider</span>
                          <span className="font-medium">{selectedModelDetail.providerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Prompt Pricing / 1K</span>
                          <span>
                            {formatInr(selectedModelDetail.promptInrPer1k, true)} ($
                            {selectedModelDetail.promptUsdPer1k})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Completion Pricing / 1K</span>
                          <span>
                            {formatInr(selectedModelDetail.completionInrPer1k, true)} ($
                            {selectedModelDetail.completionUsdPer1k})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Context Window</span>
                          <span>{formatNumber(selectedModelDetail.contextWindow)} tokens</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPgModel(selectedModelDetail.id);
                          setDashboardView('playground');
                        }}
                        className="w-full rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                      >
                        Test {selectedModelDetail.displayName} in Playground →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. INTERACTIVE API PLAYGROUND */}
              {dashboardView === 'playground' && (
                <div className="space-y-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h1 className="text-2xl font-bold">Interactive API Playground</h1>
                      <p className="text-xs text-slate-400">
                        Test live inference calls through{' '}
                        <code className="text-indigo-300">POST /v1/chat/completions</code>.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateEphemeralSessionKey}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>Provision Temporary Session Key (POST /playground/sessions)</span>
                    </button>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className={`rounded-xl border p-5 ${cardBg}`}>
                      <form onSubmit={handleSendPlaygroundRequest} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium">Model</label>
                          <select
                            value={pgModel}
                            onChange={(e) => setPgModel(e.target.value)}
                            className={`mt-1 w-full rounded-lg border px-3 py-2 text-xs ${inputBg}`}
                          >
                            {AUTHORITATIVE_MODEL_CATALOG.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.displayName} — {m.id} ({formatInr(m.promptInrPer1k, true)}/1K in)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium">
                            GenAff API Key (`genaff_sk_...`)
                          </label>
                          <input
                            type="password"
                            value={pgApiKey}
                            onChange={(e) => setPgApiKey(e.target.value)}
                            placeholder="Paste your genaff_sk_... key or click Provision Temporary Session Key"
                            className={`mt-1 w-full rounded-lg border px-3 py-2 font-mono text-xs ${inputBg}`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium">System Prompt</label>
                          <textarea
                            rows={2}
                            value={pgSystemPrompt}
                            onChange={(e) => setPgSystemPrompt(e.target.value)}
                            className={`mt-1 w-full rounded-lg border p-2.5 text-xs ${inputBg}`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium">User Message</label>
                          <textarea
                            rows={4}
                            value={pgUserPrompt}
                            onChange={(e) => setPgUserPrompt(e.target.value)}
                            className={`mt-1 w-full rounded-lg border p-2.5 text-xs ${inputBg}`}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium">
                              Temperature: {pgTemp}
                            </label>
                            <input
                              type="range"
                              min={0}
                              max={1.5}
                              step={0.1}
                              value={pgTemp}
                              onChange={(e) => setPgTemp(Number(e.target.value))}
                              className="mt-2 w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium">Max Tokens</label>
                            <input
                              type="number"
                              min={16}
                              max={8192}
                              value={pgMaxTokens}
                              onChange={(e) => setPgMaxTokens(Number(e.target.value))}
                              className={`mt-1 w-full rounded-lg border px-3 py-1.5 text-xs ${inputBg}`}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={pgSending}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                          <Play className="h-3.5 w-3.5" />
                          <span>{pgSending ? 'Routing Request...' : 'Send Request'}</span>
                        </button>
                      </form>
                    </div>

                    <div className="space-y-4">
                      {/* Response Viewer */}
                      <div className={`rounded-xl border p-5 space-y-3 ${cardBg}`}>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <span className="text-xs font-semibold">Gateway Response</span>
                          <div className="flex items-center gap-2">
                            {pgLatencyMs !== null && (
                              <span className="font-mono text-xs text-emerald-400">
                                {pgLatencyMs} ms
                              </span>
                            )}
                            {pgResponse && (
                              <button
                                type="button"
                                onClick={() => {
                                  copyTextToClipboard(pgResponse);
                                  pushToast({
                                    tone: 'info',
                                    title: 'Copied',
                                    description: 'Response copied to clipboard.',
                                  });
                                }}
                                className="rounded border border-slate-700 px-2 py-0.5 text-[11px] hover:bg-slate-800"
                              >
                                Copy
                              </button>
                            )}
                          </div>
                        </div>

                        {pgError && (
                          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs text-rose-300">
                            {pgError}
                          </div>
                        )}

                        {pgUsage && (
                          <div className="grid grid-cols-3 gap-2 rounded-lg bg-[#070B14] p-2.5 text-xs">
                            <div>
                              <span className="text-slate-400">Total Tokens:</span>{' '}
                              <strong>{pgUsage.total_tokens}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400">In/Out:</span>{' '}
                              <strong>
                                {pgUsage.prompt_tokens}/{pgUsage.completion_tokens}
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400">Cost:</span>{' '}
                              <strong className="text-emerald-400">
                                {formatInr(pgUsage.cost_inr, true)}
                              </strong>
                            </div>
                          </div>
                        )}

                        <pre className="max-h-60 overflow-auto rounded-lg bg-[#070B14] p-3 font-mono text-xs text-slate-200 whitespace-pre-wrap">
                          {pgResponse || '// Send a request to view completion output'}
                        </pre>
                      </div>

                      {/* Request Body & Code Snippets */}
                      <div className={`rounded-xl border p-5 space-y-3 ${cardBg}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {(['curl', 'js', 'python'] as const).map((tab) => (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => setPgCodeTab(tab)}
                                className={`rounded px-2.5 py-1 text-xs font-medium uppercase ${
                                  pgCodeTab === tab
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                              >
                                {tab}
                              </button>
                            ))}
                          </div>
                        </div>
                        <pre className="max-h-48 overflow-auto rounded-lg bg-[#070B14] p-3 font-mono text-[11px] text-slate-300">
                          {pgCodeTab === 'curl'
                            ? `curl ${apiBaseUrl}/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer ${
                                pgApiKey ? `${pgApiKey.slice(0, 12)}...` : 'genaff_sk_...'
                              }" \\\n  -d '${JSON.stringify(
                                {
                                  model: pgModel,
                                  messages: [
                                    { role: 'system', content: pgSystemPrompt },
                                    { role: 'user', content: pgUserPrompt },
                                  ],
                                  temperature: pgTemp,
                                  max_tokens: pgMaxTokens,
                                },
                                null,
                                2
                              )}'`
                            : pgCodeTab === 'js'
                            ? `const endpoint = "${apiBaseUrl}/v1/chat/completions";
const response = await fetch(endpoint, {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "Authorization": "Bearer genaff_sk_..."\n  },\n  body: JSON.stringify({\n    model: "${pgModel}",\n    messages: [{ role: "user", content: ${JSON.stringify(
                                pgUserPrompt
                              )} }],\n    temperature: ${pgTemp}\n  })\n});`
                            : `import requests\n\nres = requests.post(\n    "${apiBaseUrl}/v1/chat/completions",\n    headers={"Authorization": "Bearer genaff_sk_..."},\n    json={\n        "model": "${pgModel}",\n        "messages": [{"role": "user", "content": ${JSON.stringify(
                                pgUserPrompt
                              )}}]\n    }\n)`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. USAGE ANALYTICS & REQUEST LOGS */}
              {(dashboardView === 'analytics' || dashboardView === 'logs') && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {dashboardView === 'analytics' ? 'Usage Analytics' : 'Request Logs'}
                    </h1>
                    <p className="text-xs text-slate-400">
                      Filter metered completions by time window, provider, model, and API key.
                    </p>
                  </div>

                  {/* Filters Bar */}
                  <div className={`grid gap-3 sm:grid-cols-4 rounded-xl border p-4 ${cardBg}`}>
                    <div>
                      <label className="block text-[11px] text-slate-400">Time Period</label>
                      <select
                        value={timeRange}
                        onChange={(e) =>
                          setTimeRange(e.target.value as '24h' | '7d' | '30d' | '90d')
                        }
                        className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-xs ${inputBg}`}
                      >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400">Provider</label>
                      <select
                        value={analyticsProviderFilter}
                        onChange={(e) => setAnalyticsProviderFilter(e.target.value)}
                        className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-xs ${inputBg}`}
                      >
                        <option value="all">All Providers</option>
                        <option value="openai">OpenAI</option>
                        <option value="deepseek">DeepSeek</option>
                        <option value="gemini">Google Gemini</option>
                        <option value="nvidia">NVIDIA NIM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400">Model</label>
                      <select
                        value={analyticsModelFilter}
                        onChange={(e) => setAnalyticsModelFilter(e.target.value)}
                        className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-xs ${inputBg}`}
                      >
                        <option value="all">All Models</option>
                        {AUTHORITATIVE_MODEL_CATALOG.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.displayName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400">API Key</label>
                      <select
                        value={analyticsKeyFilter}
                        onChange={(e) => setAnalyticsKeyFilter(e.target.value)}
                        className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-xs ${inputBg}`}
                      >
                        <option value="all">All API Keys</option>
                        {apiKeys.map((k) => (
                          <option key={k.id} value={k.key_prefix}>
                            {k.name || k.key_prefix}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Backend Schema Transparency Banner */}
                  <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3.5 text-xs text-indigo-200">
                    <strong>Backend Telemetry Note:</strong> In{' '}
                    <code className="text-indigo-100">src/services/usageService.js</code>, the{' '}
                    <code className="text-indigo-100">Usage</code> table records completed requests
                    with <code className="text-indigo-100">id</code>,{' '}
                    <code className="text-indigo-100">provider</code>,{' '}
                    <code className="text-indigo-100">model</code>,{' '}
                    <code className="text-indigo-100">tokens_used</code>,{' '}
                    <code className="text-indigo-100">cost_inr</code>,{' '}
                    <code className="text-indigo-100">api_key</code>, and{' '}
                    <code className="text-indigo-100">created_at</code>. Per-request latency (ms) and
                    failed HTTP status codes (4xx/5xx) are not persisted in PostgreSQL.
                  </div>

                  {/* Paginated Request Logs Table */}
                  <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
                    {filteredUsageRecords.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        No request logs match your current filters.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-800 text-slate-400 uppercase">
                          <tr>
                            <th className="px-4 py-3">Request ID</th>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">Provider</th>
                            <th className="px-4 py-3">Model</th>
                            <th className="px-4 py-3">API Key</th>
                            <th className="px-4 py-3">Tokens</th>
                            <th className="px-4 py-3">Cost (INR)</th>
                            <th className="px-4 py-3 text-right">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {filteredUsageRecords.map((rec) => (
                            <tr key={rec.id}>
                              <td className="px-4 py-3 font-mono text-slate-300">
                                {rec.id.slice(0, 12)}
                              </td>
                              <td className="px-4 py-3 text-slate-400">
                                {formatDateTime(rec.created_at)}
                              </td>
                              <td className="px-4 py-3 uppercase">{rec.provider}</td>
                              <td className="px-4 py-3 font-mono text-indigo-400">{rec.model}</td>
                              <td className="px-4 py-3 font-mono text-slate-400">
                                {rec.api_key?.key_prefix || '—'}
                              </td>
                              <td className="px-4 py-3">{formatNumber(rec.tokens_used)}</td>
                              <td className="px-4 py-3 font-mono text-emerald-400">
                                {formatInr(rec.cost_inr, true)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedLogDrawer(rec)}
                                  className="text-indigo-400 hover:underline"
                                >
                                  Inspect
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* 6. WALLET & RAZORPAY STANDARD CHECKOUT */}
              {dashboardView === 'wallet' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold">Prepaid INR Wallet & Razorpay Top-Up</h1>
                    <p className="text-xs text-slate-400">
                      Connected to <code className="text-indigo-300">GET /wallet</code>,{' '}
                      <code className="text-indigo-300">POST /wallet/topup/order</code>,{' '}
                      <code className="text-indigo-300">POST /wallet/topup/verify</code>, and{' '}
                      <code className="text-indigo-300">GET /wallet/history</code>.
                    </p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className={`rounded-xl border p-6 flex flex-col justify-between ${cardBg}`}>
                      <div>
                        <div className="text-xs uppercase text-slate-400">Available Balance</div>
                        <div className="mt-2 text-4xl font-extrabold text-emerald-400">
                          {formatInr(walletBalanceInr)}
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                          Credited strictly after server-side Razorpay signature verification.
                        </p>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-2">
                        <a
                          href={`${apiBaseUrl}/wallet/statement/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          <span>Statement PDF</span>
                        </a>
                        <a
                          href={`${apiBaseUrl}/wallet/billing/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          <span>Combined Billing PDF</span>
                        </a>
                      </div>
                    </div>

                    <div className={`rounded-xl border p-6 lg:col-span-2 ${cardBg}`}>
                      <h3 className="text-base font-bold">Top Up with Razorpay Standard Checkout</h3>
                      <form onSubmit={handleInitiateTopUp} className="mt-4 space-y-4">
                        <div>
                          <label className="block text-xs font-medium">
                            Amount in INR (Minimum ₹{MIN_TOPUP_INR} INR)
                          </label>
                          <div className="mt-1.5 flex gap-3">
                            <input
                              type="number"
                              min={MIN_TOPUP_INR}
                              step="1"
                              value={topUpAmountInput}
                              onChange={(e) => setTopUpAmountInput(e.target.value)}
                              className={`w-full rounded-lg border px-3.5 py-2 text-sm ${inputBg}`}
                              required
                            />
                            <button
                              type="submit"
                              disabled={topUpProcessing}
                              className="shrink-0 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                              {topUpProcessing ? 'Processing...' : 'Pay via Razorpay'}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {[50, 100, 250, 500, 1000, 2500].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setTopUpAmountInput(String(amt))}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                                Number(topUpAmountInput) === amt
                                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                                  : 'border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              +{formatInr(amt)}
                            </button>
                          ))}
                        </div>

                        {walletStatusBanner && (
                          <div
                            className={`rounded-lg border p-3 text-xs ${
                              walletStatusBanner.tone === 'success'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : walletStatusBanner.tone === 'danger'
                                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                                : walletStatusBanner.tone === 'warning'
                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                                : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                            }`}
                          >
                            {walletStatusBanner.text}
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. TRANSACTIONS LEDGER */}
              {dashboardView === 'transactions' && (
                <div className="space-y-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h1 className="text-2xl font-bold">Transactions History</h1>
                      <p className="text-xs text-slate-400">
                        Distinguishes Razorpay wallet top-up credits (<code className="text-emerald-400">+INR</code>) from API usage debits (<code className="text-amber-400">-INR</code>).
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={txTypeFilter}
                        onChange={(e) =>
                          setTxTypeFilter(e.target.value as 'all' | 'credit' | 'debit')
                        }
                        className={`rounded-lg border px-3 py-1.5 text-xs ${inputBg}`}
                      >
                        <option value="all">All Types</option>
                        <option value="credit">Top-Up Credits (+INR)</option>
                        <option value="debit">Usage Debits (-INR)</option>
                      </select>
                      <select
                        value={txStatusFilter}
                        onChange={(e) => setTxStatusFilter(e.target.value)}
                        className={`rounded-lg border px-3 py-1.5 text-xs ${inputBg}`}
                      >
                        <option value="all">All Statuses</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="FAILED">FAILED</option>
                      </select>
                    </div>
                  </div>

                  <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
                    {unifiedLedger.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        No transactions recorded yet.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-800 text-slate-400 uppercase">
                          <tr>
                            <th className="px-4 py-3">Reference</th>
                            <th className="px-4 py-3">Date & Time</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Amount (INR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {unifiedLedger.map((tx) => (
                            <tr
                              key={tx.id}
                              onClick={() => setSelectedTxModal(tx)}
                              className="cursor-pointer hover:bg-slate-800/30"
                            >
                              <td className="px-4 py-3 font-mono">{tx.reference}</td>
                              <td className="px-4 py-3 text-slate-400">
                                {formatDateTime(tx.created_at)}
                              </td>
                              <td className="px-4 py-3">
                                {tx.type === 'TOPUP_CREDIT' ? (
                                  <span className="text-emerald-400 font-semibold">
                                    Wallet Top-Up
                                  </span>
                                ) : (
                                  <span className="text-amber-400 font-semibold">Usage Debit</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-slate-300">{tx.details}</td>
                              <td className="px-4 py-3">{tx.status}</td>
                              <td
                                className={`px-4 py-3 text-right font-mono font-semibold ${
                                  tx.type === 'TOPUP_CREDIT'
                                    ? 'text-emerald-400'
                                    : 'text-amber-400'
                                }`}
                              >
                                {tx.type === 'TOPUP_CREDIT' ? '+' : '-'}
                                {formatInr(tx.amount_inr, tx.type === 'USAGE_DEBIT')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* 8. DASHBOARD DOCS / PRICING / PROFILE / SETTINGS / SUPPORT */}
              {dashboardView === 'docs' && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">API Documentation</h1>
                  <div className={`rounded-xl border p-5 space-y-3 text-xs ${cardBg}`}>
                    <p>
                      <strong>Endpoint:</strong>{' '}
                      <code className="text-indigo-400">
                        POST {apiBaseUrl}/v1/chat/completions
                      </code>
                    </p>
                    <p>
                      <strong>Header:</strong>{' '}
                      <code className="text-emerald-400">
                        Authorization: Bearer genaff_sk_...
                      </code>
                    </p>
                  </div>
                </div>
              )}

              {dashboardView === 'pricing' && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Model Pricing Reference (1 USD = ₹86 INR)</h1>
                  <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-800 text-slate-400 uppercase">
                        <tr>
                          <th className="px-4 py-3">Model ID</th>
                          <th className="px-4 py-3">Prompt / 1K (INR)</th>
                          <th className="px-4 py-3">Completion / 1K (INR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {AUTHORITATIVE_MODEL_CATALOG.map((m) => (
                          <tr key={m.id}>
                            <td className="px-4 py-3 font-mono text-indigo-400">{m.id}</td>
                            <td className="px-4 py-3">{formatInr(m.promptInrPer1k, true)}</td>
                            <td className="px-4 py-3">{formatInr(m.completionInrPer1k, true)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {(dashboardView === 'profile' ||
                dashboardView === 'settings' ||
                dashboardView === 'support') && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold capitalize">{dashboardView}</h1>
                  <div className={`rounded-xl border p-6 space-y-4 ${cardBg}`}>
                    {user && (
                      <div className="grid gap-4 sm:grid-cols-2 text-xs">
                        <div>
                          <div className="text-slate-400">User ID</div>
                          <div className="mt-1 font-mono">{user.id}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">Email Address</div>
                          <div className="mt-1 font-semibold">{user.email}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">Email Verification Status</div>
                          <div className="mt-1">
                            {user.is_verified ? (
                              <span className="text-emerald-400 font-semibold">Verified</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => void handleResendVerification(user.email)}
                                className="text-amber-400 underline"
                              >
                                Unverified — Click to Resend OTP
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400">Account Status</div>
                          <div className="mt-1 font-semibold">{user.status || 'ACTIVE'}</div>
                        </div>
                      </div>
                    )}
                    <div className="border-t border-slate-800 pt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        className="rounded-lg border border-slate-700 px-3.5 py-2 text-xs font-medium"
                      >
                        Switch to {isDark ? 'Light' : 'Dark'} Theme
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(user?.email || '');
                          setForgotModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-700 px-3.5 py-2 text-xs font-medium"
                      >
                        Reset Password via Email OTP
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfigModalOpen(true)}
                        className="rounded-lg border border-indigo-500/40 px-3.5 py-2 text-xs font-medium text-indigo-400"
                      >
                        Configure API & Razorpay Public Key
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* MODAL 1: One-Time API Key Secret Reveal */}
      {createdPlaintextKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 ${cardBg}`}>
            <h3 className="text-lg font-bold">Save Your New GenAff API Key</h3>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              <strong>Important Security Notice:</strong> The backend stores only the SHA-256 hash of
              this key. Copy and store it securely now — it cannot be retrieved again.
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-[#070B14] p-3 font-mono text-xs text-emerald-400">
              <span className="break-all">{createdPlaintextKey}</span>
              <button
                type="button"
                onClick={() => {
                  copyTextToClipboard(createdPlaintextKey);
                  pushToast({
                    tone: 'success',
                    title: 'Copied',
                    description: 'API key copied to clipboard.',
                  });
                }}
                className="shrink-0 rounded bg-slate-800 px-3 py-1.5 text-xs text-white hover:bg-slate-700"
              >
                Copy
              </button>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCreatedPlaintextKey(null)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
              >
                I Have Saved My Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Revoke Key Confirmation */}
      {revokeKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 ${cardBg}`}>
            <h3 className="text-lg font-bold">Revoke API Key?</h3>
            <p className="text-xs text-slate-400">
              Permanently revoke <strong>{revokeKeyModal.name || revokeKeyModal.key_prefix}</strong>?
              Applications using this key will immediately fail with 401 Unauthorized.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRevokeKeyModal(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmRevokeKey()}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Revoke Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Email OTP Verification */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 ${cardBg}`}>
            <h3 className="text-lg font-bold">Verify Your Email (`POST /auth/verify-otp`)</h3>
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <input
                type="email"
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-xs ${inputBg}`}
                required
              />
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="6-digit OTP code"
                className={`w-full rounded-lg border px-3 py-2 font-mono text-xs ${inputBg}`}
                required
              />
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => void handleResendVerification(otpEmail)}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Resend OTP
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOtpModal(false)}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Forgot / Reset Password */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 ${cardBg}`}>
            <h3 className="text-lg font-bold">Reset Account Password</h3>
            {forgotStep === 'request' ? (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Account email"
                  className={`w-full rounded-lg border px-3 py-2 text-xs ${inputBg}`}
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    Send Reset OTP
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <input
                  type="text"
                  maxLength={6}
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className={`w-full rounded-lg border px-3 py-2 font-mono text-xs ${inputBg}`}
                  required
                />
                <input
                  type="password"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  placeholder="New password (min 8 chars)"
                  className={`w-full rounded-lg border px-3 py-2 text-xs ${inputBg}`}
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 5: Request Log Detail Drawer */}
      {selectedLogDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70">
          <div className={`h-full w-full max-w-md border-l p-6 space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold">Request Telemetry Detail</h3>
              <button type="button" onClick={() => setSelectedLogDrawer(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Request ID</span>
                <span className="font-mono">{selectedLogDrawer.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp</span>
                <span>{formatDateTime(selectedLogDrawer.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provider</span>
                <span className="uppercase">{selectedLogDrawer.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Model</span>
                <span className="font-mono text-indigo-400">{selectedLogDrawer.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tokens Consumed</span>
                <span>{formatNumber(selectedLogDrawer.tokens_used)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Debited Cost (INR)</span>
                <span className="font-mono text-emerald-400">
                  {formatInr(selectedLogDrawer.cost_inr, true)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Transaction Detail Modal */}
      {selectedTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold">Transaction Record</h3>
              <button type="button" onClick={() => setSelectedTxModal(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Reference</span>
                <span className="font-mono">{selectedTxModal.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type</span>
                <span>{selectedTxModal.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount</span>
                <span className="font-mono font-bold">
                  {formatInr(selectedTxModal.amount_inr, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span>{selectedTxModal.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date</span>
                <span>{formatDateTime(selectedTxModal.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Environment & Connection Config */}
      {configModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold">Environment & Gateway Connection</h3>
              <button type="button" onClick={() => setConfigModalOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium">VITE_API_BASE_URL</label>
                <input
                  type="url"
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value.replace(/\/+$/, ''))}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 font-mono ${inputBg}`}
                />
              </div>
              <div>
                <label className="block font-medium">
                  VITE_RAZORPAY_KEY_ID (Public Key Only — Never Secret)
                </label>
                <input
                  type="text"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value.trim())}
                  placeholder="rzp_test_..."
                  className={`mt-1 w-full rounded-lg border px-3 py-2 font-mono ${inputBg}`}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-800 p-3">
                <div>
                  <div className="font-semibold">Interactive Sandbox Fallback Simulator</div>
                  <div className="text-[11px] text-slate-400">
                    Enable only to test flows inside an offline/sandboxed browser preview when
                    api.raiyanali.tech is unreachable.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sandboxFallbackMode}
                  onChange={(e) => setSandboxFallbackMode(e.target.checked)}
                  className="h-4 w-4"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setConfigModalOpen(false);
                  void checkBackendHealth();
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Save & Verify Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export interface Project {
  title: string;
  description: string;
  tags: string[];
  color: string;
  link: string;
  specs: string[];
}

export const projects: { en: Project[]; ja: Project[] } = {
  en: [
    {
      title: "Aero",
      description: "Next-gen local file transfer reaching 100MB/s+ over LAN. Feature-rich desktop app with E2EE (AES-256-CTR) and zero-trust optical handshake.",
      tags: ["Go", "Wails", "React", "Crypto"],
      color: "#06b6d4",
      link: "https://github.com/HarshalPatel1972/aero",
      specs: ["// SPEED_100MBPS+", "// E2EE_AES_256", "// NO_CLOUD_PROTOCOL_"]
    },
    {
      title: "RIFT",
      description: "Zero-friction air typing bridge. Turns any smartphone into a high-performance PC input device via WebSockets and Win32 API without app install.",
      tags: ["Go", "WebSocket", "Win32 API"],
      color: "#8b5cf6",
      link: "https://github.com/HarshalPatel1972/rift",
      specs: ["// LATENCY_SUB_50MS", "// ZERO_FRICTION_AUTH", "// HEADLESS_WRAPPER_"]
    },
    {
      title: "Momentum",
      description: "The bridge between AI Agents and your pocket. Remote approval system for Cursor/Windsurf via Telegram, keeping high-risk executions secure.",
      tags: ["MCP", "Node.js", "Telegram", "Go"],
      color: "#f97316",
      link: "https://github.com/HarshalPatel1972/momentum",
      specs: ["// MCP_READY", "// TELEGRAM_BRIDGE", "// SECURE_REMOTE_EXEC_"]
    },
    {
      title: "GoSync",
      description: "Offline-first sync engine using Merkle Trees for delta synchronization. Redlining data transfer up to 70% with IndexedDB cold storage.",
      tags: ["Go", "WASM", "Next.js", "IndexedDB"],
      color: "#10b981",
      link: "https://github.com/HarshalPatel1972/gosync",
      specs: ["// DELTA_SYNC_70%", "// MERKLE_TREE_VALIDATION", "// OFFLINE_FIRST_"]
    },
    {
      title: "Velocity",
      description: "Windows system tray optimizer reducing WhatsApp RAM from 370MB to 90MB. Implements EcoQoS CPU governor and automated memory trimming.",
      tags: ["C++", "Win32", "Optimization"],
      color: "#f43f5e",
      link: "#",
      specs: ["// RAM_SAVINGS_75%", "// ECO_QOS_PRIORITY", "// MEMORY_TRIM_ENGINE_"]
    },
    {
      title: "WinLight",
      description: "Rust-powered Spotlight-like search indexing 50,000+ files. Multi-strategy ranked matching returning results under 100ms.",
      tags: ["Rust", "Tauri", "Algorithms"],
      color: "#3b82f6",
      link: "#",
      specs: ["// INDEX_50K_FILES", "// LATENCY_SUB_100MS", "// RUST_CONCURRENCY_"]
    },
    {
      title: "A1 Tantra",
      description: "High-performance spiritual guidance platform. Achieved sub-second multi-page navigation with serverless lead-generation architecture.",
      tags: ["Next.js", "Tailwind", "SEO"],
      color: "#eab308",
      link: "#",
      specs: ["// SUB_SECOND_NAV", "// SERVERLESS_LEADS", "// OPTIMIZED_AESTHETIC_"]
    }
  ],
  ja: [
    {
      title: "Aero (エアロ)",
      description: "LAN経由で100MB/s+に達する次世代のローカルファイル転送。E2EE（AES-256-CTR）とゼロトラスト光学的ハンドシェイクを備えた、機能豊かなデスクトップアプリ。",
      tags: ["Go", "Wails", "React", "暗号"],
      color: "#06b6d4",
      link: "https://github.com/HarshalPatel1972/aero",
      specs: ["// 速度_100MBPS+", "// E2EE_AES_256", "// クライドレスプロトコル_"]
    },
    {
      title: "RIFT (リフト)",
      description: "摩擦ゼロのエアタイピングブリッジ。アプリのインストールなしで、WebSocketsとWin32 APIを介してあらゆるスマートフォンを高性能なPC入力デバイスに変えます。",
      tags: ["Go", "WebSocket", "Win32 API"],
      color: "#8b5cf6",
      link: "https://github.com/HarshalPatel1972/rift",
      specs: ["// 遅延_50MS未満", "// 摩擦ゼロ認証", "// ヘッドレスラッパー_"]
    },
    {
      title: "Momentum (モメンタム)",
      description: "AIエージェントとあなたのポケットをつなぐ架け橋。Telegramを介したCursor/Windsurf用のリモート承認システムにより、リスクの高い実行を安全に保ちます。",
      tags: ["MCP", "Node.js", "Telegram", "Go"],
      color: "#f97316",
      link: "https://github.com/HarshalPatel1972/momentum",
      specs: ["// MCP対応済", "// テレグラムブリッジ", "// 安全なリモート実行_"]
    },
    {
      title: "GoSync (ゴー・シンク)",
      description: "デルタ同期にマークルツリーを使用するオフラインファーストの同期エンジン。IndexedDBコールドストレージによりデータ転送を最大70%削減。",
      tags: ["Go", "WASM", "Next.js", "IndexedDB"],
      color: "#10b981",
      link: "https://github.com/HarshalPatel1972/gosync",
      specs: ["// デルタ同期_70%", "// マークルツリー検証", "// オフラインファースト_"]
    },
    {
      title: "Velocity (ベロシティ)",
      description: "WhatsAppのデスクトップRAMを370MBから90MBに削減するWindowsシステムトレイ最適化ツール。EcoQoS CPUガバナーと自動メモリトリミングを実装。",
      tags: ["C++", "Win32", "最適化"],
      color: "#f43f5e",
      link: "#",
      specs: ["// RAM削減率_75%", "// ECO_QOS優先度", "// メモリトリミングエンジン_"]
    },
    {
      title: "WinLight (ウィン・ライト)",
      description: "50,000以上のファイルをインデックス化する、Rust駆動のSpotlight風検索。100ms未満で結果を返すマルチ戦略のランク付けマッチング。",
      tags: ["Rust", "Tauri", "アルゴリズム"],
      color: "#3b82f6",
      link: "#",
      specs: ["// 50Kファイル検索", "// 遅延_100MS未満", "// RUST並行処理_"]
    },
    {
      title: "A1 Tantra (A1タントラ)",
      description: "高性能な精神的ガイダンスプラットフォーム。サーバーレスリードジェネレーションアーキテクチャにより、1秒未満のマルチページナビゲーションを実現。",
      tags: ["Next.js", "Tailwind", "SEO"],
      color: "#eab308",
      link: "#",
      specs: ["// 1秒未満のナビ", "// サーバーレスリード", "// 最適化された美学_"]
    }
  ]
};

export interface Project {
  title: string;
  description: string;
  tags: string[];
  color: string;
  link: string;
  slug: string;
  mobileScreenshot: string;
  specs: string[];
}

export const projects: { en: Project[]; ja: Project[]; ko: Project[]; "zh-tw": Project[] } = {
  en: [
    {
      title: "Aero",
      description: "Next-gen local file transfer reaching 100MB/s+ over LAN. Feature-rich desktop app with E2EE (AES-256-CTR) and zero-trust optical handshake.",
      tags: ["Go", "Wails", "React", "Crypto"],
      color: "#06b6d4",
      link: "https://github.com/HarshalPatel1972/aero",
      slug: "aero",
      mobileScreenshot: "/screenshots_phone/Aero.jpg",
      specs: ["// SPEED_100MBPS+", "// E2EE_AES_256", "// NO_CLOUD_PROTOCOL_"]
    },
    {
      title: "RIFT",
      description: "Zero-friction air typing bridge. Turns any smartphone into a high-performance PC input device via WebSockets and Win32 API without app install.",
      tags: ["Go", "WebSocket", "Win32 API"],
      color: "#8b5cf6",
      link: "https://github.com/HarshalPatel1972/rift",
      slug: "rift",
      mobileScreenshot: "/screenshots_phone/Rift.jpg",
      specs: ["// LATENCY_SUB_50MS", "// ZERO_FRICTION_AUTH", "// HEADLESS_WRAPPER_"]
    },
    {
      title: "Momentum",
      description: "The bridge between AI Agents and your pocket. Remote approval system for Cursor/Windsurf via Telegram, keeping high-risk executions secure.",
      tags: ["MCP", "Node.js", "Telegram", "Go"],
      color: "#f97316",
      link: "https://github.com/HarshalPatel1972/momentum",
      slug: "momentum",
      mobileScreenshot: "/screenshots_phone/Momentum.jpg",
      specs: ["// MCP_READY", "// TELEGRAM_BRIDGE", "// SECURE_REMOTE_EXEC_"]
    },
    {
      title: "GoSync",
      description: "Offline-first sync engine using Merkle Trees for delta synchronization. Redlining data transfer up to 70% with IndexedDB cold storage.",
      tags: ["Go", "WASM", "Next.js", "IndexedDB"],
      color: "#10b981",
      link: "https://github.com/HarshalPatel1972/gosync",
      slug: "gosync",
      mobileScreenshot: "/screenshots_phone/GoSync.jpg",
      specs: ["// DELTA_SYNC_70%", "// MERKLE_TREE_VALIDATION", "// OFFLINE_FIRST_"]
    },
    {
      title: "Velocity",
      description: "Windows system tray optimizer reducing WhatsApp RAM from 370MB to 90MB. Implements EcoQoS CPU governor and automated memory trimming.",
      tags: ["C++", "Win32", "Optimization"],
      color: "#f43f5e",
      link: "https://github.com/HarshalPatel1972/velocity",
      slug: "velocity",
      mobileScreenshot: "/screenshots_phone/Velocity.jpg",
      specs: ["// RAM_SAVINGS_75%", "// ECO_QOS_PRIORITY", "// MEMORY_TRIM_ENGINE_"]
    },
    {
      title: "WinLight",
      description: "Rust-powered Spotlight-like search indexing 50,000+ files. Multi-strategy ranked matching returning results under 100ms.",
      tags: ["Rust", "Tauri", "Algorithms"],
      color: "#3b82f6",
      link: "https://github.com/HarshalPatel1972/win-light",
      slug: "win-light",
      mobileScreenshot: "/screenshots_phone/Win-light.jpg",
      specs: ["// INDEX_50K_FILES", "// LATENCY_SUB_100MS", "// RUST_CONCURRENCY_"]
    },
    {
      title: "A1 Tantra",
      description: "High-performance spiritual guidance platform. Achieved sub-second multi-page navigation with serverless lead-generation architecture.",
      tags: ["Next.js", "Tailwind", "SEO"],
      color: "#eab308",
      link: "https://a1-tantra.vercel.app/",
      slug: "a1-tantra",
      mobileScreenshot: "/screenshots_phone/A1 TANTRA.jpg",
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
      slug: "aero",
      mobileScreenshot: "/screenshots_phone/Aero.jpg",
      specs: ["// 速度_100MBPS+", "// E2EE_AES_256", "// クライドレスプロトコル_"]
    },
    {
      title: "RIFT (リフト)",
      description: "摩擦ゼロのエアタイピングブリッジ。アプリのインストールなしで、WebSocketsとWin32 APIを介してあらゆるスマートフォンを高性能なPC入力デバイスに変えます。",
      tags: ["Go", "WebSocket", "Win32 API"],
      color: "#8b5cf6",
      link: "https://github.com/HarshalPatel1972/rift",
      slug: "rift",
      mobileScreenshot: "/screenshots_phone/Rift.jpg",
      specs: ["// 遅延_50MS未満", "// 摩擦ゼロ認証", "// ヘッドレスラッパー_"]
    },
    {
      title: "Momentum (モメンタム)",
      description: "AIエージェントとあなたのポケットをつなぐ架け橋。Telegramを介した Cursor/Windsurf用のリモート承認システムにより、リスクの高い実行を安全に保ちます。",
      tags: ["MCP", "Node.js", "Telegram", "Go"],
      color: "#f97316",
      link: "https://github.com/HarshalPatel1972/momentum",
      slug: "momentum",
      mobileScreenshot: "/screenshots_phone/Momentum.jpg",
      specs: ["// MCP対応済", "// テレグラムブリッジ", "// 安全なリモート実行_"]
    },
    {
      title: "GoSync (ゴー・シンク)",
      description: "デルタ同期にマークルツリーを使用するオフラインファーストの同期エンジン。IndexedDBコールドストレージによりデータ転送を最大70%削減。",
      tags: ["Go", "WASM", "Next.js", "IndexedDB"],
      color: "#10b981",
      link: "https://github.com/HarshalPatel1972/gosync",
      slug: "gosync",
      mobileScreenshot: "/screenshots_phone/GoSync.jpg",
      specs: ["// デルタ同期_70%", "// マークルツリー検証", "// オフラインファースト_"]
    },
    {
      title: "Velocity (ベロシティ)",
      description: "WhatsAppのデスクトップRAMを370MBから90MBに削減するWindowsシステムトレイ最適化ツール。EcoQoS CPUガバナーと自動メモリトリミングを実装。",
      tags: ["C++", "Win32", "最適化"],
      color: "#f43f5e",
      link: "https://github.com/HarshalPatel1972/velocity",
      slug: "velocity",
      mobileScreenshot: "/screenshots_phone/Velocity.jpg",
      specs: ["// RAM削減率_75%", "// ECO_QOS優先度", "// メモリトリミングエンジン_"]
    },
    {
      title: "WinLight (ウィン・ライト)",
      description: "50,000以上のファイルをインデックス化する、Rust駆動のSpotlight風検索。100ms未満で結果を返すマルチ戦略のランク付けマッチング。",
      tags: ["Rust", "Tauri", "アルゴリズム"],
      color: "#3b82f6",
      link: "https://github.com/HarshalPatel1972/win-light",
      slug: "win-light",
      mobileScreenshot: "/screenshots_phone/Win-light.jpg",
      specs: ["// 50Kファイル検索", "// 遅延_100MS未満", "// RUST並行処理_"]
    },
    {
      title: "A1 Tantra (A1タントラ)",
      description: "高性能な精神的ガイダンスプラットフォーム。サーバーレスリードジェネレーションアーキテクチャにより、1秒未満のマルチページナビゲーションを実現。",
      tags: ["Next.js", "Tailwind", "SEO"],
      color: "#eab308",
      link: "https://a1-tantra.vercel.app/",
      slug: "a1-tantra",
      mobileScreenshot: "/screenshots_phone/A1 TANTRA.jpg",
      specs: ["// 1秒未満のナビ", "// サーバーレスリード", "// 最適化された美学_"]
    }
  ],
  ko: [
    {
      title: "Aero (에어로)",
      description: "LAN을 통해 100MB/s 이상의 속도에 도달하는 차세대 로컬 파일 전송 시스템입니다. E2EE(AES-256-CTR)와 제로 트러스트 광학 핸드쉐이크 기능을 갖춘 풍부한 기능의 데스크톱 앱입니다.",
      tags: ["Go", "Wails", "React", "암호화"],
      color: "#06b6d4",
      link: "https://github.com/HarshalPatel1972/aero",
      slug: "aero",
      mobileScreenshot: "/screenshots_phone/Aero.jpg",
      specs: ["// 속도_100MBPS+", "// E2EE_AES_256", "// 노_클라우드_프로토콜_"]
    },
    {
      title: "RIFT (리프트)",
      description: "마찰 없는 에어 타이핑 브리지입니다. 앱 설치 없이 WebSockets와 Win32 API를 통해 모든 스마트폰을 고성능 PC 입력 장치로 변환합니다.",
      tags: ["Go", "WebSocket", "Win32 API"],
      color: "#8b5cf6",
      link: "https://github.com/HarshalPatel1972/rift",
      slug: "rift",
      mobileScreenshot: "/screenshots_phone/Rift.jpg",
      specs: ["// 지연_50MS미만", "// 제로_마찰_인증", "// 헤드리스_래퍼_"]
    },
    {
      title: "Momentum (모멘텀)",
      description: "AI 에이전트와 모바일을 연결하는 가교입니다. Telegram을 통해 Cursor/Windsurf의 원격 승인 시스템을 구현하여 고위험 실행을 안전하게 유지합니다.",
      tags: ["MCP", "Node.js", "Telegram", "Go"],
      color: "#f97316",
      link: "https://github.com/HarshalPatel1972/momentum",
      slug: "momentum",
      mobileScreenshot: "/screenshots_phone/Momentum.jpg",
      specs: ["// MCP_준비완료", "// 텔레그램_브리지", "// 보안_원격_실행_"]
    },
    {
      title: "GoSync (고싱크)",
      description: "델타 동기화를 위해 머클 트리를 사용하는 오프라인 우선 동기화 엔진입니다. IndexedDB 콜드 스토리지를 통해 데이터 전송을 최대 70% 절감합니다.",
      tags: ["Go", "WASM", "Next.js", "IndexedDB"],
      color: "#10b981",
      link: "https://github.com/HarshalPatel1972/gosync",
      slug: "gosync",
      mobileScreenshot: "/screenshots_phone/GoSync.jpg",
      specs: ["// 델타_동기화_70%", "// 머클_트리_검증", "// 오프라인_우선_"]
    },
    {
      title: "Velocity (벨로시티)",
      description: "WhatsApp의 RAM 사용량을 370MB에서 90MB로 줄이는 Windows 시스템 트레이 최적화 도구입니다. EcoQoS CPU 거버너 및 자동 메모리 트리밍을 구현합니다.",
      tags: ["C++", "Win32", "최적화"],
      color: "#f43f5e",
      link: "https://github.com/HarshalPatel1972/velocity",
      slug: "velocity",
      mobileScreenshot: "/screenshots_phone/Velocity.jpg",
      specs: ["// RAM_절감_75%", "// ECO_QOS_우선순위", "// 메모리_트리밍_엔진_"]
    },
    {
      title: "WinLight (윈라이트)",
      description: "50,000개 이상의 파일을 인덱싱하는 Rust 기반의 Spotlight 유사 검색 엔진입니다. 100ms 미만의 결과 반환을 위한 다중 전략 랭킹 매칭을 사용합니다.",
      tags: ["Rust", "Tauri", "알고리즘"],
      color: "#3b82f6",
      link: "https://github.com/HarshalPatel1972/win-light",
      slug: "win-light",
      mobileScreenshot: "/screenshots_phone/Win-light.jpg",
      specs: ["// 50K_파일_인덱싱", "// 지연_100MS미만", "// RUST_병행성_"]
    },
    {
      title: "A1 Tantra (A1 탄트라)",
      description: "고성능 영적 가이드 플랫폼입니다. 서버리스 리드 생성 아키텍처를 통해 1초 미만의 다중 페이지 탐색을 실현했습니다.",
      tags: ["Next.js", "Tailwind", "SEO"],
      color: "#eab308",
      link: "https://a1-tantra.vercel.app/",
      slug: "a1-tantra",
      mobileScreenshot: "/screenshots_phone/A1 TANTRA.jpg",
      specs: ["// 1초미만_탐색", "// 서버리스_리드", "// 최적화된_미학_"]
    }
  ],
  "zh-tw": [
    {
      title: "Aero (飛航)",
      description: "下一代本地文件傳輸系統，在 LAN 環境下可達 100MB/s+。功能豐富的桌面應用程，具備 E2EE (AES-256-CTR) 與零信任光學握手。",
      tags: ["Go", "Wails", "React", "加密"],
      color: "#06b6d4",
      link: "https://github.com/HarshalPatel1972/aero",
      slug: "aero",
      mobileScreenshot: "/screenshots_phone/Aero.jpg",
      specs: ["// 速度_100MBPS+", "// E2EE_AES_256", "// 無雲端協議_"]
    },
    {
      title: "RIFT (裂痕)",
      description: "零摩擦空氣輸入橋接器。無需安裝應用程即可通過 WebSockets 和 Win32 API 將任何智慧型手機轉化為高性能 PC 輸入設備。",
      tags: ["Go", "WebSocket", "Win32 API"],
      color: "#8b5cf6",
      link: "https://github.com/HarshalPatel1972/rift",
      slug: "rift",
      mobileScreenshot: "/screenshots_phone/Rift.jpg",
      specs: ["// 延遲_50MS以下", "// 零摩擦驗證", "// 無頭包裝器_"]
    },
    {
      title: "Momentum (動量)",
      description: "AI 代理與您囊中之物的橋樑。通過 Telegram 為 Cursor/Windsurf 構建遠端審核系統，確保高風險執行的安全性。",
      tags: ["MCP", "Node.js", "Telegram", "Go"],
      color: "#f97316",
      link: "https://github.com/HarshalPatel1972/momentum",
      slug: "momentum",
      mobileScreenshot: "/screenshots_phone/Momentum.jpg",
      specs: ["// MCP_已就緒", "// 電報橋接", "// 安全遠端執行_"]
    },
    {
      title: "GoSync (同步代碼)",
      description: "離線優先的同步引擎，使用默克爾樹進行增量同步。通過 IndexedDB 冷儲存將數據傳輸效率提升高達 70%。",
      tags: ["Go", "WASM", "Next.js", "IndexedDB"],
      color: "#10b981",
      link: "https://github.com/HarshalPatel1972/gosync",
      slug: "gosync",
      mobileScreenshot: "/screenshots_phone/GoSync.jpg",
      specs: ["// 增量同步_70%", "// 默克爾樹驗證", "// 離線優先_"]
    },
    {
      title: "Velocity (速度)",
      description: "Windows 系統託盤優化工具，將 WhatsApp 的 RAM 佔用從 370MB 降至 90MB。實現了 EcoQoS CPU 調度器和自動化內存修剪。",
      tags: ["C++", "Win32", "優化"],
      color: "#f43f5e",
      link: "https://github.com/HarshalPatel1972/velocity",
      slug: "velocity",
      mobileScreenshot: "/screenshots_phone/Velocity.jpg",
      specs: ["// 內存節省_75%", "// ECO_QOS_優先級", "// 內存修剪引擎_"]
    },
    {
      title: "WinLight (窗光)",
      description: "Rust 驅動的 Spotlight 風格搜索，索引超過 50,000 個文件。多策略排名匹配，可在 100ms 內返回結果。",
      tags: ["Rust", "Tauri", "算法"],
      color: "#3b82f6",
      link: "https://github.com/HarshalPatel1972/win-light",
      slug: "win-light",
      mobileScreenshot: "/screenshots_phone/Win-light.jpg",
      specs: ["// 索引5萬文件", "// 延遲100MS以下", "// RUST併發處理_"]
    },
    {
      title: "A1 Tantra (A1 密乘)",
      description: "高性能精神導航平台。通過無伺服器潛在客戶生成架構，實現了秒級以下的多頁面導航。",
      tags: ["Next.js", "Tailwind", "SEO"],
      color: "#eab308",
      link: "https://a1-tantra.vercel.app/",
      slug: "a1-tantra",
      mobileScreenshot: "/screenshots_phone/A1 TANTRA.jpg",
      specs: ["// 秒級以下導航", "// 無伺服器線索", "// 優化美學_"]
    }
  ]
};

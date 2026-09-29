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

export type ProjectLanguage = "en" | "ja" | "ko" | "zh-tw" | "hi" | "fr" | "id" | "de" | "it" | "pt-br" | "es-419" | "es" | "eridian";

// English is the base. Anything that isn't translated (link, colour, tags, screenshot)
// lives here once, so changing a URL or an image is a one-line edit.
const baseProjects: Project[] = [
  {
    title: "Aero",
    description: "Next-gen local file transfer reaching 100MB/s+ over LAN. Feature-rich desktop app with E2EE (AES-256-CTR) and zero-trust optical handshake.",
    tags: ["Go", "Wails", "React", "Crypto"],
    color: "#06b6d4",
    link: "https://github.com/HarshalPatel1972/aero",
    slug: "aero",
    mobileScreenshot: "/screenshots_phone/Aero.jpg",
    specs: ["// SPEED_100MBPS+", "// E2EE_AES_256", "// NO_CLOUD_PROTOCOL_"],
  },
  {
    title: "RIFT",
    description: "Zero-friction air typing bridge. Turns any smartphone into a high-performance PC input device via WebSockets and Win32 API without app install.",
    tags: ["Go", "WebSocket", "Win32 API"],
    color: "#8b5cf6",
    link: "https://github.com/HarshalPatel1972/rift",
    slug: "rift",
    mobileScreenshot: "/screenshots_phone/Rift.jpg",
    specs: ["// LATENCY_SUB_50MS", "// ZERO_FRICTION_AUTH", "// HEADLESS_WRAPPER_"],
  },
  {
    title: "Momentum",
    description: "The bridge between AI Agents and your pocket. Remote approval system for Cursor/Windsurf via Telegram, keeping high-risk executions secure.",
    tags: ["MCP", "Node.js", "Telegram", "Go"],
    color: "#f97316",
    link: "https://github.com/HarshalPatel1972/momentum",
    slug: "momentum",
    mobileScreenshot: "/screenshots_phone/Momentum.jpg",
    specs: ["// MCP_READY", "// TELEGRAM_BRIDGE", "// SECURE_REMOTE_EXEC_"],
  },
  {
    title: "GoSync",
    description: "Offline-first sync engine using Merkle Trees for delta synchronization. Redlining data transfer up to 70% with IndexedDB cold storage.",
    tags: ["Go", "WASM", "Next.js", "IndexedDB"],
    color: "#10b981",
    link: "https://github.com/HarshalPatel1972/gosync",
    slug: "gosync",
    mobileScreenshot: "/screenshots_phone/GoSync.jpg",
    specs: ["// DELTA_SYNC_70%", "// MERKLE_TREE_VALIDATION", "// OFFLINE_FIRST_"],
  },
  {
    title: "Velocity",
    description: "Windows system tray optimizer reducing WhatsApp RAM from 370MB to 90MB. Implements EcoQoS CPU governor and automated memory trimming.",
    tags: ["C++", "Win32", "Optimization"],
    color: "#f43f5e",
    link: "https://github.com/HarshalPatel1972/velocity",
    slug: "velocity",
    mobileScreenshot: "/screenshots_phone/Velocity.jpg",
    specs: ["// RAM_SAVINGS_75%", "// ECO_QOS_PRIORITY", "// MEMORY_TRIM_ENGINE_"],
  },
  {
    title: "WinLight",
    description: "Rust-powered Spotlight-like search indexing 50,000+ files. Multi-strategy ranked matching returning results under 100ms.",
    tags: ["Rust", "Tauri", "Algorithms"],
    color: "#3b82f6",
    link: "https://github.com/HarshalPatel1972/win-light",
    slug: "win-light",
    mobileScreenshot: "/screenshots_phone/Win-light.jpg",
    specs: ["// INDEX_50K_FILES", "// LATENCY_SUB_100MS", "// RUST_CONCURRENCY_"],
  },
  {
    title: "A1 Tantra",
    description: "High-performance spiritual guidance platform. Achieved sub-second multi-page navigation with serverless lead-generation architecture.",
    tags: ["Next.js", "Tailwind", "SEO"],
    color: "#eab308",
    link: "https://a1-tantra.vercel.app/",
    slug: "a1-tantra",
    mobileScreenshot: "/screenshots_phone/A1 TANTRA.jpg",
    specs: ["// SUB_SECOND_NAV", "// SERVERLESS_LEADS", "// OPTIMIZED_AESTHETIC_"],
  },
];

type Translation = Partial<Pick<Project, "title" | "description" | "specs">>;

// Only what actually differs from English, keyed by project slug.
const translations: Partial<Record<ProjectLanguage, Record<string, Translation>>> = {
  "ja": {
    "aero": {
      title: "Aero (エアロ)",
      description: "LAN経由で100MB/s+に達する次世代のローカルファイル転送. E2EE（AES-256-CTR）とゼロトラスト光学的ハンドシェイクを備えた、機能豊かなデスクトップアプリ.",
      specs: ["// 速度_100MBPS+", "// E2EE_AES_256", "// クライドレスプロトコル_"],
    },
    "rift": {
      title: "RIFT (リフト)",
      description: "摩擦ゼロのエアタイピングブリッジ. アプリのインストールなしで, WebSocketsとWin32 APIを介してあらゆるスマートフォンを高性能なPC入力デバイスに変えます.",
      specs: ["// 遅延_50MS未満", "// 摩擦ゼロ認証", "// ヘッドレスラッパー_"],
    },
    "momentum": {
      title: "Momentum (モメンタム)",
      description: "AIエージェントとあなたのポケットをつなぐ架け橋. Telegramを介した Cursor/Windsurf用のリモート承認システムにより, リスクの高い実行を安全に保ちます.",
      specs: ["// MCP対応済", "// テレグラムブリッジ", "// 安全なリモート実行_"],
    },
    "gosync": {
      title: "GoSync (ゴー・シンク)",
      description: "デルタ同期にマークルツリーを使用するオフラインファーストの同期エンジン. IndexedDBコールドストレージによりデータ転送を最大70%削減.",
      specs: ["// デルタ同期_70%", "// マークルツリー検証", "// オフラインファースト_"],
    },
    "velocity": {
      title: "Velocity (ベロシティ)",
      description: "WhatsAppのデスクトップRAMを370MBから90MBに削減するWindowsシステムトレイ最適化ツール. EcoQoS CPUガバナーと自動メモリトリミングを実装.",
      specs: ["// RAM削減率_75%", "// ECO_QOS優先度", "// メモリトリミングエンジン_"],
    },
    "win-light": {
      title: "WinLight (ウィン・ライト)",
      description: "50,000以上のファイルをインデックス化する, Rust駆動のSpotlight風検索. 100ms未満で結果を返すマルチ戦略のランク付けマッチング.",
      specs: ["// 50Kファイル検索", "// 遅延_100MS未満", "// RUST並行処理_"],
    },
    "a1-tantra": {
      title: "A1 Tantra (A1タントラ)",
      description: "高性能な精神的ガイダンスプラットフォーム. サーバーレスリードジェネレーションアーキテクチャにより, 1秒未満のマルチページナビゲーションを実現.",
      specs: ["// 1秒未満のナビ", "// サーバーレスリード", "// 最適化された美学_"],
    },
  },
  "ko": {
    "aero": {
      title: "Aero (에어로)",
      description: "LAN을 통해 100MB/s 이상의 속도에 도달하는 차세대 로컬 파일 전송 시스템입니다. E2EE(AES-256-CTR)와 제로 트러스트 광학 핸드쉐이크 기능을 갖춘 풍부한 기능의 데스크톱 앱입니다.",
      specs: ["// 속도_100MBPS+", "// E2EE_AES_256", "// 노_클라우드_프로토콜_"],
    },
    "rift": {
      title: "RIFT (리프트)",
      description: "마찰 없는 에어 타이핑 브리지입니다. 앱 설치 없이 WebSockets와 Win32 API를 통해 모든 스마트폰을 고성능 PC 입력 장치로 변환합니다.",
      specs: ["// 지연_50MS미만", "// 제로_마찰_인증", "// 헤드리스_래퍼_"],
    },
    "momentum": {
      title: "Momentum (모멘텀)",
      description: "AI 에이전트와 모바일을 연결하는 가교입니다. Telegram을 통해 Cursor/Windsurf의 원격 승인 시스템을 구현하여 고위험 실행을 안전하게 유지합니다.",
      specs: ["// MCP_준비완료", "// 텔레그램_브리지", "// 보안_원격_실행_"],
    },
    "gosync": {
      title: "GoSync (고싱크)",
      description: "델타 동기화를 위해 머클 트리를 사용하는 오프라인 우선 동기화 엔진입니다. IndexedDB 콜드 스토리지를 통해 데이터 전송을 최대 70% 절감합니다.",
      specs: ["// 델타_동기화_70%", "// 머클_트리_검증", "// 오프라인_우선_"],
    },
    "velocity": {
      title: "Velocity (벨로시티)",
      description: "WhatsApp의 RAM 사용량을 370MB에서 90MB로 줄이는 Windows 시스템 트레이 최적화 도구입니다. EcoQoS CPU 거버너 및 자동 메모리 트리밍을 구현합니다.",
      specs: ["// RAM_절감_75%", "// ECO_QOS_우선순위", "// 메모리_트리밍_엔진_"],
    },
    "win-light": {
      title: "WinLight (윈라이트)",
      description: "50,000개 이상의 파일을 인덱싱하는 Rust 기반의 Spotlight 유사 검색 엔진입니다. 100ms 미만의 결과 반환을 위한 다중 전략 랭킹 매칭을 사용합니다.",
      specs: ["// 50K_파일_인덱싱", "// 지연_100MS미만", "// RUST_병행성_"],
    },
    "a1-tantra": {
      title: "A1 Tantra (A1 탄트라)",
      description: "고성능 영적 가이드 플랫폼입니다. 서버리스 리드 생성 아키텍처를 통해 1초 미만의 다중 페이지 탐색을 실현했습니다.",
      specs: ["// 1초미만_탐색", "// 서버리스_리드", "// 최적화된_미학_"],
    },
  },
  "zh-tw": {
    "aero": {
      title: "Aero (飛航)",
      description: "下一代本地文件傳輸系統，在 LAN 環境下可達 100MB/s+。功能豐富的桌面應用程，具備 E2EE (AES-256-CTR) 與零信任光學握手。",
      specs: ["// 速度_100MBPS+", "// E2EE_AES_256", "// 無雲端協議_"],
    },
    "rift": {
      title: "RIFT (裂痕)",
      description: "零摩擦空氣輸入橋接器。無需安裝應用程即可通過 WebSockets 和 Win32 API 將任何智慧型手機轉化為高性能 PC 輸入設備。",
      specs: ["// 延遲_50MS以下", "// 零摩擦驗證", "// 無頭包裝器_"],
    },
    "momentum": {
      title: "Momentum (動量)",
      description: "AI 代理與您囊中之物的橋樑。通過 Telegram 為 Cursor/Windsurf 構建遠端審核系統，確保高風險執行的安全性。",
      specs: ["// MCP_已就緒", "// 電報橋接", "// 安全遠端執行_"],
    },
    "gosync": {
      title: "GoSync (同步代碼)",
      description: "離線優先的同步引擎，使用默克爾樹進行增量同步. 通過 IndexedDB 冷儲存將數據傳輸效率提升高達 70%.",
      specs: ["// 增量同步_70%", "// 默克爾樹驗證", "// 離線優先_"],
    },
    "velocity": {
      title: "Velocity (速度)",
      description: "Windows 系統託盤優化工具，將 WhatsApp 的 RAM 佔用從 370MB 降至 90MB. 實現了 EcoQoS CPU 調度器 and 自動化內存修剪.",
      specs: ["// 內存節省_75%", "// ECO_QOS_優先級", "// 內存修剪引擎_"],
    },
    "win-light": {
      title: "WinLight (窗光)",
      description: "Rust 驅動的 Spotlight 風格搜索，索引超過 50,000 個文件. 多策略排名匹配，可在 100ms 內返回結果.",
      specs: ["// 索引5萬文件", "// 延遲100MS以下", "// RUST併發處理_"],
    },
    "a1-tantra": {
      title: "A1 Tantra (A1 密乘)",
      description: "高性能精神導航平台. 通過無伺服器潛在客戶生成架構，實現了秒級以下的多頁面導航.",
      specs: ["// 秒級以下導航", "// 無伺服器線索", "// 優化美學_"],
    },
  },
  "hi": {
    "aero": {
      description: "LAN के माध्यम से 100MB/s+ तक पहुँचने वाला अगली पीढ़ी का स्थानीय फ़ाइल स्थानांतरण। E2EE (AES-256-CTR) और ज़ीरो-ट्रस्ट ऑप्टिकल हैंडशेक के साथ फीचर-समृद्ध डेस्कटॉप ऐप।",
      specs: ["// गति_100MBPS+", "// E2EE_AES_256", "// नो_क्लाउड_प्रोटोकॉल_"],
    },
    "rift": {
      description: "ज़ीरो-फ्रिक्शन एयर टाइपिंग ब्रिज। बिना ऐप इंस्टॉल किए WebSockets और Win32 API के माध्यम से किसी भी स्मार्टफोन को उच्च-प्रदर्शन वाले PC इनपुट डिवाइस में बदल देता है।",
      specs: ["// सुस्ती_50MS_से_कम", "// ज़ीरो_फ्रिक्शन_प्रमाणीकरण", "// हेडलेस_रैपर_"],
    },
    "momentum": {
      description: "AI एजेंट्स और आपकी जेब के बीच का सेतु। Telegram के माध्यम से Cursor/Windsurf के लिए रिमोट अप्रूवल सिस्टम, उच्च जोखिम वाले निष्पादन को सुरक्षित रखता है।",
      specs: ["// MCP_तैयार", "// टेलीग्राम_ब्रिज", "// सुरक्षित_रिमोट_एग्जीक्यूशन_"],
    },
    "gosync": {
      description: "डेल्टा सिंक्रोनाइज़ेशन के लिए मर्कल ट्री का उपयोग करने वाला ऑफ़लाइन-फ़र्स्ट सिंक इंजन। IndexedDB कोल्ड स्टोरेज के साथ डेटा ट्रांसफर को 70% तक कम करता है।",
      specs: ["// डेल्टा_सिंक_70%", "// मर्कल_ट्री_सत्यापन", "// ऑफ़लाइन_फ़र्स्ट_"],
    },
    "velocity": {
      description: "WhatsApp RAM को 370MB से घटाकर 90MB करने वाला Windows सिस्टम ट्रे ऑप्टिमाइज़र। EcoQoS CPU गवर्नर और स्वचालित मेमोरी ट्रिमिंग लागू करता है।",
      specs: ["// RAM_बचत_75%", "// ECO_QOS_प्राथमिकता", "// मेमोरी_ट्रिम_इंजन_"],
    },
    "win-light": {
      description: "50,000+ फ़ाइलों को अनुक्रमित करने वाला Rust-पावर्ड स्पॉटलाइट जैसा सर्च। 100ms के भीतर परिणाम देने वाला मल्टी-स्ट्रैटेजी रैंक वाला मैचिंग।",
      specs: ["// 50K_फ़ाइल_अनुक्रमण", "// सुस्ती_100MS_से_कम", "// RUST_कॉन्करेंसी_"],
    },
    "a1-tantra": {
      description: "उच्च-प्रदर्शन आध्यात्मिक मार्गदर्शन मंच। सर्वरलेस लीड-जेनरेशन आर्किটেक्चर के साथ उप-सेकंड मल्टी-पेज नेविगेशन प्राप्त किया।",
      specs: ["// उप_सेकند_नेविगेशन", "// सर्वरलेस_लीड्स", "// अनुकूलित_सौंदर्यशास्त्र_"],
    },
  },
  "fr": {
    "aero": {
      description: "Transfert de fichiers locaux de nouvelle génération atteignant plus de 100 Mo/s sur LAN. Application de bureau riche en fonctionnalités avec E2EE (AES-256-CTR) et poignée de main optique zéro confiance.",
      specs: ["// VITESSE_100MO/S+", "// E2EE_AES_256", "// SANS_PROTOCOLE_CLOUD"],
    },
    "rift": {
      description: "Pont de saisie aérienne sans friction. Transforme n'importe quel smartphone en un périphérique d'entrée PC haute performance via WebSockets et l'API Win32 sans installation d'application.",
      specs: ["// LATENCE_INF_50MS", "// AUTH_SANS_FRICTION", "// WRAPPER_HEADLESS"],
    },
    "momentum": {
      description: "Le pont entre les agents IA et votre poche. Système d'approbation à distance pour Cursor/Windsurf via Telegram, sécurisant les exécutions à haut risque.",
      specs: ["// PRÊT_MCP", "// PONT_TELEGRAM", "// EXEC_DISTANTE_SÉCURISÉE"],
    },
    "gosync": {
      description: "Moteur de synchronisation offline-first utilisant des arbres de Merkle pour la synchronisation différentielle. Accélération du transfert de données jusqu'à 70 % avec le stockage à froid IndexedDB.",
      specs: ["// SYNC_DIFF_70%", "// VALIDATION_MERKLE", "// OFFLINE_FIRST"],
    },
    "velocity": {
      description: "Optimiseur de barre d'état système Windows réduisant la RAM de WhatsApp de 370 Mo à 90 Mo. Implémente le gouverneur CPU EcoQoS et la réduction automatique de la mémoire.",
      specs: ["// ÉCONOMIE_RAM_75%", "// PRIORITÉ_ECO_QOS", "// MOTEUR_RÉDUCTION_MÉMOIRE"],
    },
    "win-light": {
      description: "Recherche de type Spotlight alimentée par Rust indexant plus de 50 000 fichiers. Correspondance classée multi-stratégies renvoyant des résultats en moins de 100 ms.",
      specs: ["// INDEX_50K_FICHIERS", "// LATENCE_INF_100MS", "// CONCURRENCE_RUST"],
    },
    "a1-tantra": {
      description: "Plateforme de guidance spirituelle haute performance. Navigation multipage en moins d'une seconde avec une architecture serverless de génération de prospects.",
      specs: ["// NAV_INF_SECONDE", "// PROSPECTS_SERVERLESS", "// ESTHÉTIQUE_OPTIMISÉE"],
    },
  },
  "id": {
    "aero": {
      description: "Transfer file lokal generasi berikutnya yang mencapai 100MB/s+ melalui LAN. Aplikasi desktop kaya fitur dengan E2EE (AES-256-CTR) dan jabat tangan optik zero-trust.",
      specs: ["// KECEPATAN_100MBPS+", "// E2EE_AES_256", "// TANPA_PROTOKOL_CLOUD"],
    },
    "rift": {
      description: "Jembatan pengetikan udara tanpa gesekan. Mengubah ponsel cerdas apa pun menjadi perangkat input PC berperformansi tinggi melalui WebSockets dan Win32 API tanpa pemasangan aplikasi.",
      specs: ["// LATENSI_SUB_50MS", "// AUTH_TANPA_GESEKAN", "// WRAPPER_HEADLESS"],
    },
    "momentum": {
      description: "Jembatan antara Agen AI dan saku Anda. Sistem persetujuan jarak jauh untuk Cursor/Windsurf melalui Telegram, menjaga eksekusi berisiko tinggi tetap aman.",
      specs: ["// SIAP_MCP", "// JEMBATAN_TELEGRAM", "// EKSEKUSI_JARAK_JAUH_AMAN"],
    },
    "gosync": {
      description: "Mesin sinkronisasi offline-first menggunakan Merkle Trees untuk sinkronisasi delta. Mengoptimalkan transfer data hingga 70% dengan penyimpanan dingin IndexedDB.",
      specs: ["// SYNC_DELTA_70%", "// VALIDASI_MERKLE_TREE", "// OFFLINE_FIRST"],
    },
    "velocity": {
      description: "Pengoptimal sistem tray Windows yang mengurangi RAM WhatsApp dari 370MB menjadi 90MB. Mengimplementasikan pengatur CPU EcoQoS dan pemangkasan memori otomatis.",
      specs: ["// PENGHEMATAN_RAM_75%", "// PRIORITAS_ECO_QOS", "// MESIN_PEMANGKAS_MEMORI"],
    },
    "win-light": {
      description: "Pencarian mirip Spotlight bertenaga Rust yang mengindeks 50.000+ berkas. Pencocokan peringkat multi-strategi yang mengembalikan hasil dalam waktu kurang dari 100ms.",
      specs: ["// INDEKS_50RB_BERKAS", "// LATENSI_SUB_100MS", "// KONKURENSI_RUST"],
    },
    "a1-tantra": {
      description: "Platform bimbingan spiritual berperformansi tinggi. Mencapai navigasi multi-halaman dalam waktu kurang dari sedetik dengan arsitektur serverless pembangkit prospek.",
      specs: ["// NAV_SUB_DETIK", "// PROSPEK_SERVERLESS", "// ESTETIKA_TEROPTIMALASI"],
    },
  },
  "de": {
    "aero": {
      description: "Lokale Dateiübertragung der nächsten Generation mit 100MB/s+ im LAN. Funktionsreiche Desktop-App mit E2EE (AES-256-CTR) und Zero-Trust-Handshake.",
    },
    "rift": {
      description: "Reibungslose Air-Typing-Brücke. Verwandelt jedes Smartphone in ein Hochleistungs-PC-Eingabegerät via WebSockets und Win32-API ohne App-Installation.",
    },
    "momentum": {
      description: "Die Brücke zwischen KI-Agenten und deiner Tasche. Fernfreigabesystem für Cursor/Windsurf via Telegram, das riskante Ausführungen sicher macht.",
    },
    "gosync": {
      description: "Offline-First-Synchronisations-Engine mit Merkle-Trees für Delta-Synchronisation. Reduziert den Datentransfer mit IndexedDB-Cold-Storage um bis zu 70%.",
    },
    "velocity": {
      description: "Windows Tray-Optimierer, der WhatsApp-RAM von 370MB auf 90MB reduziert. Implementiert EcoQoS CPU-Governor und automatisierte Speicherbereinigung.",
    },
    "win-light": {
      description: "Rust-basierte Suche im Spotlight-Stil, die 50.000+ Dateien indiziert. Multi-Strategie-Ranking liefert Ergebnisse in unter 100ms.",
    },
    "a1-tantra": {
      description: "Leistungsstarke Plattform für spirituelle Führung. Erreichte Multi-Page-Navigation in unter einer Sekunde mit Serverless-Architektur.",
    },
  },
  "it": {
    "aero": {
      description: "Trasferimento file locale di nuova generazione con velocità oltre i 100MB/s sulla LAN. App desktop ricca di funzionalità con E2EE (AES-256-CTR) e handshake ottico zero-trust.",
      specs: ["// VELOCITÀ_100MBPS+", "// E2EE_AES_256", "// NESSUN_PROTOCOLLO_CLOUD"],
    },
    "rift": {
      description: "Ponte di digitazione aerea senza attrito. Trasforma qualsiasi smartphone in un dispositivo di input PC ad alte prestazioni tramite WebSockets e API Win32 senza installazione di app.",
      specs: ["// LATENZA_SUB_50MS", "// AUTH_SENZA_ATTRITO", "// WRAPPER_HEADLESS"],
    },
    "momentum": {
      description: "Il ponte tra gli Agenti IA e la tua tasca. Sistema di approvazione remota per Cursor/Windsurf tramite Telegram, mantenendo sicure le esecuzioni ad alto rischio.",
      specs: ["// MCP_PRONTO", "// PONTE_TELEGRAM", "// ESECUZIONE_REMOTA_SICURA"],
    },
    "gosync": {
      description: "Motore di sincronizzazione offline-first che utilizza alberi di Merkle per la sincronizzazione delta. Riduce il trasferimento dati fino al 70% con lo storage a freddo IndexedDB.",
      specs: ["// SYNC_DELTA_70%", "// VALIDAZIONE_ALBERO_MERKLE", "// OFFLINE_FIRST"],
    },
    "velocity": {
      description: "Ottimizzatore della tray di Windows che riduce la RAM di WhatsApp da 370MB a 90MB. Implementa il governor della CPU EcoQoS e il trimming automatico della memoria.",
      specs: ["// RISPARMIO_RAM_75%", "// PRIORITÀ_ECO_QOS", "// MOTORE_TRIM_MEMORIA"],
    },
    "win-light": {
      description: "Ricerca in stile Spotlight alimentata da Rust che indicizza oltre 50.000 file. Matching classificato multi-strategia che restituisce risultati in meno di 100 ms.",
      specs: ["// INDIZZA_50K_FILE", "// LATENZA_SUB_100MS", "// CONCORRENZA_RUST"],
    },
    "a1-tantra": {
      description: "Piattaforma di guida spirituale ad alte prestazioni. Raggiunta la navigazione multi-pagina in meno di un secondo con architettura serverless per la generazione di lead.",
      specs: ["// NAV_SUB_SECONDO", "// LEAD_SERVERLESS", "// ESTETICA_OTTIMIZZATA"],
    },
  },
  "pt-br": {
    "aero": {
      description: "Transferência de arquivos local de próxima geração com velocidades de 100MB/s+ na LAN. App desktop repleto de recursos com E2EE (AES-256-CTR) e handshake óptico zero-trust.",
      specs: ["// VELOCIDADE_100MBPS+", "// E2EE_AES_256", "// SEM_PROTOCOLO_NUVEM"],
    },
    "rift": {
      description: "Ponte de digitação aérea sem fricção. Transforma qualquer smartphone em um dispositivo de entrada de PC de alta performance via WebSockets e API Win32 sem instalação de app.",
      specs: ["// LATÊNCIA_SUB_50MS", "// AUTH_SEM_FRICÇÃO", "// WRAPPER_HEADLESS"],
    },
    "momentum": {
      description: "A ponte entre Agentes de IA e o seu bolso. Sistema de aprovação remota para Cursor/Windsurf via Telegram, mantendo execuções de alto risco seguras.",
      specs: ["// MCP_PRONTO", "// PONTE_TELEGRAM", "// EXECUÇÃO_REMOTA_SEGURA"],
    },
    "gosync": {
      description: "Motor de sincronização offline-first usando Merkle Trees para sincronização delta. Reduz a transferência de dados em até 70% com cold storage IndexedDB.",
      specs: ["// SYNC_DELTA_70%", "// VALIDAÇÃO_MERKLE_TREE", "// OFFLINE_FIRST"],
    },
    "velocity": {
      description: "Otimizador da bandeja do Windows que reduz a RAM do WhatsApp de 370MB para 90MB. Implementa o governor de CPU EcoQoS e limpeza automática de memória.",
      specs: ["// ECONOMIA_RAM_75%", "// PRIORIDADE_ECO_QOS", "// MOTOR_TRIM_MEMÓRIA"],
    },
    "win-light": {
      description: "Busca estilo Spotlight alimentada por Rust que indexa mais de 50.000 arquivos. Ranking multi-estratégia que entrega resultados em menos de 100ms.",
      specs: ["// INDEXA_50K_ARQUIVOS", "// LATÊNCIA_SUB_100MS", "// CONCORRÊNCIA_RUST"],
    },
    "a1-tantra": {
      description: "Plataforma de orientação espiritual de alta performance. Alcançou navegação multi-página em menos de um segundo com arquitetura serverless.",
      specs: ["// NAV_SUB_SEGUNDO", "// LEADS_SERVERLESS", "// ESTÉTICA_OTIMIZADA"],
    },
  },
  "es-419": {
    "aero": {
      description: "Transferencia de archivos local de próxima generación con velocidades de 100MB/s+ en la LAN. App de escritorio repleta de funciones con E2EE (AES-256-CTR) y handshake óptico zero-trust.",
      specs: ["// VELOCIDAD_100MBPS+", "// E2EE_AES_256", "// SIN_PROTOCOLO_NUBE"],
    },
    "rift": {
      description: "Puente de escritura aérea sin fricción. Convierte cualquier smartphone en un dispositivo de entrada de PC de alto rendimiento a través de WebSockets y API de Win32 sin instalación de apps.",
      specs: ["// LATENCIA_SUB_50MS", "// AUTH_SIN_FRICCIÓN", "// WRAPPER_HEADLESS"],
    },
    "momentum": {
      description: "El puente entre los Agentes de IA y tu bolsillo. Sistema de aprobación remota para Cursor/Windsurf a través de Telegram, manteniendo seguras las ejecuciones de alto riesgo.",
      specs: ["// MCP_LISTO", "// PUENTE_TELEGRAM", "// EJECUCIÓN_REMOTA_SEGURA"],
    },
    "gosync": {
      description: "Motor de sincronización offline-first que utiliza Merkle Trees para sincronización delta. Reduce la transferencia de datos en hasta un 70% con el almacenamiento en frío de IndexedDB.",
      specs: ["// SYNC_DELTA_70%", "// VALIDACIÓN_MERKLE_TREE", "// OFFLINE_FIRST"],
    },
    "velocity": {
      description: "Optimizador de la bandeja de Windows que reduce la RAM de WhatsApp de 370MB a 90MB. Implementa el gobernador de CPU EcoQoS y la limpieza automática de memoria.",
      specs: ["// AHORRO_RAM_75%", "// PRIORIDAD_ECO_QOS", "// MOTOR_TRIM_MEMORIA"],
    },
    "win-light": {
      description: "Búsqueda estilo Spotlight potenciada por Rust que indexa más de 50,000 archivos. Clasificación multi-estrategia que entrega resultados en menos de 100 ms.",
      specs: ["// INDEXA_50K_ARCHIVOS", "// LATENCIA_SUB_100MS", "// CONCURRENCIA_RUST"],
    },
    "a1-tantra": {
      description: "Plataforma de orientación espiritual de alto rendimiento. Logró navegación multi-página en menos de un segundo con arquitectura serverless para la generación de prospectos.",
      specs: ["// NAV_SUB_SEGUNDO", "// CLIENTES_SERVERLESS", "// ESTÉTICA_OPTIMIZADA"],
    },
  },
  "es": {
    "aero": {
      description: "Transferencia de archivos local de próxima generación con velocidades de 100MB/s+ en la LAN. Aplicación de escritorio repleta de funciones con E2EE (AES-256-CTR) e intercambio de claves óptico zero-trust.",
      specs: ["// VELOCIDAD_100MBPS+", "// E2EE_AES_256", "// SIN_PROTOCOLO_NUBE"],
    },
    "rift": {
      description: "Puente de escritura aérea sin fricciones. Transforma cualquier smartphone en un dispositivo de entrada de PC de alto rendimiento mediante WebSockets y la API de Win32 sin instalación de apps.",
      specs: ["// LATENCIA_SUB_50MS", "// AUTH_SIN_FRICCIONES", "// WRAPPER_HEADLESS"],
    },
    "momentum": {
      description: "El puente entre los agentes de IA y tu bolsillo. Sistema de aprobación remota para Cursor/Windsurf mediante Telegram, manteniendo seguras las ejecuciones de alto riesgo.",
      specs: ["// MCP_LISTO", "// PUENTE_TELEGRAM", "// EJECUCIÓN_REMOTA_SEGURA"],
    },
    "gosync": {
      description: "Motor de sincronización offline-first que utiliza Merkle Trees para sincronización delta. Reduce la transferencia de datos en hasta un 70% con el almacenamiento en frío de IndexedDB.",
      specs: ["// SYNC_DELTA_70%", "// VALIDACIÓN_MERKLE_TREE", "// OFFLINE_FIRST"],
    },
    "velocity": {
      description: "Optimizador de la bandeja del Windows que reduce la RAM de WhatsApp de 370MB a 90MB. Implementa el gobernador de CPU EcoQoS y la limpieza automática de memoria.",
      specs: ["// AHORRO_RAM_75%", "// PRIORIDAD_ECO_QOS", "// MOTOR_TRIM_MEMORIA"],
    },
    "win-light": {
      description: "Búsqueda tipo Spotlight impulsada por Rust que indexa más de 50.000 archivos. Clasificación multi-estrategia que entrega resultados en menos de 100 ms.",
      specs: ["// INDEXA_50K_ARCHIVOS", "// LATENCIA_SUB_100MS", "// CONCURRENCIA_RUST"],
    },
    "a1-tantra": {
      description: "Plataforma de orientación espiritual de alto rendimiento. Logró la navegación multi-página en menos de un segundo con arquitectura serverless para la captación de leads.",
      specs: ["// NAV_SUB_SEGUNDO", "// LEADS_SERVERLESS", "// ESTÉTICA_OPTIMIZADA"],
    },
  },
  "eridian": {
    "aero": {
      description: "HARSHAL MAKE SEND-DATA FAST. 100MB/S. NO SPY. SECRET HANDSHAKE. AMAZE!",
      specs: ["// VERY_FAST_100MBPS", "// SECRET_CRYPTO_ROCKY", "// NO_PEEK_PROTOCOL_"],
    },
    "rift": {
      description: "MAKE PHONE BECOME KEY-BOARD. VERY FAST. MAGIC AIR-TYPE. NO INSTALL. YES!",
      specs: ["// NO_WAIT_SPEED", "// ZERO_FRICTION_TYPE", "// MAGIC_PHONE_BRIDGE_"],
    },
    "momentum": {
      description: "CONNECT AI FRIEND TO POCKET SENDER. TELL CURSOR YES OR NO FAR AWAY. SAFE!",
      specs: ["// MCP_FRIEND", "// TELEGRAM_BRIDGE_THING", "// SAFE_FAR_AWAY_WORK_"],
    },
    "gosync": {
      description: "SAVE DATA IN COLD. MERKLE TREE FIND DIFFERENT PIECE. SEND ONLY SMALL PIECE. SMART.",
      specs: ["// SAVE_DATA_70%", "// TREE_VALIDATE_MATH", "// COLD_STORAGE_FIRST_"],
    },
    "velocity": {
      description: "HARSHAL SQUISH WHATSAPP MEMORY. 370MB BECOME 90MB. MAKE CPU REST. GOOD SLEEP.",
      specs: ["// SQUISH_RAM_75%", "// ECO_REST_SPEED", "// MEMORY_CUT_ENGINE_"],
    },
    "win-light": {
      description: "RUST CODE SEARCH 50,000 FILE VERY FAST. MULTI-SORT FIND THING UNDER 100MS. AMAZE!",
      specs: ["// FIND_50K_THINGS", "// NO_WAIT_100MS", "// RUST_MANY_WORK_"],
    },
    "a1-tantra": {
      description: "BIG BEAUTIFUL SITE FOR TANTRA HUMANS. FAST PAGE TURN. NO SERVER LEADS. PEACE.",
      specs: ["// VERY_FAST_PAGE", "// SERVER_NO_NEED", "// BEAUTIFUL_LOOK_"],
    },
  },
};

const languages = ["en", "ja", "ko", "zh-tw", "hi", "fr", "id", "de", "it", "pt-br", "es-419", "es", "eridian"] as const;

export const projects = Object.fromEntries(
  languages.map((lang) => [
    lang,
    baseProjects.map((project) => ({ ...project, ...translations[lang]?.[project.slug] })),
  ])
) as Record<ProjectLanguage, Project[]>;

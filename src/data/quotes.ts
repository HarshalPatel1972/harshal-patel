export interface CharacterData {
  en: { name: string };
  ja: { name: string };
  image: string;
  opacity?: number;
}

export interface QuoteEntry {
  charId: string;
  en: string;
  ja: string;
}

export const characterRegistry: Record<string, CharacterData> = {
  EREN: {
    en: { name: "EREN YEAGER" },
    ja: { name: "エレン・イェーガー" },
    image: "/Eren Yeager.jpg",
    opacity: 0.35
  },
  THORS: {
    en: { name: "THORS SNORESSON" },
    ja: { name: "トールズ・スノーレソン" },
    image: "/THORS SNORESSON.png"
  },
  SUKUNA: {
    en: { name: "RYOMEN SUKUNA" },
    ja: { name: "両面宿儺" },
    image: "/RYOMEN SUKUNA.jpg",
    opacity: 0.25
  },
  LEVI: {
    en: { name: "LEVI ACKERMAN" },
    ja: { name: "リヴァイ・アッカーマン" },
    image: "/Levi Ackerman.png",
    opacity: 0.3
  },
  GOJO: {
    en: { name: "SATORU GOJO" },
    ja: { name: "五条悟" },
    image: "/Saturo Gojo.png",
    opacity: 0.3
  },
  MIKASA: {
    en: { name: "MIKASA ACKERMAN" },
    ja: { name: "ミカサ・アッカーマン" },
    image: "/Mikasa Ackerman.jpg"
  },
  YUJI: {
    en: { name: "YUJI ITADORI" },
    ja: { name: "虎杖悠仁" },
    image: "/Yuji Itadori.png"
  },
  ARMIN: {
    en: { name: "ARMIN ARLERT" },
    ja: { name: "アルミン・アルレルト" },
    image: "/ARMIN ARLERT.jpg",
    opacity: 0.3
  },
  ERWIN: {
    en: { name: "ERWIN SMITH" },
    ja: { name: "エルヴィン・スミス" },
    image: "/ERWIN SMITH.jpg",
    opacity: 0.3
  },
  THORFINN: {
    en: { name: "THORFINN" },
    ja: { name: "トルフィン" },
    image: "/THORFINN.png",
    opacity: 0.3
  },
  ASKELADD: {
    en: { name: "ASKELADD" },
    ja: { name: "アシェラッド" },
    image: "/ASKELADD.jpg",
    opacity: 0.3
  },
  NANAMI: {
    en: { name: "NANAMI KENTO" },
    ja: { name: "七海建人" },
    image: "/NANAMI KENTO.png",
    opacity: 0.3
  },
  YAMI: {
    en: { name: "YAMI SUKEHIRO" },
    ja: { name: "夜見介大" },
    image: "/YAMI SUKEHIRO.png",
    opacity: 0.3
  },
  NOBARA: {
    en: { name: "NOBARA KUGISAKI" },
    ja: { name: "釘崎野薔薇" },
    image: "/NOBARA KUGISAKI.jpeg",
    opacity: 0.3
  },
  TOJI: {
    en: { name: "TOJI FUSHIGURO" },
    ja: { name: "伏黒甚爾" },
    image: "/TOJI FUSHIGURO.png",
    opacity: 0.3
  },
  DENJI: {
    en: { name: "DENJI" },
    ja: { name: "デンジ" },
    image: "/DENJI.png",
    opacity: 0.3
  },
  KISHIBE: {
    en: { name: "KISHIBE" },
    ja: { name: "岸辺" },
    image: "/KISHIBE.jpg",
    opacity: 0.3
  }
};

export const mappaQuotesList: QuoteEntry[] = [
  {
    charId: "ARMIN",
    en: "SOMEONE WHO CANNOT SACRIFICE ANYTHING CANNOT CHANGE ANYTHING.",
    ja: "何も捨てることができない人には、何も変えることはできないだろう"
  },
  {
    charId: "ERWIN",
    en: "IF YOU BEGIN TO REGRET, YOU'LL DULL YOUR FUTURE DECISIONS AND LET OTHERS MAKE YOUR CHOICES FOR YOU.",
    ja: "後悔は次の決断を鈍らせる。そして他人に選択を委ねることになる。"
  },
  {
    charId: "THORFINN",
    en: "DON'T WASTE YOUR LIFE ON SOMETHING AS SMALL AS REVENGE. FIND YOUR OWN VINLAND.",
    ja: "復讐などという小さなことに人生を浪費するな。お前自身のヴィンランドを見つけろ。"
  },
  {
    charId: "ASKELADD",
    en: "ONLY A WARRIOR GETS TO CHOOSE THE MANNER OF HIS DEATH.",
    ja: "死に方を選べるのは戦士だけだ"
  },
  {
    charId: "NANAMI",
    en: "IT IS NOT THOSE WHO CANNOT DIE WHO ARE STRONG. IT IS THOSE WHO HAVE CHOSEN WHAT TO LIVE FOR.",
    ja: "死なない者が強いのではない。何のために生きるかを選べる者が強いのだ。"
  },
  {
    charId: "YAMI",
    en: "PUSH PAST YOUR LIMITS. THAT IS HOW NEW ONES ARE SET.",
    ja: "今ここで、限界を超えろ。それが新しい限界を創る唯一の道だ。"
  },
  {
    charId: "NOBARA",
    en: "I HAVE NO REGRETS ABOUT MY PATH. I CHOSE IT. I OWN IT.",
    ja: "後悔なんてない。私が選んだ道だ。"
  },
  {
    charId: "TOJI",
    en: "TALENT IS JUST THE STARTING POINT. WILL IS WHAT FINISHES IT.",
    ja: "才能はただの出発点だ。意志こそがそれを完成させる。"
  },
  {
    charId: "DENJI",
    en: "A DREAM ISN'T SOMETHING YOU WATCH. IT'S SOMETHING YOU BLEED FOR.",
    ja: "夢は見るもんじゃねえ。血を流して叶えるもんだ。"
  },
  {
    charId: "KISHIBE",
    en: "FEAR NOTHING. EVEN FEAR ITSELF.",
    ja: "何も恐れるな。恐怖そのものすらもな。"
  }
];

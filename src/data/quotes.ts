export interface CharacterData {
  en: { name: string; series: string };
  ja: { name: string; series: string };
  image: string;
}

export interface QuoteEntry {
  charId: string;
  en: string;
  ja: string;
}

export const characterRegistry: Record<string, CharacterData> = {
  EREN: {
    en: { name: "EREN YEAGER", series: "ATTACK ON TITAN" },
    ja: { name: "エレン・イェーガー", series: "進撃の巨人" },
    image: "/Eren Yeager.jpg"
  },
  THORS: {
    en: { name: "THORS SNORESSON", series: "VINLAND SAGA" },
    ja: { name: "トールズ・スノーレソン", series: "ヴィンランド・サガ" },
    image: "/THORS SNORESSON.png"
  },
  SUKUNA: {
    en: { name: "RYOMEN SUKUNA", series: "JUJUTSU KAISEN" },
    ja: { name: "両面宿儺", series: "呪術廻戦" },
    image: "/RYOMEN SUKUNA.jpg"
  },
  LEVI: {
    en: { name: "LEVI ACKERMAN", series: "ATTACK ON TITAN" },
    ja: { name: "リヴァイ・アッカーマン", series: "進撃の巨人" },
    image: "/Levi Ackerman.png"
  },
  GOJO: {
    en: { name: "SATORU GOJO", series: "JUJUTSU KAISEN" },
    ja: { name: "五条悟", series: "呪術廻戦" },
    image: "/Saturo Gojo.png"
  },
  MIKASA: {
    en: { name: "MIKASA ACKERMAN", series: "ATTACK ON TITAN" },
    ja: { name: "ミカサ・アッカーマン", series: "進撃の巨人" },
    image: "/612523.jpg"
  },
  YUJI: {
    en: { name: "YUJI ITADORI", series: "JUJUTSU KAISEN" },
    ja: { name: "虎杖悠仁", series: "呪術廻戦" },
    image: "/Yuji Itadori.png"
  }
};

export const mappaQuotesList: QuoteEntry[] = [
  {
    charId: "EREN",
    en: "IF YOU DON'T FIGHT, YOU CAN'T WIN.",
    ja: "戦わなければ勝てない。"
  },
  {
    charId: "THORS",
    en: "YOU HAVE NO ENEMIES. NO ONE HAS ANY ENEMIES. THERE IS NO ONE WHO IT IS OKAY TO HURT.",
    ja: "お前に敵などいない。誰にも敵などいないんだ。傷つけていい者など、どこにもいない。"
  },
  {
    charId: "SUKUNA",
    en: "STAND PROUD. YOU ARE STRONG.",
    ja: "誇れ。お前は強い。"
  },
  {
    charId: "LEVI",
    en: "THE ONLY THING WE'RE ALLOWED TO DO IS BELIEVE THAT WE WON'T REGRET THE CHOICE WE MADE.",
    ja: "俺たちに許されたのは、自分の選択を後悔しないと信じることだけだ。"
  },
  {
    charId: "GOJO",
    en: "DYING TO WIN AND RISKING DEATH TO WIN ARE TWO DIFFERENT THINGS.",
    ja: "死んで勝つと死んでも勝つは全然違うよ"
  },
  {
    charId: "MIKASA",
    en: "THE WORLD IS CRUEL, BUT ALSO VERY BEAUTIFUL.",
    ja: "この世界は残酷だ…そして…とても美しい。"
  },
  {
    charId: "YUJI",
    en: "I WANT TO LIVE A LIFE I CAN BE PROUD OF.",
    ja: "自分が死ぬ時のことは分からんけど、生き様で後悔はしたくない。"
  },
  {
    charId: "EREN",
    en: "I'LL KEEP MOVING FORWARD. UNTIL MY ENEMIES ARE DESTROYED.",
    ja: "オレは進み続ける。敵を駆逐するまで。"
  },
  {
    charId: "GOJO",
    en: "THROUGHOUT HEAVEN AND EARTH, I ALONE AM THE HONORED ONE.",
    ja: "天上天下唯我独尊"
  }
];

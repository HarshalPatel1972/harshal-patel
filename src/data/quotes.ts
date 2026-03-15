export interface CharacterData {
  en: { name: string };
  ja: { name: string };
  ko: { name: string };
  image: string;
  opacity?: number;
}

export interface QuoteEntry {
  charId: string;
  en: string;
  ja: string;
  ko: string;
}

export const characterRegistry: Record<string, CharacterData> = {
  EREN: {
    en: { name: "EREN YEAGER" },
    ja: { name: "エレン・イェーガー" },
    ko: { name: "에렌 예거" },
    image: "/Eren Yeager.jpg",
    opacity: 0.35
  },
  THORS: {
    en: { name: "THORS SNORESSON" },
    ja: { name: "トールズ・スノーレソン" },
    ko: { name: "토르즈 스노레손" },
    image: "/THORS SNORESSON.png"
  },
  SUKUNA: {
    en: { name: "RYOMEN SUKUNA" },
    ja: { name: "両面宿儺" },
    ko: { name: "료멘 스쿠나" },
    image: "/RYOMEN SUKUNA.jpg",
    opacity: 0.25
  },
  LEVI: {
    en: { name: "LEVI ACKERMAN" },
    ja: { name: "リヴァイ・アッカーマン" },
    ko: { name: "리바이 아커만" },
    image: "/Levi Ackerman.png",
    opacity: 0.3
  },
  GOJO: {
    en: { name: "SATORU GOJO" },
    ja: { name: "五条悟" },
    ko: { name: "고죠 사토루" },
    image: "/Saturo Gojo.png",
    opacity: 0.3
  },
  MIKASA: {
    en: { name: "MIKASA ACKERMAN" },
    ja: { name: "ミカサ・アッカーマン" },
    ko: { name: "미카사 아커만" },
    image: "/Mikasa Ackerman.jpg"
  },
  YUJI: {
    en: { name: "YUJI ITADORI" },
    ja: { name: "虎杖悠仁" },
    ko: { name: "이타도리 유지" },
    image: "/Yuji Itadori.png"
  },
  ARMIN: {
    en: { name: "ARMIN ARLERT" },
    ja: { name: "アルミン・アルレルト" },
    ko: { name: "아르민 알레르토" },
    image: "/ARMIN ARLERT.jpg",
    opacity: 0.3
  },
  ERWIN: {
    en: { name: "ERWIN SMITH" },
    ja: { name: "エルヴィン・スミス" },
    ko: { name: "엘빈 스미스" },
    image: "/ERWIN SMITH.jpg",
    opacity: 0.3
  },
  THORFINN: {
    en: { name: "THORFINN" },
    ja: { name: "トルフィン" },
    ko: { name: "토르핀" },
    image: "/THORFINN.png",
    opacity: 0.3
  },
  ASKELADD: {
    en: { name: "ASKELADD" },
    ja: { name: "アシェラッド" },
    ko: { name: "아쉘라드" },
    image: "/ASKELADD.jpg",
    opacity: 0.3
  },
  NANAMI: {
    en: { name: "NANAMI KENTO" },
    ja: { name: "七海建人" },
    ko: { name: "나나미 켄토" },
    image: "/NANAMI KENTO.png",
    opacity: 0.3
  },
  YAMI: {
    en: { name: "YAMI SUKEHIRO" },
    ja: { name: "夜見介大" },
    ko: { name: "야미 스케히로" },
    image: "/YAMI SUKEHIRO.png",
    opacity: 0.3
  },
  NOBARA: {
    en: { name: "NOBARA KUGISAKI" },
    ja: { name: "釘崎野薔薇" },
    ko: { name: "쿠기사키 노바라" },
    image: "/NOBARA KUGISAKI.jpeg",
    opacity: 0.3
  },
  TOJI: {
    en: { name: "TOJI FUSHIGURO" },
    ja: { name: "伏黒甚爾" },
    ko: { name: "후시구로 토우지" },
    image: "/TOJI FUSHIGURO.png",
    opacity: 0.3
  },
  DENJI: {
    en: { name: "DENJI" },
    ja: { name: "デンジ" },
    ko: { name: "덴지" },
    image: "/DENJI.png",
    opacity: 0.3
  },
  KISHIBE: {
    en: { name: "KISHIBE" },
    ja: { name: "岸辺" },
    ko: { name: "키시베" },
    image: "/KISHIBE.jpg",
    opacity: 0.3
  }
};

export const mappaQuotesList: QuoteEntry[] = [
  {
    charId: "EREN",
    en: "IF YOU DON'T FIGHT, YOU CAN'T WIN.",
    ja: "戦わなければ勝てない。",
    ko: "싸우지 않으면 이길 수 없어."
  },
  {
    charId: "THORS",
    en: "YOU HAVE NO ENEMIES. NO ONE HAS ANY ENEMIES. THERE IS NO ONE WHO IT IS OKAY TO HURT.",
    ja: "お前に敵などいない。誰にも敵などいないんだ。傷つけていい者など、どこにもいない。",
    ko: "너에게 적이란 없다. 누구에게도 적이란 없단다. 상처 입혀도 되는 사람은 그 어디에도 없어."
  },
  {
    charId: "SUKUNA",
    en: "STAND PROUD. YOU ARE STRONG.",
    ja: "誇れ。お前は強い。",
    ko: "자랑스러워해라. 너는 강하다."
  },
  {
    charId: "LEVI",
    en: "THE ONLY THING WE'RE ALLOWED TO DO IS BELIEVE THAT WE WON'T REGRET THE CHOICE WE MADE.",
    ja: "俺たちに許されたのは、自分の選択を後悔しないと信じることだけだ。",
    ko: "우리가 할 수 있는 유일한 것은 자신의 선택을 후회하지 않겠다고 믿는 것뿐이다."
  },
  {
    charId: "GOJO",
    en: "DYING TO WIN AND RISKING DEATH TO WIN ARE TWO DIFFERENT THINGS.",
    ja: "死んで勝つと死んでも勝つは全然違うよ",
    ko: "이겨서 죽는 것과 죽어서 이기는 것은 전혀 다르단다."
  },
  {
    charId: "MIKASA",
    en: "THE WORLD IS CRUEL, BUT ALSO VERY BEAUTIFUL.",
    ja: "この世界は残酷だ…そして…とても美しい。",
    ko: "세상은 잔혹하다... 그리고... 너무나도 아름답다."
  },
  {
    charId: "YUJI",
    en: "I WANT TO LIVE A LIFE I CAN BE PROUD OF.",
    ja: "自分が死ぬ時のことは分からんけど、生き様で後悔はしたくない。",
    ko: "내가 어떻게 죽을지는 모르겠지만, 살아온 날들을 후회하고 싶지는 않아."
  },
  {
    charId: "EREN",
    en: "I'LL KEEP MOVING FORWARD. UNTIL MY ENEMIES ARE DESTROYED.",
    ja: "オレは進み続ける。敵を駆逐するまで。",
    ko: "나는 계속 나아갈 거야. 적을 구축할 때까지."
  },
  {
    charId: "GOJO",
    en: "THROUGHOUT HEAVEN AND EARTH, I ALONE AM THE HONORED ONE.",
    ja: "天上天下唯我独尊",
    ko: "천상천하 유아독존"
  },
  {
    charId: "ARMIN",
    en: "SOMEONE WHO CANNOT SACRIFICE ANYTHING CANNOT CHANGE ANYTHING.",
    ja: "何も捨てることができない人には、何も変えることはできないだろう",
    ko: "아무것도 버릴 수 없는 사람은 아무것도 바꿀 수 없다."
  },
  {
    charId: "ERWIN",
    en: "IF YOU BEGIN TO REGRET, YOU'LL DULL YOUR FUTURE DECISIONS AND LET OTHERS MAKE YOUR CHOICES FOR YOU.",
    ja: "後悔は次の決動を鈍らせる。そして他人に選択を委ねることになる。",
    ko: "후회는 다음의 결단을 흐리게 한다. 그리고 타인에게 선택을 맡기게 될 것이다."
  },
  {
    charId: "THORFINN",
    en: "DON'T WASTE YOUR LIFE ON SOMETHING AS SMALL AS REVENGE. FIND YOUR OWN VINLAND.",
    ja: "復讐などという小さなことに人生を浪費するな。お前自身のヴィンランドを見つけろ。",
    ko: "복수 같은 하찮은 일에 인생을 낭비하지 마라. 너만의 빈란드를 찾아라."
  },
  {
    charId: "ASKELADD",
    en: "ONLY A WARRIOR GETS TO CHOOSE THE MANNER OF HIS DEATH.",
    ja: "死に方を選べるのは戦士だけだ",
    ko: "죽는 법을 고를 수 있는 것은 전사뿐이다."
  },
  {
    charId: "NANAMI",
    en: "IT IS NOT THOSE WHO CANNOT DIE WHO ARE STRONG. IT IS THOSE WHO HAVE CHOSEN WHAT TO LIVE FOR.",
    ja: "死なない者が強いのではない。何のために生きるかを選べる者が強いのだ。",
    ko: "죽지 않는 자가 강한 게 아니다. 무엇을 위해 살지 선택한 자가 강한 것이다."
  },
  {
    charId: "YAMI",
    en: "PUSH PAST YOUR LIMITS. THAT IS HOW NEW ONES ARE SET.",
    ja: "今ここで、限界を超えろ。それが新しい限界を創る唯一の道だ。",
    ko: "여기서 한계를 넘어라. 그것이 새로운 한계를 만드는 유일한 길이다."
  },
  {
    charId: "NOBARA",
    en: "I HAVE NO REGRETS ABOUT MY PATH. I CHOSE IT. I OWN IT.",
    ja: "後悔なんてない。私が選んだ道だ。",
    ko: "후회 따위는 없어. 내가 선택한 길이야."
  },
  {
    charId: "TOJI",
    en: "TALENT IS JUST THE STARTING POINT. WILL IS WHAT FINISHES IT.",
    ja: "才能はただの出発点だ。意志こそがそれを完成させる。",
    ko: "재능은 그저 출발점일 뿐이다. 의지가 그것을 완성시킨다."
  },
  {
    charId: "DENJI",
    en: "A DREAM ISN'T SOMETHING YOU WATCH. IT'S SOMETHING YOU BLEED FOR.",
    ja: "夢は見るもんじゃねえ。血を流して叶えるもんだ。",
    ko: "꿈은 보는 게 아니야. 피를 흘리며 이루는 거야."
  },
  {
    charId: "KISHIBE",
    en: "FEAR NOTHING. EVEN FEAR ITSELF.",
    ja: "何も恐れるな。恐怖そのものすらもな。",
    ko: "아무것도 두려워하지 마라. 공포 그 자체조차도."
  }
];

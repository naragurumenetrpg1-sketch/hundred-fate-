/*
  story-data.js
  ------------------------------------------------------------------
  ノベルパートのセリフ・立ち絵・背景データ。

  【重要】ここの各エントリのキー("prologue", "ch1" など)は、
  実際の data/campaign.json / data/stages/*.json で使っているステージIDと
  一致させる必要があります。今はこちらで開発してきた仮のIDのままなので、
  実際のIDを教えてもらえれば正しく対応させます(またはこちらのキー名を
  そちらのIDに合わせて書き換えるだけなので、そちらのIDリストを送って
  もらうのが一番早いです)。

  形式:
    window.STORY_DATA[stageId] = {
      chapterLabel: "1章" など(演出の章番号表示に使用。無くても動作可),
      bg: "backgrounds/xxx.webp" または { intro:"...", outro:"..." },
      story: {
        intro: [ { speaker:"隊長", text:"…" }, ... ],
        outro: [ { speaker:"", text:"…" }, ... ]
      }
    }
  speaker を空文字にすると地の文(立ち絵なし)になります。
  speaker が window.STORY_PORTRAITS のキーと一致すると、自動で立ち絵が表示されます。
------------------------------------------------------------------
*/

window.STORY_PORTRAITS = {
  "隊長": "portraits/taichou.webp",
  "王": "portraits/ou.webp",
  "王妃": "portraits/ouhi.webp",
  "魔女": "portraits/majo.webp",
  "竜": "portraits/ryu.webp",
  "副官": "portraits/fukukan.webp",
  "魔法使い": "portraits/mahoutsukai.webp",
  "スライム": "portraits/slime.webp",
  "幽霊": "portraits/yuurei.webp",
  "ゴブリン": "portraits/goblin.webp",
  "弓ゴブリン": "portraits/goblin_bow.webp"
};

window.STORY_DATA = {
  "prologue": { chapterLabel:"序章", bg:"backgrounds/stage1_hall.webp", story:{ intro:[
      { speaker:"", text:"王都の広間。玉座の前に、若き隊長が跪いている。" },
      { speaker:"王", text:"北の平原に、竜の影が現れたという。討伐隊を任せる。" },
      { speaker:"王妃", text:"どうか、ご無事で。あなたの帰りを、ここで待っています。" },
      { speaker:"隊長", text:"御意。この兵、必ずや竜を討ち果たしてご覧に入れます。" },
      { speaker:"副官", text:"弓は私にお任せを。矢を外したことはございません。" },
      { speaker:"魔法使い", text:"魔法もお忘れなく。この杖、伊達ではありませんよ。" },
  ], outro:[
      { speaker:"", text:"こうして、王国軍の小さな一隊が旅立った。" },
  ]}},
  "ch1": { chapterLabel:"1章", bg:"backgrounds/castle_intact.webp", story:{ intro:[
      { speaker:"", text:"城門をくぐり、一行は草原へと歩みを進める。" },
      { speaker:"隊長", text:"まずは足慣らしだ。気を張りすぎず、しかし油断はするな。" },
  ], outro:[
      { speaker:"", text:"振り返ると、王城はもう小さく霞んでいた。" },
  ]}},
  "ch2": { chapterLabel:"2章", bg:"backgrounds/grassland.webp", story:{ intro:[
      { speaker:"", text:"見渡す限りの草原。風にそよぐ草の合間から、緑の影が跳び出した。" },
      { speaker:"ゴブリン", text:"ギギッ……ギャギャッ!!" },
      { speaker:"弓ゴブリン", text:"ギィ……(矢をつがえ、茂みの陰から狙いを定めている)" },
      { speaker:"隊長", text:"数はさほどでもない。落ち着いて対処しろ。" },
  ], outro:[
      { speaker:"", text:"ゴブリンの群れを退け、道はやがて二手に分かれた。" },
      { speaker:"副官", text:"南は海、東は砂漠……隊長、どちらへ?" },
  ]}},
  "ch3_sea": { chapterLabel:"3章・海ルート", bg:"backgrounds/sea.webp", story:{ intro:[
      { speaker:"", text:"草原を抜けた先には、荒れる海が広がっていた。" },
      { speaker:"スライム", text:"……ぷるん……(渚に蠢く緑色の塊が行く手を阻む)" },
      { speaker:"副官", text:"渡し船が使えません……力ずくで道を切り開くほかないかと。" },
      { speaker:"隊長", text:"構わぬ。荒波程度、この剣で断ち切ってくれる。" },
  ], outro:[
      { speaker:"", text:"荒波を越え、隊は対岸へと降り立った。" },
  ]}},
  "ch3_desert": { chapterLabel:"3章・砂漠ルート", bg:"backgrounds/desert.webp", story:{ intro:[
      { speaker:"", text:"焼けた砂が視界を歪ませる。水も、影も、乏しい。" },
  ], outro:[
      { speaker:"", text:"灼熱の地を抜け、遠くに緑の気配が見え始めた。" },
  ]}},
  "ch4_forest": { chapterLabel:"4章・海ルート", bg:"backgrounds/forest_valley.webp", story:{ intro:[
      { speaker:"", text:"海を渡った先に広がるのは、光の届かぬ深い樹海だった。" },
      { speaker:"魔法使い", text:"木々の間から、妙な気配がします……気をつけて。" },
  ], outro:[
      { speaker:"", text:"樹海を抜けた一行は、渓谷への道を選んだ。" },
  ]}},
  "ch4_canyon": { chapterLabel:"4章・海ルート", bg:"backgrounds/canyon.webp", story:{ intro:[
      { speaker:"", text:"切り立った渓谷が、一行の行く手に立ちはだかる。" },
      { speaker:"副官", text:"足場が悪いですね……慎重に進みましょう。" },
  ], outro:[
      { speaker:"", text:"渓谷を抜けると、赤黒く染まった空が見えてきた。" },
  ]}},
  "ch4_village": { chapterLabel:"4章・砂漠ルート", bg:"backgrounds/village.webp", story:{ intro:[
      { speaker:"村人", text:"どうか……どうか助けてください……!" },
      { speaker:"隊長", text:"もう大丈夫だ。我らが来た以上、悪いようにはしない。" },
  ], outro:[
      { speaker:"村人", text:"ありがとうございます……もう大丈夫なんですね……。" },
  ]}},
  "ch5": { chapterLabel:"5章", bg:"backgrounds/volcano_approach.webp", story:{ intro:[
      { speaker:"", text:"村を救った先、赤黒い空の下に竜の棲む火山がそびえる。" },
      { speaker:"竜", text:"――ォォォオオオ……ォ……。" },
      { speaker:"隊長", text:"これが最後の戦いだ。全軍、突撃!" },
  ], outro:[
      { speaker:"", text:"轟音と共に、火口の奥へと道が続いていた。" },
  ]}},
  "ch6": { chapterLabel:"6章", bg:"backgrounds/volcano_dragon.webp", story:{ intro:[
      { speaker:"竜", text:"――ォ……ォォ……オォオオ……ォ!!" },
      { speaker:"隊長", text:"退くな……! ここが正念場だ!" },
  ], outro:[
      { speaker:"竜", text:"……ォ……ォ……。" },
      { speaker:"", text:"竜は地に伏し、長き討伐はついに終わりを迎えた……はずだった。" },
  ]}},
  "ch7": { chapterLabel:"7章", bg:"backgrounds/castle_intact.webp", story:{ intro:[
      { speaker:"", text:"長き旅を終え、一行はようやく王都へと帰路についた。" },
      { speaker:"隊長", text:"見えてきたぞ……あれが、我らの城だ。" },
      { speaker:"副官", text:"やっと、帰れますね……。" },
  ], outro:[
      { speaker:"", text:"だが、近づくにつれ、何かがおかしいと誰もが気づき始めていた。" },
  ]}},
  "ch8": { chapterLabel:"8章", bg:"backgrounds/capital_fallen.webp", story:{ intro:[
      { speaker:"", text:"凱旋の途上、王都に立ち上る黒煙が見えた。" },
      { speaker:"副官", text:"まさか……王都が、陥落している……!?" },
      { speaker:"幽霊", text:"……かえ……れ……ここは、もう……。" },
      { speaker:"隊長", text:"……行くぞ。まだ、終わっていない。" },
  ], outro:[
      { speaker:"", text:"焼け跡を前に、隊長は剣を強く握り直した。" },
  ]}},
  "ch9": { chapterLabel:"9章", bg:"backgrounds/stage1_hall.webp", story:{ intro:[
      { speaker:"", text:"城内深く、王の姿はない。連れ去られたのだ。" },
      { speaker:"王妃", text:"陛下は地下の牢に……お願い、間に合って……。" },
  ], outro:[
      { speaker:"王", text:"よく、ここまで来てくれた……。だが、真の敵はまだ先にいる。" },
      { speaker:"王妃", text:"ご無事で……本当に、良かった……。" },
  ]}},
  "ch10": { chapterLabel:"10章", bg:"backgrounds/castle_intact.webp", story:{ intro:[
      { speaker:"", text:"戦いの果て、糸を引いていたのは、すぐ近くに潜んでいた一人の魔女だった。" },
      { speaker:"魔女", text:"ようこそ。竜も、王都も……すべては序章に過ぎぬ。" },
      { speaker:"隊長", text:"何が目的だ……!" },
      { speaker:"魔女", text:"さあ、続きを始めましょうか。" },
  ], outro:[
      { speaker:"隊長", text:"長き戦いは、ここに終わりを告げた。" },
  ]}},
};

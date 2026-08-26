/*
  story-engine.js
  ------------------------------------------------------------------
  ゲーム本体(index.html / battle.js)から独立したノベルパート再生エンジン。

  使い方:
    StoryEngine.play(stageId, "intro", () => { ...次の処理... });
    StoryEngine.play(stageId, "outro", () => { ...次の処理... });

  ・stageId に対応するデータが story-data.js (window.STORY_DATA) に無い場合、
    または intro/outro が空の場合は、何も表示せず即座にコールバックを呼ぶ
    (= 呼び出し側のコードは常に安全にこの関数を呼べる)。
  ・立ち絵・背景画像のパスは story-data.js 側で "portraits/xxx.webp" のような
    相対パスとして指定する。index.html と同じ階層に portraits/ backgrounds/
    フォルダを置けばそのまま動く。
  ------------------------------------------------------------------
*/
(function () {
  const CSS = `
  .se-overlay{ position:fixed; inset:0; background:rgba(8,9,14,.78); display:none;
    align-items:center; justify-content:center; z-index:9999; backdrop-filter:blur(2px);
    font-family:"Noto Sans JP","Hiragino Sans",sans-serif; }
  .se-overlay.open{ display:flex; }
  .se-scroll{ width:min(560px,92vw); background:#161a24; border:1px solid #333850; border-radius:2px;
    box-shadow:0 30px 80px rgba(0,0,0,.55); overflow:hidden; animation:se-unroll .3s cubic-bezier(.2,.8,.3,1); }
  @keyframes se-unroll{ from{ transform:scaleY(.4); opacity:0;} to{ transform:scaleY(1); opacity:1;} }
  .se-head{ display:flex; align-items:center; gap:12px; padding:14px 20px; border-bottom:1px solid #333850;
    background:linear-gradient(90deg, rgba(200,162,74,.12), transparent); }
  .se-seal{ width:32px;height:32px;border-radius:50%; background:radial-gradient(circle at 35% 30%,#d8b45f,#c8a24a 60%,#93711f);
    display:flex;align-items:center;justify-content:center; font-weight:700; font-size:14px; color:#241a04; flex-shrink:0; }
  .se-tag{ margin-left:auto; font-size:10px; padding:3px 9px; border:1px solid #333850; border-radius:20px; color:#948d76; }
  .se-visual{ position:relative; height:220px; overflow:hidden; background-color:#1b2032; background-size:cover; background-position:center;
    display:flex; align-items:flex-end; justify-content:center; }
  .se-visual::before{ content:''; position:absolute; inset:0;
    background:linear-gradient(180deg, rgba(13,15,22,.35) 0%, rgba(13,15,22,.15) 40%, rgba(13,15,22,.75) 100%); }
  .se-visual::after{ content:''; position:absolute; inset:0; background:linear-gradient(180deg, transparent 55%, #161a24 100%); }
  .se-portrait{ position:relative; z-index:1; height:100%; object-fit:contain; object-position:bottom;
    filter:drop-shadow(0 10px 18px rgba(0,0,0,.5)); display:none; }
  .se-body{ padding:18px 24px 24px; min-height:100px; }
  .se-speaker{ font-size:12px; color:#c8a24a; letter-spacing:.1em; margin-bottom:8px; height:14px; }
  .se-line{ font-size:15px; line-height:1.9; color:#e9e0c7; min-height:3.6em; white-space:pre-line; }
  .se-foot{ display:flex; justify-content:flex-end; align-items:center; padding:12px 20px; border-top:1px solid #333850; }
  .se-advance{ background:transparent; border:1px solid #c8a24a; color:#c8a24a; font-size:13px; padding:8px 18px;
    border-radius:2px; cursor:pointer; letter-spacing:.05em; font-family:inherit; }
  .se-advance:hover{ background:rgba(200,162,74,.12); }
  `;

  let injected = false;
  let overlay, sealEl, tagEl, visualEl, portraitEl, speakerEl, lineEl, advanceBtn;
  let currentLines = [], idx = 0, typing = null, onDone = null;

  function ensureDom() {
    if (injected) return;
    injected = true;
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    overlay = document.createElement('div');
    overlay.className = 'se-overlay';
    overlay.innerHTML = `
      <div class="se-scroll">
        <div class="se-head">
          <div class="se-seal" id="seSeal">-</div>
          <div class="se-tag" id="seTag"></div>
        </div>
        <div class="se-visual" id="seVisual">
          <img class="se-portrait" id="sePortrait" src="" alt="">
        </div>
        <div class="se-body">
          <div class="se-speaker" id="seSpeaker"></div>
          <div class="se-line" id="seLine"></div>
        </div>
        <div class="se-foot">
          <button class="se-advance" id="seAdvance">つづける ▸</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    sealEl = overlay.querySelector('#seSeal');
    tagEl = overlay.querySelector('#seTag');
    visualEl = overlay.querySelector('#seVisual');
    portraitEl = overlay.querySelector('#sePortrait');
    speakerEl = overlay.querySelector('#seSpeaker');
    lineEl = overlay.querySelector('#seLine');
    advanceBtn = overlay.querySelector('#seAdvance');

    advanceBtn.addEventListener('click', advance);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) advance(); });
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); }
    });
  }

  function showLine() {
    const l = currentLines[idx];
    const portraits = window.STORY_PORTRAITS || {};
    const portraitSrc = l.speaker && portraits[l.speaker];

    speakerEl.textContent = l.speaker || '';
    if (portraitSrc) {
      portraitEl.src = portraitSrc;
      portraitEl.style.display = 'block';
    } else {
      portraitEl.style.display = 'none';
    }

    advanceBtn.textContent = (idx === currentLines.length - 1) ? '閉じる ▸' : 'つづける ▸';

    clearInterval(typing);
    lineEl.textContent = '';
    let i = 0;
    typing = setInterval(() => {
      lineEl.textContent = l.text.slice(0, i) + '▍';
      i++;
      if (i > l.text.length) {
        clearInterval(typing);
        typing = null;
        lineEl.textContent = l.text;
      }
    }, 26);
  }

  function advance() {
    if (typing) {
      clearInterval(typing);
      typing = null;
      lineEl.textContent = currentLines[idx].text;
      return;
    }
    if (idx < currentLines.length - 1) {
      idx++;
      showLine();
    } else {
      close();
    }
  }

  function close() {
    overlay.classList.remove('open');
    const cb = onDone;
    onDone = null;
    if (cb) cb();
  }

  function play(stageId, part, onComplete) {
    const done = typeof onComplete === 'function' ? onComplete : function () {};
    const data = (window.STORY_DATA || {})[stageId];
    const lines = data && data.story && data.story[part];

    if (!lines || lines.length === 0) {
      done(); // データが無ければ何もせず次に進む(呼び出し側は常に安全)
      return;
    }

    ensureDom();
    currentLines = lines;
    idx = 0;
    onDone = done;

    sealEl.textContent = (data.chapterLabel || '').replace(/[^0-9]/g, '') || '-';
    tagEl.textContent = part === 'intro' ? '序章' : '終章';

    const bgUrl = typeof data.bg === 'string' ? data.bg : (data.bg && data.bg[part]) || (data.bg && data.bg.intro) || '';
    visualEl.style.backgroundImage = bgUrl ? `url('${bgUrl}')` : 'none';

    overlay.classList.add('open');
    showLine();
  }

  window.StoryEngine = { play };
})();

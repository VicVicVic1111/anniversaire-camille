// ────────────────────────────────────────────────────────────
// PERSONNALISATION RAPIDE
const CONFIG = {
  prenom: 'Camille',
  montantFinal: 1000,
  devise: '€',
  paliers: [10, 100, 250, 500],
  participants: ['Papa', 'Maman', 'Rosaly', 'Victorien']
};
// ────────────────────────────────────────────────────────────

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
let currentStep = 1;

function money(value) { return `${value.toLocaleString('fr-FR')} ${CONFIG.devise}`; }
function listNames(names) {
  if (names.length < 2) return names[0] || '';
  return `${names.slice(0, -1).join(', ')} et ${names.at(-1)}`;
}
function setNames() { $$('.name').forEach(el => el.textContent = CONFIG.prenom.toUpperCase()); }
function showStep(number) {
  $$('.step').forEach(step => step.classList.toggle('active', Number(step.dataset.step) === number));
  currentStep = number;
  $('#progress').textContent = `${String(number).padStart(2, '0')} / 07`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

setNames();
$$('.participants').forEach(el => el.textContent = listNames(CONFIG.participants));
$('#crew').innerHTML = CONFIG.participants.map(person => `<span>${person.toUpperCase()}</span>`).join('');
$('#final-money').textContent = money(CONFIG.montantFinal);
$$('[data-next]').forEach(button => button.addEventListener('click', () => showStep(currentStep + 1)));
$('#dev-shooter-shortcut').addEventListener('click', () => { showStep(6); renderShooter(); });

// Étape 2 : une seule simulation de chute.
let dropComplete = false;
$('#drop-button').addEventListener('click', () => {
  const zone = $('#drop-zone');
  const copy = $('#drop-copy');
  const button = $('#drop-button');
  if (!dropComplete) {
    zone.classList.add('crash', 'shake');
    button.disabled = true;
    setTimeout(() => { copy.innerHTML = '<strong>AÏE&nbsp;! ET C’EST LA CHUTE.</strong> Simulation validée.'; button.innerHTML = 'IDENTIFIER LES RISQUES <b>→</b>'; button.disabled = false; dropComplete = true; }, 1350);
  } else showStep(3);
});

// Étape 3 : le passage est déverrouillé uniquement une fois tout assumé.
const risks = [
  'Ça peut tomber du canapé.',
  'Ça peut tomber d’une table.',
  'Un verre peut se renverser dessus.',
  'Ça peut être jeté malencontreusement dans un sac.',
  'Ça peut se faire massacrer en roller derby.',
  'Ça peut être donné à manger aux poules.'
];
$('#checklist').innerHTML = risks.map((risk, i) => `<label class="check"><input type="checkbox" data-risk="${i}"><span>${risk}</span></label>`).join('');
$$('[data-risk]').forEach(input => input.addEventListener('change', () => {
  const checked = $$('[data-risk]:checked').length;
  const progress = Math.round(checked / risks.length * 100);
  $('#threat-number').textContent = `${String(progress).padStart(2, '0')} %`;
  $('#meter-fill').style.width = `${progress}%`;
  const ready = checked === risks.length;
  $('#check-next').disabled = !ready;
  $('#check-next').classList.toggle('disabled', !ready);
  if (ready) $('#threat-number').textContent = 'CRITIQUE';
}));

// Étape 4 : les quatre premiers tests passent, le test quotidien finit par faire échouer le cadeau.
const tortureTests = [
  ['CHUTE', 'Chute contrôlée : cadeau intact.', 'run-drop'],
  ['LIQUIDE', 'Liquide hostile : cadeau préservé.', 'run-liquid'],
  ['IMPACT ROLLER', 'Impact roller : cadeau impassible.', 'run-roller'],
  ['SAC JETÉ', 'Sac lancé : cadeau toujours debout.', 'run-bag']
];
$('#torture-buttons').innerHTML = tortureTests.map(([name], i) => `<button class="torture" data-test="${i}">0${i + 1} — ${name}</button>`).join('');
$$('[data-test]').forEach(button => button.addEventListener('click', () => {
  const index = Number(button.dataset.test);
  button.disabled = true;
  const machine = $('.test-machine');
  machine.classList.remove('run-drop', 'run-liquid', 'run-roller', 'run-bag');
  machine.classList.add(tortureTests[index][2]);
  $('#machine-status').textContent = 'ANALYSE DU CHOC…';
  setTimeout(() => { machine.classList.remove(tortureTests[index][2]); $('#machine-status').textContent = tortureTests[index][1].toUpperCase(); }, 1050);
  if ($$('[data-test]:disabled').length === tortureTests.length) setTimeout(() => $('#daily-button').classList.remove('hidden'), 1200);
}));
$('#daily-button').addEventListener('click', () => {
  const machine = $('.test-machine');
  machine.classList.add('fail');
  $('#machine-status').textContent = 'ERREUR CRITIQUE : CADEAU EN DANGER.';
  $('#failure').textContent = `ÉCHEC. Aucun cadeau connu ne peut garantir une survie totale à une utilisation quotidienne par ${CONFIG.prenom.toUpperCase()}. Il va donc falloir te laisser choisir le tien.`;
  $('#daily-button').disabled = true;
  setTimeout(() => { const go = document.createElement('button'); go.className = 'action'; go.textContent = 'VOIR LA SOLUTION →'; go.addEventListener('click', () => showStep(5)); $('#failure').after(go); }, 900);
});

// Étape 6 : les réponses ont leur propre réplique, puis débloquent le palier suivant.
let moneyRound = 0;
const choiceReplies = {
  enough: [
    { text: "Eh bah, tu te contentes de peu, t’es vraiment de gauche.", button: "VIVE MÉLENCH’" },
    { text: "T’as déjà vu un PC à 100 € toi ?", button: "NON C VRÉ" },
    { text: 'Ça aurait presque pu marcher. Sauf qu’on a encore un peu de marge de manœuvre…', button: 'BON. ON CONTINUE' }
  ],
  more: [
    { text: 'Haha ça va j’rigole calme toi.', button: 'DSL JE SUIS PAS DRÔLE JE SAIS' },
    { text: 'Eeeeeh parle bien.', button: 'OK DSL J’ABUSE' },
    { text: 'C’est exactement l’énergie qu’il faut pour choisir une machine de guerre.', button: 'BON. ON CONTINUE' }
  ]
};

function showChoiceReply(type) {
  const reply = choiceReplies[type][moneyRound];
  $('#money-choices').innerHTML = `<p class="money-response" id="money-response">${reply.text}</p><button class="action" id="money-continue">${reply.button} <b>→</b></button>`;
  $('#money-continue').addEventListener('click', () => { moneyRound++; renderMoneyRound(); });
}

function renderSlots() {
  $('#money-title').innerHTML = `${money(CONFIG.paliers[2])}<br /><em>TIRAGE OBLIGATOIRE.</em>`;
  $('#money-copy').textContent = 'Trois essais pour obtenir le droit d’accéder au palier 500 €. La machine est probablement truquée en ta faveur.';
  $('#money-choices').innerHTML = `
    <div class="slot-wrap">
      <div class="slot-machine" id="slot-machine" aria-label="Machine à sous">
        <div class="slot-marquee">FONDS EXPRESS <b>×</b> 250</div>
        <div class="slot-case"><div class="slot-reels"><div class="reel"><div class="reel-strip">★<br>☠<br>◆<br>★</div></div><div class="reel"><div class="reel-strip">☠<br>★<br>◆<br>★</div></div><div class="reel"><div class="reel-strip">◆<br>☠<br>★<br>★</div></div></div><i class="payline"></i></div>
        <div class="slot-lights"></div><div class="slot-lever"><i></i></div>
      </div>
      <button class="action" id="slot-pull">TIRER LA MANETTE — ESSAI 1 / 3 <b>↓</b></button>
      <p class="slot-result" id="slot-result"></p>
    </div>`;
  let tries = 0;
  const results = [
    { symbols: ['★', '★', '☠'], message: 'À UN SYMBOLE PRÈS. La machine vient de te faire une crasse.' },
    { symbols: ['☠', '◆', '☠'], message: 'RATÉ. Cette machine est très clairement de mauvaise foi.' },
    { symbols: ['★', '★', '★'], message: '<strong>JACKPOT : PALIER 500 € DÉBLOQUÉ.</strong>' }
  ];
  function lockReels(symbols) { $$('.reel-strip', $('#slot-machine')).forEach((reel, index) => reel.innerHTML = `<span>${symbols[index]}</span>`); }
  $('#slot-pull').addEventListener('click', () => {
    if (tries >= 3) { moneyRound++; return renderMoneyRound(); }
    tries++;
    const machine = $('#slot-machine');
    const button = $('#slot-pull');
    const result = $('#slot-result');
    machine.classList.remove('spin', 'win', 'result-1', 'result-2', 'result-3');
    void machine.offsetWidth;
    machine.classList.add('spin');
    button.disabled = true;
    setTimeout(() => {
      const outcome = results[tries - 1];
      machine.classList.remove('spin');
      machine.classList.add(`result-${tries}`);
      lockReels(outcome.symbols);
      if (tries < 3) {
        result.textContent = outcome.message;
        button.textContent = `TIRER LA MANETTE — ESSAI ${tries + 1} / 3 ↓`;
        button.disabled = false;
      } else {
        machine.classList.add('win');
        result.innerHTML = outcome.message;
        button.textContent = 'PASSER AU PALIER 500 € →';
        button.disabled = false;
      }
    }, 1500);
  });
}

function renderSnake() {
  $('#money-title').innerHTML = `${money(CONFIG.paliers.at(-1))}<br /><em>SNAKE POUR ENCORE PLUS DE €.</em>`;
  $('#money-copy').textContent = 'Ramasse 30 rollers pour tenter de gagner. Les bords téléportent. Tu as trois vies.';
  $('#money-choices').innerHTML = `
    <div class="snake-wrap">
      <canvas id="snake-canvas" width="504" height="504" aria-label="Jeu Snake"></canvas>
      <div class="snake-stats"><p class="snake-score" id="snake-score">ROLLERS : 0 / 30</p><p class="snake-lives" id="snake-lives">VIES : ♥ ♥ ♥</p></div>
      <div class="snake-controls" aria-label="Contrôles du jeu"><button class="snake-up" data-dir="up" aria-label="Haut">▲</button><button class="snake-left" data-dir="left" aria-label="Gauche">◀</button><button class="snake-down" data-dir="down" aria-label="Bas">▼</button><button class="snake-right" data-dir="right" aria-label="Droite">▶</button></div>
      <button class="action" id="snake-start">LANCER LE SNAKE <b>→</b></button>
      <p class="snake-result" id="snake-result"></p>
    </div>`;
  const canvas = $('#snake-canvas');
  const ctx = canvas.getContext('2d');
  const grid = 14, size = canvas.width / grid;
  const headImage = new Image();
  const rollerImage = new Image();
  headImage.src = 'assets/camille-head.png';
  rollerImage.src = 'assets/rollers.png';
  let snake, apples, direction, queuedDirection, score, lives, timer, playing, snakeFinished = false, resumePending = false;
  const directions = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] };
  function buildSnake(length) {
    const path = [{x:7,y:7}];
    for (let x=6; x>=0 && path.length<length; x--) path.push({x,y:7});
    for (let y=8; path.length<length && y<grid; y++) {
      const forwards = y % 2 === 0;
      for (let column=0; column<grid && path.length<length; column++) path.push({x: forwards ? column : grid-1-column, y});
    }
    return path;
  }
  function addRoller() { let next; do { next = { x: Math.floor(Math.random() * grid), y: Math.floor(Math.random() * grid) }; } while (snake.some(p => p.x === next.x && p.y === next.y) || apples.some(p => p.x === next.x && p.y === next.y)); apples.push(next); }
  function refillRollers() { while (apples.length < 5) addRoller(); }
  function draw() {
    ctx.fillStyle = '#11100f'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = 'rgba(243,239,226,.12)'; ctx.lineWidth = 1;
    for(let i=0;i<=grid;i++){ctx.beginPath();ctx.moveTo(i*size,0);ctx.lineTo(i*size,canvas.height);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*size);ctx.lineTo(canvas.width,i*size);ctx.stroke();}
    apples.forEach(apple => { if (rollerImage.complete && rollerImage.naturalWidth) ctx.drawImage(rollerImage, apple.x*size-5, apple.y*size-5, size+10, size+10); else { ctx.fillStyle = '#ff3b30'; ctx.font = `${size}px Arial`; ctx.fillText('◉', apple.x*size, (apple.y+1)*size-2); } });
    snake.forEach((p,i)=>{
      if (i) { ctx.fillStyle='#ceff1a'; ctx.fillRect(p.x*size+3,p.y*size+3,size-6,size-6); return; }
      if (headImage.complete && headImage.naturalWidth) { ctx.save(); ctx.beginPath(); ctx.arc(p.x*size+size/2,p.y*size+size/2,size/2-2,0,Math.PI*2); ctx.clip(); ctx.drawImage(headImage,p.x*size,p.y*size,size,size); ctx.restore(); }
      else { ctx.fillStyle='#f3efe2'; ctx.fillRect(p.x*size+3,p.y*size+3,size-6,size-6); }
    });
  }
  function endGame(won) {
    clearInterval(timer); playing=false;
    const result = $('#snake-result');
    result.innerHTML = won ? '<strong>SNAKE VALIDÉ.</strong> Tu peux encore gagner plus.' : '<strong>Bon t’es nulle, pas grave.</strong> Tu peux encore gagner plus.';
    snakeFinished = true;
    $('#snake-start').textContent = 'VOIR LA SUITE →';
    $('#snake-start').disabled = false;
  }
  function updateLives() { $('#snake-lives').textContent = `VIES : ${'♥ '.repeat(lives).trim() || '☠'}`; }
  function resetAfterHit(message) {
    clearInterval(timer); playing = false; canvas.classList.add('snake-hit');
    $('#snake-result').textContent = message;
    resumePending = true;
    $('#snake-start').textContent = `REPRENDRE — ${lives} VIE${lives > 1 ? 'S' : ''} →`;
    $('#snake-start').disabled = false;
  }
  function tick() {
    direction = queuedDirection;
    const head = { x: (snake[0].x + direction[0] + grid) % grid, y: (snake[0].y + direction[1] + grid) % grid };
    const hit = snake.some(p => p.x === head.x && p.y === head.y);
    if(hit) {
      lives--; updateLives();
      if(lives === 2) return resetAfterHit('AÏE. Première vie perdue : tu t’es mordue toute seule.');
      if(lives === 1) return resetAfterHit('DEUXIÈME VIE PERDUE. Concentre-toi, Camille.');
      return endGame(false);
    }
    snake.unshift(head);
    const rollerIndex = apples.findIndex(apple => head.x === apple.x && head.y === apple.y);
    if(rollerIndex !== -1) { score++; apples.splice(rollerIndex,1); refillRollers(); $('#snake-score').textContent = `ROLLERS : ${score} / 30`; if(score >= 30) return endGame(true); } else snake.pop();
    draw();
  }
  function setDirection(next) { if(!playing) return; const n=directions[next]; if(n[0] !== -direction[0] || n[1] !== -direction[1]) queuedDirection=n; }
  function resumeGame() { canvas.classList.remove('snake-hit'); snake=buildSnake(3+score); direction=[1,0]; queuedDirection=direction; apples=[]; refillRollers(); resumePending=false; playing=true; draw(); $('#snake-result').textContent=''; $('#snake-start').textContent='JEU EN COURS…'; $('#snake-start').disabled=true; timer=setInterval(tick,125); }
  function start() { clearInterval(timer); snakeFinished=false; resumePending=false; snake=buildSnake(3); direction=[1,0]; queuedDirection=direction; score=0; lives=3; apples=[]; refillRollers(); playing=true; draw(); $('#snake-score').textContent='ROLLERS : 0 / 30'; updateLives(); $('#snake-result').textContent=''; $('#snake-start').textContent='JEU EN COURS…'; $('#snake-start').disabled=true; timer=setInterval(tick,125); }
  $('#snake-start').addEventListener('click', () => snakeFinished ? renderQuiz() : (resumePending ? resumeGame() : start()));
  $$('[data-dir]').forEach(button => button.addEventListener('click', () => setDirection(button.dataset.dir)));
  let touchStart;
  canvas.addEventListener('touchstart', event => { touchStart = event.changedTouches[0]; }, { passive: true });
  canvas.addEventListener('touchend', event => { if(!touchStart) return; const touch = event.changedTouches[0], dx = touch.clientX-touchStart.clientX, dy = touch.clientY-touchStart.clientY; if(Math.max(Math.abs(dx),Math.abs(dy)) > 18) setDirection(Math.abs(dx)>Math.abs(dy) ? (dx>0?'right':'left') : (dy>0?'down':'up')); touchStart=null; }, { passive: true });
  const keyHandler = event => { const key = {ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[event.key]; if(key && playing){event.preventDefault();setDirection(key);} };
  document.addEventListener('keydown', keyHandler);
  snake=buildSnake(3); direction=[1,0]; queuedDirection=direction; score=0; lives=3; apples=[]; refillRollers();
  headImage.onload = draw;
  rollerImage.onload = draw;
  draw();
}

function renderQuiz() {
  const questions = [
    { question: 'En quelle année Titeuf s’est-il crevé un œil ?', answers: ['2004', '2006', '2009', '2012'], correct: 1, detail: 'Titeuf avait décidément décidé de vivre dangereusement.' },
    { question: 'Combien de chatons Ruby a-t-elle eus au total ?', answers: ['8', '11', '12', '15'], correct: 1, detail: 'Onze mini-Ruby. Une vraie usine à chatons.' },
    { question: 'Pour combien de personnes était l’osso bucco que Charlie a allègrement mangé ?', answers: ['4 personnes', '6 personnes', '8 personnes', 'Toute la famille'], correct: 2, detail: 'Charlie avait faim. Très faim.' }
  ];
  let index = 0, score = 0;
  $('#money-title').innerHTML = '500 €<br /><em>QUIZZ SOUVENIRS.</em>';
  $('#money-copy').textContent = 'Réponds aux archives familiales pour débloquer le prochain palier.';
  function showQuestion() {
    const item = questions[index];
    $('#money-choices').innerHTML = `<div class="quiz-wrap"><p class="quiz-count">QUESTION ${index + 1} / ${questions.length}</p><h3>${item.question}</h3><div class="quiz-answers">${item.answers.map((answer, answerIndex) => `<button class="torture" data-answer="${answerIndex}">${answer}</button>`).join('')}</div><p class="quiz-feedback" id="quiz-feedback"></p></div>`;
    $$('[data-answer]').forEach(button => button.addEventListener('click', () => {
      const selected = Number(button.dataset.answer);
      const correct = selected === item.correct;
      if (correct) score++;
      $$('[data-answer]').forEach(choice => { choice.disabled = true; choice.classList.toggle('quiz-correct', Number(choice.dataset.answer) === item.correct); choice.classList.toggle('quiz-wrong', Number(choice.dataset.answer) === selected && !correct); });
      $('#quiz-feedback').innerHTML = correct ? `<strong>BIEN JOUÉ.</strong> ${item.detail}` : `<strong>PRESQUE.</strong> La bonne réponse était : ${item.answers[item.correct]}. ${item.detail}`;
      const next = document.createElement('button'); next.className = 'action'; next.innerHTML = index === questions.length - 1 ? 'DÉBLOQUER 750 € <b>→</b>' : 'QUESTION SUIVANTE <b>→</b>';
      next.addEventListener('click', () => { index++; index === questions.length ? renderShooter() : showQuestion(); });
      $('#quiz-feedback').after(next);
    }));
  }
  showQuestion();
}

function renderShooter() {
  $('#money-title').innerHTML = '750 €<br /><em>NIVEAU BONUS.</em>';
  $('#money-copy').textContent = 'Tu peux encore gagner plus. Détruis les vaisseaux, puis affronte le boss final.';
  $('#money-choices').innerHTML = `
    <div class="shooter-wrap">
      <canvas id="shooter-canvas" width="420" height="430" aria-label="Jeu de vaisseau pixelisé"></canvas>
      <p class="shooter-status" id="shooter-status">VAGUE 1 — DÉTRUIS LES INTRUS</p>
      <div class="ship-health" aria-label="Vie du vaisseau"><span>VIE CAMILLE</span><i><b id="ship-health-fill"></b></i></div>
      <div class="shooter-controls" aria-label="Contrôles du vaisseau"><button data-ship="left" aria-label="Aller à gauche">◀</button><button class="shoot" data-ship="shoot" aria-label="Tirer">TIRER</button><button data-ship="right" aria-label="Aller à droite">▶</button></div>
      <button class="action" id="shooter-start">LANCER LA MISSION <b>→</b></button>
    </div>`;
  const canvas = $('#shooter-canvas'), ctx = canvas.getContext('2d');
  const head = new Image(), logo = new Image(); head.src='assets/camille-head.png'; logo.src='assets/urssaf-logo.png';
  const subHeads = [new Image(), new Image(), new Image()]; subHeads[0].src='assets/subboss-one.avif'; subHeads[1].src='assets/subboss-two.png'; subHeads[2].src='assets/subboss-three.png';
  let playerX=190, bullets=[], enemyBullets=[], enemies=[], subBosses=[], boss=null, running=false, lastShot=0, lastBossShot=0, bossPauseUntil=0, bossDialogue='', shipHealth=100;
  const bossLines=['DONNE-MOI TOUT TON ARGENT, CAMILLE.', 'T’AS PENSÉ À FAIRE TA DÉCLARATION ?', 'TU AS LE DROIT À L’ERREUR, CAMILLE, TU SAIS ?'];
  function makeEnemies(){ enemies=Array.from({length:12},(_,i)=>({x:30+(i%6)*64,y:52+Math.floor(i/6)*48,alive:true,phase:i})); }
  function makeSubBosses(){ subBosses=[{x:52,y:78,hp:7,maxHp:7,phase:0},{x:174,y:92,hp:7,maxHp:7,phase:2},{x:296,y:78,hp:7,maxHp:7,phase:4}]; }
  function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
  function pixelShip(x,y){ ctx.fillStyle='#ceff1a';ctx.fillRect(x+14,y+34,22,22);ctx.fillRect(x+7,y+49,36,14);ctx.fillRect(x+2,y+58,12,10);ctx.fillRect(x+36,y+58,12,10);ctx.fillStyle='#ff3b30';ctx.fillRect(x+20,y+63,10,12); if(head.complete&&head.naturalWidth){ctx.save();ctx.beginPath();ctx.arc(x+25,y+22,16,0,Math.PI*2);ctx.clip();ctx.drawImage(head,x+9,y+5,32,32);ctx.restore();}else{rect(x+12,y+8,26,26,'#f3efe2');} }
  function enemy(x,y){ctx.fillStyle='#ff3b30';ctx.fillRect(x+8,y,20,8);ctx.fillRect(x+3,y+8,30,16);ctx.fillRect(x,y+24,36,8);ctx.fillStyle='#f3efe2';ctx.fillRect(x+13,y+11,10,6);}
  function drawSubBoss(sub,index){const x=sub.x,y=sub.y;ctx.fillStyle='#6525a8';ctx.fillRect(x,y+35,68,28);ctx.fillStyle='#ceff1a';ctx.fillRect(x+8,y+59,52,12);ctx.fillStyle='#ff3b30';ctx.fillRect(x+28,y+70,12,12);if(subHeads[index].complete&&subHeads[index].naturalWidth){ctx.save();ctx.beginPath();ctx.arc(x+34,y+28,27,0,Math.PI*2);ctx.clip();ctx.drawImage(subHeads[index],x+7,y+1,54,54);ctx.restore();}else{ctx.fillStyle='#f3efe2';ctx.fillRect(x+16,y+8,36,38);}ctx.fillStyle='#f3efe2';ctx.fillRect(x,y-9,68,5);ctx.fillStyle='#ff3b30';ctx.fillRect(x,y-9,68*(sub.hp/sub.maxHp),5);}
  function drawBoss(){ const x=boss.x,y=38; ctx.fillStyle='#0c5cac';ctx.fillRect(x,y,140,70);ctx.fillStyle='#5da6e8';ctx.fillRect(x+12,y+12,116,46);ctx.fillStyle='#ff3b30';ctx.fillRect(x+4,y+63,132,12); if(logo.complete&&logo.naturalWidth)ctx.drawImage(logo,x+30,y+19,80,34); else {ctx.fillStyle='#fff';ctx.font='bold 18px Arial';ctx.fillText('URSSAF',x+30,y+43);} ctx.fillStyle='#f3efe2';ctx.fillRect(110,12,200,9);ctx.fillStyle='#ff3b30';ctx.fillRect(110,12,200*(boss.hp/boss.maxHp),9); }
  function drawDialogue(text){const words=text.split(' '),lines=[];let line='';ctx.font='bold 15px monospace';words.forEach(word=>{const next=`${line} ${word}`.trim();if(ctx.measureText(next).width>330&&line){lines.push(line);line=word;}else line=next;});if(line)lines.push(line);const height=lines.length*19+25,x=18,y=138;ctx.fillStyle='#f3efe2';ctx.fillRect(x,y,384,height);ctx.fillStyle='#ff3b30';ctx.fillRect(x+5,y+5,374,height-10);ctx.fillStyle='#11100f';ctx.fillRect(x+9,y+9,366,height-18);ctx.fillStyle='#f3efe2';ctx.fillRect(318,y+height,19,19);ctx.fillStyle='#11100f';ctx.fillRect(318,y+height,9,9);ctx.fillStyle='#f3efe2';ctx.font='bold 15px monospace';lines.forEach((entry,index)=>ctx.fillText(entry,x+20,y+25+index*19));}
  function draw(){ctx.fillStyle='#070908';ctx.fillRect(0,0,canvas.width,canvas.height);for(let i=0;i<55;i++){ctx.fillStyle=i%4?'#f3efe2':'#ceff1a';ctx.fillRect((i*79)%420,(i*43)%430,2,2)} enemies.filter(e=>e.alive).forEach(e=>enemy(e.x,e.y));subBosses.filter(sub=>sub.hp>0).forEach(drawSubBoss);bullets.forEach(b=>rect(b.x,b.y,4,13,'#ceff1a'));enemyBullets.forEach(b=>rect(b.x,b.y,7,15,'#ff3b30')); if(boss)drawBoss();pixelShip(playerX,350);if(bossDialogue)drawDialogue(bossDialogue);}
  function shoot(){if(!running||Date.now()-lastShot<220)return; bullets.push({x:playerX+23,y:340});lastShot=Date.now();}
  function hitShip(){shipHealth=Math.max(8,shipHealth-12);$('#ship-health-fill').style.width=`${shipHealth}%`;$('.ship-health').classList.toggle('critical',shipHealth<=32);canvas.classList.add('ship-hit');setTimeout(()=>canvas.classList.remove('ship-hit'),260);}
  function win(){running=false;bossDialogue='';$('#shooter-status').textContent='BOSS URSSAF DÉTRUIT';$('#shooter-start').textContent='RÉVÉLER LE CADEAU →';$('#shooter-start').disabled=false;}
  function showBossLine(index){bossPauseUntil=Date.now()+2600;bossDialogue=bossLines[index];$('#shooter-status').textContent=`⚠ URSSAF PARLE — PHASE ${index+1} ⚠`;}
  function update(){ if(!running)return; if(boss && Date.now()<bossPauseUntil){draw();requestAnimationFrame(update);return;} if(boss)bossDialogue=''; bullets.forEach(b=>b.y-=7);enemyBullets.forEach(b=>b.y+=4);bullets=bullets.filter(b=>b.y>-20);enemyBullets=enemyBullets.filter(b=>{if(b.x>playerX-4&&b.x<playerX+54&&b.y>345&&b.y<424){hitShip();return false;}return b.y<440;}); enemies.forEach(e=>{if(!e.alive)return;e.x+=Math.sin((Date.now()/330)+e.phase)*.8;bullets.forEach(b=>{if(e.alive&&b.x>e.x&&b.x<e.x+38&&b.y>e.y&&b.y<e.y+32){e.alive=false;b.y=-30;}})}); if(!boss&&enemies.every(e=>!e.alive)&&subBosses.length===0){makeSubBosses();$('#shooter-status').textContent='SOUS-BOSS — ESCADRON DES TÊTES VOLANTES';} subBosses.forEach((sub,index)=>{if(sub.hp<=0)return;sub.x+=Math.sin(Date.now()/520+sub.phase)*.7;bullets.forEach(b=>{if(sub.hp>0&&b.x>sub.x&&b.x<sub.x+68&&b.y>sub.y&&b.y<sub.y+76){sub.hp--;b.y=-30;}})}); if(!boss&&subBosses.length&&subBosses.every(sub=>sub.hp<=0)){boss={x:140,hp:45,maxHp:45,dir:1,stage:0};lastBossShot=Date.now();showBossLine(0);} if(boss){const speed=boss.hp>30?1.25:boss.hp>15?2.3:3.7;boss.x+=boss.dir*speed;if(boss.x<10||boss.x>270)boss.dir*=-1;if(Date.now()-lastBossShot>3000){enemyBullets.push({x:boss.x+67,y:110});lastBossShot=Date.now();}bullets.forEach(b=>{if(b.x>boss.x&&b.x<boss.x+140&&b.y>38&&b.y<110){boss.hp--;b.y=-30;}});const nextStage=boss.hp<=15?2:boss.hp<=30?1:0;if(nextStage>boss.stage){boss.stage=nextStage;showBossLine(nextStage);}if(boss.hp<=0){draw();win();return;}}draw();requestAnimationFrame(update); }
  function start(){makeEnemies();playerX=190;bullets=[];enemyBullets=[];subBosses=[];boss=null;shipHealth=100;$('#ship-health-fill').style.width='100%';$('.ship-health').classList.remove('critical');running=true;lastBossShot=0;bossPauseUntil=0;bossDialogue='';$('#shooter-status').textContent='VAGUE 1 — DÉTRUIS LES INTRUS';$('#shooter-start').textContent='MISSION EN COURS…';$('#shooter-start').disabled=true;draw();requestAnimationFrame(update);}
  function control(action){if(action==='left')playerX=Math.max(0,playerX-28);if(action==='right')playerX=Math.min(370,playerX+28);if(action==='shoot')shoot();draw();}
  $('#shooter-start').addEventListener('click',()=>running?null:($('#shooter-start').textContent.includes('RÉVÉLER')?showStep(7):start()));
  $$('[data-ship]').forEach(btn=>btn.addEventListener('click',()=>control(btn.dataset.ship)));
  document.addEventListener('keydown',e=>{if(!running)return;const key={ArrowLeft:'left',ArrowRight:'right',' ':'shoot',Spacebar:'shoot'}[e.key];if(key){e.preventDefault();control(key);}});
  head.onload=draw;logo.onload=draw;subHeads.forEach(image=>image.onload=draw);draw();
}

function renderMoneyRound() {
  if (moneyRound === 2) return renderSlots();
  if (moneyRound === 3) return renderSnake();
  const value = CONFIG.paliers[moneyRound];
  $('#money-title').innerHTML = `${money(value)}<br /><em>ÇA VA ?</em>`;
  $('#money-copy').textContent = `On t’a préparé ${money(value)}. Tu acceptes, ou tu négocies sans honte ?`;
  $('#money-choices').innerHTML = `<button class="action" id="enough">SUPER ! ÇA ME SUFFIT</button><button class="action" id="more">WESH, DONNE UN PEU PLUS QUAND MÊME</button><p class="money-response" id="money-response"></p>`;
  $('#enough').addEventListener('click', () => showChoiceReply('enough'));
  $('#more').addEventListener('click', () => showChoiceReply('more'));
}
renderMoneyRound();

// Étape 7 : petite pluie de confettis industriels + post-scriptum.
$('#promise').addEventListener('click', () => {
  $('#warranty').textContent = 'Cette déclaration n’est pas couverte par la garantie. Bon anniversaire ♥';
  const layer = $('.confetti'); layer.innerHTML = '';
  for (let i = 0; i < 32; i++) { const piece = document.createElement('i'); piece.style.left = `${Math.random() * 100}%`; piece.style.background = i % 2 ? 'var(--red)' : 'var(--acid)'; piece.style.animationDelay = `${Math.random() * .8}s`; layer.append(piece); }
});

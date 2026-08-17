// Super Ace - lightweight static SPA (no build required)
// Replaces placeholder bundle with a playable, client-only "Super Ace" mini-game.

(function () {
  // Utility helpers
  function qs(s, el) { return (el || document).querySelector(s); }
  function qsa(s, el) { return Array.from((el || document).querySelectorAll(s)); }

  // Game state persisted in localStorage
  var STORAGE_KEY = 'superace_state_v1';
  var state = {
    credits: 1000,
    bet: 10
  };
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = Object.assign(state, JSON.parse(saved));
  } catch (e) {
    // ignore
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  // DOM mount
  document.addEventListener('DOMContentLoaded', function () {
    var loader = document.getElementById('jsLoader');
    var root = document.getElementById('root');
    if (loader) loader.classList.add('hidden');

    if (!root) return;

    // Build UI
    root.innerHTML = '';
    var container = document.createElement('div');
    container.style.minHeight = '100vh';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.background = 'linear-gradient(180deg,#0b0b0b,#040404)';
    container.style.color = '#fff';
    container.style.fontFamily = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
    container.style.padding = '24px';

    var header = document.createElement('header');
    header.style.width = '100%';
    header.style.maxWidth = '900px';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '18px';

    var title = document.createElement('h1');
    title.innerText = 'Super Ace';
    title.style.margin = '0';
    title.style.fontSize = '22px';

    var credits = document.createElement('div');
    credits.style.textAlign = 'right';
    credits.innerHTML = '<div style="font-size:12px;opacity:0.8">Credits</div><div id="credits-value" style="font-weight:700;font-size:18px">' + state.credits + '</div>';

    header.appendChild(title);
    header.appendChild(credits);

    var board = document.createElement('section');
    board.style.width = '100%';
    board.style.maxWidth = '900px';
    board.style.display = 'flex';
    board.style.flexDirection = 'column';
    board.style.alignItems = 'center';

    var machine = document.createElement('div');
    machine.style.width = '100%';
    machine.style.maxWidth = '640px';
    machine.style.background = 'linear-gradient(180deg,#1b1b1b,#0f0f0f)';
    machine.style.border = '1px solid rgba(255,255,255,0.06)';
    machine.style.borderRadius = '12px';
    machine.style.padding = '20px';
    machine.style.boxShadow = '0 6px 24px rgba(0,0,0,0.6)';

    var reels = document.createElement('div');
    reels.style.display = 'flex';
    reels.style.justifyContent = 'space-between';
    reels.style.marginBottom = '16px';

    function makeReel() {
      var r = document.createElement('div');
      r.style.flex = '1';
      r.style.margin = '0 6px';
      r.style.height = '120px';
      r.style.background = 'linear-gradient(180deg,#0a0a0a,#151515)';
      r.style.borderRadius = '8px';
      r.style.display = 'flex';
      r.style.alignItems = 'center';
      r.style.justifyContent = 'center';
      r.style.fontSize = '32px';
      r.style.fontWeight = '700';
      r.style.color = '#ffd700';
      r.style.letterSpacing = '1px';
      r.style.boxShadow = 'inset 0 -6px 16px rgba(0,0,0,0.6)';
      r.innerText = '—';
      return r;
    }

    var reelEls = [makeReel(), makeReel(), makeReel()];
    reelEls.forEach(function (re) { reels.appendChild(re); });
    machine.appendChild(reels);

    var controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.justifyContent = 'space-between';
    controls.style.alignItems = 'center';

    var leftControls = document.createElement('div');
    leftControls.style.display = 'flex';
    leftControls.style.alignItems = 'center';

    var betLabel = document.createElement('div');
    betLabel.style.marginRight = '8px';
    betLabel.style.opacity = '0.9';
    betLabel.style.fontSize = '13px';
    betLabel.innerText = 'Bet:';

    var betInput = document.createElement('input');
    betInput.type = 'number';
    betInput.value = state.bet;
    betInput.min = 1;
    betInput.step = 1;
    betInput.style.width = '100px';
    betInput.style.padding = '6px 8px';
    betInput.style.borderRadius = '6px';
    betInput.style.border = '1px solid rgba(255,255,255,0.06)';
    betInput.style.background = '#0b0b0b';
    betInput.style.color = '#fff';

    leftControls.appendChild(betLabel);
    leftControls.appendChild(betInput);

    var rightControls = document.createElement('div');

    var spinBtn = document.createElement('button');
    spinBtn.innerText = 'SPIN';
    spinBtn.style.padding = '10px 18px';
    spinBtn.style.borderRadius = '8px';
    spinBtn.style.border = 'none';
    spinBtn.style.background = 'linear-gradient(180deg,#ff8a00,#ff4d00)';
    spinBtn.style.color = '#111';
    spinBtn.style.fontWeight = '700';
    spinBtn.style.cursor = 'pointer';
    spinBtn.style.boxShadow = '0 6px 18px rgba(255,77,0,0.18)';

    rightControls.appendChild(spinBtn);

    controls.appendChild(leftControls);
    controls.appendChild(rightControls);

    machine.appendChild(controls);

    var message = document.createElement('div');
    message.style.marginTop = '12px';
    message.style.minHeight = '20px';
    message.style.fontSize = '14px';
    message.style.opacity = '0.95';
    machine.appendChild(message);

    board.appendChild(machine);

    var footer = document.createElement('footer');
    footer.style.marginTop = '18px';
    footer.style.fontSize = '13px';
    footer.style.opacity = '0.9';
    footer.innerHTML = 'This is a demo Super Ace game. No real money. Built for demo purposes.';

    container.appendChild(header);
    container.appendChild(board);
    container.appendChild(footer);

    root.appendChild(container);

    // Game logic
    var symbols = ['A', 'K', 'Q', 'J', '10', '9'];
    function spinOnce(bet) {
      // simple RNG weighted outcome
      var results = [];
      for (var i = 0; i < 3; i++) {
        var idx = Math.floor(Math.random() * symbols.length);
        results.push(symbols[idx]);
      }
      return results;
    }

    function evaluate(results, bet) {
      // simple paytable: triple A = 50x, triple K = 20x, triple Q = 10x, triple J = 6x, triples 10/9 = 4x, two of a kind pays 2x
      if (results[0] === results[1] && results[1] === results[2]) {
        var sym = results[0];
        switch (sym) {
          case 'A': return {mult:50, text:'Triple A! Huge win!'};
          case 'K': return {mult:20, text:'Triple K! Nice!'};
          case 'Q': return {mult:10, text:'Triple Q!'};
          case 'J': return {mult:6, text:'Triple J!'};
          default: return {mult:4, text:'Triple match!'};
        }
      }
      // two of a kind
      if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        return {mult:2, text:'Two of a kind!'};
      }
      return {mult:0, text:'No match. Try again.'};
    }

    function renderCredits() {
      var el = document.getElementById('credits-value');
      if (el) el.innerText = state.credits;
    }

    function animateReels(finalSymbols, cb) {
      var duration = 1200;
      var start = Date.now();
      var anim = function () {
        var now = Date.now();
        var t = (now - start) / duration;
        if (t >= 1) t = 1;
        reelEls.forEach(function (reel, i) {
          if (t < (i+1)/3) {
            // spinning
            var idx = Math.floor(Math.random() * symbols.length);
            reel.innerText = symbols[idx];
          } else {
            reel.innerText = finalSymbols[i];
          }
        });
        if (t < 1) requestAnimationFrame(anim); else if (cb) cb();
      };
      requestAnimationFrame(anim);
    }

    spinBtn.addEventListener('click', function () {
      var bet = parseInt(betInput.value, 10) || 0;
      if (bet <= 0) { message.innerText = 'Enter a valid bet.'; return; }
      if (bet > state.credits) { message.innerText = 'Insufficient credits.'; return; }
      // lock controls
      spinBtn.disabled = true; spinBtn.style.opacity = '0.7';
      betInput.disabled = true;
      message.innerText = 'Spinning...';

      // simulate spin
      var final = spinOnce(bet);
      animateReels(final, function () {
        var res = evaluate(final, bet);
        var payout = Math.floor(bet * res.mult);
        state.credits = state.credits - bet + payout;
        saveState();
        renderCredits();
        message.innerText = res.text + (res.mult > 0 ? (' You won ' + payout + ' credits!') : '');
        // unlock
        spinBtn.disabled = false; spinBtn.style.opacity = '1';
        betInput.disabled = false;
      });
    });

    // Quick helpers: add +/- buttons for bet
    var dec = document.createElement('button');
    dec.innerText = '-';
    dec.style.marginLeft = '8px';
    dec.style.padding = '6px 10px';
    dec.style.borderRadius = '6px';
    dec.style.border = 'none';
    dec.style.background = '#222';
    dec.style.color = '#fff';
    dec.style.cursor = 'pointer';
    dec.addEventListener('click', function () { betInput.value = Math.max(1, parseInt(betInput.value,10)-10); state.bet = parseInt(betInput.value,10); });

    var inc = document.createElement('button');
    inc.innerText = '+';
    inc.style.marginLeft = '6px';
    inc.style.padding = '6px 10px';
    inc.style.borderRadius = '6px';
    inc.style.border = 'none';
    inc.style.background = '#222';
    inc.style.color = '#fff';
    inc.style.cursor = 'pointer';
    inc.addEventListener('click', function () { betInput.value = parseInt(betInput.value,10)+10; state.bet = parseInt(betInput.value,10); });

    leftControls.appendChild(dec);
    leftControls.appendChild(inc);

    betInput.addEventListener('change', function () { state.bet = parseInt(betInput.value,10) || 1; saveState(); });

    // initial render
    renderCredits();

    // Add reset / donate buttons
    var extra = document.createElement('div');
    extra.style.marginTop = '12px';
    extra.style.display = 'flex';
    extra.style.gap = '8px';

    var resetBtn = document.createElement('button');
    resetBtn.innerText = 'Reset Credits';
    resetBtn.style.padding = '6px 10px';
    resetBtn.style.borderRadius = '6px';
    resetBtn.style.border = 'none';
    resetBtn.style.background = '#333';
    resetBtn.style.color = '#fff';
    resetBtn.style.cursor = 'pointer';
    resetBtn.addEventListener('click', function () { state.credits = 1000; saveState(); renderCredits(); message.innerText = 'Credits reset to 1000.'; });

    var shareInfo = document.createElement('div');
    shareInfo.style.opacity = '0.8';
    shareInfo.style.fontSize = '12px';
    shareInfo.innerText = 'Share: superace demo';

    extra.appendChild(resetBtn);
    extra.appendChild(shareInfo);

    machine.appendChild(extra);
  });
})();

export default {};
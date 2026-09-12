// Preloader — adapted from w3dh4xor.github.io (generative glow-line canvas)
(function(){
  "use strict";

  var overlay = document.getElementById('preloaderOverlay');
  var cnv = document.getElementById('preloaderCanvas');
  if(!overlay || !cnv) return;

  var ctx = cnv.getContext('2d');
  var W, H, L, n = 15, c = 0, dc = 0.25;
  var rafId = null;
  var stopped = false;
  var ctrls = [];

  var sin = Math.sin, cos = Math.cos, PI = Math.PI, round = Math.round, random = Math.random;

  function init(){
    W = window.innerWidth;
    H = window.innerHeight;
    cnv.width = W;
    cnv.height = H;
    L = (W < H ? W : H) / 2;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, W, H);
  }

  function Point(){
    this.ang = 2 * PI * random();
    this.dang = (-0.5 + random()) / 10;
    this.r = 2 * L / 3;
    this.x = W / 2 + this.r * cos(this.ang);
    this.y = H / 2 + this.r * sin(this.ang);
    this.update = function(){
      this.ang += this.dang;
      this.x = W / 2 + this.r * cos(this.ang);
      this.y = H / 2 + this.r * sin(this.ang);
    };
  }

  function animate(){
    if(stopped) return;
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(0, 0, W, H);
    ctx.beginPath();
    ctx.moveTo((ctrls[0].x + ctrls[n-1].x)/2, (ctrls[0].y + ctrls[n-1].y)/2);
    for(var p = 0; p < n; p++){
      var q = p + 1;
      if(q === n) q = 0;
      ctx.quadraticCurveTo(ctrls[p].x, ctrls[p].y, (ctrls[p].x + ctrls[q].x)/2, (ctrls[p].y + ctrls[q].y)/2);
      ctrls[p].update();
    }
    ctx.strokeStyle = "hsl(" + round(38 + c/5) + "deg, 100%, 55%)";
    ctx.shadowBlur = L * 30 / 432;
    ctx.shadowColor = "hsl(" + round(38 + c/5) + "deg, 100%, 50%)";
    ctx.lineWidth = L * 2 / 432;
    ctx.stroke();
    ctx.shadowColor = "transparent";
    c += dc;
    if(c >= 170 || c <= 0) dc = -dc;

    ctx.fillStyle = '#ffb000';
    ctx.font = (L/8) + "px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Catch Me If You Can! 👋", W/2, H/2 + L - L/12);

    rafId = window.requestAnimationFrame(animate);
  }

  function start(){
    init();
    window.addEventListener('resize', init);
    ctrls = [];
    for(var i = 0; i < n; i++){ ctrls.push(new Point()); }
    animate();
  }

  function finish(){
    stopped = true;
    if(rafId) window.cancelAnimationFrame(rafId);
    overlay.classList.add('preloader-hide');
    document.body.classList.remove('preloader-lock');
    setTimeout(function(){
      overlay.style.display = 'none';
    }, 650);
  }

  start();

  var minDisplay = 2200;
  var startTime = Date.now();

  function tryFinish(){
    var elapsed = Date.now() - startTime;
    var remaining = Math.max(0, minDisplay - elapsed);
    setTimeout(finish, remaining);
  }

  if(document.readyState === 'complete'){
    tryFinish();
  } else {
    window.addEventListener('load', tryFinish);
  }

  // safety net — never block the site for more than 6s
  setTimeout(finish, 6000);
})();

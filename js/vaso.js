/* Frutale · el vaso que se arma capa por capa.
   Vaso.crear(el) dibuja un vaso SVG y devuelve { pintar(receta) }.
   receta = { oz, capas:[{key,tipo,color,motas}], domo:{color,motas,grande}|null, toppings:[{key,color,forma}],
              jarabes:[{key,color}], helados:[{key,sabor}] }
   Las capas cambian su forma (d) con transición: se ve cómo "suben" al agregarlas. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var W = 240, RIM = 112, FONDO = 300, CX = 120, AR = 80, AB = 57; // borde, fondo y medio-anchos del vaso
  var uid = 0;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function ancho(y) { var t = (y - RIM) / (FONDO - RIM); return AR + (AB - AR) * t; }
  /* Borde superior ondulado de una capa ("ola de crema") */
  function ola(y, amp, fase) {
    var d = "M-10 " + (y + 4);
    var pasos = 6, w = (W + 20) / pasos;
    for (var i = 0; i < pasos; i++) {
      var x0 = -10 + i * w, a = ((i + fase) % 2 ? -1 : 1) * amp;
      d += " Q" + (x0 + w / 2).toFixed(1) + " " + (y + a).toFixed(1) + " " + (x0 + w).toFixed(1) + " " + y.toFixed(1);
    }
    return d;
  }
  function capaD(yTop, amp, fase) { return "path('" + ola(yTop, amp, fase) + " L250 330 L-10 330 Z')"; }

  function patrones(defs, p) {
    // fresas en rodajas
    var f = el("pattern", { id: p + "fresa", width: 34, height: 30, patternUnits: "userSpaceOnUse" }, defs);
    el("rect", { width: 34, height: 30, fill: "#E8243C" }, f);
    el("path", { d: "M9 6c-5 0-7 5-5 9 2 5 7 8 9 9 2-1 6-5 6-10 0-5-5-8-10-8Z", fill: "#FF5B6E" }, f);
    el("path", { d: "M26 17c-4 0-6 4-4 7s5 5 7 6c1-1 4-3 4-7 0-4-3-6-7-6Z", fill: "#C3122B" }, f);
    [[8, 11], [12, 15], [10, 19], [27, 22], [24, 25]].forEach(function (s) { el("ellipse", { cx: s[0], cy: s[1], rx: 1, ry: 1.6, fill: "#FFE9A8" }, f); });
    // galleta triturada
    var g = el("pattern", { id: p + "galleta", width: 22, height: 18, patternUnits: "userSpaceOnUse" }, defs);
    el("rect", { width: 22, height: 18, fill: "var(--galleta, #2E2420)" }, g);
    el("path", { d: "M3 4h5l1 4-4 2-3-3ZM13 10l5-1 2 4-5 3-2-3Z", fill: "#FFF7EA", opacity: ".55" }, g);
    // motas de crema (oreo / maracumango)
    var m = el("pattern", { id: p + "motas", width: 18, height: 16, patternUnits: "userSpaceOnUse" }, defs);
    el("circle", { cx: 4, cy: 4, r: 2.3, fill: "var(--motas, transparent)" }, m);
    el("circle", { cx: 13, cy: 11, r: 2.8, fill: "var(--motas, transparent)" }, m);
    el("rect", { x: 9, y: 2, width: 3, height: 2, rx: 1, fill: "var(--motas, transparent)" }, m);
  }

  function crear(host) {
    var p = "v" + (++uid) + "-";
    var svg = el("svg", { viewBox: "0 0 240 330", class: "vaso-svg", "aria-hidden": "true", focusable: "false" });
    var defs = el("defs", {}, svg);
    patrones(defs, p);
    var clip = el("clipPath", { id: p + "clip" }, defs);
    var forma = "M" + (CX - AR) + " " + RIM + " L" + (CX + AR) + " " + RIM + " L" + (CX + AB) + " " + FONDO + " Q" + CX + " " + (FONDO + 8) + " " + (CX - AB) + " " + FONDO + " Z";
    el("path", { d: forma }, clip);

    var todo = el("g", { class: "vaso-todo" }, svg);
    el("ellipse", { cx: CX, cy: 318, rx: 70, ry: 7, class: "vaso-sombra" }, todo);
    var cuerpo = el("g", { "clip-path": "url(#" + p + "clip)" }, todo);
    el("path", { d: forma, class: "vaso-fondo" }, cuerpo);
    var gCapas = el("g", { class: "vaso-capas" }, cuerpo);
    var gArriba = el("g", { class: "vaso-arriba" }, todo);     // domo, helados, toppings, jarabe
    var gDomo = el("g", {}, gArriba), gHelado = el("g", {}, gArriba), gTop = el("g", {}, gArriba), gJar = el("g", {}, gArriba);
    el("path", { d: forma, class: "vaso-vidrio" }, todo);
    el("path", { d: "M" + (CX - AR + 12) + " " + (RIM + 14) + " L" + (CX - AB + 9) + " " + (FONDO - 14), class: "vaso-brillo" }, todo);
    // sticker Frutale: fresa-corazón
    var st = el("g", { class: "vaso-sticker", transform: "translate(" + CX + " 238)" }, todo);
    el("circle", { r: 21, class: "st-fondo" }, st);
    el("path", { d: "M0 12C-9 6-13 0-12-5c1-5 6-7 9-4l3 3 3-3c3-3 8-1 9 4 1 5-3 11-12 17Z", class: "st-fresa" }, st);
    el("path", { d: "M-5-10c2-3 3-5 5-6 0 3 1 4 3 5-3 1-5 1-8 1Z", class: "st-hoja" }, st);
    host.appendChild(svg);

    var vivos = {};   // key -> nodo
    function quitarFaltantes(grupo, keys) {
      Array.prototype.slice.call(grupo.children).forEach(function (n) {
        var k = n.getAttribute("data-k");
        if (k && keys.indexOf(k) < 0 && !n.classList.contains("saliendo")) {
          n.classList.add("saliendo");
          if (n.dataset.flat) n.style.d = n.dataset.flat;
          setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, reduce ? 0 : 420);
          delete vivos[k];
        }
      });
    }

    function pintar(r) {
      var s = 0.8 + Math.min(1, Math.max(0, (r.oz - 8) / 8)) * 0.2;
      todo.style.transform = "translate(" + (CX * (1 - s)) + "px," + (318 * (1 - s)) + "px) scale(" + s + ")";

      /* ---- capas dentro del vaso (abajo → arriba) ---- */
      var capas = r.capas || [];
      var total = capas.reduce(function (a, c) { return a + (c.peso || 1); }, 0) || 1;
      var alto = FONDO - (RIM + 6);
      var y = FONDO + 6, tops = [];
      capas.forEach(function (c, i) {
        y -= alto * (c.peso || 1) / total;
        tops.push(i === capas.length - 1 ? RIM + 4 : y);
      });
      var keys = capas.map(function (c) { return c.key; });
      var nuevos = [];
      quitarFaltantes(gCapas, keys);
      // de arriba hacia abajo: cada capa tapa lo que está debajo de su ola
      for (var i = capas.length - 1; i >= 0; i--) {
        var c = capas[i], yTop = tops[i], n = vivos[c.key];
        var dFinal = capaD(yTop, i === capas.length - 1 ? 3 : 5, i);
        var flat = capaD(i > 0 ? tops[i - 1] : FONDO + 4, 0, i);
        if (!n) {
          n = el("path", { "data-k": c.key, class: "capa capa-" + c.tipo });
          n.style.d = flat;
          vivos[c.key] = n; nuevos.push(n);
        } else {
          n.style.d = dFinal;
        }
        n.dataset.meta = dFinal;
        n.dataset.flat = flat;
        var relleno = c.tipo === "fresa" ? "url(#" + p + "fresa)" : c.tipo === "galleta" ? "url(#" + p + "galleta)" : c.color;
        n.setAttribute("fill", relleno);
        if (c.tipo === "galleta") n.style.setProperty("--galleta", c.color);
        gCapas.appendChild(n); // orden: la de más arriba primero, la de abajo al final
        var mk = c.key + "-motas", mn = vivos[mk];
        if (c.motas) {
          if (!mn) { mn = el("path", { "data-k": mk, class: "capa", fill: "url(#" + p + "motas)" }); mn.style.d = flat; vivos[mk] = mn; nuevos.push(mn); }
          else mn.style.d = dFinal;
          mn.dataset.meta = dFinal;
          mn.style.setProperty("--motas", c.motas); mn.dataset.flat = flat;
          gCapas.appendChild(mn);
        }
      }
      // las motas deben quedar justo sobre su capa: reordenar (capa, motas) de arriba a abajo
      for (var j = capas.length - 1; j >= 0; j--) {
        var cn = vivos[capas[j].key]; if (cn) gCapas.appendChild(cn);
        var mm = vivos[capas[j].key + "-motas"]; if (mm && capas[j].motas) gCapas.appendChild(mm);
      }
      quitarFaltantes(gCapas, keys.concat(capas.filter(function (c) { return c.motas; }).map(function (c) { return c.key + "-motas"; })));
      // capas nuevas: ya están en el DOM con forma plana → forzar estilo y pasar a su forma final (anima la subida)
      nuevos.forEach(function (nn) { getComputedStyle(nn).d; nn.style.d = nn.dataset.meta; });

      /* ---- domo de crema ---- */
      var d = r.domo;
      var dk = d ? "domo" : "";
      quitarFaltantes(gDomo, dk ? [dk] : []);
      var alturaDomo = d ? (d.grande ? 64 : 50) : 0;
      if (d) {
        var dn = vivos[dk];
        var domoD = "path('M" + (CX - AR - 4) + " " + (RIM + 3) + " C" + (CX - AR + 2) + " " + (RIM - alturaDomo * .7) + " " + (CX - 34) + " " + (RIM - alturaDomo) + " " + CX + " " + (RIM - alturaDomo) +
          " C" + (CX + 34) + " " + (RIM - alturaDomo) + " " + (CX + AR - 2) + " " + (RIM - alturaDomo * .7) + " " + (CX + AR + 4) + " " + (RIM + 3) + " Q" + CX + " " + (RIM + 12) + " " + (CX - AR - 4) + " " + (RIM + 3) + " Z')";
        var domoFlat = "path('M" + (CX - AR - 4) + " " + (RIM + 3) + " C" + (CX - AR + 2) + " " + (RIM + 3) + " " + (CX - 34) + " " + (RIM + 3) + " " + CX + " " + (RIM + 3) +
          " C" + (CX + 34) + " " + (RIM + 3) + " " + (CX + AR - 2) + " " + (RIM + 3) + " " + (CX + AR + 4) + " " + (RIM + 3) + " Q" + CX + " " + (RIM + 12) + " " + (CX - AR - 4) + " " + (RIM + 3) + " Z')";
        if (!dn) { dn = el("g", { "data-k": dk }, gDomo); dn.base = el("path", { class: "capa domo" }, dn); dn.motas = el("path", { class: "capa", fill: "url(#" + p + "motas)" }, dn);
          dn.base.style.d = domoFlat; dn.motas.style.d = domoFlat; vivos[dk] = dn;
          getComputedStyle(dn.base).d; getComputedStyle(dn.motas).d;
          dn.base.style.d = domoD; dn.motas.style.d = domoD;
        } else { dn.base.style.d = domoD; dn.motas.style.d = domoD; }
        dn.base.setAttribute("fill", d.color);
        dn.motas.style.setProperty("--motas", d.motas || "transparent");
      }
      var cima = RIM - alturaDomo; // y más alta del domo

      /* ---- helados (bolas sobre el domo) ---- */
      var hel = r.helados || [];
      quitarFaltantes(gHelado, hel.map(function (h) { return h.key; }));
      var colH = { Chocochip: ["#FFF3DC", "#4A2412"], Tricolor: ["#FFB3CF", "#7A3B1F"], Sublime: ["#C79063", "#5A2E14"] };
      hel.forEach(function (h, i) {
        var hn = vivos[h.key];
        var x = CX + (i - (hel.length - 1) / 2) * 34, yy = cima + 6 - (i % 2) * 6;
        if (!hn) {
          var cc = colH[h.sabor] || colH.Chocochip;
          hn = el("g", { "data-k": h.key, class: "pieza helado" }, gHelado);
          el("circle", { cx: 0, cy: 0, r: 20, fill: cc[0] }, hn);
          el("path", { d: "M-20 4q5 6 10 1 5 6 10 0 5 6 10 0 5 5 10-1", fill: "none", stroke: cc[0], "stroke-width": 6, "stroke-linecap": "round" }, hn);
          [[-8, -6], [6, -9], [9, 4], [-3, 6]].forEach(function (q) { el("rect", { x: q[0], y: q[1], width: 3.4, height: 2.2, rx: 1, fill: cc[1] }, hn); });
          vivos[h.key] = hn;
        }
        hn.setAttribute("transform", "translate(" + x + " " + yy + ")");
      });
      if (hel.length) cima -= 18;

      /* ---- toppings sobre el domo ---- */
      var tps = r.toppings || [];
      quitarFaltantes(gTop, tps.map(function (t) { return t.key; }));
      tps.forEach(function (t, i) {
        var tn = vivos[t.key];
        if (!tn) {
          tn = el("g", { "data-k": t.key, class: "pieza" }, gTop);
          var semilla = (t.semilla || i) * 9301;
          for (var q = 0; q < 7; q++) {
            var rx = ((semilla * (q + 3) * 7) % 120) - 60, ry = ((semilla * (q + 5) * 3) % 26) - 4;
            var ang = (semilla * (q + 1)) % 180;
            var fx = Math.max(-58, Math.min(58, rx));
            var yy2 = (RIM - (alturaDomo || 8)) + Math.abs(fx) / 58 * (alturaDomo * .55) + ry * .5 + (hel.length ? -4 : 0);
            var tr = "translate(" + (CX + fx) + " " + yy2 + ") rotate(" + ang + ")";
            var f = t.forma, a = { transform: tr, fill: t.color, stroke: "rgba(60,20,20,.25)", "stroke-width": .8 };
            if (f === "bola") { a.r = 3.6; el("circle", a, tn); }
            else if (f === "gomita") { a.d = "M-4-3h8l-1 6h-6Z"; a.rx = 2; el("path", a, tn); }
            else if (f === "galleta") { a.r = 4.6; el("circle", a, tn); }
            else if (f === "almendra") { a.rx = 5; a.ry = 2.8; el("ellipse", a, tn); }
            else if (f === "cubo") { a.x = -3.5; a.y = -3.5; a.width = 7; a.height = 7; a.rx = 1.4; el("rect", a, tn); }
            else if (f === "barra") { a.x = -5; a.y = -1.8; a.width = 10; a.height = 3.6; a.rx = 1.4; el("rect", a, tn); }
            else { a.x = -3.6; a.y = -1.1; a.width = 7.2; a.height = 2.2; a.rx = 1.1; el("rect", a, tn); }
          }
          vivos[t.key] = tn;
        }
      });

      /* ---- jarabe en hilos ---- */
      var jar = r.jarabes || [];
      quitarFaltantes(gJar, jar.map(function (j) { return j.key; }));
      jar.forEach(function (j, i) {
        var jn = vivos[j.key];
        var yb = RIM - (alturaDomo || 6) + 12 + i * 8 - (hel.length ? 10 : 0);
        var hilo = "M" + (CX - 62) + " " + (yb + 26) + " C" + (CX - 50) + " " + (yb - 2) + " " + (CX - 36) + " " + (yb + 26) + " " + (CX - 18) + " " + (yb + 6) +
          " S" + (CX + 6) + " " + (yb + 24) + " " + (CX + 20) + " " + (yb + 4) + " S" + (CX + 46) + " " + (yb + 22) + " " + (CX + 64) + " " + (yb + 20);
        // gotas que caen por el borde del domo (forma de lágrima)
        function gota(x, largo) { return "M" + (x - 4) + " " + (RIM - 2) + " C" + (x - 4) + " " + (RIM + largo * .5) + " " + (x - 5) + " " + (RIM + largo) + " " + x + " " + (RIM + largo + 4) +
          " C" + (x + 5) + " " + (RIM + largo) + " " + (x + 4) + " " + (RIM + largo * .5) + " " + (x + 4) + " " + (RIM - 2) + " Z"; }
        var gx = [[CX - 44 + i * 9, 16 + i * 4], [CX + 30 - i * 7, 10 + i * 5]];
        if (!jn) {
          jn = el("g", { "data-k": j.key, class: "jarabe-g" }, gJar);
          jn.hilo = el("path", { class: "jarabe", pathLength: 1 }, jn);
          jn.gotas = el("path", { class: "jarabe-gota" }, jn);
          vivos[j.key] = jn;
        }
        jn.hilo.setAttribute("d", hilo);
        jn.hilo.setAttribute("stroke", j.color);
        jn.gotas.setAttribute("d", gota(gx[0][0], gx[0][1]) + " " + gota(gx[1][0], gx[1][1]));
        jn.gotas.setAttribute("fill", j.color);
      });
    }
    return { pintar: pintar, svg: svg };
  }

  window.Vaso = { crear: crear };
})();

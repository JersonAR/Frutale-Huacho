/* Frutale · armado de la página: vaso del inicio, armador "capa por capa", carta, personaliza, historia y sedes. */
(function () {
  "use strict";
  var F = window.FRUTALE, V = F.vaso;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var soles = function (n) { return "S/" + (Number.isInteger(n) ? n : n.toFixed(2)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var P = function () { return window.FrutalePedido; };
  function h(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function porNombre(lista, n) { return lista.filter(function (x) { return x.nombre === n; })[0]; }
  function slug(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-"); }

  /* ======================= INICIO ======================= */
  function inicio() {
    $$("[data-horario]").forEach(function (e) { e.textContent = F.horario.texto; });
    $$("[data-dias]").forEach(function (e) { e.textContent = "· " + F.horario.dias; });
    var host = $("[data-vaso-hero]"); if (!host) return;
    var v = Vaso.crear(host);
    var vain = V.cremas[0], fudge = V.jarabes[0];
    var pasos = [
      { oz: 12, capas: [{ key: "f1", tipo: "fresa", peso: 1.2 }] },
      { oz: 12, capas: [{ key: "f1", tipo: "fresa", peso: 1.2 }, { key: "c1", tipo: "crema", color: vain.color, peso: .7 }] },
      { oz: 12, capas: [{ key: "f1", tipo: "fresa", peso: 1.2 }, { key: "c1", tipo: "crema", color: vain.color, peso: .7 }, { key: "f2", tipo: "fresa", peso: 1 }], domo: { color: vain.color } },
      null, null
    ];
    pasos[3] = Object.assign({}, pasos[2], { toppings: [
      { key: "t1", color: "#5B2E14", forma: "chispa", semilla: 3 }, { key: "t2", color: "#8A4F26", forma: "almendra", semilla: 7 }, { key: "t3", color: "#FF4D6D", forma: "gomita", semilla: 11 }] });
    pasos[4] = Object.assign({}, pasos[3], { jarabes: [{ key: "j1", color: fudge.color }] });
    var items = $$(".inicio-receta li");
    var orden = [0, 1, 2, 3, 4];
    if (reduce) { v.pintar(pasos[4]); items.forEach(function (li) { li.classList.add("ok"); }); return; }
    v.pintar({ oz: 12, capas: [] });
    orden.forEach(function (i) {
      setTimeout(function () { v.pintar(pasos[i]); if (items[i]) items[i].classList.add("ok"); }, 700 + i * 650);
    });
  }

  /* ======================= ARMA TU VASO ======================= */
  var A = { tam: "especial", crema: "Vainilla", galleta: "Oreo", toppings: [], jarabes: [], extras: {} };
  var vArmado;

  function tam() { return V.tamanos.filter(function (t) { return t.id === A.tam; })[0]; }

  function costoToppings() {
    var t = tam(), libres = t.toppings, extra = 0, gratis = [];
    var sel = A.toppings.map(function (n) { return porNombre(V.toppings, n); });
    var sinSolo = sel.filter(function (x) { return !x.soloExtra; });
    // los libres se usan primero en los de mayor precio (lo más conveniente para el cliente)
    sinSolo.sort(function (a, b) { return (b.premium ? 2 : 1) - (a.premium ? 2 : 1); });
    sinSolo.forEach(function (x, i) { if (i < libres) gratis.push(x.nombre); else extra += x.premium ? V.precioToppingPremium : V.precioTopping; });
    sel.filter(function (x) { return x.soloExtra; }).forEach(function () { extra += V.precioToppingPremium; });
    return { extra: extra, gratis: gratis };
  }
  function precioArmado() {
    var t = tam(), p = t.precio + costoToppings().extra;
    V.extras.forEach(function (e) { p += (A.extras[e.id] || 0) * e.precio; });
    return Math.round(p * 100) / 100;
  }
  function faltan() {
    var t = tam(), f = [];
    var incl = A.toppings.filter(function (n) { return !porNombre(V.toppings, n).soloExtra; }).length;
    if (incl < t.toppings) f.push((t.toppings - incl) + (t.toppings - incl > 1 ? " toppings" : " topping"));
    if (A.jarabes.length < t.jarabes) f.push((t.jarabes - A.jarabes.length) + (t.jarabes - A.jarabes.length > 1 ? " jarabes" : " jarabe"));
    return f;
  }

  function recetaArmado() {
    var t = tam(), cr = porNombre(V.cremas, t.cremaElegir ? A.crema : "Vainilla");
    var capas = [];
    if (t.nutella || A.extras["nutella-extra"]) capas.push({ key: "nutella", tipo: "nutella", color: "#5A2D17", peso: .45 });
    capas.push({ key: "fresa1", tipo: "fresa", peso: 1.1 });
    if (t.galleta) capas.push({ key: "galleta", tipo: "galleta", color: A.galleta === "Oreo" ? "#2E2420" : "#E2B979", peso: .5 });
    capas.push({ key: "crema1", tipo: "crema", color: cr.color, motas: cr.motas, peso: .6 });
    V.extras.filter(function (e) { return e.grupo === "fruta"; }).forEach(function (e) {
      for (var i = 0; i < (A.extras[e.id] || 0); i++) capas.push({ key: e.id + i, tipo: "fruta", color: e.color, peso: .45 });
    });
    capas.push({ key: "fresa2", tipo: "fresa", peso: .9 });
    if (A.extras["crema-extra"]) capas.push({ key: "crema-extra", tipo: "crema", color: cr.color, motas: cr.motas, peso: .4 });
    var helados = [];
    V.extras.filter(function (e) { return e.grupo === "helado"; }).forEach(function (e) {
      for (var i = 0; i < (A.extras[e.id] || 0); i++) helados.push({ key: e.id + i, sabor: e.nombre.split("· ")[1] });
    });
    var jar = A.jarabes.map(function (n) { return { key: "j-" + slug(n), color: porNombre(V.jarabes, n).color }; });
    if (t.nutella) jar.push({ key: "j-nutella", color: "#5A2D17" });
    if (A.extras["nutella-extra"]) jar.push({ key: "j-nutella2", color: "#5A2D17" });
    return {
      oz: t.oz, capas: capas,
      domo: { color: cr.color, motas: cr.motas, grande: (A.extras["crema-extra"] || 0) > 0 },
      helados: helados.slice(0, 3),
      toppings: A.toppings.map(function (n, i) { var x = porNombre(V.toppings, n); return { key: "t-" + slug(n), color: x.color, forma: x.forma, semilla: V.toppings.indexOf(x) + 2 }; }),
      jarabes: jar
    };
  }

  function chip(texto, sub, activo, onClick, extraCls) {
    var b = h("button", "chip" + (extraCls ? " " + extraCls : ""));
    b.type = "button";
    b.setAttribute("aria-pressed", activo ? "true" : "false");
    b.appendChild(h("span", "chip-txt", texto));
    if (sub) b.appendChild(h("small", "chip-sub", sub));
    b.addEventListener("click", function () { onClick(b); });
    return b;
  }

  function pintarArmador(cambio) {
    var t = tam();
    // tamaños
    var ct = $("[data-tamanos]"); ct.innerHTML = "";
    V.tamanos.forEach(function (x) {
      var b = h("button", "tamano");
      b.type = "button"; b.setAttribute("aria-pressed", x.id === A.tam ? "true" : "false");
      b.style.setProperty("--oz", x.oz);
      b.innerHTML = '<span class="tamano-vaso" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-vaso"/></svg></span><b></b><span class="tamano-oz"></span><span class="tamano-precio"></span><small></small>';
      $("b", b).textContent = x.nombre; $(".tamano-oz", b).textContent = x.oz + " oz";
      $(".tamano-precio", b).textContent = soles(x.precio); $("small", b).textContent = x.receta;
      b.addEventListener("click", function () {
        A.tam = x.id;
        // recortar jarabes si el nuevo vaso lleva menos
        A.jarabes = A.jarabes.slice(0, x.jarabes);
        pintarArmador(true);
      });
      ct.appendChild(b);
    });
    // crema
    var cc = $("[data-cremas]"); cc.innerHTML = "";
    $("[data-crema-ayuda]").textContent = t.cremaElegir ? "En este vaso la crema es a elección." : "Este vaso lleva nuestra crema de la casa.";
    if (t.cremaElegir) {
      V.cremas.forEach(function (c) {
        var b = chip(c.nombre, "", A.crema === c.nombre, function () { A.crema = c.nombre; pintarArmador(true); }, "chip-color");
        b.style.setProperty("--c", c.color); cc.appendChild(b);
      });
    } else {
      cc.appendChild(h("span", "chip chip-fijo", "Crema de la casa ✓"));
    }
    // galleta
    var pg = $("[data-paso=galleta]"); pg.hidden = !t.galleta;
    var cg = $("[data-galletas]"); cg.innerHTML = "";
    V.galletas.forEach(function (gname) { cg.appendChild(chip("Galleta " + gname.toLowerCase(), "", A.galleta === gname, function () { A.galleta = gname; pintarArmador(true); })); });
    // toppings
    var ctop = $("[data-toppings]"); ctop.innerHTML = "";
    var ct2 = costoToppings();
    var nIncl = A.toppings.filter(function (n) { return !porNombre(V.toppings, n).soloExtra; }).length;
    $("[data-top-cuenta]").textContent = Math.min(nIncl, t.toppings) + "/" + t.toppings;
    $("[data-top-ayuda]").textContent = "Incluye " + t.toppings + (t.toppings > 1 ? " toppings" : " topping") + ". Cada extra: +" + soles(V.precioTopping) + " (almendra, pecana y brownie bites: +" + soles(V.precioToppingPremium) + ").";
    V.toppings.forEach(function (x) {
      var activo = A.toppings.indexOf(x.nombre) >= 0;
      var sub = "";
      if (activo && ct2.gratis.indexOf(x.nombre) < 0) sub = "+" + soles(x.premium ? V.precioToppingPremium : V.precioTopping);
      else if (!activo && x.soloExtra) sub = "+" + soles(V.precioToppingPremium);
      var b = chip(x.nombre, sub, activo, function () {
        if (activo) A.toppings = A.toppings.filter(function (n) { return n !== x.nombre; });
        else A.toppings.push(x.nombre);
        pintarArmador(true);
      }, "chip-top");
      b.style.setProperty("--c", x.color);
      ctop.appendChild(b);
    });
    // jarabes
    var cj = $("[data-jarabes]"); cj.innerHTML = "";
    var pj = $("[data-paso=jarabe]");
    $("[data-jar-cuenta]").textContent = t.jarabes ? A.jarabes.length + "/" + t.jarabes : "";
    if (!t.jarabes) {
      $("[data-jar-ayuda]").textContent = "Este vaso va bañado en Nutella.";
      cj.appendChild(h("span", "chip chip-fijo", "Nutella ✓"));
    } else {
      $("[data-jar-ayuda]").textContent = "Elige " + t.jarabes + (t.jarabes > 1 ? " jarabes." : " jarabe.");
      V.jarabes.forEach(function (j) {
        var activo = A.jarabes.indexOf(j.nombre) >= 0;
        var lleno = !activo && A.jarabes.length >= t.jarabes;
        var b = chip(j.nombre, "", activo, function () {
          if (activo) A.jarabes = A.jarabes.filter(function (n) { return n !== j.nombre; });
          else if (t.jarabes === 1) A.jarabes = [j.nombre];
          else if (!lleno) A.jarabes.push(j.nombre);
          pintarArmador(true);
        }, "chip-color" + (lleno ? " chip-lleno" : ""));
        b.style.setProperty("--c", j.color);
        if (lleno) b.title = "Ya elegiste " + t.jarabes + " jarabes: quita uno para cambiarlo";
        cj.appendChild(b);
      });
    }
    pj.classList.toggle("paso-fijo", !t.jarabes);
    // extras
    var ce = $("[data-extras]"); ce.innerHTML = "";
    V.extras.forEach(function (e) {
      var q = A.extras[e.id] || 0;
      var li = h("li", "extra" + (q ? " extra-on" : ""));
      li.innerHTML = '<span class="extra-nombre"></span><span class="extra-precio"></span><span class="stepper"><button type="button" data-d="-1">−</button><output></output><button type="button" data-d="1">+</button></span>';
      $(".extra-nombre", li).textContent = e.nombre;
      $(".extra-precio", li).textContent = "+" + soles(e.precio);
      $("output", li).textContent = q;
      $$("button", li).forEach(function (b) {
        var d = Number(b.dataset.d);
        b.setAttribute("aria-label", (d > 0 ? "Sumar " : "Quitar ") + e.nombre);
        b.disabled = (d < 0 && q === 0) || (d > 0 && q >= 3);
        b.addEventListener("click", function () { A.extras[e.id] = Math.max(0, Math.min(3, q + d)); pintarArmador(true); });
      });
      ce.appendChild(li);
    });
    // resumen
    $("[data-arma-nombre]").textContent = "Vaso " + t.nombre + " · " + t.oz + " oz";
    var pr = $("[data-arma-precio]");
    pr.textContent = soles(precioArmado());
    if (cambio && !reduce) { pr.classList.remove("rebote"); void pr.offsetWidth; pr.classList.add("rebote"); }
    var f = faltan();
    $("[data-arma-falta]").textContent = f.length ? "Te falta elegir: " + f.join(" y ") : "¡Tu vaso está listo! 🍓";
    $("[data-arma-falta]").classList.toggle("ok", !f.length);
    var btn = $("[data-arma-agregar]");
    btn.setAttribute("aria-disabled", f.length ? "true" : "false");
    if (vArmado) vArmado.pintar(recetaArmado());
  }

  function detalleArmado() {
    var t = tam(), d = [];
    d.push("Crema: " + (t.cremaElegir ? A.crema : "de la casa"));
    if (t.galleta) d.push("Galleta: " + A.galleta);
    if (A.toppings.length) {
      var gratis = costoToppings().gratis;
      d.push("Toppings: " + A.toppings.map(function (n) {
        var x = porNombre(V.toppings, n);
        return gratis.indexOf(n) >= 0 ? n : n + " (extra +" + soles(x.premium ? V.precioToppingPremium : V.precioTopping) + ")";
      }).join(", "));
    }
    d.push(t.jarabes ? "Jarabe: " + A.jarabes.join(", ") : "Con Nutella");
    var ex = V.extras.filter(function (e) { return A.extras[e.id]; }).map(function (e) { return (A.extras[e.id] > 1 ? A.extras[e.id] + "× " : "") + e.nombre; });
    if (ex.length) d.push("Extras: " + ex.join(", "));
    return d;
  }

  function armador() {
    var host = $("[data-vaso-armado]"); if (!host) return;
    vArmado = Vaso.crear(host);
    pintarArmador(false);
    $("[data-arma-agregar]").addEventListener("click", function (ev) {
      var f = faltan();
      if (f.length) {
        P().aviso("Te falta elegir: " + f.join(" y "));
        var paso = f[0].indexOf("topping") >= 0 ? "toppings" : "jarabe";
        var fs = $("[data-paso=" + paso + "]");
        fs.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        fs.classList.remove("sacude"); void fs.offsetWidth; fs.classList.add("sacude");
        return;
      }
      var t = tam();
      P().agregar({ id: "vaso-" + t.id, nombre: "Vaso " + t.nombre + " (" + t.oz + " oz)", detalle: detalleArmado(), precio: precioArmado() }, ev.currentTarget);
      // nuevo vaso: se conserva el tamaño, se limpian las elecciones
      A.toppings = []; A.jarabes = []; A.extras = {};
      setTimeout(function () { pintarArmador(false); }, 450);
    });
  }

  /* ======================= CARTA ======================= */
  var itemsPorId = {};
  function carta() {
    var tabs = $("[data-carta-tabs]"), cuerpo = $("[data-carta-cuerpo]"), saltos = $("[data-carta-saltos]");
    F.carta.forEach(function (parte, pi) {
      var tb = h("button", "carta-tab", parte.nombre);
      tb.type = "button"; tb.setAttribute("role", "tab"); tb.id = "tab-" + parte.id;
      tb.setAttribute("aria-controls", "panel-" + parte.id);
      tb.setAttribute("aria-selected", pi === 0 ? "true" : "false");
      tb.tabIndex = pi === 0 ? 0 : -1;
      tabs.appendChild(tb);
      var panel = h("div", "carta-panel");
      panel.id = "panel-" + parte.id; panel.setAttribute("role", "tabpanel"); panel.setAttribute("aria-labelledby", tb.id);
      panel.hidden = pi !== 0;
      parte.categorias.forEach(function (cat) {
        var sec = h("section", "carta-cat"); sec.id = "cat-" + cat.id;
        var cab = h("div", "carta-cat-cabeza");
        cab.appendChild(h("h3", "cintillo", cat.nombre));
        if (cat.nota) cab.appendChild(h("p", "carta-cat-nota", cat.nota));
        sec.appendChild(cab);
        var ul = h("ul", "carta-items");
        cat.items.forEach(function (it, ii) {
          var id = cat.id + "-" + ii; itemsPorId[id] = it;
          var li = h("li", "item" + (it.favorito ? " item-fav" : ""));
          var info = h("div", "item-info");
          var nom = h("p", "item-nombre", it.nombre);
          if (it.favorito) { var fv = h("span", "item-badge", "Favorito"); nom.appendChild(fv); }
          info.appendChild(nom);
          if (it.desc) info.appendChild(h("p", "item-desc", it.desc));
          if (it.elige) info.appendChild(h("p", "item-elige", "Eliges: " + it.elige.map(function (g) { return g.n + " " + g.titulo.toLowerCase(); }).join(" · ")));
          li.appendChild(info);
          li.appendChild(h("span", "item-precio", soles(it.precio)));
          var b = h("button", "item-mas");
          b.type = "button";
          b.setAttribute("aria-label", "Agregar " + it.nombre + ", " + soles(it.precio));
          b.innerHTML = '<span aria-hidden="true">+</span>';
          b.addEventListener("click", function () {
            if (it.elige) personaliza(id, b);
            else P().agregar({ id: id, nombre: it.nombre, precio: it.precio }, b);
          });
          li.appendChild(b);
          ul.appendChild(li);
        });
        sec.appendChild(ul);
        panel.appendChild(sec);
      });
      cuerpo.appendChild(panel);
    });

    function pintarSaltos(parte) {
      saltos.innerHTML = "";
      parte.categorias.forEach(function (cat) {
        var a = h("a", "salto", cat.nombre); a.href = "#cat-" + cat.id;
        saltos.appendChild(a);
      });
    }
    function activar(i, foco) {
      $$(".carta-tab", tabs).forEach(function (t, j) { t.setAttribute("aria-selected", i === j ? "true" : "false"); t.tabIndex = i === j ? 0 : -1; if (i === j && foco) t.focus(); });
      $$(".carta-panel", cuerpo).forEach(function (p, j) { p.hidden = i !== j; if (i === j && !reduce) { p.classList.remove("entra"); void p.offsetWidth; p.classList.add("entra"); } });
      pintarSaltos(F.carta[i]);
    }
    $$(".carta-tab", tabs).forEach(function (t, i) {
      t.addEventListener("click", function () { activar(i, false); });
      t.addEventListener("keydown", function (e) {
        var n = F.carta.length;
        if (e.key === "ArrowRight") { e.preventDefault(); activar((i + 1) % n, true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); activar((i - 1 + n) % n, true); }
      });
    });
    pintarSaltos(F.carta[0]);
  }

  /* ======================= PERSONALIZA ======================= */
  var pers = { id: null, sel: {}, origen: null };
  function personaliza(id, origen) {
    var it = itemsPorId[id], dlg = $("#personaliza");
    pers = { id: id, sel: {}, origen: origen };
    $("[data-pers-nombre]").textContent = it.nombre;
    $("[data-pers-desc]").textContent = it.desc || "";
    $("[data-pers-precio]").textContent = soles(it.precio);
    var cont = $("[data-pers-grupos]"); cont.innerHTML = "";
    it.elige.forEach(function (g) {
      pers.sel[g.id] = [];
      var fs = h("fieldset", "pers-grupo");
      var lg = h("legend", "", g.titulo + " ");
      var cuenta = h("span", "paso-cuenta", "0/" + g.n); lg.appendChild(cuenta);
      fs.appendChild(lg);
      fs.appendChild(h("p", "paso-ayuda", g.repetir ? "Elige " + g.n + " (puedes repetir sabor)." : "Elige " + g.n + "."));
      var wrap = h("div", "chips");
      function repintar() {
        var s = pers.sel[g.id];
        cuenta.textContent = s.length + "/" + g.n;
        $$(".chip", wrap).forEach(function (b) {
          var o = b.dataset.op, cnt = s.filter(function (x) { return x === o; }).length;
          b.setAttribute("aria-pressed", cnt ? "true" : "false");
          var sub = $(".chip-sub", b);
          if (!sub) { sub = h("small", "chip-sub"); b.appendChild(sub); }
          sub.textContent = g.repetir && cnt ? "× " + cnt : "";
          b.classList.toggle("chip-lleno", !cnt && s.length >= g.n && g.n > 1);
        });
        validar();
      }
      g.opciones.forEach(function (o) {
        var b = chip(o, "", false, function () {
          var s = pers.sel[g.id], cnt = s.filter(function (x) { return x === o; }).length;
          if (g.repetir) {
            if (s.length < g.n) s.push(o);
            else if (cnt) s.splice(s.indexOf(o), 1);
            else { s.shift(); s.push(o); }
          } else if (cnt) s.splice(s.indexOf(o), 1);
          else if (g.n === 1) { s.length = 0; s.push(o); }
          else if (s.length < g.n) s.push(o);
          repintar();
        });
        b.dataset.op = o;
        wrap.appendChild(b);
      });
      fs.appendChild(wrap);
      cont.appendChild(fs);
    });
    validar();
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    document.documentElement.classList.add("hoja-abierta");
    cont.scrollTop = 0;
  }
  function faltanPers() {
    var it = itemsPorId[pers.id]; if (!it) return [];
    return it.elige.filter(function (g) { return pers.sel[g.id].length < g.n; }).map(function (g) { return (g.n - pers.sel[g.id].length) + " " + g.titulo.toLowerCase(); });
  }
  function validar() {
    var f = faltanPers();
    $("[data-pers-falta]").textContent = f.length ? "Falta: " + f.join(", ") : "";
    $("[data-pers-ok]").setAttribute("aria-disabled", f.length ? "true" : "false");
  }
  function cerrarPers() {
    var dlg = $("#personaliza");
    if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
    document.documentElement.classList.remove("hoja-abierta");
  }
  function iniciarPers() {
    var dlg = $("#personaliza");
    $("[data-pers-cerrar]").addEventListener("click", cerrarPers);
    dlg.addEventListener("click", function (e) { if (e.target === dlg) cerrarPers(); });
    dlg.addEventListener("close", function () { document.documentElement.classList.remove("hoja-abierta"); });
    $("[data-pers-form]").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = faltanPers();
      if (f.length) {
        $$(".pers-grupo", dlg).some(function (fs, i) {
          var g = itemsPorId[pers.id].elige[i];
          if (pers.sel[g.id].length < g.n) { fs.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); fs.classList.remove("sacude"); void fs.offsetWidth; fs.classList.add("sacude"); return true; }
          return false;
        });
        return;
      }
      var it = itemsPorId[pers.id];
      var det = it.elige.map(function (g) {
        var s = pers.sel[g.id], cuenta = {};
        s.forEach(function (x) { cuenta[x] = (cuenta[x] || 0) + 1; });
        return g.titulo + ": " + Object.keys(cuenta).map(function (k) { return cuenta[k] > 1 ? cuenta[k] + "× " + k : k; }).join(", ");
      });
      var origen = pers.origen;
      cerrarPers();
      P().agregar({ id: pers.id, nombre: it.nombre, detalle: det, precio: it.precio }, origen);
    });
  }

  /* ======================= HISTORIA Y SEDES ======================= */
  function historia() {
    var ol = $("[data-historia]"); if (!ol) return;
    var cols = ["#D41F38", "#FFF7EA", "#FFCB52", "#9BC32E", "#FF8FC8"];
    F.historia.slice().reverse().forEach(function (hh, i, arr) {
      var li = h("li", "capa-hist");
      li.style.setProperty("--c", cols[(arr.length - 1 - i) % cols.length]);
      li.style.setProperty("--i", arr.length - 1 - i);
      li.appendChild(h("span", "capa-fecha", hh.fecha));
      li.appendChild(h("strong", "", hh.titulo));
      li.appendChild(h("span", "capa-txt", hh.texto));
      ol.appendChild(li);
    });
  }
  function sedes() {
    var c = $("[data-sedes]"); if (!c) return;
    F.sedes.forEach(function (s) {
      var art = h("article", "sede");
      art.appendChild(h("span", "sede-etiqueta", s.etiqueta));
      art.appendChild(h("h3", "", s.nombre));
      art.appendChild(h("p", "sede-dir", s.direccion));
      if (s.referencia) art.appendChild(h("p", "sede-ref", s.referencia));
      art.appendChild(h("p", "sede-ciudad", s.ciudad));
      var a = h("a", "btn btn-linea-oscura", "");
      a.href = s.maps; a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = '<svg class="ico"><use href="#i-pin"/></svg> Cómo llegar';
      a.setAttribute("aria-label", "Cómo llegar a " + s.nombre + " (Google Maps)");
      art.appendChild(a);
      c.appendChild(art);
    });
  }

  /* ======================= BARRA Y APARICIONES ======================= */
  function barra() {
    var b = $("[data-barra]"), ini = $("#inicio");
    var links0 = $$(".barra-nav a");
    function sync() {
      var y = window.scrollY;
      // al llegar al fondo, la última sección (Sedes) queda marcada
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4)
        links0.forEach(function (a) { a.classList.toggle("activo", a.getAttribute("href") === "#sedes"); });
      b.classList.toggle("barra-solida", y > 40);
      document.documentElement.classList.toggle("paso-inicio", ini && y > ini.offsetHeight * .6);
    }
    window.addEventListener("scroll", sync, { passive: true }); sync();
    // sección activa en el menú
    if ("IntersectionObserver" in window) {
      var links = $$(".barra-nav a");
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("activo", a.getAttribute("href") === "#" + e.target.id); });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      ["arma", "carta", "historia", "sedes"].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
      if (!reduce) {
        var io2 = new IntersectionObserver(function (ents) {
          ents.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visto"); io2.unobserve(e.target); } });
        }, { rootMargin: "0px 0px -12% 0px" });
        $$(".sec-cabeza, .capa-hist, .sede, .historia-texto").forEach(function (n) { n.classList.add("aparece"); io2.observe(n); });
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    inicio(); armador(); carta(); iniciarPers(); historia(); sedes(); barra();
  });
})();

/* Frutale · pedido: líneas, panel, formulario y mensaje de WhatsApp.
   Cada línea guarda su precio exacto según la carta (js/carta-data.js). */
(function () {
  "use strict";
  var F = window.FRUTALE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var soles = function (n) { return "S/" + (Number.isInteger(n) ? n : n.toFixed(2)); };
  var STORE = "frutale-pedido-v1";
  var estado = { lineas: [] };

  try {
    var g = JSON.parse(localStorage.getItem(STORE) || "null");
    if (g && Array.isArray(g.lineas)) estado.lineas = g.lineas.filter(function (l) { return l && l.key && l.qty > 0 && typeof l.precio === "number"; });
  } catch (e) { /* sin almacenamiento: se empieza vacío */ }
  function guardar() { try { localStorage.setItem(STORE, JSON.stringify(estado)); } catch (e) { /* ignorar */ } }

  function total() { return estado.lineas.reduce(function (s, l) { return s + l.precio * l.qty; }, 0); }
  function unidades() { return estado.lineas.reduce(function (s, l) { return s + l.qty; }, 0); }

  /* item: { id, nombre, detalle:[líneas], precio } */
  function agregar(item, origen) {
    var det = item.detalle || [];
    var key = [item.id].concat(det).join("|");
    var l = estado.lineas.find(function (x) { return x.key === key; });
    if (l) l.qty += 1;
    else estado.lineas.push({ key: key, id: item.id, nombre: item.nombre, detalle: det, precio: item.precio, qty: 1 });
    guardar(); pintar(true); volar(origen); avisoAgregado(item);
  }
  function cambiarQty(key, d) {
    var l = estado.lineas.find(function (x) { return x.key === key; });
    if (!l) return;
    l.qty += d;
    if (l.qty <= 0) estado.lineas = estado.lineas.filter(function (x) { return x.key !== key; });
    guardar(); pintar(false);
  }

  function pintar(rebote) {
    var n = unidades();
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
      if (rebote) { el.classList.remove("rebote"); void el.offsetWidth; el.classList.add("rebote"); }
    });
    $$("[data-cart-total]").forEach(function (el) { el.textContent = soles(total()); });
    document.documentElement.classList.toggle("tiene-pedido", n > 0);

    var lista = $("#pedido-lineas");
    if (!lista) return;
    lista.innerHTML = "";
    if (!n) lista.innerHTML = '<li class="pedido-vacio">Tu pedido está vacío. Arma un vaso o elige algo de la carta 🍓</li>';
    estado.lineas.forEach(function (l) {
      var li = document.createElement("li");
      li.className = "linea";
      li.innerHTML = '<div class="linea-info"><strong></strong><span class="linea-det"></span><span class="linea-pu"></span></div>' +
        '<div class="linea-qty"><button type="button" class="qty-btn" data-d="-1">−</button><output aria-live="polite"></output>' +
        '<button type="button" class="qty-btn" data-d="1">+</button></div><b class="linea-sub"></b>';
      $("strong", li).textContent = l.nombre;
      $(".linea-det", li).textContent = (l.detalle || []).join(" · ");
      $(".linea-pu", li).textContent = soles(l.precio) + " c/u";
      $("output", li).textContent = l.qty;
      $(".linea-sub", li).textContent = soles(l.precio * l.qty);
      $$(".qty-btn", li).forEach(function (b) {
        b.setAttribute("aria-label", (b.dataset.d === "1" ? "Agregar uno de " : "Quitar uno de ") + l.nombre);
        b.addEventListener("click", function () { cambiarQty(l.key, Number(b.dataset.d)); });
      });
      lista.appendChild(li);
    });
    var c = $("#pedido-continuar"); if (c) c.disabled = n === 0;
  }

  /* ---------- Mensaje ---------- */
  function construirMensaje(d) {
    var t = ["¡Hola " + F.negocio + "! 🍓 Quiero hacer este pedido:", ""];
    estado.lineas.forEach(function (l) {
      t.push("• " + l.qty + " × " + l.nombre + " — " + soles(l.precio * l.qty));
      (l.detalle || []).forEach(function (x) { t.push("   " + x); });
    });
    t.push("", "Total referencial: " + soles(total()));
    if (d.modalidad === "Delivery") t.push("(+ costo de delivery según la zona, por confirmar)");
    t.push("", "Nombre: " + d.nombre, "Modalidad: " + d.modalidad);
    if (d.direccion) t.push("Dirección / referencia: " + d.direccion);
    if (d.hora) t.push("Hora: " + d.hora);
    if (d.notas) t.push("Notas: " + d.notas);
    t.push("", "(Pedido armado desde la web; quedo atento/a a su confirmación).");
    return t.join("\n");
  }
  function waUrl(msg) { return "https://wa.me/" + F.whatsapp + "?text=" + encodeURIComponent(msg); }

  var dlg;
  function abrir() {
    if (!dlg) return;
    dlg.dataset.paso = "1"; dlg.classList.remove("es-demo");
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    document.documentElement.classList.add("hoja-abierta");
  }
  function cerrar() {
    if (!dlg) return;
    if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
    document.documentElement.classList.remove("hoja-abierta");
  }

  function iniciarFormulario() {
    var form = $("#pedido-form"); if (!form) return;
    var cont = $("[data-modalidades]");
    var mods = F.sedes.map(function (s) { return "Recojo en " + s.nombre; }).concat(["Delivery"]);
    mods.forEach(function (m, i) {
      var lab = document.createElement("label");
      lab.className = "opcion";
      lab.innerHTML = '<input type="radio" name="modalidad"><span></span>';
      lab.querySelector("input").value = m;
      if (i === 0) lab.querySelector("input").checked = true;
      lab.querySelector("span").textContent = m;
      cont.appendChild(lab);
    });
    var campoDir = $("#campo-direccion");
    function syncDir() {
      var v = form.querySelector("input[name=modalidad]:checked");
      var del = !!v && v.value === "Delivery";
      campoDir.hidden = !del; form.elements.direccion.required = del;
    }
    $$("input[name=modalidad]", form).forEach(function (r) { r.addEventListener("change", syncDir); });
    syncDir();
    $$("input", form).forEach(function (i) { i.addEventListener("input", function () { i.removeAttribute("aria-invalid"); }); });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!estado.lineas.length) return;
      var malos = $$("input[required]", form).filter(function (i) { return !i.closest("[hidden]") && !i.value.trim(); });
      malos.forEach(function (i) { i.setAttribute("aria-invalid", "true"); });
      if (malos.length) { malos[0].focus(); aviso(malos[0].name === "direccion" ? "Escribe tu dirección para el delivery" : "Escribe tu nombre para el pedido"); return; }
      var v = form.querySelector("input[name=modalidad]:checked");
      $("#pedido-mensaje").value = construirMensaje({
        nombre: form.elements.nombre.value.trim(),
        modalidad: v ? v.value : "",
        direccion: campoDir.hidden ? "" : form.elements.direccion.value.trim(),
        hora: form.elements.hora.value.trim(),
        notas: form.elements.notas.value.trim()
      });
      dlg.dataset.paso = "2";
      $(".pedido-caja", dlg).scrollTop = 0;
      var ta = $("#pedido-mensaje"); ta.focus(); ta.setSelectionRange(0, 0); ta.scrollTop = 0;
    });
    $("#pedido-volver").addEventListener("click", function () { dlg.dataset.paso = "1"; });
    $("#pedido-whatsapp").addEventListener("click", function () {
      if (F.demo) { dlg.dataset.paso = "3"; dlg.classList.add("es-demo"); return; }
      var url = waUrl($("#pedido-mensaje").value);
      $("#pedido-wa-link").href = url;
      window.open(url, "_blank", "noopener");
      dlg.dataset.paso = "3";
    });
    $("#pedido-vaciar").addEventListener("click", function () {
      estado.lineas = []; guardar(); pintar(false); cerrar();
    });
  }

  /* ---------- Una "capa" vuela al botón del pedido ---------- */
  function volar(origen) {
    if (!origen || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    var destino = $$(".pedido-flotante, .barra-pedido").filter(function (b) { return b.offsetParent !== null && getComputedStyle(b).visibility !== "hidden"; })[0];
    if (!destino) return;
    var a = origen.getBoundingClientRect(), b = destino.getBoundingClientRect();
    var gota = document.createElement("span");
    gota.className = "gota-vuela";
    gota.style.left = (a.left + a.width / 2 - 14) + "px";
    gota.style.top = (a.top + a.height / 2 - 14) + "px";
    document.body.appendChild(gota);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    var an = gota.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: "translate(" + dx * .45 + "px," + (dy * .45 - 90) + "px) scale(1.25)", opacity: 1, offset: .45 },
      { transform: "translate(" + dx + "px," + dy + "px) scale(.35)", opacity: .2 }
    ], { duration: 720, easing: "cubic-bezier(.45,0,.2,1)" });
    an.onfinish = function () { gota.remove(); };
  }

  /* ---------- Aviso ---------- */
  var avisoT;
  function mostrarAviso(html) {
    var a = $("#aviso"); if (!a) return;
    a.innerHTML = html;
    a.classList.remove("visible"); void a.offsetWidth; a.classList.add("visible");
    clearTimeout(avisoT);
    avisoT = setTimeout(function () { a.classList.remove("visible"); }, 2600);
  }
  function avisoAgregado(item) {
    mostrarAviso('<span class="aviso-txt"><small>Agregado a tu pedido</small><strong></strong></span><b class="aviso-precio"></b><button type="button" class="aviso-ver" data-cart-open>Ver</button>');
    var a = $("#aviso");
    $("strong", a).textContent = item.nombre;
    $(".aviso-precio", a).textContent = soles(item.precio);
    $(".aviso-ver", a).addEventListener("click", abrir);
  }
  function aviso(txt) { mostrarAviso('<span class="aviso-txt"><strong></strong></span>'); $("#aviso strong").textContent = txt; }

  /* ---------- Enlaces ---------- */
  function enlaces() {
    var V = F.vendedor;
    var web = V.webUrl || (location.origin + location.pathname);
    // Mismo mensaje que en Frost y Yumbo
    var msgV = "Hola " + V.nombre + " 👋 Soy el dueño de " + F.negocio + " y vi la web que hiciste: " + web + " Quiero acceder al plan de la web por " + V.plan + ".";
    $$("[data-dueno], [data-dueno-credito]").forEach(function (d) {
      d.href = "https://wa.me/" + V.whatsapp + "?text=" + encodeURIComponent(msgV);
      d.target = "_blank"; d.rel = "noopener";
    });
    var saludo = "¡Hola " + F.negocio + "! 🍓 Vi su web y quiero hacer una consulta.";
    $$("[data-wa-directo]").forEach(function (a) {
      if (F.demo) {
        a.href = "#";
        a.addEventListener("click", function (e) { e.preventDefault(); aviso("Propuesta: en la web publicada esto abre el WhatsApp de Frutale"); });
      } else { a.href = waUrl(saludo); a.target = "_blank"; a.rel = "noopener"; }
    });
    var ext = { "data-ig": F.redes.instagram, "data-tt": F.redes.tiktok, "data-fb": F.redes.facebook };
    Object.keys(ext).forEach(function (k) {
      $$("[" + k + "]").forEach(function (a) { a.href = ext[k]; a.target = "_blank"; a.rel = "noopener"; });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    dlg = $("#pedido");
    $$("[data-cart-open]").forEach(function (b) { b.addEventListener("click", abrir); });
    $$("[data-cart-close]").forEach(function (b) { b.addEventListener("click", cerrar); });
    if (dlg) {
      dlg.addEventListener("close", function () { document.documentElement.classList.remove("hoja-abierta"); });
      dlg.addEventListener("click", function (e) { if (e.target === dlg) cerrar(); });
    }
    iniciarFormulario(); enlaces(); pintar(false);
  });

  window.FrutalePedido = { agregar: agregar, construirMensaje: construirMensaje, waUrl: waUrl, estado: function () { return estado; }, total: total, aviso: aviso, soles: soles };
})();

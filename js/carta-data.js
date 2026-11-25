/*
  Datos comerciales de Frutale (Huacho).
  Fuente: carta en 4 imágenes enviada el 2026-11-23 (fuentes/carta) + bios y posts de IG/TikTok/FB revisados el 2026-11-23.
  Edita aquí precios, productos, sedes, horario o WhatsApp: la web se actualiza sola.
  "PENDIENTE" = dato que hay que confirmar con la dueña.
*/
(function () {
  var FR = ["Fresa", "Mango", "Plátano", "Durazno"];          // frutas de la carta
  var FP = ["Fresa", "Plátano"];                               // "fresa o plátano"
  var CREMAS = ["Vainilla", "Oreo", "Maracumango"];
  var JARABES = ["Fudge", "Condensada", "Miel de maple"];
  var HELADOS = ["Chocochip", "Tricolor", "Sublime"];
  var TOPS = ["Chispas de chocolate", "Chocolate blanco", "Burbujas", "Chin chin", "Choco-yogurth", "Obsesión", "Maní", "Gomitas", "Oreo", "Cua cua", "Doña Pepa", "Chips Ahoy", "Almendra", "Coco", "Pecana"];
  var SALSAS = ["BBQ", "BBQ picante", "Acevichada", "Broaster"];

  /* Grupos de elección para la ventanita "Personaliza".
     n = cuántos se eligen; repetir = se puede repetir el mismo (bolas de helado). */
  function g(id, titulo, opciones, n, repetir) { return { id: id, titulo: titulo, opciones: opciones, n: n, repetir: !!repetir }; }
  var fruta1P = g("fruta", "Fruta", FP, 1), fruta1 = g("fruta", "Fruta", FR, 1), frutas2 = g("frutas", "Frutas", FR, 2);
  function tops(n) { return g("toppings", n > 1 ? "Toppings" : "Topping", TOPS, n); }
  function cremas(n) { return g("cremas", n > 1 ? "Cremas" : "Crema", CREMAS, n); }
  function jarabes(n, ops) { return g("jarabes", n > 1 ? "Jarabes" : "Jarabe", ops || JARABES, n); }
  function helado(n) { return g("helado", n > 1 ? "Sabores de helado" : "Helado", HELADOS, n, n > 1); }

  window.FRUTALE = {
    negocio: "Frutale",
    // ⚠️ PROVISIONAL: número de Jerson para probar los pedidos. El oficial de Frutale (verificado: bio IG + bio TikTok + ficha FB)
    // es "51906788678": ponerlo aquí cuando la dueña contrate la web.
    whatsapp: "51906080756",
    // Modo demostración: true = arma el pedido pero no abre WhatsApp.
    demo: false,
    vendedor: { nombre: "Jerson", whatsapp: "51906080756", plan: "$35.90 al mes", webUrl: "https://frutalehuacho.roxanjer.com/" },
    eslogan: "La felicidad sabe a fresa",
    // PENDIENTE: último dato público (TikTok, 19 jun 2026): "todos los días de 3 a 10 pm, menos los jueves". Confirmar para las dos sedes.
    horario: { texto: "3:00 pm – 10:00 pm", dias: "Todos los días, menos los jueves" },
    // PENDIENTE: ¿siguen abiertas las dos? Falta el número de la calle de la sede 2.
    sedes: [
      { id: "leoncio", nombre: "Sede Leoncio Prado", etiqueta: "¡Nueva!", direccion: "Av. Leoncio Prado, al lado de la Colonia China", ciudad: "Huacho",
        maps: "https://www.google.com/maps/search/?api=1&query=Av.+Leoncio+Prado+Colonia+China+Huacho" },
      { id: "milagro", nombre: "Sede Santa María", etiqueta: "La primera", direccion: "Av. El Milagro #168, Santa María", referencia: "A media cuadra del grifo Gassersi", ciudad: "Huacho",
        maps: "https://www.google.com/maps/search/?api=1&query=Av.+El+Milagro+168+Santa+Mar%C3%ADa+Huacho" }
    ],
    redes: {
      instagram: "https://www.instagram.com/frutale25/",
      tiktok: "https://www.tiktok.com/@frutale25",
      facebook: "https://www.facebook.com/people/Frutale/61551885483983/"
    },

    /* ---------- Armador de vaso (fresas con crema · "Los más pedidos") ---------- */
    vaso: {
      tamanos: [
        { id: "clasica",    nombre: "Clásica",    oz: 8,  precio: 9,    toppings: 1, jarabes: 1, cremaElegir: false, receta: "Fresas + crema + 1 topping + 1 jarabe" },
        { id: "especial",   nombre: "Especial",   oz: 10, precio: 12.5, toppings: 2, jarabes: 2, cremaElegir: true,  receta: "Fresas + crema + 2 toppings + 2 jarabes" },
        { id: "cookiefrut", nombre: "Cookiefrut", oz: 12, precio: 17,   toppings: 2, jarabes: 1, cremaElegir: false, galleta: true, receta: "Fresas + crema + galleta triturada + 2 toppings + 1 jarabe" },
        { id: "nutella",    nombre: "Nutella",    oz: 16, precio: 22,   toppings: 3, jarabes: 0, cremaElegir: true,  nutella: true, receta: "Fresas + crema + 3 toppings + Nutella" }
      ],
      // PENDIENTE: en la Clásica y la Cookiefrut la carta no dice "a elección": se muestra "crema de la casa".
      cremas: [
        { nombre: "Vainilla", color: "#FFF7EA", motas: "" },
        { nombre: "Oreo", color: "#DDD3CE", motas: "#2B2320" },
        { nombre: "Maracumango", color: "#FFCB52", motas: "#E8902A" }
      ],
      galletas: ["Oreo", "Vainilla"],
      jarabes: [
        { nombre: "Fudge", color: "#4A2412" },
        { nombre: "Condensada", color: "#FBEBC8" },
        { nombre: "Miel de maple", color: "#C8761C" }
      ],
      // premium: +S/2 como adicional. PENDIENTE: almendra y pecana salen en la grilla normal y en "toppings premium +2".
      toppings: [
        { nombre: "Chispas de chocolate", color: "#5B2E14", forma: "chispa" },
        { nombre: "Chocolate blanco",     color: "#FFF1D6", forma: "chispa" },
        { nombre: "Burbujas",             color: "#FF8FC8", forma: "bola" },
        { nombre: "Chin chin",            color: "#F2B43C", forma: "bola" },
        { nombre: "Choco-yogurth",        color: "#8B4B2B", forma: "barra" },
        { nombre: "Obsesión",             color: "#3D1F12", forma: "barra" },
        { nombre: "Maní",                 color: "#D99A55", forma: "bola" },
        { nombre: "Gomitas",              color: "#FF4D6D", forma: "gomita" },
        { nombre: "Oreo",                 color: "#231A17", forma: "galleta" },
        { nombre: "Cua cua",              color: "#6E3A1C", forma: "barra" },
        { nombre: "Doña Pepa",            color: "#7A4425", forma: "barra" },
        { nombre: "Chips Ahoy",           color: "#C88A4A", forma: "galleta" },
        { nombre: "Almendra",             color: "#B57A45", forma: "almendra", premium: true },
        { nombre: "Coco",                 color: "#FFFFFF", forma: "chispa" },
        { nombre: "Pecana",               color: "#8A4F26", forma: "almendra", premium: true },
        { nombre: "Brownie bites",        color: "#3F2114", forma: "cubo", premium: true, soloExtra: true }
      ],
      precioTopping: 1, precioToppingPremium: 2,
      extras: [
        { id: "crema-extra",   nombre: "Crema extra",       precio: 4 },
        { id: "nutella-extra", nombre: "Nutella adicional", precio: 3 },
        { id: "helado-chocochip", nombre: "Bola de helado · Chocochip", precio: 4, grupo: "helado" },
        { id: "helado-tricolor",  nombre: "Bola de helado · Tricolor",  precio: 4, grupo: "helado" },
        { id: "helado-sublime",   nombre: "Bola de helado · Sublime",   precio: 4, grupo: "helado" },
        { id: "fruta-fresa",   nombre: "Fresa adicional",   precio: 2, grupo: "fruta", color: "#E8243C" },
        { id: "fruta-platano", nombre: "Plátano adicional", precio: 2, grupo: "fruta", color: "#FBE7A1" },
        { id: "fruta-mango",   nombre: "Mango (premium)",   precio: 3, grupo: "fruta", color: "#FFB627" },
        { id: "fruta-durazno", nombre: "Durazno (premium)", precio: 3, grupo: "fruta", color: "#FF9A3D" }
      ]
    },

    /* ---------- Resto de la carta ---------- */
    carta: [
      { id: "dulce", nombre: "Dulces", categorias: [
        { id: "crepes", nombre: "Crepes", items: [
          { nombre: "Crepe Clásico", precio: 15, desc: "Fresa o plátano + 1 topping + condensada y fudge", elige: [fruta1P, tops(1)] },
          { nombre: "Crepe Nutella", precio: 20, desc: "1 fruta a elección + 2 toppings + Nutella", elige: [fruta1, tops(2)] },
          { nombre: "Crepe Nutella Frost", precio: 24, desc: "2 frutas a elección + 1 topping + bola de helado + Nutella", elige: [frutas2, tops(1), helado(1)] },
          { nombre: "Crepe Cheesecake", precio: 27, desc: "Fresa + queso crema + galleta triturada + mermelada de frutos rojos + azúcar glass" }
        ]},
        { id: "waffles", nombre: "Waffles", items: [
          { nombre: "Waffle Clásico", precio: 18, desc: "Fresa y plátano + 3 toppings + fudge y condensada", elige: [tops(3)] },
          { nombre: "Waffle Mixto", precio: 20, desc: "Fresa y mango + 2 toppings + fudge y condensada", elige: [tops(2)] },
          { nombre: "Waffle Tropical", precio: 25, desc: "Mango y durazno + 2 toppings + crema a elección + fudge o condensada", elige: [tops(2), cremas(1), jarabes(1, ["Fudge", "Condensada"])] },
          { nombre: "Waffle Frutice", precio: 21, desc: "Fresa o plátano + 3 toppings + 1 bola de helado + fudge y condensada", elige: [fruta1P, tops(3), helado(1)] },
          { nombre: "Waffle Nutella", precio: 20, desc: "Fresa o plátano + 2 toppings + Nutella", elige: [fruta1P, tops(2)] },
          { nombre: "Waffle Nutale", precio: 27, desc: "2 frutas a elección + 2 toppings + 2 cremas a elección + Nutella", elige: [frutas2, tops(2), cremas(2)] }
        ]},
        { id: "minipancakes", nombre: "Minipancakes", items: [
          { nombre: "Minipancakes Clásicos · 12 und", precio: 17, desc: "Fresa o plátano + 2 toppings + 1 jarabe", elige: [fruta1P, tops(2), jarabes(1)] },
          { nombre: "Minipancakes Clásicos · 18 und", precio: 25, favorito: true, desc: "2 frutas a elección + 2 toppings + 2 jarabes + 1 crema a elección", elige: [frutas2, tops(2), jarabes(2), cremas(1)] },
          { nombre: "Minipancakes Nutella · 25 und", precio: 30, desc: "1 fruta a elección + 2 toppings + Nutella + 1 crema a elección o 1 bola de helado", elige: [fruta1, tops(2), g("crema-o-helado", "Crema o bola de helado", CREMAS.map(function (c) { return "Crema " + c; }).concat(HELADOS.map(function (h) { return "Helado " + h; })), 1)] },
          { nombre: "Minipancakes Nutella · 30 und", precio: 35, desc: "2 frutas a elección + 2 toppings + Nutella + 2 cremas a elección", elige: [frutas2, tops(2), cremas(2)] },
          { nombre: "Minipancakes Full · 36 und", precio: 40, desc: "2 frutas a elección + 3 toppings + 1 bola de helado + 1 crema a elección + fudge y condensada", elige: [frutas2, tops(3), helado(1), cremas(1)] }
        ]},
        { id: "bowls", nombre: "Maxi bowls", items: [
          { nombre: "Maxi bowl Brownie Berry", precio: 25, desc: "Fresas + 1 crema a elección + brownie bites + Nutella", elige: [cremas(1)] },
          { nombre: "Maxi bowl Frutale Mix", precio: 35, desc: "1 fruta a elección + 1 crema a elección + trozos de waffles + 6 minipancakes + Nutella", elige: [fruta1, cremas(1)] }
        ]},
        { id: "panes-dulces", nombre: "Panes dulces", items: [
          { nombre: "Croutale", precio: 16, desc: "Croissant relleno de nuestra crema + fresas + azúcar glass espolvoreado" },
          { nombre: "Croissant Nutella", precio: 18, desc: "Croissant relleno de Nutella + fresas + azúcar glass espolvoreado" },
          { nombre: "Croissant Mixto", precio: 20, desc: "Croissant relleno de nuestra crema + fresas + Nutella + azúcar glass espolvoreado" }
        ]},
        { id: "postres", nombre: "Brownie, helados y fruta", items: [
          { nombre: "Brownie con Nutella", precio: 10 },
          { nombre: "Brownie con helado", precio: 13, elige: [helado(1)] },
          { nombre: "Helado · 2 bolas", precio: 7, elige: [helado(2)] },
          { nombre: "Helado · 3 bolas", precio: 9, elige: [helado(3)] },
          { nombre: "Banana Split", precio: 11 },
          { nombre: "Ensalada de fruta sin helado", precio: 10 },
          { nombre: "Ensalada de fruta con helado", precio: 12, elige: [helado(1)] }
        ]}
      ]},
      { id: "salado", nombre: "Salado", categorias: [
        { id: "panes-salados", nombre: "Panes salados", items: [
          { nombre: "Croissant pollo y huevo", precio: 15, desc: "Pollo y huevo con mayonesa + lechuga + tomate" },
          { nombre: "Croissant jamón y queso", precio: 12, desc: "Jamón + queso" },
          { nombre: "Croissant de atún", precio: 14, desc: "Atún con mayonesa + lechuga + tomate" },
          { nombre: "Croissant pollo y durazno", precio: 16, desc: "Pollo deshilachado con mayonesa + durazno + lechuga" },
          { nombre: "Ciabata de milanesa", precio: 18, desc: "Milanesa + queso gratinado + tomate + cebolla + palta" },
          { nombre: "Ciabata de pollo", precio: 11, desc: "Pollo deshilachado con mayonesa + lechuga + papas al hilo" },
          { nombre: "Ciabata pollo y palta", precio: 13, desc: "Pollo deshilachado con mayonesa + lechuga + palta" },
          { nombre: "Pan francés con chicharrón", precio: 14, desc: "Trozos de chicharrón + camote + sarsa" },
          { nombre: "Pan francés con chorizo", precio: 10, desc: "Chorizo + lechuga + tomate + papas al hilo" }
        ]},
        { id: "triples", nombre: "Triples", items: [
          { nombre: "Triple jamón, queso y pollo", precio: 11.5 },
          { nombre: "Triple pollo, queso y huevo", precio: 12 },
          { nombre: "Triple pollo, huevo y jamón", precio: 12 },
          { nombre: "Triple pollo, jamón y palta", precio: 13 }
        ]},
        // PENDIENTE: ¿cuántas salsas entran por tamaño? Por ahora se elige 1.
        { id: "alitas", nombre: "Alitas", nota: "Salsas: BBQ, BBQ picante, acevichada o broaster", items: [
          { nombre: "Alitas Personal", precio: 22, desc: "8 pz + papas nativas", elige: [g("salsa", "Salsa", SALSAS, 1)] },
          { nombre: "Alitas Dúo", precio: 38, desc: "18 pz + papas nativas", elige: [g("salsa", "Salsa", SALSAS, 1)] },
          { nombre: "Alitas Familiar", precio: 66, desc: "40 pz + papas nativas", elige: [g("salsa", "Salsa", SALSAS, 1)] },
          { nombre: "Alitas Gigante", precio: 95, desc: "60 pz + papas nativas", elige: [g("salsa", "Salsa", SALSAS, 1)] }
        ]},
        { id: "salchialitas", nombre: "Salchialitas", items: [
          { nombre: "Salchialitas Clásica", precio: 24, desc: "6 pz de alitas + papas nativas + hot dog ahumado" },
          { nombre: "Salchialitas Especial", precio: 26, desc: "8 pz de alitas + papas nativas + hot dog ahumado + chorizo" },
          { nombre: "Alichaufa", precio: 24, desc: "5 pz de alitas + papas nativas + porción de chaufa" }
        ]},
        { id: "hamburguesas", nombre: "Hamburguesas", items: [
          { nombre: "Hamburguesa Clásica", precio: 15, desc: "Carne + lechuga + tomate + papas nativas" },
          { nombre: "Hamburguesa Doble", precio: 19, desc: "Doble carne + doble queso + lechuga + tomate + papas nativas" },
          { nombre: "Hamburguesa BBQ", precio: 18, desc: "Carne + queso + tocino + lechuga + tomate + salsa BBQ + papas nativas" }
        ]}
      ]},
      { id: "bebidas", nombre: "Bebidas", categorias: [
        { id: "jugos", nombre: "Jugos", items: [
          { nombre: "Jugo de fresa", precio: 9 }, { nombre: "Jugo de fresa con leche", precio: 11 },
          { nombre: "Jugo de papaya", precio: 8 }, { nombre: "Jugo de papaya con leche", precio: 10 },
          { nombre: "Jugo de piña", precio: 8 }, { nombre: "Jugo de plátano con leche", precio: 11 },
          { nombre: "Jugo surtido", precio: 9 }
        ]},
        { id: "frappes", nombre: "Frappés", items: [
          { nombre: "Frappé de fresa", precio: 14 }, { nombre: "Frappé de Oreo", precio: 15 }, { nombre: "Frappé mocca", precio: 15 },
          { nombre: "Frappé de maracuyá", precio: 15 }, { nombre: "Frappé maracumango", precio: 16 }
        ]},
        { id: "frias", nombre: "Frías", items: [
          { nombre: "Limonada frozen", precio: 12 }, { nombre: "Limonada de fresa", precio: 10 },
          { nombre: "Limonada de maracuyá", precio: 9 }, { nombre: "Maracumango", precio: 11 },
          { nombre: "Orange Coffee", precio: 14 }, { nombre: "Mango Latte Coffee", precio: 16 },
          { nombre: "Oreo Latte Coffee", precio: 15 }, { nombre: "Coffee Latte", precio: 14 },
          { nombre: "Iced Cappuccino", precio: 14 }, { nombre: "Iced Coffee", precio: 12 }
        ]},
        { id: "sodas", nombre: "Sodas italianas", items: [
          { nombre: "Limonada Frutale", precio: 12 }, { nombre: "Limonada Blue Curacao", precio: 12 }, { nombre: "Sunset", precio: 13.5 }
        ]},
        { id: "calientes", nombre: "Calientes", items: [
          { nombre: "Cappuccino", precio: 8.5 }, { nombre: "Café", precio: 5 }, { nombre: "Latte", precio: 8 },
          { nombre: "Café con leche", precio: 7.5 }, { nombre: "Leche con café", precio: 8.5 }
        ]}
      ]}
    ],

    /* Historia: hitos públicos de sus redes (fecha sacada del post). */
    historia: [
      { fecha: "Jul 2025", titulo: "El toldito verde con rosa", texto: "Fresas con crema en la Feria de la Virgen del Carmen, en Huaura." },
      { fecha: "23 ene 2026", titulo: "Abrimos nuestras puertas", texto: "Primer local en Av. El Milagro #168, Santa María." },
      { fecha: "Jul 2026", titulo: "El cartel súper rosita", texto: "Feria de Luriama, al inicio de la Av. Libertad." },
      { fecha: "Oct 2026", titulo: "Nuestro propio packing", texto: "Vasos y cajas con «La felicidad sabe a fresa»." },
      { fecha: "22 nov 2026", titulo: "Segunda sede", texto: "Av. Leoncio Prado, al lado de la Colonia China." }
    ]
  };
})();

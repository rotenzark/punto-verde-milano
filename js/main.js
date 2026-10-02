/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'punto-verde-milano',
    /* nessun WhatsApp: solo il fisso */
    whatsapp: { number: '', message: '', ids: [] },
    /* la scheda Google (2/10/2026): lunedì–venerdì 7:30–12:30 e 14:30–19, sabato 8:30–12:30 e 15–19, domenica 9:30–12:30 */
    hours: {
      0: [['09:30', '12:30']],
      1: [['07:30', '12:30'], ['14:30', '19:00']], 2: [['07:30', '12:30'], ['14:30', '19:00']], 3: [['07:30', '12:30'], ['14:30', '19:00']],
      4: [['07:30', '12:30'], ['14:30', '19:00']], 5: [['07:30', '12:30'], ['14:30', '19:00']],
      6: [['08:30', '12:30'], ['15:00', '19:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Punto Verde Milano: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.piante": "The plants",
      "n.innesto": "Grafting",
      "n.servizi": "Services",
      "n.storia": "Our story",
      "n.dicono": "Reviews",
      "n.arrivare": "Getting here",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "t.arrivare": "Getting here",
      "h.cartellino": "plant nursery",
      "h.dove": "Via Cavriana 55 · Cavriano, between Parco Forlanini and Ortica",
      "h.testo": "Outdoor and indoor plants, grown and chosen here: Japanese maples, citrus, camellias, orchids, herbs, seasonal flowers, vegetable seedlings. And the advice to make them grow well.",
      "h.voto": "on Google, 116 reviews",
      "a.serra": "The nursery in summer: white and blue agapanthus in the foreground, then box balls and terracotta pots, and the tunnel greenhouses behind.",
      "h.fserra": "The nursery in summer, with the agapanthus and the greenhouses (photo by a client)",
      "l.cartellino": "the plants",
      "l.titolo": "From the maple to the lemon tree",
      "l.intro": "In the greenhouses and outdoors, in pots: fruit trees, palms, herbs, jasmines, olive trees, pines, primroses, succulents and cacti, house plants including big ones, vegetable seedlings. And then pots, soil and tools.",
      "a.aceri": "Japanese maples in pots under the shade structure, in autumn, with red and bronze leaves; behind, the overpass.",
      "l.n1": "japanese maples",
      "l.d1": "In pots, under the shade structure, in autumn.",
      "a.limoni": "Potted lemon trees full of yellow fruit.",
      "l.n2": "citrus",
      "l.d2": "Lemon trees in pots, with their fruit.",
      "a.camelia": "A camellia in bright pink bloom under the greenhouse; behind, the cyclamens and the yellow pointed tags.",
      "l.n3": "camellias",
      "l.d3": "They bloom in winter, under the greenhouse.",
      "a.orchidee": "White, pink and fuchsia orchids on the greenhouse bench, among the ferns.",
      "l.n4": "orchids",
      "l.d4": "And house plants: rare ones too.",
      "a.viole": "Blue, orange, white, pink and yellow pansies on the trolley.",
      "l.n5": "seasonal flowers",
      "l.d5": "Pansies, cyclamens, primroses: they change with the months.",
      "l.nota": "The photos are by our clients, on Google. Wholesale and retail; you find the prices at the nursery.",
      "p.cartellino": "grafting",
      "p.titolo2": "Grafting on request",
      "p.intro": "The rootstock in the pot, the cleft, the scion going in, the raffia holding it; then, if it takes, the plant starts growing again. We do it for you too: ask at the counter.",
      "p.citf": "Roberta C., on Google",
      "p.titolo": "Grafting",
      "p.desc": "A cleft graft, drawn: the rootstock in the terracotta pot, the cleft at the top, the scion going in, the raffia tying it; then the branches and leaves grow and the fruit comes. In the first drawing a lemon tree, in the second a Japanese maple with red leaves and samaras.",
      "p.d0": "A cleft-grafted lemon tree, drawn: the glossy leaves and the fruit.",
      "p.d1": "A cleft-grafted Japanese maple, drawn: the red leaves and the samaras.",
      "p.modi": "What to graft",
      "p.b0": "Lemon",
      "p.b1": "Maple",
      "v.cartellino": "services",
      "v.titolo": "Not just plants",
      "v.n1": "Advice",
      "v.d1": "Which plant for your terrace or your home, where to put it, how to care for it. And if a plant is not well, ask us: you also find the treatments at the nursery.",
      "v.n2": "Grafting",
      "v.d2": "On request, like the one above.",
      "v.n3": "Arrangements and planting",
      "v.d3": "We put plants together in pots and plant them out.",
      "v.n4": "Home delivery",
      "v.d4": "To be arranged at the nursery or by phone.",
      "v.n5": "Pots and treatments",
      "v.d5": "Pots of many shapes, soils, tools and products for sick plants.",
      "v.n6": "Wholesale",
      "v.d6": "For gardeners and professionals, as well as retail.",
      "s.cartellino": "our story",
      "s.titolo": "Growers in Milan for almost three centuries",
      "s.testo1": "The family has been growing in the city for generations: first the vegetable gardens behind San Pietro in Gessate, then Cascina Trecca, then the fields where the Ortomercato stands today, and finally Cavriano, the old farming hamlet between Parco Forlanini and Ortica.",
      "s.testo2": "From the vegetables, flowers, milk and hay of the past to the plants for today's balconies and terraces: in pots, wholesale and retail, with tunnel greenhouses and open fields.",
      "s.fonte": "The story was told by Ecoturismonline in February 2026:",
      "s.link": "«Il vivaio sotto il cavalcavia» (in Italian)",
      "s.tappe": "The stages",
      "s.t1": "The vegetable gardens behind San Pietro in Gessate",
      "s.t2": "Cascina Trecca",
      "s.t3": "The fields where the Ortomercato stands today",
      "s.t4": "Cavriano, on Via Cavriana",
      "d.cartellino": "reviews",
      "d.titolo": "A real nursery",
      "d.voto": "on Google, 116 reviews",
      "d.t24": "Google, 2024",
      "d.t23": "Google, 2023",
      "d.t22": "Google, 2022",
      "d.nota": "From the reviews on Google, in Italian, as they were written; […] where we shortened them. The line about grafting, higher up, is by Roberta C., also on Google.",
      "d.tutte": "All the reviews on Google",
      "o.cartellino": "getting here",
      "o.titolo": "Under the overpass, on Via Cavriana",
      "o.intro": "Via Cavriana is a country lane: from Viale Forlanini it reaches Via Tucidide, under the overpass. The nursery is at number 55.",
      "w.dove": "Where",
      "w.dovev": "Via Cavriana 55, 20134 Milan",
      "w.bus": "Bus",
      "w.busv": "the 38 on Via Tucidide, about 130 metres away; the 54 at Via Amadeo – Via San Faustino, about 170",
      "w.tram": "Tram",
      "w.tramv": "the 5, Ortica stop, about 400 metres away",
      "w.metro": "Underground and train",
      "w.metrov": "M4 and Milano Forlanini station, about 700 metres away",
      "w.tel": "Phone",
      "w.mail": "Email",
      "o.orari": "opening hours",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.nota": "Hours from our Google listing (October 2026).",
      "w.mappa": "Map: Punto Verde Milano, Via Cavriana 55, Milan",
      "q.cartellino": "questions",
      "q.titolo": "Before you come",
      "q.d1": "How do I get to Via Cavriana?",
      "q.r1": "Via Cavriana is a country lane that runs from Viale Forlanini to Via Tucidide, under the overpass. By bus: the 38 stops on Via Tucidide, about 130 metres away; the 54 at Via Amadeo – Via San Faustino, about 170 metres away. Tram 5 stops at Ortica, about 400 metres away; the M4 at Stazione Forlanini, about 700 metres away.",
      "q.d2": "Are you open on Sunday?",
      "q.r2": "Yes, in the morning, from 9:30 to 12:30. Monday to Friday 7:30–12:30 and 14:30–19; Saturday 8:30–12:30 and 15–19.",
      "q.d3": "Do you do grafting?",
      "q.r3": "Yes, on request: ask at the counter.",
      "q.d4": "A plant is not well: what do I do?",
      "q.r4": "Ask us for advice at the nursery: we tell you how to treat it, and you also find the treatments there.",
      "q.d5": "Do you deliver?",
      "q.r5": "Yes, to be arranged at the nursery or by phone, on 02 7012 8324.",
      "f2.sotto": "plant nursery",
      "f2.orario": "Monday–Friday 7:30–12:30 and 14:30–19 · Saturday 8:30–12:30 and 15–19 · Sunday 9:30–12:30",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · <a href=\"privacy.html\">Privacy</a> · hours, rating, reviews and photos from the Google listing (October 2026), the photos are by clients; the services from ViviMilano and Cascine Aperte; the story from Ecoturismonline (February 2026). We redrew the logo and the graft ourselves.",
      "f2.su": "Back to the top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ PUNTO VERDE MILANO — vivaio, Via Cavriana 55 ══════════
     la FIRMA — «l'innesto»: il portinnesto nel vaso; si apre lo spacco, scende la marza, la rafia la lega, crescono i rami, escono
     le foglie, poi i frutti. Lo stato è M (Limone / Acero), T (0…1) e V (0 al suo posto; fino a 1 la parte innestata sale e si
     spegne; da −1 a 0 arriva la prossima, ancora da fare). Senza JS e alla fine: Limone, T = 1, V = 0 (l'HTML). L'attesa (classe
     nell'head): il portinnesto da solo. Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia
     la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[520,600],"via":-36,"calo":110,"modi":[{"nome":"Limone","taglio":[0.02,0.08],"marza":[0.1,0.2],"raffia":{"f":[0.32,0.12],"l":210.7},"rami":[{"f":[0.46,0.16],"l":138.1},{"f":[0.495,0.16],"l":99.6},{"f":[0.53,0.16],"l":101.7},{"f":[0.565,0.16],"l":87.6},{"f":[0.6,0.16],"l":89.5},{"f":[0.635,0.16],"l":63.1},{"f":[0.67,0.16],"l":65.9}],"foglie":[{"x":259.4,"y":190.8,"a":-51,"f":[0.516,0.1]},{"x":259.8,"y":157.7,"a":52,"f":[0.556,0.1]},{"x":259.1,"y":122.8,"a":-55,"f":[0.596,0.1]},{"x":257.4,"y":100.2,"a":-6,"f":[0.62,0.1]},{"x":232.9,"y":190.1,"a":-1,"f":[0.551,0.1]},{"x":213.7,"y":175.5,"a":-105,"f":[0.591,0.1]},{"x":192.9,"y":159.8,"a":-1,"f":[0.631,0.1]},{"x":179.4,"y":149.6,"a":-53,"f":[0.655,0.1]},{"x":289,"y":179.7,"a":2,"f":[0.586,0.1]},{"x":308.8,"y":165.1,"a":105,"f":[0.626,0.1]},{"x":329.6,"y":149.4,"a":1,"f":[0.666,0.1]},{"x":343.2,"y":139.2,"a":53,"f":[0.69,0.1]},{"x":236.6,"y":138.8,"a":7,"f":[0.621,0.1]},{"x":221.7,"y":123.7,"a":-96,"f":[0.661,0.1]},{"x":206.8,"y":107.8,"a":10,"f":[0.701,0.1]},{"x":197.6,"y":97.6,"a":-42,"f":[0.725,0.1]},{"x":282.6,"y":125.8,"a":-5,"f":[0.656,0.1]},{"x":298.1,"y":110.7,"a":97,"f":[0.696,0.1]},{"x":313.2,"y":94.8,"a":-9,"f":[0.736,0.1]},{"x":322.4,"y":84.6,"a":42,"f":[0.76,0.1]},{"x":247.9,"y":95.4,"a":28,"f":[0.691,0.1]},{"x":242,"y":81.7,"a":-75,"f":[0.731,0.1]},{"x":235.8,"y":67.6,"a":27,"f":[0.771,0.1]},{"x":231.4,"y":58.6,"a":-27,"f":[0.795,0.1]},{"x":270.3,"y":90.3,"a":-19,"f":[0.726,0.1]},{"x":279.1,"y":77.1,"a":86,"f":[0.766,0.1]},{"x":288.1,"y":64,"a":-17,"f":[0.806,0.1]},{"x":293.8,"y":56,"a":36,"f":[0.83,0.1]}],"frutti":[{"x":212.1,"y":192.3,"a":-8,"f":[0.84,0.1]},{"x":310.4,"y":181.9,"a":10,"f":[0.87,0.1]},{"x":295.1,"y":131.7,"a":4,"f":[0.9,0.1]}]},{"nome":"Acero","taglio":[0.02,0.08],"marza":[0.1,0.2],"raffia":{"f":[0.32,0.12],"l":210.7},"rami":[{"f":[0.46,0.16],"l":158.9},{"f":[0.495,0.16],"l":123.7},{"f":[0.53,0.16],"l":122.4},{"f":[0.565,0.16],"l":97.8},{"f":[0.6,0.16],"l":96.7},{"f":[0.635,0.16],"l":65},{"f":[0.67,0.16],"l":63.7}],"foglie":[{"x":260.6,"y":183.9,"a":-53,"f":[0.516,0.1]},{"x":260.2,"y":145,"a":52,"f":[0.556,0.1]},{"x":260.9,"y":104.6,"a":-49,"f":[0.596,0.1]},{"x":262.6,"y":79.4,"a":5,"f":[0.62,0.1]},{"x":218.8,"y":208.8,"a":-27,"f":[0.551,0.1]},{"x":188.7,"y":204.3,"a":-136,"f":[0.591,0.1]},{"x":157.4,"y":202.9,"a":321,"f":[0.631,0.1]},{"x":137.8,"y":204.2,"a":263,"f":[0.655,0.1]},{"x":303.3,"y":200.6,"a":29,"f":[0.586,0.1]},{"x":333.3,"y":197.4,"a":139,"f":[0.626,0.1]},{"x":363.6,"y":197.3,"a":41,"f":[0.666,0.1]},{"x":382.2,"y":199,"a":97,"f":[0.69,0.1]},{"x":228.2,"y":156.3,"a":-22,"f":[0.621,0.1]},{"x":205,"y":151.1,"a":-133,"f":[0.661,0.1]},{"x":181.3,"y":149.1,"a":-37,"f":[0.701,0.1]},{"x":166.4,"y":149.6,"a":266,"f":[0.725,0.1]},{"x":294.4,"y":151.2,"a":27,"f":[0.656,0.1]},{"x":317.6,"y":148,"a":138,"f":[0.696,0.1]},{"x":341.3,"y":147.9,"a":42,"f":[0.736,0.1]},{"x":356.2,"y":149.6,"a":99,"f":[0.76,0.1]},{"x":241.5,"y":109.3,"a":-12,"f":[0.691,0.1]},{"x":226.8,"y":103.2,"a":-123,"f":[0.731,0.1]},{"x":212,"y":99.1,"a":-26,"f":[0.771,0.1]},{"x":202.8,"y":97.6,"a":-83,"f":[0.795,0.1]},{"x":283.7,"y":104.9,"a":16,"f":[0.726,0.1]},{"x":298.4,"y":100.3,"a":129,"f":[0.766,0.1]},{"x":313.2,"y":98,"a":33,"f":[0.806,0.1]},{"x":322.4,"y":97.6,"a":90,"f":[0.83,0.1]}],"frutti":[{"x":137.8,"y":214.2,"a":10,"f":[0.84,0.1]},{"x":382.2,"y":209,"a":-8,"f":[0.87,0.1]},{"x":262.6,"y":85.4,"a":0,"f":[0.9,0.1]}]}],"tempi":{"inizio":300,"innesto":5000,"servi":420,"arriva":480,"innestoV":4200}};
  /* l'innesto a (M, T, V) — una sola fonte: la usano _pvm_firma.mjs (l'HTML allo stato finale), main.js (via pvm_main.cjs) e la
     prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     Il portinnesto nel vaso: si apre lo spacco in cima, scende la marza e ci entra, la rafia la lega, poi crescono i rami, escono
     le foglie e alla fine i frutti (i limoni; le samare dell'acero). Col V la parte innestata sale e si spegne; la prossima
     arriva, ancora da fare. */
  function creaInnesto(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r2 = function (n) { return Math.round(n * 100) / 100; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w[0] + w[1] - 1e-9 ? 1 : c01((t - w[0]) / w[1]); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q = function (sel) { return svg.querySelector(sel); };
    var servito = q('.servito');
    var tutti = function (cl, m, n) { var a = []; for (var k = 0; k < n; k++) a.push(q('.' + cl + '[data-m="' + m + '"][data-k="' + k + '"]')); return a; };
    var pezzi = D.modi.map(function (M, m) {
      var uno = function (cl) { return q('.' + cl + '[data-m="' + m + '"]'); };
      return { taglio: uno('in-taglio'), marza: uno('in-marza'), raffia: uno('in-raffia'), r: tutti('in-r', m, M.rami.length), f: tutti('in-f', m, M.foglie.length), fr: tutti('in-fr', m, M.frutti.length) };
    });
    /* una foglia o un frutto: dal suo punto, girato, che cresce da zero */
    var cresci = function (el, P, t) {
      var u = fase(t, P.f);
      el.setAttribute('transform', 'translate(' + P.x + ' ' + P.y + ') rotate(' + P.a + ') scale(' + r2(dolce(u)) + ')');
      el.setAttribute('opacity', r3(dolce(c01(u / 0.4))));
    };
    function disegna(m, t, v) {
      var P = pezzi[m], M = D.modi[m], k, u;
      /* lo spacco in cima al portinnesto */
      P.taglio.setAttribute('opacity', r3(dolce(fase(t, M.taglio))));
      /* la marza scende e entra nello spacco */
      u = fase(t, M.marza);
      P.marza.setAttribute('transform', 'translate(0 ' + r1(-D.calo * (1 - dolce(u))) + ')');
      P.marza.setAttribute('opacity', r3(dolce(c01(u / 0.3))));
      /* la rafia lega l'innesto; i rami crescono a velocità costante */
      P.raffia.setAttribute('stroke-dashoffset', r1(M.raffia.l * (1 - fase(t, M.raffia.f))));
      for (k = 0; k < P.r.length; k++) P.r[k].setAttribute('stroke-dashoffset', r1(M.rami[k].l * (1 - fase(t, M.rami[k].f))));
      /* le foglie quando il ramo arriva al loro punto, i frutti per ultimi */
      for (k = 0; k < P.f.length; k++) cresci(P.f[k], M.foglie[k], t);
      for (k = 0; k < P.fr.length; k++) cresci(P.fr[k], M.frutti[k], t);
      /* col V la parte innestata sale e si spegne; la prossima arriva */
      servito.setAttribute('transform', 'translate(0 ' + r1(D.via * v) + ')');
      servito.setAttribute('opacity', r3(1 - Math.abs(v)));
    }
    var completo = !!servito && pezzi.every(function (P) { return P.taglio && P.marza && P.raffia && P.r.every(Boolean) && P.f.every(Boolean) && P.fr.every(Boolean); });
    return { disegna: disegna, pezzi: pezzi, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('innesto-firma'), svgF = prendi('innestoSvg'), leggiF = prendi('innestoLeggi');
  var INNESTO = svgF ? creaInnesto(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.innesto__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.innesto__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    INNESTO.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) INNESTO.disegna(k, 1, 0); });
    INNESTO.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta il portinnesto da solo */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: il portinnesto da solo */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.innesto, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.innesto });
  }
  /* il gesto: scegliere che cosa guardare. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la scena scende e si spegne, arriva dall'alto la prossima, vuota, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.innestoV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && INNESTO && INNESTO.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaInnesto); } catch (e) {}
    window.__innesto = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__innesto.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta il portinnesto da solo */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__innesto.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();

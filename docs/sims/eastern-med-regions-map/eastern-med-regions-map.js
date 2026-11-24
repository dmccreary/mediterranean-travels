// Regions of the Eastern Mediterranean Map - D3.js
// CANVAS_HEIGHT: 742
// An atlas-style map of the regions, island groups, seas and straits named in
// "Part One: The Map" of Chapter 1. Hover for an infobox, click to explore,
// or switch to the Find the Region challenge. Every meaningful action is
// emitted as an xAPI-shaped statement and listed in the Event stream tab, so
// a Learning Record Store can be connected later without changing the sim.
// Coastlines: Natural Earth 1:10m (public domain) via the world-atlas package.

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // Configuration
  // ------------------------------------------------------------------
  const SIM_ID = 'eastern-med-regions-map';
  const SIM_URL = 'https://dmccreary.github.io/mediterranean-travels/sims/' + SIM_ID + '/';
  const DATA_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-10m.json';
  const VIEW = { west: 19.4, east: 36.0, south: 30.55, north: 42.1 };
  const HOVER_MIN_MS = 600;      // shorter hovers are mouse crossings, not evidence
  const CONFETTI_COLORS = ['#A4482A', '#6B7A3A', '#2F6F8E', '#C8963E', '#F4ECD9'];
  // The Event stream tab is for reviewers and instructors, not students. It
  // appears only when show-events=true is on the sim's URL or on the URL of
  // the page that embeds it. Events are emitted either way.
  const SHOW_EVENTS = (function () {
    const on = search => new URLSearchParams(search).get('show-events') === 'true';
    if (on(location.search)) return true;
    try { return window.parent !== window && on(window.parent.location.search); } catch (e) { return false; }
  })();

  // ------------------------------------------------------------------
  // Region data. key: true = on the 12-item checklist and in the Find
  // challenge. Coordinates are [longitude, latitude].
  // ------------------------------------------------------------------
  const REGIONS = [
    // ---------- Seas and straits ----------
    {
      id: 'eastern-med', key: true, name: 'Eastern Mediterranean',
      kind: 'Sea', alt: 'Akdeniz, the "White Sea" (Turkish) · Mesógeios, "middle of the earth" (Greek)',
      country: 'Shared', continent: 'Where Europe, Asia and Africa meet',
      stops: 'The whole route sails it',
      teaser: 'The half of the Mediterranean east of Italy and Libya, with the lands around it.',
      blurb: 'The half of the Mediterranean east of Italy and Libya, with the lands around it. Three continents come within a short sail of one another here, so grain, metal, wine, alphabets, armies and faiths all crossed it, and they moved most easily by sea.',
      where: 'the open sea south of Crete and Rhodes',
      geom: { sea: [[20.0, 30.0], [37.5, 30.0], [37.5, 37.3], [30.0, 37.3], [28.6, 36.9], [28.35, 36.3], [27.8, 35.75], [27.1, 35.35], [26.3, 35.05], [23.5, 35.35], [22.9, 36.15], [22.4, 36.3], [20.0, 36.0]] },
      label: { at: [28.7, 34.15], lines: ['EASTERN', 'MEDITERRANEAN SEA'], cls: 'l-sea' }
    },
    {
      id: 'aegean', key: true, name: 'Aegean Sea',
      kind: 'Sea', alt: 'Named in myth for King Aegeus of Athens',
      country: 'Between Greece and Turkey', continent: 'Between Europe and Asia',
      stops: 'Most of the cruise, Istanbul to Athens',
      teaser: 'The island-crowded arm of the Mediterranean between Greece and Turkey.',
      blurb: 'The arm of the Mediterranean between Greece and Turkey, about 214,000 km² and so crowded with islands that a ship is rarely out of sight of land. The Roman writer Vegetius said the seas were "closed" from November 11 to March 10; our cruise sails in the first week of that closed season.',
      where: 'the island-filled sea between Greece and Turkey',
      geom: { sea: [[22.6, 41.0], [26.7, 41.1], [26.55, 40.25], [27.2, 39.6], [27.4, 38.8], [27.6, 37.4], [28.3, 36.85], [28.35, 36.3], [27.8, 35.75], [27.1, 35.35], [26.3, 35.05], [23.5, 35.35], [22.9, 36.15], [22.7, 36.8], [22.75, 37.6], [23.05, 37.85], [23.1, 38.4], [22.5, 39.2], [22.4, 40.3]] },
      label: { at: [25.0, 35.92], lines: ['AEGEAN SEA'], cls: 'l-sea' }
    },
    {
      id: 'bosphorus', key: true, name: 'Bosphorus',
      kind: 'Strait', alt: 'İstanbul Boğazı (Turkish)',
      country: 'Turkey', continent: 'The line between Europe and Asia',
      stops: 'Istanbul; the ferry to Kadıköy crosses it',
      teaser: 'The narrow strait at Istanbul that joins the Black Sea to the Sea of Marmara.',
      blurb: 'A strait about 31 km long that joins the Black Sea to the Sea of Marmara and splits Istanbul between Europe and Asia. Istanbul grew up on it and taxed the ships that passed. With the Dardanelles it is the only sea passage out of the Black Sea.',
      where: 'the narrow strait at Istanbul, between the Black Sea and the Sea of Marmara',
      geom: { strait: [[29.13, 41.23], [29.09, 41.17], [29.06, 41.12], [29.04, 41.07], [29.0, 41.02], [28.99, 40.99]] },
      label: { at: [30.15, 41.62], lines: ['Bosphorus'], cls: 'l-sea-sm', leader: [29.08, 41.16] }
    },
    {
      id: 'dardanelles', key: true, name: 'Dardanelles',
      kind: 'Strait', alt: 'The Hellespont (ancient) · Çanakkale Boğazı (Turkish)',
      country: 'Turkey', continent: 'The line between Europe and Asia',
      stops: 'Çanakkale, for Troy and Gallipoli (Day 6)',
      teaser: 'The long strait from the Aegean into the Sea of Marmara, guarded by Troy and Gallipoli.',
      blurb: 'A strait about 61 km long from the Aegean into the Sea of Marmara, the ancient Hellespont. Troy and Gallipoli guard its mouth. Whoever held it and the Bosphorus could tax, feed or starve the cities on either side.',
      where: 'the long strait leading from the Aegean into the Sea of Marmara, near Troy',
      geom: { strait: [[26.18, 40.03], [26.3, 40.08], [26.38, 40.15], [26.45, 40.22], [26.6, 40.32], [26.68, 40.4]] },
      label: { at: [25.3, 40.27], lines: ['Dardanelles'], cls: 'l-sea-sm', leader: [26.22, 40.06] }
    },
    {
      id: 'black-sea', key: false, name: 'Black Sea',
      kind: 'Sea', alt: 'Karadeniz (Turkish)',
      country: 'Shared', continent: 'Between Europe and Asia',
      stops: 'Seen from the north end of the Bosphorus',
      teaser: 'A large inland sea reached from the Mediterranean only through two narrow straits.',
      blurb: 'A large inland sea reached from the Mediterranean only through the Bosphorus and the Dardanelles. Its Turkish name, Karadeniz, may come from an old Turkic habit of naming directions by color, with black for the north.',
      geom: { sea: [[27.4, 41.7], [28.95, 41.3], [29.2, 41.22], [30.5, 41.15], [33.0, 41.0], [36.0, 40.9], [41.8, 40.9], [41.8, 47.0], [27.4, 47.0]] },
      label: { at: [32.3, 42.05], lines: ['BLACK SEA'], cls: 'l-sea' }
    },
    {
      id: 'marmara', key: false, name: 'Sea of Marmara',
      kind: 'Sea', alt: 'Marmara Denizi (Turkish)',
      country: 'Turkey', continent: 'Between Europe and Asia',
      stops: 'Istanbul sits on its northeast corner',
      teaser: 'A small, protected inland sea between the Bosphorus and the Dardanelles.',
      blurb: 'A small, protected inland sea about 280 km long, linking the Bosphorus to the Dardanelles. Istanbul sits on its northeast corner.',
      geom: { sea: [[26.62, 40.36], [26.95, 40.72], [27.6, 41.06], [29.0, 41.06], [29.2, 40.95], [29.98, 40.78], [29.4, 40.3], [28.0, 40.25], [27.1, 40.25]] },
      label: { at: [28.35, 40.74], lines: ['Sea of Marmara'], cls: 'l-ctx-sea' }
    },
    {
      id: 'ionian-sea', key: false, name: 'Ionian Sea',
      kind: 'Sea', alt: '',
      country: 'Between Greece and Italy', continent: 'Europe',
      stops: 'Not on our route',
      teaser: 'The sea on the west side of Greece, between Greece and southern Italy.',
      blurb: 'The sea on the west side of Greece, between Greece and southern Italy. It holds the Ionian Islands, such as Corfu. We will not sail it.',
      geom: { sea: [[15.5, 40.4], [19.4, 40.4], [19.9, 39.9], [20.6, 39.3], [21.2, 38.6], [22.3, 38.4], [22.95, 38.05], [22.3, 37.95], [21.6, 37.2], [22.4, 36.3], [20.0, 36.0], [15.5, 36.0]] },
      label: { at: [20.1, 37.25], lines: ['IONIAN SEA'], cls: 'l-sea-sm' }
    },

    // ---------- Land regions ----------
    {
      id: 'thrace', key: true, name: 'Thrace (European Turkey)',
      kind: 'Region', alt: 'Trakya (Turkish)',
      country: 'Turkey', continent: 'Europe',
      stops: 'Istanbul, European side: our hotel and the old city (Days 1–5)',
      teaser: 'The small corner of Turkey that lies in Europe, west of the Bosphorus.',
      blurb: 'The corner of Turkey that lies in Europe, west of the Bosphorus and north of the Sea of Marmara. Istanbul\'s old city, where our hotel is, stands on this side. Historic Thrace also reaches into Greece and Bulgaria; the map shades only the Turkish part.',
      where: 'Turkey\'s small European corner, north of the Sea of Marmara',
      geom: { countryPart: 'Turkey', contains: [27.0, 41.4] },
      label: { at: [27.35, 41.42], lines: ['Thrace'], cls: 'l-region' }
    },
    {
      id: 'anatolia', key: true, name: 'Anatolia',
      kind: 'Region', alt: 'Asia Minor · Anadolu (Turkish)',
      country: 'Turkey', continent: 'Asia',
      stops: 'Istanbul (Asian side), Çanakkale, Kusadasi, Ephesus',
      teaser: 'The great peninsula that makes up the Asian part of Turkey, about 97 percent of the country.',
      blurb: 'The great peninsula that makes up the Asian part of Turkey, about 97 percent of the country. Its name comes from the Greek anatolē, "sunrise." The center is a high, dry plateau around 1,000 m up; the west coast is green valleys and deep, sheltered bays.',
      where: 'the large peninsula of Asian Turkey, between the Black Sea and the Mediterranean',
      geom: { countryPart: 'Turkey', contains: [32.8, 39.9] },
      label: { at: [32.2, 38.55], lines: ['ANATOLIA'], cls: 'l-region' }
    },
    {
      id: 'ionia', key: true, name: 'Ionia',
      kind: 'Historic region', alt: 'The central Aegean coast of Anatolia',
      country: 'Turkey', continent: 'Asia',
      stops: 'Kusadasi and Ephesus (Day 7)',
      teaser: 'The central Aegean coast of Anatolia, home of great Greek cities like Ephesus and Miletus.',
      blurb: 'The middle of Anatolia\'s Aegean coast, home of great Greek cities like Ephesus and Miletus. Greek philosophy began here with Thales of Miletus around 600 BCE, and Homer may have been an Ionian Greek. Its borders were never fixed, so the dashed line is approximate.',
      where: 'the middle of Anatolia\'s Aegean coast, around Ephesus',
      geom: { clipTo: 'anatolia', poly: [[26.0, 38.95], [27.3, 38.95], [28.05, 38.55], [28.0, 37.7], [27.6, 37.35], [26.8, 37.3], [25.9, 37.6], [25.9, 38.6]] },
      label: { at: [27.68, 38.12], lines: ['Ionia'], cls: 'l-region' }
    },
    {
      id: 'attica', key: true, name: 'Attica and Central Greece',
      kind: 'Region', alt: 'Attikí and Stereá Elláda (Greek)',
      country: 'Greece', continent: 'Europe',
      stops: 'Athens and Piraeus (Days 10–11), Delphi (Day 12)',
      teaser: 'The heart of mainland Greece around Athens, reaching west to Delphi.',
      blurb: 'The heart of mainland Greece. Attica is the peninsula of Athens and its port, Piraeus, where the first democracy built the Parthenon. Central Greece reaches west to Delphi on the slopes of Mount Parnassus. The dashed line is approximate.',
      where: 'the Greek mainland around Athens, just north of the Peloponnese',
      geom: { clipTo: 'greece-main', poly: [[21.9, 38.45], [22.4, 38.38], [22.9, 38.1], [23.05, 37.93], [23.25, 37.85], [23.6, 37.6], [24.1, 37.55], [24.7, 37.95], [24.9, 38.3], [24.3, 38.95], [23.3, 39.1], [22.6, 39.05], [22.0, 38.85]] },
      label: { at: [22.55, 38.72], lines: ['Attica &', 'Central Greece'], cls: 'l-region' }
    },

    // ---------- Islands ----------
    {
      id: 'crete', key: true, name: 'Crete',
      kind: 'Island', alt: 'Kríti (Greek)',
      country: 'Greece', continent: 'Europe, by politics',
      stops: 'Heraklion and Knossos (Day 9)',
      teaser: 'The largest Greek island, a long mountain wall at the southern edge of the Aegean.',
      blurb: 'The largest Greek island, about 260 km long, with Psiloritis (Mount Ida) rising to 2,456 m. It sits on the sea lane between Greece, Anatolia, Egypt and the Levant, so its harbors have passed through more hands than almost any place on our route, from the Minoans to Venice and the Ottomans.',
      where: 'the long island at the southern edge of the Aegean',
      geom: { islandBox: [[23.3, 34.7], [26.5, 35.75]] },
      label: { at: [24.85, 35.28], lines: ['CRETE'], cls: 'l-region' }
    },
    {
      id: 'cyclades', key: true, name: 'Cyclades',
      kind: 'Island group', alt: 'From the Greek kyklos, "circle"',
      country: 'Greece', continent: 'Europe',
      stops: 'None on our route',
      teaser: 'Islands in a rough circle around the tiny holy island of Delos, in the middle of the Aegean.',
      blurb: 'Islands that form a rough circle around the tiny holy island of Delos, in the middle of the Aegean. Santorini, Mykonos and Naxos are Cycladic. Santorini\'s Bronze Age eruption matters to the story of Minoan Crete.',
      where: 'the ring of islands in the middle of the Aegean, around Delos',
      geom: { hull: [[24.15, 37.75], [24.7, 38.05], [25.1, 37.75], [25.6, 37.5], [26.05, 36.95], [25.95, 36.35], [25.45, 36.25], [24.3, 36.55], [24.2, 37.2]] },
      label: { at: [25.0, 36.9], lines: ['Cyclades'], cls: 'l-isles' }
    },
    {
      id: 'dodecanese', key: true, name: 'Dodecanese',
      kind: 'Island group', alt: '"Twelve islands"',
      country: 'Greece', continent: 'Europe, by politics',
      stops: 'Rhodes (Day 8)',
      teaser: 'Islands strung along the southwest coast of Turkey; Rhodes is the largest.',
      blurb: 'Islands strung along the southwest coast of Turkey; Rhodes is the largest, only about 18 km from the Turkish shore. Ruled by the Ottomans until 1912 and then by Italy, they joined Greece only in 1947, so their streets mix Ottoman, Italian and Greek layers.',
      where: 'the islands along Turkey\'s southwest coast, around Rhodes',
      geom: { hull: [[26.25, 37.38], [26.75, 37.45], [27.15, 37.05], [27.5, 36.75], [28.0, 36.75], [28.35, 36.3], [28.15, 35.85], [27.35, 35.35], [26.85, 35.25], [26.6, 35.55], [26.2, 36.4]] },
      label: { at: [27.2, 36.2], lines: ['Dodecanese'], cls: 'l-isles' }
    },
    {
      id: 'north-aegean', key: true, name: 'North Aegean Islands',
      kind: 'Island group', alt: 'Lemnos, Lesbos, Chios, Samos',
      country: 'Greece', continent: 'Europe, by politics',
      stops: 'Passed at sea',
      teaser: 'Large islands just off the Aegean coast of Turkey, such as Lesbos, Chios and Samos.',
      blurb: 'Large islands just off the Aegean coast of Turkey, such as Lemnos, Lesbos, Chios and Samos. Lesbos and Chios lie closer to Anatolia than to mainland Greece, a reminder that the Aegean joins its two shores more than it divides them.',
      where: 'the big islands off Turkey\'s Aegean coast: Lesbos, Chios and Samos',
      geom: { hull: [[24.85, 40.15], [25.6, 40.1], [26.65, 39.45], [26.55, 38.6], [27.15, 37.8], [26.85, 37.5], [26.0, 37.45], [25.85, 38.0], [25.6, 39.0], [24.8, 39.7]] },
      label: { at: [25.15, 38.62], lines: ['North Aegean', 'Islands'], cls: 'l-isles' }
    },
    {
      id: 'sporades', key: false, name: 'Sporades',
      kind: 'Island group', alt: '"Scattered" islands',
      country: 'Greece', continent: 'Europe',
      stops: 'Not on our route',
      teaser: 'Scattered islands off the mainland in the northwest Aegean, such as Skiathos and Skopelos.',
      blurb: 'Scattered islands off the Greek mainland in the northwest Aegean, such as Skiathos, Skopelos and Skyros.',
      geom: { hull: [[23.25, 39.35], [24.0, 39.42], [24.8, 38.95], [24.65, 38.65], [24.3, 38.72], [23.9, 39.0], [23.3, 39.05]] },
      label: { at: [23.95, 39.55], lines: ['Sporades'], cls: 'l-ctx' }
    },
    {
      id: 'saronic', key: false, name: 'Saronic Islands',
      kind: 'Island group', alt: 'Aegina, Salamis, Poros, Hydra',
      country: 'Greece', continent: 'Europe',
      stops: 'Salamis is visible from Piraeus',
      teaser: 'Islands in the gulf near Athens, such as Aegina and Salamis.',
      blurb: 'Islands in the Saronic Gulf near Athens, such as Aegina and Salamis. Salamis is visible from Piraeus, where our cruise ends.',
      geom: { hull: [[23.2, 37.99], [23.62, 37.99], [23.66, 37.6], [23.6, 37.22], [23.05, 37.18], [23.15, 37.55], [23.35, 37.85]] },
      label: { at: [23.4, 37.0], lines: ['Saronic Is.'], cls: 'l-ctx' }
    },
    {
      id: 'ionian-islands', key: false, name: 'Ionian Islands',
      kind: 'Island group', alt: 'Corfu, Lefkada, Kefalonia, Zakynthos',
      country: 'Greece', continent: 'Europe',
      stops: 'Not on our route',
      teaser: 'Islands on the west side of Greece, in the Ionian Sea, such as Corfu.',
      blurb: 'Islands on the west side of Greece, in the Ionian Sea, such as Corfu and Kefalonia. They are on the far side of Greece from our route, and we will not see them.',
      geom: { hull: [[19.4, 39.95], [20.2, 39.85], [20.9, 38.9], [21.1, 37.7], [20.85, 37.55], [20.4, 37.9], [19.9, 38.9], [19.35, 39.5]] },
      label: { at: [19.55, 38.85], lines: ['Ionian', 'Islands'], cls: 'l-ctx' }
    },

    // ---------- Context lands ----------
    {
      id: 'greece', key: false, name: 'Greece',
      kind: 'Country', alt: 'Elláda (Greek)',
      country: 'Greece', continent: 'Europe',
      stops: 'Rhodes, Heraklion, Athens, Piraeus, Delphi',
      teaser: 'A mainland plus roughly 6,000 islands and islets, a little over 200 of them inhabited.',
      blurb: 'A mountainous mainland plus roughly 6,000 islands and islets, only a little over 200 of them inhabited. Geographers sort the islands into groups, and the group names turn up on ferry schedules, museum labels and menus.',
      geom: { countryRest: 'Greece' }
    },
    {
      id: 'turkey', key: false, name: 'Turkey',
      kind: 'Country', alt: 'Türkiye (Turkish)',
      country: 'Turkey', continent: 'Asia and Europe',
      stops: 'Istanbul, Çanakkale, Kusadasi, Ephesus',
      teaser: 'A country on two continents: Anatolia in Asia and Thrace in Europe.',
      blurb: 'A country on two continents: Anatolia in Asia and Thrace in Europe. Two islands near Çanakkale, Gökçeada (Imbros) and Bozcaada (Tenedos), are Turkish, not Greek.',
      geom: { countryRest: 'Turkey' }
    },
    {
      id: 'cyprus', key: false, name: 'Cyprus',
      kind: 'Island', alt: 'Kýpros (Greek) · Kıbrıs (Turkish)',
      country: 'Cyprus', continent: 'Asia, by geography',
      stops: 'Not on our route',
      teaser: 'The third-largest island in the Mediterranean, south of Turkey.',
      blurb: 'The third-largest island in the Mediterranean, south of Turkey and west of the Levant. It has been part of the Eastern Mediterranean world in every era of this book.',
      geom: { countries: ['Cyprus', 'N. Cyprus'] },
      label: { at: [33.15, 35.05], lines: ['Cyprus'], cls: 'l-ctx' }
    },
    {
      id: 'levant', key: false, name: 'The Levant',
      kind: 'Region', alt: 'From the French for "rising," the direction of sunrise',
      country: 'Syria, Lebanon, Israel, Palestine', continent: 'Asia',
      stops: 'Not on our route',
      teaser: 'The eastern shore of the Mediterranean: the coasts of Syria, Lebanon, Israel and Palestine.',
      blurb: 'The eastern shore of the Mediterranean: the coasts of Syria, Lebanon, Israel and Palestine. Like Anatolia, its name points toward the sunrise.',
      geom: { countries: ['Syria', 'Lebanon', 'Israel', 'Palestine'] },
      label: { at: [36.55, 33.7], lines: ['THE LEVANT'], cls: 'l-ctx' }
    },
    {
      id: 'egypt', key: false, name: 'Egypt',
      kind: 'Country', alt: 'Miṣr (Arabic)',
      country: 'Egypt', continent: 'Africa',
      stops: 'Not on our route',
      teaser: 'The African shore of the Eastern Mediterranean.',
      blurb: 'The African shore of the Eastern Mediterranean. Its Nile grain fed Rome and, later, Constantinople, which is one reason Crete and Rhodes sat on such busy sea lanes.',
      geom: { countries: ['Egypt'] },
      label: { at: [30.9, 30.85], lines: ['EGYPT'], cls: 'l-ctx' }
    }
  ];

  // Labels that belong to no clickable region
  const EXTRA_LABELS = [
    { at: [21.55, 39.78], lines: ['GREECE'], cls: 'l-country' },
    { at: [35.4, 39.75], lines: ['TURKEY'], cls: 'l-country' },
    { at: [21.6, 41.85], lines: ['EUROPE'], cls: 'l-continent' },
    { at: [37.2, 37.9], lines: ['ASIA'], cls: 'l-continent' },
    { at: [27.4, 30.95], lines: ['AFRICA'], cls: 'l-continent' }
  ];

  const BY_ID = new Map(REGIONS.map(r => [r.id, r]));
  // Names that read better with "the" in a sentence ("That is the Aegean Sea")
  const WITH_THE = new Set(['eastern-med', 'aegean', 'bosphorus', 'dardanelles', 'black-sea', 'marmara', 'ionian-sea',
    'cyclades', 'dodecanese', 'north-aegean', 'sporades', 'saronic', 'ionian-islands']);
  const theName = r => (WITH_THE.has(r.id) ? 'the ' : '') + r.name;
  const KEY_IDS = REGIONS.filter(r => r.key).map(r => r.id);

  // ------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------
  const state = {
    mode: 'explore',               // 'explore' | 'find'
    explored: new Set(),
    exploreDone: false,
    find: null,                    // { order, idx, attempts, firstTry, results, locked }
    hoverId: null, hoverStart: 0,
    selectedId: null,
    transform: d3.zoomIdentity
  };
  const events = [];
  const t0 = Date.now();

  // ------------------------------------------------------------------
  // DOM handles
  // ------------------------------------------------------------------
  const $ = id => document.getElementById(id);
  const wrap = $('map-wrap');
  const svg = d3.select('#map');
  const infobox = $('infobox');
  const toastEl = $('toast');

  let world = null;          // GeoJSON FeatureCollection
  let shapes = null;         // per-region geometry, built once from the data
  let projection, path, zoom;
  let gZoom, gLabels;
  let labelScale = 1;   // labels shrink a little on narrow screens

  // ------------------------------------------------------------------
  // Geometry helpers
  // ------------------------------------------------------------------
  // d3-geo treats a ring's winding as meaningful; make every hand-drawn
  // polygon wind so that it covers the small area, not the rest of the globe.
  function polygon(coords) {
    const ring = coords.slice();
    const a = ring[0], b = ring[ring.length - 1];
    if (a[0] !== b[0] || a[1] !== b[1]) ring.push(a);
    let f = { type: 'Polygon', coordinates: [ring] };
    if (d3.geoArea(f) > 2 * Math.PI) f = { type: 'Polygon', coordinates: [ring.slice().reverse()] };
    return f;
  }
  function partsOf(feature) {
    const g = feature.geometry;
    if (!g) return [];
    if (g.type === 'Polygon') return [{ type: 'Polygon', coordinates: g.coordinates }];
    if (g.type === 'MultiPolygon') return g.coordinates.map(c => ({ type: 'Polygon', coordinates: c }));
    return [];
  }
  function inBox(pt, box) {
    return pt[0] >= box[0][0] && pt[0] <= box[1][0] && pt[1] >= box[0][1] && pt[1] <= box[1][1];
  }
  // Uses the raw coordinates, not d3.geoBounds: a few tiny island rings in the
  // data (the Maldives, for one) are wound inside-out, which d3 reads as
  // "the whole globe" and would paint over the sea.
  function intersectsView(feature) {
    let x0 = 180, y0 = 90, x1 = -180, y1 = -90;
    partsOf(feature).forEach(p => p.coordinates[0].forEach(([x, y]) => {
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }));
    if (x1 - x0 > 180) return false;   // spans the antimeridian (Russia, Fiji): far from this map
    return !(x1 < VIEW.west - 8 || x0 > VIEW.east + 8 || y1 < VIEW.south - 6 || y0 > VIEW.north + 6);
  }

  // Sort every polygon in the data into the region it belongs to
  function buildShapes() {
    const byName = new Map(world.features.map(f => [f.properties.name, f]));
    const s = {
      other: [],                              // neutral land, no info
      land: new Map(),                        // regionId -> [Polygon] drawn as land
      clip: new Map(),                        // clip name -> [Polygon]
      hulls: [], seas: [], straits: [], overlays: []
    };
    const addLand = (id, p) => { if (!s.land.has(id)) s.land.set(id, []); s.land.get(id).push(p); };
    const addClip = (name, p) => { if (!s.clip.has(name)) s.clip.set(name, []); s.clip.get(name).push(p); };

    const hullRegions = REGIONS.filter(r => r.geom.hull).map(r => ({ r, f: polygon(r.geom.hull) }));
    const countryOwners = new Map();
    REGIONS.forEach(r => (r.geom.countries || []).forEach(n => countryOwners.set(n, r.id)));

    world.features.forEach(f => {
      const name = f.properties.name;
      if (name === 'Greece') {
        partsOf(f).forEach(p => {
          const c = d3.geoCentroid(p);
          if (d3.geoContains(p, [22.0, 39.5]) || d3.geoContains(p, [23.75, 38.6])) {
            addLand('greece', p); addClip('greece-main', p); return;   // mainland, Euboea
          }
          if (inBox(c, BY_ID.get('crete').geom.islandBox)) { addLand('crete', p); return; }
          const h = hullRegions.find(h => d3.geoContains(h.f, c));
          addLand(h ? h.r.id : 'greece', p);
        });
      } else if (name === 'Turkey') {
        partsOf(f).forEach(p => {
          if (d3.geoContains(p, BY_ID.get('anatolia').geom.contains)) { addLand('anatolia', p); addClip('anatolia', p); }
          else if (d3.geoContains(p, BY_ID.get('thrace').geom.contains)) addLand('thrace', p);
          else addLand('turkey', p);   // small Turkish islands such as Gökçeada
        });
      } else if (countryOwners.has(name)) {
        partsOf(f).forEach(p => addLand(countryOwners.get(name), p));
      } else if (intersectsView(f)) {
        s.other.push(f);
      }
    });

    REGIONS.forEach(r => {
      if (r.geom.sea) s.seas.push({ id: r.id, f: polygon(r.geom.sea) });
      if (r.geom.hull) s.hulls.push({ id: r.id, f: polygon(r.geom.hull) });
      if (r.geom.strait) s.straits.push({ id: r.id, f: { type: 'LineString', coordinates: r.geom.strait } });
      if (r.geom.poly) s.overlays.push({ id: r.id, clipTo: r.geom.clipTo, f: polygon(r.geom.poly) });
    });
    ['Syria', 'Lebanon', 'Israel', 'Palestine', 'Egypt', 'Cyprus', 'N. Cyprus'].forEach(n => {
      if (!byName.has(n)) console.warn('[' + SIM_ID + '] country not found in data:', n);
    });
    return s;
  }

  // ------------------------------------------------------------------
  // Rendering
  // ------------------------------------------------------------------
  function layerFor(id) {
    const r = BY_ID.get(id);
    return r && r.country === 'Greece' ? 'gr' : (r && r.country === 'Turkey' ? 'tr' : 'ctx');
  }

  function render() {
    const W = wrap.clientWidth, H = wrap.clientHeight;
    labelScale = Math.max(0.7, Math.min(1, W / 700));
    svg.attr('viewBox', [0, 0, W, H]);
    svg.selectAll('*').remove();

    // Fit a conic projection to the viewing box (sampled along its edges)
    const edge = [];
    for (let i = 0; i <= 10; i++) {
      const lon = VIEW.west + (VIEW.east - VIEW.west) * i / 10;
      const lat = VIEW.south + (VIEW.north - VIEW.south) * i / 10;
      edge.push([lon, VIEW.south], [lon, VIEW.north], [VIEW.west, lat], [VIEW.east, lat]);
    }
    projection = d3.geoConicConformal().parallels([34, 41]).rotate([-28.2, 0])
      .fitExtent([[6, 6], [W - 6, H - 6]], { type: 'MultiPoint', coordinates: edge })
      .clipExtent([[-40, -40], [W + 40, H + 40]]);
    path = d3.geoPath(projection);

    const defs = svg.append('defs');
    shapes.clip.forEach((polys, name) => {
      defs.append('clipPath').attr('id', 'clip-' + name)
        .append('path').attr('d', path({ type: 'GeometryCollection', geometries: polys }));
    });

    gZoom = svg.append('g').attr('class', 'zoom-layer');
    const gSea = gZoom.append('g');
    gZoom.append('path').attr('class', 'graticule')
      .attr('d', path(d3.geoGraticule().step([2, 2]).extent([[10, 26], [46, 48]])()));
    const gHull = gZoom.append('g');
    const gLand = gZoom.append('g');
    const gOver = gZoom.append('g');
    const gIsles = gZoom.append('g');
    const gStrait = gZoom.append('g');

    // Seas, larger first so the smaller seas sit on top
    shapes.seas.forEach(s => addShape(gSea.append('path').attr('class', 'sea').attr('d', path(s.f)), s.id, true));

    // Island-group outlines
    shapes.hulls.forEach(h => {
      const r = BY_ID.get(h.id);
      addShape(gHull.append('path').attr('class', 'hull' + (r.key ? '' : ' ctx')).attr('d', path(h.f)), h.id, true);
    });

    // Neutral land
    gLand.selectAll('path.other').data(shapes.other).join('path')
      .attr('class', 'land other').attr('d', path);

    // Land that belongs to a region (islands of a group are drawn above the overlays)
    shapes.land.forEach((polys, id) => {
      const r = BY_ID.get(id);
      const isGroupIsle = !!r.geom.hull;
      const g = isGroupIsle ? gIsles : gLand;
      const cls = 'land ' + layerFor(id) + (r.key ? ' region' : '');
      addShape(g.append('path').attr('class', cls)
        .attr('d', path({ type: 'GeometryCollection', geometries: polys })), id, !isGroupIsle);
    });

    // Historic regions carved out of a country, clipped to its coastline
    shapes.overlays.forEach(o => {
      addShape(gOver.append('path').attr('class', 'overlay ' + layerFor(o.id))
        .attr('clip-path', 'url(#clip-' + o.clipTo + ')').attr('d', path(o.f)), o.id, true);
    });

    // Straits: a visible dashed line plus a wide invisible hit stroke
    shapes.straits.forEach(s => {
      addShape(gStrait.append('path').attr('class', 'strait-line').attr('d', path(s.f)), s.id, false);
      addShape(gStrait.append('path').attr('class', 'strait-hit').attr('d', path(s.f)), s.id, true);
    });

    // Labels live outside the zoom group so they keep a constant size
    gLabels = svg.append('g').attr('class', 'labels' + (state.mode === 'find' ? ' find-mode' : ''));
    REGIONS.filter(r => r.label).forEach(r => addLabel(r.label, r));
    EXTRA_LABELS.forEach(l => addLabel(l, null));

    // Zoom and pan: buttons, drag and pinch. The wheel is left to the page.
    zoom = d3.zoom().scaleExtent([1, 8]).translateExtent([[0, 0], [W, H]])
      .clickDistance(5)
      .filter(ev => (ev.type !== 'wheel' && ev.type !== 'dblclick') && !ev.button)
      .on('start', () => svg.classed('dragging', true))
      .on('zoom', ev => { state.transform = ev.transform; gZoom.attr('transform', ev.transform); placeLabels(); })
      .on('end', () => svg.classed('dragging', false));
    svg.call(zoom).on('dblclick.zoom', null);
    svg.call(zoom.transform, state.transform);

    refreshClasses();
  }

  function bindRegion(sel, id) {
    return sel.on('pointerenter', ev => onEnter(id, ev))
      .on('pointermove', ev => moveInfobox(ev))
      .on('pointerleave', ev => onLeave(id, ev))
      .on('click', ev => onClick(id, ev));
  }

  function addShape(sel, id, interactive) {
    sel.attr('data-id', id);
    if (!interactive) return sel;
    const r = BY_ID.get(id);
    bindRegion(sel, id);
    // One focusable element per region for keyboard users
    if (!sel.node().ownerSVGElement.querySelector('[data-id="' + id + '"][tabindex]')) {
      sel.attr('tabindex', 0).attr('role', 'button')
        .attr('aria-label', r.key ? r.name + ' (key region)' : r.name)
        .on('keydown', ev => {
          if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onClick(id, ev, sel.node()); }
        })
        .on('focus', () => { if (state.mode === 'explore') showInfobox(id, null, sel.node()); })
        .on('blur', () => hideInfobox());
    }
    return sel;
  }

  function addLabel(l, r) {
    const g = gLabels.append('g').datum({ at: l.at, leader: l.leader });
    if (r && r.key) g.classed('key-label', true);
    if (l.leader) {
      gLabels.insert('line', ':first-child').attr('class', 'leader' + (r && r.key ? ' key-leader' : ''))
        .datum({ at: l.at, leader: l.leader });
    }
    const lineH = l.cls === 'l-country' ? 17 : 13;
    const n = l.lines.length;
    l.lines.forEach((txt, i) => {
      const t = g.append('text').attr('class', l.cls).attr('y', (i - (n - 1) / 2) * lineH).attr('dy', '0.35em');
      if (r && r.key && i === 0) t.append('tspan').attr('class', 'check').attr('data-check', r.id).text('✓ ');
      t.append('tspan').text(txt);
    });
    // A label belongs to its region: clicking or hovering the words works the
    // same as the shape. Without this, a click on a label that sits over
    // water (such as "Bosphorus") falls through to the sea underneath.
    if (r) {
      const b = g.node().getBBox(), pad = 4;
      bindRegion(g.insert('rect', ':first-child').attr('class', 'label-hit')
        .attr('x', b.x - pad).attr('y', b.y - pad)
        .attr('width', b.width + 2 * pad).attr('height', b.height + 2 * pad), r.id);
    }
  }

  function placeLabels() {
    const t = state.transform;
    gLabels.selectAll('g').attr('transform', d => {
      const p = t.apply(projection(d.at));
      return 'translate(' + p[0] + ',' + p[1] + ') scale(' + labelScale + ')';
    });
    gLabels.selectAll('line.leader').each(function (d) {
      const a = t.apply(projection(d.at)), b = t.apply(projection(d.leader));
      // start the leader at the near edge of the label rather than its center
      const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
      const off = Math.min(len * 0.45, 30);
      d3.select(this).attr('x1', a[0] + dx / len * off).attr('y1', a[1] + dy / len * (off * 0.4))
        .attr('x2', b[0]).attr('y2', b[1]);
    });
  }

  function els(id) { return svg.selectAll('[data-id="' + id + '"]'); }

  function refreshClasses() {
    svg.selectAll('[data-id]').each(function () {
      const id = this.getAttribute('data-id');
      const done = state.mode === 'explore' ? state.explored.has(id) : !!(state.find && state.find.results[id]);
      this.classList.toggle('explored', done);
      this.classList.toggle('hover', id === state.hoverId);
    });
    if (gLabels) {
      gLabels.attr('class', 'labels' + (state.mode === 'find' ? ' find-mode' : ''));
      gLabels.selectAll('tspan.check').style('display', function () {
        return state.explored.has(this.getAttribute('data-check')) ? null : 'none';
      });
    }
    placeLabels();
  }

  // ------------------------------------------------------------------
  // Hover
  // ------------------------------------------------------------------
  let leaveTimer = null;
  function onEnter(id, ev) {
    clearTimeout(leaveTimer);
    if (state.hoverId !== id) {
      endHover();
      state.hoverId = id; state.hoverStart = performance.now();
      els(id).classed('hover', true);
    }
    if (ev.pointerType !== 'touch') showInfobox(id, ev);
  }
  function onLeave(id) {
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => { if (state.hoverId === id) { endHover(); hideInfobox(); } }, 40);
  }
  function endHover() {
    if (!state.hoverId) return;
    const id = state.hoverId, ms = performance.now() - state.hoverStart;
    els(id).classed('hover', false);
    state.hoverId = null;
    if (ms >= HOVER_MIN_MS && state.mode === 'explore') {
      emit('experienced', id, { duration: isoDuration(ms) }, 'Hovered ' + (ms / 1000).toFixed(1) + ' s');
    }
  }

  function showInfobox(id, ev, el) {
    const r = BY_ID.get(id);
    if (state.mode === 'find') {
      infobox.className = 'mystery';
      infobox.innerHTML = '<div class="ib-kind">Find the Region</div><div class="ib-text">Is this <b>' +
        esc(currentTarget().name) + '</b>? Click to answer.</div>';
    } else {
      const done = state.explored.has(id);
      infobox.className = done ? 'done' : '';
      infobox.innerHTML =
        '<div class="ib-kind">' + esc(r.kind) + (r.country && r.kind !== 'Country' ? ' · ' + esc(r.country) : '') + '</div>' +
        '<div class="ib-name">' + esc(r.name) + '</div>' +
        (r.alt ? '<div class="ib-alt">' + esc(r.alt) + '</div>' : '') +
        '<div class="ib-text">' + esc(r.teaser) + '</div>' +
        '<div class="ib-stops"><b>Our stops:</b> ' + esc(r.stops) + '</div>' +
        '<div class="ib-cta">' + (r.key ? (done ? '✓ Explored' : 'Click to explore this key region') : 'Click for details (extra, not on the checklist)') + '</div>';
    }
    infobox.classList.add('show');
    if (ev) moveInfobox(ev);
    else if (el) {
      const b = el.getBoundingClientRect(), w = wrap.getBoundingClientRect();
      positionInfobox(b.left - w.left + b.width / 2, b.top - w.top + b.height / 2);
    }
  }
  function moveInfobox(ev) {
    if (!infobox.classList.contains('show')) return;
    const w = wrap.getBoundingClientRect();
    positionInfobox(ev.clientX - w.left, ev.clientY - w.top);
  }
  function positionInfobox(x, y) {
    const W = wrap.clientWidth, H = wrap.clientHeight;
    const bw = infobox.offsetWidth, bh = infobox.offsetHeight, gap = 16;
    let left = x + gap, top = y + gap;
    if (left + bw > W - 6) left = x - bw - gap;
    if (top + bh > H - 6) top = y - bh - gap;
    infobox.style.left = Math.max(6, left) + 'px';
    infobox.style.top = Math.max(6, top) + 'px';
  }
  function hideInfobox() { infobox.classList.remove('show'); }

  // ------------------------------------------------------------------
  // Clicks: explore and find
  // ------------------------------------------------------------------
  function onClick(id, ev, el) {
    if (ev && ev.defaultPrevented && ev.type === 'click') return;   // the end of a drag
    const pt = clickPoint(ev, el);
    if (state.mode === 'find') return answer(id, pt);

    const r = BY_ID.get(id);
    state.selectedId = id;
    showDetail(id);
    if (ev && ev.pointerType === 'touch') { showInfobox(id, null, el || ev.target); setTimeout(hideInfobox, 2500); }
    if (!r.key) {
      emit('interacted', id, null, 'Opened details (extra)');
      toast(cap(theName(r)) + ' is extra context, not on the checklist.');
      return;
    }
    const first = !state.explored.has(id);
    emit('interacted', id, { extensions: ext({ firstVisit: first, explored: state.explored.size + (first ? 1 : 0) }) },
      first ? 'Explored (' + (state.explored.size + 1) + ' of ' + KEY_IDS.length + ')' : 'Revisited');
    if (!first) return;

    state.explored.add(id);
    els(id).classed('flash-ok', true);
    setTimeout(() => els(id).classed('flash-ok', false), 900);
    refreshClasses(); updateProgress(); renderChecklist();
    burst(pt, 46);
    const left = KEY_IDS.length - state.explored.size;
    toast('✓ ' + r.name + ': ' + state.explored.size + ' of ' + KEY_IDS.length + ' explored' +
      (left ? '' : '. All done!'), 'ok');
    showInfobox(id, ev && ev.clientX ? ev : null, el);
    if (!left && !state.exploreDone) {
      state.exploreDone = true;
      emit('completed', 'explore', { completion: true, extensions: ext({ explored: KEY_IDS.length }) }, 'Explored all ' + KEY_IDS.length);
      setTimeout(() => { cannon(); celebrate('explore'); }, 350);
    }
  }

  function clickPoint(ev, el) {
    const w = wrap.getBoundingClientRect();
    if (ev && ev.clientX) return [ev.clientX - w.left, ev.clientY - w.top];
    const b = (el || (ev && ev.target)).getBoundingClientRect();
    return [b.left - w.left + b.width / 2, b.top - w.top + b.height / 2];
  }

  function startFind() {
    const order = d3.shuffle(KEY_IDS.slice());
    state.find = { order, idx: 0, attempts: 0, firstTry: 0, results: {}, locked: false };
    $('find-card').hidden = false;
    emit('initialized', 'find', null, 'Find challenge started');
    nextQuestion();
  }
  function currentTarget() { return BY_ID.get(state.find.order[state.find.idx]); }
  function nextQuestion() {
    const f = state.find;
    svg.selectAll('.reveal').classed('reveal', false);
    if (f.idx >= f.order.length) return finishFind();
    f.attempts = 0; f.locked = false;
    $('fc-q').textContent = 'Question ' + (f.idx + 1) + ' of ' + f.order.length;
    $('fc-target').textContent = currentTarget().name;
    setFindMsg('Click it on the map. Names of key regions are hidden.', '');
    $('fc-skip').textContent = 'Show me';
    renderChecklist(); updateProgress();
  }
  function answer(id, pt) {
    const f = state.find;
    if (!f || f.locked) return;
    const target = currentTarget(), r = BY_ID.get(id);
    f.attempts++;
    const correct = id === target.id;
    emit('answered', target.id, {
      success: correct, response: id,
      extensions: ext({ attempt: f.attempts, question: f.idx + 1 })
    }, (correct ? 'Correct' : 'Chose ' + r.name) + ' (try ' + f.attempts + ')');

    if (correct) {
      const firstTry = f.attempts === 1;
      if (firstTry) f.firstTry++;
      f.results[target.id] = firstTry ? 'first' : 'later';
      f.locked = true;
      els(id).classed('flash-ok', true);
      setTimeout(() => els(id).classed('flash-ok', false), 900);
      refreshClasses();
      burst(pt, firstTry ? 60 : 30);
      setFindMsg((firstTry ? 'Correct on the first try! ' : 'Correct. ') + 'That is ' + theName(target) + '.', 'ok');
      toast('✓ ' + target.name, 'ok');
      showDetail(target.id);
      setTimeout(() => { f.idx++; nextQuestion(); }, 1300);
    } else {
      els(id).classed('flash-bad', true);
      setTimeout(() => els(id).classed('flash-bad', false), 900);
      if (f.attempts >= 2) {
        els(target.id).classed('reveal', true);
        setFindMsg('That is ' + theName(r) + '. ' + cap(theName(target)) + ' is flashing yellow; click it to continue.', 'bad');
      } else {
        setFindMsg('That is ' + theName(r) + '. Hint: look for ' + target.where + '.', 'bad');
      }
      toast('That is ' + theName(r), 'bad');
    }
  }
  function skipOrReveal() {
    const f = state.find;
    if (!f || f.locked) return;
    const target = currentTarget();
    if (f.attempts >= 2 || svg.select('.reveal').size()) return;
    f.attempts = 2;   // a revealed answer cannot score as a first try
    emit('asked', target.id, { extensions: ext({ question: f.idx + 1 }) }, 'Asked to be shown');
    els(target.id).classed('reveal', true);
    zoomTo(target.id, 2.2);
    setFindMsg(cap(theName(target)) + ' is flashing yellow. Click it to continue.', 'bad');
  }
  function finishFind() {
    const f = state.find, n = f.order.length;
    $('find-card').hidden = true;
    emit('completed', 'find', {
      completion: true, success: f.firstTry >= Math.ceil(n * 0.75),
      score: { raw: f.firstTry, min: 0, max: n, scaled: +(f.firstTry / n).toFixed(2) }
    }, 'First try ' + f.firstTry + ' of ' + n);
    updateProgress();
    cannon();
    celebrate('find');
  }
  function setFindMsg(text, cls) {
    const m = $('fc-msg'); m.textContent = text; m.className = 'fc-msg ' + (cls || '');
  }

  // ------------------------------------------------------------------
  // Panel: details, checklist, events
  // ------------------------------------------------------------------
  function showDetail(id) {
    const r = BY_ID.get(id);
    const done = state.explored.has(id);
    const badge = r.key ? (done ? '<span class="badge">✓ Explored</span>' : '') : '<span class="badge ctx">Extra</span>';
    $('detail').innerHTML =
      '<div class="d-kind">' + esc(r.kind) + '</div>' +
      '<h2>' + esc(r.name) + badge + '</h2>' +
      (r.alt ? '<div class="d-alt">' + esc(r.alt) + '</div>' : '') +
      '<p>' + esc(r.blurb) + '</p>' +
      '<dl><dt>Modern country</dt><dd>' + esc(r.country) + '</dd>' +
      '<dt>Continent</dt><dd>' + esc(r.continent) + '</dd>' +
      '<dt>Our stops</dt><dd>' + esc(r.stops) + '</dd></dl>';
  }
  function introDetail() {
    $('detail').innerHTML = state.mode === 'explore'
      ? '<div class="d-kind">How to use this map</div><h2>Explore the regions</h2>' +
        '<p class="d-hint"><b>Hover</b> over the map to preview a region, sea or strait. <b>Click</b> to explore it. ' +
        'Explore all <b>12 key regions</b> on the checklist to finish. Stuck? Click a name on the checklist and the map shows where it is (no credit until you click the map).</p>' +
        '<p class="d-hint">Drag to pan; use <b>+</b> and <b>&minus;</b> to zoom in on the islands. Then try <b>Find the Region</b>.</p>'
      : '<div class="d-kind">Find the Region</div><h2>Test yourself</h2>' +
        '<p class="d-hint">The names of the 12 key regions are hidden. Click the region named in the card. ' +
        'A wrong click names what you chose and gives a hint; after two misses the answer flashes.</p>' +
        '<p class="d-hint">On the list, <b>green</b> means found on the first try and <b>red</b> means it needed a hint.</p>';
  }

  function renderChecklist() {
    const pane = $('pane-list');
    pane.innerHTML = '';
    if (state.mode === 'explore') {
      KEY_IDS.forEach(id => {
        const r = BY_ID.get(id), done = state.explored.has(id);
        const b = document.createElement('button');
        b.className = 'chip' + (done ? ' done' : '');
        b.innerHTML = '<span class="box">' + (done ? '✓' : '') + '</span>' + esc(shortName(r));
        b.title = done ? r.name + ': explored' : 'Show me ' + r.name;
        b.addEventListener('click', () => showMe(id));
        pane.appendChild(b);
      });
    } else {
      const f = state.find;
      (f ? f.order : KEY_IDS).forEach((id, i) => {
        const res = f && f.results[id];
        const b = document.createElement('button');
        b.className = 'chip ' + (res === 'first' ? 'done' : res === 'later' ? 'miss' : 'pending');
        b.disabled = !res;
        b.innerHTML = '<span class="box">' + (res === 'first' ? '✓' : res === 'later' ? '•' : '') + '</span>' +
          (res ? esc(shortName(BY_ID.get(id))) : 'Question ' + (i + 1));
        if (res) b.addEventListener('click', () => showDetail(id));
        pane.appendChild(b);
      });
    }
  }
  function shortName(r) {
    return { thrace: 'Thrace', attica: 'Attica & C. Greece', 'eastern-med': 'E. Mediterranean', 'north-aegean': 'N. Aegean Islands' }[r.id] || r.name;
  }

  function showMe(id) {
    emit('asked', id, null, 'Show me (checklist)');
    zoomTo(id, 2.2);
    els(id).classed('pulse', false);
    setTimeout(() => {
      els(id).classed('pulse', true);
      setTimeout(() => els(id).classed('pulse', false), 2500);
    }, 60);
    toast('Here is ' + theName(BY_ID.get(id)) + '. Click it on the map to explore it.');
  }

  function updateProgress() {
    let text, frac;
    if (state.mode === 'explore') {
      text = 'Explored ' + state.explored.size + ' of ' + KEY_IDS.length;
      frac = state.explored.size / KEY_IDS.length;
    } else {
      const f = state.find, done = f ? Object.keys(f.results).length : 0;
      text = 'Found ' + done + ' of ' + KEY_IDS.length + ' · First try ' + (f ? f.firstTry : 0);
      frac = done / KEY_IDS.length;
    }
    $('progress-text').textContent = text;
    $('progress-fill').style.width = (frac * 100).toFixed(1) + '%';
  }

  // ------------------------------------------------------------------
  // Zoom helpers
  // ------------------------------------------------------------------
  function zoomTo(id, maxK) {
    const nodes = els(id).nodes();
    if (!nodes.length) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    nodes.forEach(n => {
      const b = n.getBBox();
      x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
    });
    const W = wrap.clientWidth, H = wrap.clientHeight;
    const k = Math.max(1, Math.min(maxK || 3, 0.55 / Math.max((x1 - x0) / W, (y1 - y0) / H)));
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    svg.transition().duration(700)
      .call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(k).translate(-cx, -cy));
  }

  // ------------------------------------------------------------------
  // Feedback: toast, confetti, celebration card
  // ------------------------------------------------------------------
  let toastTimer = null;
  function toast(text, kind) {
    toastEl.textContent = text;
    toastEl.className = 'show ' + (kind || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.className = kind || ''; }, 2600);
  }

  function burst(pt, count) {
    if (typeof confetti !== 'function' || !pt) return;
    confetti({
      particleCount: count, spread: 60, startVelocity: 24, ticks: 120, gravity: 0.9, scalar: 0.75,
      origin: { x: pt[0] / window.innerWidth, y: (pt[1] + wrap.offsetTop) / window.innerHeight },
      colors: CONFETTI_COLORS, disableForReducedMotion: true
    });
  }

  // The confetti cannon: two corner cannons and a center burst
  function cannon() {
    if (typeof confetti !== 'function') return;
    const end = Date.now() + 1400;
    const base = { colors: CONFETTI_COLORS, disableForReducedMotion: true, zIndex: 50 };
    confetti(Object.assign({ particleCount: 140, spread: 100, startVelocity: 48, origin: { x: 0.5, y: 0.75 } }, base));
    (function frame() {
      confetti(Object.assign({ particleCount: 7, angle: 60, spread: 55, startVelocity: 62, origin: { x: 0, y: 0.95 } }, base));
      confetti(Object.assign({ particleCount: 7, angle: 120, spread: 55, startVelocity: 62, origin: { x: 1, y: 0.95 } }, base));
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  function celebrate(kind) {
    const f = state.find;
    if (kind === 'explore') {
      $('cb-title').textContent = 'You explored all 12 key regions';
      $('cb-body').innerHTML = 'You can now point to Thrace and Anatolia, Ionia and Attica, the three island groups, Crete, ' +
        'the two straits and the two seas of our route. Ready to find them with the names hidden?';
      $('cb-primary').textContent = 'Try the Find challenge';
      $('cb-secondary').textContent = 'Keep exploring';
    } else {
      const n = f.order.length;
      $('cb-title').textContent = f.firstTry === n ? 'A perfect map: ' + n + ' of ' + n : 'You found all ' + n + ' regions';
      $('cb-body').innerHTML = 'You found <b>' + f.firstTry + ' of ' + n + '</b> on the first try. ' +
        (f.firstTry >= Math.ceil(n * 0.75) ? 'That is a traveler who can place any stop on the map.'
          : 'Explore the red ones on the list again, then try once more.');
      $('cb-primary').textContent = 'Play again';
      $('cb-secondary').textContent = 'Back to Explore';
    }
    $('celebrate').hidden = false;
    $('celebrate').dataset.kind = kind;
  }

  // ------------------------------------------------------------------
  // Learning events: xAPI-shaped statements
  // ------------------------------------------------------------------
  const VERB_IRI = {
    initialized: 'http://adlnet.gov/expapi/verbs/initialized',
    experienced: 'http://adlnet.gov/expapi/verbs/experienced',
    interacted: 'http://adlnet.gov/expapi/verbs/interacted',
    answered: 'http://adlnet.gov/expapi/verbs/answered',
    asked: 'http://adlnet.gov/expapi/verbs/asked',
    completed: 'http://adlnet.gov/expapi/verbs/completed'
  };
  const EXT = 'https://dmccreary.github.io/mediterranean-travels/xapi/ext/';
  function ext(o) {
    const out = {};
    Object.keys(o).forEach(k => { out[EXT + k] = o[k]; });
    return out;
  }
  function objectFor(objId) {
    const r = BY_ID.get(objId);
    const name = r ? r.name : objId === 'find' ? 'Find the Region challenge' : objId === 'explore' ? 'Explore all key regions' : 'Regions of the Eastern Mediterranean Map';
    return {
      id: SIM_URL + (objId === 'sim' ? '' : '#' + objId),
      definition: { name: { 'en-US': name }, type: r ? 'http://adlnet.gov/expapi/activities/interaction' : 'http://adlnet.gov/expapi/activities/simulation' }
    };
  }
  function emit(verb, objId, result, summary) {
    const stmt = {
      id: uuid(),
      timestamp: new Date().toISOString(),
      actor: { objectType: 'Agent', account: { homePage: SIM_URL, name: 'anonymous' } },
      verb: { id: VERB_IRI[verb], display: { 'en-US': verb } },
      object: objectFor(objId),
      context: {
        contextActivities: { parent: [{ id: SIM_URL }] },
        extensions: ext({ mode: state.mode })
      }
    };
    if (result) stmt.result = result;
    events.push({ stmt, summary, verb, objId, ms: Date.now() - t0 });
    // Hand-offs for a future Learning Record Store; none of these is required to run
    try { window.dispatchEvent(new CustomEvent('microsim:xapi', { detail: stmt })); } catch (e) { /* old browser */ }
    if (window.parent !== window) window.parent.postMessage({ type: 'microsim-xapi', simId: SIM_ID, statement: stmt }, '*');
    renderEvents();
  }
  window.MicroSimEvents = { simId: SIM_ID, statements: () => events.map(e => e.stmt) };
  // Test hook: screen position of a [lon, lat] point at the current zoom
  window.MicroSimEvents.project = lonlat => state.transform.apply(projection(lonlat));

  function renderEvents() {
    $('ev-count').textContent = events.length;
    const list = $('ev-list');
    if (!events.length) { list.innerHTML = '<li class="empty">No events yet. Hover over or click the map.</li>'; return; }
    list.innerHTML = events.slice(-150).reverse().map(e => {
      const r = e.stmt.result || {};
      const mark = r.success === true ? ' <span class="ok">✓</span>' : r.success === false ? ' <span class="no">✗</span>' : '';
      const s = Math.round(e.ms / 1000);
      return '<li><span class="t">' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + '</span>' +
        '<span class="v ' + e.verb + '">' + e.verb + '</span>' +
        '<span>' + esc(e.stmt.object.definition.name['en-US']) + ': ' + esc(e.summary || '') + mark + '</span></li>';
    }).join('');
  }

  // ------------------------------------------------------------------
  // Modes, reset and controls
  // ------------------------------------------------------------------
  function setMode(mode) {
    if (state.mode === mode) return;
    endHover(); hideInfobox();
    state.mode = mode;
    $('mode-explore').classList.toggle('on', mode === 'explore');
    $('mode-find').classList.toggle('on', mode === 'find');
    $('mode-explore').setAttribute('aria-selected', mode === 'explore');
    $('mode-find').setAttribute('aria-selected', mode === 'find');
    $('celebrate').hidden = true;
    svg.selectAll('.reveal').classed('reveal', false);
    emit('interacted', 'sim', { extensions: ext({ newMode: mode }) }, 'Switched to ' + (mode === 'find' ? 'Find the Region' : 'Explore'));
    if (mode === 'find') startFind();
    else { $('find-card').hidden = true; state.find = null; }
    introDetail(); renderChecklist(); updateProgress(); refreshClasses();
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
  }
  function resetAll() {
    endHover(); hideInfobox();
    state.explored.clear(); state.exploreDone = false; state.selectedId = null;
    $('celebrate').hidden = true;
    svg.selectAll('.reveal, .pulse').classed('reveal', false).classed('pulse', false);
    if (state.mode === 'find') startFind();
    introDetail(); renderChecklist(); updateProgress(); refreshClasses();
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    toast('Progress cleared.');
  }

  function wireControls() {
    $('mode-explore').addEventListener('click', () => setMode('explore'));
    $('mode-find').addEventListener('click', () => setMode('find'));
    $('reset').addEventListener('click', resetAll);
    $('zoom-in').addEventListener('click', () => svg.transition().duration(300).call(zoom.scaleBy, 1.6));
    $('zoom-out').addEventListener('click', () => svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.6));
    $('zoom-home').addEventListener('click', () => svg.transition().duration(450).call(zoom.transform, d3.zoomIdentity));
    $('fc-skip').addEventListener('click', skipOrReveal);
    $('cb-primary').addEventListener('click', () => {
      const kind = $('celebrate').dataset.kind;
      $('celebrate').hidden = true;
      if (kind === 'explore') setMode('find');
      else { startFind(); introDetail(); renderChecklist(); updateProgress(); refreshClasses(); }
    });
    $('cb-secondary').addEventListener('click', () => {
      const kind = $('celebrate').dataset.kind;
      $('celebrate').hidden = true;
      if (kind === 'find') setMode('explore');
    });
    $('tab-list').addEventListener('click', () => showTab('list'));
    $('tab-events').addEventListener('click', () => showTab('events'));
    $('ev-copy').addEventListener('click', () => {
      const json = JSON.stringify(events.map(e => e.stmt), null, 2);
      (navigator.clipboard ? navigator.clipboard.writeText(json) : Promise.reject())
        .then(() => toast('Copied ' + events.length + ' statements as JSON.'))
        .catch(() => toast('Copy is blocked here; open the sim fullscreen to copy.'));
    });
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (world) { state.transform = d3.zoomIdentity; render(); } }, 150);
    });
  }
  function showTab(which) {
    $('tab-list').classList.toggle('on', which === 'list');
    $('tab-events').classList.toggle('on', which === 'events');
    $('tab-list').setAttribute('aria-selected', which === 'list');
    $('tab-events').setAttribute('aria-selected', which === 'events');
    $('pane-list').hidden = which !== 'list';
    $('pane-events').hidden = which !== 'events';
  }

  // ------------------------------------------------------------------
  // Utilities
  // ------------------------------------------------------------------
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }
  function isoDuration(ms) { return 'PT' + (ms / 1000).toFixed(2) + 'S'; }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }

  // ------------------------------------------------------------------
  // Start
  // ------------------------------------------------------------------
  wireControls();
  introDetail(); renderChecklist(); updateProgress(); renderEvents();
  if (SHOW_EVENTS) showTab('events');
  else $('tab-events').hidden = true;

  fetch(DATA_URL)
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(topo => {
      world = topojson.feature(topo, topo.objects.countries);
      shapes = buildShapes();
      $('loading').remove();
      render();
      emit('initialized', 'sim', null, 'Map loaded');
    })
    .catch(err => {
      $('loading').textContent = 'The coastline data could not be loaded (' + err.message + '). Check the connection and reload.';
    });
})();

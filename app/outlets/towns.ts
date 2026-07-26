// Town dictionary + classifier for the MolaPlus distributor directory.
//
// Distributor names follow a "<Business> <Place>" convention (e.g.
// "Afrifeeds Ikinu", "Agro Farmers Gatukuyu"), so the trailing token is
// usually a Kenyan town/locality. classifyTown() scans a name's tokens
// (last-to-first, since the place is normally last) and returns the matching
// town key, or null when nothing recognisable is found ("Unclassified").
//
// Coordinates are approximate town centroids — accurate enough to sort
// distributors by proximity to a user's current location.

export type Town = {
  name: string;
  county: string;
  lat: number;
  lng: number;
};

export const towns: Record<string, Town> = {
  // --- Nairobi & Kiambu ---
  nairobi: { name: "Nairobi", county: "Nairobi", lat: -1.286, lng: 36.817 },
  kiambu: { name: "Kiambu", county: "Kiambu", lat: -1.171, lng: 36.836 },
  githunguri: { name: "Githunguri", county: "Kiambu", lat: -1.045, lng: 36.766 },
  ikinu: { name: "Ikinu", county: "Kiambu", lat: -1.02, lng: 36.72 },
  githiga: { name: "Githiga", county: "Kiambu", lat: -1.03, lng: 36.73 },
  ruiru: { name: "Ruiru", county: "Kiambu", lat: -1.146, lng: 36.961 },
  juja: { name: "Juja", county: "Kiambu", lat: -1.1, lng: 37.013 },
  thika: { name: "Thika", county: "Kiambu", lat: -1.033, lng: 37.069 },
  gatundu: { name: "Gatundu", county: "Kiambu", lat: -1.006, lng: 36.96 },
  gatukuyu: { name: "Gatukuyu", county: "Kiambu", lat: -1.0, lng: 37.03 },
  kikuyu: { name: "Kikuyu", county: "Kiambu", lat: -1.246, lng: 36.663 },
  limuru: { name: "Limuru", county: "Kiambu", lat: -1.114, lng: 36.642 },
  kimende: { name: "Kimende", county: "Kiambu", lat: -1.02, lng: 36.62 },
  kinale: { name: "Kinale", county: "Kiambu", lat: -0.98, lng: 36.6 },
  kijabe: { name: "Kijabe", county: "Kiambu", lat: -0.93, lng: 36.58 },
  kamae: { name: "Kamae", county: "Kiambu", lat: -1.0, lng: 36.7 },
  kagwe: { name: "Kagwe", county: "Kiambu", lat: -1.0, lng: 36.72 },
  karuri: { name: "Karuri", county: "Kiambu", lat: -1.18, lng: 36.75 },
  kamburu: { name: "Kamburu", county: "Kiambu", lat: -1.05, lng: 36.75 },

  // --- Nakuru ---
  nakuru: { name: "Nakuru", county: "Nakuru", lat: -0.303, lng: 36.08 },
  lanet: { name: "Lanet", county: "Nakuru", lat: -0.3, lng: 36.15 },
  njoro: { name: "Njoro", county: "Nakuru", lat: -0.33, lng: 35.95 },
  molo: { name: "Molo", county: "Nakuru", lat: -0.249, lng: 35.732 },
  bahati: { name: "Bahati", county: "Nakuru", lat: -0.18, lng: 36.15 },
  subukia: { name: "Subukia", county: "Nakuru", lat: -0.03, lng: 36.28 },
  rongai: { name: "Rongai", county: "Nakuru", lat: -0.17, lng: 35.85 },
  gilgil: { name: "Gilgil", county: "Nakuru", lat: -0.5, lng: 36.32 },
  naivasha: { name: "Naivasha", county: "Nakuru", lat: -0.717, lng: 36.431 },
  keringet: { name: "Keringet", county: "Nakuru", lat: -0.42, lng: 35.68 },
  kuresoi: { name: "Kuresoi", county: "Nakuru", lat: -0.35, lng: 35.68 },
  olenguruone: { name: "Olenguruone", county: "Nakuru", lat: -0.6, lng: 35.68 },
  mau: { name: "Mau Narok", county: "Nakuru", lat: -0.75, lng: 35.9 },
  elburgon: { name: "Elburgon", county: "Nakuru", lat: -0.28, lng: 35.83 },
  kasuku: { name: "Kasuku", county: "Nakuru", lat: -0.15, lng: 36.35 },

  // --- Nyandarua ---
  olkalou: { name: "Ol Kalou", county: "Nyandarua", lat: -0.27, lng: 36.38 },
  njambini: { name: "Njambini", county: "Nyandarua", lat: -0.68, lng: 36.62 },
  engineer: { name: "Engineer", county: "Nyandarua", lat: -0.6, lng: 36.55 },
  shamata: { name: "Shamata", county: "Nyandarua", lat: 0.05, lng: 36.5 },
  wanjohi: { name: "Wanjohi", county: "Nyandarua", lat: -0.45, lng: 36.5 },
  miharati: { name: "Miharati", county: "Nyandarua", lat: -0.55, lng: 36.5 },
  murungaru: { name: "Murungaru", county: "Nyandarua", lat: -0.6, lng: 36.6 },
  ndunyunjeru: { name: "Ndunyu Njeru", county: "Nyandarua", lat: -0.55, lng: 36.45 },
  mairoinya: { name: "Mairo Inya", county: "Nyandarua", lat: -0.1, lng: 36.45 },

  // --- Nyeri ---
  nyeri: { name: "Nyeri", county: "Nyeri", lat: -0.42, lng: 36.947 },
  karatina: { name: "Karatina", county: "Nyeri", lat: -0.483, lng: 37.128 },
  othaya: { name: "Othaya", county: "Nyeri", lat: -0.55, lng: 36.93 },
  mukurweini: { name: "Mukurweini", county: "Nyeri", lat: -0.55, lng: 37.05 },
  chaka: { name: "Chaka", county: "Nyeri", lat: -0.45, lng: 37.15 },
  naromoru: { name: "Naro Moru", county: "Nyeri", lat: -0.17, lng: 37.02 },
  kiganjo: { name: "Kiganjo", county: "Nyeri", lat: -0.4, lng: 37.1 },
  mweiga: { name: "Mweiga", county: "Nyeri", lat: -0.38, lng: 36.92 },
  endarasha: { name: "Endarasha", county: "Nyeri", lat: -0.35, lng: 36.85 },
  kiawara: { name: "Kiawara", county: "Nyeri", lat: -0.35, lng: 37.05 },
  kagumo: { name: "Kagumo", county: "Nyeri", lat: -0.5, lng: 37.0 },

  // --- Kirinyaga ---
  kerugoya: { name: "Kerugoya", county: "Kirinyaga", lat: -0.499, lng: 37.28 },
  kutus: { name: "Kutus", county: "Kirinyaga", lat: -0.55, lng: 37.3 },
  mwea: { name: "Mwea", county: "Kirinyaga", lat: -0.66, lng: 37.37 },
  sagana: { name: "Sagana", county: "Kirinyaga", lat: -0.66, lng: 37.2 },
  kagio: { name: "Kagio", county: "Kirinyaga", lat: -0.6, lng: 37.28 },
  baricho: { name: "Baricho", county: "Kirinyaga", lat: -0.5, lng: 37.2 },

  // --- Murang'a ---
  muranga: { name: "Murang'a", county: "Murang'a", lat: -0.721, lng: 37.153 },
  kangema: { name: "Kangema", county: "Murang'a", lat: -0.68, lng: 36.96 },
  kiria: { name: "Kirwara", county: "Murang'a", lat: -0.95, lng: 37.05 },
  maragua: { name: "Maragua", county: "Murang'a", lat: -0.79, lng: 37.14 },

  // --- Embu ---
  embu: { name: "Embu", county: "Embu", lat: -0.539, lng: 37.457 },
  runyenjes: { name: "Runyenjes", county: "Embu", lat: -0.4, lng: 37.56 },
  siakago: { name: "Siakago", county: "Embu", lat: -0.63, lng: 37.63 },
  manyatta: { name: "Manyatta", county: "Embu", lat: -0.5, lng: 37.5 },

  // --- Meru & Tharaka-Nithi ---
  meru: { name: "Meru", county: "Meru", lat: 0.047, lng: 37.649 },
  nkubu: { name: "Nkubu", county: "Meru", lat: -0.06, lng: 37.66 },
  githongo: { name: "Githongo", county: "Meru", lat: 0.1, lng: 37.7 },
  maua: { name: "Maua", county: "Meru", lat: 0.23, lng: 37.94 },
  timau: { name: "Timau", county: "Meru", lat: 0.08, lng: 37.24 },
  chuka: { name: "Chuka", county: "Tharaka-Nithi", lat: -0.33, lng: 37.65 },
  chogoria: { name: "Chogoria", county: "Tharaka-Nithi", lat: -0.3, lng: 37.63 },

  // --- Laikipia ---
  nanyuki: { name: "Nanyuki", county: "Laikipia", lat: 0.017, lng: 37.073 },
  rumuruti: { name: "Rumuruti", county: "Laikipia", lat: 0.27, lng: 36.54 },
  kinamba: { name: "Kinamba", county: "Laikipia", lat: 0.1, lng: 36.5 },
  nyahururu: { name: "Nyahururu", county: "Laikipia", lat: 0.036, lng: 36.363 },

  // --- Baringo ---
  kabarnet: { name: "Kabarnet", county: "Baringo", lat: 0.492, lng: 35.743 },
  mogotio: { name: "Mogotio", county: "Baringo", lat: 0.02, lng: 35.97 },
  marigat: { name: "Marigat", county: "Baringo", lat: 0.47, lng: 35.98 },
  eldamaravine: { name: "Eldama Ravine", county: "Baringo", lat: 0.05, lng: 35.72 },

  // --- Kericho ---
  kericho: { name: "Kericho", county: "Kericho", lat: -0.368, lng: 35.286 },
  litein: { name: "Litein", county: "Kericho", lat: -0.58, lng: 35.29 },
  kapkatet: { name: "Kapkatet", county: "Kericho", lat: -0.55, lng: 35.15 },
  kapsoit: { name: "Kapsoit", county: "Kericho", lat: -0.4, lng: 35.2 },
  londiani: { name: "Londiani", county: "Kericho", lat: -0.17, lng: 35.6 },
  roret: { name: "Roret", county: "Kericho", lat: -0.45, lng: 35.35 },
  cheborgei: { name: "Cheborgei", county: "Kericho", lat: -0.6, lng: 35.25 },
  sosiot: { name: "Sosiot", county: "Kericho", lat: -0.42, lng: 35.28 },

  // --- Bomet ---
  bomet: { name: "Bomet", county: "Bomet", lat: -0.783, lng: 35.342 },
  sotik: { name: "Sotik", county: "Bomet", lat: -0.68, lng: 35.12 },
  silibwet: { name: "Silibwet", county: "Bomet", lat: -0.75, lng: 35.35 },
  chebole: { name: "Chebole", county: "Bomet", lat: -0.6, lng: 35.4 },
  siongiroi: { name: "Siongiroi", county: "Bomet", lat: -0.9, lng: 35.3 },
  mulot: { name: "Mulot", county: "Bomet", lat: -0.9, lng: 35.4 },

  // --- Narok ---
  narok: { name: "Narok", county: "Narok", lat: -1.087, lng: 35.87 },
  ololulunga: { name: "Ololulunga", county: "Narok", lat: -0.9, lng: 35.65 },
  kilgoris: { name: "Kilgoris", county: "Narok", lat: -1.0, lng: 34.88 },

  // --- Kisii & Nyamira ---
  kisii: { name: "Kisii", county: "Kisii", lat: -0.681, lng: 34.767 },
  suneka: { name: "Suneka", county: "Kisii", lat: -0.72, lng: 34.68 },
  keumbu: { name: "Keumbu", county: "Kisii", lat: -0.7, lng: 34.85 },
  ogembo: { name: "Ogembo", county: "Kisii", lat: -0.83, lng: 34.72 },
  nyamache: { name: "Nyamache", county: "Kisii", lat: -0.75, lng: 34.9 },
  nyamira: { name: "Nyamira", county: "Nyamira", lat: -0.563, lng: 34.935 },
  kebirigo: { name: "Kebirigo", county: "Nyamira", lat: -0.6, lng: 34.9 },
  keroka: { name: "Keroka", county: "Nyamira", lat: -0.78, lng: 34.94 },

  // --- Uasin Gishu / Nandi / Trans-Nzoia ---
  eldoret: { name: "Eldoret", county: "Uasin Gishu", lat: 0.514, lng: 35.269 },
  kapsabet: { name: "Kapsabet", county: "Nandi", lat: 0.203, lng: 35.1 },
  kitale: { name: "Kitale", county: "Trans-Nzoia", lat: 1.015, lng: 35.006 },

  // --- Machakos / Makueni (a few) ---
  machakos: { name: "Machakos", county: "Machakos", lat: -1.517, lng: 37.263 },
  matuu: { name: "Matuu", county: "Machakos", lat: -1.13, lng: 37.55 },

  // --- Nyanza / Western majors ---
  kisumu: { name: "Kisumu", county: "Kisumu", lat: -0.091, lng: 34.768 },
  kakamega: { name: "Kakamega", county: "Kakamega", lat: 0.283, lng: 34.752 },
  bungoma: { name: "Bungoma", county: "Bungoma", lat: 0.563, lng: 34.56 },
  busia: { name: "Busia", county: "Busia", lat: 0.464, lng: 34.111 },
  mumias: { name: "Mumias", county: "Kakamega", lat: 0.336, lng: 34.489 },
  luanda: { name: "Luanda", county: "Vihiga", lat: 0.0, lng: 34.5 },
  ekerenyo: { name: "Ekerenyo", county: "Nyamira", lat: -0.5, lng: 34.9 },
  kemera: { name: "Kemera", county: "Nyamira", lat: -0.7, lng: 34.9 },
  ikonge: { name: "Ikonge", county: "Nyamira", lat: -0.7, lng: 34.9 },

  // --- More Rift Valley localities ---
  ngurika: { name: "Ngurika", county: "Nakuru", lat: -0.35, lng: 35.9 },
  ndunduri: { name: "Ndunduri", county: "Nakuru", lat: -0.3, lng: 35.9 },
  kabazi: { name: "Kabazi", county: "Nakuru", lat: -0.15, lng: 36.1 },
  kabatini: { name: "Kabatini", county: "Nakuru", lat: -0.25, lng: 36.1 },
  kihingo: { name: "Kihingo", county: "Nakuru", lat: -0.4, lng: 35.95 },
  mauche: { name: "Mauche", county: "Nakuru", lat: -0.4, lng: 35.9 },
  egerton: { name: "Egerton", county: "Nakuru", lat: -0.37, lng: 35.93 },
  kinungi: { name: "Kinungi", county: "Nakuru", lat: -0.65, lng: 36.4 },
  kikopey: { name: "Kikopey", county: "Nakuru", lat: -0.45, lng: 36.25 },
  karunga: { name: "Karunga", county: "Nakuru", lat: -0.5, lng: 36.35 },
  emining: { name: "Emining", county: "Baringo", lat: 0.1, lng: 35.9 },
  oljabet: { name: "Ol Jabet", county: "Baringo", lat: -0.1, lng: 35.7 },
  chepseon: { name: "Chepseon", county: "Kericho", lat: -0.3, lng: 35.4 },
  kiptere: { name: "Kiptere", county: "Kericho", lat: -0.5, lng: 35.25 },
  koiwa: { name: "Koiwa", county: "Bomet", lat: -0.7, lng: 35.2 },
  kaplong: { name: "Kaplong", county: "Bomet", lat: -0.72, lng: 35.1 },
  kapkoros: { name: "Kapkoros", county: "Bomet", lat: -0.75, lng: 35.3 },
  ndanai: { name: "Ndanai", county: "Bomet", lat: -0.85, lng: 35.15 },
  mugogociek: { name: "Mugogociek", county: "Bomet", lat: -0.6, lng: 35.35 },
  kiptagich: { name: "Kiptagich", county: "Nakuru", lat: -0.5, lng: 35.6 },
  timboroa: { name: "Timboroa", county: "Uasin Gishu", lat: 0.05, lng: 35.55 },
  naiberi: { name: "Naiberi", county: "Uasin Gishu", lat: 0.4, lng: 35.4 },
  kaptumo: { name: "Kaptumo", county: "Nandi", lat: 0.1, lng: 35.1 },
  chepkorio: { name: "Chepkorio", county: "Elgeyo Marakwet", lat: 0.3, lng: 35.55 },
  kaptarakwa: { name: "Kaptarakwa", county: "Elgeyo Marakwet", lat: 0.3, lng: 35.5 },

  // --- More Central localities ---
  kiserian: { name: "Kiserian", county: "Kajiado", lat: -1.42, lng: 36.7 },
  ruai: { name: "Ruai", county: "Nairobi", lat: -1.27, lng: 36.98 },
  kamwangi: { name: "Kamwangi", county: "Kiambu", lat: -0.95, lng: 37.05 },
  mangu: { name: "Mang'u", county: "Kiambu", lat: -1.0, lng: 37.0 },
  kambaa: { name: "Kambaa", county: "Kiambu", lat: -0.95, lng: 36.7 },
  kibichoi: { name: "Kibichoi", county: "Kiambu", lat: -1.05, lng: 36.9 },
  gakoe: { name: "Gakoe", county: "Kiambu", lat: -1.0, lng: 37.0 },
  igegania: { name: "Igegania", county: "Kiambu", lat: -1.0, lng: 36.9 },
  maiko: { name: "Kwa Maiko", county: "Kiambu", lat: -1.0, lng: 36.75 },
  kiriaini: { name: "Kiriaini", county: "Murang'a", lat: -0.65, lng: 36.9 },
  kangare: { name: "Kangare", county: "Murang'a", lat: -0.7, lng: 37.0 },
  kibugua: { name: "Kibugua", county: "Murang'a", lat: -0.6, lng: 37.1 },
  githabai: { name: "Githabai", county: "Murang'a", lat: -0.7, lng: 36.9 },
  kariamu: { name: "Kariamu", county: "Murang'a", lat: -0.6, lng: 37.0 },
  rurii: { name: "Rurii", county: "Nyandarua", lat: -0.3, lng: 36.4 },
  ndaragwa: { name: "Ndaragwa", county: "Nyandarua", lat: -0.02, lng: 36.4 },
  gakindu: { name: "Gakindu", county: "Nyeri", lat: -0.4, lng: 37.0 },
  giakanja: { name: "Giakanja", county: "Nyeri", lat: -0.4, lng: 37.0 },
  kianjokuma: { name: "Kianjokuma", county: "Kirinyaga", lat: -0.4, lng: 37.2 },
  kimunye: { name: "Kimunye", county: "Kirinyaga", lat: -0.45, lng: 37.35 },
  igoji: { name: "Igoji", county: "Meru", lat: -0.2, lng: 37.65 },
  kibirichia: { name: "Kibirichia", county: "Meru", lat: 0.1, lng: 37.6 },
  marima: { name: "Marima", county: "Tharaka-Nithi", lat: -0.35, lng: 37.6 },
  mitheru: { name: "Mitheru", county: "Tharaka-Nithi", lat: -0.35, lng: 37.7 },
  kianyaga: { name: "Kianyaga", county: "Kirinyaga", lat: -0.5, lng: 37.3 },
  kigumo: { name: "Kigumo", county: "Murang'a", lat: -0.7, lng: 37.0 },
  kahatia: { name: "Kahatia", county: "Murang'a", lat: -0.5, lng: 36.9 },
  karangatha: { name: "Karangatha", county: "Nyeri", lat: -0.4, lng: 37.0 },
  nairutia: { name: "Nairutia", county: "Laikipia", lat: -0.1, lng: 37.0 },
  ahero: { name: "Ahero", county: "Kisumu", lat: -0.17, lng: 34.92 },
  migori: { name: "Migori", county: "Migori", lat: -1.063, lng: 34.473 },
  longisa: { name: "Longisa", county: "Bomet", lat: -0.85, lng: 35.4 },
  fortenan: { name: "Fort Ternan", county: "Kericho", lat: -0.2, lng: 35.35 },
};

// Alias tokens (lowercase, no spaces) → town key. Multiple spellings map to
// the same canonical town.
const aliases: Record<string, string> = {
  ravine: "eldamaravine",
  eldama: "eldamaravine",
  olkalau: "olkalou",
  olkalou: "olkalou",
  kalou: "olkalou",
  silbwet: "silibwet",
  silibwet: "silibwet",
  mugotio: "mogotio",
  mogotio: "mogotio",
  narumoru: "naromoru",
  naromoru: "naromoru",
  keruguya: "kerugoya",
  kerugoya: "kerugoya",
  itein: "litein",
  litein: "litein",
  ndunyu: "ndunyunjeru",
  njeru: "ndunyunjeru",
  cheborgee: "cheborgei",
  cheborgei: "cheborgei",
  narok: "narok",
  maunarok: "mau",
  murangab: "muranga",
};

// Tokens that look like places but are too generic/ambiguous to trust.
const stopTokens = new Set([
  "agro", "agrovet", "agrivet", "vet", "feeds", "feed", "farm", "farmers",
  "farmer", "farming", "ltd", "limited", "co", "company", "enterprises",
  "enterprise", "stores", "store", "supplies", "supply", "centre", "center",
  "shop", "hardware", "traders", "trader", "general", "dealers", "dealer",
  "animal", "dairy", "poultry", "products", "solutions", "services", "service",
  "group", "holdings", "investments", "investment", "agencies", "agency",
  "distributors", "distributor", "supermarket", "agri", "input", "inputs",
  "nutrition", "africa", "kenya", "molaplus", "and", "the", "of", "for",
  "kilimo", "wakulima", "mkulima", "mifugo", "shamba", "stores", "chemist",
  "care", "green", "smart", "digital", "stage", "society", "point", "junction",
  "self", "help", "cooperative", "sacco", "county", "sub", "east", "west",
  "north", "south", "central", "tumaini", "haraka", "sita", "supiri", "jikaze",
  "brook", "mawingu", "munyaka", "flax", "majengo", "matopeni", "totally",
  "neema", "mavuno", "bora", "baraka", "blessed", "victory", "best", "joy",
  "alpha", "madam", "new", "faith", "focus", "high", "quality", "kwa", "kfa",
  "farmcare", "pride", "choice", "world", "prose", "goshen", "calcium", "dawa",
]);

function tokenize(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Classify a distributor name into a town key, or null when unknown.
 * Scans tokens last-to-first because the place name is usually at the end.
 */
export function classifyTown(name: string): string | null {
  const tokens = tokenize(name);
  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i];
    if (stopTokens.has(token)) continue;
    if (towns[token]) return token;
    if (aliases[token]) return aliases[token];
  }
  return null;
}

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance between two lat/lng points, in kilometres. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

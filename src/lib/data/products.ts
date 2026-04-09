import type { Product } from "@/lib/types";

export const PRODUCTS: Product[] = [
  // ── Single Estate (6) ──────────────────────────────────────────────

  {
    id: "nocellara-ferrante",
    name: "Nocellara Ferrante",
    collectionId: "single-estate",
    origin: "Castelvetrano, Sicily",
    producer: "Ferrante Family Estate",
    harvest: "October 2025",
    shortDescription:
      "A Sicilian Nocellara pressed within hours of picking — bright, peppery, unapologetically green.",
    description:
      "The Ferrante family has farmed the same sixty hectares outside Castelvetrano for four generations. Their Nocellara olives are picked slightly under-ripe and cold-pressed the same morning. The result is an oil with real bite — a green pepper kick on the finish that lingers without becoming harsh. We've carried this oil since our first year and it remains the one we put on the table when someone asks what Sicilian oil should taste like.",
    tastingNotes: [
      "green pepper",
      "fresh-cut grass",
      "artichoke leaf",
      "bitter almond",
    ],
    pairings: [
      "burrata with ripe tomatoes",
      "grilled swordfish",
      "raw fennel salad",
      "white bean bruschetta",
    ],
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80",
    ],
    variants: [
      { id: "nf-250", size: "250ml", price: 1650, sku: "NF-250", inventory: 42 },
      { id: "nf-500", size: "500ml", price: 2800, sku: "NF-500", inventory: 28 },
    ],
    tags: ["bestseller"],
    featured: true,
  },
  {
    id: "coratina-ferrara",
    name: "Coratina Ferrara",
    collectionId: "single-estate",
    origin: "Andria, Puglia",
    producer: "Ferrara di Andria",
    harvest: "November 2025",
    shortDescription:
      "Robust Puglian Coratina with a long, peppery finish — the oil that makes you cough, in the best way.",
    description:
      "Ferrara di Andria is a small operation run by two brothers on land their grandfather cleared in the 1950s. Their Coratina is a full-throated oil — bold polyphenols, a raspy pepper hit at the back of the throat, and a bitterness that resolves into something almost sweet. It's not for drizzling delicately; this is the oil you pour generously over grilled vegetables and rough bread. We bring it in once a year and it moves fast.",
    tastingNotes: [
      "black pepper",
      "raw artichoke",
      "green walnut",
      "tomato vine",
      "chicory",
    ],
    pairings: [
      "charred aubergine",
      "orecchiette with turnip tops",
      "grilled lamb chops",
      "fava bean purée",
    ],
    images: [],
    variants: [
      { id: "cf-250", size: "250ml", price: 1550, sku: "CF-250", inventory: 36 },
      { id: "cf-500", size: "500ml", price: 2600, sku: "CF-500", inventory: 20 },
    ],
    tags: ["organic"],
    featured: false,
  },
  {
    id: "koroneiki-spiros",
    name: "Koroneiki Spiros",
    collectionId: "single-estate",
    origin: "Messenia, Peloponnese",
    producer: "Spiros Kalamata Grove",
    harvest: "November 2025",
    shortDescription:
      "A textbook Koroneiki from southern Greece — herbaceous up front, clean and mineral through the finish.",
    description:
      "Spiros Andreou's grove sits on a hillside above Kalamata, where the Koroneiki trees are old enough that no one knows exactly when they were planted. The oil is lighter than most Greek offerings — less viscous, more aromatic, with a herbal character that reminds you of wild oregano and dried thyme. It's the one we recommend when customers say they want something Mediterranean that doesn't overpower the food.",
    tastingNotes: [
      "dried oregano",
      "green banana",
      "white pepper",
      "chamomile",
    ],
    pairings: [
      "grilled halloumi",
      "roasted red peppers",
      "lemon-dressed lentils",
      "warm pitta with za'atar",
    ],
    images: [],
    variants: [
      { id: "ks-250", size: "250ml", price: 1450, sku: "KS-250", inventory: 50 },
      { id: "ks-500", size: "500ml", price: 2400, sku: "KS-500", inventory: 34 },
    ],
    tags: [],
    featured: false,
  },
  {
    id: "peranzana-masseria-luce",
    name: "Peranzana Masseria Luce",
    collectionId: "single-estate",
    origin: "Foggia, Puglia",
    producer: "Masseria Luce",
    harvest: "October 2025",
    shortDescription:
      "Gentle Peranzana from the Capitanata plain — buttery, mild, with a sweet almond finish.",
    description:
      "Masseria Luce is a converted farmhouse-turned-mill on the flat plains north of Foggia, where the Peranzana cultivar dominates. This is a softer oil than most in our range — low bitterness, almost buttery, with a sweetness that makes it the one our customers use for baking and anywhere they want olive oil without the shout. Don't mistake mild for boring: there's a complexity in the almond and hay notes that rewards attention.",
    tastingNotes: [
      "sweet almond",
      "hay",
      "ripe apple",
      "mild white pepper",
    ],
    pairings: [
      "steamed fish with lemon",
      "potato and rosemary focaccia",
      "olive oil cake",
      "mozzarella and stone fruit",
    ],
    images: [],
    variants: [
      { id: "pml-250", size: "250ml", price: 1400, sku: "PML-250", inventory: 60 },
      { id: "pml-500", size: "500ml", price: 2200, sku: "PML-500", inventory: 40 },
      { id: "pml-1l", size: "1L", price: 3800, sku: "PML-1L", inventory: 15 },
    ],
    tags: ["new"],
    featured: false,
  },
  {
    id: "taggiasca-riviera",
    name: "Taggiasca Riviera",
    collectionId: "single-estate",
    origin: "Imperia, Liguria",
    producer: "Olio Moretti",
    harvest: "November 2025",
    shortDescription:
      "Ligurian Taggiasca, delicate as the Riviera itself — pine nut, fresh herbs, almost no bitterness.",
    description:
      "The Moretti family presses Taggiasca olives on steep terraced hillsides above the coast near Imperia. It's painstaking work — the trees grow between dry-stone walls and everything is picked by hand. The oil is one of the gentlest in our range, almost sweet, with a character that belongs more to a herb garden than a farm. We pour it over pesto, over fish, over anything where you want the oil to whisper rather than shout.",
    tastingNotes: [
      "pine nut",
      "fresh basil",
      "green almond",
      "mild artichoke",
    ],
    pairings: [
      "trofie al pesto",
      "focaccia di Recco",
      "grilled branzino",
      "raw courgette carpaccio",
    ],
    images: [],
    variants: [
      { id: "tr-250", size: "250ml", price: 1750, sku: "TR-250", inventory: 24 },
      { id: "tr-500", size: "500ml", price: 2900, sku: "TR-500", inventory: 16 },
    ],
    tags: [],
    featured: true,
  },
  {
    id: "picual-cortijo-alto",
    name: "Picual Cortijo Alto",
    collectionId: "single-estate",
    origin: "Jaén, Andalusia",
    producer: "Cortijo Alto",
    harvest: "December 2025",
    shortDescription:
      "A Spanish Picual with real structure — fig leaf, tomato, and a long peppery close.",
    description:
      "Jaén produces more olive oil than anywhere else on earth, and most of it is anonymous bulk. Cortijo Alto is the opposite: a single farm at altitude, harvesting early when the polyphenol content peaks. Their Picual has a distinctive fig-leaf aroma that's unmistakable once you know it, followed by a firm, structured body. It stands up to robust food and strong flavours in a way few other cultivars manage. A serious oil for people who like their food with backbone.",
    tastingNotes: [
      "fig leaf",
      "green tomato",
      "rocket",
      "black pepper",
      "dried herb",
    ],
    pairings: [
      "gazpacho",
      "manchego with membrillo",
      "slow-roasted lamb shoulder",
      "grilled padron peppers",
    ],
    images: [],
    variants: [
      { id: "pca-250", size: "250ml", price: 1500, sku: "PCA-250", inventory: 30 },
      { id: "pca-500", size: "500ml", price: 2500, sku: "PCA-500", inventory: 22 },
    ],
    tags: ["organic"],
    featured: false,
  },

  // ── House Blends (6) ──────────────────────────────────────────────

  {
    id: "everyday-puglia",
    name: "Everyday Puglia",
    collectionId: "house-blends",
    origin: "Puglia, Italy",
    producer: "Oliveto House Blend",
    harvest: "2025 harvest",
    shortDescription:
      "Our workhorse blend — three Puglian cultivars balanced for cooking, dressing, and everything in between.",
    description:
      "We built this blend for the bottle that never leaves the counter. It's a mix of Coratina, Ogliarola, and Cellina from farms across central Puglia, balanced so the pepper doesn't overwhelm and the fruitiness holds up to heat. It's what we cook with at home. We adjust the proportions slightly each year depending on the harvest, but the character stays the same: reliable, flavourful, unpretentious.",
    tastingNotes: [
      "mild pepper",
      "ripe tomato",
      "dried grass",
      "light almond",
    ],
    pairings: [
      "pasta aglio e olio",
      "roasted vegetables",
      "fried eggs",
      "warm bread — any bread",
    ],
    images: [
      "https://images.unsplash.com/photo-1550411294-875dc7e3bec5?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550411294-875dc7e3bec5?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550411294-875dc7e3bec5?w=1200&auto=format&fit=crop&q=80",
    ],
    variants: [
      { id: "ep-250", size: "250ml", price: 950, sku: "EP-250", inventory: 80 },
      { id: "ep-500", size: "500ml", price: 1550, sku: "EP-500", inventory: 60 },
      { id: "ep-1l", size: "1L", price: 2600, sku: "EP-1L", inventory: 35 },
    ],
    tags: ["bestseller"],
    featured: true,
  },
  {
    id: "mediterranean-table",
    name: "Mediterranean Table",
    collectionId: "house-blends",
    origin: "Southern Italy & Greece",
    producer: "Oliveto House Blend",
    harvest: "2025 harvest",
    shortDescription:
      "Italian body with Greek brightness — a cross-border blend that belongs on a shared table.",
    description:
      "This blend pairs Ogliarola from Puglia with Koroneiki from the Peloponnese. The Italian oil brings body and a round, buttery mouthfeel; the Greek oil lifts it with herbaceous top notes and a clean finish. We originally made it for a restaurant client who wanted one oil that worked from antipasti through to grilled fish, and it did that so well we added it to the range. It's the bottle we gift to people who say they don't notice the difference between olive oils.",
    tastingNotes: [
      "green herb",
      "butter lettuce",
      "mild chilli",
      "hay",
    ],
    pairings: [
      "hummus with sumac",
      "caprese salad",
      "seared tuna",
      "roasted cauliflower",
    ],
    images: [],
    variants: [
      { id: "mt-250", size: "250ml", price: 1050, sku: "MT-250", inventory: 55 },
      { id: "mt-500", size: "500ml", price: 1700, sku: "MT-500", inventory: 40 },
      { id: "mt-1l", size: "1L", price: 2900, sku: "MT-1L", inventory: 20 },
    ],
    tags: ["new"],
    featured: false,
  },
  {
    id: "sicilian-robust",
    name: "Sicilian Robust",
    collectionId: "house-blends",
    origin: "Sicily, Italy",
    producer: "Oliveto House Blend",
    harvest: "2025 harvest",
    shortDescription:
      "A bold Sicilian blend built for people who want to taste the oil, not just use it.",
    description:
      "We blend Nocellara and Biancolilla from western Sicily's Belice valley, favouring early-harvest lots where the polyphenols are highest. The Nocellara brings structure and pepper; the Biancolilla rounds it out with a floral, almost tomato-leaf sweetness. It's more intense than our Everyday Puglia — this is the one for people who want their oil to be a flavour, not a background.",
    tastingNotes: [
      "green pepper",
      "tomato leaf",
      "fresh almond",
      "wild herb",
      "citrus peel",
    ],
    pairings: [
      "caponata",
      "grilled octopus",
      "ricotta with honey",
      "sourdough with sea salt",
    ],
    images: [],
    variants: [
      { id: "sr-250", size: "250ml", price: 1100, sku: "SR-250", inventory: 45 },
      { id: "sr-500", size: "500ml", price: 1800, sku: "SR-500", inventory: 30 },
    ],
    tags: [],
    featured: false,
  },
  {
    id: "calabrian-mild",
    name: "Calabrian Mild",
    collectionId: "house-blends",
    origin: "Calabria, Italy",
    producer: "Oliveto House Blend",
    harvest: "2025 harvest",
    shortDescription:
      "Soft and round with barely a trace of bitterness — the gateway oil for people new to good olive oil.",
    description:
      "Not everyone wants pepper and punch, and that's fine. This Calabrian blend leans on Carolea olives harvested at full maturity, when the fruitiness peaks and the bitterness drops. It's sweet, round, almost creamy, and works brilliantly in baking or anywhere you'd reach for butter. We sell more of this to first-time olive oil buyers than anything else, and most of them come back for something stronger once they see what the fuss is about.",
    tastingNotes: [
      "ripe olive",
      "sweet butter",
      "cooked apple",
      "mild herb",
    ],
    pairings: [
      "olive oil cake",
      "vanilla ice cream",
      "steamed asparagus",
      "mayonnaise",
    ],
    images: [],
    variants: [
      { id: "cm-250", size: "250ml", price: 900, sku: "CM-250", inventory: 70 },
      { id: "cm-500", size: "500ml", price: 1450, sku: "CM-500", inventory: 50 },
      { id: "cm-1l", size: "1L", price: 2400, sku: "CM-1L", inventory: 25 },
    ],
    tags: [],
    featured: false,
  },
  {
    id: "greek-island",
    name: "Greek Island",
    collectionId: "house-blends",
    origin: "Crete & Lesbos, Greece",
    producer: "Oliveto House Blend",
    harvest: "2025 harvest",
    shortDescription:
      "Koroneiki from two islands blended into something herbal, bright, and impossible to stop eating bread with.",
    description:
      "We source Koroneiki from a hillside cooperative in Sitia, Crete and a smaller lot from Lesbos. The Cretan oil is greener and more peppery; the Lesbos oil brings a floral, almost honeyed warmth. Blended, they make something that tastes like a Greek summer smells — wild herbs, warm stone, cut lemon. It's our most popular oil with customers who cook a lot of Middle Eastern and Eastern Mediterranean food.",
    tastingNotes: [
      "wild thyme",
      "lemon zest",
      "green olive",
      "warm stone",
    ],
    pairings: [
      "Greek salad",
      "grilled lamb kofta",
      "baked feta with tomatoes",
      "pitta and labneh",
    ],
    images: [],
    variants: [
      { id: "gi-250", size: "250ml", price: 1000, sku: "GI-250", inventory: 55 },
      { id: "gi-500", size: "500ml", price: 1600, sku: "GI-500", inventory: 35 },
    ],
    tags: ["organic"],
    featured: false,
  },
  {
    id: "iberian-reserve",
    name: "Iberian Reserve",
    collectionId: "house-blends",
    origin: "Andalusia & Alentejo",
    producer: "Oliveto House Blend",
    harvest: "2025 harvest",
    shortDescription:
      "Spanish Picual meets Portuguese Galega — structured, herbal, with an earthy warmth that suits cooler weather.",
    description:
      "A cross-border blend we developed for autumn and winter cooking. The Picual from Jaén brings its signature fig-leaf intensity and firm structure; the Galega from Portugal's Alentejo adds a softer, earthier warmth. Together they make an oil that's robust enough for braised meats and root vegetables but still interesting enough to finish a bowl of soup with. We tend to sell more of this between October and March.",
    tastingNotes: [
      "fig leaf",
      "earth",
      "rosemary",
      "dark pepper",
      "walnut skin",
    ],
    pairings: [
      "bean and chorizo stew",
      "roasted root vegetables",
      "mushroom risotto",
      "sourdough with aged cheese",
    ],
    images: [],
    variants: [
      { id: "ir-250", size: "250ml", price: 1150, sku: "IR-250", inventory: 40 },
      { id: "ir-500", size: "500ml", price: 1850, sku: "IR-500", inventory: 28 },
    ],
    tags: ["new"],
    featured: false,
  },

  // ── Finishing Oils (6) ─────────────────────────────────────────────

  {
    id: "monte-iblei-reserva",
    name: "Monte Iblei Reserva",
    collectionId: "finishing-oils",
    origin: "Ragusa, Sicily",
    producer: "Ferrante Family Estate",
    harvest: "October 2025",
    shortDescription:
      "An early-harvest Tonda Iblea pressed at dawn — intensely green, with a polyphenol count that'll wake you up.",
    description:
      "This is the Ferrante family's prestige bottling — the same grove as our Nocellara, but a different cultivar (Tonda Iblea) picked at least two weeks earlier. The yield is lower and the flavour is fierce: raw artichoke, rocket, a pepper hit that catches the throat. We bottle it in 250ml only because a little goes a long way and because the limited harvest doesn't stretch further. Pour it on things that can stand up to it — steak, hearty soups, anything with char.",
    tastingNotes: [
      "raw artichoke",
      "rocket",
      "green chilli",
      "eucalyptus",
      "bitter herb",
    ],
    pairings: [
      "grilled bistecca",
      "ribollita",
      "burrata with charred peppers",
      "carpaccio",
    ],
    images: [
      "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=1200&auto=format&fit=crop&q=80",
    ],
    variants: [
      { id: "mir-250", size: "250ml", price: 2800, sku: "MIR-250", inventory: 18 },
    ],
    tags: ["limited"],
    featured: true,
  },
  {
    id: "frantoio-di-collina",
    name: "Frantoio di Collina",
    collectionId: "finishing-oils",
    origin: "Spoleto, Umbria",
    producer: "Collina Verde",
    harvest: "November 2025",
    shortDescription:
      "Umbrian Frantoio cultivar, estate-milled — herbaceous, complex, with a clean minerality.",
    description:
      "Collina Verde is a hilltop mill outside Spoleto that processes only its own olives. Their Frantoio cultivar produces an oil with a distinctive herbal complexity — layers of mint, sage, and something almost mineral, like wet stone. It's less aggressive than the Sicilian finishing oils but just as interesting, and it works beautifully on foods where you want depth without heat. Particularly good on white fish and legume dishes where the mineral note mirrors the food.",
    tastingNotes: [
      "fresh mint",
      "sage",
      "wet stone",
      "green apple",
      "white pepper",
    ],
    pairings: [
      "cannellini bean soup",
      "grilled branzino",
      "truffle bruschetta",
      "panzanella",
    ],
    images: [],
    variants: [
      { id: "fdc-250", size: "250ml", price: 2400, sku: "FDC-250", inventory: 22 },
      { id: "fdc-500", size: "500ml", price: 3800, sku: "FDC-500", inventory: 10 },
    ],
    tags: ["organic"],
    featured: false,
  },
  {
    id: "sorrento-hills",
    name: "Sorrento Hills Reserve",
    collectionId: "finishing-oils",
    origin: "Sorrento Peninsula, Campania",
    producer: "Oleificio di Massa",
    harvest: "October 2025",
    shortDescription:
      "Lemon groves run through this Campanian oil — floral, citrus-forward, almost perfumed.",
    description:
      "The Sorrento Peninsula's olive trees grow alongside lemon groves, and you can taste the neighbourhood. This Minuta cultivar oil has a floral, citrus-inflected character unlike anything else in our range. It's delicate but distinctive — less about pepper and bitterness, more about aroma and a silky, almost perfumed mouthfeel. We import a small quantity each year and it tends to sell out by February. Try it on raw fish or anywhere you'd squeeze a lemon.",
    tastingNotes: [
      "lemon blossom",
      "green almond",
      "fresh herb",
      "light pepper",
    ],
    pairings: [
      "crudo di pesce",
      "burrata with lemon zest",
      "steamed mussels",
      "vanilla panna cotta",
    ],
    images: [],
    variants: [
      { id: "shr-250", size: "250ml", price: 2600, sku: "SHR-250", inventory: 14 },
    ],
    tags: ["limited", "bestseller"],
    featured: false,
  },
  {
    id: "lake-garda-delicato",
    name: "Lake Garda Delicato",
    collectionId: "finishing-oils",
    origin: "Riva del Garda, Trentino",
    producer: "Frantoio del Lago",
    harvest: "November 2025",
    shortDescription:
      "From the northernmost olive groves in Italy — impossibly subtle, with almond and fresh grass.",
    description:
      "Olive trees have no business growing this far north, but the microclimate around Lake Garda makes it possible. Frantoio del Lago's Casaliva cultivar produces an oil of extraordinary subtlety — the lightest in our finishing range, almost transparent in colour, with a delicacy that rewards careful attention. It's the oil for people who think they don't like olive oil. We serve it to every sceptic who visits, and it converts most of them.",
    tastingNotes: [
      "blanched almond",
      "fresh-cut grass",
      "pear",
      "mild artichoke",
    ],
    pairings: [
      "carpaccio of sea bass",
      "asparagus with Parmesan",
      "risotto alla milanese",
      "gelato",
    ],
    images: [],
    variants: [
      { id: "lgd-250", size: "250ml", price: 3200, sku: "LGD-250", inventory: 12 },
    ],
    tags: ["new"],
    featured: false,
  },
  {
    id: "arbequina-priorat",
    name: "Arbequina Priorat",
    collectionId: "finishing-oils",
    origin: "Priorat, Catalonia",
    producer: "Mas de la Serra",
    harvest: "November 2025",
    shortDescription:
      "Catalan Arbequina from old vines country — soft, fruity, with a tomato sweetness you won't forget.",
    description:
      "The Priorat is better known for wine, but Mas de la Serra has been pressing Arbequina olives on the same terraced hillsides for decades. The slate soil and dry climate produce an Arbequina with more concentration than the typically mild cultivar allows — there's a distinct ripe-tomato sweetness alongside the usual green-apple fruit, and a body that surprises. It finishes clean and quick. We use it on everything from toast to ice cream.",
    tastingNotes: [
      "ripe tomato",
      "green apple",
      "toasted almond",
      "mild banana",
    ],
    pairings: [
      "pan con tomate",
      "manchego and quince",
      "grilled prawns",
      "chocolate mousse",
    ],
    images: [],
    variants: [
      { id: "ap-250", size: "250ml", price: 2200, sku: "AP-250", inventory: 20 },
      { id: "ap-500", size: "500ml", price: 3600, sku: "AP-500", inventory: 8 },
    ],
    tags: [],
    featured: false,
  },
  {
    id: "ogliarola-del-vulture",
    name: "Ogliarola del Vulture",
    collectionId: "finishing-oils",
    origin: "Monte Vulture, Basilicata",
    producer: "Tenuta Vulture",
    harvest: "November 2025",
    shortDescription:
      "Volcanic soil, ancient trees, an oil with smoke and spice that tastes like nowhere else.",
    description:
      "Monte Vulture is an extinct volcano in northern Basilicata, and the Ogliarola trees growing on its slopes produce an oil with a character all its own. There's a smoky, almost volcanic mineral note underneath the green fruit, and a spice that's closer to cinnamon than pepper. Tenuta Vulture is a tiny operation — one family, about 800 trees — and we take their entire exportable production each year. It's the strangest oil we sell, and our favourite.",
    tastingNotes: [
      "smoke",
      "cinnamon bark",
      "green olive",
      "mineral",
      "dried herb",
    ],
    pairings: [
      "grilled aubergine with tahini",
      "dark chocolate",
      "slow-cooked pulled pork",
      "aged pecorino",
    ],
    images: [],
    variants: [
      { id: "odv-250", size: "250ml", price: 3500, sku: "ODV-250", inventory: 10 },
    ],
    tags: ["limited"],
    featured: false,
  },
];

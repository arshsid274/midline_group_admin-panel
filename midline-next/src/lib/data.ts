export interface Company {
  name: string
  tags: string[]
  type: string
  desc: string
  link: string | null
  logo?: string
  photo?: string
  video?: string
  photos?: string[]  // secondary + tertiary media for card collage
}

export interface Sector {
  icon: string
  label: string
  title: string
  intro: string
  blurb: string
  companies: Company[]
}

export const MIDLINE_SECTORS: Record<string, Sector> = {
  aviation: {
    icon: '✈',
    label: 'Sector — Aviation',
    title: 'Aviation <em>Services</em>',
    intro: 'Flight is freedom, and efficiency is our altitude.',
    blurb: 'Private jet charter, aircraft management, MRO, and cargo services from Dubai.',
    companies: [
      {
        name: 'Midline Aviation Service',
        tags: ['Dubai South, UAE'],
        type: 'Private Aviation',
        logo: '/assets/logos/midline-aviation.png',
        photo: '/assets/companies/midline-aviation/photo1.jpg',
        // The newer Company_Aviation clip — drives the "For The Best Quality"
        // reveal on /companies/midline-aviation-service.
        video: '/assets/companies/midline-aviation/video.mov',
        // Slot order = render order: [primary image, secondary image, tertiary video].
        // card-video.mov is the older sector-tour clip used in the card stack.
        photos: [
          '/assets/companies/midline-aviation/photo1.jpg',
          '/assets/companies/midline-aviation/photo2.jpg',
          '/assets/companies/midline-aviation/card-video.mov',
        ],
        desc: 'Award-winning Dubai-based private aviation company offering jet charter, aircraft management, aircraft sales, MRO, and air cargo. Fleet includes the Embraer Legacy 650, Gulfstream G450, and Gulfstream G200 — serving corporate, VIP, and government clients worldwide.',
        link: 'https://midlineaviation.com',
      },
    ],
  },
  construction: {
    icon: '🏗',
    label: 'Sector — Construction',
    title: 'Construction <em>& Contracting</em>',
    intro: 'We lay foundations for homes, cities, and legacies — building with foresight and delivering with strength.',
    blurb: 'General contracting, architecture, civil engineering, and real estate across UAE.',
    companies: [
      {
        name: 'Midline Trend Building Contracting LLC',
        tags: ['UAE', 'Est. 2024'],
        type: 'General Contracting',
        logo: '/assets/logos/midline-trend.png',
        desc: 'Fast-growing UAE construction group delivering residential, commercial, and industrial projects since 2024 — with a structured execution model covering site preparation, structural works, and finishing, backed by civil engineers, project supervisors, and skilled technical teams.',
        link: null,
      },
      {
        name: 'Saegon Contraction LLC',
        tags: ['UAE', 'Est. 2016'],
        type: 'General Contracting',
        logo: '/assets/logos/saegon.png',
        desc: 'UAE building contractor since 2016 delivering residential, commercial, and industrial projects nationwide with a 200+ skilled workforce — masons, steel fixers, carpenters, site technicians, and supervisors — backed by experienced engineers, structured execution teams, and strict adherence to UAE construction regulations, material quality control, and on-site safety standards.',
        link: null,
      },
      {
        name: 'Handasiah Consultant Arch Civilion LLC',
        tags: ['UAE'],
        type: 'Architecture & Civil Consulting',
        logo: '/assets/logos/handasiah.png',
        desc: 'Multidisciplinary engineering consultancy providing architectural, structural, MEP, interior, and landscape design services — bridging concept design with on-site execution and serving as the technical design authority within the Midline construction ecosystem.',
        link: null,
      },
      {
        name: 'Al Sarh Engineering Consultant',
        tags: ['UAE', 'Est. 2023'],
        type: 'Multidisciplinary Engineering Consultancy',
        logo: '/assets/logos/al-sarh.png',
        desc: 'UAE engineering consultancy founded in 2023 delivering integrated architectural, structural, interior, and landscape design alongside on-site engineering supervision for residential, commercial, and mixed-use developments — combining conceptual design, authority submission drawings, multidisciplinary coordination, quality-assurance inspections, and construction-feasibility optimisation under one roof.',
        link: null,
      },
      {
        name: 'Majestic Elite Properties',
        tags: ['Dubai, UAE', 'Marina Royale Tower'],
        type: 'Real Estate Investment & Asset Management',
        desc: 'Dynamic UAE real estate group covering buying, selling, leasing, and full property management of residential and commercial assets — including a self-owned portfolio of premium residential towers headlined by Marina Royale Tower in Dubai Marina, with a customer-centric model serving investors, owners, and tenants alongside long-term asset and portfolio optimisation.',
        link: null,
      },
    ],
  },
  food: {
    icon: '🍊',
    label: 'Sector — Food Industry',
    title: 'Food <em>Industry</em>',
    intro: 'From the heart of production to the hands of families — feeding communities with quality and care.',
    blurb: 'Food trading, manufacturing, juice, dairy, pasta, and bottled water production.',
    companies: [
      {
        name: 'Flavour Food Trading LLC',
        tags: ['Dubai, UAE'],
        type: 'Food Trading & Industrial Solutions',
        logo: '/assets/logos/flavour-food.png',
        desc: 'UAE-based international food trading and industrial solutions company — supplying raw materials (juice concentrates, milk powder, agricultural commodities) alongside turnkey production lines for oil, tomato paste, pasta, poultry, and tuna. Partners include Lactalis, FrieslandCampina, Döhler, and Fava S.p.A.',
        link: 'https://www.flavorfooduae.com',
      },
      {
        name: 'Acacus Juice and Milk Factory',
        tags: ['Benghazi, Libya', 'Est. 2024'],
        type: 'Juice & Dairy Manufacturing',
        logo: '/assets/logos/acacus.png',
        desc: 'ISO 22000 & ISO 9001 certified food manufacturer in Benghazi producing 7 juice flavors, full-cream and skimmed dairy, flavored and evaporated milk, edible oils, and canned tuna — using advanced UHT pasteurization and fully automated production lines.',
        link: null,
      },
      {
        name: 'Shahd Al Madina',
        tags: ['UAE', 'FMCG'],
        type: 'Food & Beverage Manufacturing',
        logo: '/assets/logos/shahd.png',
        desc: 'UAE-based food and beverage manufacturer producing fruit juices, flavored milk, evaporated milk, and canned tuna for regional and international FMCG markets — built on strict hygiene protocols, standardised production lines, and international food-safety compliance, serving retail, wholesale, export, and institutional buyers.',
        link: null,
      },
      {
        name: 'Libyan Al-Aws to Import Foodstuffs',
        tags: ['Benghazi, Libya'],
        type: 'Food Import & Distribution',
        logo: '/assets/logos/libyan-alaws.png',
        desc: 'Benghazi-based food import company with 6M LYD capital, serving restaurants, hotels, hospitals, supermarkets, and institutions across Libya — backed by temperature-controlled warehousing and a modern distribution fleet covering major Libyan cities.',
        link: null,
      },
      {
        name: 'Elbasateen Food Industries',
        tags: ['Benghazi, Libya', 'Est. 2006'],
        type: 'Canned Food Manufacturing',
        logo: '/assets/logos/elbasateen.png',
        desc: 'Established Libyan canned food manufacturer since 2006 producing 30,000 cans/day under the "Saed" brand — fava beans, chickpeas, harissa, and tomato paste using integrated Osmanli Makina production lines with nationwide retail distribution.',
        link: null,
      },
      {
        name: 'Saif Pasta Factory',
        tags: ['Benghazi, Libya', 'Est. 2006'],
        type: 'Pasta Manufacturing',
        logo: '/assets/logos/saif-pasta.png',
        desc: 'Benghazi pasta factory since 2006 with 17.5 tons/day capacity, manufacturing penne, macaroni, and specialty short pasta shapes using automated production lines with precision drying and high-performance packaging systems.',
        link: null,
      },
      {
        name: 'Al-Dabousiya Mineral Water Bottling Company',
        tags: ['Libya', 'Est. 2018'],
        type: 'Mineral Water Bottling',
        logo: '/assets/logos/aldabousiya.png',
        desc: 'Libyan mineral water bottling company since 2018 producing naturally sourced, premium-quality drinking water — operating under ISO 9001, ISO 22000, GMP, and HACCP standards with UV plus ozone twin sterilisation, a fully automated bottling line, and an in-house microbiological lab for continuous quality testing.',
        link: null,
      },
      {
        name: 'Maraina Al-Khadra for Feed Industry Co.',
        tags: ['Libya'],
        type: 'Animal Feed Manufacturing',
        logo: '/assets/logos/maraina.png',
        desc: 'Libya-based animal feed company (brand: Green Pastures) delivering scientifically formulated balanced feed, custom nutritional programs, and expert consultancy services for livestock and poultry producers — with a focus on farm efficiency and food security.',
        link: 'https://green.maraina.com.ly',
      },
    ],
  },
  oilgas: {
    icon: '⛽',
    label: 'Sector — Oil & Gas',
    title: 'Oil <em>& Gas Services</em>',
    intro: 'Oil powers progress, and we fuel that momentum — safely, sustainably, and strategically.',
    blurb: 'Petroleum services, exploration support, logistics and supply chain management.',
    companies: [
      {
        name: 'Arco Oil and Gas',
        tags: ['UAE', 'Global'],
        type: 'Oilfield Services & Industrial Supply',
        logo: '/assets/logos/arco.jpg',
        desc: 'Global oilfield and industrial solutions provider supplying drilling rigs, wellheads, OCTG, compressors, valves, pumps, and downhole equipment — with an international sourcing network spanning China, UK, Turkey, Italy, Spain, France, and Libya.',
        link: 'https://www.arcooilgas.com',
      },
    ],
  },
  perfumes: {
    icon: '✨',
    label: 'Sector — Perfumes & Cosmetics',
    title: 'Perfumes <em>& Beauty</em>',
    intro: 'A fragrance is more than a scent — it is memory, presence, and identity.',
    blurb: 'Luxury Arabic and French fragrances, present in 7+ countries worldwide.',
    companies: [
      {
        name: 'Ard Al Teeb W Al Jamal Perfumes Trading LLC',
        tags: ['Dubai, UAE', 'Est. 2007'],
        type: 'Luxury Perfumes',
        logo: '/assets/logos/ard-alteeb-uae.png',
        desc: 'Luxury Arabic-French fragrance house established in 2007, blending oriental heritage with French craftsmanship. Present in 7+ countries with flagship outlets in Dubai and Umm Al Quwain — offering exclusive oud-based and contemporary collections for retail and wholesale markets.',
        link: 'https://ardalteeb.com',
      },
      {
        name: 'Ard Alteeba & Aljamal',
        tags: ['Benghazi, Libya', 'Est. 2017'],
        type: 'Perfumes & Cosmetics',
        logo: '/assets/logos/ard-alteeb-libya.png',
        desc: "Libya's leading beauty and fragrance retailer since 2017, with 150+ retail points nationwide and 100+ products — carrying brands including Ard Al Teeb, Louis Marly, and Aurora, alongside cosmetics lines Alix Avien Paris, Callista, and MUA across all major Libyan cities.",
        link: null,
      },
    ],
  },
  furniture: {
    icon: '🛋',
    label: 'Sector — Furniture',
    title: 'Al Sanidan <em>Furniture</em>',
    intro: 'Where every room tells a story — premium Turkish-crafted furniture for UAE homes.',
    blurb: 'Premium Turkish-crafted furniture for homes across Dubai and Sharjah, UAE.',
    companies: [
      {
        name: 'Al Sanidan Furniture Showroom',
        tags: ['Sharjah, UAE'],
        type: 'Premium Furniture Retail',
        logo: '/assets/logos/al-sanidan.png',
        desc: 'Premium Sharjah furniture showroom offering bedroom, dining, and living room collections — featuring signature Turkish-crafted sets including Bugatti, Milan, Oslo, Lorenzo, and Sahara, with sustainable materials, bespoke customization, and free interior design consultation.',
        link: null,
      },
    ],
  },
  spareparts: {
    icon: '🔧',
    label: 'Sector — Spare Parts',
    title: 'Auto <em>Spare Parts</em>',
    intro: 'Credibility, quality, trust, and guarantee — supplying parts across the UAE and worldwide.',
    blurb: 'Auto spare parts for Japanese, Korean, and American vehicles — ISO certified.',
    companies: [
      {
        name: 'ARC Auto Spare Parts Trading LLC',
        tags: ['Dubai, UAE'],
        type: 'Auto Spare Parts Trading',
        logo: '/assets/logos/arc-auto.png',
        desc: 'UAE-based global auto spare parts trading company connecting international manufacturers with markets across the Middle East — supplying engine components, suspension, body parts, electrical systems, lubricants, and timing systems for Japanese, Korean, and American vehicles.',
        link: 'https://arc-autoparts.com',
      },
      {
        name: 'Almutakbal Alsheesh Ltd',
        tags: ['Benghazi, Libya', 'Est. 2020'],
        type: 'Auto Spare Parts & Service',
        logo: '/assets/logos/almutakbal.png',
        desc: 'Benghazi-based automotive company with 5 branches offering spare parts wholesale and retail alongside a full service center — covering mechanical repairs, electrical diagnostics, bodywork, tire services, and wheel alignment for all vehicle types.',
        link: null,
      },
    ],
  },
  pharma: {
    icon: '💊',
    label: 'Sector — Pharmaceutical',
    title: 'Pharma <em>Industry</em>',
    intro: 'Investing in health means investing in people.',
    blurb: 'Pharmaceutical manufacturing and distribution across UAE and Libya.',
    companies: [
      {
        name: 'Trivix',
        tags: ['UAE'],
        type: 'Healthcare Trading & Distribution',
        logo: '/assets/logos/trivix.png',
        desc: 'UAE-based multi-segment healthcare trading company distributing pharmaceutical medicines, health supplements, baby care essentials, and surgical/hospital equipment — serving pharmacies, hospitals, wholesalers, and institutional healthcare providers across regional and international markets.',
        link: null,
      },
      {
        name: 'Al Shifa',
        tags: ['Benghazi, Libya'],
        type: 'Pharmaceutical Distribution',
        logo: '/assets/logos/al-shifa.png',
        desc: 'Libya-registered pharmaceutical distributor with branches in Benghazi, Tripoli, and Misrata — supplying prescription medicines, OTC products, and medical consumables to hospitals, clinics, and pharmacies nationwide through certified cold-chain warehousing and a professional field team.',
        link: 'https://shifaa-pharma.com',
      },
    ],
  },
}

export const MIDLINE_STRUCTURE: Array<{
  key: string
  name: string
  markets: string
  companies: string[]
}> = [
  { key: 'aviation', name: 'Aviation', markets: 'UAE', companies: ['Midline Aviation Service'] },
  {
    key: 'oilgas',
    name: 'Oil & Gas Service',
    markets: 'UAE',
    companies: ['Arco Oil and Gas'],
  },
  {
    key: 'food',
    name: 'Food Industry',
    markets: 'UAE, Libya',
    companies: [
      'Flavour Food Trading LLC',
      'Acacus Juice and Milk Factory',
      'Shahd Al Madina',
      'Libyan Al-Aws to Import Foodstuffs',
      'Elbasateen Food Industries',
      'Saif Pasta Factory',
      'Al-Dabousiya Mineral Water Bottling Company',
      'Maraina Al-Khadra for Feed Industry Co.',
    ],
  },
  {
    key: 'construction',
    name: 'Construction',
    markets: 'UAE',
    companies: [
      'Midline Trend Building Contracting LLC',
      'Saegon Contraction LLC',
      'Handasiah Consultant Arch Civilion LLC',
      'Al Sarh Engineering Consultant',
      'Majestic Elite Properties',
    ],
  },
  {
    key: 'pharma',
    name: 'Pharma Industry',
    markets: 'UAE, Libya',
    companies: ['Trivix', 'Al Shifa'],
  },
  {
    key: 'spareparts',
    name: 'Spare Parts',
    markets: 'UAE',
    companies: ['ARC Auto Spare Parts Trading LLC', 'Almutakbal Alsheesh Ltd'],
  },
  {
    key: 'perfumes',
    name: 'Perfume & Cosmetics',
    markets: 'UAE',
    companies: ['Ard Al Teeb W Al Jamal Perfumes Trading LLC', 'Ard Alteeba & Aljamal'],
  },
  {
    key: 'furniture',
    name: 'Al Sanidan Furniture',
    markets: 'UAE',
    companies: ['Al Sanidan Furniture Showroom'],
  },
]

export const GLOBAL_PRESENCE = [
  { flag: '🇦🇪', country: 'UAE', role: 'Headquarters', isHQ: true },
  { flag: '🇱🇾', country: 'Libya', role: 'Regional Hub', isHQ: false },
  { flag: '🇬🇧', country: 'UK', role: 'European Office', isHQ: false },
  { flag: '🇪🇸', country: 'Spain', role: 'European Market', isHQ: false },
  { flag: '🇹🇷', country: 'Turkey', role: 'Strategic Partner', isHQ: false },
  { flag: '🇮🇹', country: 'Italy', role: 'European Market', isHQ: false },
  { flag: '🇨🇳', country: 'China', role: 'Asia-Pacific', isHQ: false },
  { flag: '🇨🇦', country: 'Canada', role: 'North America', isHQ: false },
  { flag: '🇺🇸', country: 'USA', role: 'North America', isHQ: false },
]

export function companySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export interface CompanyLookup {
  company: Company
  sectorSlug: string
  sectorTitle: string
}

export function getCompanyBySlug(slug: string): CompanyLookup | null {
  for (const [sectorSlug, sector] of Object.entries(MIDLINE_SECTORS)) {
    const company = sector.companies.find((c) => companySlug(c.name) === slug)
    if (company) {
      return {
        company,
        sectorSlug,
        sectorTitle: sector.title.replace(/<[^>]*>/g, ''),
      }
    }
  }
  return null
}

export function getAllCompanySlugs(): string[] {
  return Object.values(MIDLINE_SECTORS).flatMap((s) => s.companies.map((c) => companySlug(c.name)))
}

export const SITE_META = {
  name: 'Midline Investment',
  tagline: 'Midline Investment LLC is a multi-sector holding group providing integrated solutions across trade, industry, energy, mobility, property, and consumer markets.',
  address: 'Burlington Tower – 410, Marasi Drive, Business Bay, Dubai, UAE',
  phone: '+971 4 548 8762',
  email: 'info@midline-investment.com',
  hours: 'Mon – Sat: 9:00 AM – 6:00 PM',
}

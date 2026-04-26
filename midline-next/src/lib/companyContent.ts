/**
 * Per-company content for CompanyInfoPages.
 * Keyed by the slug returned by `companySlug()` in data.ts.
 *
 * Companies WITHOUT an entry here will fall back to the Ssangyong placeholder
 * copy that ships with the page template — that's intentional, the placeholders
 * stay so the page still renders while content is being authored.
 */

export interface PortfolioFact {
  stat: string
  title: string
  body: string
}

export interface CompanyContent {
  /** Big italic line under the page title in the hero. */
  tagline?: string
  /** Two paragraphs that fill the right column of `sec_enc`. */
  overview: [string, string?]
  /** Italic subtitle under the "For The Best Quality" heading (defaults
   *  to the Ssangyong placeholder "With more masterpieces of Ssangyong…"). */
  qualitySubtitle?: string
  /** sec_quality clip_wrap headline (defaults to Ssangyong copy). */
  missionHeading?: string
  /** sec_quality clip_wrap body. */
  missionBody?: string
  /** Up to five cards in `sec_portfolio` (stat + title + body). */
  facts?: PortfolioFact[]
  /** Body copy under the "Do You Know That?" heading. Overrides the
   *  Ssangyong placeholder ("Based on creative passion and challenges
   *  for beauty…") so it can read in the company's own voice. */
  knowThatBody?: string
  /** Vision quote shown in `sec_wonder` instead of the default tagline. */
  visionQuote?: string
}

export const COMPANY_CONTENT: Record<string, CompanyContent> = {
  'midline-aviation-service': {
    tagline: 'Luxury private aviation, redefined from Dubai.',
    overview: [
      'Midline Aviation is a Dubai-based, award-winning private aviation company specialising in luxury private jet services, aircraft management, and aviation solutions. Headquartered in Dubai South Business Park, the company operates at the heart of one of the world\'s fastest-growing aviation hubs.',
      'We combine operational precision with personalised luxury — delivering seamless, safe, and efficient journeys tailored to elite clients and global businesses. Every flight is designed to exceed expectations, transforming travel into a bespoke experience.',
    ],
    qualitySubtitle:
      'Every aircraft, every crew, every flight — engineered to the highest international standards of safety, comfort, and operational precision.',
    missionHeading: 'Aviation as a refined experience.',
    missionBody:
      'More than transportation — we deliver luxury without compromise, absolute reliability, personalised client-centric solutions, and complete operational discretion. From private jet charter to MRO and global cargo logistics, every detail is engineered around the passenger.',
    facts: [
      {
        stat: 'Fleet 3',
        title: 'Long-range, intercontinental, mid-size',
        body:
          'Embraer Legacy 650, Gulfstream G450, and Gulfstream G200 — covering long-range luxury, intercontinental performance, and efficient regional travel with advanced aviation technology and maximum safety.',
      },
      {
        stat: '24/7',
        title: 'Dedicated flight coordination',
        body:
          'Tailored onboard services, discreet and confidential operations, and round-the-clock support. Effortless, efficient, and memorable luxury travel for executives, HNWIs, and government clients.',
      },
      {
        stat: 'MRO',
        title: 'Certified maintenance & technical support',
        body:
          'Full operational management of privately owned aircraft — crew, scheduling, regulatory compliance, preventive maintenance, and inspections that keep every airframe at peak performance.',
      },
      {
        stat: 'Global',
        title: 'Worldwide flight capability',
        body:
          'Seamless connectivity across continents serving corporate executives, high-net-worth individuals, government and VIP clients, and international businesses.',
      },
      {
        stat: 'Cargo',
        title: 'Secure, efficient air freight',
        body:
          'Global logistics capabilities with real-time tracking and operational reliability — the same precision applied to passenger flights extended to time-critical cargo.',
      },
    ],
    visionQuote:
      'To become a globally recognised leader in private aviation, setting new standards in luxury, safety, and personalised air travel.',
    knowThatBody:
      'Built on operational precision and uncompromising luxury, Midline Aviation transforms every journey into a bespoke experience — engineered for executives, governments, and global businesses who demand absolute reliability in the skies.',
  },

  'arco-oil-and-gas': {
    tagline: 'Integrated oilfield and industrial supply, globally sourced.',
    overview: [
      'ARCO Oil Service is a globally oriented oilfield and industrial solutions provider, delivering high-value integrated services to the oil and gas sector. Built on technical expertise, international sourcing strength, and operational excellence — a trusted partner to energy operators and industrial clients worldwide.',
      'With a presence across China, the United Kingdom, Turkey, Italy, Spain, France, and Libya, ARCO combines global reach with regional responsiveness, ensuring seamless execution, efficient procurement, and consistent quality standards.',
    ],
    missionHeading: 'Strategic procurement, world-class delivery.',
    missionBody:
      'Optimised sourcing strategies, competitive pricing, quality assurance, and reliable delivery — built on precision, transparency, and operational efficiency. Long-term partnerships rooted in trust, performance, and adherence to the highest HSE and quality standards.',
    facts: [
      {
        stat: '7 countries',
        title: 'Global sourcing network',
        body:
          'Operations across China, the UK, Turkey, Italy, Spain, France, and Libya — optimised procurement, diversified sourcing, and timely delivery across regions.',
      },
      {
        stat: 'OCTG',
        title: 'Drilling, casing & wellhead',
        body:
          'Complete drilling rig packages, wellhead assemblies, pressure control systems, OCTG (casing, tubing, drill pipe), and downhole equipment — all from vetted global OEMs.',
      },
      {
        stat: 'Industrial',
        title: 'Compressors, generators, valves',
        body:
          'Industrial compressors, gas handling equipment, diesel and gas power generation, valves, actuators, flow control, pumps, and fluid handling — engineered for reliability.',
      },
      {
        stat: 'HSE',
        title: 'Strict safety standards',
        body:
          'Health, safety, environment, and sustainability built into every operation — safe working environments, environmental responsibility, sustainable practices.',
      },
      {
        stat: 'QA',
        title: 'Quality assurance system',
        body:
          'Continuous improvement, supplier evaluation, and full compliance with global industry standards — every component traceable, every delivery accountable.',
      },
    ],
    qualitySubtitle:
      'Every component, every shipment, every project — sourced through certified global OEMs and delivered with operational reliability and HSE precision.',
    knowThatBody:
      'From drilling rigs and wellheads to OCTG, valves, pumps, and downhole tools — ARCO sources from China, the UK, Turkey, Italy, Spain, France, and Libya, bridging global supply with regional energy operators worldwide.',
    visionQuote:
      'To be a globally recognised leader in oilfield services and industrial supply solutions — distinguished by excellence, integrity, and innovation.',
  },

  'arc-auto-spare-parts-trading-llc': {
    tagline: 'The bridge between global supply and local automotive demand.',
    overview: [
      'ARC Auto Spare Parts Trading L.L.C is a premier auto spare parts trading company, serving as a vital link between world-renowned manufacturers and businesses that rely on high-quality automotive solutions.',
      'Headquartered in the United Arab Emirates, ARC operates as a strategic procurement and supply chain partner — enabling clients across the Middle East and international markets to access a dependable and diverse portfolio of automotive components.',
    ],
    missionHeading: 'Reliable parts. Reduced downtime.',
    missionBody:
      'Beyond traditional trading: seamless sourcing from trusted international manufacturers, efficient logistics and distribution networks, reliable availability of critical components, and reduced operational downtime for every client.',
    facts: [
      {
        stat: 'Engine',
        title: 'Pistons, crankshaft, cooling',
        body:
          'Pistons, rings, crankshaft components, gaskets and sealing systems, fuel system and cooling components — meeting international automotive standards.',
      },
      {
        stat: 'Suspension',
        title: 'Struts, control arms, mounts',
        body:
          'Shock absorbers and struts, control arms and linkages, bushings and mounts — sourced from certified manufacturers for consistent performance.',
      },
      {
        stat: 'Body',
        title: 'Panels & structural components',
        body:
          'Panels, bumpers, fittings, structural and replacement components, restoration and maintenance accessories — precision-fit for modern fleets.',
      },
      {
        stat: 'Electrical',
        title: 'Sensors, ECUs, lighting',
        body:
          'Sensors and control units, wiring and connectors, lighting systems and electronic modules — for diagnostic precision and reliable performance.',
      },
      {
        stat: 'Lubricants',
        title: 'Premium oils & timing systems',
        body:
          'Engine protection lubricants, performance-enhancing oils, timing belts, tensioners, pulleys, bushes and supporting components — reduced wear, optimised efficiency.',
      },
    ],
    qualitySubtitle:
      'Every part, every shipment, every workshop — sourced from certified manufacturers and delivered with consistency, authenticity, and dependable supply chain reliability.',
    knowThatBody:
      'From Dubai to workshops, retailers, and fleet operators across the Middle East and beyond, ARC bridges global manufacturers and local automotive demand with engine, suspension, body, electrical, and timing components for modern vehicles.',
    visionQuote:
      'To become a leading global automotive spare parts trading company — recognised for innovation, reliability, and excellence in supply chain solutions.',
  },

  'almutakbal-alsheesh-ltd': {
    tagline: 'Libya\'s growing automotive aftermarket force.',
    overview: [
      'Almutakbal Alsheeh Ltd is a specialised automotive business in Libya, focused on the trade of modern auto spare parts and the delivery of comprehensive vehicle maintenance services. Established in Benghazi in 2020 with a single branch, the company now operates 5 branches across the city by 2026.',
      'A proud member of Midline Holding Group within the Spare Parts Division alongside ARC Auto Spare Parts (UAE) — together they form Midline\'s automotive supply and services arm, covering both UAE and Libyan markets with international sourcing networks and procurement expertise.',
    ],
    missionHeading: 'End-to-end automotive solutions, under one roof.',
    missionBody:
      'Wholesale and retail spare parts, a fully equipped service centre for modern vehicles, bodywork, mechanical and electrical diagnostics, tire services, and wheel alignment — built on consistent service quality and customer trust across Benghazi.',
    facts: [
      {
        stat: '5 branches',
        title: 'Benghazi network',
        body:
          'A 5-branch presence in Benghazi ensures wide geographic coverage and fast access to parts and services across the city — backed by Midline Holding Group regional expertise.',
      },
      {
        stat: 'Service',
        title: 'Full automotive centre',
        body:
          'Bodywork (dent and painting), mechanical repairs, electrical diagnostics, tire services, wheel alignment and balancing — all executed by trained specialists.',
      },
      {
        stat: 'Inventory',
        title: 'Engine, suspension, brakes',
        body:
          'Comprehensive stock for individual vehicle owners and fleet operators — engine parts, suspension and steering, body parts, electrical components, lubricants, and complete brake systems.',
      },
      {
        stat: 'Tires',
        title: 'Wheel alignment & balancing',
        body:
          'Tire supply for passenger and commercial vehicles, wheel alignment and balancing, rim and wheel accessories — full service across all 5 branches.',
      },
      {
        stat: 'Group',
        title: 'Midline Holding backing',
        body:
          'Access to international sourcing networks and procurement expertise through Midline Holding Group — bridging global automotive supply chains with local Libyan demand.',
      },
    ],
    qualitySubtitle:
      'Every part, every repair, every customer — five Benghazi branches delivering genuine spare parts, expert diagnostics, and complete automotive aftermarket service.',
    knowThatBody:
      'From a single Benghazi branch in 2020 to five locations by 2026, Almutakbal Alsheeh delivers spare parts wholesale and retail alongside a full service centre — bodywork, electrical, mechanical, tires, and alignment.',
    visionQuote:
      'To become one of Libya\'s leading companies in automotive spare parts and maintenance — recognised for quality, professionalism, and customer trust.',
  },

  'midline-trend-building-contracting-llc': {
    tagline: 'Building today for a stronger tomorrow.',
    overview: [
      'Midline Trend Building Contracting L.L.C is a fast-growing UAE construction company operating across residential, commercial, and industrial segments since 2024. Despite being a recent entrant, we have rapidly developed a reputation for reliability, technical capability, and structured project execution.',
      'Our long-term vision is to evolve into a fully integrated construction group — delivering end-to-end building solutions backed by strong engineering expertise, modern systems, and scalable operational capacity.',
    ],
    missionHeading: 'Disciplined execution, dependable outcomes.',
    missionBody:
      'Proper planning and engineering coordination, strict adherence to timelines and budgets, continuous site supervision and quality control, transparent communication, and full compliance with UAE construction standards — applied to every project, every site.',
    facts: [
      {
        stat: 'Residential',
        title: 'Quality living spaces',
        body:
          'Residential buildings and housing projects focused on structural safety, modern design execution, and lasting living quality.',
      },
      {
        stat: 'Commercial',
        title: 'Offices, retail, mixed-use',
        body:
          'Commercial buildings including offices, retail spaces, and mixed-use developments — delivered with attention to functionality and architectural standards.',
      },
      {
        stat: 'Industrial',
        title: 'Warehouses & factories',
        body:
          'Construction of warehouses, factories, and industrial facilities designed for operational efficiency and long-term durability.',
      },
      {
        stat: 'GC',
        title: 'General contracting',
        body:
          'Comprehensive contracting covering full project execution — site preparation, structural works, and finishing stages under one accountable team.',
      },
      {
        stat: 'Quality',
        title: 'Safety & execution standards',
        body:
          'Strict adherence to UAE construction quality standards, safe working environments, continuous quality monitoring, and full regulatory compliance.',
      },
    ],
    qualitySubtitle:
      'Every site, every team, every milestone — disciplined planning, structural quality control, and full compliance with UAE construction standards on every project.',
    knowThatBody:
      'From residential developments to commercial offices, retail spaces, warehouses, and industrial facilities — Midline Trend delivers full general contracting across the UAE, backed by civil engineers, project supervisors, and skilled execution teams since 2024.',
    visionQuote:
      'To become a leading construction group in the United Arab Emirates — recognised for high-quality, innovative, and sustainable projects that contribute to national development.',
  },

  'handasiah-consultant-arch-civilion-llc': {
    tagline: 'Engineering the connection between vision and execution.',
    overview: [
      'Handasiah Engineering Consultant — Arch Civillion LLC is a multidisciplinary engineering consultancy based in the United Arab Emirates, providing comprehensive architectural, structural, and MEP engineering services across residential, commercial, and mixed-use developments.',
      'Within a wider group structure, Handasiah serves as the design and engineering intelligence centre — translating concepts into fully coordinated technical solutions, reducing design conflicts during execution, and enhancing buildability and value efficiency.',
    ],
    missionHeading: 'Integrated, coordinated, execution-aware design.',
    missionBody:
      'Design efficiency aligned with construction methodology, engineering precision supported by practical execution logic, cost awareness through value engineering, regulatory compliance and technical validation, and lifecycle performance — every output executable on site without compromise.',
    facts: [
      {
        stat: 'Architecture',
        title: 'Functional, context-driven design',
        body:
          'Architectural solutions aligned with structural and MEP systems, ensuring design coherence, spatial efficiency, and constructability from concept to handover.',
      },
      {
        stat: 'Structural',
        title: 'Safe, optimised, durable',
        body:
          'Structural systems designed for constructability, material efficiency, and long-term performance — engineered with execution realities in mind.',
      },
      {
        stat: 'MEP',
        title: 'Integrated mechanical/electrical/plumbing',
        body:
          'Fully integrated MEP designs ensuring operational efficiency, energy performance, and full regulatory compliance across every system.',
      },
      {
        stat: 'Interior',
        title: 'Spatial & material planning',
        body:
          'Solutions integrating aesthetics with functionality and construction feasibility — including landscape and external environment design that enhances architectural identity.',
      },
      {
        stat: 'Site',
        title: 'Construction supervision',
        body:
          'On-site engineering support ensuring design intent is accurately executed — quality control, technical coordination, and contractor interface management.',
      },
    ],
    qualitySubtitle:
      'Every drawing, every discipline, every site — coordinated architectural, structural, and MEP engineering aligned with UAE regulations and execution realities.',
    knowThatBody:
      'As the design intelligence centre of the Midline construction ecosystem, Handasiah translates concept into fully coordinated architectural, structural, MEP, interior, and landscape engineering — bridging design intent and on-site execution across UAE built-environment projects.',
    visionQuote:
      'To be a leading engineering consultancy within an integrated construction ecosystem in the UAE — delivering coordinated, efficient, buildable engineering that supports high-quality project delivery.',
  },

  'trivix': {
    tagline: 'Trusted healthcare solutions across pharmaceuticals, wellness, and medical care.',
    overview: [
      'TRIVX — Pharmaceutical & Healthcare is a UAE-based international healthcare trading and distribution company specialising in the sourcing and supply of pharmaceutical medicines, consumer healthcare products, supplements, baby care essentials, and medical equipment.',
      'A strategic bridge between global healthcare manufacturers and regional and international markets — a multi-segment healthcare solutions provider integrating pharmaceutical trade, consumer wellness, and medical supply chain distribution under one platform.',
    ],
    missionHeading: 'Reliable healthcare supply, ethically sourced.',
    missionBody:
      'Access to essential medicines and healthcare products, ethical sourcing and responsible distribution, long-term partnerships with global manufacturers, and consistency in quality and service delivery — supporting both clinical and daily life needs.',
    facts: [
      {
        stat: 'Pharma',
        title: 'Branded & generic medicines',
        body:
          'Sourcing and distribution of branded and generic pharmaceutical medicines from internationally recognised manufacturers — to pharmacies, hospitals, and healthcare institutions.',
      },
      {
        stat: 'Wellness',
        title: 'Vitamins & supplements',
        body:
          'Vitamins and dietary supplements, nutritional health products, immunity support formulations, and general wellness solutions — sourced from certified manufacturers.',
      },
      {
        stat: 'Baby Care',
        title: 'Infant nutrition & hygiene',
        body:
          'Baby milk and infant nutrition, diapers and hygiene products, infant care essentials — selected for dermatological safety and international certification compliance.',
      },
      {
        stat: 'Medical',
        title: 'Surgical & hospital equipment',
        body:
          'Surgical instruments and consumables, hospital and clinical equipment, diagnostic and patient monitoring systems, emergency and critical care supplies.',
      },
      {
        stat: 'GMP/GDP',
        title: 'Compliance & quality',
        body:
          'International pharmaceutical sourcing standards, GMP-aligned products, GDP principles, and UAE regulatory and import compliance — every product traceable and authentic.',
      },
    ],
    qualitySubtitle:
      'Every medicine, every supplement, every device — sourced from certified manufacturers under GMP and GDP frameworks for institutional and consumer healthcare.',
    knowThatBody:
      'From prescription medicines and vitamins to baby formula and surgical equipment, Trivix supplies hospitals, pharmacies, wholesalers, and institutional buyers across regional and international markets — a unified UAE platform for pharmaceutical trade and consumer wellness.',
    visionQuote:
      'To become a leading UAE-based healthcare trading and distribution company — recognised for trusted pharmaceutical products, healthcare essentials, and medical solutions across global markets.',
  },

  'flavour-food-trading-llc': {
    tagline: 'Flavor. Quality. Commitment.',
    overview: [
      'Flavor Food Company is a leading supplier of premium raw materials for the food and beverage industry — providing top-quality ingredients for juice, dairy, pasta, and canned food manufacturers, with years of experience and a commitment to long-term partnerships.',
      'Beyond trading, Flavor Food Trading FZE provides complete industrial solutions for food manufacturing facilities — production line machinery and turnkey systems designed for efficiency, hygiene, and scalability across the global food industry.',
    ],
    missionHeading: 'Premium raw materials. Complete production lines.',
    missionBody:
      'High-quality raw materials and finished products, advanced production line technologies, long-term partnerships with global stakeholders like Lactalis, FrieslandCampina, Döhler, Fava, Alapala, Big Dutchman, BK Giulini, and Symrise — supporting growth and efficiency for food manufacturers worldwide.',
    facts: [
      {
        stat: 'Juice',
        title: 'Concentrates & fruit pulp',
        body:
          'Juice concentrates in various flavours, fresh fruit pulp, natural flavours, concentrated milk solids, and ascorbic & citric acid for beverage and processing industries.',
      },
      {
        stat: 'Dairy',
        title: 'Milk powders & UHT',
        body:
          'Skimmed milk, whole milk powder, evaporated milk, and UHT raw materials — for dairy producers and infant nutrition manufacturers.',
      },
      {
        stat: 'Pasta',
        title: 'Semolina & flour',
        body:
          'Premium semolina, premium wheat flour, and supporting raw materials and additives — sourced for consistent quality across pasta production lines.',
      },
      {
        stat: 'Canning',
        title: 'Tuna, tomato, oils',
        body:
          'Fresh and processed tuna, chickpeas and peas, tomato paste, sunflower oil, and corn oil — for canneries and food manufacturers.',
      },
      {
        stat: 'Lines',
        title: 'Turnkey production systems',
        body:
          'Oil, tomato paste, pasta, poultry processing, and tuna canning production lines — full technical and commercial support for setting up or expanding food production facilities.',
      },
    ],
    qualitySubtitle:
      'Every concentrate, every grain, every production line — sourced through Lactalis, FrieslandCampina, Döhler, Fava, Alapala, and Symrise for global food industry partners.',
    knowThatBody:
      'From juice concentrates and milk powder to wheat, sugar, edible oil, and complete tomato-paste, pasta, poultry, and tuna production lines — Flavour Food bridges global manufacturers and Middle East, African, and Asian food industries.',
    visionQuote:
      'To become a globally recognised leader in food trading and industrial solutions — delivering value through quality, reliability, and innovation across the entire food supply chain.',
  },

  'libyan-al-aws-to-import-foodstuffs': {
    tagline: 'Bridging the quality gap in Libya\'s food market.',
    overview: [
      'Al-Aws Libyan Company for Food Import was established in Benghazi with a clear and ambitious vision to bridge the quality gap in the local market. Over the years it has grown into one of the leading businesses in the import and distribution of food products across Libya.',
      'With a capital of 6 million Libyan Dinars, Al-Aws continues to strengthen its position by delivering high-quality products and reliable services to a wide range of customers — restaurants, hotels, supermarkets, and end consumers.',
    ],
    missionHeading: 'Quality, freshness, and a Libya-wide network.',
    missionBody:
      'A wide range of high-quality imported food products at competitive prices, supported by exceptional customer service and a commitment to safety and freshness — built on long-term partnerships with global suppliers and an efficient nationwide logistics network.',
    facts: [
      {
        stat: 'B2B',
        title: 'Restaurants, hotels, hospitals',
        body:
          'Serving restaurants, hotels, cafeterias, hospitals, and educational institutions across Libya with consistent product quality and reliable supply.',
      },
      {
        stat: 'Trade',
        title: 'Wholesale & retail',
        body:
          'Wholesalers, retailers, supermarkets, and hypermarkets — supplied through a strong commercial network that ensures availability across Libya.',
      },
      {
        stat: 'Direct',
        title: 'Outlets & distribution partners',
        body:
          'Reaching end consumers through company outlets and an established distribution partner network — quality products accessible across communities.',
      },
      {
        stat: 'Customs',
        title: 'Import & clearance team',
        body:
          'A specialised, experienced team managing import and customs clearance — ensuring smooth, compliant operations from origin to warehouse.',
      },
      {
        stat: 'Cold-chain',
        title: 'Hygienic, temperature-controlled',
        body:
          'Hygienic storage facilities with controlled temperature systems and a modern delivery fleet covering major Libyan cities — safety and freshness preserved end-to-end.',
      },
    ],
    qualitySubtitle:
      'Every shipment, every cold chain, every delivery — sourced globally and delivered fresh through controlled warehousing and a modern Libyan distribution fleet.',
    knowThatBody:
      'With 6 million LYD capital and a Benghazi base, Al-Aws supplies restaurants, hotels, hospitals, supermarkets, and consumers across Libya — managing import, customs clearance, temperature-controlled storage, and nationwide distribution as a trusted food import partner.',
    visionQuote:
      'To be the leading and most preferred Libyan company in food import — a trusted partner for restaurants, hotels, markets, and consumers seeking quality and excellence.',
  },

  'saif-pasta-factory': {
    tagline: 'Two decades of trusted Libyan pasta.',
    overview: [
      'Saif Pasta Factory, headquartered in Benghazi, Libya, is one of the country\'s most recognised and well-established food manufacturing facilities. Since its founding in 2006, the factory has consistently delivered high-quality pasta products — earning a strong reputation for reliability, consistency, and customer satisfaction.',
      'With nearly two decades of industry experience and a production capacity of 17.5 tons per day, Saif Pasta Factory has grown into a key contributor to Libya\'s food manufacturing sector — supporting local demand and strengthening the country\'s move toward self-sufficiency in essential food products.',
    ],
    missionHeading: 'Modern lines. Strict quality control.',
    missionBody:
      'Automated production systems for improved efficiency, controlled processing environments for uniform quality, precision drying techniques, and high-performance packaging — every product carefully monitored from raw material selection to final inspection before packaging.',
    facts: [
      {
        stat: '17.5T/day',
        title: 'Production capacity',
        body:
          'Continuous output to meet market demand, timely distribution across regions, and scalable infrastructure positioned for future expansion and increased production capabilities.',
      },
      {
        stat: '2006',
        title: 'Nearly two decades',
        body:
          'Operating since 2006 — supporting the local food supply chain, reducing dependence on imported pasta, and contributing to Libya\'s economic development and industrial growth.',
      },
      {
        stat: 'Tube',
        title: 'Penne, macaroni, specialty',
        body:
          'Tube pasta varieties (penne, macaroni), small-cut pasta for soups and traditional dishes, and specialty short pasta shapes — all developed to cook evenly and maintain firmness.',
      },
      {
        stat: 'QC',
        title: 'Multi-stage quality control',
        body:
          'Careful raw material selection, continuous monitoring during processing, final product inspection, and full compliance with recognised food safety standards.',
      },
      {
        stat: 'Pack',
        title: 'Modern packaging solutions',
        body:
          'Packaging designed for product freshness and protection, easy storage and handling, and clear labelling — supporting both retail and wholesale distribution requirements.',
      },
    ],
    qualitySubtitle:
      'Every batch, every shape, every package — automated production, precision drying, and continuous quality control delivering 17.5 tons of pasta daily.',
    knowThatBody:
      'For nearly two decades since 2006, Saif Pasta Factory has produced penne, macaroni, and short-cut pasta varieties for Libyan kitchens — 17.5 tons daily from automated production lines, precision drying systems, and high-performance packaging.',
    visionQuote:
      'To become a leading pasta manufacturer in Libya and a trusted name in the food industry — recognised for quality, reliability, and continuous innovation.',
  },

  'ard-al-teeb-w-al-jamal-perfumes-trading-llc': {
    tagline: 'Where Arabian heritage meets French perfumery.',
    overview: [
      'At Ard Al Teeb, perfumery is not merely a craft — it is an art form that transforms emotions into unforgettable sensory experiences. Since its establishment in 2007, the company has been dedicated to creating timeless fragrances that embody elegance, identity, and individuality.',
      'Built on a clear vision: to redefine Arabic perfumery by blending the rich olfactory heritage of the Middle East with the refined sophistication of French fragrance artistry — creating a distinctive identity that resonates with both traditional fragrance enthusiasts and modern luxury consumers.',
    ],
    missionHeading: 'Fragrance as a personal expression.',
    missionBody:
      'Crafting fragrances that tell a story, preserving the authenticity of oriental perfumery traditions, innovating with modern techniques and global influences, and delivering luxury experiences through every product — each scent designed to be experienced and remembered.',
    facts: [
      {
        stat: '7+ countries',
        title: 'Global presence',
        body:
          'Headquartered in the UAE with expansion to more than seven countries — partnerships, distribution networks, and a growing international customer base.',
      },
      {
        stat: '3 stores',
        title: 'UAE retail flagship',
        body:
          'Two flagship outlets in Dubai and one retail location in Umm Al Quwain — strengthening brand visibility and accessibility in key commercial areas.',
      },
      {
        stat: 'Retail+B2B',
        title: 'Dual business model',
        body:
          'Direct retail engagement through branded stores plus wholesale and distribution to retailers across multiple regions — long-term B2B partnerships and consistent quality.',
      },
      {
        stat: 'Premium',
        title: 'High-end perfumery',
        body:
          'Premium ingredients, oriental richness, modern elegance, deep oud-based compositions, and fresh contemporary blends — every product reflects luxury and individuality.',
      },
      {
        stat: 'Innovation',
        title: 'Creative direction',
        body:
          'Experimentation with unique scent compositions, integration of modern fragrance technologies, and alignment with global trends while preserving heritage — dynamic and competitive.',
      },
    ],
    qualitySubtitle:
      'Every ingredient, every blend, every bottle — composed with premium oriental richness, modern technique, and uncompromising luxury craftsmanship.',
    knowThatBody:
      'Built on the fusion of Arabic olfactory heritage and French perfumery craft, Ard Al Teeb composes oud-rich and contemporary scents — luxury fragrances designed to be experienced, remembered, and worn as personal identity.',
    visionQuote:
      'To redefine luxury perfumery — combining Arabic fragrance heritage with French craftsmanship to create scents that are not only worn, but remembered.',
  },

  'ard-alteeba-and-aljamal': {
    tagline: 'Libya\'s most accessible beauty and fragrance brand.',
    overview: [
      'Founded in 2017, Ard Alteeba & AlGamal was established with a bold vision to lead, innovate, and redefine the beauty and fragrance industry in Libya. Headquartered in Benghazi, the company has grown from a local business into a nationally recognised brand.',
      'Through market insight, dedication, and a commitment to excellence, Ard Alteeba & AlGamal has built a reputation for delivering high-quality beauty and fragrance products that meet the evolving expectations of modern consumers.',
    ],
    missionHeading: 'Beauty and fragrance — accessible nationwide.',
    missionBody:
      'High-quality perfumes and cosmetics with wide market accessibility, exceptional customer service, continuous innovation and growth, and long-term customer satisfaction — well-organised stores, knowledgeable staff, and a seamless customer journey.',
    facts: [
      {
        stat: '150+',
        title: 'Retail points across Libya',
        body:
          '150+ retail points nationwide with presence in all major Libyan cities — strong distribution channels ensuring consistent availability of quality products.',
      },
      {
        stat: '100+',
        title: 'Premium product portfolio',
        body:
          'Over 100 premium products across fragrances and cosmetics — Ard Al Teeb, Wasam, Louis Marly, EBous, Aurora, plus Alix Avien Paris, Callista, and MUA.',
      },
      {
        stat: '5 brands',
        title: 'Fragrance house portfolio',
        body:
          'Ard Al Teeb, Wasam, Louis Marly, EBous, and Aurora — each with unique scent profiles and craftsmanship for a wide range of preferences.',
      },
      {
        stat: 'Beauty',
        title: 'Global cosmetic partners',
        body:
          'Alix Avien Paris, Alix Avien Vegan, Callista, and MUA Makeup Academy — selected for quality, innovation, and alignment with global beauty trends.',
      },
      {
        stat: '2017',
        title: 'A national brand',
        body:
          'Founded in 2017 — built through market insight, dedication, and commitment to excellence into one of Libya\'s most trusted beauty names.',
      },
    ],
    qualitySubtitle:
      'Every product, every store, every customer — curated global brands, well-trained staff, and a consistent standard of beauty across Libya.',
    knowThatBody:
      'From flagship stores in Benghazi to 150+ retail points across every major Libyan city, Ard Alteeba & AlGamal makes premium beauty and fragrance accessible — backed by curated global brands and trusted nationwide service.',
    visionQuote:
      'To become a leading beauty and fragrance company in Libya and the region — recognised for innovation, accessibility, and excellence.',
  },

  'al-dabousiya-mineral-water-bottling-company': {
    tagline: 'Pure, safe, naturally balanced mineral water.',
    overview: [
      'Established in 2018, Al-Dabussia for bottling Mineral Water Company has positioned itself as a trusted provider of premium-quality drinking water — committed to meeting and exceeding international standards of safety, purity, and excellence.',
      'From inception, the company has focused on a product that reflects natural integrity and technological precision, ensuring consistent quality for consumers across all markets it serves. Naturally sourced mineral water with balanced composition, treated through advanced UV and ozone systems, bottled in a fully automated facility.',
    ],
    missionHeading: 'Pure water, engineered for trust.',
    missionBody:
      'ISO 9001 quality management, ISO 22000 food safety, GMP and HACCP frameworks — every stage from sourcing to distribution monitored for product integrity. UV and ozone sterilization deliver crystal-clear, safe, high-quality drinking water without altering the natural mineral profile.',
    facts: [
      {
        stat: 'ISO 9001',
        title: 'Quality management system',
        body:
          'Consistent operational excellence and continuous improvement across every process — sourcing, treatment, bottling, labelling, distribution.',
      },
      {
        stat: 'ISO 22000',
        title: 'Food safety system',
        body:
          'Highest standards of food safety throughout the entire production and supply chain — backed by GMP and HACCP frameworks.',
      },
      {
        stat: 'UV + Ozone',
        title: 'Twin sterilization',
        body:
          'Ultraviolet sterilization eliminates microorganisms without altering composition. Ozone sterilization adds a second disinfection layer for complete contaminant removal.',
      },
      {
        stat: 'Lab',
        title: 'In-facility microbiological testing',
        body:
          'State-of-the-art microbiological lab on site — continuous monitoring, regular microbiological and chemical testing, immediate corrective actions.',
      },
      {
        stat: 'Auto',
        title: 'Fully automated bottling',
        body:
          'Precision filling and sealing, consistency across every product size, high efficiency — automation minimises human intervention and maximises hygiene.',
      },
    ],
    qualitySubtitle:
      'Every bottle, every batch, every drop — UV and ozone-purified mineral water meeting ISO 9001, ISO 22000, GMP, and HACCP food safety standards.',
    knowThatBody:
      'From a fully automated bottling line to in-house microbiological lab and dual UV plus ozone sterilisation, Al-Dabussia delivers naturally sourced mineral water with certified quality at every stage from source to consumer since 2018.',
    visionQuote:
      'To expand our presence in the water industry by increasing production capacity and delivering innovative, high-quality bottled water solutions for modern consumers.',
  },

  'al-sarh-engineering-consultant': {
    tagline: 'Engineering precision. Integrated design. Reliable execution.',
    overview: [
      'Al Sarh Engineering Consultancy is a UAE-based engineering consultancy firm established in 2023, specialising in integrated and multidisciplinary engineering solutions across the built environment sector — comprehensive design, supervision, and consultancy for residential, commercial, and mixed-use developments.',
      'Each project is approached as a coordinated system where architectural, structural, and environmental elements develop in harmony — ensuring functional efficiency, structural integrity, design consistency, regulatory compliance, and construction feasibility.',
    ],
    missionHeading: 'Design intelligence meets execution awareness.',
    missionBody:
      'Conceptual and detailed architectural design, structural analysis, coordinated multidisciplinary development, authority submission, and design optimisation for constructability — every output developed to balance aesthetic identity, structural safety, and functional performance.',
    facts: [
      {
        stat: 'Design',
        title: 'Architectural + structural integration',
        body:
          'Conceptual to detailed architectural design, structural analysis, coordinated multidisciplinary development, authority submissions, and design optimisation for efficiency and constructability.',
      },
      {
        stat: 'Site',
        title: 'Engineering supervision',
        body:
          'Site supervision and technical inspections, quality assurance, contractor coordination, progress tracking, and resolution of technical site issues — controlled execution to engineering standards.',
      },
      {
        stat: 'Interiors',
        title: 'Spatial efficiency + identity',
        body:
          'Space planning, interior concept development, material and finishing selection, lighting and ambiance, and execution-ready detailing — comfort, function, and aesthetic value combined.',
      },
      {
        stat: 'Landscape',
        title: 'Outdoor environment design',
        body:
          'Landscape master planning, soft- and hardscape design, outdoor circulation, environmental integration, and sustainability — outdoor spaces that complement the built form.',
      },
      {
        stat: 'UAE',
        title: 'Regulatory expertise',
        body:
          'Strong understanding of UAE regulatory requirements, multidisciplinary coordination expertise, focus on constructability and execution efficiency, attention to technical detail.',
      },
    ],
    qualitySubtitle:
      'Every drawing, every discipline, every site — architectural, structural, interior, and landscape design coordinated with execution feasibility and UAE regulatory compliance.',
    knowThatBody:
      'From conceptual design and authority submissions to on-site supervision and quality assurance, Al Sarh delivers integrated architectural, structural, interior, and landscape engineering for residential, commercial, and mixed-use UAE developments — all under one roof since 2023.',
    visionQuote:
      'To be a recognised engineering consultancy in the United Arab Emirates — known for innovative, coordinated, and high-quality engineering solutions aligned with international standards.',
  },

  'saegon-contraction-llc': {
    tagline: 'Construction with discipline, reliability, and strength.',
    overview: [
      'SAEGON CONTRACTING L.L.C is a UAE-based building contracting company established in 2016, operating within the country\'s dynamic construction sector. The company has built a solid reputation for delivering reliable, cost-effective, quality-driven construction across residential, commercial, and industrial developments.',
      'With a dedicated workforce of over 200 skilled laborers and technical staff, SAEGON is well-positioned to execute a wide range of construction projects with efficiency, discipline, and technical competence — aligned with UAE regulations, engineering specifications, and client expectations.',
    ],
    missionHeading: 'Disciplined execution, dependable delivery.',
    missionBody:
      'Proper planning and execution sequencing, strict adherence to engineering drawings, continuous site supervision and quality control, coordination between technical teams and workforce, and efficient use of materials — applied consistently across every project, every site.',
    facts: [
      {
        stat: '200+',
        title: 'Skilled workforce',
        body:
          'Masons, carpenters, steel fixers, concrete workers, site technicians, supervisors, and engineers — discipline and on-site safety practices ensure smooth execution.',
      },
      {
        stat: '2016',
        title: 'Established UAE contractor',
        body:
          'Operating since 2016 within the UAE construction sector — solid reputation for reliability, cost-effectiveness, and quality-driven solutions.',
      },
      {
        stat: 'Residential',
        title: 'Building & housing',
        body:
          'Residential building construction with attention to structural safety, modern design execution, and lasting living quality.',
      },
      {
        stat: 'Industrial',
        title: 'Commercial + warehouses',
        body:
          'Commercial buildings, retail spaces, mixed-use developments, warehouses, factories, and industrial facilities — designed for operational efficiency and durability.',
      },
      {
        stat: 'GC',
        title: 'General contracting',
        body:
          'Site preparation, structural works, finishing — comprehensive contracting covering full project execution under one accountable team.',
      },
    ],
    qualitySubtitle:
      'Every site, every team, every project — disciplined planning, structural quality control, and strict adherence to UAE construction regulations on every build.',
    knowThatBody:
      'With 200+ skilled masons, steel fixers, carpenters, and supervisors backed by experienced engineers, Saegon delivers residential, commercial, and industrial construction across the UAE — disciplined site execution and material quality control since 2016.',
    visionQuote:
      'To be a recognised and dependable construction contracting company in the United Arab Emirates — delivering high-quality, reliable, and efficient construction services.',
  },

  'shahd-al-madina': {
    tagline: 'Quality manufacturing. Trusted taste. Everyday nourishment.',
    overview: [
      'Shahd Al Madina is a UAE-based food manufacturing company specialising in high-quality beverages and packaged food products for regional and international markets — juices, flavoured milk, evaporated milk, and canned tuna, all developed for taste consistency, nutritional value, and international quality standards.',
      'Operating with a strong commitment to food safety, product innovation, and reliable production processes, Shahd Al Madina is a growing player in the fast-moving consumer goods sector — serving retail, wholesale, food service, and export markets.',
    ],
    missionHeading: 'Hygienic, scalable, consumer-ready production.',
    missionBody:
      'Strict hygiene protocols in production facilities, raw material quality inspection, standardised manufacturing procedures, regular quality testing and monitoring, and full compliance with international food safety requirements — ensuring every product meets consumer safety expectations.',
    facts: [
      {
        stat: 'Juice',
        title: 'Fruit juices & beverages',
        body:
          'Fruit juices and juice-based beverages with attention to taste consistency, nutritional value, and international quality standards.',
      },
      {
        stat: 'Dairy',
        title: 'Flavoured & evaporated milk',
        body:
          'Flavoured milk and evaporated milk products — long shelf-life, consistent taste, and nutritional value for everyday consumer needs.',
      },
      {
        stat: 'Tuna',
        title: 'Canned seafood',
        body:
          'Canned tuna and seafood products manufactured to FMCG quality standards with secure packaging and long-term stability.',
      },
      {
        stat: 'FMCG',
        title: 'Multi-channel reach',
        body:
          'Retail markets, wholesale distributors, export markets, food service, and institutional buyers — positioned for growth across regional and international markets.',
      },
      {
        stat: 'QA',
        title: 'Food safety system',
        body:
          'Strict hygiene protocols, raw material inspection, standardised manufacturing, regular quality testing, and compliance with international food safety requirements.',
      },
    ],
    qualitySubtitle:
      'Every batch, every package, every product — hygienic manufacturing, raw-material inspection, and continuous quality testing across juices, dairy, and canned tuna.',
    knowThatBody:
      'From fruit juices and flavored milk to evaporated milk and canned tuna, Shahd Al Madina delivers consistent FMCG food and beverage products to retail, wholesale, export, and institutional markets — built on strict food-safety compliance and reliable production.',
    visionQuote:
      'To be a recognised food manufacturing brand in the UAE and international markets — delivering trusted, high-quality, and affordable FMCG food products.',
  },

  'al-sanidan-furniture-showroom': {
    tagline: 'Crafting Spaces. Defining Lifestyles.',
    overview: [
      'Aasandian Furniture is a premium furniture brand dedicated to designing and manufacturing high-quality, elegant, and functional furniture that transforms living spaces into refined lifestyle environments. Based in Sharjah, UAE.',
      'Combining timeless craftsmanship with modern innovation — offering bespoke furniture solutions that reflect aesthetic sophistication and everyday practicality, serving residential, commercial, and hospitality clients.',
    ],
    missionHeading: 'Furniture as a reflection of lifestyle.',
    missionBody:
      'Design excellence with timeless appeal, functional innovation that enhances usability and comfort, and sustainable craftsmanship using responsible, long-lasting materials — every piece designed to elevate interiors while ensuring durability and practicality.',
    facts: [
      {
        stat: '11',
        title: 'Signature collections',
        body:
          'Bugatti, Zara, Sahara, Lorenzo, Beyonce, Aura, Milan, Oslo, Madrid, Floransa, and Hera — each with a unique design language and coordinated furniture sets.',
      },
      {
        stat: '60%+',
        title: 'Reclaimed timber',
        body:
          'Reclaimed Soul: 60%+ timber sourced from reclaimed structures — preserving history through sustainable design, alongside zero-toxin organic pigments and natural beeswax finishes.',
      },
      {
        stat: 'Bespoke',
        title: 'Custom-made furniture',
        body:
          'Bespoke furniture tailored to individual style and space, premium materials, hand-finishing, and durable construction — for residential, office, hospitality, and commercial interiors.',
      },
      {
        stat: '28+ yrs',
        title: 'Master wood artisan',
        body:
          'Led by Arjun Mehta, master wood artisan with 28+ years of experience — combining traditional handcrafted techniques with modern precision for superior craftsmanship.',
      },
      {
        stat: 'Service',
        title: 'Free interior design support',
        body:
          'End-to-end customer support from consultation to delivery, warranty assurance, secure payments, and free interior design styling guidance from expert designers.',
      },
    ],
    qualitySubtitle:
      'Every set, every finish, every detail — premium materials, hand-finishing, and durable construction across signature collections like Bugatti, Milan, Oslo, and Lorenzo.',
    knowThatBody:
      'From Bugatti and Sahara to Lorenzo, Milan, Oslo, and Madrid — Aasandian Furniture\'s signature collections combine bespoke craftsmanship, premium materials, and free interior design support for residential, commercial, and hospitality clients across Sharjah and the UAE.',
    visionQuote:
      'To become a leading furniture brand in the region — known for innovation, sustainability, and exceptional design.',
  },
  'majestic-elite-properties': {
    tagline: 'Premium UAE real estate, asset management, and investment.',
    overview: [
      'Majestic Elite Properties is a dynamic UAE real estate company specialising in property management, investment, and real estate transactions across the Emirates — delivering comprehensive solutions in buying, selling, leasing, and managing high-value assets for investors, owners, and tenants.',
      'With a growing portfolio of owned residential towers headlined by Marina Royale Tower in Dubai Marina, the company is a trusted name in the UAE real estate sector — offering reliable, professional services anchored in long-term value creation and asset excellence.',
    ],
    qualitySubtitle:
      'Every property, every tenant, every transaction — long-term value, professional management, and a customer-centric model anchored by self-owned premium residential assets.',
    knowThatBody:
      'From Marina Royale Tower in Dubai Marina to a growing portfolio of premium residential properties, Majestic Elite Properties manages buying, selling, leasing, and full asset operations — a UAE real estate partner built around investor and tenant trust.',
  },

  'acacus-juice-and-milk-factory': {
    tagline: 'Libya\'s next-generation food and beverage manufacturer.',
    overview: [
      'Officially inaugurated on February 4, 2024 in Al-Talhiyah, Benghazi, Acacus Juice & Milk Factory is one of Libya\'s most advanced industrial food manufacturing projects — built to strengthen local food security, reduce import dependence, and deliver high-quality locally produced beverages, dairy, oils, and canned goods.',
      'Operating under the Shahd Al-Madina Food Industries Group with ISO 22000:2018 and ISO 9001:2015 certifications, Acacus combines UHT pasteurisation, high-efficiency filling lines, and fully automated production — supporting Libya\'s industrial growth, employment, and consumer self-sufficiency.',
    ],
    qualitySubtitle:
      'Every juice, every dairy carton, every can — UHT pasteurisation, automated filling, and ISO 22000-certified safety across orange, mango, dairy, oils, and tuna.',
    missionHeading: 'High-quality food, locally produced.',
    missionBody:
      'Acacus delivers internationally certified food and beverages from Benghazi — UHT-pasteurised dairy, multi-flavour juices, edible oils, and canned tuna — strengthening Libyan food security, reducing import dependence, and producing safe, nutritious products built on quality, innovation, sustainability, and operational efficiency.',
    facts: [
      {
        stat: '2024',
        title: 'Founded in Benghazi',
        body: 'Officially inaugurated on February 4, 2024 in Al-Talhiyah, Benghazi — one of Libya\'s most advanced food manufacturing projects, backed by the Shahd Al-Madina Food Industries Group.',
      },
      {
        stat: 'ISO 22000 / 9001',
        title: 'Certified safety & quality',
        body: 'ISO 22000:2018 Food Safety Management and ISO 9001:2015 Quality Management — covering hazard control, product consistency, and standardised processes across every line.',
      },
      {
        stat: '7 flavours',
        title: 'Juice production',
        body: 'Orange, mango, guava, grape, pineapple, apple, and cocktail blends — produced through high-efficiency filling lines and UHT pasteurisation for extended shelf life.',
      },
      {
        stat: 'UHT',
        title: 'Advanced manufacturing',
        body: 'Ultra-high-temperature pasteurisation extends shelf life while preserving nutritional value — paired with automated production lines that minimise human intervention for consistent, safe output.',
      },
      {
        stat: 'Multi-category',
        title: 'Food portfolio',
        body: 'Beyond juices and dairy: full-cream, semi-skimmed and skimmed milk; flavored milk (chocolate, strawberry, banana); evaporated milk; sunflower and corn oil; plus tuna and chili tuna — all from one factory.',
      },
    ],
    knowThatBody:
      'From seven juice flavours and full-cream-to-skimmed dairy to flavored milks, evaporated milk, edible oils, and canned tuna, Acacus delivers a multi-category Libyan food portfolio — built on UHT, automation, and international food-safety standards since 2024.',
    visionQuote:
      'To become a leading food manufacturing company in Libya and North Africa — recognised for delivering high-quality products that meet international standards while strengthening consumer confidence in locally produced goods.',
  },

  'elbasateen-food-industries': {
    tagline: 'Libya\'s trusted canned-food manufacturer since 2006.',
    overview: [
      'Established in 2006 and headquartered in Al-Talhiyah, Benghazi (Pharmaceutical Market area, near Al-Ahly Club), Al Basateen Food Industries Company is a leading Libyan canned-food manufacturer producing 30,000 cans per day under the flagship "Saed" brand — fava beans, chickpeas, harissa, tomato paste, and more for nationwide distribution.',
      'With over 18 years of experience, integrated Osmanli Makina production lines, and a complete legumes-canning system, the company combines hygienic processing, modern automation, and trusted brand recognition across both urban and regional Libyan retail markets.',
    ],
    qualitySubtitle:
      'Every can, every harvest, every batch — Osmanli Makina production lines, hygienic processing, and consistent quality across the trusted Saed brand portfolio.',
    missionHeading: 'High-quality canned food, made in Libya.',
    missionBody:
      'Al Basateen produces safe, nutritious, and affordable canned-food products for Libyan consumers — combining careful raw-material selection, hygienic processing, modern automation, and durable packaging. Investing in advanced technology, expanding product lines, and supporting Libyan food security through industrial excellence and trusted local manufacturing.',
    facts: [
      {
        stat: '2006',
        title: 'Founded in Benghazi',
        body: 'Headquartered in Al-Talhiyah, Benghazi — Pharmaceutical Market area near Al-Ahly Club — with strong accessibility to commercial and distribution hubs.',
      },
      {
        stat: '30,000',
        title: 'Cans per day',
        body: 'High-performance machinery delivering continuous, reliable supply at scale — designed for high efficiency, minimal waste, and consistent output across every product line.',
      },
      {
        stat: 'Saed',
        title: 'Flagship brand',
        body: 'All products marketed under the "Saed" brand — known for strong recognition in the Libyan market, wide retail distribution, and a reputation for quality, reliability, and affordability.',
      },
      {
        stat: 'Osmanli Makina',
        title: 'Tomato paste line',
        body: 'Strategic partnership with Osmanli Makina delivering a fully integrated tomato-paste production line — end-to-end processing from fresh tomatoes to finished paste with automated efficiency.',
      },
      {
        stat: 'Multi-product',
        title: 'Canned food portfolio',
        body: 'Fava beans, fava beans with seasoning (Foul Mix), chickpeas, green peas, beans (various types), harissa, and tomato paste — produced through a complete legumes-canning line with consistent hygiene standards.',
      },
    ],
    knowThatBody:
      'From fava beans and chickpeas to harissa, peas, and tomato paste, Al Basateen Food Industries produces 30,000 cans daily under the Saed brand — 18+ years of canning experience supporting Libya\'s food security with modern automation since 2006.',
    visionQuote:
      'To strengthen our position as a leading food manufacturing company in Libya by delivering products that meet international standards while expanding production capabilities and product offerings.',
  },

  'maraina-al-khadra-for-feed-industry-co': {
    tagline: 'Science-driven animal feed for Libyan agriculture.',
    overview: [
      'MARAINA AL-KHADRA, recognised under the brand Green Pastures, is a registered Libyan animal-feed company specialising in scientifically formulated balanced feed, customised nutrition programmes, and consultancy services for livestock and poultry producers across the country.',
      'Built on the principle that nutrition accounts for up to 70% of production costs and 90% of rearing success, Green Pastures combines authenticity, innovation, and sustainability — delivering performance-oriented feed solutions tailored to local breeds and conditions.',
    ],
    qualitySubtitle:
      'Every formulation, every batch, every farm — science-driven nutrition, raw-material quality control, and customised feed solutions tailored to Libyan livestock and poultry.',
    missionHeading: 'Performance-oriented feed for sustainable agriculture.',
    missionBody:
      'Green Pastures delivers scientifically formulated, performance-oriented feed solutions tailored to Libyan livestock and poultry — built on three pillars: authenticity, innovation, and sustainability. Optimising feed efficiency, reducing production costs, and supporting long-term farm profitability through expert consultancy, raw-material quality assurance, and continuous formulation improvement.',
    facts: [
      {
        stat: '70%',
        title: 'Of production cost is feed',
        body: 'Nutrition accounts for up to 70% of production costs and 90% of rearing success — Green Pastures focuses on performance-oriented formulations that maximise efficiency and ROI for livestock and poultry producers.',
      },
      {
        stat: 'Balanced',
        title: 'Complete-nutrition feed',
        body: 'Formulated to meet complete nutritional requirements across multiple livestock and poultry categories — supporting optimal growth, health, and productivity throughout the rearing cycle.',
      },
      {
        stat: 'Custom',
        title: 'Local-breed formulations',
        body: 'Customised feed formulations tailored to local breeds, regional climate challenges, and environmental conditions — optimised for cost-efficiency, productivity, and farm-level performance.',
      },
      {
        stat: 'Advisory',
        title: 'On-farm consultancy',
        body: 'Expert nutritional consultancy covering feed planning, livestock management strategies, and economic optimisation — guiding farmers toward maximum returns and sustainable production.',
      },
      {
        stat: 'QC + R&D',
        title: 'Raw material assurance',
        body: 'High-quality sourcing standards, strict raw-material quality control, advanced formulation techniques, and continuous product development aligned with international best practices.',
      },
    ],
    knowThatBody:
      'From balanced feed for poultry and livestock to customised nutrition programmes and on-farm consultancy, Maraina Al-Khadra (Green Pastures) optimises feed efficiency for Libyan producers — boosting productivity, profitability, and sustainable agricultural growth across the country.',
    visionQuote:
      'To become a leading provider of animal feed solutions in Libya and the region — recognised for excellence in quality, innovation, and sustainable agricultural support.',
  },

  'abco': {
    tagline: 'Drilling, procurement, and engineering for the energy sector.',
    overview: [
      'Al Bareqa Co (ABCO) is a Dubai-based oil and gas company specialising in drilling operations, well maintenance, procurement, and engineering consultancy services — operating from Burlington Tower in Business Bay with focused activity across Libya\'s upstream sector.',
      'Backed by partnerships with global industry leaders including Sinopec, Kerui Group, Coenesp, Wefic, Leen Electric, and High Trend, ABCO delivers integrated drilling, supply chain, and technical advisory services with a strong commitment to safety, quality, and operational continuity.',
    ],
    qualitySubtitle:
      'Every well, every shipment, every service — drilling operations, well maintenance, procurement, and engineering consultancy delivered with strict safety and operational standards.',
    knowThatBody:
      'From Libya drills and well maintenance to procurement and engineering consultancy, ABCO operates across the upstream oil and gas sector — partnered with Sinopec, Kerui, Coenesp, and Wefic Group, headquartered at Burlington Tower in Dubai Business Bay.',
  },

  'al-shifa': {
    tagline: 'Libya\'s registered pharmaceutical importer and distributor.',
    overview: [
      'Al-Shiffa Pharma is a registered Libyan pharmaceutical company specialising in the import and distribution of medicines and medical supplies sourced from leading international and regional manufacturers — officially registered with the Ministry of Health and Medical Supply, ensuring full compliance with national healthcare regulations.',
      'Headquartered in Benghazi (Pharmaceutical Market, near Al-Ahly Club) with branches in Tripoli and Misrata plus authorised distributors across most regions of Libya, Al-Shiffa supports the country\'s healthcare infrastructure with reliable supply, certified warehousing, and a professional field team serving hospitals, clinics, and pharmacies.',
    ],
    qualitySubtitle:
      'Every medicine, every shipment, every storage cycle — Food and Drug Control Center certified warehousing, regulatory compliance, and trusted distribution serving Libyan hospitals, clinics, and pharmacies.',
    missionHeading: 'Reliable medicines for Libyan healthcare.',
    missionBody:
      'Al-Shiffa Pharma supplies safe, high-quality pharmaceutical products while supporting healthcare providers, ensuring consistent medicine availability, maintaining strict quality standards, and contributing to improved public health — backed by global pharma partnerships, nationwide distribution, and efficient logistics across the country.',
    facts: [
      {
        stat: 'MOH',
        title: 'Officially registered',
        body: 'Registered with the Libyan Ministry of Health and Medical Supply — full compliance with national healthcare regulations and certified-manufacturer sourcing across every product line.',
      },
      {
        stat: '3 branches',
        title: 'Nationwide reach',
        body: 'Headquartered in Benghazi (Pharmaceutical Market, near Al-Ahly Club) with branches in Tripoli and Misrata — plus authorised distributors covering most regions of Libya.',
      },
      {
        stat: 'Certified',
        title: 'Warehousing & cold chain',
        body: 'Advanced storage facilities certified by the Food and Drug Control Center — controlled temperature, safety systems, and efficient stock management for product integrity.',
      },
      {
        stat: 'Multi-line',
        title: 'Product portfolio',
        body: 'Prescription medicines, over-the-counter (OTC) products, medical consumables, healthcare essentials, and specialised pharmaceutical products — all meeting strict quality, safety, and regulatory requirements.',
      },
      {
        stat: 'Field team',
        title: 'Healthcare partnerships',
        body: 'Qualified professionals engaging hospitals, clinics, physicians, pharmacies, and distributors — covering product promotion, medical information support, and long-term relationship building across public and private healthcare.',
      },
    ],
    knowThatBody:
      'From prescription medicines and OTC products to specialised pharmaceuticals and medical consumables, Al-Shiffa Pharma supplies hospitals, clinics, and pharmacies across Libya — three regional branches and authorised distributors backed by certified warehousing and a skilled field team.',
    visionQuote:
      'To become a leading pharmaceutical distribution company in Libya and the region — recognised for reliability, quality, and excellence in supporting healthcare across the country.',
  },
}

export function getCompanyContent(slug: string): CompanyContent | undefined {
  return COMPANY_CONTENT[slug]
}

/**
 * Per-sector hero photo + video, served from /public/assets/sectors/.
 * Sectors without dedicated media fall back to the placeholder image and the
 * aviation video (the only generic motion clip we have on hand).
 */
export interface SectorMedia {
  photo: string
  video: string
}

const PLACEHOLDER_PHOTO = '/assets/sectors/placeholder.jpg'
const FALLBACK_VIDEO = '/assets/sectors/aviation.mp4'

export const SECTOR_MEDIA: Record<string, SectorMedia> = {
  aviation:    { photo: '/assets/sectors/aviation.png',    video: '/assets/sectors/aviation.mp4' },
  food:        { photo: '/assets/sectors/food.png',        video: '/assets/sectors/food.mp4' },
  perfumes:    { photo: '/assets/sectors/perfumes.png',    video: '/assets/sectors/perfumes.mp4' },
  furniture:   { photo: '/assets/sectors/furniture.png',   video: '/assets/sectors/furniture.mp4' },
  spareparts:  { photo: '/assets/sectors/spareparts.png',  video: '/assets/sectors/spareparts.mp4' },
  construction:{ photo: '/assets/sectors/construction.png',video: '/assets/sectors/construction.mp4' },
  oilgas:      { photo: '/assets/sectors/oilgas.png',      video: '/assets/sectors/oilgas.mp4' },
  pharma:      { photo: '/assets/sectors/pharma.png',      video: '/assets/sectors/pharma.mp4' },
}

export function getSectorMedia(sectorKey: string | undefined): SectorMedia {
  if (sectorKey && SECTOR_MEDIA[sectorKey]) return SECTOR_MEDIA[sectorKey]
  return { photo: PLACEHOLDER_PHOTO, video: FALLBACK_VIDEO }
}

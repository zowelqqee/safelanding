import type { CountryProfile } from "@/types";

type RawCountry = {
  id: string;
  name: string;
  emoji: string;
  region: string;
  languages: string[];
  currency: string;
  schengen_area: boolean;
  summary: string;
  best_for: string[];
  watch_out: string[];
  lifestyle_fit_factors: string[];
  legal_fit_factors: string[];
  cost_level: 1 | 2 | 3 | 4 | 5;
  housing_difficulty: 1 | 2 | 3 | 4 | 5;
  english_friendliness: 1 | 2 | 3 | 4 | 5;
  expat_community: 1 | 2 | 3 | 4 | 5;
  career_opportunities: 1 | 2 | 3 | 4 | 5;
  study_fit: 1 | 2 | 3 | 4 | 5;
  remote_work_fit: 1 | 2 | 3 | 4 | 5;
  family_fit: 1 | 2 | 3 | 4 | 5;
  climate_score: 1 | 2 | 3 | 4 | 5;
  bureaucracy_level: 1 | 2 | 3 | 4 | 5;
  long_term_stability: 1 | 2 | 3 | 4 | 5;
  calm_lifestyle: 1 | 2 | 3 | 4 | 5;
  public_transport: 1 | 2 | 3 | 4 | 5;
  coastal: boolean;
  main_legal_blocker: string;
  main_lifestyle_blocker: string;
  what_people_underestimate: string;
  first_90_days_preview: string[];
  legal_disclaimer: string;
  city_ids: string[];
  available_legal_path_ids: string[];
  journey_available: boolean;
  heroImage?: string;
};

const COUNTRY_DISCLAIMER =
  "Requirements vary by route and timing. Income thresholds and evidence rules must be verified before applying. Professional review recommended.";

const COUNTRY_IMAGE_PATHS: Record<string, string> = {
  spain: "/images/countries/spain.jpg",
  portugal: "/images/countries/portugal.jpg",
  germany: "/images/countries/germany.jpg",
  netherlands: "/images/countries/netherlands.jpg",
  uk: "/images/countries/UK.jpg",
  canada: "/images/countries/canada.jpg",
  us: "/images/countries/US.jpg",
  uae: "/images/countries/UAE.jpg",
  thailand: "/images/countries/thailand.jpg",
  mexico: "/images/countries/mexico.jpg",
  poland: "/images/countries/poland.jpg",
  "czech-republic": "/images/countries/czech.jpg",
};

const RAW_COUNTRIES: RawCountry[] = [
  {
    id: "spain",
    name: "Spain",
    emoji: "🇪🇸",
    region: "Europe",
    languages: ["Spanish"],
    currency: "EUR",
    schengen_area: true,
    summary:
      "A strong lifestyle destination for remote workers, students, and families who want Mediterranean day-to-day life with established relocation demand.",
    best_for: [
      "Remote workers who want warm weather and real city life",
      "Students looking for lifestyle-first European experience",
      "Families who value climate, food culture, and social rhythm",
    ],
    watch_out: [
      "Housing pressure is real in Barcelona and Madrid",
      "Government processes move slowly and often in Spanish",
      "Income and private insurance rules need fresh verification",
    ],
    lifestyle_fit_factors: [
      "Warm climate and outdoor life",
      "Strong food, healthcare, and family routines",
      "Multiple livable coastal and inland city options",
    ],
    legal_fit_factors: [
      "Multiple entry routes for remote work, study, and passive-income cases",
      "Consular practice can vary by nationality and filing location",
      "Good long-term appeal if you can tolerate slower bureaucracy",
    ],
    cost_level: 3,
    housing_difficulty: 4,
    english_friendliness: 3,
    expat_community: 5,
    career_opportunities: 3,
    study_fit: 4,
    remote_work_fit: 5,
    family_fit: 4,
    climate_score: 5,
    bureaucracy_level: 4,
    long_term_stability: 4,
    calm_lifestyle: 4,
    public_transport: 4,
    coastal: true,
    main_legal_blocker: "Remote-income, insurance, and filing details need careful verification.",
    main_lifestyle_blocker: "Top cities can feel crowded and housing can take time to secure.",
    what_people_underestimate:
      "How much patience Spanish paperwork and appointment timing can require even for strong applicants.",
    first_90_days_preview: [
      "Settle temporary housing and neighborhood shortlist",
      "Open a banking and phone setup that works across Spain",
      "Begin registration and long-term rental search in parallel",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["valencia", "barcelona", "madrid", "alicante"],
    available_legal_path_ids: [
      "spain-digital-nomad",
      "spain-student",
      "spain-non-lucrative",
      "spain-exploration",
    ],
    journey_available: true,
  },
  {
    id: "portugal",
    name: "Portugal",
    emoji: "🇵🇹",
    region: "Europe",
    languages: ["Portuguese"],
    currency: "EUR",
    schengen_area: true,
    summary:
      "Portugal balances Atlantic lifestyle, English tolerance, and familiar expat infrastructure, but it is no longer the low-cost shortcut people assume.",
    best_for: [
      "Remote workers prioritizing ocean access and calmer daily life",
      "Families wanting a soft landing into Europe",
      "People exploring long-term residency with a lifestyle-first lens",
    ],
    watch_out: [
      "Lisbon housing is expensive relative to local salaries",
      "Immigration processing timing can be unpredictable",
      "Rules and appointment availability need fresh checking before planning around them",
    ],
    lifestyle_fit_factors: [
      "Mild climate with coastal living",
      "English is workable in major hubs",
      "Friendly environment for solo arrivals and families",
    ],
    legal_fit_factors: [
      "Well-known remote, study, and exploration routes",
      "Some paths look simple online but depend on timing and consular practice",
      "Good fit when your profile is steady rather than rushed",
    ],
    cost_level: 3,
    housing_difficulty: 4,
    english_friendliness: 4,
    expat_community: 5,
    career_opportunities: 3,
    study_fit: 3,
    remote_work_fit: 5,
    family_fit: 4,
    climate_score: 4,
    bureaucracy_level: 4,
    long_term_stability: 4,
    calm_lifestyle: 5,
    public_transport: 3,
    coastal: true,
    main_legal_blocker: "Processing timelines and proof standards vary more than the marketing suggests.",
    main_lifestyle_blocker: "Prime coastal areas are no longer cheap and can feel saturated.",
    what_people_underestimate:
      "How fast housing and residency logistics can eat into a calm-lifestyle plan.",
    first_90_days_preview: [
      "Test neighborhood fit beyond tourist zones",
      "Start tax-number, banking, and rental logistics early",
      "Expect admin follow-up instead of one clean submission flow",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["lisbon", "porto", "madeira", "algarve"],
    available_legal_path_ids: [
      "portugal-d8",
      "portugal-student",
      "portugal-job-seeker",
      "portugal-exploration",
    ],
    journey_available: true,
  },
  {
    id: "germany",
    name: "Germany",
    emoji: "🇩🇪",
    region: "Europe",
    languages: ["German"],
    currency: "EUR",
    schengen_area: true,
    summary:
      "Germany is one of the strongest practical moves for work and study, with serious long-term upside if you can handle language, paperwork, and housing pressure.",
    best_for: [
      "Professionals targeting structured European career growth",
      "Students who value strong universities and long-term options",
      "Families optimizing for stability over sunshine",
    ],
    watch_out: [
      "Rental competition is intense in major cities",
      "German language becomes important quickly outside international bubbles",
      "Recognition, sponsorship, and local paperwork steps need verification",
    ],
    lifestyle_fit_factors: [
      "Reliable infrastructure and public services",
      "Strong safety and long-term stability",
      "Good city choice if career is your main priority",
    ],
    legal_fit_factors: [
      "Multiple work and study entry routes exist",
      "Employer-based and recognition-dependent cases can slow down",
      "Excellent upside if your credentials match the route well",
    ],
    cost_level: 4,
    housing_difficulty: 5,
    english_friendliness: 3,
    expat_community: 4,
    career_opportunities: 5,
    study_fit: 5,
    remote_work_fit: 3,
    family_fit: 4,
    climate_score: 2,
    bureaucracy_level: 4,
    long_term_stability: 5,
    calm_lifestyle: 3,
    public_transport: 5,
    coastal: false,
    main_legal_blocker: "Credential fit, employer alignment, and local filing details matter more than generic visa lists.",
    main_lifestyle_blocker: "Housing and language pressure can wear people down fast.",
    what_people_underestimate:
      "How much apartment searching and admin scheduling shape the first three months.",
    first_90_days_preview: [
      "Secure a realistic temporary address before arrival",
      "Prepare for registration, banking, and health-insurance sequencing",
      "Expect housing and paperwork to run in parallel for weeks",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["berlin", "munich", "hamburg", "frankfurt"],
    available_legal_path_ids: [
      "germany-blue-card",
      "germany-skilled-worker",
      "germany-student",
      "germany-opportunity-card",
      "germany-exploration",
    ],
    journey_available: true,
  },
  {
    id: "netherlands",
    name: "Netherlands",
    emoji: "🇳🇱",
    region: "Europe",
    languages: ["Dutch"],
    currency: "EUR",
    schengen_area: true,
    summary:
      "The Netherlands is highly livable and unusually English-friendly for continental Europe, but the housing market is the biggest practical brake on otherwise strong fit.",
    best_for: [
      "English-speaking professionals in tech and international business",
      "Students wanting English-taught options",
      "People who value compact, well-connected urban life",
    ],
    watch_out: [
      "Housing availability is often the hardest part of the move",
      "Some strong routes still depend on a specific employer or sponsor",
      "Costs climb quickly in top cities",
    ],
    lifestyle_fit_factors: [
      "Easy daily life in English for many people",
      "Excellent transport and compact cities",
      "Strong international work environment",
    ],
    legal_fit_factors: [
      "Clear talent, study, and business-style routes exist",
      "Employer-linked paths are strong only if you actually have the anchor",
      "Good legal fit can collapse if housing is not realistic",
    ],
    cost_level: 4,
    housing_difficulty: 5,
    english_friendliness: 5,
    expat_community: 5,
    career_opportunities: 5,
    study_fit: 5,
    remote_work_fit: 4,
    family_fit: 4,
    climate_score: 2,
    bureaucracy_level: 3,
    long_term_stability: 5,
    calm_lifestyle: 3,
    public_transport: 5,
    coastal: true,
    main_legal_blocker: "The strongest routes usually depend on a sponsor, startup plan, or student anchor.",
    main_lifestyle_blocker: "Housing competition can derail a good move before it starts.",
    what_people_underestimate:
      "How hard it is to turn a strong offer into an actual rental in time.",
    first_90_days_preview: [
      "Lock temporary housing before you search for permanent rent",
      "Expect registration and banking to depend on address timing",
      "Treat housing as the critical path, not a later step",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["amsterdam", "rotterdam", "utrecht", "eindhoven"],
    available_legal_path_ids: [
      "netherlands-highly-skilled-migrant",
      "netherlands-student-permit",
      "netherlands-startup",
      "netherlands-exploration",
    ],
    journey_available: true,
  },
  {
    id: "uk",
    name: "United Kingdom",
    emoji: "🇬🇧",
    region: "Europe",
    languages: ["English"],
    currency: "GBP",
    schengen_area: false,
    summary:
      "The UK is straightforward when you already have a qualifying anchor, but much harder if you are hoping to figure it out after arrival.",
    best_for: [
      "People with a real employer or university path already in motion",
      "Careers in finance, media, consulting, research, and global firms",
      "Applicants who need an English-only environment",
    ],
    watch_out: [
      "Costs are high, especially in London",
      "Most long-term routes depend on sponsorship, admission, or exceptional profile",
      "Policy and threshold details should always be rechecked before acting",
    ],
    lifestyle_fit_factors: [
      "English-language ease from day one",
      "Deep professional and academic ecosystem",
      "Multiple city choices beyond London",
    ],
    legal_fit_factors: [
      "Good fit when you already have the right institutional anchor",
      "Weak fit if you are trying to improvise from tourist status",
      "Talent-style routes are attractive but selective",
    ],
    cost_level: 5,
    housing_difficulty: 5,
    english_friendliness: 5,
    expat_community: 5,
    career_opportunities: 5,
    study_fit: 5,
    remote_work_fit: 2,
    family_fit: 3,
    climate_score: 2,
    bureaucracy_level: 3,
    long_term_stability: 4,
    calm_lifestyle: 2,
    public_transport: 4,
    coastal: true,
    main_legal_blocker: "There is rarely a strong long-term path without sponsorship, admission, or an exceptional profile.",
    main_lifestyle_blocker: "High cost and housing pressure can make a good legal fit feel much harder in practice.",
    what_people_underestimate:
      "How expensive the first three months feel before local income and routines stabilize.",
    first_90_days_preview: [
      "Budget for a very expensive arrival window",
      "Sequence housing, banking, and phone setup around your address proof",
      "Expect employer or school admin to drive the move pace",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["london", "manchester", "edinburgh", "birmingham"],
    available_legal_path_ids: [
      "uk-skilled-worker",
      "uk-student",
      "uk-global-talent",
      "uk-exploration",
    ],
    journey_available: true,
  },
  {
    id: "canada",
    name: "Canada",
    emoji: "🇨🇦",
    region: "North America",
    languages: ["English", "French"],
    currency: "CAD",
    schengen_area: false,
    summary:
      "Canada is one of the strongest long-term migration plays for work and study, but the path rewards applicants with strong profiles and realistic housing plans.",
    best_for: [
      "Skilled professionals optimizing for long-term stability",
      "Students who want a structured study-to-work narrative",
      "Families prioritizing safety, institutions, and multicultural cities",
    ],
    watch_out: [
      "Major-city housing can be punishing",
      "Competitive selection systems do not reward vague plans",
      "Processing and score assumptions must be verified before relying on them",
    ],
    lifestyle_fit_factors: [
      "High long-term stability and family appeal",
      "Multicultural urban life and English-language ease",
      "Multiple city types from coastal to prairie hubs",
    ],
    legal_fit_factors: [
      "Strong study and skilled-worker narratives exist",
      "Selection-based routes can be competitive even for solid applicants",
      "Good fit improves when you bring credentials, language, and savings",
    ],
    cost_level: 4,
    housing_difficulty: 4,
    english_friendliness: 5,
    expat_community: 5,
    career_opportunities: 4,
    study_fit: 5,
    remote_work_fit: 3,
    family_fit: 5,
    climate_score: 2,
    bureaucracy_level: 3,
    long_term_stability: 5,
    calm_lifestyle: 3,
    public_transport: 3,
    coastal: true,
    main_legal_blocker: "Strong profiles do better; weak planning around scores, funds, or study intent can stall the move.",
    main_lifestyle_blocker: "Housing and winter adaptation are the real non-obvious filters.",
    what_people_underestimate:
      "How much rent, deposits, and cold-weather logistics shape the landing budget.",
    first_90_days_preview: [
      "Treat housing and banking as top-priority arrival tasks",
      "Set expectations around weather, transport, and documentation quickly",
      "Expect the city choice to matter as much as the country choice",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["toronto", "vancouver", "calgary", "montreal"],
    available_legal_path_ids: [
      "canada-express-entry",
      "canada-study-permit",
      "canada-pnp",
      "canada-exploration",
    ],
    journey_available: true,
  },
  {
    id: "us",
    name: "United States",
    emoji: "🇺🇸",
    region: "North America",
    languages: ["English"],
    currency: "USD",
    schengen_area: false,
    summary:
      "The US has unmatched upside for career, study, and talent cases, but legal fit is often much weaker than lifestyle or career attraction suggests.",
    best_for: [
      "Applicants with a real sponsor, university, or exceptional-talent narrative",
      "Career builders targeting top-tier upside in tech, research, finance, or media",
      "People who can tolerate complexity in exchange for opportunity",
    ],
    watch_out: [
      "There is no simple general move-in route for most people",
      "Healthcare and housing costs can distort even strong salaries",
      "Requirements vary sharply by route and must be verified before planning around them",
    ],
    lifestyle_fit_factors: [
      "Very high career upside and city variety",
      "Strong university ecosystem",
      "Multiple warm-weather and global-city options",
    ],
    legal_fit_factors: [
      "Good only when you already have a route anchor",
      "Employer, student, or talent-based pathways dominate",
      "Exploration is easy; long-term fit is not",
    ],
    cost_level: 5,
    housing_difficulty: 4,
    english_friendliness: 5,
    expat_community: 5,
    career_opportunities: 5,
    study_fit: 5,
    remote_work_fit: 2,
    family_fit: 3,
    climate_score: 3,
    bureaucracy_level: 4,
    long_term_stability: 4,
    calm_lifestyle: 2,
    public_transport: 2,
    coastal: true,
    main_legal_blocker: "Without sponsorship, admission, or extraordinary-profile evidence, legal fit is usually weak.",
    main_lifestyle_blocker: "Healthcare cost and city-level affordability can hit harder than expected.",
    what_people_underestimate:
      "How separate the lifestyle dream is from the actual immigration path.",
    first_90_days_preview: [
      "Treat legal status and health-insurance planning as day-one concerns",
      "Budget for deposits, transport, and service setup by city",
      "Expect the move to depend heavily on your institutional anchor",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["new-york", "san-francisco", "miami", "austin"],
    available_legal_path_ids: [
      "us-f1",
      "us-o1",
      "us-employer-sponsored",
      "us-exploration",
    ],
    journey_available: true,
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    emoji: "🇦🇪",
    region: "Middle East",
    languages: ["Arabic", "English"],
    currency: "AED",
    schengen_area: false,
    summary:
      "The UAE is a practical, fast-moving base for remote workers, employees, and founders who want infrastructure and English-friendly daily life without a slow state process.",
    best_for: [
      "Remote professionals who can self-fund city life",
      "Employees with a Gulf-based offer",
      "Founders who want a business-friendly hub",
    ],
    watch_out: [
      "Cost can climb quickly once housing and school fees enter the picture",
      "Long-term security depends on keeping the right residency basis",
      "Rules and sponsor models should always be verified before acting",
    ],
    lifestyle_fit_factors: [
      "High convenience and service speed",
      "Very international, English-friendly city life",
      "Strong travel connectivity and safety",
    ],
    legal_fit_factors: [
      "Practical routes exist for remote work, employment, and business setup",
      "Residency tends to be clearer when tied to income or employer reality",
      "Good for execution speed rather than citizenship-style permanence",
    ],
    cost_level: 4,
    housing_difficulty: 3,
    english_friendliness: 5,
    expat_community: 5,
    career_opportunities: 4,
    study_fit: 3,
    remote_work_fit: 5,
    family_fit: 3,
    climate_score: 5,
    bureaucracy_level: 2,
    long_term_stability: 3,
    calm_lifestyle: 3,
    public_transport: 3,
    coastal: true,
    main_legal_blocker: "Residency is practical, but it usually depends on stable income, employer alignment, or business setup.",
    main_lifestyle_blocker: "Heat and cost can make a theoretically easy move feel unsustainable.",
    what_people_underestimate:
      "How quickly convenience costs accumulate once you live there full time.",
    first_90_days_preview: [
      "Secure housing and phone setup fast",
      "Sequence bank, residency, and employer or permit admin closely",
      "Pressure-test whether the city budget feels sustainable in real life",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["dubai", "abu-dhabi"],
    available_legal_path_ids: [
      "uae-remote-work",
      "uae-employment-residence",
      "uae-investor",
      "uae-exploration",
    ],
    journey_available: true,
  },
  {
    id: "thailand",
    name: "Thailand",
    emoji: "🇹🇭",
    region: "Asia",
    languages: ["Thai"],
    currency: "THB",
    schengen_area: false,
    summary:
      "Thailand is compelling for lifestyle-first movers who want warmth and affordability, but long-term legal stability depends on choosing the right lane and verifying current rules.",
    best_for: [
      "Remote workers who value climate and daily-life affordability",
      "People exploring Asia before locking in a longer strategy",
      "Students or lifestyle movers who do not need a classic office market",
    ],
    watch_out: [
      "Route rules and interpretations can change",
      "Long-term status is less straightforward than the lifestyle appeal suggests",
      "Big tourist zones can distort the real day-to-day experience",
    ],
    lifestyle_fit_factors: [
      "Warm climate and low daily friction",
      "Good affordability for many foreign earners",
      "Strong soft-landing energy in a few known hubs",
    ],
    legal_fit_factors: [
      "Exploration and some long-stay narratives exist",
      "Long-term fit needs current verification rather than old internet advice",
      "Better when you are flexible and not treating it like a permanent-work default",
    ],
    cost_level: 2,
    housing_difficulty: 2,
    english_friendliness: 3,
    expat_community: 4,
    career_opportunities: 2,
    study_fit: 3,
    remote_work_fit: 4,
    family_fit: 3,
    climate_score: 5,
    bureaucracy_level: 3,
    long_term_stability: 3,
    calm_lifestyle: 4,
    public_transport: 3,
    coastal: true,
    main_legal_blocker: "Current long-stay and work-permission details need verification before treating the move as stable.",
    main_lifestyle_blocker: "Heat, seasonality, and tourist-zone fatigue can change the experience quickly.",
    what_people_underestimate:
      "How different short-stay Thailand feels from building a durable base there.",
    first_90_days_preview: [
      "Test the city outside tourist districts",
      "Set up banking, SIM, and housing with a realistic local rhythm",
      "Verify your longer-stay options before optimizing lifestyle details",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["bangkok", "chiang-mai", "phuket"],
    available_legal_path_ids: [
      "thailand-destination-thailand",
      "thailand-education",
      "thailand-exploration",
    ],
    journey_available: true,
  },
  {
    id: "mexico",
    name: "Mexico",
    emoji: "🇲🇽",
    region: "Latin America",
    languages: ["Spanish"],
    currency: "MXN",
    schengen_area: false,
    summary:
      "Mexico is strong for exploration, temporary-resident planning, and lifestyle-first relocation, especially if you want North America access without US legal complexity.",
    best_for: [
      "Remote workers prioritizing proximity to the US with lower cost",
      "People testing Latin American city life before longer commitments",
      "Students or flexible movers who value climate and cultural depth",
    ],
    watch_out: [
      "City experience varies a lot by neighborhood and safety habits",
      "Rules, finances, and local office interpretation should be verified before relying on them",
      "Some lifestyle wins depend on Spanish more than newcomers expect",
    ],
    lifestyle_fit_factors: [
      "Strong climate and city variety",
      "Good affordability relative to North American peers",
      "Large foreign communities in several hubs",
    ],
    legal_fit_factors: [
      "Useful temporary-resident and exploration narratives exist",
      "Good practical fit when your finances are steady and your expectations are flexible",
      "Less suitable if you want a highly standardized process",
    ],
    cost_level: 2,
    housing_difficulty: 3,
    english_friendliness: 3,
    expat_community: 4,
    career_opportunities: 3,
    study_fit: 3,
    remote_work_fit: 4,
    family_fit: 3,
    climate_score: 4,
    bureaucracy_level: 3,
    long_term_stability: 3,
    calm_lifestyle: 4,
    public_transport: 3,
    coastal: true,
    main_legal_blocker: "Financial criteria and filing practice should be verified before you build the plan around them.",
    main_lifestyle_blocker: "Neighborhood-level safety and infrastructure matter more than country-level averages.",
    what_people_underestimate:
      "How much daily quality depends on city choice and local routine, not just country reputation.",
    first_90_days_preview: [
      "Validate the neighborhood, not only the city brand",
      "Set up SIM, banking, and rental strategy with local advice",
      "Treat safety habits and transport reality as part of fit, not an afterthought",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["mexico-city", "playa-del-carmen", "guadalajara"],
    available_legal_path_ids: [
      "mexico-temp-resident",
      "mexico-work-route",
      "mexico-student-route",
      "mexico-exploration",
    ],
    journey_available: true,
  },
  {
    id: "poland",
    name: "Poland",
    emoji: "🇵🇱",
    region: "Europe",
    languages: ["Polish"],
    currency: "PLN",
    schengen_area: true,
    summary:
      "Poland is a pragmatic value-for-money move in Europe with strong student and work logic for the right profile, especially if you care more about function than prestige.",
    best_for: [
      "Cost-conscious movers who still want EU access",
      "Students and early-career professionals",
      "People comfortable with a practical, less polished relocation story",
    ],
    watch_out: [
      "English helps in big cities but not everywhere",
      "Work-based moves depend heavily on employer reality and local process",
      "Cold weather and admin persistence can wear on lifestyle-first movers",
    ],
    lifestyle_fit_factors: [
      "Better value than much of Western Europe",
      "Walkable major cities with decent transport",
      "Growing international presence in work and study hubs",
    ],
    legal_fit_factors: [
      "Work, study, and business-style routes exist",
      "Good fit when your plan is concrete, not speculative",
      "Schengen exploration is easy but should not be confused with settlement",
    ],
    cost_level: 2,
    housing_difficulty: 3,
    english_friendliness: 3,
    expat_community: 3,
    career_opportunities: 3,
    study_fit: 4,
    remote_work_fit: 3,
    family_fit: 3,
    climate_score: 2,
    bureaucracy_level: 3,
    long_term_stability: 4,
    calm_lifestyle: 3,
    public_transport: 4,
    coastal: false,
    main_legal_blocker: "Employer-linked and business routes need current local verification and realistic sponsorship assumptions.",
    main_lifestyle_blocker: "The climate and language gap can feel bigger after the honeymoon period.",
    what_people_underestimate:
      "How much easier the move feels if the job or school anchor is already concrete.",
    first_90_days_preview: [
      "Use a temporary base while you test commute and neighborhood fit",
      "Start registration and employer or school admin immediately",
      "Expect the move to feel practical first and comfortable later",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["warsaw", "krakow", "wroclaw"],
    available_legal_path_ids: [
      "poland-work-permit",
      "poland-student",
      "poland-business-route",
      "poland-exploration",
    ],
    journey_available: true,
  },
  {
    id: "czech-republic",
    name: "Czech Republic",
    emoji: "🇨🇿",
    region: "Europe",
    languages: ["Czech"],
    currency: "CZK",
    schengen_area: true,
    summary:
      "The Czech Republic offers an appealing Central European lifestyle with lower cost than the western EU core, but route details need care and local systems reward patience.",
    best_for: [
      "Freelancers or professionals looking for a practical European base",
      "Students who want a compact, livable city environment",
      "People prioritizing quality of life over maximum salary upside",
    ],
    watch_out: [
      "Language friction appears quickly outside international bubbles",
      "Some routes look simple online but require local process tolerance",
      "Housing is easier than Amsterdam or London, but not frictionless",
    ],
    lifestyle_fit_factors: [
      "Livable cities with strong walkability",
      "Reasonable cost relative to much of Western Europe",
      "Good daily-life balance for many solo movers and couples",
    ],
    legal_fit_factors: [
      "Employee, student, and freelancer-style narratives exist",
      "Better fit when your paperwork and activity are well defined",
      "Exploration is easy; settlement fit still needs verification",
    ],
    cost_level: 3,
    housing_difficulty: 3,
    english_friendliness: 3,
    expat_community: 3,
    career_opportunities: 3,
    study_fit: 4,
    remote_work_fit: 3,
    family_fit: 3,
    climate_score: 2,
    bureaucracy_level: 4,
    long_term_stability: 4,
    calm_lifestyle: 4,
    public_transport: 5,
    coastal: false,
    main_legal_blocker: "Freelance and employee routes need current local interpretation, not generic internet summaries.",
    main_lifestyle_blocker: "Language and paperwork patience matter more than newcomers expect.",
    what_people_underestimate:
      "How much smoother the first months are if you prepare admin sequencing before arrival.",
    first_90_days_preview: [
      "Test neighborhoods by transit and daily rhythm",
      "Move quickly on registration, address, and bank setup",
      "Keep expectations realistic around local-language admin",
    ],
    legal_disclaimer: COUNTRY_DISCLAIMER,
    city_ids: ["prague", "brno"],
    available_legal_path_ids: [
      "czech-employee-card",
      "czech-student",
      "czech-trade-license",
      "czech-exploration",
    ],
    journey_available: true,
  },
];

function buildCountry(country: RawCountry): CountryProfile {
  const curatedImage = COUNTRY_IMAGE_PATHS[country.id];

  return {
    ...country,
    slug: country.id,
    continent: country.region,
    schengenArea: country.schengen_area,
    costLevel: country.cost_level,
    housingDifficulty: country.housing_difficulty,
    englishFriendliness: country.english_friendliness,
    expatCommunity: country.expat_community,
    careerOpportunities: country.career_opportunities,
    climateWarmth: country.climate_score,
    remoteWorkerFit: country.remote_work_fit,
    studentFit: country.study_fit,
    familyFit: country.family_fit,
    calmLifestyle: country.calm_lifestyle,
    publicTransport: country.public_transport,
    goodFor: country.best_for,
    challenges: country.watch_out,
    availableLegalPathIds: country.available_legal_path_ids,
    cityIds: country.city_ids,
    journeyAvailable: country.journey_available,
    heroImage: curatedImage ?? country.heroImage,
  };
}

export const COUNTRIES: CountryProfile[] = RAW_COUNTRIES.map(buildCountry);

export function getCountryById(id: string): CountryProfile | undefined {
  return COUNTRIES.find((country) => country.id === id);
}

export function getCountryBySlug(slug: string): CountryProfile | undefined {
  return COUNTRIES.find((country) => country.slug === slug);
}

export function getAvailableCountries(): CountryProfile[] {
  return COUNTRIES;
}

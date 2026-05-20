import { CITIES, getCityById } from "@/lib/data/cities";
import type { CityProfile, CityRealityReport } from "@/types";

const DEFAULT_DISCLAIMER = "Curated from public stories and reviews. Not a statistical sample.";

function describeHousing(city: CityProfile) {
  if (city.housingDifficulty >= 5) {
    return `Housing tends to be the main constraint, with ${city.avg_rent_range} often feeling harder in practice than it looks on paper.`;
  }

  if (city.housingDifficulty >= 4) {
    return `Housing is usually manageable only with planning, because decent options at ${city.avg_rent_range} move faster than many newcomers expect.`;
  }

  return `Housing is less punishing than in the hardest markets, but ${city.avg_rent_range} still rewards early search and realistic expectations.`;
}

function describeLanguage(city: CityProfile) {
  if (city.englishFriendliness >= 4) {
    return `English helps a lot on arrival, but ${city.country}'s local language still matters for deeper daily life and less friction over time.`;
  }

  return `English can get the move started, but the local language becomes important quickly if you want daily life to feel smoother.`;
}

function buildGenericSummary(city: CityProfile) {
  return `${city.name} currently uses a curated reality preview rather than sourced story cards. The main recurring themes are ${describeHousing(city).toLowerCase()} ${describeLanguage(city)} The first months also depend on whether the move fits the city you actually chose, not just the version of it you imagined.`;
}

function buildPeopleLove(city: CityProfile) {
  const items = [
    city.summary,
    city.coastal
      ? "Access to the coast and a more lifestyle-led daily rhythm are part of the appeal."
      : city.bigCity
        ? "Big-city access, networks, and day-to-day infrastructure are part of the draw."
        : "A calmer day-to-day pace is part of why the city works for the right move.",
    city.publicTransport >= 4
      ? "People usually value the city more once transport and neighborhood routine click."
      : "People usually value the city more once the right neighborhood and routine are in place.",
  ];

  return items.slice(0, 3);
}

function buildPeopleStruggleWith(city: CityProfile) {
  return [
    ...city.watch_out,
    city.main_lifestyle_blocker,
  ].slice(0, 3);
}

function buildPeopleUnderestimate(city: CityProfile) {
  return [
    city.what_people_underestimate,
    "Arrival costs and first-month friction can feel different from the headline monthly budget.",
    city.housingDifficulty >= 4
      ? "Housing timing often shapes the entire move more than expected."
      : "Even a relatively easier city still rewards a careful first housing choice.",
  ];
}

function buildAdviceBeforeMove(city: CityProfile) {
  return [
    city.first_90_days_preview[0] ?? "Treat the first weeks as a setup phase instead of trying to optimize the whole move at once.",
    city.first_90_days_preview[1] ?? "Use the first month to pressure-test neighborhood, commute, and daily routine.",
    city.first_90_days_preview[2] ?? "Keep a budget buffer for arrival costs, housing adjustments, and admin friction.",
  ].slice(0, 3);
}

function buildFallbackReport(city: CityProfile): CityRealityReport {
  return {
    cityId: city.id,
    countryId: city.countryId,
    summary: buildGenericSummary(city),
    disclaimer: DEFAULT_DISCLAIMER,
    snapshotSignals: [
      {
        title: city.housingDifficulty >= 4 ? "Housing shapes the move" : "Housing still needs planning",
        description: describeHousing(city),
      },
      {
        title: city.englishFriendliness >= 4 ? "English helps, local language still unlocks life" : "Local language matters earlier than expected",
        description: describeLanguage(city),
      },
      {
        title: "The first 90 days are about setup",
        description: city.first_90_days_preview[0]
          ? `${city.first_90_days_preview.join(" ")}`
          : "The first months usually go better when housing, documents, and routine are treated as the real start of the move.",
      },
    ],
    storySignals: [],
    patternSummary: {
      peopleLove: buildPeopleLove(city),
      peopleStruggleWith: buildPeopleStruggleWith(city),
      peopleUnderestimate: buildPeopleUnderestimate(city),
      first90Days: city.first_90_days_preview.slice(0, 3),
    },
    adviceBeforeMove: buildAdviceBeforeMove(city),
    sourceLinks: [],
  };
}

const REPORT_OVERRIDES: Record<string, CityRealityReport> = {
  lisbon: {
    cityId: "lisbon",
    countryId: "portugal",
    summary:
      "Lisbon still lands as beautiful and easy to enjoy, but public stories keep circling back to the same reality: rent pressure changes the move, English gets you started without fully solving life, and the first months feel more like setup than lifestyle.",
    disclaimer: DEFAULT_DISCLAIMER,
    snapshotSignals: [
      {
        title: "Housing is the real filter",
        description: "The dream version of Lisbon usually survives only when the budget survives the rent search.",
      },
      {
        title: "English helps, Portuguese changes the experience",
        description: "Newcomers can function in English, but local language effort makes daily life and belonging feel much less shallow.",
      },
      {
        title: "The first 90 days are setup, not romance",
        description: "Housing, paperwork, and budget reality tend to dominate the start long before the city feels settled.",
      },
    ],
    storySignals: [
      {
        quote: "Portugal's not \"dirt cheap\" anymore, especially in Lisbon.",
        sourceLabel: "r/TravelToPortugal",
        sourceAgeLabel: "3mo ago",
        sourceUrl:
          "https://www.reddit.com/r/TravelToPortugal/comments/1r024um/moved_to_portugal_in_dec_2022_heres_what_nobody/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "The Housing Hunt (This Will Test Your Patience)",
        sourceLabel: "r/TravelToPortugal",
        sourceAgeLabel: "3mo ago",
        sourceUrl:
          "https://www.reddit.com/r/TravelToPortugal/comments/1r024um/moved_to_portugal_in_dec_2022_heres_what_nobody/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Most people under 40 speak English",
        sourceLabel: "r/TravelToPortugal",
        sourceAgeLabel: "3mo ago",
        sourceUrl:
          "https://www.reddit.com/r/TravelToPortugal/comments/1r024um/moved_to_portugal_in_dec_2022_heres_what_nobody/",
        topic: "language",
        sentiment: "positive",
      },
      {
        quote: "Official stuff: Everything's in Portuguese",
        sourceLabel: "r/TravelToPortugal",
        sourceAgeLabel: "3mo ago",
        sourceUrl:
          "https://www.reddit.com/r/TravelToPortugal/comments/1r024um/moved_to_portugal_in_dec_2022_heres_what_nobody/",
        topic: "bureaucracy",
        sentiment: "mixed",
      },
      {
        quote: "Portuguese people are friendly but not immediately open.",
        sourceLabel: "r/TravelToPortugal",
        sourceAgeLabel: "3mo ago",
        sourceUrl:
          "https://www.reddit.com/r/TravelToPortugal/comments/1r024um/moved_to_portugal_in_dec_2022_heres_what_nobody/",
        topic: "community",
        sentiment: "mixed",
      },
      {
        quote: "Expect to feel stupid for 6-12 months (normal).",
        sourceLabel: "r/TravelToPortugal",
        sourceAgeLabel: "3mo ago",
        sourceUrl:
          "https://www.reddit.com/r/TravelToPortugal/comments/1r024um/moved_to_portugal_in_dec_2022_heres_what_nobody/",
        topic: "first_90_days",
        sentiment: "mixed",
      },
      {
        quote: "I don't regret moving here",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "6mo ago",
        sourceUrl:
          "https://www.reddit.com/r/PortugalExpats/comments/1owvqv1/regrets_of_moving_to_portugal/",
        topic: "regret",
        sentiment: "positive",
      },
      {
        quote: "I don't see how I can stay long-term, earning a Portuguese salary and paying the newly-arrived rents",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "6mo ago",
        sourceUrl:
          "https://www.reddit.com/r/PortugalExpats/comments/1owvqv1/regrets_of_moving_to_portugal/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "Online expat groups are great for getting advice about visas, housing, taxes, as well as making new friends.",
        sourceLabel: "r/digitalnomad",
        sourceAgeLabel: "3wk ago",
        sourceUrl:
          "https://www.reddit.com/r/digitalnomad/comments/1stipor/the_mistakes_i_made_when_moving_to_portugal/",
        topic: "advice",
        sentiment: "positive",
      },
    ],
    patternSummary: {
      peopleLove: [
        "The light, weather, and coastline genuinely improve day-to-day life.",
        "It feels easier to enter socially than many European capitals.",
        "For people with stable remote income, the lifestyle upside can still feel very real.",
      ],
      peopleStruggleWith: [
        "Rent and temporary housing hit harder than older Lisbon guides suggest.",
        "Tourist-heavy areas can feel crowded and oddly disconnected from normal life.",
        "Routine admin still drains more time and patience than many newcomers expect.",
      ],
      peopleUnderestimate: [
        "Arrival-month housing costs are often much higher than the normal monthly budget.",
        "A cheaper address can create extra daily transport cost and friction.",
        "Living in the most newcomer-friendly parts of the city usually means spending more on everything around you.",
      ],
      first90Days: [
        "The first phase is usually about finding a stable base, not living your ideal Lisbon routine yet.",
        "People often discover their first neighborhood choice was better in theory than in practice.",
        "The move feels very different once the first full month of costs becomes real.",
      ],
    },
    adviceBeforeMove: [
      "Treat your arrival budget as a separate project from your steady-state monthly budget.",
      "Use a temporary base first and judge the city through your actual route, not only through vibe.",
      "Build a calm paperwork system early because housing, banking, and admin all overlap at the start.",
    ],
    sourceLinks: [
      {
        label: "Moved to Portugal in Dec 2022 — here's what nobody tells you",
        url: "https://www.reddit.com/r/TravelToPortugal/comments/1r024um/moved_to_portugal_in_dec_2022_heres_what_nobody/",
        topic: "housing",
      },
      {
        label: "Regrets of moving to Portugal",
        url: "https://www.reddit.com/r/PortugalExpats/comments/1owvqv1/regrets_of_moving_to_portugal/",
        topic: "regret",
      },
      {
        label: "The mistakes I made when moving to Portugal",
        url: "https://www.reddit.com/r/digitalnomad/comments/1stipor/the_mistakes_i_made_when_moving_to_portugal/",
        topic: "advice",
      },
    ],
  },
  valencia: {
    cityId: "valencia",
    countryId: "spain",
    summary:
      "Valencia shows up in public stories as one of the easiest cities to actually enjoy day to day, but the recurring caveats are consistent too: housing is not effortless anymore, Spanish matters more than many expect, and social life goes better when you move beyond the expat-only loop.",
    disclaimer: DEFAULT_DISCLAIMER,
    snapshotSignals: [
      {
        title: "The pace feels lighter",
        description: "A lot of movers describe Valencia as breathable, livable, and easier to settle into than bigger headline cities.",
      },
      {
        title: "Housing is easier than the hype cities, not easy",
        description: "People still keep warning that the market is more expensive and competitive than the old blog version of Valencia.",
      },
      {
        title: "Spanish unlocks the real version of the city",
        description: "You can arrive without it, but ordinary life and deeper connection improve fast once the language barrier drops.",
      },
    ],
    storySignals: [
      {
        quote: "Only hard part is finding housing but if you can do that, then everything else is a breeze by comparison!",
        sourceLabel: "r/GoingToSpain",
        sourceAgeLabel: "2mo ago",
        sourceUrl:
          "https://www.reddit.com/r/GoingToSpain/comments/1rizlsh/advice_on_moving_to_valencia/",
        topic: "housing",
        sentiment: "mixed",
      },
      {
        quote: "You definitely need spanish to go by, English is not spoken widely.",
        sourceLabel: "r/GoingToSpain",
        sourceAgeLabel: "2mo ago",
        sourceUrl:
          "https://www.reddit.com/r/GoingToSpain/comments/1rizlsh/advice_on_moving_to_valencia/",
        topic: "language",
        sentiment: "negative",
      },
      {
        quote: "there are many group meetups/language exchange events every week.",
        sourceLabel: "r/GoingToSpain",
        sourceAgeLabel: "2mo ago",
        sourceUrl:
          "https://www.reddit.com/r/GoingToSpain/comments/1rizlsh/advice_on_moving_to_valencia/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Spanish friend groups are notoriously hard to break into",
        sourceLabel: "r/valencia",
        sourceAgeLabel: "3.4y ago",
        sourceUrl: "https://www.reddit.com/r/valencia/comments/zrw6jb/moving_to_valencia_after_newyears/",
        topic: "community",
        sentiment: "negative",
      },
      {
        quote: "Try to avoid making only foreign friends.",
        sourceLabel: "r/valencia",
        sourceAgeLabel: "3.4y ago",
        sourceUrl: "https://www.reddit.com/r/valencia/comments/zrw6jb/moving_to_valencia_after_newyears/",
        topic: "advice",
        sentiment: "mixed",
      },
      {
        quote: "not everyone is fluent in English.",
        sourceLabel: "r/valencia",
        sourceAgeLabel: "3.4y ago",
        sourceUrl: "https://www.reddit.com/r/valencia/comments/zrw6jb/moving_to_valencia_after_newyears/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "It has a good balance and quality of life",
        sourceLabel: "r/valencia",
        sourceAgeLabel: "3.4y ago",
        sourceUrl: "https://www.reddit.com/r/valencia/comments/zrw6jb/moving_to_valencia_after_newyears/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Housing in Valencia has definitely gotten more expensive in the last couple of years.",
        sourceLabel: "r/valencia",
        sourceAgeLabel: "2.8y ago",
        sourceUrl: "https://www.reddit.com/r/valencia/comments/15iu6p7/wanna_be_expat_in_valencia_opinions/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "the market is so competitive.",
        sourceLabel: "r/valencia",
        sourceAgeLabel: "2.8y ago",
        sourceUrl: "https://www.reddit.com/r/valencia/comments/15iu6p7/wanna_be_expat_in_valencia_opinions/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "We've met a ton of nice people and everyone we have met speaks English.",
        sourceLabel: "r/valencia",
        sourceAgeLabel: "2.8y ago",
        sourceUrl: "https://www.reddit.com/r/valencia/comments/15iu6p7/wanna_be_expat_in_valencia_opinions/",
        topic: "community",
        sentiment: "positive",
      },
    ],
    patternSummary: {
      peopleLove: [
        "The city feels balanced: sea, daily convenience, and a calmer pace all in one place.",
        "A lot of movers describe the quality of life as strong without big-city overload.",
        "Families and lifestyle-first movers often talk about Valencia as a place that is easy to keep enjoying.",
      ],
      peopleStruggleWith: [
        "Housing no longer feels as cheap as the old internet version of Valencia.",
        "English covers less of normal life than many newcomers assume.",
        "Building deeper local friendships can take patience and intentional effort.",
      ],
      peopleUnderestimate: [
        "Seasonal housing pressure can distort what the first months cost.",
        "Setup spending still adds up even in a city that feels simpler at first glance.",
        "A wrong neighborhood choice can quietly eat time, convenience, and momentum.",
      ],
      first90Days: [
        "The landing often feels softer than in larger capitals, but the move still rewards disciplined setup.",
        "The first months go best when people test districts through errands, transport, and daily rhythm.",
        "People who build local habits early usually adapt better than people who stay in visitor mode for too long.",
      ],
    },
    adviceBeforeMove: [
      "Treat housing as a live problem to solve early, not as an easy afterthought.",
      "Use language exchanges and recurring local activities as part of the move, not as an optional extra.",
      "Pick your area based on your repeat route, not your vacation mood.",
    ],
    sourceLinks: [
      {
        label: "Advice on moving to Valencia",
        url: "https://www.reddit.com/r/GoingToSpain/comments/1rizlsh/advice_on_moving_to_valencia/",
        topic: "housing",
      },
      {
        label: "Moving to Valencia after New Years",
        url: "https://www.reddit.com/r/valencia/comments/zrw6jb/moving_to_valencia_after_newyears/",
        topic: "community",
      },
      {
        label: "Wanna be expat in Valencia, opinions?",
        url: "https://www.reddit.com/r/valencia/comments/15iu6p7/wanna_be_expat_in_valencia_opinions/",
        topic: "money",
      },
    ],
  },
  berlin: {
    cityId: "berlin",
    countryId: "germany",
    summary:
      "Berlin stories are rarely flat. People talk about freedom, range, and personal reinvention, but the same threads keep warning that housing and Anmeldung shape the move more than lifestyle does in the beginning. The city often gets better after the logistics stop dominating.",
    disclaimer: DEFAULT_DISCLAIMER,
    snapshotSignals: [
      {
        title: "Housing is the boss fight",
        description: "A huge share of public stories frame the apartment search as the single hardest part of the move.",
      },
      {
        title: "Anmeldung changes the whole game",
        description: "Temporary housing and registration strategy show up again and again as the real first chapter of Berlin life.",
      },
      {
        title: "Berlin often pays back later",
        description: "A lot of people sound far more positive once the early chaos turns into a stable routine.",
      },
    ],
    storySignals: [
      {
        quote: "484 applications sent, 13 viewings",
        sourceLabel: "r/berlin",
        sourceAgeLabel: "3.3y ago",
        sourceUrl: "https://www.reddit.com/r/berlin/comments/10py0y5/sharing_my_apartment_search_experience/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "You will have to turn your search into a secondary full-time job.",
        sourceLabel: "r/askberliners",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/askberliners/comments/1s1em5p/apartment_search_strategies/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "get short-term housing (with Anmeldung) to arrive in Berlin",
        sourceLabel: "r/berlin",
        sourceAgeLabel: "2.1y ago",
        sourceUrl: "https://www.reddit.com/r/berlin/comments/1bs7hxc/this_is_the_berlin_housing_market_in_2024/",
        topic: "first_90_days",
        sentiment: "mixed",
      },
      {
        quote: "while you burn money like crazy.",
        sourceLabel: "r/berlin",
        sourceAgeLabel: "2.1y ago",
        sourceUrl: "https://www.reddit.com/r/berlin/comments/1bs7hxc/this_is_the_berlin_housing_market_in_2024/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "Anmeldung day 1 of Germany without a SCHUFA ... is rare",
        sourceLabel: "r/fuberlin",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/fuberlin/comments/1rpbqbw/housing/",
        topic: "bureaucracy",
        sentiment: "negative",
      },
      {
        quote: "I’m still waiting after applying August 2024!",
        sourceLabel: "r/fuberlin",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/fuberlin/comments/1rpbqbw/housing/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Finding an apartment ... was rough, expensive",
        sourceLabel: "r/berlin",
        sourceAgeLabel: "2.1y ago",
        sourceUrl: "https://www.reddit.com/r/berlin/comments/1cd2dtl/i_moved_to_berlin_one_year_ago_wow/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Berlin became the epitome of struggling, yet living to me.",
        sourceLabel: "r/berlin",
        sourceAgeLabel: "2.1y ago",
        sourceUrl: "https://www.reddit.com/r/berlin/comments/1cd2dtl/i_moved_to_berlin_one_year_ago_wow/",
        topic: "regret",
        sentiment: "mixed",
      },
      {
        quote: "after actually moving here, I’ve been pleasantly surprised.",
        sourceLabel: "r/askberliners",
        sourceAgeLabel: "10mo ago",
        sourceUrl: "https://www.reddit.com/r/askberliners/comments/1luqbho/to_new_berliners_who_moved_to_berlin_what_was/",
        topic: "community",
        sentiment: "positive",
      },
    ],
    patternSummary: {
      peopleLove: [
        "People love the freedom to build a life that feels less scripted and more self-directed.",
        "The city offers real variety in communities, careers, and ways of living.",
        "Many movers end up valuing Berlin more once they stop comparing it to a polished version of Germany.",
      ],
      peopleStruggleWith: [
        "Housing search eats time, attention, and money at a level that shocks newcomers.",
        "Admin and registration can dominate the first chapter of the move.",
        "The city can feel rough, fragmented, and emotionally cold before your routine settles.",
      ],
      peopleUnderestimate: [
        "Temporary housing with Anmeldung often costs more than people want to spend.",
        "Setup costs include not only money but dozens of hours of applications, viewings, and paperwork.",
        "A messy first housing step can cascade into bigger stress everywhere else.",
      ],
      first90Days: [
        "The first months often revolve around registration, housing, and a workable address more than around enjoying Berlin itself.",
        "People who treat the start as a stabilization phase tend to handle the city better.",
        "Public stories often turn more positive once the basic infrastructure of life is finally in place.",
      ],
    },
    adviceBeforeMove: [
      "Budget for a temporary landing phase and treat it as normal.",
      "Optimize first for housing stability and registration, then for your ideal Berlin neighborhood story.",
      "Find one or two real communities early so the city feels inhabited, not just functional.",
    ],
    sourceLinks: [
      {
        label: "Sharing my apartment search experience",
        url: "https://www.reddit.com/r/berlin/comments/10py0y5/sharing_my_apartment_search_experience/",
        topic: "housing",
      },
      {
        label: "Apartment search strategies",
        url: "https://www.reddit.com/r/askberliners/comments/1s1em5p/apartment_search_strategies/",
        topic: "housing",
      },
      {
        label: "This is the Berlin housing market in 2024",
        url: "https://www.reddit.com/r/berlin/comments/1bs7hxc/this_is_the_berlin_housing_market_in_2024/",
        topic: "first_90_days",
      },
      {
        label: "Housing",
        url: "https://www.reddit.com/r/fuberlin/comments/1rpbqbw/housing/",
        topic: "bureaucracy",
      },
      {
        label: "I moved to Berlin one year ago. Wow.",
        url: "https://www.reddit.com/r/berlin/comments/1cd2dtl/i_moved_to_berlin_one_year_ago_wow/",
        topic: "regret",
      },
      {
        label: "To new Berliners...",
        url: "https://www.reddit.com/r/askberliners/comments/1luqbho/to_new_berliners_who_moved_to_berlin_what_was/",
        topic: "community",
      },
    ],
  },
  amsterdam: {
    cityId: "amsterdam",
    countryId: "netherlands",
    summary:
      "Amsterdam stories usually split cleanly into two truths at once: people still love the quality of life and practical ease once settled, but the housing market dominates the move, and Dutch starts to matter more once you want work depth or a life that goes beyond expat convenience.",
    disclaimer: DEFAULT_DISCLAIMER,
    snapshotSignals: [
      {
        title: "Your address problem comes first",
        description: "Public stories keep treating the housing search as the core challenge that shapes everything else.",
      },
      {
        title: "English gets you in, Dutch gets you further",
        description: "You can absolutely function in Amsterdam with English, but long-term integration looks different when Dutch starts showing up.",
      },
      {
        title: "The first months reward flexibility",
        description: "People keep recommending wider search radius, temporary compromises, and active networking over a perfect-plan mindset.",
      },
    ],
    storySignals: [
      {
        quote: "Spend the first 1-2 weeks working on finding housing just like you would your full-time job",
        sourceLabel: "r/Amsterdam",
        sourceAgeLabel: "2.9y ago",
        sourceUrl: "https://www.reddit.com/r/Amsterdam/comments/14yuooz/moving_to_amsterdam_help_with_renting/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "look well outside Centrum",
        sourceLabel: "r/Amsterdam",
        sourceAgeLabel: "2.9y ago",
        sourceUrl: "https://www.reddit.com/r/Amsterdam/comments/14yuooz/moving_to_amsterdam_help_with_renting/",
        topic: "advice",
        sentiment: "mixed",
      },
      {
        quote: "After 6 months of searching found 2 ok places",
        sourceLabel: "r/NetherlandsHousing",
        sourceAgeLabel: "3mo ago",
        sourceUrl: "https://www.reddit.com/r/NetherlandsHousing/comments/1r5lu68/moving_to_amsterdam_how_hard_is_it_actually/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "activate your network",
        sourceLabel: "r/NetherlandsHousing",
        sourceAgeLabel: "3mo ago",
        sourceUrl: "https://www.reddit.com/r/NetherlandsHousing/comments/1r5lu68/moving_to_amsterdam_how_hard_is_it_actually/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "it’s very naive to want to move to Amsterdam and start your search for a house 1.5 months in advance",
        sourceLabel: "r/Netherlands",
        sourceAgeLabel: "4.6y ago",
        sourceUrl: "https://www.reddit.com/r/Netherlands/comments/q27ckr/moving_to_amsterdam_decjan/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "non Dutch speaking workers tend to have a hard time these days",
        sourceLabel: "r/Netherlands",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/Netherlands/comments/1rvw4cu/cold_feet_moving_to_amsterdam_because_of_housing/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "learning the language will be very helpful.",
        sourceLabel: "r/Netherlands",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/Netherlands/comments/1rvw4cu/cold_feet_moving_to_amsterdam_because_of_housing/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "you can definitely live in Amsterdam comfortably without speaking a word of Dutch",
        sourceLabel: "r/Amsterdam",
        sourceAgeLabel: "1.1y ago",
        sourceUrl: "https://www.reddit.com/r/Amsterdam/comments/1jl0th8/learning_dutch_for_unusual_reasons/",
        topic: "language",
        sentiment: "positive",
      },
      {
        quote: "knowing the language will open up a lot more doors",
        sourceLabel: "r/Amsterdam",
        sourceAgeLabel: "1.1y ago",
        sourceUrl: "https://www.reddit.com/r/Amsterdam/comments/1jl0th8/learning_dutch_for_unusual_reasons/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "expats who move to Amsterdam have quite a lot of trouble with this particular matter",
        sourceLabel: "r/Amsterdam",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/Amsterdam/comments/1rn7s9e/how_do_people_make_friends/",
        topic: "community",
        sentiment: "negative",
      },
    ],
    patternSummary: {
      peopleLove: [
        "People consistently praise quality of life once the practical base is stable.",
        "The city still feels accessible and easy to function in early because English works well.",
        "Many movers describe the wider Amsterdam region as more workable than the postcard core alone.",
      ],
      peopleStruggleWith: [
        "Housing search is the recurring central warning in almost every move thread.",
        "Work options can narrow without Dutch, especially outside some international roles.",
        "Making a durable social life can take longer than the city's polished image suggests.",
      ],
      peopleUnderestimate: [
        "A short-term landing phase can be expensive simply because you need time to search properly.",
        "People often pay a premium for convenience, ring-road proximity, or expat-ready apartments.",
        "The opportunity cost of being too rigid on location is very high in the Amsterdam market.",
      ],
      first90Days: [
        "The first phase usually rewards flexibility more than certainty.",
        "A wider housing radius and strong network often matter more than ideal neighborhood preferences.",
        "The early move is less about curated canal life and more about securing a realistic base.",
      ],
    },
    adviceBeforeMove: [
      "Start the housing search earlier than feels reasonable and widen the radius fast.",
      "Use your network aggressively because not every good option appears in the obvious channels.",
      "Treat Dutch as a long-term unlock even if English makes the beginning feel easy.",
    ],
    sourceLinks: [
      {
        label: "Moving to Amsterdam? Help with renting",
        url: "https://www.reddit.com/r/Amsterdam/comments/14yuooz/moving_to_amsterdam_help_with_renting/",
        topic: "housing",
      },
      {
        label: "Moving to Amsterdam: how hard is it actually?",
        url: "https://www.reddit.com/r/NetherlandsHousing/comments/1r5lu68/moving_to_amsterdam_how_hard_is_it_actually/",
        topic: "housing",
      },
      {
        label: "Moving to Amsterdam Dec/Jan",
        url: "https://www.reddit.com/r/Netherlands/comments/q27ckr/moving_to_amsterdam_decjan/",
        topic: "housing",
      },
      {
        label: "Cold feet moving to Amsterdam because of housing",
        url: "https://www.reddit.com/r/Netherlands/comments/1rvw4cu/cold_feet_moving_to_amsterdam_because_of_housing/",
        topic: "language",
      },
      {
        label: "Learning Dutch for unusual reasons",
        url: "https://www.reddit.com/r/Amsterdam/comments/1jl0th8/learning_dutch_for_unusual_reasons/",
        topic: "language",
      },
      {
        label: "How do people make friends?",
        url: "https://www.reddit.com/r/Amsterdam/comments/1rn7s9e/how_do_people_make_friends/",
        topic: "community",
      },
    ],
  },
};

function buildEnhancedReport(
  cityId: string,
  enhancement: Partial<Pick<
    CityRealityReport,
    "summary" | "snapshotSignals" | "storySignals" | "patternSummary" | "adviceBeforeMove" | "sourceLinks"
  >>,
) {
  const city = getCityById(cityId);

  if (!city) return undefined;

  const base = buildFallbackReport(city);

  return {
    ...base,
    ...enhancement,
    snapshotSignals: enhancement.snapshotSignals ?? base.snapshotSignals,
    storySignals: enhancement.storySignals ?? base.storySignals,
    patternSummary: enhancement.patternSummary ?? base.patternSummary,
    adviceBeforeMove: enhancement.adviceBeforeMove ?? base.adviceBeforeMove,
    sourceLinks: enhancement.sourceLinks ?? base.sourceLinks,
  } satisfies CityRealityReport;
}

const REPORT_ENHANCEMENTS: Record<string, CityRealityReport | undefined> = {
  barcelona: buildEnhancedReport("barcelona", {
    summary:
      "Public move stories about Barcelona tend to split between lifestyle excitement and housing fatigue. People still love the city's energy, sea access, and density of life, but the strongest repeated warnings are rental stress, weak apartment quality, and the fact that Spanish or Catalan changes the move more than newcomers expect.",
    snapshotSignals: [
      {
        title: "Housing can break the fantasy fast",
        description: "A lot of public stories frame Barcelona housing as expensive, messy, or structurally worse than newcomers expected.",
      },
      {
        title: "The move is more admin-heavy than it looks",
        description: "Paperwork, housing, language, and daily-life setup tend to hit at once in the opening months.",
      },
      {
        title: "Language changes access",
        description: "English can help on arrival, but people repeatedly say responses, integration, and daily life improve when the language barrier drops.",
      },
    ],
    storySignals: [
      {
        quote: "Barcelona is the hell for rentals, full of scammers and rip-offs.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "4.6y ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/pwefcm/moving_to_barcelona_is_it_worth_it/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "paperwork, housing, language, daily life, everything at once.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "3mo ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/1qlzjxp/for_those_who_moved_to_barcelona_from_abroad_what/",
        topic: "first_90_days",
        sentiment: "mixed",
      },
      {
        quote: "11-month contracts at higher rates to dodge rent control.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "3mo ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/1qlzjxp/for_those_who_moved_to_barcelona_from_abroad_what/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "I wish people told me about the shitty housing quality.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "3mo ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/1qlzjxp/for_those_who_moved_to_barcelona_from_abroad_what/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Life sucks and Barcelona housing is an incredible mess.",
        sourceLabel: "r/AskBarcelona",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/AskBarcelona/comments/1rxejcd/considering_moving/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "I received a lot more responses when moving 2 years into living here, likely due to being able to speak the language.",
        sourceLabel: "r/AskBarcelona",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/AskBarcelona/comments/1rxejcd/considering_moving/",
        topic: "language",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Barcelona: Is it worth it?",
        url: "https://www.reddit.com/r/expats/comments/pwefcm/moving_to_barcelona_is_it_worth_it/",
        topic: "housing",
      },
      {
        label: "For those who moved to Barcelona from abroad",
        url: "https://www.reddit.com/r/expats/comments/1qlzjxp/for_those_who_moved_to_barcelona_from_abroad_what/",
        topic: "first_90_days",
      },
      {
        label: "Considering moving",
        url: "https://www.reddit.com/r/AskBarcelona/comments/1rxejcd/considering_moving/",
        topic: "language",
      },
    ],
  }),
  madrid: buildEnhancedReport("madrid", {
    summary:
      "Madrid public stories usually sound less dreamy and more practical than Barcelona's: stronger work logic, stronger day-to-day function, and more people saying the city only works well when the housing, budget, and language assumptions are honest from the start.",
    snapshotSignals: [
      {
        title: "Work city first, soft landing second",
        description: "Many public stories treat Madrid as rewarding once the move is grounded in work, routine, and realistic costs.",
      },
      {
        title: "Housing pressure is still real",
        description: "Repeated threads describe the market as spiraled, impossible, or at least much tighter than newcomers hope.",
      },
      {
        title: "Spanish changes the whole feel",
        description: "Language keeps appearing as the difference between surviving Madrid and actually integrating into it.",
      },
    ],
    storySignals: [
      {
        quote: "housing prices in Madrid have absolutely spiraled in the last several years.",
        sourceLabel: "r/GoingToSpain",
        sourceAgeLabel: "4mo ago",
        sourceUrl: "https://www.reddit.com/r/GoingToSpain/comments/1q07cj0/moving_to_madrid/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "Housing market is just impossible for renting and buying.",
        sourceLabel: "r/askMadrid",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/askMadrid/comments/1s9rawl/moving_to_madrid_from_germany/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "The language - yeah unfortunately Spain is hard to navigate outside of tourist areas",
        sourceLabel: "r/expat",
        sourceAgeLabel: "2.9y ago",
        sourceUrl: "https://www.reddit.com/r/expat/comments/14smhcz/instant_regret_moving_to_madrid/",
        topic: "language",
        sentiment: "negative",
      },
      {
        quote: "The obligation to excessively socialise or else deal with complete ostracisation makes it worse.",
        sourceLabel: "r/expat",
        sourceAgeLabel: "2.9y ago",
        sourceUrl: "https://www.reddit.com/r/expat/comments/14smhcz/instant_regret_moving_to_madrid/",
        topic: "community",
        sentiment: "mixed",
      },
      {
        quote: "the kindness of people overwhelmed me.",
        sourceLabel: "r/Madrid",
        sourceAgeLabel: "5.3y ago",
        sourceUrl: "https://www.reddit.com/r/Madrid/comments/l1p4lc/those_of_you_that_moved_to_madrid_without/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "I personally avoided expat communities, as I didn't move to Madrid to learn English",
        sourceLabel: "r/Madrid",
        sourceAgeLabel: "5.3y ago",
        sourceUrl: "https://www.reddit.com/r/Madrid/comments/l1p4lc/those_of_you_that_moved_to_madrid_without/",
        topic: "advice",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Madrid",
        url: "https://www.reddit.com/r/GoingToSpain/comments/1q07cj0/moving_to_madrid/",
        topic: "money",
      },
      {
        label: "Moving to Madrid from Germany",
        url: "https://www.reddit.com/r/askMadrid/comments/1s9rawl/moving_to_madrid_from_germany/",
        topic: "housing",
      },
      {
        label: "Instant regret moving to Madrid",
        url: "https://www.reddit.com/r/expat/comments/14smhcz/instant_regret_moving_to_madrid/",
        topic: "language",
      },
      {
        label: "Those of you that moved to Madrid without speaking Spanish",
        url: "https://www.reddit.com/r/Madrid/comments/l1p4lc/those_of_you_that_moved_to_madrid_without/",
        topic: "community",
      },
    ],
  }),
  rotterdam: buildEnhancedReport("rotterdam", {
    summary:
      "Rotterdam move stories often read like Amsterdam with slightly more breathing room, not like a fully easy alternative. The recurring themes are still housing shortage, Dutch-language admin, and a social scene that opens more through work, hobbies, and meetups than through passive expat life.",
    snapshotSignals: [
      {
        title: "Cheaper than Amsterdam is not the same as easy",
        description: "People still keep warning that the housing shortage changes the move before anything else does.",
      },
      {
        title: "English gets you through, Dutch runs the official layer",
        description: "Many public stories describe the city as English-friendly while contracts and admin still stay very Dutch.",
      },
      {
        title: "Community happens through repeated places",
        description: "Work, meetups, and clubs show up much more often than spontaneous social integration.",
      },
    ],
    storySignals: [
      {
        quote: "Bring your own house though.",
        sourceLabel: "r/Rotterdam",
        sourceAgeLabel: "3.8y ago",
        sourceUrl: "https://www.reddit.com/r/Rotterdam/comments/wlpied/moving_to_rotterdam/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Official stuff will always be in Dutch, like your rental contract.",
        sourceLabel: "r/Rotterdam",
        sourceAgeLabel: "3.8y ago",
        sourceUrl: "https://www.reddit.com/r/Rotterdam/comments/wlpied/moving_to_rotterdam/",
        topic: "bureaucracy",
        sentiment: "mixed",
      },
      {
        quote: "you can 'survive' with English.",
        sourceLabel: "r/Rotterdam",
        sourceAgeLabel: "3.8y ago",
        sourceUrl: "https://www.reddit.com/r/Rotterdam/comments/wlpied/moving_to_rotterdam/",
        topic: "language",
        sentiment: "positive",
      },
      {
        quote: "the Netherlands has a housing shortage of some 400.000 people",
        sourceLabel: "r/Rotterdam",
        sourceAgeLabel: "3.6y ago",
        sourceUrl: "https://www.reddit.com/r/Rotterdam/comments/y7984m/advice_on_moving_to_rotterdam/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "people are really nice.",
        sourceLabel: "r/Rotterdam",
        sourceAgeLabel: "3.6y ago",
        sourceUrl: "https://www.reddit.com/r/Rotterdam/comments/y7984m/advice_on_moving_to_rotterdam/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Have you tried one of the many MeetUp groups?",
        sourceLabel: "r/Rotterdam",
        sourceAgeLabel: "3.4y ago",
        sourceUrl: "https://www.reddit.com/r/Rotterdam/comments/101qo0u/making_friends_as_an_expat/",
        topic: "advice",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Rotterdam",
        url: "https://www.reddit.com/r/Rotterdam/comments/wlpied/moving_to_rotterdam/",
        topic: "housing",
      },
      {
        label: "Advice on moving to Rotterdam",
        url: "https://www.reddit.com/r/Rotterdam/comments/y7984m/advice_on_moving_to_rotterdam/",
        topic: "community",
      },
      {
        label: "Making friends as an expat",
        url: "https://www.reddit.com/r/Rotterdam/comments/101qo0u/making_friends_as_an_expat/",
        topic: "advice",
      },
    ],
  }),
  london: buildEnhancedReport("london", {
    summary:
      "London move stories tend to sound exciting and sobering at the same time. The recurring pattern is that social upside is real, but it usually comes through house shares, hobbies, and work circles rather than instant big-city magic, while cost and distance keep showing up as the main drag on everyday life.",
    snapshotSignals: [
      {
        title: "House shares are often the real entry point",
        description: "Public advice keeps circling back to house shares as both the economic and social way into London life.",
      },
      {
        title: "The city can be intensely social or intensely isolating",
        description: "The difference often comes down to whether you actively build routines, clubs, and circles early.",
      },
      {
        title: "Distance and cost shape the move",
        description: "Even when people like London, they keep warning that rent, geography, and social spending change how the city feels.",
      },
    ],
    storySignals: [
      {
        quote: "Move into a house share, you will make friends with your housemates",
        sourceLabel: "r/MovingToLondon",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/MovingToLondon/comments/1s0jzo6/is_moving_to_london_in_your_mid_20s_actually/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "London can be as sociable as you want it to be",
        sourceLabel: "r/MovingToLondon",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/MovingToLondon/comments/1s0jzo6/is_moving_to_london_in_your_mid_20s_actually/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Everybody is spread so far apart you simply cannot socialise on a spontaneous basis.",
        sourceLabel: "r/MovingToLondon",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/MovingToLondon/comments/1s0jzo6/is_moving_to_london_in_your_mid_20s_actually/",
        topic: "community",
        sentiment: "negative",
      },
      {
        quote: "A lot of Londoners socialize and meet people via sport & hobby clubs",
        sourceLabel: "r/london",
        sourceAgeLabel: "1.9y ago",
        sourceUrl: "https://www.reddit.com/r/london/comments/1dg5gc4/people_who_recently_moved_to_london_how_do_you/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "London loneliness is real",
        sourceLabel: "r/MovingToLondon",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/MovingToLondon/comments/1s35vlf/london_loneliness_is_real_how_are_people_actually/",
        topic: "regret",
        sentiment: "mixed",
      },
      {
        quote: "I’m on about 38k and I rent in a house share ... about £800pcm including bills.",
        sourceLabel: "r/MovingToLondon",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/MovingToLondon/comments/1s1asyq/is_35k_enough_in_london_if_youre_flatsharing/",
        topic: "money",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Is moving to London in your mid 20s actually worth it?",
        url: "https://www.reddit.com/r/MovingToLondon/comments/1s0jzo6/is_moving_to_london_in_your_mid_20s_actually/",
        topic: "community",
      },
      {
        label: "People who recently moved to London, how do you find it?",
        url: "https://www.reddit.com/r/london/comments/1dg5gc4/people_who_recently_moved_to_london_how_do_you/",
        topic: "community",
      },
      {
        label: "London loneliness is real",
        url: "https://www.reddit.com/r/MovingToLondon/comments/1s35vlf/london_loneliness_is_real_how_are_people_actually/",
        topic: "regret",
      },
      {
        label: "Is ~£35k enough in London if you're flatsharing?",
        url: "https://www.reddit.com/r/MovingToLondon/comments/1s1asyq/is_35k_enough_in_london_if_youre_flatsharing/",
        topic: "money",
      },
    ],
  }),
  toronto: buildEnhancedReport("toronto", {
    summary:
      "Toronto move stories tend to sound practical rather than romantic. The repeated pattern is that the city can still work well for the right person, but rent, job-market stress, and the effort of building community keep showing up as the real move questions.",
    snapshotSignals: [
      {
        title: "Housing is the first reality check",
        description: "Rent, guarantor expectations, and job-market timing show up in almost every serious move thread.",
      },
      {
        title: "The city can still pay off",
        description: "Even with the complaints, some movers sound genuinely happier there once their move structure is solid.",
      },
      {
        title: "Friendship takes more intentional effort",
        description: "A repeated theme is that many locals already have established circles, so newcomers need to build more actively.",
      },
    ],
    storySignals: [
      {
        quote: "The job market and rental prices are in shambles.",
        sourceLabel: "r/askTO",
        sourceAgeLabel: "2.1y ago",
        sourceUrl: "https://www.reddit.com/r/askTO/comments/1c0juxk/moving_to_toronto/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "Regular studio apartments are going for $2000+ a month.",
        sourceLabel: "r/askTO",
        sourceAgeLabel: "2.1y ago",
        sourceUrl: "https://www.reddit.com/r/askTO/comments/1c0juxk/moving_to_toronto/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Landlords look for proof of employment and will sometimes ask for guarantors.",
        sourceLabel: "r/askTO",
        sourceAgeLabel: "2.1y ago",
        sourceUrl: "https://www.reddit.com/r/askTO/comments/1c0juxk/moving_to_toronto/",
        topic: "bureaucracy",
        sentiment: "mixed",
      },
      {
        quote: "I'm infinitely happier here than I would have been living in England.",
        sourceLabel: "r/askTO",
        sourceAgeLabel: "2.1y ago",
        sourceUrl: "https://www.reddit.com/r/askTO/comments/1c0juxk/moving_to_toronto/",
        topic: "regret",
        sentiment: "positive",
      },
      {
        quote: "most people who grew up in Toronto already have a tight circle of friends here",
        sourceLabel: "r/askTO",
        sourceAgeLabel: "4.8y ago",
        sourceUrl: "https://www.reddit.com/r/askTO/comments/ozrlmj/for_those_who_moved_to_toronto_from_elsewhere_not/",
        topic: "community",
        sentiment: "negative",
      },
      {
        quote: "Check out r/TorontoHangoutFriends",
        sourceLabel: "r/askTO",
        sourceAgeLabel: "last year",
        sourceUrl: "https://www.reddit.com/r/askTO/comments/1l31nwf/megathread_how_to_make_friends_in_toronto/",
        topic: "advice",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Toronto…",
        url: "https://www.reddit.com/r/askTO/comments/1c0juxk/moving_to_toronto/",
        topic: "housing",
      },
      {
        label: "For those who moved to Toronto from elsewhere",
        url: "https://www.reddit.com/r/askTO/comments/ozrlmj/for_those_who_moved_to_toronto_from_elsewhere_not/",
        topic: "community",
      },
      {
        label: "MEGATHREAD: How to Make Friends in Toronto",
        url: "https://www.reddit.com/r/askTO/comments/1l31nwf/megathread_how_to_make_friends_in_toronto/",
        topic: "advice",
      },
    ],
  }),
  vancouver: buildEnhancedReport("vancouver", {
    summary:
      "Vancouver move stories often sound like a tradeoff people understand but still struggle with: huge natural payoff, high daily quality, and one of the toughest cost-versus-leftover-income stories in the whole app. A lot of advice pushes people toward suburbs, room shares, or a serious rethink before committing long-term.",
    snapshotSignals: [
      {
        title: "The scenery is real, the housing pain is too",
        description: "People often love Vancouver's nature and still warn others off the move because of how little money can be left after rent.",
      },
      {
        title: "The first compromise is often location",
        description: "A lot of advice pushes newcomers toward Burnaby, the suburbs, or shared housing instead of a central Vancouver address.",
      },
      {
        title: "Long-term math is the main doubt",
        description: "Many stories sound less like 'never move here' and more like 'be honest about what the city costs over time.'",
      },
    ],
    storySignals: [
      {
        quote: "There's no shortcut to housing the west coast.",
        sourceLabel: "r/vancouverhousing",
        sourceAgeLabel: "3.2y ago",
        sourceUrl: "https://www.reddit.com/r/vancouverhousing/comments/11qxevu/moving_to_vancouver/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "visit Vancouver but don't live here.",
        sourceLabel: "r/vancouverhousing",
        sourceAgeLabel: "3.2y ago",
        sourceUrl: "https://www.reddit.com/r/vancouverhousing/comments/11qxevu/moving_to_vancouver/",
        topic: "regret",
        sentiment: "negative",
      },
      {
        quote: "I love Vancouver, the weather and the scenery. I don't love having almost nothing left over each month.",
        sourceLabel: "r/vancouverhousing",
        sourceAgeLabel: "3.2y ago",
        sourceUrl: "https://www.reddit.com/r/vancouverhousing/comments/11qxevu/moving_to_vancouver/",
        topic: "money",
        sentiment: "mixed",
      },
      {
        quote: "Due to housing crisis.",
        sourceLabel: "r/askvan",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/askvan/comments/1rfqhnt/moving_to_vancouver/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "you’d have better luck looking for something in the suburbs",
        sourceLabel: "r/askvan",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/askvan/comments/1ous0yr/moving_to_vancouver/",
        topic: "advice",
        sentiment: "mixed",
      },
      {
        quote: "Burnaby is close , nice city and easy access to transit and Vancouver.",
        sourceLabel: "r/askvan",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/askvan/comments/1ous0yr/moving_to_vancouver/",
        topic: "advice",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Vancouver",
        url: "https://www.reddit.com/r/vancouverhousing/comments/11qxevu/moving_to_vancouver/",
        topic: "housing",
      },
      {
        label: "Moving to Vancouver",
        url: "https://www.reddit.com/r/askvan/comments/1rfqhnt/moving_to_vancouver/",
        topic: "housing",
      },
      {
        label: "Moving to Vancouver",
        url: "https://www.reddit.com/r/askvan/comments/1ous0yr/moving_to_vancouver/",
        topic: "advice",
      },
    ],
  }),
  "new-york": buildEnhancedReport("new-york", {
    summary:
      "New York move stories stay surprisingly consistent: the city is expensive, demanding, and sometimes absurd, but a lot of people still describe it as worth it when they choose their neighborhood carefully, accept roommates early, and build their life around the city's pace instead of fighting it.",
    snapshotSignals: [
      {
        title: "Neighborhood choice is life choice",
        description: "People repeatedly say your day-to-day city experience changes dramatically based on where you land first.",
      },
      {
        title: "Roommates are often the real entry ticket",
        description: "A lot of public advice pushes newcomers toward smaller apartments, roommates, and cheaper first landings instead of trying to win NYC in one move.",
      },
      {
        title: "The city can be brutal and deeply worth it",
        description: "Many move stories describe New York as exhausting in the short run and formative in the long run.",
      },
    ],
    storySignals: [
      {
        quote: "Moving to a place like NYC is a big step for a lot of reasons (cost being the most notable one)",
        sourceLabel: "r/AskNYC",
        sourceAgeLabel: "1.3y ago",
        sourceUrl: "https://www.reddit.com/r/AskNYC/comments/1i5w2bh/moving_to_nyc_23m/",
        topic: "money",
        sentiment: "mixed",
      },
      {
        quote: "it’s a great city for anyone to move to, you can be whoever you want to be here",
        sourceLabel: "r/AskNYC",
        sourceAgeLabel: "1.3y ago",
        sourceUrl: "https://www.reddit.com/r/AskNYC/comments/1i5w2bh/moving_to_nyc_23m/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Just try ur best to find cheaper housing even if it means roommates",
        sourceLabel: "r/AskNYC",
        sourceAgeLabel: "1.3y ago",
        sourceUrl: "https://www.reddit.com/r/AskNYC/comments/1i5w2bh/moving_to_nyc_23m/",
        topic: "housing",
        sentiment: "mixed",
      },
      {
        quote: "Overall, it'll be a lot of work, it'll be hard",
        sourceLabel: "r/movingtoNYC",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/movingtoNYC/comments/1owbe64/moving_to_nyc/",
        topic: "first_90_days",
        sentiment: "negative",
      },
      {
        quote: "Your entire social life and career prospects can change based on where you live",
        sourceLabel: "r/movingtoNYC",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/movingtoNYC/comments/1pgwbd9/things_you_wish_you_knew_before_moving_to_nyc/",
        topic: "advice",
        sentiment: "mixed",
      },
      {
        quote: "If you step foot outside, you're paying for something.",
        sourceLabel: "r/movingtoNYC",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/movingtoNYC/comments/1pgwbd9/things_you_wish_you_knew_before_moving_to_nyc/",
        topic: "money",
        sentiment: "negative",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to NYC (23M)",
        url: "https://www.reddit.com/r/AskNYC/comments/1i5w2bh/moving_to_nyc_23m/",
        topic: "housing",
      },
      {
        label: "Moving to NYC",
        url: "https://www.reddit.com/r/movingtoNYC/comments/1owbe64/moving_to_nyc/",
        topic: "first_90_days",
      },
      {
        label: "Things you wish you knew before moving to NYC",
        url: "https://www.reddit.com/r/movingtoNYC/comments/1pgwbd9/things_you_wish_you_knew_before_moving_to_nyc/",
        topic: "advice",
      },
    ],
  }),
  "san-francisco": buildEnhancedReport("san-francisco", {
    summary:
      "San Francisco move stories usually sound like an exercise in timing and presence. The strongest repeated signals are that remote apartment hunting barely works, neighborhoods matter enormously, and the city gets easier once the first housing decision is treated as an experiment rather than a forever choice.",
    snapshotSignals: [
      {
        title: "You often need to be here to win",
        description: "A lot of public advice treats in-person searching as the real way to break into the housing market.",
      },
      {
        title: "The first neighborhood is rarely the last word",
        description: "People repeatedly suggest using the first place as a base and refining your map of the city later.",
      },
      {
        title: "Housemates still unlock the city",
        description: "Plenty of move stories tie housing survival and early friendships to shared living, not solo perfection.",
      },
    ],
    storySignals: [
      {
        quote: "SF housing market is brutal especially when your hunting from outside the state",
        sourceLabel: "r/AskSF",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/AskSF/comments/1shbbj3/moving_to_sf/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "landlords want to meet you in person and competition is fierce.",
        sourceLabel: "r/AskSF",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/AskSF/comments/1shbbj3/moving_to_sf/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "In general you must be present to win.",
        sourceLabel: "r/AskSF",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/AskSF/comments/1shbbj3/moving_to_sf/",
        topic: "advice",
        sentiment: "mixed",
      },
      {
        quote: "Trying to find a valid apartment or house in San Francisco from a remote location will be an exercise in futility.",
        sourceLabel: "r/AskSF",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/AskSF/comments/1shbbj3/moving_to_sf/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "When I moved here, I meet a lot of new friends through my housemates",
        sourceLabel: "r/AskSF",
        sourceAgeLabel: "1.9y ago",
        sourceUrl: "https://www.reddit.com/r/AskSF/comments/1dqnrbo/moving_to_sf/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "You can get to know the city from there and move to another neighborhood once you know the city better.",
        sourceLabel: "r/AskSF",
        sourceAgeLabel: "3.1y ago",
        sourceUrl: "https://www.reddit.com/r/AskSF/comments/12rtdgf/moving_to_sf_i_have_no_idea_where_to_live/",
        topic: "advice",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to SF",
        url: "https://www.reddit.com/r/AskSF/comments/1shbbj3/moving_to_sf/",
        topic: "housing",
      },
      {
        label: "Moving to SF",
        url: "https://www.reddit.com/r/AskSF/comments/1dqnrbo/moving_to_sf/",
        topic: "community",
      },
      {
        label: "Moving to SF, I have no idea where to live",
        url: "https://www.reddit.com/r/AskSF/comments/12rtdgf/moving_to_sf_i_have_no_idea_where_to_live/",
        topic: "advice",
      },
    ],
  }),
  miami: buildEnhancedReport("miami", {
    summary:
      "Miami public stories are some of the sharpest in the whole dataset: people still rave about family, food, weather, and cultural intensity, but the same threads keep hammering cost, traffic, and the experience of living there without Spanish or without a very comfortable budget.",
    snapshotSignals: [
      {
        title: "The lifestyle is vivid, the math is harsh",
        description: "A lot of stories describe Miami as deeply fun to visit and much harder to carry as normal life.",
      },
      {
        title: "Spanish changes the city",
        description: "You can survive without it, but many people say the social and practical experience is narrower if you stay monolingual.",
      },
      {
        title: "Traffic and friction are part of the move",
        description: "Cost, driving time, and social roughness show up again and again in real move stories.",
      },
    ],
    storySignals: [
      {
        quote: "the rent-to-income ratio is brutal",
        sourceLabel: "r/Miami",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/Miami/comments/1s1qekj/miami_cost_of_living_reality_check_the/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "People in Miami Are So Damn Rude and Unfriendly to Non-Spanish Speakers",
        sourceLabel: "r/Miami",
        sourceAgeLabel: "1.2y ago",
        sourceUrl: "https://www.reddit.com/r/Miami/comments/1jb6w3j/miami_is_the_most_unfriendly_cliquish_city_ive/",
        topic: "community",
        sentiment: "negative",
      },
      {
        quote: "You can survive without knowing Spanish, but you’ll be so limited",
        sourceLabel: "r/Miami",
        sourceAgeLabel: "3.0y ago",
        sourceUrl: "https://www.reddit.com/r/Miami/comments/13ei7s0/can_you_have_a_good_social_life_in_miami_without/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "Leave it to Miami to make a 20 minute trip into an hour trip.",
        sourceLabel: "r/Miami",
        sourceAgeLabel: "1.3y ago",
        sourceUrl: "https://www.reddit.com/r/Miami/comments/1i55atm/dont_move_to_miami_for_the_love_of_god/",
        topic: "first_90_days",
        sentiment: "negative",
      },
      {
        quote: "I miss easy access to the coast, the beaches, the good cuisine",
        sourceLabel: "r/Miami",
        sourceAgeLabel: "5d ago",
        sourceUrl: "https://www.reddit.com/r/Miami/comments/1td177c/people_who_relocated_from_miami_do_you_miss_it/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "the cost of living was outrageous in Miami",
        sourceLabel: "r/Miami",
        sourceAgeLabel: "4wk ago",
        sourceUrl: "https://www.reddit.com/r/Miami/comments/1ssfpkd/why_have_you_left_miami/",
        topic: "money",
        sentiment: "negative",
      },
    ],
    sourceLinks: [
      {
        label: "Miami cost of living reality check",
        url: "https://www.reddit.com/r/Miami/comments/1s1qekj/miami_cost_of_living_reality_check_the/",
        topic: "money",
      },
      {
        label: "Miami is the most unfriendly, cliquish city I've ever lived in",
        url: "https://www.reddit.com/r/Miami/comments/1jb6w3j/miami_is_the_most_unfriendly_cliquish_city_ive/",
        topic: "community",
      },
      {
        label: "Can you have a good social life in Miami without knowing Spanish?",
        url: "https://www.reddit.com/r/Miami/comments/13ei7s0/can_you_have_a_good_social_life_in_miami_without/",
        topic: "language",
      },
      {
        label: "Don't move to Miami, for the love of god",
        url: "https://www.reddit.com/r/Miami/comments/1i55atm/dont_move_to_miami_for_the_love_of_god/",
        topic: "first_90_days",
      },
    ],
  }),
  dubai: buildEnhancedReport("dubai", {
    summary:
      "Dubai move stories tend to sound highly conditional. Public reviews often say the city can be excellent with the right package, community, and spending power, but underpaid or under-supported moves become stressful fast because housing, schooling, and everyday costs compound quickly.",
    snapshotSignals: [
      {
        title: "Dubai is a package city",
        description: "A lot of stories say the move works best when the salary, housing support, and benefits are already clear before arrival.",
      },
      {
        title: "The upside is real when the money is real",
        description: "People still praise safety, clean streets, expat networks, and lifestyle range when the economics line up.",
      },
      {
        title: "Underpaid moves feel brutal quickly",
        description: "Many of the hardest stories are not about Dubai itself, but about arriving without enough buffer or support.",
      },
    ],
    storySignals: [
      {
        quote: "Dubai is a perfect city, only if you have money you shall thrive",
        sourceLabel: "r/UAE",
        sourceAgeLabel: "11mo ago",
        sourceUrl: "https://www.reddit.com/r/UAE/comments/1l6ybzc/regret_moving_to_dubai/",
        topic: "money",
        sentiment: "mixed",
      },
      {
        quote: "it is brutal. The employers are the main guys in the playing field right now",
        sourceLabel: "r/UAE",
        sourceAgeLabel: "11mo ago",
        sourceUrl: "https://www.reddit.com/r/UAE/comments/1l6ybzc/regret_moving_to_dubai/",
        topic: "bureaucracy",
        sentiment: "negative",
      },
      {
        quote: "it's all about who you know ie networking",
        sourceLabel: "r/dubai",
        sourceAgeLabel: "2.3y ago",
        sourceUrl: "https://www.reddit.com/r/dubai/comments/1aozxpy/do_you_regret_moving_to_uae_dubai_abu_dhabi_pros/",
        topic: "community",
        sentiment: "mixed",
      },
      {
        quote: "Would suggest a room or bedspace initially to cut your costs",
        sourceLabel: "r/dubai",
        sourceAgeLabel: "1.2y ago",
        sourceUrl: "https://www.reddit.com/r/dubai/comments/1j9hsrg/need_advice_on_relocating_to_dubai_regret_not/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "unless your employer pays for everything ... it quickly adds up",
        sourceLabel: "r/dubai",
        sourceAgeLabel: "1.8y ago",
        sourceUrl: "https://www.reddit.com/r/dubai/comments/1epo9b3/do_expats_like_living_in_dubai/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "I would not recommend to move without relocation allowance",
        sourceLabel: "r/DubaiJobs",
        sourceAgeLabel: "last year",
        sourceUrl: "https://www.reddit.com/r/DubaiJobs/comments/1ks086x/move_to_dubai_as_expat_without_relocation_package/",
        topic: "advice",
        sentiment: "negative",
      },
    ],
    sourceLinks: [
      {
        label: "Regret moving to Dubai",
        url: "https://www.reddit.com/r/UAE/comments/1l6ybzc/regret_moving_to_dubai/",
        topic: "money",
      },
      {
        label: "Do you regret moving to UAE (Dubai, Abu Dhabi)?",
        url: "https://www.reddit.com/r/dubai/comments/1aozxpy/do_you_regret_moving_to_uae_dubai_abu_dhabi_pros/",
        topic: "community",
      },
      {
        label: "Need Advice on Relocating to Dubai",
        url: "https://www.reddit.com/r/dubai/comments/1j9hsrg/need_advice_on_relocating_to_dubai_regret_not/",
        topic: "advice",
      },
      {
        label: "Do expats like living in Dubai?",
        url: "https://www.reddit.com/r/dubai/comments/1epo9b3/do_expats_like_living_in_dubai/",
        topic: "money",
      },
    ],
  }),
  bangkok: buildEnhancedReport("bangkok", {
    summary:
      "Bangkok move stories often sound unexpectedly positive, but not careless. People repeatedly talk about quality-of-life upside, easier friend-making than expected, and better housing value than some regional rivals, while still warning that the honeymoon phase is real and Thai unlocks much more of the city over time.",
    snapshotSignals: [
      {
        title: "Bangkok often feels easier after arrival than before",
        description: "A lot of stories describe the move as emotionally intense but more natural in practice than people feared.",
      },
      {
        title: "Thai is not optional forever",
        description: "Many public stories say you can start in English, but the city opens much more once Thai enters the picture.",
      },
      {
        title: "Value is strong if you choose well",
        description: "People often recommend going a bit further out, choosing the right condo type, and not assuming every cheap option is worth it.",
      },
    ],
    storySignals: [
      {
        quote: "pretty easy to make friends if you try.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "2.9y ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/145834i/is_it_a_good_idea_to_move_to_bangkok_as_an_expat/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Aware the first 6 months in a country is the honeymoon phase of expat life.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "1.1y ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/1jz1zz6/i_moved_from_europe_to_bangkok_at_25_it_feels/",
        topic: "first_90_days",
        sentiment: "mixed",
      },
      {
        quote: "consider moving a bit further out — you’ll find bigger condos at cheaper prices.",
        sourceLabel: "r/Bangkok",
        sourceAgeLabel: "9mo ago",
        sourceUrl: "https://www.reddit.com/r/Bangkok/comments/1mrzc4d/moving_to_bangkok_tips_for_a_firsttime_expat/",
        topic: "housing",
        sentiment: "positive",
      },
      {
        quote: "You can get a better quality life in Thailand with less than half",
        sourceLabel: "r/Bangkok",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/Bangkok/comments/1s2vsno/bangkok_relocation/",
        topic: "money",
        sentiment: "positive",
      },
      {
        quote: "Make sure the place you move to doesnt flood a lot.",
        sourceLabel: "r/expatsinbangkok",
        sourceAgeLabel: "last week",
        sourceUrl: "https://www.reddit.com/r/expatsinbangkok/comments/1t9h4d5/moving_to_bkk_top_3_mistakes_to_avoid/",
        topic: "housing",
        sentiment: "mixed",
      },
      {
        quote: "Start learning Thai immediately, invest in the language to fully unlock the city",
        sourceLabel: "r/expatsinbangkok",
        sourceAgeLabel: "last week",
        sourceUrl: "https://www.reddit.com/r/expatsinbangkok/comments/1t9h4d5/moving_to_bkk_top_3_mistakes_to_avoid/",
        topic: "language",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Is it a good idea to move to Bangkok as an expat?",
        url: "https://www.reddit.com/r/expats/comments/145834i/is_it_a_good_idea_to_move_to_bangkok_as_an_expat/",
        topic: "community",
      },
      {
        label: "I moved from Europe to Bangkok at 25",
        url: "https://www.reddit.com/r/expats/comments/1jz1zz6/i_moved_from_europe_to_bangkok_at_25_it_feels/",
        topic: "first_90_days",
      },
      {
        label: "Moving to Bangkok - Tips for a First-Time Expat?",
        url: "https://www.reddit.com/r/Bangkok/comments/1mrzc4d/moving_to_bangkok_tips_for_a_firsttime_expat/",
        topic: "housing",
      },
      {
        label: "Bangkok Relocation",
        url: "https://www.reddit.com/r/Bangkok/comments/1s2vsno/bangkok_relocation/",
        topic: "money",
      },
      {
        label: "Moving to BKK - Top 3 mistakes to avoid?",
        url: "https://www.reddit.com/r/expatsinbangkok/comments/1t9h4d5/moving_to_bkk_top_3_mistakes_to_avoid/",
        topic: "language",
      },
    ],
  }),
  porto: buildEnhancedReport("porto", {
    summary:
      "Porto move stories usually sound softer than Lisbon's, but not frictionless. People describe the city as beautiful, easier on the nerves, and still international enough for a landing, while repeatedly warning that Portuguese matters more than many assume and that housing has tightened along with Porto's popularity.",
    snapshotSignals: [
      {
        title: "Porto feels softer, not effortless",
        description: "Public stories often frame Porto as calmer than Lisbon, but still shaped by housing tradeoffs and language friction.",
      },
      {
        title: "English helps, Portuguese matters sooner",
        description: "A repeated theme is that people can start in English and still find daily life surprisingly limited without Portuguese.",
      },
      {
        title: "The value case is under pressure",
        description: "Many stories treat Porto as better value than Lisbon, but no longer as an easy low-cost loophole.",
      },
    ],
    storySignals: [
      {
        quote: "it all comes down to how much salary you get and how much apartment would cost in the end.",
        sourceLabel: "r/portugal",
        sourceAgeLabel: "4.7y ago",
        sourceUrl: "https://www.reddit.com/r/portugal/comments/plq7rp/moving_into_porto_as_an_expat/",
        topic: "money",
        sentiment: "mixed",
      },
      {
        quote: "things as finding a flat/apartment may get a bit difficult by yourself",
        sourceLabel: "r/portugal",
        sourceAgeLabel: "4.7y ago",
        sourceUrl: "https://www.reddit.com/r/portugal/comments/plq7rp/moving_into_porto_as_an_expat/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "i was quite surprise how hard it is to get around without Portuguese, even though lots of people speak English.",
        sourceLabel: "r/porto",
        sourceAgeLabel: "4.2y ago",
        sourceUrl: "https://www.reddit.com/r/porto/comments/tduz8w/living_in_porto_what_is_it_like/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "I've made some friends through porto expat groups on FB",
        sourceLabel: "r/porto",
        sourceAgeLabel: "4.2y ago",
        sourceUrl: "https://www.reddit.com/r/porto/comments/tduz8w/living_in_porto_what_is_it_like/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Everyone says you don't need to learn the language, which is *technically* true if you're in Lisbon or Porto and speak English.",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1rgnti1/expats_whove_successfully_established_a_life_in/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "There really is a life before and a life after learning Portuguese",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1rgnti1/expats_whove_successfully_established_a_life_in/",
        topic: "advice",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Moving into Porto as an expat",
        url: "https://www.reddit.com/r/portugal/comments/plq7rp/moving_into_porto_as_an_expat/",
        topic: "housing",
      },
      {
        label: "Living in Porto, what is it like?",
        url: "https://www.reddit.com/r/porto/comments/tduz8w/living_in_porto_what_is_it_like/",
        topic: "community",
      },
      {
        label: "Expats who've successfully established a life in Portugal",
        url: "https://www.reddit.com/r/PortugalExpats/comments/1rgnti1/expats_whove_successfully_established_a_life_in/",
        topic: "advice",
      },
    ],
  }),
  montreal: buildEnhancedReport("montreal", {
    summary:
      "Montreal move stories usually carry a split personality: people still talk about culture, lower burn than Toronto, and real character, but the same threads keep stressing French, housing pressure, and the fact that belonging in Montreal is not the same as just functioning there in English.",
    snapshotSignals: [
      {
        title: "French changes the whole city",
        description: "Public stories keep returning to the difference between getting by in Montreal and actually building a fuller life there.",
      },
      {
        title: "Housing is cheaper than Toronto, not easy",
        description: "Rent still shows up as a stress point, especially for families or anyone arriving with rigid expectations.",
      },
      {
        title: "Montreal can be deeply appealing and still socially sharp",
        description: "Some stories sound full of affection for the city while also describing language and cultural judgment as very real.",
      },
    ],
    storySignals: [
      {
        quote: "learn French as fast as possible if you're planning to move there",
        sourceLabel: "r/montrealhousing",
        sourceAgeLabel: "3.3y ago",
        sourceUrl: "https://www.reddit.com/r/montrealhousing/comments/10ize3t/moving_to_montreal_kinda_nervous/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "I have 3 kids, which makes it impossible to find affordable housing.",
        sourceLabel: "r/montrealhousing",
        sourceAgeLabel: "3.3y ago",
        sourceUrl: "https://www.reddit.com/r/montrealhousing/comments/10ize3t/moving_to_montreal_kinda_nervous/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "I ALWAYS speak French first. But I always hear a judgement in their tone of voice",
        sourceLabel: "r/montrealhousing",
        sourceAgeLabel: "3.3y ago",
        sourceUrl: "https://www.reddit.com/r/montrealhousing/comments/10ize3t/moving_to_montreal_kinda_nervous/",
        topic: "community",
        sentiment: "negative",
      },
      {
        quote: "the cost of living here, especially housing, is extremely expensive.",
        sourceLabel: "r/montreal",
        sourceAgeLabel: "1.1y ago",
        sourceUrl: "https://www.reddit.com/r/montreal/comments/1jmow3b/relocating_to_montreal/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "even she has trouble getting served in english here at times.",
        sourceLabel: "r/montreal",
        sourceAgeLabel: "1.1y ago",
        sourceUrl: "https://www.reddit.com/r/montreal/comments/1jmow3b/relocating_to_montreal/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "I’m trying to figure out what’s realistic for me job wise in Montréal, especially with French",
        sourceLabel: "r/TravelCanada",
        sourceAgeLabel: "yesterday",
        sourceUrl: "https://www.reddit.com/r/TravelCanada/comments/1tgydr5/moving_to_montreal/",
        topic: "language",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Montreal; kinda nervous",
        url: "https://www.reddit.com/r/montrealhousing/comments/10ize3t/moving_to_montreal_kinda_nervous/",
        topic: "language",
      },
      {
        label: "Relocating to Montreal",
        url: "https://www.reddit.com/r/montreal/comments/1jmow3b/relocating_to_montreal/",
        topic: "money",
      },
      {
        label: "Moving to Montreal",
        url: "https://www.reddit.com/r/TravelCanada/comments/1tgydr5/moving_to_montreal/",
        topic: "language",
      },
    ],
  }),
  prague: buildEnhancedReport("prague", {
    summary:
      "Prague move stories are often more positive than people expect, but they are rarely naive. The repeated pattern is that the city is highly livable and expat-friendly by regional standards, while rents, housing quality, and the long arc of learning Czech still shape whether the move feels temporary or truly grounded.",
    snapshotSignals: [
      {
        title: "Prague is friendlier than its stereotype",
        description: "A lot of public stories describe the city as easier for foreigners than expected, especially compared with other central European capitals.",
      },
      {
        title: "Housing has become a real pressure point",
        description: "Even positive stories increasingly mention rent inflation and apartment search stress.",
      },
      {
        title: "You can start in English, but Czech is the long game",
        description: "Public stories often say daily survival is manageable in English while deeper integration still rewards language effort.",
      },
    ],
    storySignals: [
      {
        quote: "How realistic it is to move over and find housing then going to find work",
        sourceLabel: "r/Prague",
        sourceAgeLabel: "5.5y ago",
        sourceUrl: "https://www.reddit.com/r/Prague/comments/k0g1ob/moving_to_prague/",
        topic: "first_90_days",
        sentiment: "mixed",
      },
      {
        quote: "they could also get by without it in the day to day life without issues",
        sourceLabel: "r/Prague",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/Prague/comments/1rhi2gs/advice_on_moving_to_prague/",
        topic: "language",
        sentiment: "positive",
      },
      {
        quote: "house prices and rents, it's gone completely out of control here.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "4mo ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/1pwbyrv/i_moved_to_the_czech_republic_prague_believing_i/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Excluding housing, I still consider Prague relatively a low cost of living city",
        sourceLabel: "r/expats",
        sourceAgeLabel: "4mo ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/1pwbyrv/i_moved_to_the_czech_republic_prague_believing_i/",
        topic: "money",
        sentiment: "mixed",
      },
      {
        quote: "Prague has a multicultural and multinational population that makes it easier to call it home.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "4mo ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/1pwbyrv/i_moved_to_the_czech_republic_prague_believing_i/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "everyone likes it here, even those who don't speak Czech language.",
        sourceLabel: "r/Prague",
        sourceAgeLabel: "2.6y ago",
        sourceUrl: "https://www.reddit.com/r/Prague/comments/17ay8fw/good_and_bad_what_would_you_tell_someone_moving/",
        topic: "community",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Prague",
        url: "https://www.reddit.com/r/Prague/comments/k0g1ob/moving_to_prague/",
        topic: "first_90_days",
      },
      {
        label: "Advice on moving to Prague",
        url: "https://www.reddit.com/r/Prague/comments/1rhi2gs/advice_on_moving_to_prague/",
        topic: "language",
      },
      {
        label: "I moved to the Czech Republic (Prague)...",
        url: "https://www.reddit.com/r/expats/comments/1pwbyrv/i_moved_to_the_czech_republic_prague_believing_i/",
        topic: "housing",
      },
      {
        label: "Good and bad, what would you tell someone moving to Prague?",
        url: "https://www.reddit.com/r/Prague/comments/17ay8fw/good_and_bad_what_would_you_tell_someone_moving/",
        topic: "community",
      },
    ],
  }),
  "mexico-city": buildEnhancedReport("mexico-city", {
    summary:
      "Mexico City move stories often sound exciting, but not casual. The strongest recurring themes are that Spanish changes how the city treats you, neighborhood choice changes almost everything, and daily-life friction is easier to absorb once you stop comparing CDMX to a smaller or quieter city.",
    snapshotSignals: [
      {
        title: "Spanish changes the move",
        description: "Public stories repeatedly say you can get by in some neighborhoods without strong Spanish, but life gets much smoother when you actually use the language.",
      },
      {
        title: "Neighborhood fit is half the story",
        description: "A lot of advice focuses less on 'Mexico City' as one thing and more on choosing the right part of it for your real routine.",
      },
      {
        title: "The city rewards adaptation",
        description: "Noise, traffic, altitude, and scale show up as the friction points that either wear people down or become part of the charm.",
      },
    ],
    storySignals: [
      {
        quote: "No, aprende español",
        sourceLabel: "r/MexicoCity",
        sourceAgeLabel: "3.0y ago",
        sourceUrl: "https://www.reddit.com/r/MexicoCity/comments/13epth7/moving_to_mexico_city_looking_for_advice/",
        topic: "language",
        sentiment: "negative",
      },
      {
        quote: "el tráfico es fatal",
        sourceLabel: "r/MexicoCity",
        sourceAgeLabel: "3.0y ago",
        sourceUrl: "https://www.reddit.com/r/MexicoCity/comments/13epth7/moving_to_mexico_city_looking_for_advice/",
        topic: "first_90_days",
        sentiment: "negative",
      },
      {
        quote: "Not speaking Spanish should not be a problem as long as you stay in condesa/polanco/reforma",
        sourceLabel: "r/MexicoCity",
        sourceAgeLabel: "6.0y ago",
        sourceUrl: "https://www.reddit.com/r/MexicoCity/comments/gq0ebg/moving_to_mexico_city/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "people tend to be nicer if you speak to them in Spanish",
        sourceLabel: "r/MexicoCity",
        sourceAgeLabel: "6.0y ago",
        sourceUrl: "https://www.reddit.com/r/MexicoCity/comments/gq0ebg/moving_to_mexico_city/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "the hardest thing to adjust to was the altitude and pollution.",
        sourceLabel: "r/mexicoexpats",
        sourceAgeLabel: "2.2y ago",
        sourceUrl: "https://www.reddit.com/r/mexicoexpats/comments/1b59gzs/moving_to_mexico/",
        topic: "first_90_days",
        sentiment: "mixed",
      },
      {
        quote: "Mexico City is practically a whole different country.",
        sourceLabel: "r/mexicoexpats",
        sourceAgeLabel: "last year",
        sourceUrl: "https://www.reddit.com/r/mexicoexpats/comments/1l1gwuw/moving_to_mexico_city_for_4_months/",
        topic: "community",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Mexico City (looking for advice)",
        url: "https://www.reddit.com/r/MexicoCity/comments/13epth7/moving_to_mexico_city_looking_for_advice/",
        topic: "language",
      },
      {
        label: "moving to Mexico city.",
        url: "https://www.reddit.com/r/MexicoCity/comments/gq0ebg/moving_to_mexico_city/",
        topic: "community",
      },
      {
        label: "Moving to Mexico",
        url: "https://www.reddit.com/r/mexicoexpats/comments/1b59gzs/moving_to_mexico/",
        topic: "first_90_days",
      },
      {
        label: "Moving to Mexico City for 4 months",
        url: "https://www.reddit.com/r/mexicoexpats/comments/1l1gwuw/moving_to_mexico_city_for_4_months/",
        topic: "community",
      },
    ],
  }),
  warsaw: buildEnhancedReport("warsaw", {
    summary:
      "Warsaw move stories usually sound more practical than dreamy. People describe the city as functional, safe, and good value by EU-capital standards, while also warning that housing, paperwork details, and building a social life without Polish can take more work than the city’s efficiency first suggests.",
    snapshotSignals: [
      {
        title: "Warsaw works best when you're practical",
        description: "Public stories often praise the city’s function and value, but not as a place that instantly makes life easy.",
      },
      {
        title: "Housing is doable, not casual",
        description: "Finding rooms and flats is possible, but the repeated advice is still to use networks, agents, and realistic expectations.",
      },
      {
        title: "Social life takes intention",
        description: "Many stories imply the city is easier to live in than to immediately belong in.",
      },
    ],
    storySignals: [
      {
        quote: "I found a room for rent on Facebook.",
        sourceLabel: "r/warsaw",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/warsaw/comments/1rbqlr4/moving_to_warsaw/",
        topic: "housing",
        sentiment: "mixed",
      },
      {
        quote: "You won’t need to move much in terms of home goods unless it has sentimental value.",
        sourceLabel: "r/warsaw",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/warsaw/comments/1odccqu/moving_from_the_us_to_warsaw/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "Sign up to the expat Facebook groups, Expat Exchange, or TimeLeft.",
        sourceLabel: "r/warsaw",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/warsaw/comments/1odccqu/moving_from_the_us_to_warsaw/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "when they say \"3 beds\" they actually mean 3 ROOMS",
        sourceLabel: "r/warsaw",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/warsaw/comments/1odccqu/moving_from_the_us_to_warsaw/",
        topic: "housing",
        sentiment: "mixed",
      },
      {
        quote: "Maybe important to mention, I am an expat and I don't speak Polish.",
        sourceLabel: "r/warsaw",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/warsaw/comments/1mywp27/dating_in_warsaw/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "My main life goes around work, which limits my social circle to work place.",
        sourceLabel: "r/warsaw",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/warsaw/comments/1mywp27/dating_in_warsaw/",
        topic: "community",
        sentiment: "negative",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Warsaw",
        url: "https://www.reddit.com/r/warsaw/comments/1rbqlr4/moving_to_warsaw/",
        topic: "housing",
      },
      {
        label: "Moving from the US to Warsaw",
        url: "https://www.reddit.com/r/warsaw/comments/1odccqu/moving_from_the_us_to_warsaw/",
        topic: "advice",
      },
      {
        label: "Dating in Warsaw",
        url: "https://www.reddit.com/r/warsaw/comments/1mywp27/dating_in_warsaw/",
        topic: "community",
      },
    ],
  }),
  "abu-dhabi": buildEnhancedReport("abu-dhabi", {
    summary:
      "Abu Dhabi move stories usually sound steadier than Dubai’s, but still very package-dependent. The recurring signals are that the city can be calm, safe, and community-friendly for expats, while housing cost, area choice, and whether your employer really supports the move shape the experience early.",
    snapshotSignals: [
      {
        title: "Area choice changes the whole feel",
        description: "Public stories spend a lot of time on neighborhoods because commute, community, and peace vary sharply by where you land.",
      },
      {
        title: "Abu Dhabi is calmer than the UAE stereotype",
        description: "A repeated theme is that people value the city’s quieter, more stable rhythm compared with Dubai.",
      },
      {
        title: "The move works best with eyes open",
        description: "Costs, housing type, and the real employer package still determine how easy the landing feels.",
      },
    ],
    storySignals: [
      {
        quote: "almuneera because it really does deliver a community experience for foreigners",
        sourceLabel: "r/abudhabi",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/abudhabi/comments/1oqmx4w/moving_to_abu_dhabi/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "one of the only roads in abu dhabi that never really has traffic.",
        sourceLabel: "r/abudhabi",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/abudhabi/comments/1oqmx4w/moving_to_abu_dhabi/",
        topic: "first_90_days",
        sentiment: "positive",
      },
      {
        quote: "Housing: Decent villas are expensive.",
        sourceLabel: "r/abudhabi",
        sourceAgeLabel: "4mo ago",
        sourceUrl: "https://www.reddit.com/r/abudhabi/comments/1q7cwap/relocating_to_abu_dhabi/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Abu Dhabi can be great but what a lot of expat don’t do is coming in with eyes wide open.",
        sourceLabel: "r/abudhabi",
        sourceAgeLabel: "4mo ago",
        sourceUrl: "https://www.reddit.com/r/abudhabi/comments/1q7cwap/relocating_to_abu_dhabi/",
        topic: "advice",
        sentiment: "mixed",
      },
      {
        quote: "Maybe live further out like Yas, it’s also beautiful in its own way with good expat community",
        sourceLabel: "r/abudhabi",
        sourceAgeLabel: "10mo ago",
        sourceUrl: "https://www.reddit.com/r/abudhabi/comments/1lvm6rh/moving_to_abu_dhabi/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "I have been living in Abu Dhabi since 2011, now in Dubai and tbh i miss Abu Dhabi a lot",
        sourceLabel: "r/abudhabi",
        sourceAgeLabel: "1.1y ago",
        sourceUrl: "https://www.reddit.com/r/abudhabi/comments/1jz2dhf/moving_to_abu_dhabi/",
        topic: "regret",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Abu Dhabi",
        url: "https://www.reddit.com/r/abudhabi/comments/1oqmx4w/moving_to_abu_dhabi/",
        topic: "community",
      },
      {
        label: "Relocating to Abu Dhabi",
        url: "https://www.reddit.com/r/abudhabi/comments/1q7cwap/relocating_to_abu_dhabi/",
        topic: "housing",
      },
      {
        label: "Moving to Abu Dhabi",
        url: "https://www.reddit.com/r/abudhabi/comments/1lvm6rh/moving_to_abu_dhabi/",
        topic: "community",
      },
      {
        label: "moving to Abu Dhabi",
        url: "https://www.reddit.com/r/abudhabi/comments/1jz2dhf/moving_to_abu_dhabi/",
        topic: "regret",
      },
    ],
  }),
  "chiang-mai": buildEnhancedReport("chiang-mai", {
    summary:
      "Chiang Mai move stories often sound unusually warm, but still nuanced. People talk about strong expat and nomad overlap, easier friend-making than expected, and good value when you choose well, while still warning that the honeymoon phase is real and local knowledge matters more than the postcard version suggests.",
    snapshotSignals: [
      {
        title: "Community is one of the city’s strongest draws",
        description: "Public stories often describe Chiang Mai as much easier for newcomers socially than many larger cities.",
      },
      {
        title: "Value depends on how you live",
        description: "People repeatedly say the city feels cheap only if you choose housing and lifestyle with some discipline.",
      },
      {
        title: "The honeymoon phase is real",
        description: "Several stories explicitly warn that the first stretch can feel magical before the long-term tradeoffs settle in.",
      },
    ],
    storySignals: [
      {
        quote: "Chiang mai has a really big expat community with a load of digital nomads around that age.",
        sourceLabel: "r/chiangmai",
        sourceAgeLabel: "2.1y ago",
        sourceUrl: "https://www.reddit.com/r/chiangmai/comments/1bql1f7/moving_to_chiang_mai/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "only issue for me was guilt because we moved with our small kids",
        sourceLabel: "r/chiangmai",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/chiangmai/comments/1p2t46l/looking_to_hear_from_people_who_moved_to_chiang/",
        topic: "regret",
        sentiment: "mixed",
      },
      {
        quote: "If you don't want to live in Thai style housing and eat majority Thai food, then the savings may be minimal.",
        sourceLabel: "r/chiangmai",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/chiangmai/comments/1p2t46l/looking_to_hear_from_people_who_moved_to_chiang/",
        topic: "money",
        sentiment: "mixed",
      },
      {
        quote: "If you want to use an agent to find a place, just go on Reddit and search realtors in Chiang Mai.",
        sourceLabel: "r/chiangmai",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/chiangmai/comments/1s64wbn/moving_to_chiang_mai/",
        topic: "housing",
        sentiment: "positive",
      },
      {
        quote: "its pretty easy to make friends if you try.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "2.9y ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/145834i/is_it_a_good_idea_to_move_to_bangkok_as_an_expat/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Aware the first 6 months in a country is the honeymoon phase of expat life.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "1.1y ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/1jz1zz6/i_moved_from_europe_to_bangkok_at_25_it_feels/",
        topic: "first_90_days",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Chiang Mai",
        url: "https://www.reddit.com/r/chiangmai/comments/1bql1f7/moving_to_chiang_mai/",
        topic: "community",
      },
      {
        label: "Looking to hear from people who moved to Chiang Mai",
        url: "https://www.reddit.com/r/chiangmai/comments/1p2t46l/looking_to_hear_from_people_who_moved_to_chiang/",
        topic: "money",
      },
      {
        label: "Moving to Chiang Mai",
        url: "https://www.reddit.com/r/chiangmai/comments/1s64wbn/moving_to_chiang_mai/",
        topic: "housing",
      },
    ],
  }),
  munich: buildEnhancedReport("munich", {
    summary:
      "Munich move stories tend to sound very clear-eyed: people praise safety, outdoors access, and strong career logic, but the repeated warnings are always the same too. Housing is hard, costs stay high, and German still matters even in a city that is better for international professionals than most of Germany.",
    snapshotSignals: [
      {
        title: "Housing is the price of entry",
        description: "Many public stories describe Munich housing as the main obstacle before the city itself even begins.",
      },
      {
        title: "The upside is practical, not cheap",
        description: "People still praise the city, but almost never describe it as good value without a very solid setup.",
      },
      {
        title: "Language still matters",
        description: "Even in an international city, public stories keep linking easier integration and daily life to better German.",
      },
    ],
    storySignals: [
      {
        quote: "The housing part seems to be the difficult part...",
        sourceLabel: "r/Munich",
        sourceAgeLabel: "3mo ago",
        sourceUrl: "https://www.reddit.com/r/Munich/comments/1r8uddw/living_in_munich/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Everything keeps getting more expensive and the housing situation is getting worse.",
        sourceLabel: "r/Munich",
        sourceAgeLabel: "1.6y ago",
        sourceUrl: "https://www.reddit.com/r/Munich/comments/1frxxno/moving_to_munich_again/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "Your housing costs are likely going to double while the quality will go down",
        sourceLabel: "r/Munich",
        sourceAgeLabel: "2.7y ago",
        sourceUrl: "https://www.reddit.com/r/Munich/comments/162mrjy/is_it_worth_moving_to_munich/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "I would say Munich is the City with the most jobs for english speakers in Germany.",
        sourceLabel: "r/Munich",
        sourceAgeLabel: "2.7y ago",
        sourceUrl: "https://www.reddit.com/r/Munich/comments/162mrjy/is_it_worth_moving_to_munich/",
        topic: "language",
        sentiment: "positive",
      },
      {
        quote: "I speak German and am older and both probably is an advantage in Munich.",
        sourceLabel: "r/Munich",
        sourceAgeLabel: "3.1y ago",
        sourceUrl: "https://www.reddit.com/r/Munich/comments/12qg8u8/regretting_for_moving_to_munich/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "Coming from a third world country myself, I think I prefer the peace of mind of living in the safest big city Germany has to offer",
        sourceLabel: "r/Munich",
        sourceAgeLabel: "3.1y ago",
        sourceUrl: "https://www.reddit.com/r/Munich/comments/12qg8u8/regretting_for_moving_to_munich/",
        topic: "community",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Living in Munich",
        url: "https://www.reddit.com/r/Munich/comments/1r8uddw/living_in_munich/",
        topic: "housing",
      },
      {
        label: "Moving to Munich... again!",
        url: "https://www.reddit.com/r/Munich/comments/1frxxno/moving_to_munich_again/",
        topic: "money",
      },
      {
        label: "Is it worth moving to Munich?",
        url: "https://www.reddit.com/r/Munich/comments/162mrjy/is_it_worth_moving_to_munich/",
        topic: "language",
      },
      {
        label: "Regretting for Moving to Munich",
        url: "https://www.reddit.com/r/Munich/comments/12qg8u8/regretting_for_moving_to_munich/",
        topic: "community",
      },
    ],
  }),
  hamburg: buildEnhancedReport("hamburg", {
    summary:
      "Hamburg move stories usually sound more grounded than flashy: strong public transport, a city people genuinely like living in, and a recurring warning that the housing market is the main pain point. The move tends to look best when people treat the housing search as serious work rather than a casual pre-arrival task.",
    snapshotSignals: [
      {
        title: "You probably do not need a car",
        description: "Public stories repeatedly praise Hamburg’s transport mix as one of the practical upsides of daily life there.",
      },
      {
        title: "Housing is the hard part",
        description: "Almost every move thread warns that finding an apartment is competitive, expensive, and time-consuming.",
      },
      {
        title: "Relocation support changes everything",
        description: "Several stories imply the move feels far easier when an employer helps with landing logistics.",
      },
    ],
    storySignals: [
      {
        quote: "Most probably you won’t need a car, the public transport is pretty solid",
        sourceLabel: "r/hamburg",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/hamburg/comments/1p0fr16/moving_to_hamburg_from_usa/",
        topic: "first_90_days",
        sentiment: "positive",
      },
      {
        quote: "However, housing is very tense at the moment.",
        sourceLabel: "r/hamburg",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/hamburg/comments/1p0fr16/moving_to_hamburg_from_usa/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "you must have confirmed 100% contractually living space",
        sourceLabel: "r/hamburg",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/hamburg/comments/1p0fr16/moving_to_hamburg_from_usa/",
        topic: "bureaucracy",
        sentiment: "negative",
      },
      {
        quote: "hunting a bigger appartement by yourself is a job in itself.",
        sourceLabel: "r/hamburg",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/hamburg/comments/1p0fr16/moving_to_hamburg_from_usa/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Germany is a good place to live, and Hamburg is no exception.",
        sourceLabel: "r/hamburg",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/hamburg/comments/1rx7irq/info_about_relocating/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "The housing market in Hamburg is by far horrible competitive at the moment.",
        sourceLabel: "r/hamburg",
        sourceAgeLabel: "4.3y ago",
        sourceUrl: "https://www.reddit.com/r/hamburg/comments/sh4gv6/moving_to_hamburg/",
        topic: "housing",
        sentiment: "negative",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Hamburg from USA",
        url: "https://www.reddit.com/r/hamburg/comments/1p0fr16/moving_to_hamburg_from_usa/",
        topic: "housing",
      },
      {
        label: "Info about relocating",
        url: "https://www.reddit.com/r/hamburg/comments/1rx7irq/info_about_relocating/",
        topic: "community",
      },
      {
        label: "Moving to Hamburg",
        url: "https://www.reddit.com/r/hamburg/comments/sh4gv6/moving_to_hamburg/",
        topic: "housing",
      },
    ],
  }),
  frankfurt: buildEnhancedReport("frankfurt", {
    summary:
      "Frankfurt move stories tend to be practical and neighborhood-specific. The repeated public signals are that housing quality varies a lot, apartment hunting is hard from abroad, and the city often feels better once people stop judging it only by the obvious stereotypes and actually learn its livable areas.",
    snapshotSignals: [
      {
        title: "The apartment search is the first real project",
        description: "Public stories repeatedly frame Frankfurt housing as stressful, especially if you are not already in Germany.",
      },
      {
        title: "Neighborhood knowledge matters",
        description: "A lot of advice focuses on where to live rather than whether to move at all.",
      },
      {
        title: "Frankfurt grows on people",
        description: "Several stories suggest the city is easier to like once your routine and social map are in place.",
      },
    ],
    storySignals: [
      {
        quote: "Not being able to check the apartment in person is obviously a downer",
        sourceLabel: "r/frankfurt",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/frankfurt/comments/1rkius1/moving_to_frankfurt/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Avoid too old buildings, generally!",
        sourceLabel: "r/frankfurt",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/frankfurt/comments/1rkius1/moving_to_frankfurt/",
        topic: "housing",
        sentiment: "mixed",
      },
      {
        quote: "Lot's of non-renovated older housing though",
        sourceLabel: "r/frankfurt",
        sourceAgeLabel: "1.7y ago",
        sourceUrl: "https://www.reddit.com/r/frankfurt/comments/1fabz62/moving_to_frankfurt/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "you will find it easier to find contacts and friends in Frankfurt than if you move to one of the smaller towns",
        sourceLabel: "r/frankfurt",
        sourceAgeLabel: "1.7y ago",
        sourceUrl: "https://www.reddit.com/r/frankfurt/comments/1fabz62/moving_to_frankfurt/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "I have been looking for an apartment in Frankfurt for over 3 months",
        sourceLabel: "r/frankfurt",
        sourceAgeLabel: "4.7y ago",
        sourceUrl: "https://www.reddit.com/r/frankfurt/comments/psi967/the_curse_of_the_frankfurt_expat_apartment_hunt/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "it is the language issue.",
        sourceLabel: "r/frankfurt",
        sourceAgeLabel: "4.7y ago",
        sourceUrl: "https://www.reddit.com/r/frankfurt/comments/psi967/the_curse_of_the_frankfurt_expat_apartment_hunt/",
        topic: "language",
        sentiment: "negative",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Frankfurt",
        url: "https://www.reddit.com/r/frankfurt/comments/1rkius1/moving_to_frankfurt/",
        topic: "housing",
      },
      {
        label: "Moving to Frankfurt",
        url: "https://www.reddit.com/r/frankfurt/comments/1fabz62/moving_to_frankfurt/",
        topic: "community",
      },
      {
        label: "The Curse of the Frankfurt Expat Apartment Hunt",
        url: "https://www.reddit.com/r/frankfurt/comments/psi967/the_curse_of_the_frankfurt_expat_apartment_hunt/",
        topic: "language",
      },
    ],
  }),
  utrecht: buildEnhancedReport("utrecht", {
    summary:
      "Utrecht move stories usually sound very appealing on lifestyle and very blunt on logistics. People repeatedly describe it as one of the most desirable cities in the Netherlands, while warning that the housing crisis is acute, landlord expectations are strict, and commuting from outside the city is often part of the real move plan.",
    snapshotSignals: [
      {
        title: "Utrecht is one of the hardest Dutch cities to enter through housing",
        description: "Public stories consistently frame the rental market as one of the sharpest barriers to the move.",
      },
      {
        title: "Foreign income and expat status can slow the search",
        description: "A recurring issue is landlords preferring Dutch income history and local paperwork.",
      },
      {
        title: "The commute compromise is normal",
        description: "A lot of advice points newcomers toward living outside Utrecht and using its strong rail connections.",
      },
    ],
    storySignals: [
      {
        quote: "There is a housing crisis in The Netherlands and Utrecht (and Amsterdam as well) are at the peak of this crisis.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "1.9y ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/1dta6jw/moving_to_utrecht_this_fall_any_advice/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "it can be difficult to find a landlord who is willing to take the risk renting to foreigners without a guaranteed Dutch income.",
        sourceLabel: "r/expats",
        sourceAgeLabel: "1.9y ago",
        sourceUrl: "https://www.reddit.com/r/expats/comments/1dta6jw/moving_to_utrecht_this_fall_any_advice/",
        topic: "bureaucracy",
        sentiment: "negative",
      },
      {
        quote: "most rental companies want anywhere from 1 to 3 previous (monthly) pay stubs",
        sourceLabel: "r/Utrecht",
        sourceAgeLabel: "3.9y ago",
        sourceUrl: "https://www.reddit.com/r/Utrecht/comments/vft5xk/relocation_to_utrecht/",
        topic: "bureaucracy",
        sentiment: "negative",
      },
      {
        quote: "Its really difficult to find housing and Utrecht is one of the most popular regions in the Netherlands.",
        sourceLabel: "r/Utrecht",
        sourceAgeLabel: "3.6y ago",
        sourceUrl: "https://www.reddit.com/r/Utrecht/comments/y66f8r/moving_to_utrecht_need_some_info/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Utrecht is as well the main train hub so maybe consider moving outside and commute in",
        sourceLabel: "r/Utrecht",
        sourceAgeLabel: "3.6y ago",
        sourceUrl: "https://www.reddit.com/r/Utrecht/comments/y66f8r/moving_to_utrecht_need_some_info/",
        topic: "advice",
        sentiment: "mixed",
      },
      {
        quote: "Apart from the housing I know that also the CoL can be generally higher in the Netherlands",
        sourceLabel: "r/Utrecht",
        sourceAgeLabel: "3.0y ago",
        sourceUrl: "https://www.reddit.com/r/Utrecht/comments/13rcjlr/moving_from_berlin_to_utrecht/",
        topic: "money",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Utrecht this fall - any advice?",
        url: "https://www.reddit.com/r/expats/comments/1dta6jw/moving_to_utrecht_this_fall_any_advice/",
        topic: "housing",
      },
      {
        label: "Relocation to Utrecht",
        url: "https://www.reddit.com/r/Utrecht/comments/vft5xk/relocation_to_utrecht/",
        topic: "bureaucracy",
      },
      {
        label: "Moving to Utrecht, need some info!",
        url: "https://www.reddit.com/r/Utrecht/comments/y66f8r/moving_to_utrecht_need_some_info/",
        topic: "advice",
      },
      {
        label: "Moving from Berlin to Utrecht?",
        url: "https://www.reddit.com/r/Utrecht/comments/13rcjlr/moving_from_berlin_to_utrecht/",
        topic: "money",
      },
    ],
  }),
  eindhoven: buildEnhancedReport("eindhoven", {
    summary:
      "Eindhoven move stories usually sound more focused than romantic. The recurring public themes are a strong tech-expat ecosystem, a very real housing shortage, and the sense that the city works well when you come for a concrete reason rather than expecting it to deliver Amsterdam-style atmosphere.",
    snapshotSignals: [
      {
        title: "Tech is the entry logic",
        description: "A lot of public stories tie Eindhoven’s appeal directly to the regional tech ecosystem and expat jobs.",
      },
      {
        title: "Housing is tighter than people expect",
        description: "Even in a more pragmatic city, rent pressure and shortage still dominate the move conversation.",
      },
      {
        title: "The expat layer is real",
        description: "People repeatedly describe Eindhoven as one of the more international places in the Netherlands outside Amsterdam.",
      },
    ],
    storySignals: [
      {
        quote: "Eindhoven is one of the most international cities in The Netherlands",
        sourceLabel: "r/eindhoven",
        sourceAgeLabel: "4mo ago",
        sourceUrl: "https://www.reddit.com/r/eindhoven/comments/1q6ttz0/expat_moving_to_eindhoven/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "yes, Eindhoven has a thriving expat community.",
        sourceLabel: "r/eindhoven",
        sourceAgeLabel: "4mo ago",
        sourceUrl: "https://www.reddit.com/r/eindhoven/comments/1q6ttz0/expat_moving_to_eindhoven/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Prepare for finding accommodation well ahead of time.",
        sourceLabel: "r/eindhoven",
        sourceAgeLabel: "4mo ago",
        sourceUrl: "https://www.reddit.com/r/eindhoven/comments/1q6ttz0/expat_moving_to_eindhoven/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "Houses and rent is getting quite expensive due to many well-paid expats and also a housing shortage.",
        sourceLabel: "r/eindhoven",
        sourceAgeLabel: "4mo ago",
        sourceUrl: "https://www.reddit.com/r/eindhoven/comments/1q6ttz0/expat_moving_to_eindhoven/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "There's a huge ASML expat bubble in the Eindhoven area, and it's only growing.",
        sourceLabel: "r/eindhoven",
        sourceAgeLabel: "4mo ago",
        sourceUrl: "https://www.reddit.com/r/eindhoven/comments/1q6ttz0/expat_moving_to_eindhoven/",
        topic: "community",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Expat moving to Eindhoven",
        url: "https://www.reddit.com/r/eindhoven/comments/1q6ttz0/expat_moving_to_eindhoven/",
        topic: "housing",
      },
    ],
  }),
  phuket: buildEnhancedReport("phuket", {
    summary:
      "Phuket move stories tend to split cleanly between beach-life upside and island-life caveats. Public stories praise expat pockets, family-friendly areas, and strong lifestyle payoff if the budget is there, while also warning about tourist traps, rising costs, and the difference between visiting Phuket and actually living there.",
    snapshotSignals: [
      {
        title: "The island rewards neighborhood choice",
        description: "Public stories repeatedly separate real expat neighborhoods from tourist-trap zones.",
      },
      {
        title: "Budget changes the verdict",
        description: "People are much more positive when the move is well-funded and the housing choice is deliberate.",
      },
      {
        title: "Living there is not the same as visiting",
        description: "Several stories treat the island as a place that stays great only if your pace and expectations actually fit it.",
      },
    ],
    storySignals: [
      {
        quote: "finding housing that isn't a tourist trap",
        sourceLabel: "r/ThailandExpats",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/u_LeftDenverForPhuket/comments/1rulod8/rthailandexpats/",
        topic: "housing",
        sentiment: "mixed",
      },
      {
        quote: "honest numbers, not the \"you can live on $800/month\" fantasy",
        sourceLabel: "r/ThailandExpats",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/u_LeftDenverForPhuket/comments/1rulod8/rthailandexpats/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "Phuket specifically — the real neighborhoods vs the tourist traps",
        sourceLabel: "r/ThailandExpats",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/u_LeftDenverForPhuket/comments/1rulod8/rthailandexpats/",
        topic: "advice",
        sentiment: "mixed",
      },
      {
        quote: "Phuket is the best place to stay in Thailand if you have enough money.",
        sourceLabel: "r/phuket",
        sourceAgeLabel: "4.6y ago",
        sourceUrl: "https://www.reddit.com/r/phuket/comments/qcj8n0/moving_to_phuket/",
        topic: "money",
        sentiment: "mixed",
      },
      {
        quote: "There’s only 2 areas you should consider",
        sourceLabel: "r/phuket",
        sourceAgeLabel: "4.6y ago",
        sourceUrl: "https://www.reddit.com/r/phuket/comments/qcj8n0/moving_to_phuket/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "it’s becoming more and more expensive and it‘s difficult to find cheap accommodation.",
        sourceLabel: "r/phuket",
        sourceAgeLabel: "1.5y ago",
        sourceUrl: "https://www.reddit.com/r/phuket/comments/1gnvowq/moving_to_phuket_after_living_in_chiang_mai_for/",
        topic: "housing",
        sentiment: "negative",
      },
    ],
    sourceLinks: [
      {
        label: "Thai-American - happy to answer any questions about making the move",
        url: "https://www.reddit.com/r/u_LeftDenverForPhuket/comments/1rulod8/rthailandexpats/",
        topic: "housing",
      },
      {
        label: "Moving to Phuket",
        url: "https://www.reddit.com/r/phuket/comments/qcj8n0/moving_to_phuket/",
        topic: "advice",
      },
      {
        label: "Moving to Phuket after living in Chiang Mai for 10 years",
        url: "https://www.reddit.com/r/phuket/comments/1gnvowq/moving_to_phuket_after_living_in_chiang_mai_for/",
        topic: "housing",
      },
    ],
  }),
  calgary: buildEnhancedReport("calgary", {
    summary:
      "Calgary move stories often sound practical and surprisingly hopeful. Public threads keep circling around housing value versus Vancouver or Toronto, social life built through activities rather than passive city magic, and the sense that Calgary works best when you come for space, outdoor rhythm, and a lower-burn reset.",
    snapshotSignals: [
      {
        title: "Value is part of the pitch",
        description: "Many public stories frame Calgary as a relief valve compared with more punishing Canadian housing markets.",
      },
      {
        title: "Friendships tend to come through activities",
        description: "Volunteering, sports, and hobby groups show up much more often than spontaneous big-city social life.",
      },
      {
        title: "The move rewards initiative",
        description: "Public stories often suggest Calgary becomes easy to like once people actively build routine and community.",
      },
    ],
    storySignals: [
      {
        quote: "moving back for work and social opportunities.",
        sourceLabel: "r/Calgary",
        sourceAgeLabel: "1.7y ago",
        sourceUrl: "https://www.reddit.com/r/Calgary/comments/1f1es06/moving_to_calgary_megathread/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "all of my adult friends have been made through shared activities like mountain biking and adult volleyball leagues",
        sourceLabel: "r/Calgary",
        sourceAgeLabel: "2.8y ago",
        sourceUrl: "https://www.reddit.com/r/Calgary/comments/15d938r/how_do_people_make_friends_in_calgary/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "While we are friendly in Calgary, you will find it difficult to easily make friends here.",
        sourceLabel: "r/Calgary",
        sourceAgeLabel: "2.8y ago",
        sourceUrl: "https://www.reddit.com/r/Calgary/comments/15d938r/how_do_people_make_friends_in_calgary/",
        topic: "community",
        sentiment: "mixed",
      },
      {
        quote: "I’ve found Calgary to be the easiest to make friends.",
        sourceLabel: "r/Calgary",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/Calgary/comments/1ropz5c/new_friends/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Volunteer for some of the art & music festivals all over the city this summer.",
        sourceLabel: "r/CalgarySocialClub",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/CalgarySocialClub/comments/1rka6wk/looking_to_make_friends/",
        topic: "advice",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Calgary - Megathread",
        url: "https://www.reddit.com/r/Calgary/comments/1f1es06/moving_to_calgary_megathread/",
        topic: "community",
      },
      {
        label: "How do people make friends in Calgary?",
        url: "https://www.reddit.com/r/Calgary/comments/15d938r/how_do_people_make_friends_in_calgary/",
        topic: "community",
      },
      {
        label: "New Friends",
        url: "https://www.reddit.com/r/Calgary/comments/1ropz5c/new_friends/",
        topic: "community",
      },
      {
        label: "Looking to make friends",
        url: "https://www.reddit.com/r/CalgarySocialClub/comments/1rka6wk/looking_to_make_friends/",
        topic: "advice",
      },
    ],
  }),
  austin: buildEnhancedReport("austin", {
    summary:
      "Austin move stories tend to split between excitement and calibration. Public threads still describe the city as friendly, active, and full of things to do, but they also keep warning that people often move for the festival version of Austin, then run into rent pressure and the reality that adult friendships take work.",
    snapshotSignals: [
      {
        title: "People often move for the vibe, then meet the housing math",
        description: "A repeated public theme is that Austin feels great until rent, location, and quality expectations get specific.",
      },
      {
        title: "Community exists, but it is not automatic",
        description: "Many stories say Austin can feel social once you actively join recurring groups rather than wait for the city to do the work.",
      },
      {
        title: "Expectation-setting matters a lot",
        description: "The strongest regret stories are often about coming for a fantasy version of Austin rather than the real one.",
      },
    ],
    storySignals: [
      {
        quote: "People regret moving to Austin because they made the decision based upon their visit during ACL, SxSW, etc",
        sourceLabel: "r/Austin",
        sourceAgeLabel: "3.4y ago",
        sourceUrl: "https://www.reddit.com/r/Austin/comments/zwmgyc/why_are_so_many_people_saying_they_regret_moving/",
        topic: "regret",
        sentiment: "mixed",
      },
      {
        quote: "my friends who rented, even in Round Rock / Hutto / Cedar Park areas had a 25-30% increase and eventually got priced out.",
        sourceLabel: "r/Austin",
        sourceAgeLabel: "3.4y ago",
        sourceUrl: "https://www.reddit.com/r/Austin/comments/zwmgyc/why_are_so_many_people_saying_they_regret_moving/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "Making friends after your 20s is definitely a bit harder, for sure.",
        sourceLabel: "r/Austin",
        sourceAgeLabel: "3.6y ago",
        sourceUrl: "https://www.reddit.com/r/Austin/comments/xqud9s/just_moved_to_austin_after_a_breakup_31m_and_man/",
        topic: "community",
        sentiment: "mixed",
      },
      {
        quote: "Most of the friends I've made in Austin I've made Lone Star Curling Club!",
        sourceLabel: "r/Austin",
        sourceAgeLabel: "3.6y ago",
        sourceUrl: "https://www.reddit.com/r/Austin/comments/xqud9s/just_moved_to_austin_after_a_breakup_31m_and_man/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "it’s fun here, friendly and not everyone has to talk about work and their social value every 2 seconds like in NYC.",
        sourceLabel: "r/askaustin",
        sourceAgeLabel: "yesterday",
        sourceUrl: "https://www.reddit.com/r/askaustin/comments/1tha90i/moving_to_austin_lots_of_questions/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "I moved to Austin about 1–2 months ago and I haven’t really explored or made friends yet.",
        sourceLabel: "r/askaustin",
        sourceAgeLabel: "2wk ago",
        sourceUrl: "https://www.reddit.com/r/askaustin/comments/1t1uz8w/just_moved_here_craving_community_25f_austin/",
        topic: "first_90_days",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Why Are So Many People Saying They Regret Moving to Austin?",
        url: "https://www.reddit.com/r/Austin/comments/zwmgyc/why_are_so_many_people_saying_they_regret_moving/",
        topic: "regret",
      },
      {
        label: "Just moved to Austin after a breakup",
        url: "https://www.reddit.com/r/Austin/comments/xqud9s/just_moved_to_austin_after_a_breakup_31m_and_man/",
        topic: "community",
      },
      {
        label: "Moving to Austin - lots of questions",
        url: "https://www.reddit.com/r/askaustin/comments/1tha90i/moving_to_austin_lots_of_questions/",
        topic: "community",
      },
      {
        label: "Just moved here & craving community",
        url: "https://www.reddit.com/r/askaustin/comments/1t1uz8w/just_moved_here_craving_community_25f_austin/",
        topic: "first_90_days",
      },
    ],
  }),
  alicante: buildEnhancedReport("alicante", {
    summary:
      "Alicante move stories often read like a lower-burn Spain option that people choose on purpose. Public threads keep praising the sea, safety, cost profile, and international access, while still warning that local wages, language, and long-term fit depend on what kind of move this actually is.",
    snapshotSignals: [
      {
        title: "Alicante is chosen for quality of life, not career scale",
        description: "Public stories often treat the city as a lifestyle-first move with a calmer daily rhythm.",
      },
      {
        title: "International enough to start, Spanish enough to matter",
        description: "A repeated theme is that the city feels accessible while still rewarding real Spanish over time.",
      },
      {
        title: "It works best when expectations stay small and honest",
        description: "People sound happiest when they want sea, safety, and manageable daily life rather than big-city momentum.",
      },
    ],
    storySignals: [
      {
        quote: "we wanted access to the sea, safety, good COL, good food, and an international community, that was still primarily Spanish",
        sourceLabel: "r/Alicante",
        sourceAgeLabel: "2.4y ago",
        sourceUrl: "https://www.reddit.com/r/Alicante/comments/18uttgh/moving_to_alicante/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Yeah I expect to move into lower wages for my field",
        sourceLabel: "r/Alicante",
        sourceAgeLabel: "2.4y ago",
        sourceUrl: "https://www.reddit.com/r/Alicante/comments/18uttgh/moving_to_alicante/",
        topic: "money",
        sentiment: "mixed",
      },
      {
        quote: "Go to the FaceBook expat groups for Spain for a lot more community info",
        sourceLabel: "r/Alicante",
        sourceAgeLabel: "2.4y ago",
        sourceUrl: "https://www.reddit.com/r/Alicante/comments/18uttgh/moving_to_alicante/",
        topic: "advice",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Alicante",
        url: "https://www.reddit.com/r/Alicante/comments/18uttgh/moving_to_alicante/",
        topic: "community",
      },
    ],
  }),
  madeira: buildEnhancedReport("madeira", {
    summary:
      "Madeira move stories often push back against the postcard fantasy. Public threads keep praising the island’s beauty and forgiving daily rhythm, while repeatedly warning about housing shifts, humidity and mold, transport variation, and the fact that Portuguese and local integration matter more than many online guides suggest.",
    snapshotSignals: [
      {
        title: "The postcard version hides practical friction",
        description: "Weather, steep terrain, and house condition show up in public stories much more than in generic Madeira content.",
      },
      {
        title: "Housing changed with remote demand",
        description: "Several stories describe the market as more pressured and less forgiving than people expect from an island move.",
      },
      {
        title: "Language and integration still matter",
        description: "Madeira can be more forgiving than mainland Portugal at first, but public stories still push toward Portuguese if the move is serious.",
      },
    ],
    storySignals: [
      {
        quote: "there are practical realities, especially around housing, that can make or break the experience if you’re unprepared.",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1pqhh7o/considering_moving_to_madeira_here_are_some/",
        topic: "housing",
        sentiment: "mixed",
      },
      {
        quote: "older homes often have damp problems.",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1pqhh7o/considering_moving_to_madeira_here_are_some/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "remote workers have increased prices.",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1pqhh7o/considering_moving_to_madeira_here_are_some/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "Portuguese language specifically the accent makes it harder to understand and learn.",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1pqhh7o/considering_moving_to_madeira_here_are_some/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "Madeira is more forgiving on not knowing Portuguese.",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1pqhh7o/considering_moving_to_madeira_here_are_some/",
        topic: "language",
        sentiment: "positive",
      },
      {
        quote: "although it's the same country I found it to be quite different.",
        sourceLabel: "r/Madeira",
        sourceAgeLabel: "4.3y ago",
        sourceUrl: "https://www.reddit.com/r/Madeira/comments/sabrks/expats_in_madeira_how_do_you_like_it_living_on/",
        topic: "community",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Considering moving to Madeira? Here are some pitfalls...",
        url: "https://www.reddit.com/r/PortugalExpats/comments/1pqhh7o/considering_moving_to_madeira_here_are_some/",
        topic: "housing",
      },
      {
        label: "Expats in Madeira: how do you like it living on Madeira?",
        url: "https://www.reddit.com/r/Madeira/comments/sabrks/expats_in_madeira_how_do_you_like_it_living_on/",
        topic: "community",
      },
    ],
  }),
  algarve: buildEnhancedReport("algarve", {
    summary:
      "Algarve move stories often sound positive about climate and ease, but sharper on price than old Portugal clichés suggest. Public threads keep mentioning English-speaking convenience, expat density, and the fact that Algarve rents and daily prices can still surprise people who arrive expecting an easy bargain.",
    snapshotSignals: [
      {
        title: "English makes Algarve feel easy at first",
        description: "Public stories often describe the region as one of the softer landings in Portugal for English-speaking movers.",
      },
      {
        title: "The price is still Algarve price",
        description: "Repeated signals warn that rental and day-to-day costs are higher than many newcomers assume.",
      },
      {
        title: "Expat density changes the feel",
        description: "Several threads imply that where you land in the Algarve matters because some areas feel much more international than Portuguese.",
      },
    ],
    storySignals: [
      {
        quote: "Price wise, its still the Algarve so we had to do our shopping in Tavira",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1rjzul7/people_are_still_moving_to_portugal_you_just_dont/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "it was Algarve prices and Algarve rental prices.",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1rjzul7/people_are_still_moving_to_portugal_you_just_dont/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "The Algarve is outside Lisbon and Porto and English is very widely spoken.",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1rucehw/important_for_expats_moving_to_portugal/",
        topic: "language",
        sentiment: "positive",
      },
      {
        quote: "we have found even trying to Portuguese goes a long way.",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1rucehw/important_for_expats_moving_to_portugal/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "One of the reasons we don’t want foreigners here is not because we have some kind of prejudice",
        sourceLabel: "r/PortugalExpats",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/PortugalExpats/comments/1rucehw/important_for_expats_moving_to_portugal/",
        topic: "community",
        sentiment: "mixed",
      },
      {
        quote: "My girlfriend and I have been thinking of moving to the Algarve.",
        sourceLabel: "r/Algarve",
        sourceAgeLabel: "3.7y ago",
        sourceUrl: "https://www.reddit.com/r/Algarve/comments/wxcegd/moving_to_algarve/",
        topic: "first_90_days",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "People are still moving to Portugal. You just don't need to live in Lisboa.",
        url: "https://www.reddit.com/r/PortugalExpats/comments/1rjzul7/people_are_still_moving_to_portugal_you_just_dont/",
        topic: "money",
      },
      {
        label: "Important for expats moving to Portugal",
        url: "https://www.reddit.com/r/PortugalExpats/comments/1rucehw/important_for_expats_moving_to_portugal/",
        topic: "language",
      },
      {
        label: "Moving to Algarve?",
        url: "https://www.reddit.com/r/Algarve/comments/wxcegd/moving_to_algarve/",
        topic: "first_90_days",
      },
    ],
  }),
  guadalajara: buildEnhancedReport("guadalajara", {
    summary:
      "Guadalajara move stories are still thinner than for Mexico City, but the real public signals we do have already point in a familiar direction: people treat it as a practical alternative with strong local-life upside, while still expecting Spanish and neighborhood knowledge to matter more than any generic 'expat city' framing.",
    snapshotSignals: [
      {
        title: "Guadalajara gets framed as the practical alternative",
        description: "Public stories often position it as a solid choice when Mexico City feels too intense or too expensive.",
      },
      {
        title: "Spanish is part of the move logic",
        description: "The stories we have still treat language as a serious part of the adjustment, not an optional add-on.",
      },
      {
        title: "The city needs on-the-ground context",
        description: "Advice tends to be less generic and more about what life actually feels like once you arrive for work or longer stay.",
      },
    ],
    storySignals: [
      {
        quote: "My online research led me to Guadalajara as a solid alternative.",
        sourceLabel: "r/mexicoexpats",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/mexicoexpats/comments/1s9vsl5/guadalajara_possible_move/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "Want to chat about life in Mexico or game with other expats and locals?",
        sourceLabel: "r/mexicoexpats",
        sourceAgeLabel: "last month",
        sourceUrl: "https://www.reddit.com/r/mexicoexpats/comments/1s9vsl5/guadalajara_possible_move/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Sorry for English (still learning Spanish).",
        sourceLabel: "r/Guadalajara",
        sourceAgeLabel: "3.7y ago",
        sourceUrl: "https://www.reddit.com/r/Guadalajara/comments/x80bfy/moving_to_mexico_guadalajara_for_work_would_like/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "I am a South Asian who have to move to Guadalajara for work in next couple of months.",
        sourceLabel: "r/Guadalajara",
        sourceAgeLabel: "3.7y ago",
        sourceUrl: "https://www.reddit.com/r/Guadalajara/comments/x80bfy/moving_to_mexico_guadalajara_for_work_would_like/",
        topic: "first_90_days",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Guadalajara possible move",
        url: "https://www.reddit.com/r/mexicoexpats/comments/1s9vsl5/guadalajara_possible_move/",
        topic: "community",
      },
      {
        label: "Moving to Mexico (Guadalajara) for work",
        url: "https://www.reddit.com/r/Guadalajara/comments/x80bfy/moving_to_mexico_guadalajara_for_work_would_like/",
        topic: "language",
      },
    ],
  }),
  edinburgh: buildEnhancedReport("edinburgh", {
    summary:
      "Edinburgh move stories usually sound affectionate and exasperated at the same time. People love the city’s beauty, culture, and long-term livability, while also warning that rent is rough, the housing market is chaotic, and the city can feel socially transient unless you actively build your own circles.",
    snapshotSignals: [
      {
        title: "Edinburgh is easy to love, hard to enter cheaply",
        description: "Public stories repeatedly talk about strong quality of life alongside a painful rental market.",
      },
      {
        title: "Living a little further out is normal",
        description: "A recurring theme is that many movers solve the city by stepping back from the center without losing much socially.",
      },
      {
        title: "The city can feel socially transient",
        description: "Several stories suggest that people move in and out enough that friendships still take active effort.",
      },
    ],
    storySignals: [
      {
        quote: "renting is incredibly expensive, especially in the city centre.",
        sourceLabel: "r/Edinburgh",
        sourceAgeLabel: "7mo ago",
        sourceUrl: "https://www.reddit.com/r/Edinburgh/comments/1no28a0/should_i_move_to_edinburgh/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "I moved out of the city centre years ago for cheaper rent, and didn't notice a massive drop in my social life",
        sourceLabel: "r/Edinburgh",
        sourceAgeLabel: "7mo ago",
        sourceUrl: "https://www.reddit.com/r/Edinburgh/comments/1no28a0/should_i_move_to_edinburgh/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "the housing market here is a shambles - finding a rental is a feat in itself",
        sourceLabel: "r/Edinburgh",
        sourceAgeLabel: "7mo ago",
        sourceUrl: "https://www.reddit.com/r/Edinburgh/comments/1no28a0/should_i_move_to_edinburgh/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "After a while I became hesitant to connect with new people as in my experience Edinburgh is very windy people in terms of people moving in and out.",
        sourceLabel: "r/Edinburgh",
        sourceAgeLabel: "7mo ago",
        sourceUrl: "https://www.reddit.com/r/Edinburgh/comments/1no28a0/should_i_move_to_edinburgh/",
        topic: "community",
        sentiment: "mixed",
      },
      {
        quote: "I've got a number of pals from Inverness who moved to Edinburgh and live here very happily",
        sourceLabel: "r/Edinburgh",
        sourceAgeLabel: "7mo ago",
        sourceUrl: "https://www.reddit.com/r/Edinburgh/comments/1no28a0/should_i_move_to_edinburgh/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Since moving to Edinburgh life is easier .",
        sourceLabel: "r/Edinburgh",
        sourceAgeLabel: "7mo ago",
        sourceUrl: "https://www.reddit.com/r/Edinburgh/comments/1no28a0/should_i_move_to_edinburgh/",
        topic: "regret",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Should I move to Edinburgh?",
        url: "https://www.reddit.com/r/Edinburgh/comments/1no28a0/should_i_move_to_edinburgh/",
        topic: "housing",
      },
    ],
  }),
  manchester: buildEnhancedReport("manchester", {
    summary:
      "Manchester move stories usually frame the city as a serious alternative rather than a compromise. People like the energy, friendliness, and big-city life outside London, but they still warn that rent is climbing, neighborhood fit matters a lot, and the weather really does shape the experience.",
    snapshotSignals: [
      {
        title: "Manchester feels like a real London alternative",
        description: "Public stories often treat the city as a place where people can keep urban energy without taking on full London burn.",
      },
      {
        title: "Housing is not cheap enough to ignore",
        description: "The city still reads as better value than London, but repeated stories warn that the obvious bargains are disappearing fast.",
      },
      {
        title: "Neighborhood and transport decide the move",
        description: "A recurring theme is that tram and bus access, not generic city-center hype, determine whether day-to-day life works.",
      },
    ],
    storySignals: [
      {
        quote: "I can get a really nice place in Manchester by myself",
        sourceLabel: "r/AskUK",
        sourceAgeLabel: "4.3y ago",
        sourceUrl: "https://www.reddit.com/r/AskUK/comments/sv025m/anyone_moved_to_manchester_by_themselves_how_was_it/",
        topic: "housing",
        sentiment: "positive",
      },
      {
        quote: "people are friendlier, there is more community feel",
        sourceLabel: "r/AskUK",
        sourceAgeLabel: "4.4y ago",
        sourceUrl: "https://www.reddit.com/r/AskUK/comments/rp7dc5/what_are_the_pros_of_moving_to_manchester_from/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "weather's worse and it's rougher.",
        sourceLabel: "r/AskUK",
        sourceAgeLabel: "4.4y ago",
        sourceUrl: "https://www.reddit.com/r/AskUK/comments/rp7dc5/what_are_the_pros_of_moving_to_manchester_from/",
        topic: "regret",
        sentiment: "negative",
      },
      {
        quote: "I felt like this once, and then realised nowhere came close to Manchester when it comes to living costs/quality of life ratio in the UK.",
        sourceLabel: "r/AskUK",
        sourceAgeLabel: "last year",
        sourceUrl: "https://www.reddit.com/r/AskUK/comments/1keh94d/which_uk_city_would_you_move_to/",
        topic: "money",
        sentiment: "positive",
      },
      {
        quote: "£50k gives you a fair bit of choice for where to live",
        sourceLabel: "r/manchester",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/manchester/comments/1rg1o20/the_out_about_visiting_moving_to_manchester/",
        topic: "housing",
        sentiment: "mixed",
      },
      {
        quote: "anywhere with good tram or bus connections to your job is probably a good place to start looking",
        sourceLabel: "r/manchester",
        sourceAgeLabel: "2mo ago",
        sourceUrl: "https://www.reddit.com/r/manchester/comments/1rg1o20/the_out_about_visiting_moving_to_manchester/",
        topic: "advice",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Anyone moved to Manchester by themselves / how was it?",
        url: "https://www.reddit.com/r/AskUK/comments/sv025m/anyone_moved_to_manchester_by_themselves_how_was_it/",
        topic: "housing",
      },
      {
        label: "What are the pros of moving to Manchester from London?",
        url: "https://www.reddit.com/r/AskUK/comments/rp7dc5/what_are_the_pros_of_moving_to_manchester_from/",
        topic: "community",
      },
      {
        label: "Which UK city would you move to?",
        url: "https://www.reddit.com/r/AskUK/comments/1keh94d/which_uk_city_would_you_move_to/",
        topic: "money",
      },
      {
        label: "The Out & About, Visiting & Moving to Manchester Weekly Thread",
        url: "https://www.reddit.com/r/manchester/comments/1rg1o20/the_out_about_visiting_moving_to_manchester/",
        topic: "advice",
      },
    ],
  }),
  birmingham: buildEnhancedReport("birmingham", {
    summary:
      "Birmingham move stories are more positive than its reputation suggests. People repeatedly describe it as better value than London or Bristol, socially warmer than outsiders expect, and highly neighborhood-dependent, while also warning that some areas feel rough, traffic is annoying, and the city-center dream is not always the best version of Birmingham.",
    snapshotSignals: [
      {
        title: "Birmingham is more loved by residents than by its reputation",
        description: "Public stories often sound defensive in the same direction: people who actually moved there tend to like it more than people who mock it from distance.",
      },
      {
        title: "The right area changes everything",
        description: "Move stories keep repeating that Brum is not one thing, and the quality of life shifts a lot by neighborhood.",
      },
      {
        title: "Value is the main pull",
        description: "The strongest recurring positive theme is that people can build a more normal urban life here than in pricier UK cities.",
      },
    ],
    storySignals: [
      {
        quote: "The majority of people criticising brum have never been there.",
        sourceLabel: "r/BirminghamUK",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/BirminghamUK/comments/1p5cl14/moving_to_birmingham/",
        topic: "regret",
        sentiment: "positive",
      },
      {
        quote: "Birmingham has real heart and the people are funny, kind and welcoming.",
        sourceLabel: "r/BirminghamUK",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/BirminghamUK/comments/1p5cl14/moving_to_birmingham/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Be careful where you move, the city is full of pockets of entirely different experiences and people.",
        sourceLabel: "r/BirminghamUK",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/BirminghamUK/comments/1p5cl14/moving_to_birmingham/",
        topic: "housing",
        sentiment: "mixed",
      },
      {
        quote: "I can actually live alone comfortably.",
        sourceLabel: "r/BirminghamUK",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/BirminghamUK/comments/1p5cl14/moving_to_birmingham/",
        topic: "money",
        sentiment: "positive",
      },
      {
        quote: "There is less to do here but still enough",
        sourceLabel: "r/BirminghamUK",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/BirminghamUK/comments/1p5cl14/moving_to_birmingham/",
        topic: "regret",
        sentiment: "mixed",
      },
      {
        quote: "We’re a very bus-reliant city.",
        sourceLabel: "r/brum",
        sourceAgeLabel: "1.7y ago",
        sourceUrl: "https://www.reddit.com/r/brum/comments/1ewb4g8/moving_to_birmingham/",
        topic: "first_90_days",
        sentiment: "mixed",
      },
      {
        quote: "Birmingham is a cultural melting pot, you'll fit in no matter what.",
        sourceLabel: "r/brum",
        sourceAgeLabel: "1.7y ago",
        sourceUrl: "https://www.reddit.com/r/brum/comments/1ewb4g8/moving_to_birmingham/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Aim for the South, believe me.",
        sourceLabel: "r/BirminghamUK",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/BirminghamUK/comments/1po9l9x/moving_to_birmingham_honest_views/",
        topic: "advice",
        sentiment: "mixed",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Birmingham",
        url: "https://www.reddit.com/r/BirminghamUK/comments/1p5cl14/moving_to_birmingham/",
        topic: "housing",
      },
      {
        label: "Moving to Birmingham",
        url: "https://www.reddit.com/r/brum/comments/1ewb4g8/moving_to_birmingham/",
        topic: "community",
      },
      {
        label: "Moving to Birmingham - Honest Views?",
        url: "https://www.reddit.com/r/BirminghamUK/comments/1po9l9x/moving_to_birmingham_honest_views/",
        topic: "advice",
      },
    ],
  }),
  "playa-del-carmen": buildEnhancedReport("playa-del-carmen", {
    summary:
      "Playa del Carmen move stories sound seductive and cautionary at the same time. People love the weather, friendships, and easy lifestyle services, but they repeatedly warn that the place is transient, the tourist premium is real, and long-term fit often depends on whether you build a routine beyond the party-and-beach version of town.",
    snapshotSignals: [
      {
        title: "Playa is easy to enjoy and harder to anchor",
        description: "Public stories often describe a strong first lifestyle hit followed by a real test of whether the town is enough for everyday life.",
      },
      {
        title: "The expat bubble is both the draw and the trap",
        description: "People find community quickly, but many stories say the move works better when it is not limited to the foreign bubble.",
      },
      {
        title: "Spanish and long-stay realism change the outcome",
        description: "The repeated advice is to learn the language, understand residency friction, and test whether the town still works after the honeymoon phase.",
      },
    ],
    storySignals: [
      {
        quote: "I absolutely loved it!",
        sourceLabel: "r/playadelcarmen",
        sourceAgeLabel: "2.8y ago",
        sourceUrl: "https://www.reddit.com/r/playadelcarmen/comments/157z126/plan_on_moving_to_playa/",
        topic: "regret",
        sentiment: "positive",
      },
      {
        quote: "Made the best friends.",
        sourceLabel: "r/playadelcarmen",
        sourceAgeLabel: "2.8y ago",
        sourceUrl: "https://www.reddit.com/r/playadelcarmen/comments/157z126/plan_on_moving_to_playa/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "Things are way different now, in terms of price.",
        sourceLabel: "r/playadelcarmen",
        sourceAgeLabel: "2.8y ago",
        sourceUrl: "https://www.reddit.com/r/playadelcarmen/comments/157z126/plan_on_moving_to_playa/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "let go of the way you lived in the states and you will have a much better experience",
        sourceLabel: "r/playadelcarmen",
        sourceAgeLabel: "2.8y ago",
        sourceUrl: "https://www.reddit.com/r/playadelcarmen/comments/157z126/plan_on_moving_to_playa/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "The expat tax is real",
        sourceLabel: "r/playadelcarmen",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/playadelcarmen/comments/1ottlsf/is_playa_del_carmen_transient/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "the partying either gets old or it takes over your life",
        sourceLabel: "r/playadelcarmen",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/playadelcarmen/comments/1ottlsf/is_playa_del_carmen_transient/",
        topic: "regret",
        sentiment: "mixed",
      },
      {
        quote: "you've experienced the bureaucracy, expat tax, the impact of learning spanish versus not",
        sourceLabel: "r/playadelcarmen",
        sourceAgeLabel: "6mo ago",
        sourceUrl: "https://www.reddit.com/r/playadelcarmen/comments/1ottlsf/is_playa_del_carmen_transient/",
        topic: "bureaucracy",
        sentiment: "mixed",
      },
      {
        quote: "Playa is good to call it your base and then if possible travel.",
        sourceLabel: "r/playadelcarmen",
        sourceAgeLabel: "4wk ago",
        sourceUrl: "https://www.reddit.com/r/playadelcarmen/comments/1ss30py/is_playa_del_carmen_a_good_place_to_live_in_yours/",
        topic: "advice",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Plan on moving to Playa",
        url: "https://www.reddit.com/r/playadelcarmen/comments/157z126/plan_on_moving_to_playa/",
        topic: "community",
      },
      {
        label: "Is Playa Del Carmen transient?",
        url: "https://www.reddit.com/r/playadelcarmen/comments/1ottlsf/is_playa_del_carmen_transient/",
        topic: "money",
      },
      {
        label: "Is Playa Del Carmen a good place to live in yours 30s?",
        url: "https://www.reddit.com/r/playadelcarmen/comments/1ss30py/is_playa_del_carmen_a_good_place_to_live_in_yours/",
        topic: "advice",
      },
    ],
  }),
  krakow: buildEnhancedReport("krakow", {
    summary:
      "Krakow move stories are generally warm, but practical. People like the city’s livability, transit, and atmosphere, while repeatedly warning that good rentals move fast, prices are no longer the bargain outsiders expect, and newcomers should optimize around neighborhoods rather than postcard expectations.",
    snapshotSignals: [
      {
        title: "Krakow is easier to love than to rent into well",
        description: "The public stories are not anti-Krakow, but they do keep warning that the flat hunt is competitive and time-sensitive.",
      },
      {
        title: "Transit and district choice matter more than old-town fantasy",
        description: "A repeated theme is to organize the move around tram access and livable neighborhoods, not just beauty or tourist convenience.",
      },
      {
        title: "The city feels more expensive than old guides suggest",
        description: "Several public stories say the affordability story has weakened and requires more realistic budgeting.",
      },
    ],
    storySignals: [
      {
        quote: "Good flats fly off the market really fast for the past few years",
        sourceLabel: "r/krakow",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/krakow/comments/1pqt9h5/moving_to_krak%C3%B3w_neighborhood_renting_advice/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "it's better to pick something \"good enough\", get used to the city and then move a year later.",
        sourceLabel: "r/krakow",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/krakow/comments/1pqt9h5/moving_to_krak%C3%B3w_neighborhood_renting_advice/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "Look how tram lines go to your workplace and look for flats along them.",
        sourceLabel: "r/krakow",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/krakow/comments/1pqt9h5/moving_to_krak%C3%B3w_neighborhood_renting_advice/",
        topic: "first_90_days",
        sentiment: "positive",
      },
      {
        quote: "never fall for some \"reservation fee\" before you see apartment",
        sourceLabel: "r/krakow",
        sourceAgeLabel: "5mo ago",
        sourceUrl: "https://www.reddit.com/r/krakow/comments/1pqt9h5/moving_to_krak%C3%B3w_neighborhood_renting_advice/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "The city is getting into the expensive territory real estate wise",
        sourceLabel: "r/krakow",
        sourceAgeLabel: "4.1y ago",
        sourceUrl: "https://www.reddit.com/r/krakow/comments/u135d0/moving_to_krak%C3%B3w/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "We moved back to Kraków from Los Angeles in May and never want to leave.",
        sourceLabel: "r/krakow",
        sourceAgeLabel: "1.6y ago",
        sourceUrl: "https://www.reddit.com/r/krakow/comments/1fpg8n2/moving_to_krakow_from_nyc_has_anyone_made_the_move/",
        topic: "regret",
        sentiment: "positive",
      },
      {
        quote: "It’s hard to find a flat just for a few months",
        sourceLabel: "r/krakow",
        sourceAgeLabel: "1.4y ago",
        sourceUrl: "https://www.reddit.com/r/krakow/comments/1hwo02n/moving_to_krakow/",
        topic: "housing",
        sentiment: "negative",
      },
    ],
    sourceLinks: [
      {
        label: "Moving to Krakow - neighborhood & renting advice",
        url: "https://www.reddit.com/r/krakow/comments/1pqt9h5/moving_to_krak%C3%B3w_neighborhood_renting_advice/",
        topic: "housing",
      },
      {
        label: "moving to Krakow",
        url: "https://www.reddit.com/r/krakow/comments/u135d0/moving_to_krak%C3%B3w/",
        topic: "money",
      },
      {
        label: "Moving to Krakow from NYC - has anyone made the move?",
        url: "https://www.reddit.com/r/krakow/comments/1fpg8n2/moving_to_krakow_from_nyc_has_anyone_made_the_move/",
        topic: "regret",
      },
      {
        label: "Moving to Krakow",
        url: "https://www.reddit.com/r/krakow/comments/1hwo02n/moving_to_krakow/",
        topic: "housing",
      },
    ],
  }),
  wroclaw: buildEnhancedReport("wroclaw", {
    summary:
      "Wroclaw move stories usually read like a practical success case with a few sharp caveats. People describe it as welcoming, easy enough in English, and strong for day-to-day quality of life, while still saying that Polish changes the depth of the move, winter hits hard, and the first setup phase can feel paperwork-heavy if you arrive without support.",
    snapshotSignals: [
      {
        title: "Wroclaw often feels easier than outsiders expect",
        description: "Public stories regularly frame it as a city where newcomers can function quickly, especially with English and a job anchor.",
      },
      {
        title: "Polish is optional at first and important later",
        description: "A repeated pattern is that you can survive in English, but language still decides how deep the move goes.",
      },
      {
        title: "Quality of life wins over time, winter tests it",
        description: "Stories often praise the city’s parks, biking, and livability while warning that winter mood and air can be rough.",
      },
    ],
    storySignals: [
      {
        quote: "Wrocław is awsome.But language is tough.",
        sourceLabel: "r/wroclaw",
        sourceAgeLabel: "9mo ago",
        sourceUrl: "https://www.reddit.com/r/wroclaw/comments/1muy1pg/mexican_moving_to_poland/",
        topic: "language",
        sentiment: "mixed",
      },
      {
        quote: "You don't need Polish.",
        sourceLabel: "r/wroclaw",
        sourceAgeLabel: "9mo ago",
        sourceUrl: "https://www.reddit.com/r/wroclaw/comments/1muy1pg/mexican_moving_to_poland/",
        topic: "language",
        sentiment: "positive",
      },
      {
        quote: "this ofc limited the amount of interactions I could have and some of the experiences.",
        sourceLabel: "r/wroclaw",
        sourceAgeLabel: "9mo ago",
        sourceUrl: "https://www.reddit.com/r/wroclaw/comments/1muy1pg/mexican_moving_to_poland/",
        topic: "community",
        sentiment: "mixed",
      },
      {
        quote: "Meeting Polish people is hard.",
        sourceLabel: "r/wroclaw",
        sourceAgeLabel: "9mo ago",
        sourceUrl: "https://www.reddit.com/r/wroclaw/comments/1muy1pg/mexican_moving_to_poland/",
        topic: "community",
        sentiment: "negative",
      },
      {
        quote: "Familiarise yourself with Polish bureaucracy. It looks intense but, in reality, is super simple.",
        sourceLabel: "r/wroclaw",
        sourceAgeLabel: "9mo ago",
        sourceUrl: "https://www.reddit.com/r/wroclaw/comments/1muy1pg/mexican_moving_to_poland/",
        topic: "bureaucracy",
        sentiment: "mixed",
      },
      {
        quote: "Wrocław is great for biking.",
        sourceLabel: "r/wroclaw",
        sourceAgeLabel: "9mo ago",
        sourceUrl: "https://www.reddit.com/r/wroclaw/comments/1muy1pg/mexican_moving_to_poland/",
        topic: "advice",
        sentiment: "positive",
      },
      {
        quote: "The company is asking me... find an apartment... They're giving me seven days",
        sourceLabel: "r/wroclaw",
        sourceAgeLabel: "9mo ago",
        sourceUrl: "https://www.reddit.com/r/wroclaw/comments/1mgrpu8/moving_to_wroclaw/",
        topic: "first_90_days",
        sentiment: "negative",
      },
      {
        quote: "Spring, Summer, and Autumn are incredible",
        sourceLabel: "r/wroclaw",
        sourceAgeLabel: "9mo ago",
        sourceUrl: "https://www.reddit.com/r/wroclaw/comments/1muy1pg/mexican_moving_to_poland/",
        topic: "regret",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Mexican moving to Poland",
        url: "https://www.reddit.com/r/wroclaw/comments/1muy1pg/mexican_moving_to_poland/",
        topic: "language",
      },
      {
        label: "Moving to Wroclaw",
        url: "https://www.reddit.com/r/wroclaw/comments/1mgrpu8/moving_to_wroclaw/",
        topic: "first_90_days",
      },
    ],
  }),
  brno: buildEnhancedReport("brno", {
    summary:
      "Brno move stories usually sound grounded rather than dreamy. People describe it as safe, workable, and sometimes genuinely lovable, while also warning that salaries can be weak, housing has become more painful than outsiders expect, and the move makes the most sense when you actively want a smaller Czech city rather than a cheaper Prague substitute.",
    snapshotSignals: [
      {
        title: "Brno works best when small-city tradeoffs are intentional",
        description: "Public stories tend to like Brno more when the mover actually wants a calmer base, not just a low-cost workaround.",
      },
      {
        title: "Salary-to-housing reality is the real test",
        description: "Repeated public signals say the move can work, but weak offers get exposed quickly once rent and bills are real.",
      },
      {
        title: "The city is friendly enough, but not frictionless",
        description: "Stories regularly describe Brno as safe and livable while still warning about bureaucracy, Czech-language limits, and a smaller international scene.",
      },
    ],
    storySignals: [
      {
        quote: "Brno is a very safe city",
        sourceLabel: "r/czech",
        sourceAgeLabel: "10mo ago",
        sourceUrl: "https://www.reddit.com/r/czech/comments/1m1d3x8/move_to_brno/",
        topic: "community",
        sentiment: "positive",
      },
      {
        quote: "it is quite English friendly (esp with young people).",
        sourceLabel: "r/czech",
        sourceAgeLabel: "10mo ago",
        sourceUrl: "https://www.reddit.com/r/czech/comments/1m1d3x8/move_to_brno/",
        topic: "language",
        sentiment: "positive",
      },
      {
        quote: "Bureaucracy and finding rental accommodation are nightmare here.",
        sourceLabel: "r/czech",
        sourceAgeLabel: "10mo ago",
        sourceUrl: "https://www.reddit.com/r/czech/comments/1m1d3x8/move_to_brno/",
        topic: "bureaucracy",
        sentiment: "negative",
      },
      {
        quote: "the housing situation is in such a state that anywhere where public transport goes, the price is off just by a small fraction",
        sourceLabel: "r/Brno",
        sourceAgeLabel: "3wk ago",
        sourceUrl: "https://www.reddit.com/r/Brno/comments/1sxewdv/moving_to_brno/",
        topic: "housing",
        sentiment: "negative",
      },
      {
        quote: "there's not a ton of native speakers in brno - at least compared to Prague.",
        sourceLabel: "r/Brno",
        sourceAgeLabel: "3wk ago",
        sourceUrl: "https://www.reddit.com/r/Brno/comments/1sxewdv/moving_to_brno/",
        topic: "community",
        sentiment: "mixed",
      },
      {
        quote: "Job market kinda sucks now though",
        sourceLabel: "r/Brno",
        sourceAgeLabel: "3wk ago",
        sourceUrl: "https://www.reddit.com/r/Brno/comments/1sxewdv/moving_to_brno/",
        topic: "money",
        sentiment: "negative",
      },
      {
        quote: "I moved here 13 years ago and still love it.",
        sourceLabel: "r/Brno",
        sourceAgeLabel: "3wk ago",
        sourceUrl: "https://www.reddit.com/r/Brno/comments/1sxewdv/moving_to_brno/",
        topic: "regret",
        sentiment: "positive",
      },
      {
        quote: "Public transport is a-fucking-mazing here.",
        sourceLabel: "r/Brno",
        sourceAgeLabel: "3wk ago",
        sourceUrl: "https://www.reddit.com/r/Brno/comments/1sxewdv/moving_to_brno/",
        topic: "first_90_days",
        sentiment: "positive",
      },
    ],
    sourceLinks: [
      {
        label: "Move to Brno",
        url: "https://www.reddit.com/r/czech/comments/1m1d3x8/move_to_brno/",
        topic: "bureaucracy",
      },
      {
        label: "Moving to Brno",
        url: "https://www.reddit.com/r/Brno/comments/1sxewdv/moving_to_brno/",
        topic: "housing",
      },
    ],
  }),
};

export const CITY_REALITY_REPORTS: CityRealityReport[] = CITIES.map((city) => {
  return REPORT_OVERRIDES[city.id] ?? REPORT_ENHANCEMENTS[city.id] ?? buildFallbackReport(city);
});

export function getCityRealityReportById(cityId: string) {
  const existingReport = CITY_REALITY_REPORTS.find((report) => report.cityId === cityId);

  if (existingReport) return existingReport;

  const city = getCityById(cityId);

  return city ? buildFallbackReport(city) : undefined;
}

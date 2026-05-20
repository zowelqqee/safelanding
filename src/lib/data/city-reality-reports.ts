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

export const CITY_REALITY_REPORTS: CityRealityReport[] = CITIES.map((city) => {
  return REPORT_OVERRIDES[city.id] ?? buildFallbackReport(city);
});

export function getCityRealityReportById(cityId: string) {
  const existingReport = CITY_REALITY_REPORTS.find((report) => report.cityId === cityId);

  if (existingReport) return existingReport;

  const city = getCityById(cityId);

  return city ? buildFallbackReport(city) : undefined;
}

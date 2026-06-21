export type Difficulty = "easy" | "medium" | "hard";

export interface TrickyWord {
  /** The word as it appears in the sentence (lowercase, no punctuation). */
  word: string;
  noteSi: string;
  noteEn: string;
}

export interface WfdQuestion {
  id: string;
  sentence: string;
  difficulty: Difficulty;
  trickyWords: TrickyWord[];
}

export const WFD_QUESTIONS: WfdQuestion[] = [
  {
    id: "wfd-1",
    sentence: "The library will be closed during the summer holidays.",
    difficulty: "easy",
    trickyWords: [
      {
        word: "library",
        noteSi:
          "'library' වචනය ලියද්දී 'r' අකුරු දෙකම අමතක කරන්න එපා — lib-ra-ry. බොහෝ අය 'libary' ලෙස වැරදියට ලියනවා.",
        noteEn:
          "Remember both 'r' letters in 'library' — lib-ra-ry. Many students misspell it as 'libary'.",
      },
      {
        word: "holidays",
        noteSi:
          "'holidays' බහු වචනයක් — අගට 's' එකතු කරන්න අමතක කරන්න එපා. ශබ්දයෙන් 's' පැහැදිලිව ඇහෙන්නේ නැති විට මෙය නිතර මඟ හැරෙනවා.",
        noteEn:
          "'holidays' is plural — don't forget the final 's'. It's easy to miss because the 's' is not always clear in speech.",
      },
    ],
  },
  {
    id: "wfd-2",
    sentence: "Students are required to submit their assignments by Friday.",
    difficulty: "medium",
    trickyWords: [
      {
        word: "required",
        noteSi:
          "'required' වචනයේ 'qu' එක 'k' ශබ්දයක් ලෙස ඇහෙනවා — re-quired ලෙස ලියන්න. අගට '-ed' එක අමතක කරන්න එපා.",
        noteEn:
          "In 'required', the 'qu' sounds like 'k' — write it as re-quired. Don't drop the '-ed' ending.",
      },
      {
        word: "assignments",
        noteSi:
          "'assignments' වචනයේ 's' අකුරු දෙකක් සහ නිහඬ 'g' අකුරක් තියෙනවා — a-ssign-ments. බහු වචන 's' එකත් අමතක කරන්න එපා.",
        noteEn:
          "'assignments' has a double 's' and a silent 'g' — a-ssign-ments. Remember the plural 's' too.",
      },
      {
        word: "their",
        noteSi:
          "'their' (ඔවුන්ගේ) සහ 'there' (එතන) ශබ්දයෙන් සමානයි. මෙහි අදහස 'ඔවුන්ගේ' නිසා 'their' ලෙස ලියන්න.",
        noteEn:
          "'their' (belonging to them) and 'there' (a place) sound the same. Here the meaning is possession, so write 'their'.",
      },
    ],
  },
  {
    id: "wfd-3",
    sentence:
      "The university provides a wide range of academic resources for international students.",
    difficulty: "hard",
    trickyWords: [
      {
        word: "university",
        noteSi:
          "'university' වචනය 'u' අකුරෙන් පටන් ගන්නවා, ශබ්දය 'yu' වුණත් — uni-ver-si-ty ලෙස කොටස් වලට කඩලා මතක තබා ගන්න.",
        noteEn:
          "'university' starts with 'u' even though it sounds like 'yu' — break it into uni-ver-si-ty to remember the spelling.",
      },
      {
        word: "academic",
        noteSi:
          "'academic' වචනය a-ca-de-mic ලෙස කොටස් හතරකට කඩන්න. 'acedemic' ලෙස වැරදියට ලියන අය ගොඩක් ඉන්නවා — දෙවැනි අකුර 'c' ට පස්සේ එන්නේ 'a' නෙවෙයි, 'a' ට පස්සේ 'd' එනවා: aca-demic.",
        noteEn:
          "Break 'academic' into a-ca-de-mic. A common misspelling is 'acedemic' — the vowel after 'ac' is 'a', then 'demic'.",
      },
      {
        word: "resources",
        noteSi:
          "'resources' වචනයේ මැද 'sour' කොටස තියෙනවා — re-sour-ces. බහු වචන 's' එක අගට අමතක කරන්න එපා.",
        noteEn:
          "'resources' contains 'sour' in the middle — re-sour-ces. Don't forget the plural 's' at the end.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Listening: Fill in the Blanks (L-FIB)                              */
/* ------------------------------------------------------------------ */

export interface FibQuestion {
  id: string;
  /** The passage text with blanks marked as {{word}}. */
  passage: string;
  /** The full unredacted text — used for TTS playback. */
  fullText: string;
  difficulty: Difficulty;
}

export const FIB_QUESTIONS: FibQuestion[] = [
  {
    id: "lfib-1",
    passage:
      "Climate change is one of the most {{significant}} challenges facing humanity today. Rising global {{temperatures}} have led to more frequent extreme weather events, including floods, droughts, and wildfires. Scientists have warned that without {{immediate}} action, the consequences could be {{irreversible}}. Governments around the world are now investing in renewable energy sources and implementing policies to reduce carbon {{emissions}}.",
    fullText:
      "Climate change is one of the most significant challenges facing humanity today. Rising global temperatures have led to more frequent extreme weather events, including floods, droughts, and wildfires. Scientists have warned that without immediate action, the consequences could be irreversible. Governments around the world are now investing in renewable energy sources and implementing policies to reduce carbon emissions.",
    difficulty: "medium",
  },
];

/* ------------------------------------------------------------------ */
/*  Listening: Highlight Incorrect Words (L-HIW)                       */
/* ------------------------------------------------------------------ */

export interface HiwIncorrectWord {
  index: number;
  displayed: string;
  correct: string;
}

export interface HiwQuestion {
  id: string;
  transcript: string;
  fullText: string;
  incorrectWords: HiwIncorrectWord[];
  difficulty: Difficulty;
}

export const HIW_QUESTIONS: HiwQuestion[] = [
  {
    id: "hiw-1",
    transcript: "So far in our discussion of chemical equations we have assumed that these reactions only go in one direction, the forward direction, from left to right as we read it in the equation. That's why our arrowhead points from left to right: reactants react together to make products. However, this is not exactly how things occur in reality. In fact, practically every chemical reaction is reversible, meaning the products can also react together to reform the reactants that they were made of. So instead of writing that single arrow facing from right to top, a more appropriate symbol would be a double arrow, one going from left to right and one going from right to left. Reactants are continually - continuously - reacting to form produce. But at the same time as those products are formed, they remake the reactants. They're both going simultaneously, forming each other. This is what we would call a state of equality.",
    fullText: "So far in our discussion of chemical reactions we have assumed that these reactions only go in one direction, the forward direction, from left to right as we read it in the equation. That's why our arrow points from left to right: reactants react together to make products. However, this is not exactly how things occur in reality. In fact, practically every chemical reaction is reversible, meaning the products can also react together to reform the reactants that they were made of. So instead of writing that single arrow facing from right to top, a more appropriate symbol would be a double arrow, one going from left to right and one going from right to left. Reactants are continually - continuously - reacting to form products. But at the same time as those products are formed, they remake the reactants. They're both going simultaneously, forming each other. This is what we would call a state of equilibrium.",
    incorrectWords: [
      {
        index: 7,
        displayed: "equations",
        correct: "reactions",
      },
      {
        index: 36,
        displayed: "arrowhead",
        correct: "arrow",
      },
      {
        index: 125,
        displayed: "produce.",
        correct: "products.",
      },
      {
        index: 156,
        displayed: "equality.",
        correct: "equilibrium.",
      },
    ],
    difficulty: "medium",
  },
];

/* ------------------------------------------------------------------ */
/*  Listening: Multiple-choice, Choose Multiple Answers (L-MCMA)      */
/* ------------------------------------------------------------------ */

export interface McmaQuestion {
  id: string;
  questionText: string;
  audioText: string;
  options: string[];
  correctIndices: number[];
  difficulty: Difficulty;
  explanationSi: string;
  explanationEn: string;
}

export const MCMA_QUESTIONS: McmaQuestion[] = [
  {
    id: "mcma-1",
    questionText: "The purpose of this talk is to ______",
    audioText: "Today, I want to discuss how simple, everyday objects can serve as the catalyst for groundbreaking technological innovations. Take the humble pinecone, for instance. By studying how it opens and closes in response to humidity, materials scientists have designed smart fabrics that adjust their breathability automatically. Similarly, observing the surface structure of a common lotus leaf led to the development of self-cleaning glass and paint. We often walk past these mundane items without a second thought, but if we change our perspective and look at them with curiosity, we can find elegant solutions to complex engineering challenges. I encourage all of you to look around your own homes and consider how the ordinary things you see might inspire the next wave of green technology.",
    options: [
      "suggest ways to make indoor lighting more economical.",
      "illustrate how an everyday object could inspire new technology.",
      "persuade listeners to participate in a scientific study.",
      "describe an artistic exhibition using familiar items.",
      "encourage listeners to think creatively about mundane items."
    ],
    correctIndices: [1, 4],
    difficulty: "medium",
    explanationEn: "The speaker illustrates how everyday objects like pinecones and lotus leaves inspire new technologies (smart fabrics, self-cleaning glass) and encourages listeners to think creatively about mundane items in their own homes to inspire future green technology.",
    explanationSi: "කථිකයා පෙන්වා දෙන්නේ පයින් කෝන්ස් (pinecones) සහ නෙළුම් කොළ (lotus leaves) වැනි එදිනෙදා දකින සරල දේවල් ඇසුරින් නව තාක්ෂණයන් (smart fabrics, self-cleaning glass) බිහි වී ඇති ආකාරයයි. තවද, තමන්ගේ නිවෙස්වල ඇති එදිනෙදා දකින සරල දේවල් දෙස නිර්මාණශීලීව බලා අනාගත හරිත තාක්ෂණය සඳහා අනුප්‍රාණය ලබා ගන්නා ලෙස ඔහු ශ්‍රාවකයන් දිරිමත් කරයි."
  },
  {
    id: "mcma-2",
    questionText: "According to the speaker, which of the following statements about sleep and memory are true?",
    audioText: "When we acquire new information during the day, it is first registered in the hippocampus, a temporary storage site with limited capacity. During the deep stages of sleep, particularly slow-wave sleep, these memories are reactivated and gradually transferred to the neocortex for long-term storage, which frees up the hippocampus for new learning. This process involves the active strengthening of neural pathways, which stabilizes the memory trace and protects it from interference. Research shows that sleep deprivation severely impairs this transfer process, making it incredibly difficult to form new lasting memories the next day. Furthermore, even brief periods of daytime rest, such as a twenty-minute nap, can significantly enhance cognitive retention and boost subsequent memory performance.",
    options: [
      "Deep sleep primarily helps in consolidating motor skills and procedural tasks.",
      "The hippocampus temporarily stores new information before transferring it to the cortex.",
      "Sleep deprivation affects the brain's ability to retrieve old memories but not form new ones.",
      "During slow-wave sleep, neural connections are actively strengthened to stabilize memories.",
      "A short afternoon nap has no significant impact on cognitive retention."
    ],
    correctIndices: [1, 3],
    difficulty: "hard",
    explanationEn: "The speaker states that new information is temporarily registered in the hippocampus before being transferred to the neocortex during sleep, and that during slow-wave sleep, neural connections are actively strengthened to stabilize these memories.",
    explanationSi: "කථිකයා පවසන පරිදි අලුතින් ලබාගන්නා තොරතුරු ප්‍රථමයෙන් හිපොකැම්පස් (hippocampus) හි තාවකාලිකව තැන්පත් වන අතර නින්දේදී ඒවා ප්‍රධාන මස්තිෂ්ක බාහිකයට (neocortex) මාරු කරනු ලැබේ. තවද, ගැඹුරු නින්දේදී (slow-wave sleep) මතකයන් ස්ථාවර කිරීම සඳහා ස්නායුක සම්බන්ධතා සක්‍රීයව ශක්තිමත් කෙරේ."
  }
];

/* ------------------------------------------------------------------ */
/*  Listening: Multiple-choice, Choose Single Answer (L-MCSA)         */
/* ------------------------------------------------------------------ */

export interface McsaQuestion {
  id: string;
  questionText: string;
  audioText: string;
  options: string[];
  correctIndex: number;
  difficulty: Difficulty;
  explanationSi: string;
  explanationEn: string;
}

export const MCSA_QUESTIONS: McsaQuestion[] = [
  {
    id: "mcsa-1",
    questionText: "What is the speaker's main point about the history of spices?",
    audioText: "For thousands of years, spices were not just culinary enhancers, but powerful currencies and symbols of immense wealth. The spice trade drove global exploration, leading to the charting of new oceans and the colonization of distant lands. European powers fought fierce wars over control of small islands in the East Indies where nutmeg and cloves grew. However, as trade routes expanded and cultivation techniques spread to other parts of the world, spices transitioned from luxury items reserved for royalty to common ingredients available to everyone. Today, while we take black pepper and cinnamon for granted, their historical impact on geopolitical boundaries and global cultural exchange remains profound.",
    options: [
      "European powers were primarily interested in spices for their medicinal properties.",
      "The global trade of spices was a key catalyst for exploration and colonization.",
      "Spices have always been inexpensive and widely available throughout history.",
      "The cultivation of nutmeg was restricted to European territories."
    ],
    correctIndex: 1,
    difficulty: "medium",
    explanationEn: "The speaker states that the spice trade 'drove global exploration, leading to the charting of new oceans and the colonization of distant lands' and notes its 'historical impact on geopolitical boundaries'.",
    explanationSi: "කථිකයා පවසන්නේ කුළුබඩු වෙළඳාම ගෝලීය ගවේෂණයට මඟ පෑදූ අතර නව සාගර සිතියම්ගත කිරීමට සහ දුරස්ථ රටවල් යටත් විජිතකරණය කිරීමට හේතු වූ බවයි."
  },
  {
    id: "mcsa-2",
    questionText: "According to the speaker, what is the primary benefit of urban green spaces?",
    audioText: "While the aesthetic value of parks and urban gardens is undeniable, their primary benefit lies in their capacity to mitigate the urban heat island effect. Built environments, dominated by concrete and asphalt, absorb and retain heat, raising city temperatures significantly compared to surrounding rural areas. Vegetation, however, cools the air through evapotranspiration and provides shade. This natural cooling mechanism not only enhances human comfort but also reduces the energy demand for air conditioning, thereby lowering greenhouse gas emissions. Therefore, strategic integration of green spaces is a crucial adaptation measure for combatting climate change in dense metropolitan areas.",
    options: [
      "They increase concrete and asphalt surfaces in metropolitan areas.",
      "They serve as a tourist attraction that boosts the local economy.",
      "They cool city air through evapotranspiration, mitigating heat absorption.",
      "They eliminate the need for agricultural production in rural areas."
    ],
    correctIndex: 2,
    difficulty: "hard",
    explanationEn: "The speaker highlights that green spaces mitigate the urban heat island effect because 'vegetation cools the air through evapotranspiration and provides shade'.",
    explanationSi: "නගරයේ කොන්ක්‍රීට් සහ තාර මගින් අවශෝෂණය කරගන්නා තාපය අවම කරමින්, ශාක පත්‍ර මගින් සිදුවන උත්ස්වේදනය (evapotranspiration) සහ සෙවණ ලබාදීම මගින් නගරයේ වාතය සිසිල් කිරීම හරිත අවකාශයන්ගෙන් ලැබෙන ප්‍රධානතම ප්‍රයෝජනය බව කථිකයා පවසයි."
  }
];

/* ------------------------------------------------------------------ */
/*  Listening: Highlight Correct Summary (L-HCS)                     */
/* ------------------------------------------------------------------ */

export interface HcsQuestion {
  id: string;
  audioText: string;
  options: string[];
  correctIndex: number;
  difficulty: Difficulty;
  explanationSi: string;
  explanationEn: string;
}

export const HCS_QUESTIONS: HcsQuestion[] = [
  {
    id: "hcs-1",
    audioText: "For centuries, it was a fundamental tenet of biology that all life on Earth ultimately depended on energy from the sun. Photosynthesis was seen as the primary engine driving food webs across every ecosystem, from lush rain forests to the depths of the ocean. However, in 1977, oceanographers exploring the Galápagos Rift made a startling discovery that completely shattered this paradigm: hydrothermal vents spewing superheated, mineral-rich water onto the dark ocean floor. To their amazement, these vents were surrounded by thriving communities of bizarre organisms, including giant tube worms, blind shrimp, and ghost crabs, living in complete darkness and under crushing pressure. Instead of sunlight, the foundation of this ecosystem was chemosynthesis—a process where specialized bacteria convert toxic hydrogen sulfide from the vents into usable chemical energy. This discovery not only proved that complex life could survive without solar radiation, but it also revolutionized our understanding of where life might have originated on early Earth, suggesting that the first metabolic pathways may have sparked in the hot, mineral-rich environments of the deep sea. It has even expanded our search for extraterrestrial life, pointing scientists toward the icy moons of Jupiter and Saturn, where sub-surface oceans might host similar hydrothermal systems.",
    options: [
      "The discovery of hydrothermal vents in 1977 challenged the long-held belief that all terrestrial life depends on photosynthesis and sunlight. By revealing ecosystems supported entirely by chemosynthesis in the deep ocean, it opened new possibilities regarding the origin of life on Earth and where life might exist on other planets.",
      "Although oceanographers in 1977 discovered that giant tube worms and blind shrimp could survive under extreme pressure near hydrothermal vents, these organisms were later found to depend indirectly on photosynthetic debris drifting down from the ocean surface.",
      "Deep-sea hydrothermal vents proved that life originated in space before being transported to Earth. This has led scientists to focus their planetary exploration exclusively on Jupiter and Saturn, where similar bacterial ecosystems have already been documented.",
      "Hydrothermal vents are extremely toxic environments due to the presence of hydrogen sulfide, which makes it impossible for standard marine life to survive. Scientists are now trying to clean these areas to protect nearby ecosystems from further chemical contamination."
    ],
    correctIndex: 0,
    difficulty: "hard",
    explanationEn: "The speaker discusses how the discovery of deep-sea hydrothermal vents in 1977 disproved the assumption that all life depends on sunlight and photosynthesis. These ecosystems rely on chemosynthesis, which has changed theories on the origin of life and where we might find life in outer space. The first option best summarizes all these key points.",
    explanationSi: "කථිකයා පවසන්නේ 1977 වසරේදී ගැඹුරු මුහුදේ හයිඩ්‍රොතර්මල් වෙන්ට්ස් (hydrothermal vents) සොයාගැනීමත් සමඟ, සියලුම ජීවීන් සූර්යාලෝකය සහ ප්‍රභාසංස්ලේෂණය මත රඳා පවතී යන මතය අභියෝගයට ලක් වූ බවයි. සූර්යාලෝකය රහිතව රසායනික සංස්ලේෂණය (chemosynthesis) ඇසුරින් පවතින මෙම පරිසර පද්ධති සොයාගැනීම නිසා ජීවයේ සම්භවය සහ වෙනත් ග්‍රහලෝකවල ජීවය පැවතීමේ හැකියාව පිළිබඳ පර්යේෂණ උඩුයටිකුරු විය. පළමු විකල්පය මෙම සියලු කරුණු හොඳින්ම කැටි කොට දක්වයි."
  }
];

/* ------------------------------------------------------------------ */
/*  Speaking & Writing: Summarize Written Text (SWT)                   */
/* ------------------------------------------------------------------ */

export interface SwtQuestion {
  id: string;
  /** The reading passage (up to ~300 words). */
  passage: string;
  /** Key concepts/terms that a good summary should mention. */
  keyPoints: string[];
  /** A model one-sentence summary for reference. */
  sampleAnswer: string;
  difficulty: Difficulty;
  explanationEn: string;
  explanationSi: string;
}

/* ------------------------------------------------------------------ */
/*  Speaking & Writing: Write Essay (WE)                               */
/* ------------------------------------------------------------------ */

export interface WeQuestion {
  id: string;
  /** The essay prompt (2-3 sentences). */
  prompt: string;
  /** Key arguments / angles a good essay should address. */
  keyPoints: string[];
  /** A model essay for reference. */
  sampleAnswer: string;
  difficulty: Difficulty;
  explanationEn: string;
  explanationSi: string;
}

export const WE_QUESTIONS: WeQuestion[] = [
  {
    id: "we-1",
    prompt:
      "Some people think placing advertisements in schools is a great resource for public schools that need additional funding, while others think it exploits children by treating them as a captive audience for corporate sponsors. Choose which position you most agree with and discuss why you chose that position. Support your point of view with details from your own experiences, observations or reading.",
    keyPoints: [
      "funding",
      "advertisements",
      "schools",
      "children",
      "corporate",
      "ethics",
      "education",
      "revenue",
      "influence",
      "public",
    ],
    sampleAnswer:
      "While public schools across the globe continue to face budgetary constraints that limit the quality of education they can provide, the introduction of advertisements within school premises is not the appropriate solution, as it risks transforming the learning environment into a marketplace where impressionable young minds become targets of corporate marketing strategies.\n\nAdmittedly, advertising revenue can supplement tight school budgets, funding new equipment, extracurricular activities, and facility upgrades that would otherwise be unaffordable. In some regions, schools have successfully partnered with local businesses to create mutually beneficial arrangements without compromising educational integrity. However, these cases remain the exception rather than the rule.\n\nThe primary concern is that children, particularly those in primary and secondary education, lack the critical thinking skills to distinguish between educational content and commercial messaging. Constant exposure to branded materials normalises consumerism at a formative age, potentially shaping lifelong purchasing habits before students can make informed choices. Moreover, allowing corporate sponsors into classrooms creates an inherent power imbalance, where companies may seek to influence curriculum content or school policies in exchange for financial support.\n\nAlternative funding mechanisms, such as increased government investment, community fundraising, and grant programmes, offer sustainable solutions that do not compromise the neutrality of the educational environment. Schools should remain spaces dedicated exclusively to learning and personal development.\n\nIn conclusion, the short-term financial gains from school advertisements are outweighed by the long-term ethical implications of exposing children to commercial influence. Protecting the sanctity of education must remain the priority.",
    difficulty: "medium",
    explanationEn:
      "A strong essay should clearly state a position (for or against advertisements in schools), provide supporting arguments with specific examples, acknowledge the opposing view, and conclude with a clear restatement of the position. The essay must be 200–300 words and demonstrate good grammar, vocabulary, and logical structure.",
    explanationSi:
      "හොඳ රචනාවක් පැහැදිලි ස්ථාවරයක් (පාසල්වල වෙළඳ දැන්වීම් සඳහා හෝ විරුද්ධව) ප්‍රකාශ කළ යුතු අතර, නිශ්චිත උදාහරණ සහිත සහාය තර්ක ඉදිරිපත් කළ යුතුය, ප්‍රතිවිරුද්ධ මතය පිළිගත යුතුය, සහ ස්ථාවරය පැහැදිලිව නැවත ප්‍රකාශ කරමින් නිගමනය කළ යුතුය. රචනාව වචන 200–300 අතර විය යුතු අතර හොඳ ව්‍යාකරණය, වචන මාලාව සහ තාර්කික ව්‍යුහය පෙන්විය යුතුය.",
  },
  {
    id: "we-2",
    prompt:
      "In the modern world, the ability to communicate effectively in more than one language is becoming increasingly important. Do you agree or disagree with the statement that learning a foreign language should be made compulsory for all school students? Support your point of view with reasons and examples from your own experience or observations.",
    keyPoints: [
      "language",
      "compulsory",
      "communication",
      "globalisation",
      "culture",
      "cognitive",
      "education",
      "students",
      "multilingual",
      "career",
    ],
    sampleAnswer:
      "In an increasingly interconnected world, the ability to communicate across linguistic boundaries has become not merely advantageous but essential. I firmly agree that learning a foreign language should be a compulsory component of school curricula, as the benefits extend far beyond simple communication skills.\n\nFirstly, research consistently demonstrates that bilingual and multilingual individuals exhibit enhanced cognitive abilities, including improved problem-solving skills, greater mental flexibility, and delayed onset of age-related cognitive decline. These neurological advantages alone justify the inclusion of language learning in education. Furthermore, studying a foreign language inherently involves exploring another culture, fostering empathy, tolerance, and a broader worldview that prepares students for life in a globalised society.\n\nFrom a practical standpoint, multilingual graduates enjoy significantly better career prospects in the international job market. Companies operating across borders actively seek employees who can navigate different linguistic and cultural environments. My own experience studying Japanese during secondary school not only opened professional opportunities but also deepened my understanding of East Asian history and philosophy in ways that purely English-language resources could not.\n\nCritics may argue that compulsory language study places an unnecessary burden on students already managing heavy workloads. However, starting language education early, when children's capacity for linguistic acquisition is at its peak, minimises this burden while maximising long-term benefits.\n\nIn conclusion, making foreign language learning compulsory equips students with cognitive, cultural, and professional advantages that are indispensable in the twenty-first century. The investment in language education is an investment in a more connected and understanding world.",
    difficulty: "medium",
    explanationEn:
      "The essay should take a clear stance on whether foreign language learning should be compulsory, provide supporting arguments covering cognitive, cultural, and career benefits, use personal examples or observations, address counterarguments, and maintain a 200–300 word count with proper structure.",
    explanationSi:
      "රචනාව විදේශ භාෂා ඉගෙනීම අනිවාර්ය කළ යුතුද යන්න පිළිබඳ පැහැදිලි ස්ථාවරයක් ගත යුතු අතර, සංජානනාත්මක, සංස්කෘතික සහ වෘත්තීය ප්‍රතිලාභ ආවරණය කරන සහාය තර්ක ඉදිරිපත් කළ යුතුය, පෞද්ගලික උදාහරණ හෝ නිරීක්ෂණ භාවිතා කළ යුතුය, ප්‍රති-තර්කවලට පිළිතුරු දිය යුතුය, සහ නිසි ව්‍යුහයක් සමඟ වචන 200–300 ක ගණනක් පවත්වා ගත යුතුය.",
  },
];

export const SWT_QUESTIONS: SwtQuestion[] = [
  {
    id: "swt-1",
    passage:
      "For millions of years, Mediterranean sea turtles have been coming to the shore of southern Lebanon to lay their eggs. Every summer, their babies hatch and literally run for their lives on the strip of sand that separates their nests from the sea. An endangered species, they had been largely ignored in this part of Lebanon until two women set out to protect them. Mona Khalil was inspired by a walk on the beach during a visit to her homeland, when she first saw the turtles. Upon learning that they were close to disappearing from her country, Khalil decided to \"come back and do something about them.\"\n\nThe next year, 2000, she returned and teamed up with Habiba Fayed, who shares her passion for the environment. They opened a bed-and-breakfast in the Khalil family home to finance their efforts. Guests could simply vacation or, in the spirit of ecotourism, they could help the owners protect the turtles' nests and keep the beach clean.\n\nFemale turtles travel to the exact spot where they were born to dig their nests in the sand, laying an average of 70 to 100 eggs. This is the moment when the women intervene. They protect the nests from predators by burying an iron grid in the sand above the eggs. The spaces on the grid are large enough to allow the baby turtles to emerge after a month and find their way to the sea... and to a chance at life.",
    keyPoints: [
      "Mediterranean sea turtles",
      "endangered",
      "Lebanon",
      "Mona Khalil",
      "Habiba Fayed",
      "protect",
      "nests",
      "ecotourism",
      "bed-and-breakfast",
      "iron grid",
      "predators",
    ],
    sampleAnswer:
      "Two women, Mona Khalil and Habiba Fayed, have been working to protect endangered Mediterranean sea turtles in southern Lebanon by opening an ecotourism bed-and-breakfast to fund their conservation efforts, which include burying iron grids over the turtles' nests to shield the eggs from predators and give hatchlings a chance to reach the sea.",
    difficulty: "medium",
    explanationEn:
      "The passage describes how two women — Mona Khalil and Habiba Fayed — took action to protect endangered Mediterranean sea turtles nesting on the shores of southern Lebanon. They funded their conservation work through an ecotourism bed-and-breakfast and physically protected the nests using iron grids buried in the sand. A strong summary should capture the who (the two women), the what (protecting endangered sea turtles), the where (southern Lebanon), and the how (ecotourism funding + iron grid protection).",
    explanationSi:
      "මෙම ඡේදය විස්තර කරන්නේ මොනා කලීල් (Mona Khalil) සහ හබීබා ෆයඩ් (Habiba Fayed) යන කාන්තාවන් දෙදෙනා දකුණු ලෙබනනයේ වෙරළ තීරයේ බිත්තර දමන වඳවීමේ තර්ජනයට ලක්ව ඇති මධ්‍යධරණී මුහුදු කැස්බෑවන් ආරක්ෂා කිරීමට ක්‍රියා කළ ආකාරයයි. ඔවුන් සංරක්ෂණ කටයුතු සඳහා මුදල් සපයා ගත්තේ පරිසර සංචාරක ආතිථ්‍ය ගෙයක් (bed-and-breakfast) පවත්වාගෙන යමිනි. එමෙන්ම වැලිවල යකඩ දැලක් (iron grid) වළලා බිත්තර දමන ස්ථාන ආරක්ෂා කළහ. හොඳ සාරාංශයක් කවුද (කාන්තාවන් දෙදෙනා), කුමක්ද (කැස්බෑවන් ආරක්ෂා කිරීම), කොහේද (දකුණු ලෙබනනය), සහ කෙසේද (පරිසර සංචාරක අරමුදල් + යකඩ දැල් ආරක්ෂණය) යන කරුණු ග්‍රහණය කළ යුතුය.",
  },
];

/* ------------------------------------------------------------------ */
/*  Reading: Fill in the Blanks — Dropdown (R-FIB)                     */
/* ------------------------------------------------------------------ */

export interface RfibBlank {
  /** The correct word for this blank. */
  answer: string;
  /** The dropdown options (always includes the correct answer). */
  options: string[];
}

export interface RfibQuestion {
  id: string;
  /**
   * Passage with blanks marked as {{answer|opt1,opt2,opt3,opt4}}.
   * The answer before the pipe is the correct one; the options after
   * the pipe are all the dropdown choices (including the correct one).
   */
  passage: string;
  /** Pre-parsed blanks (derived at build time for convenience). */
  blanks: RfibBlank[];
  difficulty: Difficulty;
}

export const RFIB_QUESTIONS: RfibQuestion[] = [
  {
    id: "rfib-1",
    passage:
      "The evidence for a genetic basis of antisocial behavior stems from several different lines of research. First, behavioral genetic studies have {{demonstrated|demonstrated,argued,imagined,overlooked}} that heredity plays a role in antisocial behavior, including various forms of aggression and criminality. Behavior genetic studies typically compare genetically {{related|related,unrelated,similar,compatible}} individuals, compared to non-relatives living in the same environment, to establish the contribution of genes and environment. Second, various personality factors such as impulsivity, sensation-seeking, risk-taking, and callous-unemotional traits have been identified as {{underlying|underlying,overcoming,replacing,ignoring}} antisocial behavior and these personality factors are at least partly genetically {{determined|determined,eliminated,assumed,attempted}}. Third, psychiatric outcomes related to antisocial behavior, including antisocial personality disorder, psychopathy, and substance use and abuse, have also been {{examined|examined,discarded,manufactured,overlooked}} in genetically informative designs, and each of these has been found to have genetic links.",
    blanks: [
      {
        answer: "demonstrated",
        options: ["demonstrated", "argued", "imagined", "overlooked"],
      },
      {
        answer: "related",
        options: ["related", "unrelated", "similar", "compatible"],
      },
      {
        answer: "underlying",
        options: ["underlying", "overcoming", "replacing", "ignoring"],
      },
      {
        answer: "determined",
        options: ["determined", "eliminated", "assumed", "attempted"],
      },
      {
        answer: "examined",
        options: ["examined", "discarded", "manufactured", "overlooked"],
      },
    ],
    difficulty: "medium",
  },
];

/* ------------------------------------------------------------------ */
/*  Reading: Multiple-choice, Choose Multiple Answers (R-MCMA)         */
/* ------------------------------------------------------------------ */

export interface RmcmaQuestion {
  id: string;
  passage: string;
  questionText: string;
  options: string[];
  correctIndices: number[];
  difficulty: Difficulty;
  explanationSi: string;
  explanationEn: string;
}

export const RMCMA_QUESTIONS: RmcmaQuestion[] = [
  {
    id: "rmcma-1",
    passage:
      "Adaptations enable living organisms to cope with environmental stresses and pressures. Adaptation can be structural or behavioral. Structural adaptations are special body parts of an organism that help it to survive in its natural habitat (e.g., skin color, shape, body covering). Behavioral adaptations are the ways a particular organism behaves to survive in its natural habitat. Physiological adaptations are systems present in an organism that allow it to perform certain biochemical reactions (e.g. making venom, secreting slime, being able to keep a constant body temperature). Adaptations are traits that have been selected for by natural selection. The underlying genetic basis for the adaptive trait did not arise as a consequence of the environment; the genetic variant pre-existed and was subsequently selected because it provided the bearer of that variant some advantage.",
    questionText: "Which of the following are true statements about adaptations?",
    options: [
      "They can be structural, behavioral, or physiological adaptations.",
      "They mostly occur in physical appearances of special body parts of an organism.",
      "They are new genes created to increase an organism's chance of survival.",
      "They are genes selected due to the benefits they offer in a particular environment.",
      "They are created by the environment to help an organism survive in its habitat."
    ],
    correctIndices: [0, 3],
    difficulty: "medium",
    explanationEn: "According to the text, adaptations can be structural, behavioral, or physiological. Furthermore, the genetic basis for adaptations does not arise as a consequence of the environment, but rather pre-existing genetic variants are selected because they provide an advantage (meaning they are selected due to the benefits they offer in that environment).",
    explanationSi: "පෙළට අනුව, අනුවර්තන ව්‍යුහාත්මක (structural), චර්යාත්මක (behavioral), හෝ කායික විද්‍යාත්මක (physiological) විය හැකිය. තවද, අනුවර්තනයන් සඳහා වන ජානමය පදනම පරිසරයේ බලපෑම නිසා ඇතිවන්නක් නොවන අතර, පූර්වයෙන් පැවති ජානමය ප්‍රභේදයන් එම පරිසරය තුළ වාසිදායක වන බැවින් ස්වභාවික වරණය මගින් තෝරා ගනු ලැබේ (එනම්, යම් පරිසරයක ඒවා ලබා දෙන වාසි නිසා තෝරා ගනු ලැබේ)."
  }
];

/* ------------------------------------------------------------------ */
/*  Reading: Reorder Paragraph (R-RP)                                 */
/* ------------------------------------------------------------------ */

export interface RpQuestion {
  id: string;
  paragraphs: string[]; // Correct order
  difficulty: Difficulty;
  explanationEn: string;
  explanationSi: string;
}

export const RP_QUESTIONS: RpQuestion[] = [
  {
    id: "rp-1",
    paragraphs: [
      "In most countries it is only the government, through their central banks, who are permitted to issue currency.",
      "But in Scotland three banks are still allowed to issue banknotes.",
      "The first Scottish bank to do this was the Bank of Scotland.",
      "When this bank was founded in 1695, Scots coinage was in short supply and of uncertain value, compared with English, Dutch, Flemish or French coin.",
      "To face growth of trade it was deemed necessary to remedy this lack of an adequate currency."
    ],
    difficulty: "medium",
    explanationEn: "The passage starts with a general statement about currency issuance globally. It then introduces the exception (Scotland), followed by historical details about the first Scottish bank to issue notes (Bank of Scotland in 1695), its circumstances (scarcity of coinage), and the subsequent action taken to remedy the currency deficit.",
    explanationSi: "ඡේදය ආරම්භ වන්නේ ගෝලීය වශයෙන් මුදල් නිකුත් කිරීම පිළිබඳ පොදු ප්‍රකාශයකිනි. ඉන්පසු එය සුවිශේෂී අවස්ථාව (ස්කොට්ලන්තය) හඳුන්වා දෙයි, පසුව මුදල් නිකුත් කළ පළමු ස්කොට්ලන්ත බැංකුව (1695 දී ස්කොට්ලන්ත බැංකුව) පිළිබඳ ඓතිහාසික තොරතුරු, එහි තත්ත්වයන් (කාසි හිඟකම) සහ මුදල් හිඟයට පිළියම් සෙවීම සඳහා ගත් පියවර දක්වයි."
  },
  {
    id: "rp-2",
    paragraphs: [
      "Halloween is a holiday celebrated each year on October 31.",
      "It is related to an ancient Celtic festival where people lit bonfires and wore costumes to ward off ghosts.",
      "Another historical connection to Halloween comes from the 8th Century when Pope Gregory proclaimed November 1st to be All Saints Day.",
      "The two traditions eventually merged.",
      "Thus Halloween evolved into an event incorporating the saints as well as ghosts and involving dressing up in scary costumes."
    ],
    difficulty: "medium",
    explanationEn: "The sequence starts by introducing Halloween on October 31. The second sentence provides its connection to the ancient Celtic festival. The third sentence adds 'Another historical connection' (All Saints Day in the 8th century). The fourth sentence explains that 'The two traditions eventually merged', and the final sentence concludes with 'Thus' to summarize the modern holiday's elements.",
    explanationSi: "ආරම්භක ඡේදය ඔක්තෝබර් 31 වන දින හැලොවීන් (Halloween) හඳුන්වා දෙයි. දෙවන වාක්‍යය පුරාණ කෙල්ටික් (Celtic) උත්සවය සමඟ එහි සම්බන්ධය දක්වයි. තෙවන වාක්‍යය 'තවත් ඓතිහාසික සම්බන්ධයක්' (8 වන සියවසේ සර්ව සාන්තුවරයන්ගේ දිනය) එක් කරයි. සිව්වන වාක්‍යය පැහැදිලි කරන්නේ 'මෙම සම්ප්‍රදායන් දෙක අවසානයේදී ඒකාබද්ධ වූ' බවයි, සහ අවසාන වාක්‍යය නවීන නිවාඩු දින අංග සාරාංශ කිරීම සඳහා 'Thus' (එබැවින්) යොදාගනිමින් නිගමනය කරයි."
  }
];

/* ------------------------------------------------------------------ */
/*  Reading: Fill in the Blanks — Drag and Drop (R-FIB-DD)            */
/* ------------------------------------------------------------------ */

export interface FibDdQuestion {
  id: string;
  passage: string; // Passage with blanks marked as {{correct_word}}
  distractors: string[]; // Extra incorrect options
  difficulty: Difficulty;
  explanationEn: string;
  explanationSi: string;
}

export const FIB_DD_QUESTIONS: FibDdQuestion[] = [
  {
    id: "fib-dd-1",
    passage:
      "Our programme will develop your {{theoretical}} knowledge of Computer Science and your problem-solving and {{analytical}} skills, while enabling you to achieve the {{ultimate}} qualification for the IT professional. The programme structure is extremely {{flexible}}, enabling you to personalise your MSc through a wide range of electives.",
    distractors: ["variable", "considerable", "decisive"],
    difficulty: "medium",
    explanationEn: "The blank (1) requires an adjective to describe 'knowledge', where 'theoretical' fits standard academic descriptions. Blank (2) describes skills combined with problem-solving, which refers to 'analytical' skills. Blank (3) describes the highest or final qualification, which is 'ultimate'. Blank (4) requires an adjective to describe the course structure that allows electives, making 'flexible' the correct context.",
    explanationSi: "හිස්තැන (1) සඳහා 'knowledge' (දැනුම) විස්තර කිරීමට නාමවිශේෂණයක් අවශ්‍ය වන අතර, ශාස්ත්‍රීය විස්තරවලට 'theoretical' (න්‍යායාත්මක) යන වචනය ගැලපේ. හිස්තැන (2) ගැටළු විසඳීම සමඟ ඒකාබද්ධ වූ කුසලතා විස්තර කරයි, එය 'analytical' (විශ්ලේෂණාත්මක) කුසලතා හැඳින්වේ. හිස්තැන (3) ඉහළම හෝ අවසාන සුදුසුකම විස්තර කරයි, එය 'ultimate' (උත්කෘෂ්ට/අවසාන) වේ. හිස්තැන (4) සඳහා අභිමත විෂයන් තෝරා ගැනීමට ඉඩ සලසන පාඨමාලා ව්‍යුහය විස්තර කිරීමට නාමවිශේෂණයක් අවශ්‍ය වේ, එබැවින් 'flexible' (නම්‍යශීලී) යන්න නිවැරදි සන්දර්භය වේ."
  },
  {
    id: "fib-dd-2",
    passage:
      "A sustainable transportation system is one in which people's needs for access are accommodated using a minimum of resources. Applying {{principles}} of {{sustainability}} to transportation will reduce pollution generated by engines and decrease traffic congestion.",
    distractors: ["principals", "sustainable", "accommodate"],
    difficulty: "easy",
    explanationEn: "The first blank needs a noun plural to fit after the verb 'Applying' and before 'of', making 'principles' (rules/laws) correct. The second blank requires a noun after the preposition 'of', making 'sustainability' correct. 'principals' refers to school heads or main actors, and 'sustainable' is an adjective, so they are incorrect.",
    explanationSi: "පළමු හිස්තැන සඳහා 'Applying' ක්‍රියාපදයෙන් පසුව සහ 'of' ට පෙර ගැලපෙන බහුවචන නාමපදයක් අවශ්‍ය වේ, එබැවින් 'principles' (ප්‍රතිපත්ති/මූලධර්ම) නිවැරදි වේ. දෙවන හිස්තැන සඳහා 'of' නිපාත පදයට පසුව නාමපදයක් අවශ්‍ය වේ, එබැවින් 'sustainability' (තිරසාරභාවය) නිවැරදි වේ. 'principals' යන්නෙන් විදුහල්පතිවරුන් හෝ ප්‍රධාන පාර්ශවකරුවන් හැඳින්වෙන අතර, 'sustainable' යන්න නාමවිශේෂණයක් බැවින් ඒවා වැරදි වේ."
  }
];

/* ------------------------------------------------------------------ */
/*  Reading: Multiple-choice, Choose Single Answer (R-MCSA)           */
/* ------------------------------------------------------------------ */

export interface RmcsaQuestion {
  id: string;
  passage: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  difficulty: Difficulty;
  explanationSi: string;
  explanationEn: string;
}

export const RMCSA_QUESTIONS: RmcsaQuestion[] = [
  {
    id: "rmcsa-1",
    passage:
      "In many ways Britten's most ambitious effort is the War Requiem of 1961, a flawed but still impressive work for chorus, soloists, and orchestra. It weaves together the traditional Latin Mass for the Dead with antiwar poems by Wilfrid Owen, a young officer killed in World War I. The point of War Requiem is how the words of the liturgical text are reinterpreted and often rendered hollow by the realities of death in war. In this work we see Britten's prodigal inconsistencies on display. For all its problems, the War Requiem will probably survive as one of our time's most impassioned indictments of war and its heroic myth.",
    questionText: "Which of the following most accurately summarizes the opinion of the author in the text?",
    options: [
      "He finds the weaving together of the Latin Mass and antiwar poems to be quite effective.",
      "He is critical of Britten's inconsistencies as observed in the War Requiem.",
      "He admires the War Requiem of Britten but finds it far from perfect.",
      "He questions whether Britten's work will endure."
    ],
    correctIndex: 2,
    difficulty: "medium",
    explanationEn:
      "The author describes the War Requiem as 'a flawed but still impressive work' and concludes that 'For all its problems, the War Requiem will probably survive as one of our time's most impassioned indictments of war'. This indicates that he admires the work despite acknowledging its flaws and inconsistencies.",
    explanationSi:
      "කතුවරයා War Requiem කෘතිය 'වැරදි සහිත වුවත් තවමත් ආකර්ෂණීය නිර්මාණයක්' ලෙස විස්තර කරන අතර 'එහි සියලු ගැටලු මධ්‍යයේ වුවද, War Requiem අපේ කාලයේ යුද්ධයට එරෙහි වඩාත්ම ප්‍රබල චෝදනාවක් ලෙස පවතිනු ඇත' යනුවෙන් නිගමනය කරයි. මෙයින් ඇඟවෙන්නේ එහි ඇති අඩුපාඩු සහ නොගැලපීම් පිළිගනිමින්ම ඔහු එම කෘතිය අගය කරන බවයි."
  },
  {
    id: "rmcsa-2",
    passage:
      "The exploration of space has always captured the human imagination, but the financial cost of such endeavors has repeatedly sparked intense political debate. Advocates argue that space exploration drives technological innovation, yielding spin-off technologies that benefit everyday life on Earth, from water purification systems to advanced medical imaging. Opponents, however, point to pressing terrestrial problems—such as poverty, climate change, and failing infrastructure—that require immediate funding. They argue that billions of dollars spent on interplanetary missions could be better utilized to solve issues that directly impact human well-being today. While public opinion remains divided, the growing involvement of private commercial enterprises in spaceflight is shifting the financial burden and introducing new dynamics to the debate.",
    questionText: "What is the primary argument of the opponents of space exploration as described in the text?",
    options: [
      "Private commercial enterprises should not be allowed to participate in spaceflight.",
      "The technological innovations from space exploration do not benefit everyday life.",
      "The financial resources would be better spent addressing urgent problems on Earth.",
      "Interplanetary missions are too dangerous for human astronauts."
    ],
    correctIndex: 2,
    difficulty: "easy",
    explanationEn:
      "The text states that opponents point to 'pressing terrestrial problems—such as poverty, climate change, and failing infrastructure—that require immediate funding' and argue that money spent on space flight could be 'better utilized to solve issues that directly impact human well-being today.'",
    explanationSi:
      "අභ්‍යවකාශ ගවේෂණයට විරුද්ධ වන අය 'දුප්පත්කම, දේශගුණික විපර්යාස සහ අඩපණ වී ඇති යටිතල පහසුකම් වැනි ක්ෂණික ප්‍රතිපාදන අවශ්‍ය වන පෘථිවියේ පවතින ගැටලු' පෙන්වා දෙන අතර, අභ්‍යවකාශ චාරිකා සඳහා වැය කරන මුදල් 'අද මිනිසාගේ යහපැවැත්මට සෘජුවම බලපාන ගැටලු විසඳීමට වඩා හොඳින් භාවිතා කළ හැකි' බව තර්ක කරන බව පෙළෙහි සඳහන් වේ."
  }
];






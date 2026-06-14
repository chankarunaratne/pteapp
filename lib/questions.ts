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


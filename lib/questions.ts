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

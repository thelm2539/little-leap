export type Domain = "sensorimotor" | "language" | "cognitive";

export interface Activity {
  id: string;
  title: string;
  domain: Domain;
  duration: string;
  instructions: string;
  why: string;
  thisWeek?: boolean;
}

export const DOMAIN_LABEL: Record<Domain, string> = {
  sensorimotor: "Sensory & Motor",
  language: "Language & Communication",
  cognitive: "Cognitive",
};

export const DOMAIN_DOT: Record<Domain, string> = {
  sensorimotor: "bg-domain-sensorimotor",
  language: "bg-domain-language",
  cognitive: "bg-domain-cognitive",
};

export const DOMAIN_BADGE: Record<Domain, string> = {
  sensorimotor: "bg-domain-sensorimotor/15 text-domain-sensorimotor border-domain-sensorimotor/30",
  language: "bg-domain-language/15 text-domain-language border-domain-language/30",
  cognitive: "bg-domain-cognitive/20 text-domain-cognitive border-domain-cognitive/40",
};

export const ACTIVITIES: Activity[] = [
  {
    id: "skin-to-skin",
    title: "Skin-to-Skin Time",
    domain: "sensorimotor",
    duration: "20–60 min",
    thisWeek: true,
    instructions:
      "Lay baby on your bare chest, skin to baby's skin. Cover with a light blanket if cool. Allow baby to hear your heartbeat and feel your warmth. Do during a calm, alert window.",
    why: "Kangaroo care has strong replicated evidence (multiple RCTs, endorsed by WHO) for stabilising heart rate, temperature regulation, and cortisol levels. Physical holding is neurologically active stimulation, not passive comfort.",
  },
  {
    id: "face-gazing",
    title: "Face Gazing — The Slow Face",
    domain: "language",
    duration: "3–5 min",
    thisWeek: true,
    instructions:
      "Hold baby approximately 25 cm from your face. Make eye contact. Wait. When they react — a grimace, eyebrow lift, mouth movement — mirror it back slowly. Then pause again and give them a turn. Follow their lead, not yours.",
    why: "Activates face-detection circuits at baby's exact focal range. The Still-Face Paradigm (Tronick et al., 1978 — one of the most replicated experiments in developmental science) shows babies are active participants in social exchange, not passive receivers. Pausing and waiting teaches the turn-taking structure of conversation.",
  },
  {
    id: "narrated-day",
    title: "The Narrated Day",
    domain: "language",
    duration: "Ongoing",
    thisWeek: true,
    instructions:
      "Narrate what you are doing as you do it, in a calm, slightly slower voice. \"Now I'm changing your nappy — the wipe is going to be cold.\" \"Here comes your milk.\" No need for forced cheerfulness — your natural voice and pace is what matters.",
    why: "Newborns are born as \"universal phoneticians\" absorbing prosodic patterns — the rhythm, stress, and melody of speech — before individual words. Research shows infants preferentially attend to infant-directed speech (Soderstrom, 2007). Quantity of talk in the first year predicts vocabulary at age 3 (Hart & Risley, 1995).",
  },
  {
    id: "palmar-grasp",
    title: "Palmar Grasp Practice",
    domain: "sensorimotor",
    duration: "2–3 min",
    thisWeek: true,
    instructions:
      "Press your clean finger gently against baby's palm. Wait for the grasp reflex to activate. Don't pull or tug — just let them hold. Repeat 3–5 times during an alert window.",
    why: "The palmar grasp is a brainstem-mediated primitive reflex present from birth. Practising it activates the same sensorimotor circuits that will later support intentional reaching and grasping. Repeated activation of these circuits during the sensitive period strengthens the neural pathways.",
  },
  {
    id: "scent-cloth",
    title: "Scent Cloth Settling",
    domain: "cognitive",
    duration: "As needed",
    thisWeek: true,
    instructions:
      "Place a muslin cloth or small square of soft fabric against your skin for 30 minutes. Place it near baby's face (not over it) during awake times or when they are unsettled, not during sleep. Refresh every 24 hours.",
    why: "Newborns can identify their mother's scent within hours of birth. Familiar scent activates the olfactory system — one of the most mature sensory pathways at birth — and has a measurable calming effect on cortisol levels (replicated in neonatal studies).",
  },
  {
    id: "high-contrast",
    title: "High-Contrast Card Gazing",
    domain: "sensorimotor",
    duration: "3–5 min",
    instructions:
      "Hold a black-and-white high-contrast card or pattern (stripes, checkerboard) at 25 cm. Watch for stilling, wide eyes, or a gaze-lock — signs of visual engagement. Shift it slowly side to side.",
    why: "At 2–3 weeks, the visual system is most responsive to high-contrast edges. Tracking practice strengthens the developing oculomotor circuits and supports later visual attention.",
  },
  {
    id: "vestibular-sway",
    title: "Vestibular Sway",
    domain: "sensorimotor",
    duration: "5–10 min",
    instructions:
      "Hold baby upright against your chest and sway gently side to side or rock slowly forward and back.",
    why: "The vestibular system is among the earliest sensory systems to develop and is functional before birth. Gentle vestibular input is calming and supports the developing balance and spatial systems.",
  },
  {
    id: "tummy-chest",
    title: "Tummy Time on Chest",
    domain: "sensorimotor",
    duration: "2–5 min",
    instructions:
      "Recline slightly and place baby face-down on your chest. This is the gentlest entry to tummy time and uses your heartbeat and scent as calming anchors while baby works on head lifting.",
    why: "Early tummy time builds neck and shoulder strength essential for later head control, rolling, and crawling — without the distress of floor-based tummy time at this age.",
  },
  {
    id: "bath-skin",
    title: "Bath Time Skin Stimulation",
    domain: "sensorimotor",
    duration: "5 min",
    instructions:
      "During a warm bath or a warm water pour with a cup, narrate what you are doing. The warmth activates thermoreceptors; the gentle water flow stimulates cutaneous mechanoreceptors across baby's skin.",
    why: "Multi-sensory experiences (warmth, touch, voice, sight) build cross-modal neural connections. Routine narration also reinforces language input.",
  },
  {
    id: "massage",
    title: "Gentle Massage Strokes",
    domain: "sensorimotor",
    duration: "5–10 min",
    instructions:
      "Using a small amount of plain baby oil or none at all, use long gentle strokes from shoulder to wrist on each arm, and hip to ankle on each leg. Use light, confident pressure — not feather-light which can feel ticklish.",
    why: "Infant massage has replicated evidence for reduced cortisol, improved sleep, and improved parent-infant bonding (Field et al., multiple studies).",
  },
  {
    id: "serve-return",
    title: "Serve and Return Cooing",
    domain: "language",
    duration: "5 min",
    instructions:
      "In a quiet moment, make a simple sound toward baby (a soft \"ooh\" or gentle coo). Wait. If they respond with a sound or movement, respond back. You are not teaching a word — you are teaching the structure of conversation.",
    why: "Contingent vocal exchange is the foundation of language. The Harvard Center on the Developing Child identifies \"serve and return\" as one of the most important predictors of long-term language and social development.",
  },
  {
    id: "favourite-song",
    title: "Favourite Song Repetition",
    domain: "language",
    duration: "5 min",
    instructions:
      "Sing the same simple song every day, at the same time if possible (bath time, nappy change). The repetition is the point — familiarity is detectable by 2-week-olds and is associated with reduced cortisol.",
    why: "Repeated melodic input strengthens auditory memory and the developing prosodic map of the home language.",
  },
  {
    id: "name-calling",
    title: "Name Calling",
    domain: "language",
    duration: "2–3 min",
    instructions:
      "In a quiet room, call baby's name softly from different positions (left, right, above). Watch for stilling, head turning attempts, or eye widening. Do not repeat rapidly — give a 5-second pause between each call.",
    why: "Auditory localisation is developing in the first months. Pauses give the immature nervous system time to process and orient.",
  },
  {
    id: "mobile-watching",
    title: "Mobile Watching",
    domain: "cognitive",
    duration: "5 min",
    instructions:
      "Hang a high-contrast mobile or hold a simple object 25–30 cm above baby. Move it slowly. The key sign it is working: baby stills and stares intently (the \"orienting response\"). Remove it before they become fussy.",
    why: "Sustained attention at this age is the precursor of later focused learning. The orienting response is the brain's signal of active processing.",
  },
  {
    id: "contingency-kick",
    title: "Contingency Kicking",
    domain: "cognitive",
    duration: "5–10 min",
    instructions:
      "Tie a soft ribbon from baby's ankle to a lightweight mobile above (ensure it is safely attached and cannot tighten). Baby discovers their leg kick moves the mobile.",
    why: "This replicates Rovee-Collier's landmark studies on infant contingency learning and memory — among the earliest evidence that very young infants form lasting memories of cause-and-effect relationships.",
  },
];

export const FAQS = [
  {
    q: "Why does my baby keep looking away during face time?",
    a: "Looking away is self-regulation, not disengagement. It is baby's way of managing sensory load. The correct response is to pause completely and wait. They will usually re-engage within 10–30 seconds. Chasing their gaze extends the session less effectively than matching their rhythm.",
  },
  {
    q: "Is it okay to respond to every single cry?",
    a: "Yes — and the evidence is clear. Responsive caregiving in the first months is associated with less crying at 12 months (Bell & Ainsworth, 1972; replicated). You cannot reinforce crying in a newborn. What you are doing is calibrating their stress-response system.",
  },
  {
    q: "How much tummy time is right for week 3?",
    a: "2–4 minutes per session, 2–3 times a day, is appropriate at this age. Always supervised, always on a firm flat surface. Starting on your chest (reclined) is the gentlest entry point. Brief head-lifting (1–2 seconds) at 2–3 weeks is genuinely ahead of the curve.",
  },
  {
    q: "Should I be worried about overstimulating my baby?",
    a: "Gentle face-gazing, holding, talking, and touch cannot overstimulate a newborn in normal amounts. The signal to stop is baby looking away, arching, or becoming fussy. Follow baby's lead — they are excellent at communicating when they have had enough.",
  },
  {
    q: "Why does my baby prefer my partner's / my voice?",
    a: "Because they learned it in the womb. The cochlea is structurally complete by 20 weeks gestation, and newborns have been exposed to sound for approximately 20 weeks before birth. DeCasper & Fifer (1980, Science) showed newborns prefer their mother's voice over a stranger's from the first days of life. Your baby also recognises the rhythm and melody of the language spoken at home.",
  },
  {
    q: "What do quiet alert states look like and how long do they last?",
    a: "Quiet alert is when baby is awake, calm, eyes open and bright, and not feeding or crying. At 2–3 weeks these windows may be 4–7 minutes. They are the richest time for interaction — face gazing, narration, and gentle activity work best here. Watch for yawning or gaze aversion as the signal to wind down.",
  },
  {
    q: "Is my baby's vision really that limited?",
    a: "Visual acuity at birth is approximately 0.05–0.1 on the adult scale. Baby sees best at 20–30 cm with high contrast (black/white edges). Colour sensitivity begins emerging around 2–3 months. This is not a limitation to worry about — it is precisely calibrated to the distance from a cradled baby's eyes to a caregiver's face.",
  },
  {
    q: "How do I know the activities are actually working?",
    a: "The key signs: stilling (baby becomes very quiet and focused), wide eyes and a gaze-lock, slowed breathing, and sustained attention. These are the \"orienting response\" — the neurological signal that the brain is processing new input. Fussing, arching, and looking away mean wind it down. Both responses are useful information.",
  },
];

export const WEEK_EXPECTATIONS = [
  {
    title: "Physical development",
    body: "Alert windows are lengthening from 2–3 minutes in week 1 to 4–7 minutes now. Primitive reflexes (Moro startle, palmar grasp, rooting) are still fully active — these are signs of healthy neurological function, not something to reduce. Head control is very early: brief lifting during tummy time (1–2 seconds) is excellent progress at this stage.",
  },
  {
    title: "Sensory development",
    body: "Vision is sharpest at 20–30 cm — precisely the distance from a cradled baby's face to the caregiver's face while feeding. High-contrast black and white patterns are far more stimulating than colourful toys right now. Colour sensitivity is only just beginning to emerge in the fovea. Your baby already recognises your voice from hearing it in the womb.",
  },
  {
    title: "Cognitive development",
    body: "Your baby is learning contingency — that their actions produce predictable responses. Every time you respond to a cry, a coo, or a gaze, you are literally teaching them that their actions matter. This is the earliest form of learning and the foundation for later problem-solving. Quiet alert states (awake but calm) are the richest windows for interaction.",
  },
];

export const WEEKLY_TIP =
  "Your baby can now focus best at 20–30 cm — exactly the distance from a cradled baby's eyes to your face while feeding.";

export const DOB = new Date(2026, 5, 9); // 9 June 2026

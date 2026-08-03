// ── Domain taxonomy ───────────────────────────────────────────────────────────
//
// 5 top-level domains (previously 3). Each maps to a colour token in
// src/styles.css and resolves to bg-domain-*, text-domain-*, border-domain-*.
//
// social-emotional is intentionally distributed across domains rather than
// given its own top-level bucket — social activities surface inside the domain
// that best describes their primary mechanism (language-communication for
// serve-and-return; cognitive for attention/social-cognition).
//
// sleep has its own domain so research-agent findings in sleep neuroscience
// have a clear landing zone in the app.

export type Domain =
  | "sensory" // touch · proprioception · vestibular · gross & fine motor
  | "visual" // contrast · pattern · tracking · luminance
  | "language-communication" // auditory · social-communication · language-exposure
  | "cognitive" // attention · causal-learning · social-cognition
  | "sleep"; // sleep environment · routine · circadian settling

// ── Sub-domain taxonomy ───────────────────────────────────────────────────────
// Optional second-level tag. Lets the research agent target suggestions
// precisely and enables future filtered views in the UI.

export type SubDomain =
  // sensory
  | "tactile" // skin, texture, olfactory, palmar
  | "vestibular-motor" // carrying, tummy-time, swaying, limb movement
  | "multi-sensory" // activities activating ≥3 modalities simultaneously
  // visual
  | "contrast-pattern" // high-contrast cards, light/shadow, face as stimulus
  | "visual-tracking" // smooth-pursuit, slow object movement
  // language-communication
  | "auditory" // voice mapping, song, outdoor listening, heartbeat
  | "social-communication" // serve-and-return, face gazing, narrated day
  | "language-exposure" // reading aloud, name repetition
  // cognitive
  | "attention" // quiet alert, habituation, attention-recovery
  | "causal-learning" // contingency detection, cause-and-effect
  | "social-cognition" // imitation, facial expression, early theory-of-mind
  // sleep
  | "sleep-environment" // sensory conditions that support sleep onset
  | "sleep-routine"; // rhythmic/predictable pre-sleep sequences

// ── Activity interface ────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  title: string;
  domain: Domain;
  subDomain?: SubDomain;
  ageWindowWeeks: string;
  processSupported: string;
  evidenceBasis: string;
  instructions: string[];
  durationMinutes: number;
  whyItWorks: string;
  weekRecommended: number;
  // Added by research agent as evidence accumulates — optional until populated
  sources?: { citation: string; url: string }[];
  shortTermBenefits?: string[];
  longTermBenefits?: string[];
}

// ── Domain display maps ───────────────────────────────────────────────────────

export const DOMAIN_LABEL: Record<Domain, string> = {
  sensory: "Sensory & Motor",
  visual: "Visual",
  "language-communication": "Language & Communication",
  cognitive: "Cognitive",
  sleep: "Sleep & Calming",
};

export const DOMAIN_DOT: Record<Domain, string> = {
  sensory: "bg-domain-sensory",
  visual: "bg-domain-visual",
  "language-communication": "bg-domain-language-communication",
  cognitive: "bg-domain-cognitive",
  sleep: "bg-domain-sleep",
};

export const DOMAIN_BADGE: Record<Domain, string> = {
  sensory: "bg-domain-sensory/15 text-domain-sensory border-domain-sensory/30",
  visual: "bg-domain-visual/15 text-domain-visual border-domain-visual/30",
  "language-communication":
    "bg-domain-language-communication/15 text-domain-language-communication border-domain-language-communication/30",
  cognitive: "bg-domain-cognitive/20 text-domain-cognitive border-domain-cognitive/40",
  sleep: "bg-domain-sleep/15 text-domain-sleep border-domain-sleep/30",
};

export function formatDuration(minutes: number): string {
  if (minutes === 0) return "Ongoing";
  return `${minutes} min`;
}

// ── Activities ────────────────────────────────────────────────────────────────
// 31 activities across 5 active domains.
//
// Domain breakdown:
//   visual                 4   (mirror-face-time, bw-card-gallery,
//                               object-tracking, light-shadow)
//   sensory                8   (tummy-time, sway-narrate, palmar-grasp,
//                               cloth-texture, scent-pairing, joint-compression,
//                               varied-carrying, limb-movement, skin-to-skin)
//   language-communication  9   (slow-face, conversation-turn, voice-mapping,
//                               same-song, reading-aloud, heartbeat-settling,
//                               name-repetition, outdoor-listening, narrated-day)
//   cognitive               5   (facial-expression-copying, contingency-mobile,
//                               attention-recovery, quiet-alert-observation,
//                               novel-object-pause)
//   sleep                   4   (water-sound-bath [Warm calming bath], hum-chest,
//                               infant-massage, white-noise)
//
// NOTE: domain here is the activity's PRIMARY classification. An activity may
// still be referenced by a milestone in another domain (the milestone⇄activity
// link is many-to-many) — e.g. hum-chest is Sleep & Calming but supports the
// auditory-memory milestone. See the domain-taxonomy cleanup in BACKLOG.md.

export const ACTIVITIES: Activity[] = [
  // ── VISUAL ─────────────────────────────────────────────────────────────────
  {
    id: "mirror-face-time",
    title: "Mirror face time",
    domain: "visual",
    subDomain: "contrast-pattern",
    ageWindowWeeks: "0–12",
    processSupported: "Visual cortex calibration and face-recognition circuit activation",
    evidenceBasis:
      "Newborns preferentially attend to faces at ~25 cm; face-selective cortical responses present by 2 months (Farroni et al.; Nature Neuroscience 2025).",
    instructions: [
      "Hold baby facing a mirror at arm's length (~25 cm from their face).",
      "Let them look for 30–60 seconds.",
      "Slowly move your own face into view beside theirs so they can compare.",
      "Narrate softly: 'That's you. That's your nose.' Calm is fine — no need for energy.",
    ],
    durationMinutes: 3,
    whyItWorks:
      "High-contrast face image at optimal focal distance activates developing face-detection circuits without requiring fine visual acuity.",
    weekRecommended: 3,
  },
  {
    id: "bw-card-gallery",
    title: "Black-and-white card gallery",
    domain: "visual",
    subDomain: "contrast-pattern",
    ageWindowWeeks: "0–8",
    processSupported:
      "Early visual cortex calibration — pattern detection before colour vision matures",
    evidenceBasis:
      "Newborn contrast sensitivity favours high-contrast edges; colour discrimination emerges ~2–3 months (Norcia & Tyler, 1985; replicated).",
    instructions: [
      "Draw 3–4 simple high-contrast images on separate sheets: thick black stripes, a bull's-eye, a simple face (two circles for eyes, curved line for mouth), a checkerboard.",
      "Prop them upright at ~25–30 cm from where baby's face will be.",
      "Place baby on their back facing the cards during an alert period.",
      "Watch for stilling, widened eyes, or brief tracking — you don't need to point or direct.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "High-contrast patterns are the most robustly processed visual stimuli in the 0–2 month window, directly matching the infant visual system's sensitivity profile.",
    weekRecommended: 1,
  },
  {
    id: "object-tracking",
    title: "Slow object tracking",
    domain: "visual",
    subDomain: "visual-tracking",
    ageWindowWeeks: "0–12",
    processSupported: "Visual tracking circuit development; smooth pursuit maturation",
    evidenceBasis:
      "Visual tracking (smooth pursuit) emerges gradually from ~6 weeks; subcortical superior colliculus drives early orienting, cortical control increases by 3 months (reviewed in Atkinson, 2000).",
    instructions: [
      "Hold baby on your lap, face up.",
      "Hold an object at ~25 cm, slightly above eye level. A white sock with a black X works well.",
      "Wait until baby focuses on it.",
      "Move it SLOWLY (about 10 cm per second) in an arc to one side, then back.",
      "Pause frequently — baby's tracking is fragile and easily lost.",
      "0–4 weeks: horizontal arc only. 4–8 weeks: try slow vertical too. 8–12 weeks: try a full 180° arc.",
    ],
    durationMinutes: 3,
    whyItWorks:
      "Repeated tracking practice strengthens the cortical smooth-pursuit pathways being laid down in real time.",
    weekRecommended: 4,
  },
  {
    id: "light-shadow",
    title: "Light and shadow play",
    domain: "visual",
    subDomain: "contrast-pattern",
    ageWindowWeeks: "0–12",
    processSupported: "Luminance contrast detection; visual orienting reflex",
    evidenceBasis:
      "Orienting toward light and high-luminance contrast is mediated by subcortical pathways (superior colliculus) functional at birth — among the earliest visual behaviours.",
    instructions: [
      "In a dimly lit room, turn on a single lamp with a shade.",
      "Hold baby facing the light (not directly at a bare bulb).",
      "Move your hand between the light source and baby's face, casting a shadow that moves slowly across their visual field.",
      "Watch for orienting — eyes or head turning toward the light edge.",
      "Keep it simple and slow.",
    ],
    durationMinutes: 3,
    whyItWorks:
      "Luminance contrast and moving edges are the two most salient visual stimuli for the neonatal visual system — this directly targets the circuits that are active earliest.",
    weekRecommended: 1,
  },

  // ── SENSORY ────────────────────────────────────────────────────────────────
  {
    id: "tummy-time-chest",
    title: "Tummy time on your chest",
    domain: "sensory",
    subDomain: "vestibular-motor",
    ageWindowWeeks: "0–12",
    processSupported:
      "Neck extensor muscle development, vestibular input, proprioceptive stimulation",
    evidenceBasis:
      "Prone positioning activates neck and back extensor circuits essential for later head control and postural development; AAP-endorsed for awake supervised periods.",
    instructions: [
      "Recline slightly (30–45 degrees is easier for baby than fully flat).",
      "Place baby prone (tummy-down) on your chest, head near your collarbone.",
      "Let baby's head rest to the side initially.",
      "Talk or sing softly — your voice gives them a reason to try to lift their head.",
      "1–2 minutes is enough in the first weeks. Build gradually.",
      "Never do tummy time when you might fall asleep.",
    ],
    durationMinutes: 2,
    whyItWorks:
      "Prone positioning requires active neck extension — even attempts count — and the familiar sound of your heartbeat and voice provides a calming context.",
    weekRecommended: 2,
  },
  {
    id: "sway-narrate",
    title: "Slow sway and narrate walk",
    domain: "sensory",
    subDomain: "vestibular-motor",
    ageWindowWeeks: "0–12",
    processSupported: "Vestibular system stimulation; language exposure; stress regulation",
    evidenceBasis:
      "Rhythmic vestibular input promotes postural circuit maturation; slow rhythmic motion reduces infant crying and promotes calming via parasympathetic activation (NIH; multiple studies).",
    instructions: [
      "Hold baby securely against your chest or in a cradle hold.",
      "Walk slowly around the room, swaying gently side to side.",
      "Narrate what you see: 'Here's the window. Here's the plant. The light is on.'",
      "Keep your pace slow and the sway smooth — no bouncing needed.",
      "If baby is fussy, try walking toward a window or light source.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "Gentle linear and rotational motion activates semicircular canal pathways — the vestibular system develops early and responds well to slow rhythmic input.",
    weekRecommended: 1,
  },
  {
    id: "palmar-grasp",
    title: "Palmar grasp practice",
    domain: "sensory",
    subDomain: "tactile",
    ageWindowWeeks: "0–8",
    processSupported: "Palmar grasp reflex activation and corticospinal circuit priming",
    evidenceBasis:
      "Palmar grasp reflex is a brainstem-mediated response that primes corticospinal motor circuits later underlying voluntary reach (NIH StatPearls; Forssberg et al.).",
    instructions: [
      "When baby's hand is open, gently stroke the palm from wrist toward fingers.",
      "They will reflexively grip your finger.",
      "Hold for 5–10 seconds, then gently release.",
      "Repeat 3–5 times per hand.",
      "You can also offer the handle of a wooden spoon or a rolled washcloth for texture variety.",
    ],
    durationMinutes: 3,
    whyItWorks:
      "Each reflex activation is a neural circuit firing — repeated activation strengthens the pathways that will eventually become voluntary grasping.",
    weekRecommended: 3,
  },
  {
    id: "cloth-texture",
    title: "Cloth texture exploration",
    domain: "sensory",
    subDomain: "tactile",
    ageWindowWeeks: "0–12",
    processSupported: "Cutaneous mechanoreceptor stimulation; somatosensory cortex activation",
    evidenceBasis:
      "Tactile stimulation activates somatosensory pathways functional at birth; skin-to-skin contact has replicated physiological benefits (WHO Kangaroo Care evidence base).",
    instructions: [
      "Lay baby on their back on a firm flat surface.",
      "Gently stroke each cloth across baby's forearm, palm, or cheek in turn.",
      "Pause between each one — watch their face for changes in expression.",
      "Name the texture out loud: 'smooth,' 'scratchy,' 'fluffy.' (Language exposure bonus.)",
      "Stop if baby shows distress.",
    ],
    durationMinutes: 3,
    whyItWorks:
      "Different textures activate distinct mechanoreceptor populations, providing varied somatosensory input to a cortex hungry for calibration data.",
    weekRecommended: 4,
  },
  {
    id: "scent-pairing",
    title: "Scent cloth settling",
    domain: "sensory",
    subDomain: "tactile",
    ageWindowWeeks: "0–8",
    processSupported: "Olfactory pathway development; association learning; stress regulation",
    evidenceBasis:
      "Olfactory system is among the most mature at birth; newborns recognise and prefer mother's breast milk scent within days (Macfarlane, 1975; replicated); olfactory-emotional learning pathways are functional neonatally.",
    instructions: [
      "Wear a cloth or piece of fabric against your skin for a few hours.",
      "When you need to set baby down, place this cloth next to (not over) their face.",
      "Notice whether baby turns toward it or stills.",
      "Refresh every 24 hours — scent fades quickly.",
    ],
    durationMinutes: 2,
    whyItWorks:
      "Newborns navigate their world largely by smell in the first weeks. Familiar olfactory cues activate stress-buffering responses and demonstrate early associative learning.",
    weekRecommended: 3,
  },
  {
    id: "joint-compression",
    title: "Gentle joint compression",
    domain: "sensory",
    subDomain: "vestibular-motor",
    ageWindowWeeks: "0–12",
    processSupported: "Proprioceptive pathway activation; body-schema development",
    evidenceBasis:
      "Proprioceptive input activates joint mechanoreceptors and muscle spindles, providing body-boundary data to the developing somatosensory cortex — important for early body schema formation.",
    instructions: [
      "Lay baby on their back on a firm surface.",
      "Gently hold baby's foot with both hands and apply a very gentle steady pressure toward the hip. Hold 5 seconds, release.",
      "Repeat on the other leg.",
      "Optionally: gently hold baby's hand and apply gentle steady pressure toward the shoulder along the arm's axis.",
      "This should feel like firm-but-gentle contact, not manipulation or stretching.",
    ],
    durationMinutes: 3,
    whyItWorks:
      "Joint compression activates deep proprioceptors that give the brain information about body position — the data source for building a body map.",
    weekRecommended: 4,
  },
  {
    id: "varied-carrying",
    title: "Varied carrying positions",
    domain: "sensory",
    subDomain: "vestibular-motor",
    ageWindowWeeks: "0–12",
    processSupported: "Vestibular and proprioceptive input variety; postural circuit development",
    evidenceBasis:
      "Vestibular system develops early and responds to varied spatial orientations; varied carrying positions provide different gravitational loads to developing postural circuits.",
    instructions: [
      "Over the course of a day, try 3–4 different holding positions:",
      "1. Cradle hold (face up, head in crook of arm)",
      "2. Upright against chest, facing you",
      "3. Upright against chest, facing outward",
      "4. Football hold (baby face-down along your forearm, head at your hand)",
      "Move slowly between positions. Never shake or jolt.",
      "Each position offers a different vestibular experience.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "Different orientations activate different semicircular canals and otolith organs, giving the vestibular cortex varied input to calibrate against.",
    weekRecommended: 2,
  },
  {
    id: "limb-movement",
    title: "Gentle limb movement",
    domain: "sensory",
    subDomain: "vestibular-motor",
    ageWindowWeeks: "0–12",
    processSupported: "Proprioceptive calibration; motor efference copy learning",
    evidenceBasis:
      "Passive limb movement provides afferent proprioceptive input alongside the developing efferent motor pathways, contributing to the body schema being built in somatosensory and motor cortex.",
    instructions: [
      "Lay baby on their back.",
      "Gently hold one foot and slowly bicycle the legs: left knee bends as right extends, alternating, in a smooth slow rhythm.",
      "Also try: gently raising both arms above the head, then back down.",
      "And: gently crossing arms across chest, then opening back out.",
      "All movements should be extremely slow, smooth, and fully within the joint's natural range. Never force or stretch.",
      "Narrate as you go: 'Left leg... right leg...'",
    ],
    durationMinutes: 4,
    whyItWorks:
      "Movement generates proprioceptive signals that train the brain's maps of the body — even passive movement provides the input the motor cortex uses to calibrate.",
    weekRecommended: 3,
  },
  {
    id: "water-sound-bath",
    title: "Warm calming bath",
    domain: "sleep",
    subDomain: "sleep-routine",
    ageWindowWeeks: "0–52",
    processSupported:
      "Parasympathetic wind-down; passive body warming and post-bath cooling that cues sleep onset",
    evidenceBasis:
      "A warm bath 1–2 hours before sleep raises skin temperature and then triggers a compensatory core-temperature drop as the body cools — the same nocturnal temperature fall that precedes natural sleep onset. Warm-bath-before-bed is a widely studied component of infant sleep routines.",
    instructions: [
      "Support baby's head firmly throughout.",
      "Lower them slowly into warm (not hot — test with your elbow) water.",
      "Let them experience the water on limbs first, then lower the body.",
      "Gently pour water over the trunk with a cupped hand, narrating softly.",
      "Keep it short and unstimulating: 5–7 minutes, lights low.",
      "Dry thoroughly and move straight into the quiet part of the bedtime routine.",
    ],
    durationMinutes: 7,
    whyItWorks:
      "The warmth relaxes the body, and the gradual cooling afterwards mimics the core-temperature drop that naturally precedes sleep — which is why a warm bath is one of the most reliable pre-sleep cues. Kept short and low-key, it signals wind-down rather than play.",
    weekRecommended: 3,
  },
  {
    id: "skin-to-skin",
    title: "Skin-to-skin time",
    domain: "sensory",
    subDomain: "tactile",
    ageWindowWeeks: "0–12",
    processSupported:
      "Autonomic nervous system regulation; cortisol buffering; tactile and thermoregulatory pathway activation",
    evidenceBasis:
      "Kangaroo care has strong replicated evidence (multiple RCTs, endorsed by WHO) for stabilising heart rate, temperature regulation, and cortisol levels in both preterm and term infants. Physical holding is neurologically active stimulation.",
    instructions: [
      "Lay baby on your bare chest, skin to skin.",
      "Cover with a light blanket if cool.",
      "Allow baby to hear your heartbeat and feel your warmth.",
      "Do during a calm, alert window — no specific activity required.",
    ],
    durationMinutes: 30,
    whyItWorks:
      "Skin-to-skin contact simultaneously activates thermoregulatory, tactile, olfactory, and auditory pathways. It is caregiving and neurostimulation at the same time.",
    weekRecommended: 3,
  },

  // ── LANGUAGE & COMMUNICATION ───────────────────────────────────────────────
  {
    id: "slow-face",
    title: "Face gazing — the slow face",
    domain: "language-communication",
    subDomain: "social-communication",
    ageWindowWeeks: "0–12",
    processSupported: "Serve-and-return neural pathway development; face-gaze contingency learning",
    evidenceBasis:
      "Contingent face-to-face interaction builds stress-regulatory and social circuits (Tronick et al., 1978 Still-Face Paradigm — one of the most replicated experiments in developmental science).",
    instructions: [
      "Hold baby at your chest, facing you.",
      "Slowly bring your face to ~25 cm from theirs.",
      "Make eye contact and wait — don't speak first.",
      "When baby makes any expression or sound, mirror it back slowly.",
      "Pause after each response. Let them take a turn.",
      "If baby looks away, that is self-regulation — wait. They will usually return.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "Contingent responsiveness — your reaction following their cue — is the fundamental unit of social-brain wiring in this period.",
    weekRecommended: 3,
  },
  {
    id: "conversation-turn",
    title: "The conversation turn",
    domain: "language-communication",
    subDomain: "social-communication",
    ageWindowWeeks: "0–12",
    processSupported: "Prosodic pattern learning; serve-and-return neural circuit development",
    evidenceBasis:
      "Infants at 0–3 months are absorbing prosodic patterns — rhythm, stress, intonation — which are the primary auditory units available to their developing auditory cortex (Werker & Tees; Kuhl et al.).",
    instructions: [
      "Hold baby at ~25 cm from your face.",
      "Say something simple in a warm tone: 'Hi. How are you feeling?'",
      "Stop completely and wait 5–10 seconds.",
      "If baby makes any sound, expression change, or movement: respond as if it was a word. 'Oh really? That's interesting.'",
      "Then pause again. Give them another turn.",
      "Let it be a real (if slow) conversation — 3–5 minutes.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "Pausing and waiting teaches the temporal structure of conversation — turn-taking is a learned social-cognitive pattern, and 0–3 months is when its scaffolding begins.",
    weekRecommended: 2,
  },
  {
    id: "voice-mapping",
    title: "Voice mapping",
    domain: "language-communication",
    subDomain: "auditory",
    ageWindowWeeks: "0–8",
    processSupported: "Auditory localisation; cross-modal integration of voice and face",
    evidenceBasis:
      "Newborns turn toward the mother's voice (DeCasper & Fifer, 1980, Science); voice localisation depends on binaural auditory pathways functional at birth.",
    instructions: [
      "Lay baby on their back on a safe flat surface.",
      "Move to their right side, just outside their visual field (~45 degrees off centre).",
      "Call their name or say 'hello' in a warm, clear voice.",
      "Wait and watch — many babies will orient their eyes or turn their head.",
      "Move to the left and repeat. Try from above, then from below.",
      "Keep voice volume normal — no need to be loud.",
    ],
    durationMinutes: 3,
    whyItWorks:
      "Auditory localisation requires coordinating binaural timing differences — this simple activity is actively exercising those circuits.",
    weekRecommended: 2,
  },
  {
    id: "same-song",
    title: "Singing the same song",
    domain: "language-communication",
    subDomain: "auditory",
    ageWindowWeeks: "0–12",
    processSupported:
      "Auditory pattern memory; prosodic learning; stress regulation via familiar sound",
    evidenceBasis:
      "Newborns recognise and prefer sounds heard repeatedly in utero; familiar songs activate memory and calming circuits (DeCasper & Fifer, 1980; prenatal learning literature).",
    instructions: [
      "Pick one or two very simple songs or rhymes.",
      "Sing them slowly, at the same time and in the same context each day (e.g. always at diaper change).",
      "Keep the melody and words consistent — don't vary it much.",
      "By 4–6 weeks, watch for anticipatory stilling when you begin — a sign of recognition.",
      "Volume: soft to moderate. Baby is very close.",
    ],
    durationMinutes: 3,
    whyItWorks:
      "Repeated exposure to the same prosodic sequence builds auditory memory traces — the first building blocks of pattern recognition and predictive processing.",
    weekRecommended: 1,
  },
  {
    id: "reading-aloud",
    title: "Reading aloud — anything",
    domain: "language-communication",
    subDomain: "language-exposure",
    ageWindowWeeks: "0–12",
    processSupported:
      "Prosodic exposure; language rhythm absorption; stress regulation via caregiver voice",
    evidenceBasis:
      "The content of what is read does not matter at this age — prosodic pattern exposure is the active ingredient (Werker & Tees; Soderstrom, 2007).",
    instructions: [
      "Hold baby in a comfortable position facing you.",
      "Read aloud from anything — your own book, a recipe, the back of a cereal box.",
      "Read slowly, with natural expression. Let your voice rise and fall.",
      "Pause occasionally and make eye contact.",
      "No need for a baby book. The point is your voice, your prosody, and your presence.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "Continuous natural speech exposure provides the prosodic data the auditory cortex is actively seeking and storing in this period.",
    weekRecommended: 2,
  },
  {
    id: "heartbeat-settling",
    title: "Heartbeat sound settling",
    domain: "language-communication",
    subDomain: "auditory",
    ageWindowWeeks: "0–6",
    processSupported: "Auditory-somatic association; stress regulation; prenatal auditory memory",
    evidenceBasis:
      "The fetal auditory environment is dominated by maternal heartbeat and vascular sound; heartbeat-like rhythmic sounds have replicated calming effects on neonates (Salk, 1960; subsequent replications).",
    instructions: [
      "When baby is fussy but fed, changed, and held:",
      "Hold baby's left ear against your chest so they can hear your heartbeat.",
      "Or: hold baby near a ticking clock (~60–80 ticks per minute).",
      "Rock very gently and slowly.",
      "Keep ambient noise low.",
      "Works better for unsettled but not acutely distressed babies.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "Familiar prenatal sounds trigger auditory memory traces and activate calming responses — one of the earliest examples of long-term memory from in-utero experience.",
    weekRecommended: 1,
  },
  {
    id: "name-repetition",
    title: "Name repetition at close range",
    domain: "language-communication",
    subDomain: "language-exposure",
    ageWindowWeeks: "0–12",
    processSupported: "Own-name representation; auditory discrimination; social signal learning",
    evidenceBasis:
      "By 4–5 months, infants show measurable brain responses to their own name (ERP studies); this recognition is built through repeated hearing in caregiving contexts starting from birth.",
    instructions: [
      "During diaper changes, feeding, or any close-contact moment:",
      "Say baby's name clearly at the start and end of sentences.",
      "Don't overdo it — 2–3 times per interaction is plenty.",
      "Also use it when they are fussy: call their name first before picking up, to see if voice alone orients them.",
      "Keep your tone warm and your face visible when saying their name.",
    ],
    durationMinutes: 3,
    whyItWorks:
      "Repeated pairing of name with face, touch, and context begins building the neural representation that will later allow the infant to recognise their own name from across a room.",
    weekRecommended: 1,
  },
  {
    id: "hum-chest",
    title: "Hum and chest feel",
    domain: "sleep",
    subDomain: "sleep-routine",
    ageWindowWeeks: "0–8",
    processSupported: "Auditory-vibrotactile cross-modal integration; prosodic pattern exposure",
    evidenceBasis:
      "Bone conduction of sound through the chest is detectable as both auditory and vibrotactile input; cross-modal integration of sound and vibration activates overlapping cortical regions (reviewed in multisensory integration literature).",
    instructions: [
      "Hold baby against your chest, their ear pressed gently to your sternum.",
      "Hum slowly and steadily — any tune you like.",
      "Baby feels your chest vibrate AND hears the sound through your ribcage.",
      "Vary the pitch slowly up and then down.",
      "Notice if baby stills or presses closer — a sign of engagement.",
    ],
    durationMinutes: 4,
    whyItWorks:
      "Sound delivered simultaneously through air (auditory) and bone conduction (vibrotactile) activates two sensory modalities at once, exercising the cross-modal integration circuits that are building throughout this period.",
    weekRecommended: 2,
  },
  {
    id: "outdoor-listening",
    title: "Outdoor ambient listening",
    domain: "language-communication",
    subDomain: "auditory",
    ageWindowWeeks: "0–12",
    processSupported: "Auditory scene analysis; complex sound environment calibration",
    evidenceBasis:
      "The auditory cortex in the first months is calibrating to the statistical structure of sounds in its environment; varied natural acoustic environments support broader auditory scene analysis development.",
    instructions: [
      "Take baby outside or sit near an open window during a calm moment.",
      "Hold baby in a comfortable position.",
      "Just sit quietly and listen together — let natural sounds arrive: wind, birdsong, passing cars (from a distance), leaves.",
      "Softly name what you hear: 'That's a bird. That's the wind in the tree.'",
      "5–10 minutes is sufficient. Avoid very loud environments.",
    ],
    durationMinutes: 8,
    whyItWorks:
      "Real-world acoustic environments contain complex, layered sounds the brain must learn to parse — exposure to this richness supports the auditory cortex's statistical learning work.",
    weekRecommended: 4,
  },
  {
    id: "narrated-day",
    title: "The narrated day",
    domain: "language-communication",
    subDomain: "social-communication",
    ageWindowWeeks: "0–12",
    processSupported: "Language exposure; prosodic pattern absorption; social contingency learning",
    evidenceBasis:
      "Quantity of talk in the first year predicts vocabulary at age 3 (Hart & Risley, 1995). Prosodic structure — the melody and rhythm of speech — is absorbed before individual words. Infant-directed speech preferentially attended over adult-directed speech (Soderstrom, 2007; cross-cultural replications).",
    instructions: [
      "Narrate what you are doing as you do it, in a calm, slightly slower voice.",
      "'Now I'm changing your nappy — the wipe is going to be cold.'",
      "'Here comes your milk.'",
      "No need for forced cheerfulness — your natural voice and pace is what matters.",
      "Ongoing throughout the day — no special session needed.",
    ],
    durationMinutes: 0,
    whyItWorks:
      "Continuous natural speech exposure provides the prosodic data the auditory cortex is actively seeking and storing — and every response you give to baby's cues teaches them that their actions matter.",
    weekRecommended: 3,
  },

  // ── COGNITIVE ──────────────────────────────────────────────────────────────
  {
    id: "facial-expression-copying",
    title: "Facial expression copying",
    domain: "cognitive",
    subDomain: "social-cognition",
    ageWindowWeeks: "0–8",
    processSupported: "Cross-modal matching; contingency detection; early social cognition",
    evidenceBasis:
      "Neonatal imitation of facial gestures (tongue protrusion, mouth widening) was reported by Meltzoff & Moore (1977, Science); cross-modal face sensitivity is well-replicated though mechanistic interpretation remains debated.",
    instructions: [
      "Hold baby at ~20–25 cm from your face during a calm, alert period.",
      "Make eye contact.",
      "Slowly, clearly stick out your tongue — hold it for 3–4 seconds.",
      "Pull it back and wait 10–15 seconds.",
      "Watch baby's face carefully — especially mouth and tongue.",
      "In younger babies (0–4 weeks) responses may be delayed by 30+ seconds — patience is the whole skill here.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "Whether or not early imitation is true mimicry, face-to-face contingent interaction at close range activates social and visual processing circuits simultaneously.",
    weekRecommended: 4,
  },
  {
    id: "contingency-mobile",
    title: "Contingency mobile (DIY)",
    domain: "cognitive",
    subDomain: "causal-learning",
    ageWindowWeeks: "4–12",
    processSupported: "Contingency detection; early causal learning; motor-visual coupling",
    evidenceBasis:
      "Rovee-Collier's mobile studies (replicated) showed 2-month-olds learn within minutes that their leg kicks move a mobile, and remember this across days — the first robust demonstration of infant causal learning.",
    instructions: [
      "Tie 3–4 lightweight objects on strings from a horizontal stick (a ruler or wooden spoon).",
      "Hang it ~30 cm above baby's chest.",
      "Attach a long string loosely from the mobile to baby's wrist or ankle with a very loose loop — loose enough to slide off easily.",
      "When baby moves, the mobile moves.",
      "Watch for baby to notice the connection — they will often pause, then move more deliberately.",
      "IMPORTANT: Remove the string connection when the session ends. Never leave baby unattended with string attached.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "When baby discovers their movement causes the mobile to move, they are learning contingency — that their actions have effects — which is the root of intentional behaviour and early problem-solving.",
    weekRecommended: 5,
  },
  {
    id: "attention-recovery",
    title: "Attention recovery wait",
    domain: "cognitive",
    subDomain: "attention",
    ageWindowWeeks: "4–12",
    processSupported: "Self-regulation of attention; habituation and dishabituation",
    evidenceBasis:
      "When an infant looks away during interaction, this is active self-regulation — not withdrawal. Allowing recovery time then re-engaging when they return is the correct contingent response (Tronick still-face research; attention regulation literature).",
    instructions: [
      "During any face-to-face interaction, when baby breaks eye contact and looks away:",
      "Stop all stimulation — speaking, moving, touching.",
      "Wait quietly. 10–30 seconds is normal.",
      "When baby turns back toward you, resume with a warm expression.",
      "This is a skill for you, not the baby. The baby is already doing it correctly.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "Gaze aversion is the infant's primary self-regulatory tool. When caregivers wait and return, they teach the brain that the world is safe to re-engage with — foundational for attention and stress regulation.",
    weekRecommended: 4,
  },
  {
    id: "quiet-alert-observation",
    title: "Quiet alert window observation",
    domain: "cognitive",
    subDomain: "attention",
    ageWindowWeeks: "0–12",
    processSupported: "Attention system; environmental visual scanning; habituation",
    evidenceBasis:
      "Quiet alert state is the optimal state for visual processing and attention in neonates (Brazelton, 1973 — Neonatal Behavioral Assessment Scale; replicated in state-based infant research).",
    instructions: [
      "Learn to recognise the quiet alert state: eyes open and bright, body still, breathing regular, not hungry or distressed.",
      "When you see it, place baby in an infant seat or hold them reclined at 45 degrees facing a window.",
      "Do nothing else — let them look.",
      "Watch what they attend to, how long they sustain it, when they look away.",
      "After a few minutes: gently bring your face into their visual field and see if they shift attention to you.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "Environmental scanning during quiet alert state is active cognitive work — the infant's attention system is calibrating visual salience, contrast, and novelty without any additional input required.",
    weekRecommended: 2,
  },
  {
    id: "novel-object-pause",
    title: "Novel object pause",
    domain: "cognitive",
    subDomain: "attention",
    ageWindowWeeks: "6–12",
    processSupported: "Dishabituation response; novelty detection; visual memory",
    evidenceBasis:
      "Dishabituation — increased attention to a novel stimulus after habituation to a familiar one — is a foundational measure of infant memory and cognitive processing (Fantz, 1963; Sokolov habituation theory; hundreds of replications).",
    instructions: [
      "Hold one object in front of baby at ~25 cm during a quiet alert period.",
      "Hold it still and let baby look until they look away.",
      "Pause 10 seconds.",
      "Bring out a second, different object.",
      "Watch for renewed attention: wider eyes, re-engagement, possible stilling.",
      "This renewed attention to the new item is the dishabituation response — direct evidence the brain remembers what it just saw.",
    ],
    durationMinutes: 5,
    whyItWorks:
      "Renewed attention to novelty is the brain signalling 'this is new' — evidence the memory trace for the first object was encoded. You are watching memory and recognition in real time.",
    weekRecommended: 5,
  },

  // ── SLEEP & CALMING ──────────────────────────────────────────────────────
  // Wind-down and self-regulation support. Two more activities in this domain
  // live above (kept in place when re-domained): "Warm calming bath"
  // (id: water-sound-bath) and "Hum and chest feel" (id: hum-chest).
  {
    id: "infant-massage",
    title: "Bedtime massage",
    domain: "sleep",
    subDomain: "sleep-routine",
    ageWindowWeeks: "0–52",
    processSupported:
      "Parasympathetic (rest-and-digest) activation; lowered cortisol; increased vagal tone",
    evidenceBasis:
      "Slow, moderate-pressure infant massage is associated with reduced cortisol, increased parasympathetic (vagal) activity, and improved sleep onset and duration in infants. A consistent finding across infant-massage trials and reviews (e.g. Field and colleagues).",
    instructions: [
      "Warm the room and warm a little plain oil in your hands first.",
      "Work when baby is calm but awake, as part of the wind-down before sleep.",
      "Use slow, firm-but-gentle strokes — legs and feet, then arms, then tummy in a clockwise circle.",
      "Keep a steady rhythm and talk or hum quietly as you go.",
      "Watch for cues: turning away, fussing or hiccups mean stop or slow down.",
      "5–10 minutes is plenty. Keep lights low so it reads as wind-down, not play.",
    ],
    durationMinutes: 8,
    whyItWorks:
      "Slow, sustained touch activates the parasympathetic nervous system — the 'rest and digest' branch — which lowers heart rate and stress hormones and shifts the body toward sleep. Doing it at the same point each evening also makes it a predictable cue that sleep is coming.",
    weekRecommended: 2,
  },
  {
    id: "white-noise",
    title: "White noise for settling",
    domain: "sleep",
    subDomain: "sleep-environment",
    ageWindowWeeks: "0–52",
    processSupported:
      "Arousal masking; recreation of the constant intrauterine soundscape that supports sleep onset",
    evidenceBasis:
      "Continuous broadband ('white') noise masks sudden environmental sounds that would otherwise trigger arousals, and approximates the constant low-frequency sound level of the womb. Newborns exposed to white noise have been shown to fall asleep faster than those settled in quiet.",
    instructions: [
      "Use a steady, continuous white-noise sound (a dedicated machine, not a phone left within reach).",
      "Place the source across the room — at least 2 metres from baby's head, never in the cot.",
      "Keep it quiet: around the level of a soft shower, not louder than about 50 dB.",
      "Turn it on for naps and night sleep as part of the routine.",
      "Turn it off when baby is awake and alert so they still get quiet, interactive time.",
    ],
    durationMinutes: 0,
    whyItWorks:
      "A constant, featureless sound hides the abrupt noises (a door, a sibling) that jolt a light-sleeping newborn awake, and echoes the ever-present whooshing they heard in the womb. Kept low and at a distance, it soothes without risking hearing.",
    weekRecommended: 1,
  },
];

// ── Supporting content ────────────────────────────────────────────────────────

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
    a: "The key signs: stilling (baby becomes very quiet and focused), wide eyes and a gaze-lock, slowed breathing, and sustained attention. These are the 'orienting response' — the neurological signal that the brain is processing new input. Fussing, arching, and looking away mean wind it down. Both responses are useful information.",
  },
];

// NOTE: the old static WEEK_EXPECTATIONS array was removed. "What to expect this
// week" is now derived from the active milestones via getWeekExpectations() in
// milestones.ts, so it tracks the baby's age instead of showing week-1 copy.

export const WEEKLY_TIP =
  "Your baby can now focus best at 20–30 cm — exactly the distance from a cradled baby's eyes to your face while feeding.";

export const DOB = new Date(2026, 5, 9); // 9 June 2026

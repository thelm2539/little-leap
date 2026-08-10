// milestones.ts
// Primary-literature milestone data for Little Leaps.
// Source: milestone-research.md (v2, July 2026)
// Rule: no CDC/WHO/AAP summaries — primary authors only.

export type MilestoneDomain =
  | "visual"
  | "sensory"
  | "gross-motor"
  | "fine-motor"
  | "language-communication"
  | "cognitive"
  | "social"
  | "sleep";

/**
 * Whether a milestone is a capability the baby gains, or a temporary regression
 * the parent should expect and ride out.
 *
 *   'achievement' — "baby can now do X" (the default; every developmental
 *                   milestone in this file)
 *   'disruption'  — "this is temporarily harder, here's why, and it's normal"
 *                   (sleep regressions). For these, `accelerator` carries a
 *                   what-helps note rather than an ahead-of-curve signal.
 *
 * Optional: absence means 'achievement'. Read it through `milestoneKind()`.
 */
export type MilestoneKind = "achievement" | "disruption";

export interface MilestoneResource {
  title: string;
  doi: string;
}

export interface Milestone {
  id: string;
  name: string;
  domain: MilestoneDomain;
  kind?: MilestoneKind; // undefined ⇒ 'achievement'. See MilestoneKind.
  weekStart: number; // earliest onset
  weekPeak: number; // typical / mean (used for timeline placement)
  weekEnd: number; // end of window
  mechanism: string; // "What's happening"
  parentCanSee: string[]; // nested arrays - shift to separate rabltes when creating a database to hold and update milestones
  activityIds: string[];
  resources: MilestoneResource[];
  checkIn: string;
  accelerator: string;
  latestResearch: string;
}

export const MILESTONES: Milestone[] = [
  // ── PHASE 1 · Weeks 0–2 · Reflexive World ────────────────────────────────

  {
    id: "m01-face-detection",
    name: "Subcortical Face Detection",
    domain: "visual",
    weekStart: 0,
    weekPeak: 0,
    weekEnd: 2,
    mechanism:
      "A subcortical circuit (superior colliculus → pulvinar) orients the newborn toward face-like patterns from birth, before any cortical face processing is possible. Operates on coarse, high-contrast configurations at ~25 cm — phylogenetically ancient, present in chicks too.",
    parentCanSee: [
      "Gaze drifts toward your face when held at chest distance",
      "Tracks a face-like card slightly further than random patterns",
      "Calms when a face is brought close and held still",
      "Follows your face a short way as it moves from the side toward the middle",
    ],
    activityIds: ["mirror-face-time", "bw-card-gallery", "light-shadow"],
    resources: [
      {
        title: "Johnson MH (2011) — Face-sensitive cortical responses in early infancy",
        doi: "10.1080/17470218.2011.590596",
      },
      {
        title: "Johnson MH (1999) — The development of visual attention in infancy",
        doi: "10.1037/h0087301",
      },
    ],
    checkIn: "Did her gaze seem to find your face and stay there, even briefly?",
    accelerator:
      "Sustained face-fixation > 8 seconds → cortical face processing likely emerging early; move to conversation-turn and slow-face activities sooner",
    latestResearch: "Johnson MH (2011) — Face-sensitive cortical responses in early infancy",
  },

  {
    id: "m02-vestibular-dominance",
    name: "Vestibular Dominance",
    domain: "sensory",
    weekStart: 0,
    weekPeak: 0,
    weekEnd: 2,
    mechanism:
      "The vestibular system (semicircular canals + otolith organs) is functional from ~20 weeks gestation — the most developmentally mature sensory system at birth. Rhythmic movement is the most reliable arousal regulator because of this. Vision is the least mature system at birth.",
    parentCanSee: [
      "Calms within 30–60 seconds of rhythmic rocking or walking",
      "Moro reflex (full-body startle) triggered by sudden vestibular displacement",
      "Settles more reliably in vertical carry than horizontal hold",
    ],
    activityIds: ["sway-narrate", "varied-carrying", "skin-to-skin"],
    resources: [
      {
        title: "Deng W et al. (2025) — Vestibular contributions to infant postural control",
        doi: "10.1097/PEP.0000000000001187",
      },
      {
        title: "Anderson J (1986) — Sensory intervention with the preterm infant",
        doi: "10.5014/ajot.40.1.19",
      },
    ],
    checkIn:
      "How quickly did she calm when you started swaying — under 1 minute, 1–3 minutes, or longer?",
    accelerator:
      "Calms in < 30 seconds consistently → vestibular regulation maturing ahead of curve",
    latestResearch: "Deng W et al. (2025) — Vestibular contributions to infant postural control",
  },

  {
    id: "m03-prenatal-auditory-memory",
    name: "Prenatal Auditory Memory",
    domain: "language-communication",
    weekStart: 0,
    weekPeak: 0,
    weekEnd: 2,
    mechanism:
      "Auditory cortex processes speech-like signals from ~28 weeks gestation. By birth the infant has prosodic templates of the caregiver's voice and native language rhythm. This is recall, not learning. From soon after birth, babies also make small pre-speech lip and tongue movements when you talk to them.",
    parentCanSee: [
      "Preferential turning toward mother's voice over a stranger's",
      "Stills or quiets to familiar songs and voices",
      "Subtle orienting to familiar language vs. foreign language",
      "Pre-speech lip and tongue movements when caregiver talks",
    ],
    activityIds: ["same-song", "heartbeat-settling", "hum-chest"],
    resources: [
      {
        title:
          "Kuhl PK et al. (2011) — Early language acquisition: neural substrates and theoretical models",
        doi: "10.1111/j.1467-7687.2010.00973.x",
      },
    ],
    checkIn:
      "Did she seem to respond differently to this song vs. a new one — stilling, turning, or changing expression?",
    accelerator:
      "Consistent orienting to voice at > 30 cm distance → auditory localisation ahead of curve",
    latestResearch:
      "Kuhl PK et al. (2011) — Early language acquisition: neural substrates and theoretical models",
  },

  // ── PHASE 2 · Weeks 2–6 · First Alertness ────────────────────────────────

  {
    id: "m04-quiet-alert-state",
    name: "Quiet Alert State Lengthening",
    domain: "cognitive",
    weekStart: 2,
    weekPeak: 3,
    weekEnd: 6,
    mechanism:
      "The quiet alert state (eyes open, body still, cortex maximally receptive) lengthens from < 5 minutes at birth to 20–45+ minutes by week 6. All cortical learning depends on catching these windows. Duration increasing week-on-week is itself the milestone.",
    parentCanSee: [
      "Periods of calm, wide-eyed wakefulness without crying or feeding",
      "Scanning the room or your face with apparent interest",
      "Alert duration visibly longer than last week",
    ],
    activityIds: ["quiet-alert-observation", "mirror-face-time", "bw-card-gallery"],
    resources: [
      {
        title: "Adolph KE & Franchak JM (2017) — The development of motor behavior",
        doi: "10.1002/wcs.1430",
      },
    ],
    checkIn:
      "How long was this quiet alert window — under 10 minutes, 10–30 minutes, or over 30 minutes?",
    accelerator:
      "Alert windows > 30 minutes before week 4 → contingency detection (M08) likely accessible earlier",
    latestResearch: "Adolph KE & Franchak JM (2017) — The development of motor behavior",
  },

  {
    id: "m05-palmar-tactile-reflex",
    name: "Palmar & Tactile Reflex Integration",
    domain: "sensory",
    weekStart: 2,
    weekPeak: 4,
    weekEnd: 8,
    mechanism:
      "The palmar grasp reflex (present at birth) is subcortical. Around weeks 4–8, cortical motor pathways begin modulating it — the first step toward voluntary grasping. Each reflex activation fires a cortical-subcortical circuit. Texture stimulation activates mechanoreceptors (Meissner's, Pacinian) calibrating the somatosensory cortex.",
    parentCanSee: [
      "Reflexive grip when finger placed in palm",
      "Variable grip strength — sometimes firm, sometimes releases quickly",
      "The grip is automatic — not yet a deliberate choice",
      "Different facial reactions to different textures",
    ],
    activityIds: ["palmar-grasp", "cloth-texture", "scent-pairing"],
    resources: [
      {
        title:
          "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
        doi: "10.1146/annurev-psych-010418-102836",
      },
    ],
    checkIn:
      "When you placed your finger in her palm, did she grip it firmly and hold — or was it brief and loose?",
    accelerator:
      "Strong sustained grip > 5 seconds before week 4 → corticospinal pathway maturation ahead of curve",
    latestResearch:
      "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
  },

  {
    id: "m06-social-smile",
    name: "Social Smile Emergence",
    domain: "social",
    weekStart: 4,
    weekPeak: 6,
    weekEnd: 10,
    mechanism:
      "The endogenous social smile marks the onset of cortical engagement with social stimuli. Prior smiles (weeks 0–4) are subcortical/REM-associated. The genuine social smile requires face recognition + cortically mediated positive affect — it's the first reliable signal that the cortical face network is coming online.",
    parentCanSee: [
      "Smile specifically in response to your face (not a bright light or random stimulus)",
      "Smile with eye contact, sometimes accompanied by vocalisation",
      "Smile can be elicited repeatedly in the same interaction",
      "Expression still vague around 1 month, progressing to a true social smile at about 5–6 weeks",
    ],
    activityIds: ["slow-face", "conversation-turn", "mirror-face-time"],
    resources: [
      {
        title: "Johnson MH (2011) — Face-sensitive cortical responses in early infancy",
        doi: "10.1080/17470218.2011.590596",
      },
    ],
    checkIn:
      "Did she smile back at your face — a real smile, not just a grimace? Did she make eye contact while doing it?",
    accelerator:
      "Social smile reliably before week 5 → unlock conversation-turn and facial-expression-copying activities earlier",
    latestResearch: "Johnson MH (2011) — Face-sensitive cortical responses in early infancy",
  },

  // ── PHASE 3 · Weeks 6–12 · Visual & Motor Awakening ─────────────────────

  {
    id: "m07-smooth-pursuit",
    name: "Smooth Pursuit Emerges",
    domain: "visual",
    weekStart: 6,
    weekPeak: 8,
    weekEnd: 10,
    mechanism:
      "Prior to ~6–8 weeks, visual tracking is saccadic (jerky catch-up movements). Smooth pursuit requires cortical involvement (frontal eye fields + MT/V5). Tracking widens with age — a short arc around 1 month, extending to follow an object across the midline both horizontally and vertically by about 3 months. A defensive blink is clearly present by 6–8 weeks.",
    parentCanSee: [
      "Eyes follow a slow-moving object continuously, not in jumps",
      "Tracks past the body midline (earlier tracking stops at midline)",
      "Brief tracking (2–3 seconds) at first, extending with age",
      "Eyes come together (converge) as a toy approaches the face — around 3 months",
    ],
    activityIds: ["object-tracking", "light-shadow", "sway-narrate"],
    resources: [
      {
        title: "Johnson MH (2011) — Face-sensitive cortical responses in early infancy",
        doi: "10.1080/17470218.2011.590596",
      },
    ],
    checkIn:
      "Did her eyes follow the toy smoothly as you moved it — or did her gaze jump to catch up with it?",
    accelerator: "Tracks past midline before week 7 → unlock novel-object-pause activity earlier",
    latestResearch: "Johnson MH (2011) — Face-sensitive cortical responses in early infancy",
  },

  {
    id: "m08-contingency-detection",
    name: "Contingency Detection",
    domain: "cognitive",
    weekStart: 8,
    weekPeak: 10,
    weekEnd: 12,
    mechanism:
      "The infant discovers that their own action causes an effect. Rovee-Collier's mobile studies: 3-month-olds learn within ~9 minutes that kicking moves a mobile, retain this for 3 days, and show specificity (only the same mobile cues retrieval). This is the root of intentional behaviour, agency, and problem-solving. Memory retention doubles by 6 months (14 days).",
    parentCanSee: [
      "Increased kicking or arm movements when a hanging toy responds",
      "Pause-and-watch when the contingency stops unexpectedly",
      "Visible excitement (increased motor activity) when cause-effect is active",
      "Frustration or disengagement if contingency is removed",
    ],
    activityIds: ["contingency-mobile", "attention-recovery", "quiet-alert-observation"],
    resources: [
      {
        title:
          "Hill WL, Borovsky D & Rovee-Collier C (1988) — Continuities in infant memory development",
        doi: "10.1002/dev.420210104",
      },
      {
        title: "Rovee-Collier C et al. (1985) — Reactivation of infant memory",
        doi: "10.1002/dev.420180611",
      },
    ],
    checkIn:
      "Did she seem to notice when the mobile moved? Did she kick more, then look to see the effect?",
    accelerator:
      "Clear cause-effect excitement before week 10 → unlock novel-object-pause; advance cognitive timeline by 1 week",
    latestResearch:
      "Hill WL, Borovsky D & Rovee-Collier C (1988) — Continuities in infant memory development",
  },

  {
    id: "m09-head-control",
    name: "Neck Extension & Head Control",
    domain: "gross-motor",
    weekStart: 4,
    weekPeak: 8,
    weekEnd: 12,
    mechanism:
      "Head control is the postural foundation for everything downstream (Adolph's cascade thesis). The typical progression: around 1 month the head turns to the side when lying on the tummy, arms and legs flexed; by ~3 months baby lifts head and upper chest on the forearms; by ~6 months lifts head and chest on extended arms with flat palms. The forearms→extended arms transition is the key 3-to-6-month marker.",
    parentCanSee: [
      "Briefly lifts head (1–2 seconds) when prone (from birth)",
      "Head bobbing when held upright — attempting but losing control",
      "Sustained head lift (3+ seconds) — milestone achieved",
      "Forearm-supported lift at 3 months → extended-arm push-up by 6 months",
    ],
    activityIds: ["tummy-time-chest", "sway-narrate", "joint-compression", "limb-movement"],
    resources: [
      {
        title:
          "Adolph KE & Hoch JE (2020) — Motor skill learning: to generalize or not to generalize",
        doi: "10.1159/000511511",
      },
      {
        title:
          "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
        doi: "10.1146/annurev-psych-010418-102836",
      },
    ],
    checkIn:
      "Did she lift her head at all? If yes — briefly (under 3 seconds), for a few seconds, or held it up? Was she resting on her forearms or pushing up on her hands?",
    accelerator:
      "Sustained 3-second hold before week 7, or pushing up on extended arms before week 12 → motor cascade accelerating; suggest varied-carrying progression sooner",
    latestResearch:
      "Adolph KE & Hoch JE (2020) — Motor skill learning: to generalize or not to generalize",
  },

  // ── PHASE 4 · Weeks 12–20 · Reaching & Language Emergence ───────────────

  {
    id: "m10-reach-to-grasp",
    name: "Reach-to-Grasp Precursors",
    domain: "fine-motor",
    weekStart: 10,
    weekPeak: 13,
    weekEnd: 16,
    mechanism:
      "Reaching requires integrating visual information (where is the object?) with proprioceptive information (where is my hand?) — a visuomotor calibration problem the brain solves over weeks. Hand regard appears around 3 months (baby watches their own hands), with two-handed reaching by about weeks 16–18. Each reach provides error-correction data — motor and perceptual learning happen simultaneously.",
    parentCanSee: [
      "Hand regard (around 3 months): watches their own hand movements, opens and closes fingers",
      "Arm swipes toward hanging objects — not yet grabbing",
      "Hand-to-mouth that seems volitional (not just reflex)",
      "Around 6 months: a two-handed scooping approach; adjusts hand orientation to match an object's shape",
    ],
    activityIds: ["cloth-texture", "limb-movement", "novel-object-pause"],
    resources: [
      {
        title: "Adolph KE & Franchak JM (2017) — The development of motor behavior",
        doi: "10.1002/wcs.1430",
      },
      {
        title:
          "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
        doi: "10.1146/annurev-psych-010418-102836",
      },
    ],
    checkIn: "Did she reach toward or bat at the fabric, or were her movements near the object?",
    accelerator:
      "Intentional contact grasp before week 12 → visuomotor integration accelerated; advance contingency-mobile complexity",
    latestResearch: "Adolph KE & Franchak JM (2017) — The development of motor behavior",
  },

  {
    id: "m11-cooing",
    name: "Cooing & Protoconversations",
    domain: "language-communication",
    weekStart: 6,
    weekPeak: 8,
    weekEnd: 12,
    mechanism:
      "Cooing is the first volitional vocalisation — larynx, velum, and tongue produce vowel-like sounds under cortical control. By around 3 months, vocalisations are woven together with smiles, eye contact and hand gestures during turn-taking exchanges ('protoconversations') — the full multimodal communication scaffold is in place by 3 months, not 6.",
    parentCanSee: [
      'Open-vowel sounds ("aaah", "ooh") in response to interaction',
      "Back-and-forth vocal exchange with turn-taking structure emerging",
      "Vocalisations while looking at your face — gaze + voice together",
      "Pre-speech lip and tongue movements when you talk to them (from around 1 month)",
    ],
    activityIds: ["conversation-turn", "reading-aloud", "narrated-day", "name-repetition"],
    resources: [
      {
        title: "Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness",
        doi: "10.3390/ijerph19031180",
      },
    ],
    checkIn:
      'Did she make any sounds back at you — even a small "ooh" or sigh — during the pauses? Did she look at your face while doing it?',
    accelerator:
      "Clear vocal turn-taking (waits, then vocalises) before week 10 → language circuit accelerating; advance voice-mapping and name-repetition",
    latestResearch:
      "Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness",
  },

  {
    id: "m17-rolling",
    name: "Rolling",
    domain: "gross-motor",
    weekStart: 20,
    weekPeak: 22,
    weekEnd: 28,
    mechanism:
      "Rolling is the first major self-generated locomotion — before crawling, the infant can change their own position and orientation. Front-to-back uses the extensor muscles trained by tummy time and emerges first; back-to-front requires oblique abdominal strength and rotation. Typically, rolling front-to-back appears at ~5–6 months and back-to-front at ~6–7 months.",
    parentCanSee: [
      "First rolls front-to-back (prone to supine) — often surprises them",
      "Then back-to-front (supine to prone) — requires intentional trunk rotation",
      "Using rolling to move across the floor (earliest locomotion)",
      "Safety signal: may roll off surfaces if unsupervised from this point",
    ],
    activityIds: ["tummy-time-chest", "varied-carrying", "limb-movement"],
    resources: [
      {
        title:
          "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
        doi: "10.1146/annurev-psych-010418-102836",
      },
    ],
    checkIn: "Did she roll at all during or after tummy time — even a partial roll to her side?",
    accelerator:
      "Rolling front-to-back before week 20 → trunk rotation ahead of curve; pulling-to-sit and sitting likely to follow sooner",
    latestResearch:
      "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
  },

  // ── PHASE 5 · Weeks 20–36 · Sitting, Grasping, Object Permanence ─────────

  {
    id: "m18-fine-motor-sequence",
    name: "Fine Motor: Palmar → Inferior → Neat Pincer",
    domain: "fine-motor",
    weekStart: 20,
    weekPeak: 24,
    weekEnd: 52,
    mechanism:
      "Fine motor follows a proximal-to-distal sequence — shoulder before elbow, elbow before wrist, wrist before finger differentiation. Each stage requires new corticospinal myelination. The neat pincer (thumb tip to index tip) marks the emergence of the uniquely human capacity for fine manipulation. This trajectory unfolds in well-documented stages around 6, 9, and 12 months.",
    parentCanSee: [
      "Stage 1 — Palmar grasp (wks 20–24): whole-hand closure; passes a toy hand to hand; adjusts wrist to object orientation (~6 months)",
      "Stage 2 — Inferior pincer (wks 32–36): lateral thumb-to-finger; pokes with the index finger; grasps a string to pull a toy (~9 months)",
      "Stage 3 — Neat pincer (wks 44–52): tip-to-tip opposition; the hand pre-shapes before contact; points with the index finger (~12 months)",
    ],
    activityIds: ["palmar-grasp", "cloth-texture", "novel-object-pause", "limb-movement"],
    resources: [
      {
        title:
          "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
        doi: "10.1146/annurev-psych-010418-102836",
      },
    ],
    checkIn:
      "Did she pick up the object with her whole hand — or trying to use just her finger and thumb?",
    accelerator:
      "Index finger isolation (poking behaviour) before week 30 → fine motor ahead of curve; introduce smaller objects and containers",
    latestResearch:
      "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
  },

  {
    id: "m12-sitting-with-support",
    name: "Sitting With Support",
    domain: "gross-motor",
    weekStart: 16,
    weekPeak: 20,
    weekEnd: 24,
    mechanism:
      "Sitting requires continuous anticipatory and reactive postural adjustments — trunk and neck extensors working together dynamically. It radically changes the infant's visual world (upright perspective) and frees both hands for object exploration. Adolph: sitting is a major developmental unlock — object manipulation and social interaction both expand dramatically.",
    parentCanSee: [
      "Holds sitting with light trunk support for > 10 seconds",
      "Head stays upright during supported sitting",
      "Reaches for objects while sitting — arms and hands now both free",
      "Around 6 months: can turn the body to look sideways and stretch out to pick up a toy from the floor without losing balance",
    ],
    activityIds: ["varied-carrying", "joint-compression", "cloth-texture"],
    resources: [
      {
        title:
          "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
        doi: "10.1146/annurev-psych-010418-102836",
      },
      {
        title:
          "Adolph KE & Hoch JE (2020) — Motor skill learning: to generalize or not to generalize",
        doi: "10.1159/000511511",
      },
    ],
    checkIn:
      "During supported sitting, how long before she toppled — under 5 seconds, 5–15 seconds, or held for longer?",
    accelerator:
      "Stable sitting with minimal support before week 20 → accelerate object manipulation activities",
    latestResearch:
      "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
  },

  {
    id: "m13-phoneme-narrowing",
    name: "Phoneme Narrowing Sensitive Period",
    domain: "language-communication",
    weekStart: 24,
    weekPeak: 28,
    weekEnd: 52,
    mechanism:
      'From ~6 months, the auditory cortex commits to native language phoneme categories — improving native contrasts, losing sensitivity to non-native ones. Measurable in theta-band auditory sampling on MEG. This is Kuhl\'s most robust finding and the most time-sensitive window in the 0–12 month period. By around 9 months, expect canonical babbling strings like "dad-dad", "mum-mum", "agaga", plus understanding of "no" and their own name.',
    parentCanSee: [
      "Responds to own name from across a room (~6 months)",
      'Canonical babbling begins: "ba-ba", "ma-ma" — not yet meaningful',
      'Around 6 months: single and double syllables — "muh", "goo", "der", "adah"',
      "Around 9 months: long repetitive strings of syllables; imitates playful sounds",
    ],
    activityIds: [
      "reading-aloud",
      "narrated-day",
      "same-song",
      "name-repetition",
      "outdoor-listening",
    ],
    resources: [
      {
        title: "Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness",
        doi: "10.3390/ijerph19031180",
      },
      {
        title: "Conboy BT & Kuhl PK (2011) — Early language experience affects neural activity",
        doi: "10.1111/j.1467-7687.2010.00973.x",
      },
    ],
    checkIn: "Did she vocalise back, or watch your mouth intently while you were reading?",
    accelerator:
      "Canonical babbling before week 24 → language circuit ahead of curve; increase variety and complexity of language exposure",
    latestResearch:
      "Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness",
  },

  {
    id: "m14-object-permanence",
    name: "Object Permanence Precursors",
    domain: "cognitive",
    weekStart: 20,
    weekPeak: 22,
    weekEnd: 32,
    mechanism:
      "At 3 months, infant memory is context-dependent (only the same mobile reactivates it). By 6 months, memory is more generalised and durable (14-day retention). Object permanence builds on this improving memory system. Typical stages: around 6 months baby searches vaguely when a toy falls; around 9 months finds a partially hidden toy; around 12 months quickly finds a fully hidden toy and looks to an adult afterwards.",
    parentCanSee: [
      "Around 6 months: watches where a toy falls, searching vaguely when it drops out of view",
      "Around 9 months: finds a toy partially hidden under a cover or cup",
      "Around 12 months: quickly finds a toy hidden from view; looks to an adult after finding it",
      "Anticipates the return of a hidden face (peek-a-boo engagement)",
    ],
    activityIds: ["novel-object-pause", "contingency-mobile", "attention-recovery"],
    resources: [
      {
        title: "Rovee-Collier C et al. (1985) — Reactivation of infant memory",
        doi: "10.1002/dev.420180611",
      },
    ],
    checkIn:
      "When you covered the toy briefly, did she look toward where it had been — or immediately look away?",
    accelerator:
      "Consistent search for hidden objects before week 24 → object permanence ahead of curve",
    latestResearch: "Rovee-Collier C et al. (1985) — Reactivation of infant memory",
  },

  {
    id: "m19-stranger-anxiety",
    name: "Stranger Anxiety & Social Referencing",
    domain: "social",
    weekStart: 28,
    weekPeak: 32,
    weekEnd: 44,
    mechanism:
      "Stranger anxiety marks a cognitive leap: the infant has built a detailed mental model of familiar faces, so any non-matching face triggers a distinct response. Social referencing (using caregiver's expression to assess novel situations) emerges slightly later and is more sophisticated — the infant borrows the parent's emotional judgment. Both are healthy markers of attachment and cognitive development.",
    parentCanSee: [
      "Stage 1 (wks 28–32): occasional shyness when strangers approach too closely or abruptly",
      "Stage 2 (wks 32–40): clearly distinguishes strangers from familiars; clings to a known person; hides the face (~9 months)",
      "Stage 3 (wks 36–44): social referencing — looks to caregiver's face before approaching novel object or situation",
      "Important: intensity varies widely by temperament; not a problem to fix, evidence of healthy attachment",
    ],
    activityIds: ["slow-face", "conversation-turn", "outdoor-listening", "novel-object-pause"],
    resources: [
      {
        title:
          "Reddy V et al. (1997) — Communication in infancy: mutual regulation of affect and attention",
        doi: "10.1017/CBO9780511752773",
      },
    ],
    checkIn:
      "Before touching something new or uncertain today, did she look at your face first — as if checking how you felt about it?",
    accelerator:
      "Clear social referencing (look-back before novel approach) before week 36 → triadic social cognition developing rapidly; proto-declarative pointing likely to emerge sooner",
    latestResearch:
      "Reddy V et al. (1997) — Communication in infancy: mutual regulation of affect and attention",
  },

  // ── PHASE 6 · Weeks 36–52 · Standing, First Words, Intentionality ─────────

  {
    id: "m15-pulling-to-stand",
    name: "Pulling to Stand",
    domain: "gross-motor",
    weekStart: 32,
    weekPeak: 38,
    weekEnd: 44,
    mechanism:
      "Standing requires solving a new balance problem — centre of mass over a narrow base, high above the ground. Adolph: this is active problem-solving; infants repeatedly try, fail, adjust, try again. Cultural practices (walkers vs. floor play) significantly affect timing. By around 9 months, baby pulls to standing and holds on for a few moments, but cannot yet lower themselves and tends to fall backwards with a bump.",
    parentCanSee: [
      "Pulls to stand holding furniture or your hands",
      "Stands briefly before sitting back down (or falling)",
      '"Bouncing" at standing — exploratory weight-shifting',
      "Cruising: side-stepping while holding furniture",
    ],
    activityIds: ["varied-carrying", "joint-compression"],
    resources: [
      {
        title:
          "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
        doi: "10.1146/annurev-psych-010418-102836",
      },
    ],
    checkIn: "Did she try to pull herself upright on anything today — your hands, furniture, you?",
    accelerator:
      "Pulling to stand before week 32 → locomotion cascade (cruising, first steps) ahead of curve",
    latestResearch:
      "Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling",
  },

  {
    id: "m16-first-words",
    name: "First Words & Joint Attention",
    domain: "language-communication",
    weekStart: 40,
    weekPeak: 50,
    weekEnd: 56,
    mechanism:
      'First words emerge as phoneme narrowing matures. "Words" at this stage are context-dependent sound-meaning pairings. By around 12 months, babble takes on conversational cadences (jargon) — intonationally correct babble that precedes real words; comprehension runs ahead of production by 4–8 weeks. Proto-declarative pointing ("points to an object then looks back to the adult") is one of the most predictive early-language markers.',
    parentCanSee: [
      'Consistent sound-meaning pairing in context ("ba" for bottle)',
      "Proto-declarative pointing: points at something and looks back at you for a reaction",
      "Around 12 months: follows an adult's gaze (joint visual attention)",
      "Around 12 months: coordinated joint attention — actively switches between an object and the adult",
    ],
    activityIds: ["name-repetition", "narrated-day", "reading-aloud", "conversation-turn"],
    resources: [
      {
        title: "Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness",
        doi: "10.3390/ijerph19031180",
      },
    ],
    checkIn:
      "Did she use any consistent sound for a specific thing today? Or point at something and look back at you to check your reaction?",
    accelerator:
      "Consistent name-sound pairing before week 40 → first words ahead of curve; increase naming and referential activities",
    latestResearch:
      "Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness",
  },

  // ── SLEEP & CALMING ───────────────────────────────────────────────────────
  // Sleep markers. One achievement (circadian onset) and two disruptions
  // (regressions). For disruptions, `accelerator` carries a what-helps note
  // rather than an ahead-of-curve signal — see MilestoneKind.
  //
  // ⚠️ SOURCES: the DOIs below are placeholders ('verify'). The citations are
  // real works, but the DOI strings must be confirmed against the source before
  // publishing — they were NOT auto-verified. The contested "Wonder Weeks"
  // recurring fussy-period construct was deliberately excluded on evidence
  // grounds (see BACKLOG / chat history).

  {
    id: "s01-circadian-onset",
    name: "Circadian Rhythm Onset",
    domain: "sleep",
    kind: "achievement",
    weekStart: 6,
    weekPeak: 10,
    weekEnd: 16,
    mechanism:
      'A newborn has no internal day/night clock — sleep is distributed evenly around the clock in ~3–4 hour bouts. Between roughly weeks 6 and 12 an endogenous circadian rhythm emerges: melatonin secretion and the core body-temperature rhythm begin cycling with the 24-hour day, driven by regular light/dark and feeding cues. Night sleep starts to consolidate into longer stretches and daytime alertness lengthens. This is the biological basis of "sleeping through" later on.',
    parentCanSee: [
      "Longer unbroken stretches of sleep at night than during the day",
      "More consistent, longer alert periods in daylight",
      "Earlier and more predictable evening settling",
      "A dawning difference between night feeds (quiet, brief) and day feeds (alert)",
    ],
    activityIds: ["water-sound-bath", "white-noise", "hum-chest"],
    resources: [
      { title: "Rivkees SA (2003) — Developing circadian rhythmicity in infants", doi: "verify" },
      {
        title:
          "McGraw K, Hoffmann R, Harker C & Herman JH (1999) — The development of circadian rhythms in a human infant",
        doi: "verify",
      },
    ],
    checkIn:
      "Is she starting to sleep a noticeably longer stretch at night than in any single daytime nap?",
    accelerator:
      "Bright light and activity by day, dark and calm by night, plus a consistent wind-down (bath → massage → feed) accelerates this rhythm. Avoid stimulating light at night feeds.",
    latestResearch: "Rivkees SA (2003) — Developing circadian rhythmicity in infants",
  },

  {
    id: "s02-four-month-regression",
    name: 'Sleep-Cycle Maturation (the "4-month regression")',
    domain: "sleep",
    kind: "disruption",
    weekStart: 12,
    weekPeak: 16,
    weekEnd: 22,
    mechanism:
      'Around 3–4 months, sleep architecture matures from the newborn two-state pattern (active vs quiet sleep) into adult-like cycles with distinct NREM stages and REM. Cycles are short (~35–50 minutes) and the baby now briefly surfaces toward waking at the end of each one. This is a permanent developmental gain, not a true "regression" — but because the baby wakes between cycles and has not yet learned to resettle unaided, night wakings and short naps suddenly increase. It typically eases as self-settling develops.',
    parentCanSee: [
      "A sudden increase in night wakings after a period of longer sleep",
      "Naps shortening to a single sleep cycle (~35–45 minutes)",
      "Waking fully between cycles and needing help to resettle",
      "Often coincides with new alertness, rolling attempts and more feeding",
    ],
    activityIds: ["white-noise", "infant-massage", "water-sound-bath"],
    resources: [
      {
        title:
          "de Weerd AW & van den Bossche RAS (2003) — The development of sleep during the first months of life",
        doi: "verify",
      },
      {
        title:
          "Grigg-Damberger MM (2016) — The visual scoring of sleep in infants 0 to 2 months of age",
        doi: "verify",
      },
    ],
    checkIn:
      "Have the night wakings increased recently even though nothing else obvious changed — teething, illness, feeding?",
    accelerator:
      "What helps: keep the wind-down routine consistent, use white noise across sleep cycles, and give a beat before responding to a stir so she has room to resettle herself. This is a phase — it passes as self-settling matures.",
    latestResearch:
      "de Weerd AW & van den Bossche RAS (2003) — The development of sleep during the first months of life",
  },

  {
    id: "s03-eight-month-disruption",
    name: "Eight-Month Sleep Disruption",
    domain: "sleep",
    kind: "disruption",
    weekStart: 32,
    weekPeak: 36,
    weekEnd: 44,
    mechanism:
      "A convergence of developmental gains disrupts sleep around 8–10 months. Object permanence (M14) now means the baby knows you still exist when you leave — so bedtime separation is protested. Separation anxiety peaks in the same window. Simultaneously, major motor skills (crawling, pulling to stand) are being consolidated, and the brain rehearses them during sleep, driving wakings and practice in the cot. Naps are often dropping from three to two. None of it is a step backward — it is several forward steps landing at once.",
    parentCanSee: [
      "New resistance and clinginess at bedtime and on waking",
      "Waking in the night and calling specifically for you, not just fussing",
      "Practising crawling or standing in the cot instead of settling",
      "Fought or shortened naps as a nap transition approaches",
    ],
    activityIds: ["hum-chest", "infant-massage", "water-sound-bath"],
    resources: [
      {
        title:
          "Scher A (2005) — Infant sleep at 10 months of age as a window to cognitive development",
        doi: "verify",
      },
      {
        title:
          "Atkinson E, Vetere A & Grayson K (1995) — Separation anxiety and night waking in infancy",
        doi: "verify",
      },
    ],
    checkIn:
      "Is the bedtime resistance new, and does it come with more daytime clinginess or separation upset?",
    accelerator:
      'What helps: a predictable, unhurried bedtime routine; brief reassuring check-ins rather than long interventions; and plenty of daytime practice of the new motor skill so it is less "rehearsed" at night. Eases as separation anxiety settles.',
    latestResearch:
      "Scher A (2005) — Infant sleep at 10 months of age as a window to cognitive development",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

/** Returns the baby's age in whole weeks from their birth date string (ISO format). */
export function getBabyAgeWeeks(birthDateIso: string): number {
  const birth = new Date(birthDateIso);
  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  return Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)));
}

/** Display name for each domain. */
export const DOMAIN_LABELS: Record<MilestoneDomain, string> = {
  visual: "Visual",
  sensory: "Sensory",
  "gross-motor": "Gross Motor",
  "fine-motor": "Fine Motor",
  "language-communication": "Language",
  cognitive: "Cognitive",
  social: "Social",
  sleep: "Sleep & Calming",
};

/** Read a milestone's kind, defaulting to 'achievement' when unset. */
export function milestoneKind(m: Milestone): MilestoneKind {
  return m.kind ?? "achievement";
}

/**
 * CSS custom property reference for each domain colour.
 * Use as: style={{ backgroundColor: DOMAIN_CSS_VAR[domain] }}
 * This is more reliable than dynamic Tailwind class names at build time.
 */
export const DOMAIN_CSS_VAR: Record<MilestoneDomain, string> = {
  visual: "var(--domain-visual)",
  sensory: "var(--domain-sensory)",
  "gross-motor": "var(--domain-gross-motor)",
  "fine-motor": "var(--domain-fine-motor)",
  "language-communication": "var(--domain-language-communication)",
  cognitive: "var(--domain-cognitive)",
  social: "var(--domain-social)",
  sleep: "var(--domain-sleep)",
};

// ── Milestone / activity helpers ──────────────────────────────────────────────

/**
 * The milestones whose window is open during `week` (weekStart <= week <= weekEnd),
 * in milestone-array order. This is the same "active" test the timeline and the
 * activity list use, so anything derived from it stays consistent with them.
 */
export function getMilestonesForWeek(week: number): Milestone[] {
  return MILESTONES.filter((m) => m.weekStart <= week && week <= m.weekEnd);
}

/**
 * Active milestones for `week`, grouped by domain in a fixed display order.
 * Domains with no active milestone are omitted. Used by the "What to expect this
 * week" summary so it reflects the current age instead of static copy.
 */
export function getWeekExpectations(
  week: number,
): { domain: MilestoneDomain; milestones: Milestone[] }[] {
  const order: MilestoneDomain[] = [
    "gross-motor",
    "fine-motor",
    "sensory",
    "visual",
    "language-communication",
    "cognitive",
    "social",
    "sleep",
  ];
  const active = getMilestonesForWeek(week);
  return order
    .map((domain) => ({ domain, milestones: active.filter((m) => m.domain === domain) }))
    .filter((g) => g.milestones.length > 0);
}

/**
 * All activity IDs referenced by milestones that are active during `week`.
 * "Active" = weekStart <= week <= weekEnd.
 * Returned in milestone order, deduplicated.
 * Used by: This Week tab (activity list), Home page (today's activities).
 */
export function getActivitiesForWeek(week: number): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const m of MILESTONES) {
    if (m.weekStart <= week && week <= m.weekEnd) {
      for (const id of m.activityIds) {
        if (!seen.has(id)) {
          seen.add(id);
          ids.push(id);
        }
      }
    }
  }
  return ids;
}

/**
 * Count of activities being introduced for the first time this week.
 * "New" = appears in a milestone starting at `week` AND was not already
 * active from a milestone that started before `week`.
 * Returns 0 for weeks where no new milestone window opens — accurate and expected.
 */
export function getNewActivityCount(week: number): number {
  // Activities already active from prior milestone windows
  const priorIds = new Set<string>();
  for (const m of MILESTONES) {
    if (m.weekStart < week && m.weekEnd >= week) {
      for (const id of m.activityIds) priorIds.add(id);
    }
  }
  // Activities in milestones that START this week, minus those already active
  const newIds = new Set<string>();
  for (const m of MILESTONES) {
    if (m.weekStart === week) {
      for (const id of m.activityIds) {
        if (!priorIds.has(id)) newIds.add(id);
      }
    }
  }
  return newIds.size;
}

/**
 * A one-line parent-facing tip for the current week.
 * Picks the milestone whose peak is closest to `week` and uses its first
 * observable sign, so the tip tracks the baby's actual developmental moment.
 */
export function getWeekTip(week: number): string {
  const active = MILESTONES.filter((m) => m.weekStart <= week && week <= m.weekEnd);
  if (active.length === 0) {
    return "Keep following your baby's cues — every week brings something new.";
  }
  // Prefer the milestone peaking closest to now
  const relevant = [...active].sort(
    (a, b) => Math.abs(a.weekPeak - week) - Math.abs(b.weekPeak - week),
  )[0];
  const sign = relevant.parentCanSee[0];
  if (!sign) return "Keep following your baby's cues this week.";
  return `This week: ${sign.charAt(0).toLowerCase()}${sign.slice(1)}`;
}

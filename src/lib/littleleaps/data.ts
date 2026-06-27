export type Domain = "sensory-motor" | "language" | "cognitive";

export interface Source {
  citation: string;
  url: string;
}

export interface Activity {
  id: string;
  title: string;
  domain: Domain;
  ageWindowWeeks: string;
  processSupported: string;
  evidenceBasis: string;
  instructions: string[];
  durationMinutes: number;
  whyItWorks: string;
  weekRecommended: number;
  sources: Source[];
  shortTermBenefits: string[];
  longTermBenefits: string[];
}

export const DOMAIN_LABEL: Record<Domain, string> = {
  "sensory-motor": "Sensory & Motor",
  language: "Language & Communication",
  cognitive: "Cognitive",
};

export const DOMAIN_DOT: Record<Domain, string> = {
  "sensory-motor": "bg-domain-sensorimotor",
  language: "bg-domain-language",
  cognitive: "bg-domain-cognitive",
};

export const DOMAIN_BADGE: Record<Domain, string> = {
  "sensory-motor":
    "bg-domain-sensorimotor/15 text-domain-sensorimotor border-domain-sensorimotor/30",
  language: "bg-domain-language/15 text-domain-language border-domain-language/30",
  cognitive: "bg-domain-cognitive/20 text-domain-cognitive border-domain-cognitive/40",
};

export function formatDuration(minutes: number): string {
  if (minutes === 0) return "Ongoing";
  return `${minutes} min`;
}

export const ACTIVITIES: Activity[] = [
  {
    id: "mirror-face-time",
    title: "Mirror face time",
    domain: "sensory-motor",
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
    sources: [],
    shortTermBenefits: [
      "Provides a high-contrast face-like image at baby's optimal focal range",
      "Activates developing face-detection circuits in visual cortex",
      "Sustained looking is direct evidence of active visual processing",
    ],
    longTermBenefits: [
      "Early face-processing experience supports the development of face-specific cortical regions that underlie social recognition later in childhood",
    ],
  },
  {
    id: "bw-card-gallery",
    title: "Black-and-white card gallery",
    domain: "sensory-motor",
    ageWindowWeeks: "0–8",
    processSupported: "Early visual cortex calibration — pattern detection before colour vision matures",
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
    sources: [
      {
        citation: "Fantz R.L. (1963). Pattern vision in newborn infants. Science, 140, 296–297.",
        url: "https://www.science.org/doi/10.1126/science.140.3564.296",
      },
      {
        citation:
          "Norcia A.M. & Tyler C.W. (1985). Spatial frequency sweep VEP: visual acuity during the first year of life. Vision Research.",
        url: "https://pubmed.ncbi.nlm.nih.gov/4052359/",
      },
    ],
    shortTermBenefits: [
      "High-contrast patterns drive the strongest visual cortex responses in the 0–8 week window",
      "Sustained gaze (the 'orienting response') is the brain's signal that it is actively processing the input",
      "Supports early contrast sensitivity calibration",
    ],
    longTermBenefits: [
      "Visual cortex calibration in the first weeks sets the sensitivity range for later pattern recognition; deprivation of high-contrast input during this sensitive period is associated with reduced spatial frequency sensitivity (animal and clinical data)",
      "Early visual engagement predicts later visual-spatial processing abilities",
    ],
  },
  {
    id: "slow-face",
    title: "Face gazing — the slow face",
    domain: "language",
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
    sources: [
      {
        citation:
          "Tronick E. et al. (1978). The infant's response to entrapment between contradictory messages in face-to-face interaction. Journal of the American Academy of Child Psychiatry.",
        url: "https://pubmed.ncbi.nlm.nih.gov/632477/",
      },
      {
        citation:
          "Harvard Center on the Developing Child — Serve and Return framework (based on Tronick, Brazelton et al., 1970s–present)",
        url: "https://developingchild.harvard.edu/science/key-concepts/serve-and-return/",
      },
    ],
    shortTermBenefits: [
      "Activates face-detection circuits at baby's exact focal range (25 cm)",
      "Teaches baby the turn-taking structure of social exchange from day one",
      "Reduces fussiness when interaction is contingent and responsive",
    ],
    longTermBenefits: [
      "Consistent serve-and-return interactions are linked to larger vocabulary at 18 months and stronger language development by age 3 (Harvard CDChild)",
      "Disrupted serve-and-return (as revealed by the Still-Face Paradigm) is associated with elevated cortisol and, over time, altered stress-response architecture — the inverse effect confirms the causal link",
      "Predicts theory of mind development and social competence in school-age children",
    ],
  },
  {
    id: "tummy-time-chest",
    title: "Tummy time on your chest",
    domain: "sensory-motor",
    ageWindowWeeks: "0–12",
    processSupported: "Neck extensor muscle development, vestibular input, proprioceptive stimulation",
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
    sources: [],
    shortTermBenefits: [
      "Activates neck and upper-back extensor muscles needed for later head control",
      "Calming context — heartbeat, scent, warmth — reduces the typical distress of floor tummy time",
      "Provides early proprioceptive and vestibular input from a supported prone position",
    ],
    longTermBenefits: [
      "Consistent supervised tummy time supports timely development of postural control and is associated with on-time achievement of rolling and sitting milestones",
    ],
  },
  {
    id: "sway-narrate",
    title: "Slow sway and narrate walk",
    domain: "sensory-motor",
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
    sources: [],
    shortTermBenefits: [
      "Slow rhythmic motion activates parasympathetic calming and reduces crying",
      "Stimulates semicircular canals — the vestibular system's primary input channels",
      "Pairs movement with continuous prosodic speech exposure",
    ],
    longTermBenefits: [
      "Repeated varied vestibular input in infancy supports postural control development and is associated with smoother motor milestones in the first year",
    ],
  },
  {
    id: "palmar-grasp",
    title: "Palmar grasp practice",
    domain: "sensory-motor",
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
    sources: [
      {
        citation:
          "NIH StatPearls: Primitive Reflexes — clinical reference on brainstem-mediated reflexes and their integration",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK557657/",
      },
      {
        citation: "Forssberg H. (1999). Neural control of human motor development. Current Opinion in Neurobiology.",
        url: "https://pubmed.ncbi.nlm.nih.gov/10607638/",
      },
    ],
    shortTermBenefits: [
      "Activates brainstem-mediated palmar grasp reflex, a marker of intact neurological function",
      "Fires corticospinal motor circuits that will later underpin voluntary reach",
      "Provides proprioceptive input to the developing hand and forearm",
    ],
    longTermBenefits: [
      "Primitive reflexes that fail to integrate on schedule (typically 3–6 months) are associated with later difficulties in fine motor control, handwriting, and attention regulation",
      "Repeated reflex activation during the sensitive window supports timely cortical inhibition and the transition to voluntary grasping — a milestone correlated with cognitive development at 12 months",
    ],
  },
  {
    id: "cloth-texture",
    title: "Cloth texture exploration",
    domain: "sensory-motor",
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
    sources: [],
    shortTermBenefits: [
      "Different textures recruit different mechanoreceptor populations, broadening somatosensory input",
      "Pairs tactile sensation with spoken texture words — early multimodal language exposure",
      "Baby's facial expression changes give caregivers practice reading sensory cues",
    ],
    longTermBenefits: [
      "Rich tactile experience in infancy supports body-schema development, which underlies later fine motor control and exploratory play",
    ],
  },
  {
    id: "object-tracking",
    title: "Slow object tracking",
    domain: "sensory-motor",
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
    sources: [
      {
        citation:
          "Norcia A.M. & Tyler C.W. (1985). Spatial frequency sweep VEP: visual acuity during the first year of life. Vision Research.",
        url: "https://pubmed.ncbi.nlm.nih.gov/4052359/",
      },
      {
        citation:
          "Atkinson J. (2000). The Developing Visual Brain. Oxford University Press. (review of smooth pursuit and cortical visual development)",
        url: "https://pubmed.ncbi.nlm.nih.gov/11129162/",
      },
    ],
    shortTermBenefits: [
      "Exercises the superior colliculus pathway (functional at birth) and emerging cortical smooth-pursuit circuits",
      "Even failed tracking attempts are neurologically valuable — they generate prediction-error signals",
      "Supports eye muscle coordination",
    ],
    longTermBenefits: [
      "Smooth pursuit development in the first 3 months predicts visual-motor integration at 12 months",
      "Children with poor smooth pursuit development show higher rates of reading difficulties — early exercise of these circuits may confer protective benefit",
    ],
  },
  {
    id: "conversation-turn",
    title: "The conversation turn",
    domain: "language",
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
    sources: [
      {
        citation:
          "Werker J.F. & Tees R.C. (1984). Cross-language speech perception: Evidence for perceptual reorganization during the first year of life. Infant Behavior and Development.",
        url: "https://doi.org/10.1016/S0163-6383(84)80022-3",
      },
      {
        citation: "Tronick E. et al. (1978). Still-Face Paradigm. Journal of the American Academy of Child Psychiatry.",
        url: "https://pubmed.ncbi.nlm.nih.gov/632477/",
      },
    ],
    shortTermBenefits: [
      "Teaches the temporal structure of conversation: speak, pause, listen, respond",
      "Provides prosodic input matched to baby's current perceptual window",
      "Contingent responses confirm to baby that their communication has effect",
    ],
    longTermBenefits: [
      "Werker & Tees (1984): the window for absorbing the prosodic and phonemic patterns of the native language is open now and begins closing around 6–10 months — conversational exposure in this window is irreplaceable",
      "Turn-taking practice in infancy predicts conversational fluency and pragmatic language skills at age 5 (Gratier et al.)",
    ],
  },
  {
    id: "voice-mapping",
    title: "Voice mapping",
    domain: "language",
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
    sources: [
      {
        citation: "DeCasper A.J. & Fifer W.P. (1980). Of human bonding: newborns prefer their mothers' voices. Science.",
        url: "https://www.science.org/doi/10.1126/science.7375928",
      },
    ],
    shortTermBenefits: [
      "Exercises binaural auditory pathways functional at birth",
      "Builds the link between caregiver's voice (heard in utero) and spatial location",
      "Promotes early head turning and orienting — precursors to intentional social attention",
    ],
    longTermBenefits: [
      "Auditory localisation develops rapidly in the first 6 months and is predictive of later spatial cognition and attention",
      "Social attention to voices (orienting when called) at 6 months is an early screening indicator for typical social-communicative development",
    ],
  },
  {
    id: "same-song",
    title: "Singing the same song",
    domain: "language",
    ageWindowWeeks: "0–12",
    processSupported: "Auditory pattern memory; prosodic learning; stress regulation via familiar sound",
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
    sources: [
      {
        citation: "DeCasper A.J. & Fifer W.P. (1980). Of human bonding: newborns prefer their mothers' voices. Science, 208, 1174–1176.",
        url: "https://www.science.org/doi/10.1126/science.7375928",
      },
      {
        citation:
          "DeCasper A.J. & Spence M.J. (1986). Prenatal maternal speech influences newborns' perception of speech sounds. Infant Behavior and Development.",
        url: "https://pubmed.ncbi.nlm.nih.gov/3743543/",
      },
    ],
    shortTermBenefits: [
      "Familiar melody activates prenatal auditory memory traces from birth",
      "Repeated prosodic sequences build the earliest auditory pattern-recognition circuits",
      "Measurable calming effect — reduces cortisol and behavioural distress in the first weeks",
    ],
    longTermBenefits: [
      "By 4–6 weeks, babies show anticipatory stilling (beginning to still before the song starts) — an early form of predictive processing that is foundational for learning",
      "Musical pattern exposure in infancy is associated with stronger phonological awareness at school age (Anvari et al., 2002)",
    ],
  },
  {
    id: "reading-aloud",
    title: "Reading aloud — anything",
    domain: "language",
    ageWindowWeeks: "0–12",
    processSupported: "Prosodic exposure; language rhythm absorption; stress regulation via caregiver voice",
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
    sources: [],
    shortTermBenefits: [
      "Provides continuous, varied prosodic input the auditory cortex is actively learning from",
      "Caregiver voice settles baby via familiar prenatal sound exposure",
      "Builds the habit and rhythm of shared book time from the very beginning",
    ],
    longTermBenefits: [
      "Quantity of language exposure in the first year predicts vocabulary at age 3 and reading readiness at school entry",
    ],
  },
  {
    id: "facial-expression-copying",
    title: "Facial expression copying",
    domain: "cognitive",
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
    sources: [
      {
        citation:
          "Meltzoff A.N. & Moore M.K. (1977). Imitation of facial and manual gestures by human neonates. Science, 198, 75–78.",
        url: "https://www.science.org/doi/10.1126/science.198.4312.75",
      },
      {
        citation: "Meltzoff A.N. & Moore M.K. (1983). Newborn infants imitate adult facial gestures. Child Development.",
        url: "https://pubmed.ncbi.nlm.nih.gov/6851717/",
      },
    ],
    shortTermBenefits: [
      "Face-to-face contingent interaction at close range simultaneously activates visual, social, and motor circuits",
      "Models emotional expression and recognition from the earliest weeks",
      "Stimulates cross-modal matching between seen and felt body states",
    ],
    longTermBenefits: [
      "Early face-to-face interaction quality predicts emotional recognition ability at 12 months",
      "Meltzoff's 'like me' framework — the capacity to map others' expressions onto one's own body — is considered a developmental precursor to empathy and theory of mind",
    ],
  },
  {
    id: "contingency-mobile",
    title: "Contingency mobile (DIY)",
    domain: "cognitive",
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
    sources: [
      {
        citation: "Rovee-Collier C. (1999). The development of infant memory. Current Directions in Psychological Science.",
        url: "https://journals.sagepub.com/doi/10.1111/1467-8721.00019",
      },
      {
        citation:
          "Rovee-Collier C. (1997). Dissociations in infant memory: Rethinking the development of implicit and explicit memory. Psychological Review.",
        url: "https://pubmed.ncbi.nlm.nih.gov/9161312/",
      },
    ],
    shortTermBenefits: [
      "Baby learns within minutes that their leg kicks move the mobile — a direct demonstration of causal learning",
      "Memory for the contingency persists across days — demonstrable at 2 months",
      "Motivates sustained attention and deliberate movement",
    ],
    longTermBenefits: [
      "Contingency learning is the cognitive precursor to agency, intentionality, and problem-solving — children who experience consistent contingent environments show earlier development of executive function",
      "Rovee-Collier's work established that implicit memory (procedural, contextual) is functional from 2 months, challenging earlier assumptions that infants lack memory — with implications for how early experience shapes the brain's memory architecture long-term",
    ],
  },
  {
    id: "scent-pairing",
    title: "Scent cloth settling",
    domain: "sensory-motor",
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
    sources: [
      {
        citation:
          "Macfarlane A. (1975). Olfaction in the development of social preferences in the human neonate. Ciba Foundation Symposium, 33, 103–113.",
        url: "https://pubmed.ncbi.nlm.nih.gov/1039532/",
      },
    ],
    shortTermBenefits: [
      "Familiar caregiver scent activates the olfactory system — one of the most mature sensory pathways at birth",
      "Measurable calming effect within minutes",
      "Demonstrates early associative learning: this smell = safety",
    ],
    longTermBenefits: [
      "Olfactory-emotional associations formed in the newborn period are encoded in the amygdala and can persist for years — some of the most durable early memories are olfactory",
      "Reliable scent-based comfort builds the earliest association between caregiver and safety — a building block of secure attachment",
    ],
  },
  {
    id: "light-shadow",
    title: "Light and shadow play",
    domain: "sensory-motor",
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
    sources: [],
    shortTermBenefits: [
      "Engages the subcortical orienting pathway active from birth",
      "Moving light edges are among the most salient stimuli for the neonatal visual system",
      "Easy way to observe baby's emerging head and eye orienting",
    ],
    longTermBenefits: [
      "Exercising early orienting pathways supports the transition to cortical visual attention control later in infancy",
    ],
  },
  {
    id: "joint-compression",
    title: "Gentle joint compression",
    domain: "sensory-motor",
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
    sources: [],
    shortTermBenefits: [
      "Activates deep joint and muscle-spindle proprioceptors",
      "Provides clear body-boundary signals to the somatosensory cortex",
      "Tends to be organising and calming for many babies",
    ],
    longTermBenefits: [
      "A well-developed body schema in infancy underpins later fine motor control, coordination, and intentional reach",
    ],
  },
  {
    id: "varied-carrying",
    title: "Varied carrying positions",
    domain: "sensory-motor",
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
    sources: [],
    shortTermBenefits: [
      "Each position activates different semicircular canals and otolith organs",
      "Varies gravitational load on neck and trunk extensors",
      "Prevents prolonged single-position pressure on the head",
    ],
    longTermBenefits: [
      "Varied vestibular and postural input in infancy supports balanced postural control and on-time achievement of head control and sitting milestones at around 6 months",
    ],
  },
  {
    id: "heartbeat-settling",
    title: "Heartbeat sound settling",
    domain: "language",
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
    sources: [
      {
        citation:
          "Salk L. (1960). The effects of the normal heartbeat sound on the behavior of the newborn infant: Implications for mental health. World Mental Health.",
        url: "https://psycnet.apa.org/record/1963-03736-001",
      },
    ],
    shortTermBenefits: [
      "Familiar prenatal sound activates existing auditory memory traces from birth",
      "Reduces cortisol and behavioural signs of distress in unsettled infants",
      "Promotes parasympathetic (calming) nervous system activation",
    ],
    longTermBenefits: [
      "Demonstrates that memory traces formed in utero persist after birth and influence behaviour — an early example of how prenatal experience shapes postnatal neurology",
      "Effective settling strategies in the newborn period reduce cumulative cortisol exposure, which is associated with better stress regulation architecture over the first year",
    ],
  },
  {
    id: "attention-recovery",
    title: "Attention recovery wait",
    domain: "cognitive",
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
    sources: [
      {
        citation: "Tronick E. et al. (1978). Still-Face Paradigm. Journal of the American Academy of Child Psychiatry.",
        url: "https://pubmed.ncbi.nlm.nih.gov/632477/",
      },
    ],
    shortTermBenefits: [
      "Correctly honouring gaze aversion prevents overstimulation and models respect for baby's self-regulatory signals",
      "Baby's return to interaction after a break demonstrates the cycle of engagement and recovery",
      "Caregiver learns to read and match baby's natural attention rhythm",
    ],
    longTermBenefits: [
      "Sensitive attunement to infant gaze aversion in the first 3 months predicts more secure attachment at 12 months (Ainsworth; Isabella & Belsky)",
      "Children whose caregivers consistently respected their attentional limits in infancy show better emotional self-regulation and executive function at age 4–5",
    ],
  },
  {
    id: "name-repetition",
    title: "Name repetition at close range",
    domain: "language",
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
    sources: [],
    shortTermBenefits: [
      "Pairs a single repeated sound pattern with face, touch, and warm context",
      "Provides clear, discriminable auditory input embedded in caregiving moments",
      "Builds the earliest neural traces for self-relevant social signals",
    ],
    longTermBenefits: [
      "Own-name recognition (measurable by 4–5 months) is a foundation for joint attention and intentional social communication later in the first year",
    ],
  },
  {
    id: "limb-movement",
    title: "Gentle limb movement",
    domain: "sensory-motor",
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
    sources: [],
    shortTermBenefits: [
      "Generates proprioceptive input that trains the brain's body map",
      "Mobilises joints through their natural range without stretching",
      "Pairs movement with simple narration — multimodal input",
    ],
    longTermBenefits: [
      "Early body-schema development underpins later voluntary reach, midline crossing, and coordinated whole-body movement",
    ],
  },
  {
    id: "quiet-alert-observation",
    title: "Quiet alert window observation",
    domain: "cognitive",
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
    sources: [
      {
        citation:
          "Brazelton T.B. (1973). Neonatal Behavioral Assessment Scale. Clinics in Developmental Medicine. Spastics International Medical Publications.",
        url: "https://pubmed.ncbi.nlm.nih.gov/4129339/",
      },
    ],
    shortTermBenefits: [
      "Quiet alert state is when visual processing, attention, and social responsiveness are at their peak",
      "Letting baby lead in this state respects their attentional capacity and prevents overstimulation",
      "Observation builds your ability to read baby's cues accurately",
    ],
    longTermBenefits: [
      "Caregiver sensitivity to infant state — specifically recognising and responding to quiet alert windows — is one of the strongest predictors of secure attachment at 12 months (Ainsworth Strange Situation research)",
      "Sensitive state-matching in the first weeks predicts child self-regulation at age 3–5",
    ],
  },
  {
    id: "water-sound-bath",
    title: "Water sound bath",
    domain: "sensory-motor",
    ageWindowWeeks: "0–12",
    processSupported: "Multi-modal sensory integration; tactile thermoreception; auditory input",
    evidenceBasis:
      "Warm water immersion activates thermoreceptors and tactile mechanoreceptors across the body surface simultaneously, providing multi-modal input to developing somatosensory cortex.",
    instructions: [
      "Support baby's head firmly throughout.",
      "Lower them slowly into warm (not hot — test with your elbow) water.",
      "Let them experience the water on limbs first, then lower the body.",
      "Gently pour water over the trunk with a cupped hand.",
      "Narrate: 'Warm water on your tummy. Now your arms.'",
      "Keep it short: 5–7 minutes is plenty. Dry thoroughly and quickly after.",
    ],
    durationMinutes: 7,
    whyItWorks:
      "Warm water provides simultaneous activation of thermoreceptors, mechanoreceptors, and proprioceptors across the entire body — among the richest multi-modal sensory experiences available at home.",
    weekRecommended: 3,
    sources: [],
    shortTermBenefits: [
      "Simultaneously activates thermoreceptors, mechanoreceptors, and proprioceptors across the body",
      "Warmth and gentle pressure are organising and calming for most babies",
      "Provides a rich multi-modal sensory event that is hard to replicate elsewhere",
    ],
    longTermBenefits: [
      "Multi-modal sensory integration practice in infancy supports the maturation of cortical regions that combine touch, temperature, and body position into a coherent body sense",
    ],
  },
  {
    id: "hum-chest",
    title: "Hum and chest feel",
    domain: "language",
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
    sources: [],
    shortTermBenefits: [
      "Delivers sound through air and bone conduction at the same time — a true cross-modal stimulus",
      "Caregiver's voice plus warmth and contact are reliably calming",
      "Slow pitch variation exposes baby to prosodic contour",
    ],
    longTermBenefits: [
      "Cross-modal integration practice in infancy supports later auditory processing and the brain's ability to combine speech sound with visible mouth movement during language learning",
    ],
  },
  {
    id: "novel-object-pause",
    title: "Novel object pause",
    domain: "cognitive",
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
    sources: [
      {
        citation: "Fantz R.L. (1963). Pattern vision in newborn infants. Science.",
        url: "https://www.science.org/doi/10.1126/science.140.3564.296",
      },
      {
        citation: "Rovee-Collier C. (1999). The development of infant memory. Current Directions in Psychological Science.",
        url: "https://journals.sagepub.com/doi/10.1111/1467-8721.00019",
      },
    ],
    shortTermBenefits: [
      "Renewed attention to a novel stimulus (dishabituation) is direct, observable evidence that the brain encoded memory of the first object",
      "Exercises novelty detection — a core cognitive function from 6 weeks",
      "Provides visual working memory practice in real time",
    ],
    longTermBenefits: [
      "Dishabituation rate in infancy (how quickly a baby responds to novelty) is one of the strongest infant predictors of IQ at age 5–7 (Fagan & Singer; meta-analyses by McCall & Carriger)",
      "Novelty preference scores at 3–4 months predict vocabulary at 2 years",
    ],
  },
  {
    id: "outdoor-listening",
    title: "Outdoor ambient listening",
    domain: "language",
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
    sources: [],
    shortTermBenefits: [
      "Exposes the auditory cortex to complex, layered real-world sounds",
      "Pairs ambient sound with quiet naming — early vocabulary embedded in context",
      "Outdoor light and air tend to settle and alert baby simultaneously",
    ],
    longTermBenefits: [
      "Auditory scene analysis (the ability to parse multiple sounds in a noisy environment) develops over the first year and supports later speech-in-noise comprehension and listening in classrooms",
    ],
  },
  {
    id: "skin-to-skin",
    title: "Skin-to-skin time",
    domain: "sensory-motor",
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
    sources: [
      {
        citation: "WHO Kangaroo Mother Care Evidence (2023)",
        url: "https://www.who.int/tools/elena/interventions/kangaroo-care-infants",
      },
      {
        citation:
          "Feldman et al. (2014) — 10-year longitudinal RCT. Maternal-preterm skin-to-skin contact enhances child physiologic organization and cognitive control across the first 10 years of life. Biological Psychiatry.",
        url: "https://pubmed.ncbi.nlm.nih.gov/24094511/",
      },
      {
        citation:
          "IPISTOSS trial (2024) — Immediate skin-to-skin contact at very preterm birth and effect on infant socio-emotional stress response and mother-infant cortisol co-regulation.",
        url: "https://pubmed.ncbi.nlm.nih.gov/41672603/",
      },
    ],
    shortTermBenefits: [
      "Stabilises heart rate and body temperature within minutes",
      "Reduces salivary cortisol (stress hormone) in both baby and caregiver",
      "Promotes milk production and breastfeeding success",
    ],
    longTermBenefits: [
      "Feldman et al. (2014) followed children for 10 years: those who received kangaroo care showed better autonomic nervous system regulation, lower anxiety, and stronger cognitive control at age 10 compared to controls",
      "Improved cortisol co-regulation between parent and child at 4 months, correlating with better emotional self-regulation in toddlerhood",
    ],
  },
  {
    id: "narrated-day",
    title: "The narrated day",
    domain: "language",
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
    sources: [
      {
        citation:
          "Hart B. & Risley T.R. (1995). Meaningful Differences in the Everyday Experience of Young American Children. Baltimore: Paul H. Brookes.",
        url: "https://pubs.asha.org/doi/10.1044/jshd.5701.149",
      },
      {
        citation:
          "Soderstrom M. (2007). Beyond babytalk: Re-evaluating the nature and content of speech input to preverbal infants. Developmental Review.",
        url: "https://doi.org/10.1016/j.dr.2006.11.003",
      },
    ],
    shortTermBenefits: [
      "Provides continuous prosodic input — the rhythm and melody of language — which the auditory cortex is actively processing from birth",
      "Gives baby a turn-by-turn model of how language accompanies action",
    ],
    longTermBenefits: [
      "Hart & Risley (1995): children who heard significantly more words by age 3 had vocabularies 4× larger and IQ scores measurably higher at age 9 — the 'word gap' begins in the first months of life",
      "Word exposure in the first year (measured by LENA devices) independently predicts language skills and school readiness at age 5, even controlling for socioeconomic status",
    ],
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

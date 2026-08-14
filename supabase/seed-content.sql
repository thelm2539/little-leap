-- ============================================================================
-- Generated seed: content_activities / content_milestones
-- Source: src/lib/littleleaps/data.ts + milestones.ts, at the moment this was
-- generated. Run ONCE in the Supabase SQL editor, after
-- 20260812120000_content_management.sql. Seeded as 'published' — this is the
-- real, already-reviewed launch content, not a draft awaiting approval.
-- ============================================================================

begin;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'mirror-face-time',
  'Mirror face time',
  'sensory',
  'contrast-pattern',
  '0–12',
  'Visual cortex calibration and face-recognition circuit activation',
  'Newborns preferentially attend to faces at ~25 cm; face-selective cortical responses present by 2 months (Farroni et al.; Nature Neuroscience 2025).',
  '{"Hold baby facing a mirror at arm''s length (~25 cm from their face).","Let them look for 30–60 seconds.","Slowly move your own face into view beside theirs so they can compare.","Narrate softly: ''That''s you. That''s your nose.'' Calm is fine — no need for energy."}',
  3,
  'High-contrast face image at optimal focal distance activates developing face-detection circuits without requiring fine visual acuity.',
  3,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'bw-card-gallery',
  'Black-and-white card gallery',
  'sensory',
  'contrast-pattern',
  '0–8',
  'Early visual cortex calibration — pattern detection before colour vision matures',
  'Newborn contrast sensitivity favours high-contrast edges; colour discrimination emerges ~2–3 months (Norcia & Tyler, 1985; replicated).',
  '{"Draw 3–4 simple high-contrast images on separate sheets: thick black stripes, a bull''s-eye, a simple face (two circles for eyes, curved line for mouth), a checkerboard.","Prop them upright at ~25–30 cm from where baby''s face will be.","Place baby on their back facing the cards during an alert period.","Watch for stilling, widened eyes, or brief tracking — you don''t need to point or direct."}',
  5,
  'High-contrast patterns are the most robustly processed visual stimuli in the 0–2 month window, directly matching the infant visual system''s sensitivity profile.',
  1,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'object-tracking',
  'Slow object tracking',
  'sensory',
  'visual-tracking',
  '0–12',
  'Visual tracking circuit development; smooth pursuit maturation',
  'Visual tracking (smooth pursuit) emerges gradually from ~6 weeks; subcortical superior colliculus drives early orienting, cortical control increases by 3 months (reviewed in Atkinson, 2000).',
  '{"Hold baby on your lap, face up.","Hold an object at ~25 cm, slightly above eye level. A white sock with a black X works well.","Wait until baby focuses on it.","Move it SLOWLY (about 10 cm per second) in an arc to one side, then back.","Pause frequently — baby''s tracking is fragile and easily lost.","0–4 weeks: horizontal arc only. 4–8 weeks: try slow vertical too. 8–12 weeks: try a full 180° arc."}',
  3,
  'Repeated tracking practice strengthens the cortical smooth-pursuit pathways being laid down in real time.',
  4,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'light-shadow',
  'Light and shadow play',
  'sensory',
  'contrast-pattern',
  '0–12',
  'Luminance contrast detection; visual orienting reflex',
  'Orienting toward light and high-luminance contrast is mediated by subcortical pathways (superior colliculus) functional at birth — among the earliest visual behaviours.',
  '{"In a dimly lit room, turn on a single lamp with a shade.","Hold baby facing the light (not directly at a bare bulb).","Move your hand between the light source and baby''s face, casting a shadow that moves slowly across their visual field.","Watch for orienting — eyes or head turning toward the light edge.","Keep it simple and slow."}',
  3,
  'Luminance contrast and moving edges are the two most salient visual stimuli for the neonatal visual system — this directly targets the circuits that are active earliest.',
  1,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'tummy-time-chest',
  'Tummy time on your chest',
  'sensory',
  'vestibular-motor',
  '0–12',
  'Neck extensor muscle development, vestibular input, proprioceptive stimulation',
  'Prone positioning activates neck and back extensor circuits essential for later head control and postural development; AAP-endorsed for awake supervised periods.',
  '{"Recline slightly (30–45 degrees is easier for baby than fully flat).","Place baby prone (tummy-down) on your chest, head near your collarbone.","Let baby''s head rest to the side initially.","Talk or sing softly — your voice gives them a reason to try to lift their head.","1–2 minutes is enough in the first weeks. Build gradually.","Never do tummy time when you might fall asleep."}',
  2,
  'Prone positioning requires active neck extension — even attempts count — and the familiar sound of your heartbeat and voice provides a calming context.',
  2,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'sway-narrate',
  'Slow sway and narrate walk',
  'sensory',
  'vestibular-motor',
  '0–12',
  'Vestibular system stimulation; language exposure; stress regulation',
  'Rhythmic vestibular input promotes postural circuit maturation; slow rhythmic motion reduces infant crying and promotes calming via parasympathetic activation (NIH; multiple studies).',
  '{"Hold baby securely against your chest or in a cradle hold.","Walk slowly around the room, swaying gently side to side.","Narrate what you see: ''Here''s the window. Here''s the plant. The light is on.''","Keep your pace slow and the sway smooth — no bouncing needed.","If baby is fussy, try walking toward a window or light source."}',
  5,
  'Gentle linear and rotational motion activates semicircular canal pathways — the vestibular system develops early and responds well to slow rhythmic input.',
  1,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'palmar-grasp',
  'Palmar grasp practice',
  'sensory',
  'tactile',
  '0–8',
  'Palmar grasp reflex activation and corticospinal circuit priming',
  'Palmar grasp reflex is a brainstem-mediated response that primes corticospinal motor circuits later underlying voluntary reach (NIH StatPearls; Forssberg et al.).',
  '{"When baby''s hand is open, gently stroke the palm from wrist toward fingers.","They will reflexively grip your finger.","Hold for 5–10 seconds, then gently release.","Repeat 3–5 times per hand.","You can also offer the handle of a wooden spoon or a rolled washcloth for texture variety."}',
  3,
  'Each reflex activation is a neural circuit firing — repeated activation strengthens the pathways that will eventually become voluntary grasping.',
  3,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'cloth-texture',
  'Cloth texture exploration',
  'sensory',
  'tactile',
  '0–12',
  'Cutaneous mechanoreceptor stimulation; somatosensory cortex activation',
  'Tactile stimulation activates somatosensory pathways functional at birth; skin-to-skin contact has replicated physiological benefits (WHO Kangaroo Care evidence base).',
  '{"Lay baby on their back on a firm flat surface.","Gently stroke each cloth across baby''s forearm, palm, or cheek in turn.","Pause between each one — watch their face for changes in expression.","Name the texture out loud: ''smooth,'' ''scratchy,'' ''fluffy.'' (Language exposure bonus.)","Stop if baby shows distress."}',
  3,
  'Different textures activate distinct mechanoreceptor populations, providing varied somatosensory input to a cortex hungry for calibration data.',
  4,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'scent-pairing',
  'Scent cloth settling',
  'sensory',
  'tactile',
  '0–8',
  'Olfactory pathway development; association learning; stress regulation',
  'Olfactory system is among the most mature at birth; newborns recognise and prefer mother''s breast milk scent within days (Macfarlane, 1975; replicated); olfactory-emotional learning pathways are functional neonatally.',
  '{"Wear a cloth or piece of fabric against your skin for a few hours.","When you need to set baby down, place this cloth next to (not over) their face.","Notice whether baby turns toward it or stills.","Refresh every 24 hours — scent fades quickly."}',
  2,
  'Newborns navigate their world largely by smell in the first weeks. Familiar olfactory cues activate stress-buffering responses and demonstrate early associative learning.',
  3,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'joint-compression',
  'Gentle joint compression',
  'sensory',
  'vestibular-motor',
  '0–12',
  'Proprioceptive pathway activation; body-schema development',
  'Proprioceptive input activates joint mechanoreceptors and muscle spindles, providing body-boundary data to the developing somatosensory cortex — important for early body schema formation.',
  '{"Lay baby on their back on a firm surface.","Gently hold baby''s foot with both hands and apply a very gentle steady pressure toward the hip. Hold 5 seconds, release.","Repeat on the other leg.","Optionally: gently hold baby''s hand and apply gentle steady pressure toward the shoulder along the arm''s axis.","This should feel like firm-but-gentle contact, not manipulation or stretching."}',
  3,
  'Joint compression activates deep proprioceptors that give the brain information about body position — the data source for building a body map.',
  4,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'varied-carrying',
  'Varied carrying positions',
  'sensory',
  'vestibular-motor',
  '0–12',
  'Vestibular and proprioceptive input variety; postural circuit development',
  'Vestibular system develops early and responds to varied spatial orientations; varied carrying positions provide different gravitational loads to developing postural circuits.',
  '{"Over the course of a day, try 3–4 different holding positions:","1. Cradle hold (face up, head in crook of arm)","2. Upright against chest, facing you","3. Upright against chest, facing outward","4. Football hold (baby face-down along your forearm, head at your hand)","Move slowly between positions. Never shake or jolt.","Each position offers a different vestibular experience."}',
  5,
  'Different orientations activate different semicircular canals and otolith organs, giving the vestibular cortex varied input to calibrate against.',
  2,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'limb-movement',
  'Gentle limb movement',
  'sensory',
  'vestibular-motor',
  '0–12',
  'Proprioceptive calibration; motor efference copy learning',
  'Passive limb movement provides afferent proprioceptive input alongside the developing efferent motor pathways, contributing to the body schema being built in somatosensory and motor cortex.',
  '{"Lay baby on their back.","Gently hold one foot and slowly bicycle the legs: left knee bends as right extends, alternating, in a smooth slow rhythm.","Also try: gently raising both arms above the head, then back down.","And: gently crossing arms across chest, then opening back out.","All movements should be extremely slow, smooth, and fully within the joint''s natural range. Never force or stretch.","Narrate as you go: ''Left leg... right leg...''"}',
  4,
  'Movement generates proprioceptive signals that train the brain''s maps of the body — even passive movement provides the input the motor cortex uses to calibrate.',
  3,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'water-sound-bath',
  'Warm calming bath',
  'sleep',
  'sleep-routine',
  '0–52',
  'Parasympathetic wind-down; passive body warming and post-bath cooling that cues sleep onset',
  'A warm bath 1–2 hours before sleep raises skin temperature and then triggers a compensatory core-temperature drop as the body cools — the same nocturnal temperature fall that precedes natural sleep onset. Warm-bath-before-bed is a widely studied component of infant sleep routines.',
  '{"Support baby''s head firmly throughout.","Lower them slowly into warm (not hot — test with your elbow) water.","Let them experience the water on limbs first, then lower the body.","Gently pour water over the trunk with a cupped hand, narrating softly.","Keep it short and unstimulating: 5–7 minutes, lights low.","Dry thoroughly and move straight into the quiet part of the bedtime routine."}',
  7,
  'The warmth relaxes the body, and the gradual cooling afterwards mimics the core-temperature drop that naturally precedes sleep — which is why a warm bath is one of the most reliable pre-sleep cues. Kept short and low-key, it signals wind-down rather than play.',
  3,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'skin-to-skin',
  'Skin-to-skin time',
  'sensory',
  'tactile',
  '0–12',
  'Autonomic nervous system regulation; cortisol buffering; tactile and thermoregulatory pathway activation',
  'Kangaroo care has strong replicated evidence (multiple RCTs, endorsed by WHO) for stabilising heart rate, temperature regulation, and cortisol levels in both preterm and term infants. Physical holding is neurologically active stimulation.',
  '{"Lay baby on your bare chest, skin to skin.","Cover with a light blanket if cool.","Allow baby to hear your heartbeat and feel your warmth.","Do during a calm, alert window — no specific activity required."}',
  30,
  'Skin-to-skin contact simultaneously activates thermoregulatory, tactile, olfactory, and auditory pathways. It is caregiving and neurostimulation at the same time.',
  3,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'slow-face',
  'Face gazing — the slow face',
  'social-language',
  'social-communication',
  '0–12',
  'Serve-and-return neural pathway development; face-gaze contingency learning',
  'Contingent face-to-face interaction builds stress-regulatory and social circuits (Tronick et al., 1978 Still-Face Paradigm — one of the most replicated experiments in developmental science).',
  '{"Hold baby at your chest, facing you.","Slowly bring your face to ~25 cm from theirs.","Make eye contact and wait — don''t speak first.","When baby makes any expression or sound, mirror it back slowly.","Pause after each response. Let them take a turn.","If baby looks away, that is self-regulation — wait. They will usually return."}',
  5,
  'Contingent responsiveness — your reaction following their cue — is the fundamental unit of social-brain wiring in this period.',
  3,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'conversation-turn',
  'The conversation turn',
  'social-language',
  'social-communication',
  '0–12',
  'Prosodic pattern learning; serve-and-return neural circuit development',
  'Infants at 0–3 months are absorbing prosodic patterns — rhythm, stress, intonation — which are the primary auditory units available to their developing auditory cortex (Werker & Tees; Kuhl et al.).',
  '{"Hold baby at ~25 cm from your face.","Say something simple in a warm tone: ''Hi. How are you feeling?''","Stop completely and wait 5–10 seconds.","If baby makes any sound, expression change, or movement: respond as if it was a word. ''Oh really? That''s interesting.''","Then pause again. Give them another turn.","Let it be a real (if slow) conversation — 3–5 minutes."}',
  5,
  'Pausing and waiting teaches the temporal structure of conversation — turn-taking is a learned social-cognitive pattern, and 0–3 months is when its scaffolding begins.',
  2,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'voice-mapping',
  'Voice mapping',
  'social-language',
  'auditory',
  '0–8',
  'Auditory localisation; cross-modal integration of voice and face',
  'Newborns turn toward the mother''s voice (DeCasper & Fifer, 1980, Science); voice localisation depends on binaural auditory pathways functional at birth.',
  '{"Lay baby on their back on a safe flat surface.","Move to their right side, just outside their visual field (~45 degrees off centre).","Call their name or say ''hello'' in a warm, clear voice.","Wait and watch — many babies will orient their eyes or turn their head.","Move to the left and repeat. Try from above, then from below.","Keep voice volume normal — no need to be loud."}',
  3,
  'Auditory localisation requires coordinating binaural timing differences — this simple activity is actively exercising those circuits.',
  2,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'same-song',
  'Singing the same song',
  'social-language',
  'auditory',
  '0–12',
  'Auditory pattern memory; prosodic learning; stress regulation via familiar sound',
  'Newborns recognise and prefer sounds heard repeatedly in utero; familiar songs activate memory and calming circuits (DeCasper & Fifer, 1980; prenatal learning literature).',
  '{"Pick one or two very simple songs or rhymes.","Sing them slowly, at the same time and in the same context each day (e.g. always at diaper change).","Keep the melody and words consistent — don''t vary it much.","By 4–6 weeks, watch for anticipatory stilling when you begin — a sign of recognition.","Volume: soft to moderate. Baby is very close."}',
  3,
  'Repeated exposure to the same prosodic sequence builds auditory memory traces — the first building blocks of pattern recognition and predictive processing.',
  1,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'reading-aloud',
  'Reading aloud — anything',
  'social-language',
  'language-exposure',
  '0–12',
  'Prosodic exposure; language rhythm absorption; stress regulation via caregiver voice',
  'The content of what is read does not matter at this age — prosodic pattern exposure is the active ingredient (Werker & Tees; Soderstrom, 2007).',
  '{"Hold baby in a comfortable position facing you.","Read aloud from anything — your own book, a recipe, the back of a cereal box.","Read slowly, with natural expression. Let your voice rise and fall.","Pause occasionally and make eye contact.","No need for a baby book. The point is your voice, your prosody, and your presence."}',
  5,
  'Continuous natural speech exposure provides the prosodic data the auditory cortex is actively seeking and storing in this period.',
  2,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'heartbeat-settling',
  'Heartbeat sound settling',
  'social-language',
  'auditory',
  '0–6',
  'Auditory-somatic association; stress regulation; prenatal auditory memory',
  'The fetal auditory environment is dominated by maternal heartbeat and vascular sound; heartbeat-like rhythmic sounds have replicated calming effects on neonates (Salk, 1960; subsequent replications).',
  '{"When baby is fussy but fed, changed, and held:","Hold baby''s left ear against your chest so they can hear your heartbeat.","Or: hold baby near a ticking clock (~60–80 ticks per minute).","Rock very gently and slowly.","Keep ambient noise low.","Works better for unsettled but not acutely distressed babies."}',
  5,
  'Familiar prenatal sounds trigger auditory memory traces and activate calming responses — one of the earliest examples of long-term memory from in-utero experience.',
  1,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'name-repetition',
  'Name repetition at close range',
  'social-language',
  'language-exposure',
  '0–12',
  'Own-name representation; auditory discrimination; social signal learning',
  'By 4–5 months, infants show measurable brain responses to their own name (ERP studies); this recognition is built through repeated hearing in caregiving contexts starting from birth.',
  '{"During diaper changes, feeding, or any close-contact moment:","Say baby''s name clearly at the start and end of sentences.","Don''t overdo it — 2–3 times per interaction is plenty.","Also use it when they are fussy: call their name first before picking up, to see if voice alone orients them.","Keep your tone warm and your face visible when saying their name."}',
  3,
  'Repeated pairing of name with face, touch, and context begins building the neural representation that will later allow the infant to recognise their own name from across a room.',
  1,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'hum-chest',
  'Hum and chest feel',
  'sleep',
  'sleep-routine',
  '0–8',
  'Auditory-vibrotactile cross-modal integration; prosodic pattern exposure',
  'Bone conduction of sound through the chest is detectable as both auditory and vibrotactile input; cross-modal integration of sound and vibration activates overlapping cortical regions (reviewed in multisensory integration literature).',
  '{"Hold baby against your chest, their ear pressed gently to your sternum.","Hum slowly and steadily — any tune you like.","Baby feels your chest vibrate AND hears the sound through your ribcage.","Vary the pitch slowly up and then down.","Notice if baby stills or presses closer — a sign of engagement."}',
  4,
  'Sound delivered simultaneously through air (auditory) and bone conduction (vibrotactile) activates two sensory modalities at once, exercising the cross-modal integration circuits that are building throughout this period.',
  2,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'outdoor-listening',
  'Outdoor ambient listening',
  'social-language',
  'auditory',
  '0–12',
  'Auditory scene analysis; complex sound environment calibration',
  'The auditory cortex in the first months is calibrating to the statistical structure of sounds in its environment; varied natural acoustic environments support broader auditory scene analysis development.',
  '{"Take baby outside or sit near an open window during a calm moment.","Hold baby in a comfortable position.","Just sit quietly and listen together — let natural sounds arrive: wind, birdsong, passing cars (from a distance), leaves.","Softly name what you hear: ''That''s a bird. That''s the wind in the tree.''","5–10 minutes is sufficient. Avoid very loud environments."}',
  8,
  'Real-world acoustic environments contain complex, layered sounds the brain must learn to parse — exposure to this richness supports the auditory cortex''s statistical learning work.',
  4,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'narrated-day',
  'The narrated day',
  'social-language',
  'social-communication',
  '0–12',
  'Language exposure; prosodic pattern absorption; social contingency learning',
  'Quantity of talk in the first year predicts vocabulary at age 3 (Hart & Risley, 1995). Prosodic structure — the melody and rhythm of speech — is absorbed before individual words. Infant-directed speech preferentially attended over adult-directed speech (Soderstrom, 2007; cross-cultural replications).',
  '{"Narrate what you are doing as you do it, in a calm, slightly slower voice.","''Now I''m changing your nappy — the wipe is going to be cold.''","''Here comes your milk.''","No need for forced cheerfulness — your natural voice and pace is what matters.","Ongoing throughout the day — no special session needed."}',
  0,
  'Continuous natural speech exposure provides the prosodic data the auditory cortex is actively seeking and storing — and every response you give to baby''s cues teaches them that their actions matter.',
  3,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'facial-expression-copying',
  'Facial expression copying',
  'cognitive',
  'social-cognition',
  '0–8',
  'Cross-modal matching; contingency detection; early social cognition',
  'Neonatal imitation of facial gestures (tongue protrusion, mouth widening) was reported by Meltzoff & Moore (1977, Science); cross-modal face sensitivity is well-replicated though mechanistic interpretation remains debated.',
  '{"Hold baby at ~20–25 cm from your face during a calm, alert period.","Make eye contact.","Slowly, clearly stick out your tongue — hold it for 3–4 seconds.","Pull it back and wait 10–15 seconds.","Watch baby''s face carefully — especially mouth and tongue.","In younger babies (0–4 weeks) responses may be delayed by 30+ seconds — patience is the whole skill here."}',
  5,
  'Whether or not early imitation is true mimicry, face-to-face contingent interaction at close range activates social and visual processing circuits simultaneously.',
  4,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'contingency-mobile',
  'Contingency mobile (DIY)',
  'cognitive',
  'causal-learning',
  '4–12',
  'Contingency detection; early causal learning; motor-visual coupling',
  'Rovee-Collier''s mobile studies (replicated) showed 2-month-olds learn within minutes that their leg kicks move a mobile, and remember this across days — the first robust demonstration of infant causal learning.',
  '{"Tie 3–4 lightweight objects on strings from a horizontal stick (a ruler or wooden spoon).","Hang it ~30 cm above baby''s chest.","Attach a long string loosely from the mobile to baby''s wrist or ankle with a very loose loop — loose enough to slide off easily.","When baby moves, the mobile moves.","Watch for baby to notice the connection — they will often pause, then move more deliberately.","IMPORTANT: Remove the string connection when the session ends. Never leave baby unattended with string attached."}',
  5,
  'When baby discovers their movement causes the mobile to move, they are learning contingency — that their actions have effects — which is the root of intentional behaviour and early problem-solving.',
  5,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'attention-recovery',
  'Attention recovery wait',
  'cognitive',
  'attention',
  '4–12',
  'Self-regulation of attention; habituation and dishabituation',
  'When an infant looks away during interaction, this is active self-regulation — not withdrawal. Allowing recovery time then re-engaging when they return is the correct contingent response (Tronick still-face research; attention regulation literature).',
  '{"During any face-to-face interaction, when baby breaks eye contact and looks away:","Stop all stimulation — speaking, moving, touching.","Wait quietly. 10–30 seconds is normal.","When baby turns back toward you, resume with a warm expression.","This is a skill for you, not the baby. The baby is already doing it correctly."}',
  5,
  'Gaze aversion is the infant''s primary self-regulatory tool. When caregivers wait and return, they teach the brain that the world is safe to re-engage with — foundational for attention and stress regulation.',
  4,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'quiet-alert-observation',
  'Quiet alert window observation',
  'cognitive',
  'attention',
  '0–12',
  'Attention system; environmental visual scanning; habituation',
  'Quiet alert state is the optimal state for visual processing and attention in neonates (Brazelton, 1973 — Neonatal Behavioral Assessment Scale; replicated in state-based infant research).',
  '{"Learn to recognise the quiet alert state: eyes open and bright, body still, breathing regular, not hungry or distressed.","When you see it, place baby in an infant seat or hold them reclined at 45 degrees facing a window.","Do nothing else — let them look.","Watch what they attend to, how long they sustain it, when they look away.","After a few minutes: gently bring your face into their visual field and see if they shift attention to you."}',
  5,
  'Environmental scanning during quiet alert state is active cognitive work — the infant''s attention system is calibrating visual salience, contrast, and novelty without any additional input required.',
  2,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'novel-object-pause',
  'Novel object pause',
  'cognitive',
  'attention',
  '6–12',
  'Dishabituation response; novelty detection; visual memory',
  'Dishabituation — increased attention to a novel stimulus after habituation to a familiar one — is a foundational measure of infant memory and cognitive processing (Fantz, 1963; Sokolov habituation theory; hundreds of replications).',
  '{"Hold one object in front of baby at ~25 cm during a quiet alert period.","Hold it still and let baby look until they look away.","Pause 10 seconds.","Bring out a second, different object.","Watch for renewed attention: wider eyes, re-engagement, possible stilling.","This renewed attention to the new item is the dishabituation response — direct evidence the brain remembers what it just saw."}',
  5,
  'Renewed attention to novelty is the brain signalling ''this is new'' — evidence the memory trace for the first object was encoded. You are watching memory and recognition in real time.',
  5,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'infant-massage',
  'Bedtime massage',
  'sleep',
  'sleep-routine',
  '0–52',
  'Parasympathetic (rest-and-digest) activation; lowered cortisol; increased vagal tone',
  'Slow, moderate-pressure infant massage is associated with reduced cortisol, increased parasympathetic (vagal) activity, and improved sleep onset and duration in infants. A consistent finding across infant-massage trials and reviews (e.g. Field and colleagues).',
  '{"Warm the room and warm a little plain oil in your hands first.","Work when baby is calm but awake, as part of the wind-down before sleep.","Use slow, firm-but-gentle strokes — legs and feet, then arms, then tummy in a clockwise circle.","Keep a steady rhythm and talk or hum quietly as you go.","Watch for cues: turning away, fussing or hiccups mean stop or slow down.","5–10 minutes is plenty. Keep lights low so it reads as wind-down, not play."}',
  8,
  'Slow, sustained touch activates the parasympathetic nervous system — the ''rest and digest'' branch — which lowers heart rate and stress hormones and shifts the body toward sleep. Doing it at the same point each evening also makes it a predictable cue that sleep is coming.',
  2,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_activities (id, title, domain, sub_domain, age_window_weeks, process_supported, evidence_basis, instructions, duration_minutes, why_it_works, week_recommended, sources, short_term_benefits, long_term_benefits, status, updated_by)
values (
  'white-noise',
  'White noise for settling',
  'sleep',
  'sleep-environment',
  '0–52',
  'Arousal masking; recreation of the constant intrauterine soundscape that supports sleep onset',
  'Continuous broadband (''white'') noise masks sudden environmental sounds that would otherwise trigger arousals, and approximates the constant low-frequency sound level of the womb. Newborns exposed to white noise have been shown to fall asleep faster than those settled in quiet.',
  '{"Use a steady, continuous white-noise sound (a dedicated machine, not a phone left within reach).","Place the source across the room — at least 2 metres from baby''s head, never in the cot.","Keep it quiet: around the level of a soft shower, not louder than about 50 dB.","Turn it on for naps and night sleep as part of the routine.","Turn it off when baby is awake and alert so they still get quiet, interactive time."}',
  0,
  'A constant, featureless sound hides the abrupt noises (a door, a sibling) that jolt a light-sleeping newborn awake, and echoes the ever-present whooshing they heard in the womb. Kept low and at a distance, it soothes without risking hearing.',
  1,
  '[]'::jsonb,
  '{}',
  '{}',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm01-face-detection',
  'Subcortical Face Detection',
  'sensory',
  null,
  0,
  0,
  2,
  'A subcortical circuit (superior colliculus → pulvinar) orients the newborn toward face-like patterns from birth, before any cortical face processing is possible. Operates on coarse, high-contrast configurations at ~25 cm — phylogenetically ancient, present in chicks too.',
  '{"Gaze drifts toward your face when held at chest distance","Tracks a face-like card slightly further than random patterns","Calms when a face is brought close and held still","Follows your face a short way as it moves from the side toward the middle"}',
  '{"mirror-face-time","bw-card-gallery","light-shadow"}',
  '[{"title":"Johnson MH (2011) — Face-sensitive cortical responses in early infancy","doi":"10.1080/17470218.2011.590596"},{"title":"Johnson MH (1999) — The development of visual attention in infancy","doi":"10.1037/h0087301"}]'::jsonb,
  'Did her gaze seem to find your face and stay there, even briefly?',
  'Sustained face-fixation > 8 seconds → cortical face processing likely emerging early; move to conversation-turn and slow-face activities sooner',
  'Johnson MH (2011) — Face-sensitive cortical responses in early infancy',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm02-vestibular-dominance',
  'Vestibular Dominance',
  'sensory',
  null,
  0,
  0,
  2,
  'The vestibular system (semicircular canals + otolith organs) is functional from ~20 weeks gestation — the most developmentally mature sensory system at birth. Rhythmic movement is the most reliable arousal regulator because of this. Vision is the least mature system at birth.',
  '{"Calms within 30–60 seconds of rhythmic rocking or walking","Moro reflex (full-body startle) triggered by sudden vestibular displacement","Settles more reliably in vertical carry than horizontal hold"}',
  '{"sway-narrate","varied-carrying","skin-to-skin"}',
  '[{"title":"Deng W et al. (2025) — Vestibular contributions to infant postural control","doi":"10.1097/PEP.0000000000001187"},{"title":"Anderson J (1986) — Sensory intervention with the preterm infant","doi":"10.5014/ajot.40.1.19"}]'::jsonb,
  'How quickly did she calm when you started swaying — under 1 minute, 1–3 minutes, or longer?',
  'Calms in < 30 seconds consistently → vestibular regulation maturing ahead of curve',
  'Deng W et al. (2025) — Vestibular contributions to infant postural control',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm03-prenatal-auditory-memory',
  'Prenatal Auditory Memory',
  'social-language',
  null,
  0,
  0,
  2,
  'Auditory cortex processes speech-like signals from ~28 weeks gestation. By birth the infant has prosodic templates of the caregiver''s voice and native language rhythm. This is recall, not learning. From soon after birth, babies also make small pre-speech lip and tongue movements when you talk to them.',
  '{"Preferential turning toward mother''s voice over a stranger''s","Stills or quiets to familiar songs and voices","Subtle orienting to familiar language vs. foreign language","Pre-speech lip and tongue movements when caregiver talks"}',
  '{"same-song","heartbeat-settling","hum-chest"}',
  '[{"title":"Kuhl PK et al. (2011) — Early language acquisition: neural substrates and theoretical models","doi":"10.1111/j.1467-7687.2010.00973.x"}]'::jsonb,
  'Did she seem to respond differently to this song vs. a new one — stilling, turning, or changing expression?',
  'Consistent orienting to voice at > 30 cm distance → auditory localisation ahead of curve',
  'Kuhl PK et al. (2011) — Early language acquisition: neural substrates and theoretical models',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm04-quiet-alert-state',
  'Quiet Alert State Lengthening',
  'cognitive',
  null,
  2,
  3,
  6,
  'The quiet alert state (eyes open, body still, cortex maximally receptive) lengthens from < 5 minutes at birth to 20–45+ minutes by week 6. All cortical learning depends on catching these windows. Duration increasing week-on-week is itself the milestone.',
  '{"Periods of calm, wide-eyed wakefulness without crying or feeding","Scanning the room or your face with apparent interest","Alert duration visibly longer than last week"}',
  '{"quiet-alert-observation","mirror-face-time","bw-card-gallery"}',
  '[{"title":"Adolph KE & Franchak JM (2017) — The development of motor behavior","doi":"10.1002/wcs.1430"}]'::jsonb,
  'How long was this quiet alert window — under 10 minutes, 10–30 minutes, or over 30 minutes?',
  'Alert windows > 30 minutes before week 4 → contingency detection (M08) likely accessible earlier',
  'Adolph KE & Franchak JM (2017) — The development of motor behavior',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm05-palmar-tactile-reflex',
  'Palmar & Tactile Reflex Integration',
  'sensory',
  null,
  2,
  4,
  8,
  'The palmar grasp reflex (present at birth) is subcortical. Around weeks 4–8, cortical motor pathways begin modulating it — the first step toward voluntary grasping. Each reflex activation fires a cortical-subcortical circuit. Texture stimulation activates mechanoreceptors (Meissner''s, Pacinian) calibrating the somatosensory cortex.',
  '{"Reflexive grip when finger placed in palm","Variable grip strength — sometimes firm, sometimes releases quickly","The grip is automatic — not yet a deliberate choice","Different facial reactions to different textures"}',
  '{"palmar-grasp","cloth-texture","scent-pairing"}',
  '[{"title":"Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling","doi":"10.1146/annurev-psych-010418-102836"}]'::jsonb,
  'When you placed your finger in her palm, did she grip it firmly and hold — or was it brief and loose?',
  'Strong sustained grip > 5 seconds before week 4 → corticospinal pathway maturation ahead of curve',
  'Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm06-social-smile',
  'Social Smile Emergence',
  'social-language',
  null,
  4,
  6,
  10,
  'The endogenous social smile marks the onset of cortical engagement with social stimuli. Prior smiles (weeks 0–4) are subcortical/REM-associated. The genuine social smile requires face recognition + cortically mediated positive affect — it''s the first reliable signal that the cortical face network is coming online.',
  '{"Smile specifically in response to your face (not a bright light or random stimulus)","Smile with eye contact, sometimes accompanied by vocalisation","Smile can be elicited repeatedly in the same interaction","Expression still vague around 1 month, progressing to a true social smile at about 5–6 weeks"}',
  '{"slow-face","conversation-turn","mirror-face-time"}',
  '[{"title":"Johnson MH (2011) — Face-sensitive cortical responses in early infancy","doi":"10.1080/17470218.2011.590596"}]'::jsonb,
  'Did she smile back at your face — a real smile, not just a grimace? Did she make eye contact while doing it?',
  'Social smile reliably before week 5 → unlock conversation-turn and facial-expression-copying activities earlier',
  'Johnson MH (2011) — Face-sensitive cortical responses in early infancy',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm07-smooth-pursuit',
  'Smooth Pursuit Emerges',
  'sensory',
  null,
  6,
  8,
  10,
  'Prior to ~6–8 weeks, visual tracking is saccadic (jerky catch-up movements). Smooth pursuit requires cortical involvement (frontal eye fields + MT/V5). Tracking widens with age — a short arc around 1 month, extending to follow an object across the midline both horizontally and vertically by about 3 months. A defensive blink is clearly present by 6–8 weeks.',
  '{"Eyes follow a slow-moving object continuously, not in jumps","Tracks past the body midline (earlier tracking stops at midline)","Brief tracking (2–3 seconds) at first, extending with age","Eyes come together (converge) as a toy approaches the face — around 3 months"}',
  '{"object-tracking","light-shadow","sway-narrate"}',
  '[{"title":"Johnson MH (2011) — Face-sensitive cortical responses in early infancy","doi":"10.1080/17470218.2011.590596"}]'::jsonb,
  'Did her eyes follow the toy smoothly as you moved it — or did her gaze jump to catch up with it?',
  'Tracks past midline before week 7 → unlock novel-object-pause activity earlier',
  'Johnson MH (2011) — Face-sensitive cortical responses in early infancy',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm08-contingency-detection',
  'Contingency Detection',
  'cognitive',
  null,
  8,
  10,
  12,
  'The infant discovers that their own action causes an effect. Rovee-Collier''s mobile studies: 3-month-olds learn within ~9 minutes that kicking moves a mobile, retain this for 3 days, and show specificity (only the same mobile cues retrieval). This is the root of intentional behaviour, agency, and problem-solving. Memory retention doubles by 6 months (14 days).',
  '{"Increased kicking or arm movements when a hanging toy responds","Pause-and-watch when the contingency stops unexpectedly","Visible excitement (increased motor activity) when cause-effect is active","Frustration or disengagement if contingency is removed"}',
  '{"contingency-mobile","attention-recovery","quiet-alert-observation"}',
  '[{"title":"Hill WL, Borovsky D & Rovee-Collier C (1988) — Continuities in infant memory development","doi":"10.1002/dev.420210104"},{"title":"Rovee-Collier C et al. (1985) — Reactivation of infant memory","doi":"10.1002/dev.420180611"}]'::jsonb,
  'Did she seem to notice when the mobile moved? Did she kick more, then look to see the effect?',
  'Clear cause-effect excitement before week 10 → unlock novel-object-pause; advance cognitive timeline by 1 week',
  'Hill WL, Borovsky D & Rovee-Collier C (1988) — Continuities in infant memory development',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm09-head-control',
  'Neck Extension & Head Control',
  'motor',
  null,
  4,
  8,
  12,
  'Head control is the postural foundation for everything downstream (Adolph''s cascade thesis). The typical progression: around 1 month the head turns to the side when lying on the tummy, arms and legs flexed; by ~3 months baby lifts head and upper chest on the forearms; by ~6 months lifts head and chest on extended arms with flat palms. The forearms→extended arms transition is the key 3-to-6-month marker.',
  '{"Briefly lifts head (1–2 seconds) when prone (from birth)","Head bobbing when held upright — attempting but losing control","Sustained head lift (3+ seconds) — milestone achieved","Forearm-supported lift at 3 months → extended-arm push-up by 6 months"}',
  '{"tummy-time-chest","sway-narrate","joint-compression","limb-movement"}',
  '[{"title":"Adolph KE & Hoch JE (2020) — Motor skill learning: to generalize or not to generalize","doi":"10.1159/000511511"},{"title":"Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling","doi":"10.1146/annurev-psych-010418-102836"}]'::jsonb,
  'Did she lift her head at all? If yes — briefly (under 3 seconds), for a few seconds, or held it up? Was she resting on her forearms or pushing up on her hands?',
  'Sustained 3-second hold before week 7, or pushing up on extended arms before week 12 → motor cascade accelerating; suggest varied-carrying progression sooner',
  'Adolph KE & Hoch JE (2020) — Motor skill learning: to generalize or not to generalize',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm10-reach-to-grasp',
  'Reach-to-Grasp Precursors',
  'motor',
  null,
  10,
  13,
  16,
  'Reaching requires integrating visual information (where is the object?) with proprioceptive information (where is my hand?) — a visuomotor calibration problem the brain solves over weeks. Hand regard appears around 3 months (baby watches their own hands), with two-handed reaching by about weeks 16–18. Each reach provides error-correction data — motor and perceptual learning happen simultaneously.',
  '{"Hand regard (around 3 months): watches their own hand movements, opens and closes fingers","Arm swipes toward hanging objects — not yet grabbing","Hand-to-mouth that seems volitional (not just reflex)","Around 6 months: a two-handed scooping approach; adjusts hand orientation to match an object''s shape"}',
  '{"cloth-texture","limb-movement","novel-object-pause"}',
  '[{"title":"Adolph KE & Franchak JM (2017) — The development of motor behavior","doi":"10.1002/wcs.1430"},{"title":"Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling","doi":"10.1146/annurev-psych-010418-102836"}]'::jsonb,
  'Did she reach toward or bat at the fabric, or were her movements near the object?',
  'Intentional contact grasp before week 12 → visuomotor integration accelerated; advance contingency-mobile complexity',
  'Adolph KE & Franchak JM (2017) — The development of motor behavior',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm11-cooing',
  'Cooing & Protoconversations',
  'social-language',
  null,
  6,
  8,
  12,
  'Cooing is the first volitional vocalisation — larynx, velum, and tongue produce vowel-like sounds under cortical control. By around 3 months, vocalisations are woven together with smiles, eye contact and hand gestures during turn-taking exchanges (''protoconversations'') — the full multimodal communication scaffold is in place by 3 months, not 6.',
  '{"Open-vowel sounds (\"aaah\", \"ooh\") in response to interaction","Back-and-forth vocal exchange with turn-taking structure emerging","Vocalisations while looking at your face — gaze + voice together","Pre-speech lip and tongue movements when you talk to them (from around 1 month)"}',
  '{"conversation-turn","reading-aloud","narrated-day","name-repetition"}',
  '[{"title":"Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness","doi":"10.3390/ijerph19031180"}]'::jsonb,
  'Did she make any sounds back at you — even a small "ooh" or sigh — during the pauses? Did she look at your face while doing it?',
  'Clear vocal turn-taking (waits, then vocalises) before week 10 → language circuit accelerating; advance voice-mapping and name-repetition',
  'Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm17-rolling',
  'Rolling',
  'motor',
  null,
  20,
  22,
  28,
  'Rolling is the first major self-generated locomotion — before crawling, the infant can change their own position and orientation. Front-to-back uses the extensor muscles trained by tummy time and emerges first; back-to-front requires oblique abdominal strength and rotation. Typically, rolling front-to-back appears at ~5–6 months and back-to-front at ~6–7 months.',
  '{"First rolls front-to-back (prone to supine) — often surprises them","Then back-to-front (supine to prone) — requires intentional trunk rotation","Using rolling to move across the floor (earliest locomotion)","Safety signal: may roll off surfaces if unsupervised from this point"}',
  '{"tummy-time-chest","varied-carrying","limb-movement"}',
  '[{"title":"Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling","doi":"10.1146/annurev-psych-010418-102836"}]'::jsonb,
  'Did she roll at all during or after tummy time — even a partial roll to her side?',
  'Rolling front-to-back before week 20 → trunk rotation ahead of curve; pulling-to-sit and sitting likely to follow sooner',
  'Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm18-fine-motor-sequence',
  'Fine Motor: Palmar → Inferior → Neat Pincer',
  'motor',
  null,
  20,
  24,
  52,
  'Fine motor follows a proximal-to-distal sequence — shoulder before elbow, elbow before wrist, wrist before finger differentiation. Each stage requires new corticospinal myelination. The neat pincer (thumb tip to index tip) marks the emergence of the uniquely human capacity for fine manipulation. This trajectory unfolds in well-documented stages around 6, 9, and 12 months.',
  '{"Stage 1 — Palmar grasp (wks 20–24): whole-hand closure; passes a toy hand to hand; adjusts wrist to object orientation (~6 months)","Stage 2 — Inferior pincer (wks 32–36): lateral thumb-to-finger; pokes with the index finger; grasps a string to pull a toy (~9 months)","Stage 3 — Neat pincer (wks 44–52): tip-to-tip opposition; the hand pre-shapes before contact; points with the index finger (~12 months)"}',
  '{"palmar-grasp","cloth-texture","novel-object-pause","limb-movement"}',
  '[{"title":"Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling","doi":"10.1146/annurev-psych-010418-102836"}]'::jsonb,
  'Did she pick up the object with her whole hand — or trying to use just her finger and thumb?',
  'Index finger isolation (poking behaviour) before week 30 → fine motor ahead of curve; introduce smaller objects and containers',
  'Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm12-sitting-with-support',
  'Sitting With Support',
  'motor',
  null,
  16,
  20,
  24,
  'Sitting requires continuous anticipatory and reactive postural adjustments — trunk and neck extensors working together dynamically. It radically changes the infant''s visual world (upright perspective) and frees both hands for object exploration. Adolph: sitting is a major developmental unlock — object manipulation and social interaction both expand dramatically.',
  '{"Holds sitting with light trunk support for > 10 seconds","Head stays upright during supported sitting","Reaches for objects while sitting — arms and hands now both free","Around 6 months: can turn the body to look sideways and stretch out to pick up a toy from the floor without losing balance"}',
  '{"varied-carrying","joint-compression","cloth-texture"}',
  '[{"title":"Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling","doi":"10.1146/annurev-psych-010418-102836"},{"title":"Adolph KE & Hoch JE (2020) — Motor skill learning: to generalize or not to generalize","doi":"10.1159/000511511"}]'::jsonb,
  'During supported sitting, how long before she toppled — under 5 seconds, 5–15 seconds, or held for longer?',
  'Stable sitting with minimal support before week 20 → accelerate object manipulation activities',
  'Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm13-phoneme-narrowing',
  'Phoneme Narrowing Sensitive Period',
  'social-language',
  null,
  24,
  28,
  52,
  'From ~6 months, the auditory cortex commits to native language phoneme categories — improving native contrasts, losing sensitivity to non-native ones. Measurable in theta-band auditory sampling on MEG. This is Kuhl''s most robust finding and the most time-sensitive window in the 0–12 month period. By around 9 months, expect canonical babbling strings like "dad-dad", "mum-mum", "agaga", plus understanding of "no" and their own name.',
  '{"Responds to own name from across a room (~6 months)","Canonical babbling begins: \"ba-ba\", \"ma-ma\" — not yet meaningful","Around 6 months: single and double syllables — \"muh\", \"goo\", \"der\", \"adah\"","Around 9 months: long repetitive strings of syllables; imitates playful sounds"}',
  '{"reading-aloud","narrated-day","same-song","name-repetition","outdoor-listening"}',
  '[{"title":"Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness","doi":"10.3390/ijerph19031180"},{"title":"Conboy BT & Kuhl PK (2011) — Early language experience affects neural activity","doi":"10.1111/j.1467-7687.2010.00973.x"}]'::jsonb,
  'Did she vocalise back, or watch your mouth intently while you were reading?',
  'Canonical babbling before week 24 → language circuit ahead of curve; increase variety and complexity of language exposure',
  'Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm14-object-permanence',
  'Object Permanence Precursors',
  'cognitive',
  null,
  20,
  22,
  32,
  'At 3 months, infant memory is context-dependent (only the same mobile reactivates it). By 6 months, memory is more generalised and durable (14-day retention). Object permanence builds on this improving memory system. Typical stages: around 6 months baby searches vaguely when a toy falls; around 9 months finds a partially hidden toy; around 12 months quickly finds a fully hidden toy and looks to an adult afterwards.',
  '{"Around 6 months: watches where a toy falls, searching vaguely when it drops out of view","Around 9 months: finds a toy partially hidden under a cover or cup","Around 12 months: quickly finds a toy hidden from view; looks to an adult after finding it","Anticipates the return of a hidden face (peek-a-boo engagement)"}',
  '{"novel-object-pause","contingency-mobile","attention-recovery"}',
  '[{"title":"Rovee-Collier C et al. (1985) — Reactivation of infant memory","doi":"10.1002/dev.420180611"}]'::jsonb,
  'When you covered the toy briefly, did she look toward where it had been — or immediately look away?',
  'Consistent search for hidden objects before week 24 → object permanence ahead of curve',
  'Rovee-Collier C et al. (1985) — Reactivation of infant memory',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm19-stranger-anxiety',
  'Stranger Anxiety & Social Referencing',
  'social-language',
  null,
  28,
  32,
  44,
  'Stranger anxiety marks a cognitive leap: the infant has built a detailed mental model of familiar faces, so any non-matching face triggers a distinct response. Social referencing (using caregiver''s expression to assess novel situations) emerges slightly later and is more sophisticated — the infant borrows the parent''s emotional judgment. Both are healthy markers of attachment and cognitive development.',
  '{"Stage 1 (wks 28–32): occasional shyness when strangers approach too closely or abruptly","Stage 2 (wks 32–40): clearly distinguishes strangers from familiars; clings to a known person; hides the face (~9 months)","Stage 3 (wks 36–44): social referencing — looks to caregiver''s face before approaching novel object or situation","Important: intensity varies widely by temperament; not a problem to fix, evidence of healthy attachment"}',
  '{"slow-face","conversation-turn","outdoor-listening","novel-object-pause"}',
  '[{"title":"Reddy V et al. (1997) — Communication in infancy: mutual regulation of affect and attention","doi":"10.1017/CBO9780511752773"}]'::jsonb,
  'Before touching something new or uncertain today, did she look at your face first — as if checking how you felt about it?',
  'Clear social referencing (look-back before novel approach) before week 36 → triadic social cognition developing rapidly; proto-declarative pointing likely to emerge sooner',
  'Reddy V et al. (1997) — Communication in infancy: mutual regulation of affect and attention',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm15-pulling-to-stand',
  'Pulling to Stand',
  'motor',
  null,
  32,
  38,
  44,
  'Standing requires solving a new balance problem — centre of mass over a narrow base, high above the ground. Adolph: this is active problem-solving; infants repeatedly try, fail, adjust, try again. Cultural practices (walkers vs. floor play) significantly affect timing. By around 9 months, baby pulls to standing and holds on for a few moments, but cannot yet lower themselves and tends to fall backwards with a bump.',
  '{"Pulls to stand holding furniture or your hands","Stands briefly before sitting back down (or falling)","\"Bouncing\" at standing — exploratory weight-shifting","Cruising: side-stepping while holding furniture"}',
  '{"varied-carrying","joint-compression"}',
  '[{"title":"Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling","doi":"10.1146/annurev-psych-010418-102836"}]'::jsonb,
  'Did she try to pull herself upright on anything today — your hands, furniture, you?',
  'Pulling to stand before week 32 → locomotion cascade (cruising, first steps) ahead of curve',
  'Adolph KE & Hoch JE (2019) — Motor development: embodied, embedded, enculturated, and enabling',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  'm16-first-words',
  'First Words & Joint Attention',
  'social-language',
  null,
  40,
  50,
  56,
  'First words emerge as phoneme narrowing matures. "Words" at this stage are context-dependent sound-meaning pairings. By around 12 months, babble takes on conversational cadences (jargon) — intonationally correct babble that precedes real words; comprehension runs ahead of production by 4–8 weeks. Proto-declarative pointing ("points to an object then looks back to the adult") is one of the most predictive early-language markers.',
  '{"Consistent sound-meaning pairing in context (\"ba\" for bottle)","Proto-declarative pointing: points at something and looks back at you for a reaction","Around 12 months: follows an adult''s gaze (joint visual attention)","Around 12 months: coordinated joint attention — actively switches between an object and the adult"}',
  '{"name-repetition","narrated-day","reading-aloud","conversation-turn"}',
  '[{"title":"Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness","doi":"10.3390/ijerph19031180"}]'::jsonb,
  'Did she use any consistent sound for a specific thing today? Or point at something and look back at you to check your reaction?',
  'Consistent name-sound pairing before week 40 → first words ahead of curve; increase naming and referential activities',
  'Mittag M & Kuhl PK et al. (2022) — Early language skills predict school readiness',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  's01-circadian-onset',
  'Circadian Rhythm Onset',
  'sleep',
  'achievement',
  6,
  10,
  16,
  'A newborn has no internal day/night clock — sleep is distributed evenly around the clock in ~3–4 hour bouts. Between roughly weeks 6 and 12 an endogenous circadian rhythm emerges: melatonin secretion and the core body-temperature rhythm begin cycling with the 24-hour day, driven by regular light/dark and feeding cues. Night sleep starts to consolidate into longer stretches and daytime alertness lengthens. This is the biological basis of "sleeping through" later on.',
  '{"Longer unbroken stretches of sleep at night than during the day","More consistent, longer alert periods in daylight","Earlier and more predictable evening settling","A dawning difference between night feeds (quiet, brief) and day feeds (alert)"}',
  '{"water-sound-bath","white-noise","hum-chest"}',
  '[{"title":"Rivkees SA (2003) — Developing circadian rhythmicity in infants","doi":"verify"},{"title":"McGraw K, Hoffmann R, Harker C & Herman JH (1999) — The development of circadian rhythms in a human infant","doi":"verify"}]'::jsonb,
  'Is she starting to sleep a noticeably longer stretch at night than in any single daytime nap?',
  'Bright light and activity by day, dark and calm by night, plus a consistent wind-down (bath → massage → feed) accelerates this rhythm. Avoid stimulating light at night feeds.',
  'Rivkees SA (2003) — Developing circadian rhythmicity in infants',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  's02-four-month-regression',
  'Sleep-Cycle Maturation (the "4-month regression")',
  'sleep',
  'disruption',
  12,
  16,
  22,
  'Around 3–4 months, sleep architecture matures from the newborn two-state pattern (active vs quiet sleep) into adult-like cycles with distinct NREM stages and REM. Cycles are short (~35–50 minutes) and the baby now briefly surfaces toward waking at the end of each one. This is a permanent developmental gain, not a true "regression" — but because the baby wakes between cycles and has not yet learned to resettle unaided, night wakings and short naps suddenly increase. It typically eases as self-settling develops.',
  '{"A sudden increase in night wakings after a period of longer sleep","Naps shortening to a single sleep cycle (~35–45 minutes)","Waking fully between cycles and needing help to resettle","Often coincides with new alertness, rolling attempts and more feeding"}',
  '{"white-noise","infant-massage","water-sound-bath"}',
  '[{"title":"de Weerd AW & van den Bossche RAS (2003) — The development of sleep during the first months of life","doi":"verify"},{"title":"Grigg-Damberger MM (2016) — The visual scoring of sleep in infants 0 to 2 months of age","doi":"verify"}]'::jsonb,
  'Have the night wakings increased recently even though nothing else obvious changed — teething, illness, feeding?',
  'What helps: keep the wind-down routine consistent, use white noise across sleep cycles, and give a beat before responding to a stir so she has room to resettle herself. This is a phase — it passes as self-settling matures.',
  'de Weerd AW & van den Bossche RAS (2003) — The development of sleep during the first months of life',
  'published',
  'seed'
)
on conflict (id) do nothing;

insert into public.content_milestones (id, name, domain, kind, week_start, week_peak, week_end, mechanism, parent_can_see, activity_ids, resources, check_in, accelerator, latest_research, status, updated_by)
values (
  's03-eight-month-disruption',
  'Eight-Month Sleep Disruption',
  'sleep',
  'disruption',
  32,
  36,
  44,
  'A convergence of developmental gains disrupts sleep around 8–10 months. Object permanence (M14) now means the baby knows you still exist when you leave — so bedtime separation is protested. Separation anxiety peaks in the same window. Simultaneously, major motor skills (crawling, pulling to stand) are being consolidated, and the brain rehearses them during sleep, driving wakings and practice in the cot. Naps are often dropping from three to two. None of it is a step backward — it is several forward steps landing at once.',
  '{"New resistance and clinginess at bedtime and on waking","Waking in the night and calling specifically for you, not just fussing","Practising crawling or standing in the cot instead of settling","Fought or shortened naps as a nap transition approaches"}',
  '{"hum-chest","infant-massage","water-sound-bath"}',
  '[{"title":"Scher A (2005) — Infant sleep at 10 months of age as a window to cognitive development","doi":"verify"},{"title":"Atkinson E, Vetere A & Grayson K (1995) — Separation anxiety and night waking in infancy","doi":"verify"}]'::jsonb,
  'Is the bedtime resistance new, and does it come with more daytime clinginess or separation upset?',
  'What helps: a predictable, unhurried bedtime routine; brief reassuring check-ins rather than long interventions; and plenty of daytime practice of the new motor skill so it is less "rehearsed" at night. Eases as separation anxiety settles.',
  'Scher A (2005) — Infant sleep at 10 months of age as a window to cognitive development',
  'published',
  'seed'
)
on conflict (id) do nothing;

commit;


export const templates = {
  "mens-bulking": {
    id: "mens-bulking",
    name: "Men's Bulking Program",
    description: "Assess potential clients for muscle-building coaching",
    icon: "💪",
    defaultHeadline: "ARE YOU READY TO BUILD SERIOUS MUSCLE?",
    defaultSubheadline:
      "Take this 2-minute assessment to find out where you stand and what's holding you back from the gains you deserve.",
    defaultColors: {
      primary: "#ff4d4d",
      secondary: "#ff7b00",
    },
    categories: [
      {
        name: "Goals & Commitment",
        icon: "🎯",
        questions: [
          {
            text: "What's your primary goal right now?",
            options: [
              { label: "I just want to look better — nothing specific", points: 1 },
              { label: "I want to put on some size but haven't planned it out", points: 2 },
              { label: "I'm doing a dedicated bulk with a target weight", points: 3 },
              { label: "I have a specific mass-gain plan with timelines and milestones", points: 4 },
              { label: "I'm fully committed to a structured off-season bulk with coaching goals", points: 5 },
            ],
          },
          {
            text: "How committed are you to gaining muscle in the next 12 weeks?",
            options: [
              { label: "I'm interested but keep putting it off", points: 1 },
              { label: "I want to but I'm not sure I can stay consistent", points: 2 },
              { label: "I'm ready — I just need the right guidance", points: 3 },
              { label: "I'm all in — nothing is going to stop me", points: 4 },
              { label: "I've already cleared my schedule and I'm investing fully", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Training Experience",
        icon: "🏋️",
        questions: [
          {
            text: "How long have you been lifting consistently?",
            options: [
              { label: "I haven't started yet or I'm very on-and-off", points: 1 },
              { label: "Less than 6 months of consistent training", points: 2 },
              { label: "6 months to 2 years — building a solid base", points: 3 },
              { label: "2-5 years — I know my way around the gym", points: 4 },
              { label: "5+ years — training is a non-negotiable part of my life", points: 5 },
            ],
          },
          {
            text: "Do you follow a structured hypertrophy program?",
            options: [
              { label: "No — I just do whatever I feel like each day", points: 1 },
              { label: "Sort of — I have a rough split but no progression plan", points: 2 },
              { label: "Yes — I follow a program I found online", points: 3 },
              { label: "Yes — a periodized program designed for muscle growth", points: 4 },
              { label: "Yes — custom programming with progressive overload tracked weekly", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Nutrition & Diet",
        icon: "🍗",
        questions: [
          {
            text: "Are you currently eating in a calorie surplus to support muscle growth?",
            options: [
              { label: "I have no idea what my calorie intake is", points: 1 },
              { label: "I try to eat more but I'm not tracking anything", points: 2 },
              { label: "I roughly track calories and aim for a surplus", points: 3 },
              { label: "I'm in a calculated surplus with macros dialed in", points: 4 },
              { label: "Surplus is precise, I adjust weekly based on scale + progress photos", points: 5 },
            ],
          },
          {
            text: "How consistently do you hit your daily protein target?",
            options: [
              { label: "I don't know what my protein target should be", points: 1 },
              { label: "Rarely — maybe 1-2 days a week", points: 2 },
              { label: "Most days — around 4-5 days a week", points: 3 },
              { label: "Almost every day — I prioritize protein at every meal", points: 4 },
              { label: "Every single day — protein intake is non-negotiable", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Recovery & Lifestyle",
        icon: "😴",
        questions: [
          {
            text: "How many hours of quality sleep do you get per night?",
            options: [
              { label: "Less than 5 hours — I'm running on fumes", points: 1 },
              { label: "5-6 hours — not great but I manage", points: 2 },
              { label: "6-7 hours — decent but inconsistent", points: 3 },
              { label: "7-8 hours most nights — sleep is a priority", points: 4 },
              { label: "8+ hours consistently — I've optimized my sleep environment", points: 5 },
            ],
          },
          {
            text: "Do you currently have any form of coaching or accountability?",
            options: [
              { label: "None — it's just me and my willpower", points: 1 },
              { label: "A gym buddy who sometimes checks in", points: 2 },
              { label: "An online community or forum I participate in", points: 3 },
              { label: "I've had coaching before and know the value", points: 4 },
              { label: "I'm actively looking for a coach to take me to the next level", points: 5 },
            ],
          },
        ],
      },
    ],
    tiers: [
      {
        name: "Just Getting Started",
        minPct: 0,
        warmth: "cold",
        description:
          "You're at the beginning of your muscle-building journey — and that's exactly the right place to start. With the right guidance, structured training, and nutrition plan, you'll see results faster than you think.",
        recommendations: [
          "Start with a simple 3-day full-body program focused on compound lifts like squats, bench press, and rows to build a strength foundation.",
          "Calculate your maintenance calories and add 300-500 calories per day with at least 0.8g of protein per pound of bodyweight to fuel muscle growth.",
          "Prioritize learning proper form on the big lifts before chasing heavy weight — recording your sets on video is a free way to self-check technique.",
        ],
      },
      {
        name: "Building Foundation",
        minPct: 26,
        warmth: "warm",
        description:
          "You've got some habits forming but there are clear gaps holding you back. Your training or nutrition (or both) need tightening up. A coach would fill in the blanks and accelerate your progress significantly.",
        recommendations: [
          "Switch from random workouts to a structured push/pull/legs or upper/lower split with built-in progressive overload each week.",
          "Start tracking your protein intake daily using a free app — hitting your protein target consistently is the single biggest nutrition lever for building muscle.",
          "Add 2-3 minutes of rest between heavy compound sets to maximize strength output and muscle recruitment per session.",
        ],
      },
      {
        name: "Making Progress",
        minPct: 51,
        warmth: "hot",
        description:
          "You're doing a lot right — but you've probably noticed gains slowing down. This is the plateau zone where strategic coaching makes the biggest difference. Fine-tuning your approach will unlock your next level.",
        recommendations: [
          "Implement a periodized training block with a dedicated hypertrophy phase (8-12 reps) followed by a strength phase (4-6 reps) to break through your plateau.",
          "Cycle your calorie surplus with higher intake on training days and maintenance on rest days to maximize muscle gain while minimizing fat accumulation.",
          "Add targeted weak-point training by including isolation work for lagging muscle groups at the end of your sessions twice per week.",
        ],
      },
      {
        name: "Ready to Transform",
        minPct: 76,
        warmth: "fire",
        description:
          "Your discipline is rare. You have the habits, the consistency, and the drive. At this level, expert coaching isn't about motivation — it's about optimization. The marginal gains that separate good from exceptional.",
        recommendations: [
          "Dial in advanced programming variables like tempo manipulation, mechanical drop sets, and intra-set stretching to drive hypertrophy past your genetic baseline.",
          "Schedule a DEXA scan or hydrostatic body composition test every 8 weeks to track lean mass vs. fat changes with precision instead of relying on the scale alone.",
          "Optimize your peri-workout nutrition with fast-digesting carbs and protein timed around your training window to maximize muscle protein synthesis and recovery.",
        ],
      },
    ],
  },

  "womens-toning": {
    id: "womens-toning",
    name: "Women's Toning & Weight Loss",
    description: "Assess potential clients for body transformation coaching",
    icon: "✨",
    defaultHeadline: "DISCOVER YOUR FITNESS POTENTIAL",
    defaultSubheadline:
      "Take this quick assessment to uncover what's really holding you back — and get a clear picture of where you stand right now.",
    defaultColors: {
      primary: "#e855a0",
      secondary: "#c44dff",
    },
    categories: [
      {
        name: "Goals & Motivation",
        icon: "🎯",
        questions: [
          {
            text: "What's your #1 fitness goal right now?",
            options: [
              { label: "I just want to feel better about myself — nothing specific", points: 1 },
              { label: "I want to lose some weight but don't have a plan", points: 2 },
              { label: "I have a clear goal (tone up, lose X kg, fit into X)", points: 3 },
              { label: "I have a specific goal with a timeline and I'm ready to commit", points: 4 },
              { label: "I'm fully committed and looking for expert guidance to get there", points: 5 },
            ],
          },
          {
            text: "What's your biggest motivation for wanting to change?",
            options: [
              { label: "I've been thinking about it but haven't taken action yet", points: 1 },
              { label: "I'm tired of feeling uncomfortable in my own skin", points: 2 },
              { label: "I want to build confidence and feel strong", points: 3 },
              { label: "I have an event/deadline and I'm determined to show up differently", points: 4 },
              { label: "I'm done waiting — I'm ready to invest in myself right now", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Current Routine",
        icon: "🏃‍♀️",
        questions: [
          {
            text: "How many days per week are you currently exercising?",
            options: [
              { label: "0-1 days — I'm barely moving", points: 1 },
              { label: "2 days — some activity but not consistent", points: 2 },
              { label: "3-4 days — I've got a decent routine going", points: 3 },
              { label: "4-5 days — exercise is part of my weekly rhythm", points: 4 },
              { label: "5-6 days — training is a non-negotiable habit", points: 5 },
            ],
          },
          {
            text: "Do you follow a structured workout plan?",
            options: [
              { label: "No — I just do random workouts or classes", points: 1 },
              { label: "I follow along with YouTube/Instagram workouts", points: 2 },
              { label: "I have a general plan but it's not periodized", points: 3 },
              { label: "I follow a structured program designed for my goals", points: 4 },
              { label: "I have a fully customized plan and I track every session", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Nutrition Habits",
        icon: "🥗",
        questions: [
          {
            text: "How would you describe your current eating habits?",
            options: [
              { label: "All over the place — I eat what's convenient", points: 1 },
              { label: "I try to eat healthy but I'm not consistent", points: 2 },
              { label: "I'm fairly mindful of what I eat but don't track", points: 3 },
              { label: "I loosely track calories and make intentional food choices", points: 4 },
              { label: "My nutrition is dialed in — calories and macros are on point", points: 5 },
            ],
          },
          {
            text: "How's your relationship with food?",
            options: [
              { label: "I constantly feel guilty about eating — it stresses me out", points: 1 },
              { label: "I go through restrict-binge cycles pretty regularly", points: 2 },
              { label: "It's okay — some good days, some bad days", points: 3 },
              { label: "Pretty healthy — I enjoy food without obsessing", points: 4 },
              { label: "Great — I fuel my body intentionally and enjoy the process", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Mindset & Readiness",
        icon: "🧠",
        questions: [
          {
            text: "How do you handle setbacks (missed workouts, off-plan eating)?",
            options: [
              { label: "I spiral — one bad day turns into a bad week or month", points: 1 },
              { label: "I get really discouraged and it takes me a while to recover", points: 2 },
              { label: "I bounce back within a day or two", points: 3 },
              { label: "I don't let it bother me — one day doesn't define the journey", points: 4 },
              { label: "I analyze what happened and adjust — setbacks are data, not failure", points: 5 },
            ],
          },
          {
            text: "Would you invest in coaching if it meant guaranteed accountability and faster results?",
            options: [
              { label: "I'm not sure I'm ready for that yet", points: 1 },
              { label: "Maybe — if the price was right", points: 2 },
              { label: "I've been thinking about it seriously", points: 3 },
              { label: "Yes — I know I need help and I'm ready to commit", points: 4 },
              { label: "Absolutely — I'm actively looking for the right coach right now", points: 5 },
            ],
          },
        ],
      },
    ],
    tiers: [
      {
        name: "Just Getting Started",
        minPct: 0,
        warmth: "cold",
        description:
          "You're at the beginning — and that takes courage to admit. The good news? You have the most room for change, and small shifts in your routine will create the biggest visible results.",
        recommendations: [
          "Commit to just 3 workouts per week of 30 minutes each — consistency with a small commitment beats sporadic intense sessions every time.",
          "Start by adding one serving of protein to each meal (eggs at breakfast, chicken at lunch, fish at dinner) before worrying about counting every calorie.",
          "Schedule your workouts like appointments in your calendar so they become non-negotiable parts of your week rather than things you squeeze in if you have time.",
        ],
      },
      {
        name: "Building Foundation",
        minPct: 26,
        warmth: "warm",
        description:
          "You have some good habits but inconsistency is holding you back. You know what to do but struggle to do it consistently. The right support system would change everything for you.",
        recommendations: [
          "Prep your meals for the week every Sunday to remove daily decision fatigue — having healthy food ready to grab is the number one consistency hack.",
          "Replace one cardio-only session per week with resistance training to build lean muscle, which raises your resting metabolism and accelerates fat loss long-term.",
          "Set a weekly check-in habit where you take a progress photo and log your measurements — visible progress is the strongest motivator when willpower fades.",
        ],
      },
      {
        name: "Making Progress",
        minPct: 51,
        warmth: "hot",
        description:
          "You're putting in the work and it shows. But you've hit that frustrating plateau where effort doesn't match results. This is exactly where expert guidance makes the biggest difference.",
        recommendations: [
          "Introduce progressive overload by increasing weight, reps, or sets each week in your strength exercises — doing the same workout repeatedly is the top reason for plateaus.",
          "Swap your current deficit for a reverse diet by slowly increasing calories over 4-6 weeks to reset your metabolism before starting a fresh fat-loss phase.",
          "Add one HIIT session and one active recovery session (yoga or walking) per week to your existing routine to break through the body composition stall.",
        ],
      },
      {
        name: "Ready to Transform",
        minPct: 76,
        warmth: "fire",
        description:
          "Your dedication is impressive. You have the discipline and the drive — now it's about precision. A coach at this stage becomes your strategist, helping you optimize every detail for maximum results.",
        recommendations: [
          "Fine-tune your macros by cycling carbohydrates — higher carbs on heavy training days and lower carbs on rest days — to optimize body composition without losing energy.",
          "Incorporate periodized training blocks that alternate between muscle-building phases and metabolic conditioning phases every 4-6 weeks for continuous adaptation.",
          "Prioritize sleep quality by establishing a consistent bedtime routine and aiming for 7-8 hours — sleep is the most underrated factor in body recomposition at your level.",
        ],
      },
    ],
  },

  "cutting-shredding": {
    id: "cutting-shredding",
    name: "Cutting & Shredding",
    description: "Assess readiness for a structured fat loss / cutting phase",
    icon: "🔥",
    defaultHeadline: "ARE YOU READY TO GET SHREDDED?",
    defaultSubheadline:
      "Find out if you have the habits, discipline, and knowledge to execute a successful cut — or where you need to tighten up.",
    defaultColors: {
      primary: "#00d4aa",
      secondary: "#00b4d8",
    },
    categories: [
      {
        name: "Body Awareness",
        icon: "📊",
        questions: [
          {
            text: "Do you know your approximate body fat percentage?",
            options: [
              { label: "No idea — I've never thought about it", points: 1 },
              { label: "I have a rough guess but I've never measured", points: 2 },
              { label: "I've estimated using online tools or photos", points: 3 },
              { label: "I've had it measured (calipers, DEXA, etc.)", points: 4 },
              { label: "I track body composition regularly and know my trends", points: 5 },
            ],
          },
          {
            text: "What's your realistic timeline for this cut?",
            options: [
              { label: "I want to be shredded in 2 weeks (unrealistic but hopeful)", points: 1 },
              { label: "A month or so — I want fast results", points: 2 },
              { label: "8-12 weeks — I understand it takes time", points: 3 },
              { label: "12-16 weeks — I'm planning a proper structured cut", points: 4 },
              { label: "As long as it takes — I'm prioritizing doing it right over doing it fast", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Diet Discipline",
        icon: "🥩",
        questions: [
          {
            text: "Can you stick to a calorie deficit consistently?",
            options: [
              { label: "I've never successfully maintained a deficit for more than a few days", points: 1 },
              { label: "I can do it during the week but weekends destroy me", points: 2 },
              { label: "I'm decent — I can stick to it most of the time", points: 3 },
              { label: "I've successfully cut before and maintained discipline for weeks", points: 4 },
              { label: "Dieting is second nature — I track everything and adjust weekly", points: 5 },
            ],
          },
          {
            text: "How do you handle hunger and cravings during a cut?",
            options: [
              { label: "I cave almost immediately — willpower isn't my strength", points: 1 },
              { label: "I try to resist but usually give in by evening", points: 2 },
              { label: "I have strategies (high-volume foods, protein, etc.) that help", points: 3 },
              { label: "I manage well — hunger doesn't control my decisions", points: 4 },
              { label: "I thrive in a deficit — I have a full toolkit of strategies", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Training During a Cut",
        icon: "💪",
        questions: [
          {
            text: "How will your training change during a calorie deficit?",
            options: [
              { label: "I'll probably just do more cardio and skip weights", points: 1 },
              { label: "I'll keep lifting but probably reduce intensity a lot", points: 2 },
              { label: "I'll maintain my current program and add some cardio", points: 3 },
              { label: "I'll keep intensity high, reduce volume slightly, and add strategic cardio", points: 4 },
              { label: "I have a specific cut-phase training plan with periodized cardio and lifting", points: 5 },
            ],
          },
          {
            text: "How do you handle energy drops during a deficit?",
            options: [
              { label: "I skip workouts when I feel tired — which is often", points: 1 },
              { label: "I push through but my performance drops significantly", points: 2 },
              { label: "I adjust expectations and focus on showing up consistently", points: 3 },
              { label: "I use strategic refeeds and deloads to manage energy", points: 4 },
              { label: "I've dialed in meal timing, sleep, and supplements to stay sharp", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Mindset & Investment",
        icon: "🧠",
        questions: [
          {
            text: "Have you done a structured cut before?",
            options: [
              { label: "No — this would be my first attempt", points: 1 },
              { label: "I've tried but never finished or got the results I wanted", points: 2 },
              { label: "I've done one with moderate success", points: 3 },
              { label: "I've done multiple successful cuts and I know the process", points: 4 },
              { label: "I'm experienced but want expert guidance to get to the next level", points: 5 },
            ],
          },
          {
            text: "Are you ready to invest in coaching for this cut?",
            options: [
              { label: "I'm just browsing — not sure I need a coach", points: 1 },
              { label: "Maybe — depends on what's offered", points: 2 },
              { label: "I'm seriously considering it", points: 3 },
              { label: "Yes — I want someone to manage the process for me", points: 4 },
              { label: "I'm ready to start immediately — take my money", points: 5 },
            ],
          },
        ],
      },
    ],
    tiers: [
      {
        name: "Just Getting Started",
        minPct: 0,
        warmth: "cold",
        description:
          "A cut might not be the right move yet. Building better baseline habits first will set you up for a much more successful shred when the time is right. A coach can help you build that foundation.",
        recommendations: [
          "Spend 2-4 weeks tracking your current food intake without changing anything so you know your true maintenance calories before attempting a deficit.",
          "Build the habit of hitting the gym at least 4 days per week with a basic strength program — you need a training foundation before a cut will produce visible results.",
          "Get your sleep to a consistent 7+ hours per night first, because cutting on poor sleep massively increases muscle loss and hunger hormones.",
        ],
      },
      {
        name: "Building Foundation",
        minPct: 26,
        warmth: "warm",
        description:
          "You have some of the pieces but a cut will be challenging without more structure. The discipline gaps in your nutrition or training will become magnified in a deficit. Coaching would prevent the common mistakes.",
        recommendations: [
          "Set a moderate deficit of 300-500 calories below maintenance and commit to it for 4 straight weeks before adjusting — patience beats aggressive restriction every time.",
          "Create a weekend meal plan just as detailed as your weekday plan, since unstructured weekends are the most common place where cuts fall apart.",
          "Keep your protein at 1g per pound of bodyweight daily to preserve muscle mass while in a deficit — this is non-negotiable during a cut.",
        ],
      },
      {
        name: "Making Progress",
        minPct: 51,
        warmth: "hot",
        description:
          "You're in a solid position to start a cut. Your habits are decent but expert guidance will help you preserve muscle, manage energy, and actually get to the finish line instead of falling off at week 6.",
        recommendations: [
          "Maintain your current lifting intensity and volume as long as possible during the cut — only reduce volume when recovery genuinely suffers, not preemptively.",
          "Add 2-3 low-intensity cardio sessions (brisk walking for 30-45 minutes) per week as your primary tool for increasing energy expenditure instead of slashing more calories.",
          "Plan a structured refeed day every 10-14 days with carbs at maintenance level to replenish glycogen, boost leptin, and keep training performance from tanking.",
        ],
      },
      {
        name: "Ready to Transform",
        minPct: 76,
        warmth: "fire",
        description:
          "You clearly know what you're doing. At your level, coaching is about optimization — dialing in the details that separate a good cut from a competition-level transformation.",
        recommendations: [
          "Implement a diet break protocol — 1-2 weeks at maintenance calories every 6-8 weeks of dieting — to prevent metabolic adaptation and keep fat loss moving.",
          "Use weekly average weigh-ins instead of daily fluctuations to make data-driven decisions about when to adjust calories, cardio, or refeed frequency.",
          "Dial in your sodium, water, and fiber intake to manage bloating and water retention so your physique changes are visible and trackable throughout the cut.",
        ],
      },
    ],
  },

  "training-style": {
    id: "training-style",
    name: "Training Style Finder",
    description: "Help followers discover their ideal training methodology",
    icon: "🏆",
    defaultHeadline: "FIND YOUR PERFECT TRAINING STYLE",
    defaultSubheadline:
      "Answer 8 quick questions to discover whether powerlifting, calisthenics, CrossFit, or general fitness is the best fit for your personality and goals.",
    defaultColors: {
      primary: "#ffd700",
      secondary: "#ff8c00",
    },
    categories: [
      {
        name: "Personality & Preferences",
        icon: "🧬",
        questions: [
          {
            text: "What excites you most about training?",
            options: [
              { label: "Being part of a group and the community atmosphere", points: 1 },
              { label: "Mastering my own bodyweight and movement skills", points: 2 },
              { label: "Getting stronger and hitting new PRs on the barbell", points: 3 },
              { label: "Looking good, feeling healthy, and staying balanced", points: 4 },
              { label: "The competitive aspect — testing myself against others", points: 5 },
            ],
          },
          {
            text: "How do you prefer to train?",
            options: [
              { label: "In a class or group setting with an instructor", points: 1 },
              { label: "Solo — just me and the pull-up bar / park", points: 2 },
              { label: "Alone in a gym with a barbell and heavy plates", points: 3 },
              { label: "A mix of everything — I like variety", points: 4 },
              { label: "Whatever gets me results the fastest", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Goals & Priorities",
        icon: "🎯",
        questions: [
          {
            text: "If you could only pick one fitness quality to optimize, what would it be?",
            options: [
              { label: "Raw strength — I want to lift the heaviest weights possible", points: 1 },
              { label: "Body control — handstands, muscle-ups, agility", points: 2 },
              { label: "Overall fitness — strength, cardio, flexibility, everything", points: 3 },
              { label: "Aesthetics — I want to look my absolute best", points: 4 },
              { label: "Athletic performance — I want to be good at everything", points: 5 },
            ],
          },
          {
            text: "What's your stance on cardio and conditioning?",
            options: [
              { label: "Cardio is essential — I love high-intensity conditioning", points: 1 },
              { label: "I incorporate it but strength comes first", points: 2 },
              { label: "I do what's needed for my goals — nothing more", points: 3 },
              { label: "I prefer movement-based cardio (walking, sports, flows)", points: 4 },
              { label: "I avoid traditional cardio entirely — just lift", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Experience & Equipment",
        icon: "🔧",
        questions: [
          {
            text: "What equipment do you have access to?",
            options: [
              { label: "Just my body — no gym, no equipment", points: 1 },
              { label: "Basic home setup (pull-up bar, bands, dumbbells)", points: 2 },
              { label: "A well-equipped commercial gym", points: 3 },
              { label: "A CrossFit box or functional fitness facility", points: 4 },
              { label: "A powerlifting / strength-focused gym with specialty bars", points: 5 },
            ],
          },
          {
            text: "How much time can you dedicate per training session?",
            options: [
              { label: "20-30 minutes — I'm short on time", points: 1 },
              { label: "30-45 minutes — efficient sessions", points: 2 },
              { label: "45-60 minutes — standard length", points: 3 },
              { label: "60-90 minutes — I like thorough sessions", points: 4 },
              { label: "90+ minutes — training is a major part of my day", points: 5 },
            ],
          },
        ],
      },
      {
        name: "Commitment & Coaching",
        icon: "📈",
        questions: [
          {
            text: "How serious are you about committing to a specific training style?",
            options: [
              { label: "Just curious — I'm exploring options", points: 1 },
              { label: "Somewhat interested — I'd like to try something new", points: 2 },
              { label: "Pretty serious — I want to go all-in on the right style", points: 3 },
              { label: "Very serious — I'm ready to specialize and get coached", points: 4 },
              { label: "Dead serious — I want a coach who specializes in my ideal style", points: 5 },
            ],
          },
          {
            text: "Have you worked with a coach or followed structured programming before?",
            options: [
              { label: "Never — I've always done my own thing", points: 1 },
              { label: "I've followed free programs online", points: 2 },
              { label: "I've done a group coaching program or challenge", points: 3 },
              { label: "I've had 1-on-1 coaching before and I know the value", points: 4 },
              { label: "I'm currently looking for specialized coaching", points: 5 },
            ],
          },
        ],
      },
    ],
    tiers: [
      {
        name: "Just Getting Started",
        minPct: 0,
        warmth: "cold",
        description:
          "You're exploring and that's great. Figuring out your ideal training style early will save you months of wasted effort. A coach can help you find the right fit from day one.",
        recommendations: [
          "Try at least 3 different training styles (strength training, bodyweight work, group fitness) over the next month to discover what genuinely excites you.",
          "Focus on building a base of general strength and mobility for 4-6 weeks before specializing — a strong foundation makes every training style more effective.",
          "Join a beginner class or hire a coach for a single introductory session in the style that interests you most to learn proper fundamentals from the start.",
        ],
      },
      {
        name: "Building Foundation",
        minPct: 26,
        warmth: "warm",
        description:
          "You have some experience but haven't fully committed to a style yet. Getting clear on your strengths and preferences will help you progress much faster.",
        recommendations: [
          "Pick the one training style you enjoy most and commit to following a structured program in it for at least 8 consecutive weeks before evaluating results.",
          "Set 2-3 specific performance benchmarks for your chosen style (a target lift, a skill to unlock, or a WOD time to beat) to give your training clear direction.",
          "Reduce program-hopping by unsubscribing from fitness accounts that promote conflicting training methods — focused input leads to focused output.",
        ],
      },
      {
        name: "Making Progress",
        minPct: 51,
        warmth: "hot",
        description:
          "You know what you like and you're putting in the work. Now it's about refining your approach and getting expert programming tailored to your chosen style.",
        recommendations: [
          "Invest in style-specific programming by following a coach who specializes in your chosen discipline rather than generic fitness plans that try to do everything.",
          "Identify your biggest technical weakness within your style and dedicate 15-20 minutes of focused skill work to it at the start of every session for the next month.",
          "Start tracking your performance metrics weekly (lifts, times, skills achieved) so you can spot stalls early and adjust programming before frustration sets in.",
        ],
      },
      {
        name: "Ready to Transform",
        minPct: 76,
        warmth: "fire",
        description:
          "You're dialed in and ready for specialized coaching. At your level, the right coach will help you break through plateaus and achieve things you didn't think were possible.",
        recommendations: [
          "Seek out a coach with competitive experience or advanced certifications in your specific training style to access the high-level programming that generic coaches cannot provide.",
          "Structure your training year into mesocycles with distinct goals (strength block, skill block, competition prep) to drive continuous progress instead of grinding the same routine.",
          "Align your nutrition, recovery, and accessory work specifically to the demands of your chosen style — what fuels a powerlifter is different from what fuels a CrossFit athlete.",
        ],
      },
    ],
  },
};

export function getTemplateList() {
  return Object.values(templates).map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    icon: t.icon,
    questionCount: t.categories.reduce((sum, cat) => sum + cat.questions.length, 0),
    categoryCount: t.categories.length,
    defaultColors: t.defaultColors,
  }));
}

export function getTemplate(id) {
  return templates[id] || null;
}

export function mergeTemplate(baseTemplate, customizations = {}) {
  return {
    ...baseTemplate,
    defaultHeadline: customizations.headline || baseTemplate.defaultHeadline,
    defaultSubheadline: customizations.subheadline || baseTemplate.defaultSubheadline,
    defaultColors: {
      primary: customizations.primaryColor || baseTemplate.defaultColors.primary,
      secondary: customizations.secondaryColor || baseTemplate.defaultColors.secondary,
    },
    categories: customizations.categories
      ? JSON.parse(JSON.stringify(customizations.categories))
      : JSON.parse(JSON.stringify(baseTemplate.categories)),
    tiers: customizations.tiers
      ? JSON.parse(JSON.stringify(customizations.tiers))
      : JSON.parse(JSON.stringify(baseTemplate.tiers)),
  };
}

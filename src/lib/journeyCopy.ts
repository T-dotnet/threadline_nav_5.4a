export type JourneyTone = 'exploring' | 'waiting' | 'diagnosed';

export function getJourneyTone(journeyStage?: string): JourneyTone {
  if (
    journeyStage === 'Diagnosed, need next steps' ||
    journeyStage === 'My child was recently diagnosed.' ||
    journeyStage === 'We already have a diagnosis and need help with next steps.'
  ) {
    return 'diagnosed';
  }

  if (journeyStage === 'Waiting for assessment' || journeyStage === "We're waiting for an assessment.") {
    return 'waiting';
  }

  return 'exploring';
}

export function hasReportContext(availableInfo?: string[]) {
  return Boolean(availableInfo?.some((item) => item !== 'Nothing yet'));
}

export function getJourneyReflectionCopy(journeyStage?: string) {
  const tone = getJourneyTone(journeyStage);

  if (tone === 'diagnosed') {
    return {
      stage: 'You have reached a diagnosis and are looking for what helps next.',
      navigatorHelp:
        'Organise what you already know, make next steps easier to choose, and build support around what matters most now.',
      nextStep:
        'Navigator will help turn the diagnosis into practical next steps, without asking you to start from scratch.',
    };
  }

  if (tone === 'waiting') {
    return {
      stage: "You're already in an assessment process.",
      navigatorHelp:
        'Organise what you have, prepare for the assessment, and keep the important context easy to find.',
      nextStep:
        'Navigator will help gather the picture before the assessment, so the session starts with useful context.',
    };
  }

  return {
    stage: "You're noticing a few concerns and looking for a clearer next step.",
    navigatorHelp:
      'Keep the details together, turn early worries into useful patterns, and help you choose the next gentle step.',
    nextStep:
      'Navigator will start with a few gentle questions and only ask for reports if something already exists.',
  };
}

export function getJourneySetupCopy(journeyStage?: string) {
  const tone = getJourneyTone(journeyStage);

  if (tone === 'diagnosed') {
    return {
      title: 'What would help most after diagnosis?',
      description:
        'These questions help us understand what support would be useful now. You do not need to prove the diagnosis again.',
    };
  }

  if (tone === 'waiting') {
    return {
      title: 'Prepare for the assessment',
      description:
        'These questions help organise what you already know, so the assessment can start with useful context.',
    };
  }

  return {
    title: 'A few questions',
    description:
      'These questions help us understand what you are noticing. Choose what fits and skip what does not.',
  };
}

export function getJourneyHomeCopy(childName: string, journeyStage?: string, reportContext = false) {
  const tone = getJourneyTone(journeyStage);

  if (tone === 'diagnosed') {
    return {
      kicker: 'SUPPORT AFTER DIAGNOSIS',
      title: `What support can build from here for ${childName}.`,
      description:
        'This is not a starting line. Navigator helps turn what you already know into practical next steps.',
      quote:
        'You have reached an important milestone. Now the work is making the diagnosis useful day to day: priorities, supports, and a clearer plan.',
      timelineTitle: 'What helps after diagnosis.',
      questionnaireDescription:
        'Share what is already known and what feels hardest now, so support can start from the right place.',
      sessionDescription:
        'Use the session to turn existing information into practical next steps.',
      footerTitle: 'Ready to shape the next steps?',
      footerButton: 'Start questionnaire',
      prepCards: reportContext ? 'documents' : 'support',
      prepTitle: reportContext ? 'Prepare the assessment context first.' : 'Gather support details to build from.',
      prepDescription: reportContext
        ? 'Collect the reports and observations that make the assessment and next steps more useful.'
        : 'Share the support details and current priorities that matter most now.',
    };
  }

  if (tone === 'waiting') {
    return {
      kicker: 'ASSESSMENT IN PROGRESS',
      title: `Prepare clearly for ${childName}'s assessment.`,
      description:
        'Navigator helps organise what you have and prepare for the assessment already ahead.',
      quote:
        'You are already in the process. We will help prepare the useful context, keep it organised, and move you toward Assessment Ready.',
      timelineTitle: 'What helps before assessment.',
      questionnaireDescription:
        'Add everyday observations, developmental history, and any existing report context before the call.',
      sessionDescription:
        'Use the session to clarify what matters most for the assessment.',
      footerTitle: 'Ready to move toward Assessment Ready?',
      footerButton: 'Start questionnaire',
      prepCards: 'documents',
      prepTitle: 'Prepare the assessment context first.',
      prepDescription: 'Gather reports, observations, and current concerns so the assessment starts with the right picture.',
    };
  }

  return {
    kicker: 'STARTING WITH CLARITY',
    title: `Let's finish ${childName}'s intake.`,
    description:
      'Start with what you have seen so far. We will keep the next step clear without rushing you into conclusions.',
    quote:
        childName === 'Leo'
          ? "The assessment includes an online questionnaire, teacher feedback, and document uploads. Starting the questionnaire is the first step toward Assessment Ready."
          : "Start with the questionnaire. Then we will help you choose the right pathway and prepare anything else you need.",
    timelineTitle: 'What helps when you are starting.',
    questionnaireDescription:
      reportContext
        ? 'Share what you are noticing and any context that already exists.'
        : 'Answer one or two gentle sections first. You can add reports later if they exist.',
    sessionDescription:
      childName === 'Leo'
        ? 'Classroom observations and uploaded documents complete the comprehensive baseline context.'
        : 'Use the session to talk through what you are noticing and what would help next.',
    footerTitle: 'Ready to finish the intake?',
    footerButton: 'Answer a few questions',
    prepCards: reportContext ? 'documents' : 'gentle',
    prepTitle: reportContext ? 'Prepare the assessment context first.' : 'Start with one or two gentle questions.',
    prepDescription: reportContext
      ? 'Collect what you already know and the observations that matter most.'
      : 'Begin with the easiest observations and add more only when you are ready.',
  };
}

export function getJourneyUnderstandingCopy(childName: string, journeyStage?: string) {
  const tone = getJourneyTone(journeyStage);

  if (tone === 'diagnosed') {
    return {
      kicker: 'Understanding · After diagnosis',
      title: `What could help ${childName} now.`,
      quote:
        'This page starts from the diagnosis already reached. Questionnaire answers help translate that milestone into supports, priorities, and next steps.',
      sectionLabel: 'From diagnosis to support',
      sectionTitle: 'Build from what is already known.',
      firstValueTitle: 'The diagnosis is not the end point',
      firstValue:
        'Navigator keeps the diagnosis visible, then helps connect it to everyday support and decisions.',
      secondValueTitle: 'Support comes next',
      secondValue:
        'The clinician can use your answers to focus on what would make life easier now, rather than reopening the whole question.',
      footerTitle: 'Ready to shape support after diagnosis?',
    };
  }

  if (tone === 'waiting') {
    return {
      kicker: 'Understanding · Assessment prep',
      title: `What we can organise before ${childName}'s assessment.`,
      quote:
        'This page gathers the context you already have, so the assessment can start with a clearer picture and less repetition.',
      sectionLabel: 'Preparing for assessment',
      sectionTitle: 'Organise the useful context.',
      firstValueTitle: 'What you have stays visible',
      firstValue:
        'Your answers and existing information stay organised before the assessment, without turning them into conclusions too early.',
      secondValueTitle: 'Interpretation waits for review',
      secondValue:
        'Questionnaire answers prepare the assessment conversation. Clinical interpretation still waits for review.',
      footerTitle: 'Ready to prepare the assessment context?',
    };
  }

  return {
    kicker: 'Understanding · Early picture',
    title: `What you are noticing about ${childName} so far.`,
    quote:
      'This page builds gently from your answers. Each section adds context without forcing conclusions before anyone is ready.',
    sectionLabel: 'From questions to clarity',
    sectionTitle: 'Start with what you notice.',
    firstValueTitle: 'Your words stay visible',
    firstValue:
      'The understanding page shows what you entered before anyone turns it into a clinical formulation.',
    secondValueTitle: 'No rush to conclusions',
    secondValue:
      'Questionnaire answers unlock context, not labels. Recommendations stay limited until the full picture is reviewed.',
    footerTitle: 'Ready to add a little more context?',
  };
}

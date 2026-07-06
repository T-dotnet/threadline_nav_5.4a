import { Child } from './types';
import {
  getChildReviewDate,
  getDiagnosticPathwayCardCopy,
  getSessionDate,
  isDiagnosticPathway,
  isMaintenancePhase,
  isSessionBooked,
  usesStandaloneQuestionnaire,
} from './lib/childStatus';

export interface ChildData {
  home: {
    focusTitle: string;
    focusDescription: string;
    focusAction: string;
    timeline: {
      now: { title: string; meta: string; content: string };
      next: { title: string; meta: string; content: string };
      later: { title: string; meta: string; content: string };
    };
    emerging: { title: string; description: string };
  };
  understanding: {
    description: string;
    focusAreas: { title: string; description: string; sources: string[] }[];
  };
  priorities: {
    description: string;
  };
}

export const getChildData = (child: Child): ChildData => {
  if (isMaintenancePhase(child) || isDiagnosticPathway(child)) {
    const profileName = child.name;
    const isDiagnostic = isDiagnosticPathway(child);
    const diagnosticSessionBooked = isSessionBooked(child);
    const diagnosticCardCopy = getDiagnosticPathwayCardCopy(child);
    const reviewDate = getChildReviewDate(child);
    const sessionDate = getSessionDate(child);
    const standaloneQuestionnaire = usesStandaloneQuestionnaire(child);

    return {
      home: {
        focusTitle: isDiagnostic ? 'Pathway selected' : 'Quarter plan complete',
        focusDescription: isDiagnostic
          ? (diagnosticSessionBooked
              ? "The telehealth assessment session is booked. Completing the preparation details gives the clinician rich context."
              : diagnosticCardCopy.descriptionText || "The pathway is chosen, but the Diagnostic Assessment hasn't started yet.")
          : `${profileName} has achieved the goals for this quarter. The next Now, Next, and Later order will be set with the clinician after the next review session.`,
        focusAction: isDiagnostic ? diagnosticCardCopy.buttonText || 'Book appointment' : 'Prepare for the next review',
        timeline: {
          now: {
            title: isDiagnostic ? 'Diagnostic Assessment' : 'This quarter is complete',
            meta: isDiagnostic ? (standaloneQuestionnaire ? 'Pathway active · Questionnaire pending' : (diagnosticSessionBooked ? 'Pathway active · Session booked' : 'Pathway active · Session pending')) : '100% achieved · Maintenance active',
            content: isDiagnostic
              ? (standaloneQuestionnaire
                  ? `${profileName} is registered for the Diagnostic Assessment. Next, start the questionnaire.`
                  : (diagnosticSessionBooked
                      ? `${profileName} is registered for the Diagnostic Assessment pathway. The telehealth assessment session is booked.`
                      : `${profileName} is registered for the Diagnostic Assessment pathway. The next step is booking the telehealth assessment session.`))
              : `${profileName} has met the current plan goals. Keep the working routines steady while the review evidence is brought together.`
          },
          next: {
            title: isDiagnostic ? (standaloneQuestionnaire ? 'Complete client questionnaire' : (diagnosticSessionBooked ? 'Attend assessment session' : 'Book assessment appointment')) : 'Next review session',
            meta: isDiagnostic ? (standaloneQuestionnaire ? 'Action required' : (sessionDate ? `${sessionDate} · Telehealth` : 'Action required')) : `${reviewDate} · Clinician-led reset`,
            content: isDiagnostic
              ? (standaloneQuestionnaire
                  ? 'Complete the client-led clinical questionnaire sections about attention, behaviour, and routines.'
                  : (diagnosticSessionBooked
                      ? 'Your initial telehealth consultation and clinical assessment is booked.'
                      : 'Select a convenient time for the initial telehealth consultation and clinical assessment.'))
              : `The clinician will use the review to decide whether ${profileName} needs a new Now priority, enrichment goals, or a lighter maintenance rhythm.`
          },
          later: {
            title: isDiagnostic ? (standaloneQuestionnaire ? 'Teacher questionnaire & documents' : 'Clinical formulation') : 'New priority order',
            meta: isDiagnostic ? (standaloneQuestionnaire ? 'Action required' : 'Following assessment') : 'Set after review · Not decided yet',
            content: isDiagnostic
              ? (standaloneQuestionnaire
                  ? 'Invite the classroom teacher to complete the school-focused observer form and upload any school reports.'
                  : `After the session, a complete clinical formulation and quarter plan will be set up to target ${profileName}'s classroom focus.`)
              : 'The next Now, Next, and Later sequence should not be assumed from the completed plan. It will be agreed after the review conversation.'
          }
        },
        emerging: {
          title: isDiagnostic ? 'Baseline Observations' : 'Sustained Mastery',
          description: isDiagnostic
            ? (standaloneQuestionnaire
                ? `Use the everyday diary to note down what you notice about ${profileName}'s focus and energy levels.`
                : `Use the everyday diary to note down what you notice about ${profileName}'s focus and energy levels before the clinical session.`)
            : `${profileName} continues to demonstrate high retention of co-regulation strategies in unstructured settings.`
        }
      },
      understanding: {
        description: isDiagnostic
          ? (standaloneQuestionnaire
              ? `${profileName} is a bright, imaginative child with warm family relationships. Completing the questionnaires and uploading documents will help establish a rich baseline of insights.`
              : `${profileName} is a bright, imaginative child with warm family relationships. Preparing for the Diagnostic Assessment will help connect everyday life patterns with the clinical conversation.`)
          : `${profileName} has achieved all current developmental milestones. He is now demonstrating marked improvements in task persistence and creative depth, maintaining 100% goal alignment.`,
        focusAreas: [
          { title: 'Self-Correction Mastery', description: `${profileName} identifies frustration triggers early and self-corrects without intervention in 90% of observed sessions.`, sources: ['You', 'Teacher', 'Clinician'] },
          { title: 'Task Endurance', description: `${profileName} can follow multi-step instructions and remain engaged in complex play for over 45 minutes.`, sources: ['You', 'Teacher'] }
        ]
      },
      priorities: {
        description: isDiagnostic
          ? (standaloneQuestionnaire
              ? `${profileName}'s priority plan will be established after completing the diagnostic questionnaires and reviewing the uploaded documents.`
              : `${profileName}'s priority plan will be established together with the clinical team following the assessment session.`)
          : `${profileName} has met all core priorities for this quarter. The next priority order will be decided after the upcoming review session.`
      }
    };
  }

  if (child.name === 'Sophia') {
    return {
      home: {
        focusTitle: 'Executive function',
        focusDescription: 'This is the priority most likely to improve Sophia\'s day right now — it\'s affecting her ability to manage complex school assignments and reduces stress.',
        focusAction: 'Set up the visual assignment planner',
        timeline: {
          now: { title: 'Executive function', meta: 'High impact · started 3 weeks ago', content: 'Struggling with multi-step tasks is causing unnecessary anxiety.' },
          next: { title: 'Peer relationship navigation', meta: 'Moderate impact · prepare over coming months', content: 'Helping Sophia set healthy boundaries with peers is the natural next step.' },
          later: { title: 'Sleep routines', meta: 'Safe to wait · revisit at next review', content: 'Sleep is mostly stable, though occasional late nights studying should be monitored.' }
        },
        emerging: { title: 'Test anxiety', description: 'Sophia has mentioned feeling overwhelmed before assessments. We\'ll monitor this trend.' }
      },
      understanding: {
        description: 'Sophia is a thoughtful, observant child with a strong sense of justice. She is currently navigating the complexities of older peer group dynamics and managing academic pressures in a demanding year.',
        focusAreas: [
          { title: 'Executive Function', description: 'Sophia is mastering time management and organizational strategies for complex assignments, sometimes feeling overwhelmed by long-term projects.', sources: ['You', 'Teacher', 'Sophia'] },
          { title: 'Social Dynamics', description: 'Navigating peer relationships and building resilience against social pressures is a key area of focus for her emotional wellbeing.', sources: ['You', 'Sophia'] }
        ]
      },
      priorities: {
        description: 'We prioritize supporting Sophia\'s organizational confidence and social navigation, providing her with the frameworks to manage her schedule effectively and express her boundaries.'
      }
    };
  }

  if (child.name === 'Nick' || child.name === 'Ava') {
    const isNick = child.name === 'Nick';
    return {
      home: {
        focusTitle: 'Classroom attention',
        focusDescription: `This is the priority most likely to improve ${child.name}'s day right now — it's affecting learning and confidence at school.`,
        focusAction: `Share the classroom strategy pack with ${child.name}'s teacher`,
        timeline: {
          now: { title: 'Classroom attention', meta: 'High impact · clearest theme across every source', content: `Trouble staying focused in class is currently the biggest drag on ${child.name}'s learning and self-confidence. Addressing it first tends to make other supports work better too.` },
          next: { title: 'Emotional regulation at home', meta: 'Moderate impact · prepare over coming months', content: 'Frustration around homework and changes in routine is real, and it is hard on home life. But it sits downstream of attention, so we expect it to ease as focus improves.' },
          later: { title: 'Friendships & social connection', meta: 'Safe to wait · currently a strength', content: `${child.name} has warm, steady friendships and real empathy. This is going well, so it does not need your attention today.` }
        },
        emerging: { title: 'Sleep may start affecting focus', description: 'Recent check-ins suggest sleep could become a priority soon. Nothing to act on yet — we\'ll let you know if it does.' }
      },
      understanding: {
        description: isNick 
          ? 'Nick is a bright, imaginative child whose biggest challenge right now is staying focused in structured settings. His social and emotional foundations are strong, and he responds well to clear routines.'
          : 'Ava is a bright, imaginative child whose biggest challenge right now is staying focused in structured settings. Her social and emotional foundations are strong, and she responds well to quiet reassurance.',
        focusAreas: [
          { title: 'Classroom Attention', description: `${child.name} finds it hard to sustain focus in structured tasks, especially in the classroom. The pattern is consistent across settings and is the clearest theme in everything we've gathered.`, sources: ['You', 'Teacher'] },
          { title: 'Social Emotional Resilience', description: `${child.name} has warm, steady friendships and strong emotional awareness, which provides a great foundation to support learning challenges.`, sources: ['You', 'Teacher'] }
        ]
      },
      priorities: {
        description: `We don't hand you a list of everything. We rank what matters by its real impact on ${child.name} — and show the reasoning behind every call.`
      }
    };
  }

  // Default assessed profile copy.
  return {
    home: {
      focusTitle: 'Classroom attention',
      focusDescription: `This is the priority most likely to improve ${child.name}'s day right now — it's affecting learning and confidence at school.`,
      focusAction: `Share the classroom strategy pack with ${child.name}'s teacher`,
      timeline: {
        now: { title: 'Classroom attention', meta: 'High impact · clearest theme across every source', content: `Trouble staying focused in class is currently the biggest drag on ${child.name}'s learning and self-confidence. Addressing it first tends to make other supports work better too.` },
        next: { title: 'Emotional regulation at home', meta: 'Moderate impact · prepare over coming months', content: 'Frustration around homework and changes in routine is real, and it is hard on home life. But it sits downstream of attention, so we expect it to ease as focus improves.' },
        later: { title: 'Friendships & social connection', meta: 'Safe to wait · currently a strength', content: `${child.name} has warm, steady friendships and real empathy. This is going well, so it does not need your attention today.` }
      },
      emerging: { title: 'Sleep may start affecting focus', description: 'Recent check-ins suggest sleep could become a priority soon. Nothing to act on yet — we\'ll let you know if it does.' }
    },
    understanding: {
      description: `${child.name} is a bright, imaginative child whose biggest challenge right now is staying focused in structured settings — and it's starting to affect confidence at school. Their social and emotional foundations are strong.`,
      focusAreas: [
        { title: 'Classroom Attention', description: `${child.name} finds it hard to sustain focus in structured tasks, especially in the classroom. The pattern is consistent across settings and is the clearest theme in everything we've gathered.`, sources: ['You', 'Teacher', 'Clinician', child.name] },
        { title: 'Social Emotional Resilience', description: `${child.name} has warm, steady friendships and strong emotional awareness, which provides a great foundation to support learning challenges.`, sources: ['You', child.name] }
      ]
    },
    priorities: {
      description: `We don't hand you a list of everything. We rank what matters by its real impact on ${child.name} — and show the reasoning behind every call.`
    }
  };
};

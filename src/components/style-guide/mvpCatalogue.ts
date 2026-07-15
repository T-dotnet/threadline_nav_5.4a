export type StoryId =
  | "colors"
  | "typography"
  | "type-page-titles"
  | "type-section-titles"
  | "type-card-titles"
  | "type-body"
  | "type-labels"
  | "type-controls"
  | "type-data"
  | "spacing"
  | "radius"
  | "elevation"
  | "image-watercolor"
  | "image-editorial"
  | "image-portrait"
  | "button"
  | "input"
  | "badge"
  | "switch"
  | "filter-tab"
  | "action-link"
  | "icon-button"
  | "segmented-control"
  | "progress"
  | "page-header"
  | "checklist-item"
  | "accordion"
  | "hero-quote-card"
  | "plan-progress-card"
  | "evidence-badge"
  | "question-option"
  | "article-item"
  | "article-card"
  | "file-item"
  | "locker-item"
  | "clinical-highlight"
  | "action-prompt"
  | "not-sure-prompt"
  | "settings-child-profile-row"
  | "settings-access-option"
  | "settings-secondary-user-row"
  | "assessment-module"
  | "document-upload"
  | "workspace-mode"
  | "modal"
  | "modal-with-sidebar"
  | "child-overview"
  | "help-centre-list"
  | "doc-locker-file-list"
  | "resource-featured-guide"
  | "resource-guide-browser"
  | "resource-topic-directory"
  | "resource-aids-locker"
  | "settings-parent-profile"
  | "settings-secondary-user-invite"
  | "settings-delete-profile";

export type StoryGroupId = "tokens" | "imagery" | "primitives" | "components" | "patterns";

export interface StoryDefinition {
  id: StoryId;
  title: string;
  group: StoryGroupId;
  description: string;
  useFor: string;
  avoid: string;
  code: string;
}

export interface StoryGroup {
  id: StoryGroupId;
  label: string;
  description: string;
  storyIds: StoryId[];
}

export const STORY_GROUPS: StoryGroup[] = [
  {
    id: "tokens",
    label: "Tokens & Styles",
    description: "The visual decisions shared by every MVP surface.",
    storyIds: [
      "colors",
      "typography",
      "type-page-titles",
      "type-section-titles",
      "type-card-titles",
      "type-body",
      "type-labels",
      "type-controls",
      "type-data",
      "spacing",
      "radius",
      "elevation",
    ],
  },
  {
    id: "imagery",
    label: "Imagery",
    description: "Production image assets, crops, and treatments used across the MVP.",
    storyIds: [
      "image-watercolor",
      "image-editorial",
      "image-portrait",
    ],
  },
  {
    id: "primitives",
    label: "Primitives",
    description: "Small controls that carry one clear interaction.",
    storyIds: [
      "button",
      "input",
      "badge",
      "switch",
      "filter-tab",
      "action-link",
      "icon-button",
      "segmented-control",
      "progress",
    ],
  },
  {
    id: "components",
    label: "Components",
    description: "Simple product elements composed from MVP primitives.",
    storyIds: [
      "page-header",
      "checklist-item",
      "accordion",
      "hero-quote-card",
      "plan-progress-card",
      "evidence-badge",
      "question-option",
      "article-item",
      "article-card",
      "file-item",
      "locker-item",
      "clinical-highlight",
      "action-prompt",
      "not-sure-prompt",
      "settings-child-profile-row",
      "settings-access-option",
      "settings-secondary-user-row",
    ],
  },
  {
    id: "patterns",
    label: "Complex patterns",
    description: "Multi-part flows used in assessment and workspace surfaces.",
    storyIds: [
      "modal",
      "modal-with-sidebar",
      "child-overview",
      "help-centre-list",
      "doc-locker-file-list",
      "resource-featured-guide",
      "resource-guide-browser",
      "resource-topic-directory",
      "resource-aids-locker",
      "settings-parent-profile",
      "settings-secondary-user-invite",
      "settings-delete-profile",
      "assessment-module",
      "document-upload",
      "workspace-mode",
    ],
  },
];

export const STORIES: StoryDefinition[] = [
  {
    id: "colors",
    title: "Colors",
    group: "tokens",
    description: "The restrained emerald and neutral palette used by the MVP experience.",
    useFor: "Apply semantic variables so theme and MVP changes remain consistent across the app.",
    avoid: "Do not introduce one-off hex values when a Threadline semantic token already exists.",
    code: "color: var(--color-thread-heading);\nbackground: var(--color-thread-off-white);",
  },
  {
    id: "typography",
    title: "Type foundations",
    group: "tokens",
    description: "Fraunces carries parent-facing headings; Inter carries controls, labels, and body copy.",
    useFor: "Use serif type for page and preview headings, and sans for all developer and product UI.",
    avoid: "Do not use the serif for buttons, metadata, form labels, or dense application controls.",
    code: "font-family: var(--font-serif);\nfont-family: var(--font-inter);",
  },
  {
    id: "type-page-titles",
    title: "Page & modal titles",
    group: "tokens",
    description: "Fraunces Light carries routed page titles and focused modal headings.",
    useFor: "Use the shared page header or modal-title treatment for the highest heading in each product context.",
    avoid: "Do not use display sizing for card titles, navigation, or dense workflow labels.",
    code: '<PageHeader title="All Children at a glance." />',
  },
  {
    id: "type-section-titles",
    title: "Section hierarchy",
    group: "tokens",
    description: "Section labels, titles, and descriptions form the repeatable hierarchy inside MVP pages.",
    useFor: "Use the three shared section components together when introducing a substantial page region.",
    avoid: "Do not add the full hierarchy to every small card or repeat a label when context is already clear.",
    code: '<SectionLabel>Areas of focus</SectionLabel>\n<SectionTitle>Assessed clinical domains</SectionTitle>\n<SectionDescription>Clinical findings across key domains.</SectionDescription>',
  },
  {
    id: "type-card-titles",
    title: "Card & profile titles",
    group: "tokens",
    description: "Light and medium sans styles identify children, cards, list items, and compact product surfaces.",
    useFor: "Use the named heading classes already attached to the corresponding production component.",
    avoid: "Do not substitute the serif display face for dense card or list headings.",
    code: '<h2 className="thread-profile-heading">Noah&apos;s Profile</h2>\n<h3 className="thread-sans-heading text-lg font-medium">Assessment Package</h3>',
  },
  {
    id: "type-body",
    title: "Body & supporting copy",
    group: "tokens",
    description: "A restrained sans scale covers lead copy, standard body text, secondary explanation, and captions.",
    useFor: "Choose the role by reading length and importance, keeping long-form product copy at 1rem or above.",
    avoid: "Do not use captions for essential instructions or light weights on low-contrast backgrounds.",
    code: '<p className="text-base leading-relaxed text-[var(--color-thread-gray)]">Body copy</p>',
  },
  {
    id: "type-labels",
    title: "Labels & metadata",
    group: "tokens",
    description: "Medium-weight labels and metadata keep context scannable without competing with headings.",
    useFor: "Use uppercase tracked labels for short categories and sentence case for dates, provenance, and supporting facts.",
    avoid: "Do not uppercase sentences, long instructions, or parent-facing explanatory copy.",
    code: '<SectionLabel>Current summary</SectionLabel>\n<span className="text-sm text-[var(--color-thread-muted-text)]">14 Jul 2026</span>',
  },
  {
    id: "type-controls",
    title: "Control text",
    group: "tokens",
    description: "Buttons, links, fields, tabs, and navigation use Inter Medium for dependable interaction cues.",
    useFor: "Use the production control component so size, weight, and accessible target area stay synchronized.",
    avoid: "Do not apply heading typography to controls or shrink action text below the component standard.",
    code: '<Button variant="primary">Continue</Button>\n<Input placeholder="Search documents" />',
  },
  {
    id: "type-data",
    title: "Data & progress",
    group: "tokens",
    description: "Large serif numerals and compact sans metadata communicate progress, dates, and bounded counts.",
    useFor: "Use tabular alignment for comparable values and the existing progress components for completion data.",
    avoid: "Do not turn task completion into a clinical score or use oversized numerals for ordinary metadata.",
    code: '<PlanProgressCard progress={65} statusText="on track — steady progress" nextReview="24 Jul 2026" />',
  },
  {
    id: "spacing",
    title: "Spacing",
    group: "tokens",
    description: "A 4-point rhythm keeps dense product UI readable and predictable.",
    useFor: "Group related controls tightly and separate distinct product sections generously.",
    avoid: "Do not invent arbitrary gaps or give every relationship the same amount of space.",
    code: "4 · 8 · 12 · 16 · 24 · 32 · 48 · 64",
  },
  {
    id: "radius",
    title: "Radius",
    group: "tokens",
    description: "Asymmetric Threadline corners distinguish product surfaces without softening every edge.",
    useFor: "Use the existing feature, modal, input, and pill treatments according to component role.",
    avoid: "Do not apply large rounded corners to every card or nest rounded surfaces inside each other.",
    code: "--radius-thread-feature\n--radius-thread-modal\nrounded-tr-[24px]",
  },
  {
    id: "elevation",
    title: "Elevation",
    group: "tokens",
    description: "Elevation is reserved for overlays and important raised surfaces.",
    useFor: "Use borders for structure and the shared premium shadow only when hierarchy needs depth.",
    avoid: "Do not pair wide decorative shadows with borders on every panel.",
    code: "box-shadow: var(--shadow-premium);",
  },
  {
    id: "image-watercolor",
    title: "Watercolor texture",
    group: "imagery",
    description: "The soft green-and-plum watercolor asset used as a branded background, framed panel, and quiet modal accent.",
    useFor: "Use through bg-watercolor, WatercolorPanel, or the existing full-screen surface so the overlay, crop, and responsive behavior stay consistent.",
    avoid: "Do not place essential text directly on the raw image, tile the asset, or add a second decorative gradient over branded surfaces.",
    code: '<WatercolorPanel><HeroQuoteCard … /></WatercolorPanel>',
  },
  {
    id: "image-editorial",
    title: "Editorial guide imagery",
    group: "imagery",
    description: "Abstract 16:9 artwork gives Resources and support content a calm visual cue without implying clinical evidence.",
    useFor: "Use the optimized 900px assets in GuideCard and other editorial contexts with object-cover and a title-derived alt label.",
    avoid: "Do not reuse guide artwork as a child photo, report preview, or decorative background behind text.",
    code: '<GuideCard image={guideImage} title="How Sleep and ADHD Interact in Growing Brains" … />',
  },
  {
    id: "image-portrait",
    title: "Portraits & identity",
    group: "imagery",
    description: "Clinician portraits establish identity and trust through the shared Avatar crop and named profile treatment.",
    useFor: "Use Avatar for identity images with the person’s name as alt text, preserving the square source and centered object-cover crop.",
    avoid: "Do not use a person’s image without identity context, stretch portraits into editorial card ratios, or repeat the photo as ambient decoration.",
    code: '<Avatar src={clinicianPhoto} alt="Dr Naomi Clark" size="lg" />',
  },
  {
    id: "button",
    title: "Button",
    group: "primitives",
    description: "The primary action vocabulary for assessment, document, and workspace flows.",
    useFor: "Use primary for the single next action; use secondary or tertiary for reversible support actions.",
    avoid: "Avoid multiple primary buttons in one decision area or link styling for destructive actions.",
    code: '<Button variant="primary" rightIcon={<ArrowRight />}>Continue</Button>',
  },
  {
    id: "input",
    title: "Input",
    group: "primitives",
    description: "Text entry and search fields share the same accessible focus and error vocabulary.",
    useFor: "Pair every input with a visible label and short task-focused supporting text.",
    avoid: "Do not rely on placeholder text as the only label or hide validation until submission.",
    code: '<Input aria-label="Child name" placeholder="Enter name" />',
  },
  {
    id: "badge",
    title: "Badge",
    group: "primitives",
    description: "Compact labels communicate timing, clinical context, and active state.",
    useFor: "Use badges for short categorical status that remains meaningful without interaction.",
    avoid: "Do not turn full sentences or primary actions into badges.",
    code: '<Badge variant="active">Active</Badge>',
  },
  {
    id: "switch",
    title: "Switch",
    group: "primitives",
    description: "A binary setting control with keyboard and pointer support.",
    useFor: "Use for settings that take effect immediately and can be safely reversed.",
    avoid: "Do not use a switch for a one-time action, confirmation, or multi-value choice.",
    code: '<Switch checked={enabled} onCheckedChange={setEnabled} />',
  },
  {
    id: "filter-tab",
    title: "Filter tab",
    group: "primitives",
    description: "Small category controls used to narrow existing content without changing route.",
    useFor: "Use for document type, uploader, or other compact in-place filters.",
    avoid: "Do not use filter tabs as primary application navigation or multi-step progress.",
    code: '<FilterTab active label="All files" onClick={handleFilter} />',
  },
  {
    id: "action-link",
    title: "Action link",
    group: "primitives",
    description: "The low-emphasis navigation action used inside cards, headers, and support surfaces.",
    useFor: "Use for a clear secondary destination when a full button would compete with the primary action.",
    avoid: "Do not use for destructive actions, form submission, or unlabeled icon-only navigation.",
    code: '<ActionLink as="button">Open profile</ActionLink>',
  },
  {
    id: "icon-button",
    title: "Icon button",
    group: "primitives",
    description: "A compact circular control for familiar utility actions in the application shell.",
    useFor: "Use with an accessible label for notifications, document access, and other recognized utilities.",
    avoid: "Do not use an unfamiliar icon without text when the action could be ambiguous.",
    code: '<IconButton aria-label="Notifications"><Bell /></IconButton>',
  },
  {
    id: "segmented-control",
    title: "Segmented control",
    group: "primitives",
    description: "A keyboard-accessible single-choice control for compact view or mode selection.",
    useFor: "Use for two to four mutually exclusive choices that update the current surface immediately.",
    avoid: "Do not use for multi-select filters, step navigation, or choices requiring long descriptions.",
    code: '<SegmentedControl aria-label="View" options={options} value={view} onChange={setView} />',
  },
  {
    id: "progress",
    title: "Progress bar",
    group: "primitives",
    description: "A bounded measure for assessment and module completion.",
    useFor: "Use only when both current progress and a meaningful completion point are known.",
    avoid: "Do not show progress as decoration or imply clinical certainty from task completion.",
    code: '<ProgressBar value={12} max={17} showLabel />',
  },
  {
    id: "evidence-badge",
    title: "Evidence badge",
    group: "components",
    description: "A compact visual measure for emerging, moderate, and strong supporting evidence.",
    useFor: "Use beside a synthesis statement when the level has a clear source and clinical meaning.",
    avoid: "Do not use as a score for a child or as a substitute for explaining the source evidence.",
    code: '<EvidenceBadge level={2} label="Moderate evidence" />',
  },
  {
    id: "page-header",
    title: "Page header",
    group: "components",
    description: "The shared serif heading, context label, supporting copy, and optional action for MVP pages.",
    useFor: "Use once at the beginning of a routed product page to establish purpose and available action.",
    avoid: "Do not repeat it inside cards or use it as a generic section heading.",
    code: '<PageHeader kicker="Family overview" title="All Children at a glance." description="See each child’s progress." />',
  },
  {
    id: "checklist-item",
    title: "Checklist item",
    group: "components",
    description: "A compact confirmed item with a leading status icon and short explanation.",
    useFor: "Use for small preparation, permission, or completion lists where each row is already resolved.",
    avoid: "Do not use as an interactive checkbox or for long multi-paragraph content.",
    code: '<ChecklistItem title="Parent questionnaire" description="Completed and ready for review." />',
  },
  {
    id: "accordion",
    title: "Accordion",
    group: "components",
    description: "The production AreaItem disclosure used for assessment domains and preparation details.",
    useFor: "Use to reveal supporting detail beneath concise, scannable headings in a related list.",
    avoid: "Do not hide the primary action or critical safety information inside a collapsed row.",
    code: '<AreaItem title="Attention & focus" description="Clinical detail…" isCollapsible />',
  },
  {
    id: "hero-quote-card",
    title: "Summary card",
    group: "components",
    description: "The primary synthesis surface used for a child’s current summary and next action.",
    useFor: "Use for one meaningful parent-facing synthesis statement with an optional evidence label or action.",
    avoid: "Do not use for ordinary metadata, generic announcements, or several competing actions.",
    code: '<HeroQuoteCard kicker="Current summary" quote="Noah’s Assessment Package is ready." />',
  },
  {
    id: "plan-progress-card",
    title: "Progress card",
    group: "components",
    description: "The secondary All Children card showing bounded assessment or plan progress.",
    useFor: "Use when completion percentage, status, and a meaningful next review are all available.",
    avoid: "Do not infer clinical progress from task completion or show an invented percentage.",
    code: '<PlanProgressCard progress={65} statusText="On track — steady progress" nextReview="24 Jul 2026" />',
  },
  {
    id: "question-option",
    title: "Question option",
    group: "components",
    description: "A selectable answer row used throughout MVP assessment modules.",
    useFor: "Use for one clearly worded response option with an explicit selected state.",
    avoid: "Do not add free-text rationale or risk-governance questions to this option pattern.",
    code: '<QuestionOption marker="A" selected={selected}>Often</QuestionOption>',
  },
  {
    id: "article-item",
    title: "Article item",
    group: "components",
    description: "The compact ListItemCard link used to surface Help Centre articles inside assessment and profile contexts.",
    useFor: "Use for a short article title when the surrounding section already explains the destination and purpose.",
    avoid: "Do not add descriptions, metadata, or images to this compact row; use the article card when that context is needed.",
    code: '<ListItemCard role="button" tabIndex={0}>See the Assessment Package and how to read it</ListItemCard>',
  },
  {
    id: "article-card",
    title: "Resource guide card",
    group: "components",
    description: "The image-led GuideCard used to browse Help Centre articles by topic.",
    useFor: "Use in article grids when a title needs category, reading time, description, and a clear reading action.",
    avoid: "Do not use this richer card inside compact profile panels or for non-editorial destinations.",
    code: '<GuideCard category="Tools & Templates" title="Developing a Calming Bedtime Wind-Down" description="A visual template…" readTime="8 min read" image={articleImage} />',
  },
  {
    id: "file-item",
    title: "Doc Locker file item",
    group: "components",
    description: "The production Doc Locker row with document type, child, date, uploader, sharing status, and access action.",
    useFor: "Use for every family document in the Doc Locker so ownership and access remain visible at a glance.",
    avoid: "Do not hide uploader provenance or sharing status behind a secondary detail view.",
    code: '<FileItem name="Actionable Clarity Report" typeName="Report" childName="Maya" uploadedBy="threadline" shared={false} />',
  },
  {
    id: "locker-item",
    title: "Locker shortcut card",
    group: "components",
    description: "A compact route or file-category entry used inside document surfaces.",
    useFor: "Use for a small standalone destination with one supporting action.",
    avoid: "Do not use for dense document metadata; use FileItem instead.",
    code: '<LockerItem icon={<FileCheck2 />} title="Assessment Package" description="See the organised evidence." action="Open file" />',
  },
  {
    id: "clinical-highlight",
    title: "Clinical highlight",
    group: "components",
    description: "A calm informational surface for clinically relevant context and constraints.",
    useFor: "Use to explain why information matters or call out a governed limitation.",
    avoid: "Do not use for generic tips, marketing claims, or urgent risk messaging.",
    code: '<ClinicalHighlight title="Why this matters">…</ClinicalHighlight>',
  },
  {
    id: "action-prompt",
    title: "Action prompt",
    group: "components",
    description: "A composed panel that pairs context with one clear next action.",
    useFor: "Use at section level when the parent needs enough context to act confidently.",
    avoid: "Do not stack several competing actions or nest another card inside the prompt.",
    code: '<ActionPromptPanel label="Next step" title="Add school information." description="Invite a teacher or add a file." action={<Button>Continue</Button>} />',
  },
  {
    id: "not-sure-prompt",
    title: "Not sure prompt",
    group: "components",
    description: "A reversible assessment affordance that records an open item instead of leaving it blank.",
    useFor: "Use beside structured questions where a parent may not know the answer yet.",
    avoid: "Do not use as an escape from mandatory consent or clinically governed questions.",
    code: '<QuestionNotSurePrompt marked={marked} onMark={toggleMarked} />',
  },
  {
    id: "settings-child-profile-row",
    title: "Settings child profile row",
    group: "components",
    description: "The Registered Children row with identity, profile context, active state, and destructive action.",
    useFor: "Use in Settings when a parent needs to recognise and manage a child already registered to the workspace.",
    avoid: "Do not use this row as the child selector or remove the explicit confirmation before deletion.",
    code: '<SettingsChildProfileRow child={child} active onDelete={requestDelete} />',
  },
  {
    id: "settings-access-option",
    title: "Settings access option",
    group: "components",
    description: "A selectable permission card explaining the difference between full and partial workspace access.",
    useFor: "Use when inviting a secondary user and the permission choice needs a short consequence statement.",
    avoid: "Do not use this large card inside existing-user rows; use the compact segmented control there.",
    code: '<AccessOption value="full" selected={access === "full"} onSelect={setAccess} />',
  },
  {
    id: "settings-secondary-user-row",
    title: "Settings workspace user row",
    group: "components",
    description: "The Secondary Users row with identity, role, email, compact access control, and remove action.",
    useFor: "Use for people who already have family workspace access and whose access level can be changed in place.",
    avoid: "Do not mix the invitation form into the row or hide the user’s role and email.",
    code: '<SettingsWorkspaceUserRow user={user} access={access} onAccessChange={setAccess} onRemove={removeUser} />',
  },
  {
    id: "assessment-module",
    title: "Assessment module",
    group: "patterns",
    description: "The responsive module selector and progress pattern used in MVP assessment flows.",
    useFor: "Use for ordered assessment modules with one current step and selectable known destinations.",
    avoid: "Do not use for unrelated navigation or flatten steps whose order carries clinical meaning.",
    code: '<ProcessStepper activeStep={2} heading="Assessment modules" steps={steps} />',
  },
  {
    id: "modal",
    title: "Modal",
    group: "patterns",
    description: "The accessible ModalShell with focus management, escape handling, and the shared close control.",
    useFor: "Use for a focused decision or short workflow that must temporarily interrupt the current page.",
    avoid: "Do not use for navigation, passive information that belongs inline, or nested modals.",
    code: '<ModalShell isOpen={open} titleId="modal-title" onRequestClose={close}>…</ModalShell>',
  },
  {
    id: "modal-with-sidebar",
    title: "Modal with sidebar",
    group: "patterns",
    description: "The shared QuestionnaireModuleModalFrame used by multi-module assessment workflows.",
    useFor: "Use for ordered modal workflows where the current module and available destinations must stay visible.",
    avoid: "Do not rebuild a custom side panel or use this frame for a single short confirmation.",
    code: '<QuestionnaireModuleModalFrame isOpen activeStep={2} steps={steps} heading="Assessment modules">…</QuestionnaireModuleModalFrame>',
  },
  {
    id: "child-overview",
    title: "Child overview",
    group: "patterns",
    description: "The All Children profile header paired with the current summary and assessment progress cards.",
    useFor: "Use on the family overview to compare each child’s current state and next action consistently.",
    avoid: "Do not reuse this dense composition inside an individual child page or a modal.",
    code: '<ChildOverview summary={<HeroQuoteCard … />} progress={<PlanProgressCard … />} />',
  },
  {
    id: "help-centre-list",
    title: "Help Centre article list",
    group: "patterns",
    description: "The three-item Help Centre block shown beside a completed Assessment Package for Noah and Chloe.",
    useFor: "Use when a profile milestone has a small, curated set of related Help Centre articles.",
    avoid: "Do not turn this into an open-ended directory or replace the full searchable Help Centre grid.",
    code: '<HelpCentreArticleList articles={assessmentPackageArticles} onOpenArticle={openResources} />',
  },
  {
    id: "doc-locker-file-list",
    title: "Doc Locker file list",
    group: "patterns",
    description: "The searchable, filterable file list used in the family’s unified Doc Locker.",
    useFor: "Use on the Documents page to browse files across children while keeping document type, provenance, and permissions visible.",
    avoid: "Do not separate sharing state from the file row or replace the responsive rows with a dense desktop-only table.",
    code: '<DocLockerFileList files={files} search={search} filter={filter} onToggleShare={toggleShare} />',
  },
  {
    id: "resource-featured-guide",
    title: "Featured resource guide",
    group: "patterns",
    description: "The WatercolorPanel and summary-card composition used to promote one timely guide at the top of Resources.",
    useFor: "Use once on the Resources page when one guide has a clear seasonal or journey-specific priority.",
    avoid: "Do not stack several featured guides or use this large treatment for ordinary library results.",
    code: '<WatercolorPanel><HeroQuoteCard kicker="Featured guide" quote="Starting the upcoming school term with confidence." action={<Button>Read article</Button>} /></WatercolorPanel>',
  },
  {
    id: "resource-guide-browser",
    title: "Resource guide browser",
    group: "patterns",
    description: "The searchable, filterable Resources library with result count, guide grid, and no-results recovery.",
    useFor: "Use for the main clinical-grade guide directory where families need to search or narrow by support area.",
    avoid: "Do not replace the curated Help Centre links in profile contexts with the full directory browser.",
    code: '<ResourceGuideBrowser guides={guides} search={search} filter={filter} onClear={clearFilters} />',
  },
  {
    id: "resource-topic-directory",
    title: "Resource topic directory",
    group: "patterns",
    description: "The six-item topic directory that gives families a second, plain-language way to browse Resources.",
    useFor: "Use beneath the guide browser for stable topic destinations that remain useful across children and journey stages.",
    avoid: "Do not use these rows as filter tabs or mix transient result counts into topic names.",
    code: '<ResourceTopicDirectory topics={resourceTopics} onSelectTopic={openTopic} />',
  },
  {
    id: "resource-aids-locker",
    title: "Resources aids locker",
    group: "patterns",
    description: "The three-item Resources locker for printable templates, short videos, and classroom guides.",
    useFor: "Use for a small fixed set of practical assets whose format and action differ from editorial articles.",
    avoid: "Do not use these shortcut cards for clinical documents stored in the family Doc Locker.",
    code: '<WatercolorPanel><ResourceAidsLocker items={resourceAids} /></WatercolorPanel>',
  },
  {
    id: "settings-parent-profile",
    title: "Parent profile settings",
    group: "patterns",
    description: "The Parent Metadata form combining contact fields, notification preference, and one save action.",
    useFor: "Use in Settings for the primary parent’s workspace identity and contact preferences.",
    avoid: "Do not split closely related contact controls across separate cards or add several competing save actions.",
    code: '<ParentProfileSettings nickname={nickname} email={email} notifications={notifications} onSave={saveProfile} />',
  },
  {
    id: "settings-secondary-user-invite",
    title: "Secondary user invitation",
    group: "patterns",
    description: "The complete invitation form for name, role, email, and explained access level selection.",
    useFor: "Use when a parent adds a partner, teacher, or carer to the family workspace.",
    avoid: "Do not send an invitation until both identity fields are complete or imply partial access is already configurable.",
    code: '<SecondaryUserInvite onSubmit={sendInvitation} onCancel={closeInvite} />',
  },
  {
    id: "settings-delete-profile",
    title: "Delete profile confirmation",
    group: "patterns",
    description: "The focused destructive confirmation used before removing a registered child profile.",
    useFor: "Use after the delete action so the affected child and irreversible consequence are explicit.",
    avoid: "Do not delete immediately from the profile row or style the cancel action as destructive.",
    code: '<DeleteProfileModal childName="Noah" open={open} onCancel={close} onConfirm={deleteProfile} />',
  },
  {
    id: "document-upload",
    title: "Document upload",
    group: "patterns",
    description: "The Doc Locker upload surface and its permission-aware supporting copy.",
    useFor: "Use for supported family documents before the ownership confirmation workflow.",
    avoid: "Do not imply upload automatically shares a file with a clinician or school.",
    code: '<DocumentUploadDropzone onClick={openFilePicker} />',
  },
  {
    id: "workspace-mode",
    title: "Workspace mode",
    group: "patterns",
    description: "The internal workspace panel used to access the design system and MVP mode.",
    useFor: "Use for internal product controls that should remain separate from family settings.",
    avoid: "Do not add parent-facing preferences or clinical configuration to this panel.",
    code: '<Switch aria-label="MVP Mode" checked={isMvp} onCheckedChange={setIsMvp} />',
  },
];

export const STORY_BY_ID = Object.fromEntries(
  STORIES.map((story) => [story.id, story]),
) as Record<StoryId, StoryDefinition>;

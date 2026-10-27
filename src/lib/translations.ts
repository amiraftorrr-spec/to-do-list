import { Language, Category, Priority, ViewMode } from '@/types/todo';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  newTask: string;
  quickAddKey: string;
  rhythm: string;
  today: string;
  planner: string;
  saturdayReview: string;
  saturdayReviewDue: string;
  allTasks: string;
  completedLog: string;
  spaces: string;
  allSpaces: string;
  localBackup: string;
  localPrivacyNote: string;
  
  // Header
  todayHeading: string;
  todaySubtitle: string;
  plannerHeading: string;
  plannerSubtitle: string;
  reviewHeading: string;
  reviewSubtitle: string;
  completedHeading: string;
  completedSubtitle: string;
  allHeading: string;
  allSubtitle: string;
  searchPlaceholder: string;
  filterLabel: string;
  allFilter: string;
  addTaskBtn: string;
  weeklyReviewBtn: string;
  themeToggleDark: string;
  themeToggleLight: string;
  themeDarkShort: string;
  themeLightShort: string;
  showingTaskCount: (count: number) => string;
  noTasksMatchingFilters: string;
  archivedAccomplishments: (count: number) => string;
  noCompletedTasksYet: string;
  satReviewHeroTitle: string;
  satReviewHeroDesc: string;
  urgentHighBadge: string;
  ptsLabel: string;
  historyTaskSummary: (completed: number, total: number, urgentHigh: number) => string;
  markComplete: string;
  markIncomplete: string;
  
  // Saturday banner
  saturdayBannerText: string;
  startReviewBtn: string;
  
  // Today View
  todayMomentum: string;
  tasksDoneSummary: (done: number, total: number) => string;
  focusForToday: (count: number) => string;
  allClearToday: string;
  allClearSubtitle: string;
  nothingScheduledToday: string;
  nothingScheduledSubtitle: string;
  addFirstTask: string;
  overdueTasks: (count: number) => string;
  completedTodayCount: (count: number) => string;
  
  // Planner View
  tomorrowBlueprint: string;
  tomorrowHeadline: string;
  tomorrowDesc: string;
  planForTomorrowBtn: string;
  noTasksTomorrow: string;
  next7DaysAhead: string;
  proactiveScheduling: string;
  taskCountLabel: (count: number) => string;
  addToThisDay: string;
  emptySlot: string;

  // Task Card
  stepsDone: (done: number, total: number) => string;
  addStep: string;
  stepPlaceholder: string;
  addBtn: string;
  cancelBtn: string;
  moveToday: string;
  moveTomorrow: string;
  move3Days: string;
  editDetails: string;
  deleteTask: string;
  checklistHeader: (done: number, total: number) => string;
  reschedule: string;

  // Task Modal
  editTaskTitle: string;
  newTaskTitle: string;
  titleLabel: string;
  titlePlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
  whenLabel: string;
  in2Days: string;
  saturday: string;
  priorityLabel: string;
  spaceLabel: string;
  stepsLabel: string;
  createTaskBtn: string;
  saveChangesBtn: string;

  // Habit & Recurrence
  recurrenceLabel: string;
  recNone: string;
  recDaily: string;
  recWeekdays: string;
  recWeekly: string;
  streakBadge: (count: number) => string;

  // Quick Add & Calendar
  quickAddPlaceholder: string;
  quickAddButton: string;
  calendarTab: string;
  plannerTab: string;
  planForThisDay: string;
  noTasksOnSelectedDay: string;

  // Priority labels & desc
  priorityUrgent: string;
  priorityUrgentDesc: string;
  priorityHigh: string;
  priorityHighDesc: string;
  priorityMedium: string;
  priorityMediumDesc: string;
  priorityLow: string;
  priorityLowDesc: string;

  // Categories
  catGeneral: string;
  catPersonal: string;
  catWork: string;
  catHabits: string;
  catLearning: string;
  catHealth: string;

  // Saturday Review Modal
  satReviewTitle: string;
  satMorningLabel: string;
  retrospectiveFor: (label: string) => string;
  weeklyScoreTab: string;
  historyTab: (count: number) => string;
  evaluatingCycle: string;
  concludedWeek: (label: string) => string;
  ongoingWeek: string;
  perfAssessment: string;
  outOf100: string;
  completionRate: string;
  keyPrioritiesHit: string;
  keyPrioritiesWeight: string;
  consistencyScore: string;
  consistencyDesc: string;
  tasksSlippedTitle: (count: number) => string;
  tasksSlippedSubtitle: string;
  completedVictoriesTitle: (count: number) => string;
  satReflectionLabel: string;
  satReflectionPlaceholder: string;
  pastReportsTitle: string;
  noPastReports: string;
  reviewsSavedLocally: string;
  dismissBtn: string;
  saveReviewBtn: string;
  savedDone: string;

  // Backup Modal
  backupTitle: string;
  backupIntro: string;
  storedOnDevice: (count: number) => string;
  exportJson: string;
  restoreJson: string;
  resetSample: string;
  closeBtn: string;
  resetConfirm: string;
  backupDownloaded: string;
  restoredSuccess: (count: number) => string;

  // Onboarding Tutorial
  tutorialTitle: string;
  tutorialSubtitle: string;
  tutorialStep1Title: string;
  tutorialStep1Desc: string;
  tutorialStep2Title: string;
  tutorialStep2Desc: string;
  tutorialStep3Title: string;
  tutorialStep3Desc: string;
  tutorialStep4Title: string;
  tutorialStep4Desc: string;
  tutorialNext: string;
  tutorialPrev: string;
  tutorialStart: string;
  tutorialSkip: string;

  // APK Download Modal
  pwaTitle: string;
  pwaDesc: string;
  pwaIosHint: string;
  pwaInstallBtn: string;
  pwaLaterBtn: string;
  apkTitle: string;
  apkDesc: string;
  apkInstallBtn: string;
  apkLaterBtn: string;
  apkBadge: string;
  apkOfflineBadge: string;
  apkStep1: string;
  apkStep2: string;
  apkStep3: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'tedlist',
    appSubtitle: 'Mindful Todo',
    newTask: 'New Task',
    quickAddKey: 'N',
    rhythm: 'Rhythm',
    today: 'Today',
    planner: 'Planner & Ahead',
    saturdayReview: 'Saturday Review',
    saturdayReviewDue: 'Due',
    allTasks: 'All Tasks',
    completedLog: 'Completed Log',
    spaces: 'Spaces',
    allSpaces: 'All Spaces',
    localBackup: 'Local Data & Backup',
    localPrivacyNote: '100% private in your browser. No cloud, no tracking.',

    todayHeading: 'Today',
    todaySubtitle: 'Focus on what moves the needle today. Check items off as you go.',
    plannerHeading: 'Planner & Upcoming Days',
    plannerSubtitle: 'Plan tomorrow, the weekend, or the days ahead with calm intention.',
    reviewHeading: 'Saturday Weekly Review',
    reviewSubtitle: 'Weekly score out of 100 based on your completed goals and momentum.',
    completedHeading: 'Completed Log',
    completedSubtitle: 'A record of everything you have finished. Savor the progress.',
    allHeading: 'All Tasks',
    allSubtitle: 'Every active task and intention across your spaces.',
    searchPlaceholder: 'Search tasks, notes, or tags...',
    filterLabel: 'Filter:',
    allFilter: 'All',
    addTaskBtn: 'Add Task',
    weeklyReviewBtn: 'Weekly Review',
    themeToggleDark: 'Dark Mode',
    themeToggleLight: 'Light Mode',
    themeDarkShort: 'Dark',
    themeLightShort: 'Light',
    showingTaskCount: (count) => `Showing ${count} ${count === 1 ? 'task' : 'tasks'}`,
    noTasksMatchingFilters: 'No tasks match your active filters.',
    archivedAccomplishments: (count) => `Archived accomplishments: ${count} total finished`,
    noCompletedTasksYet: 'No completed tasks yet. Finish a task today to see it celebrated here!',
    satReviewHeroTitle: 'Saturday Weekly Review & Scoring',
    satReviewHeroDesc: 'Click below to launch your weekly evaluation modal, calculate your score out of 100, and audit what was accomplished versus what slipped.',
    urgentHighBadge: 'Urgent/High',
    ptsLabel: 'Pts',
    historyTaskSummary: (completed, total, urgentHigh) => `Completed ${completed} of ${total} tasks (${urgentHigh} high priority)`,
    markComplete: 'Mark completed',
    markIncomplete: 'Mark uncompleted',

    saturdayBannerText: "It's Saturday morning! Your weekly retrospective is ready to evaluate.",
    startReviewBtn: 'Start Review',

    todayMomentum: "Today's Momentum",
    tasksDoneSummary: (done, total) => `${done} of ${total} done`,
    focusForToday: (count) => `Focus For Today (${count})`,
    allClearToday: 'All clear for today!',
    allClearSubtitle: 'You have accomplished all your goals for today. Relax or plan ahead for tomorrow.',
    nothingScheduledToday: 'Nothing scheduled for today yet',
    nothingScheduledSubtitle: 'Add your intentions for today, or open the Planner to schedule ahead.',
    addFirstTask: 'Add First Task',
    overdueTasks: (count) => `Overdue (${count})`,
    completedTodayCount: (count) => `Completed Today (${count})`,

    tomorrowBlueprint: "Tomorrow's Blueprint",
    tomorrowHeadline: 'Set yourself up for a calm, purposeful tomorrow',
    tomorrowDesc: 'Write down your 2-3 highest leverage tasks tonight. When you wake up, your compass is already set.',
    planForTomorrowBtn: 'Plan for Tomorrow',
    noTasksTomorrow: 'No tasks planned for tomorrow yet. Click "Plan for Tomorrow" to schedule ahead.',
    next7DaysAhead: 'Next 7 Days Ahead',
    proactiveScheduling: 'Proactive Scheduling',
    taskCountLabel: (count) => `(${count} ${count === 1 ? 'task' : 'tasks'})`,
    addToThisDay: 'Add to this day',
    emptySlot: 'Empty slot. No tasks scheduled.',

    stepsDone: (done, total) => `${done} of ${total} steps`,
    addStep: 'Add step',
    stepPlaceholder: 'Add step...',
    addBtn: 'Add',
    cancelBtn: 'Cancel',
    moveToday: 'Move to Today',
    moveTomorrow: 'Move to Tomorrow',
    move3Days: 'In 3 Days',
    editDetails: 'Edit details...',
    deleteTask: 'Delete task',
    checklistHeader: (done, total) => `Checklist (${done}/${total})`,
    reschedule: 'Reschedule',

    editTaskTitle: 'Edit Task',
    newTaskTitle: 'New Task or Intention',
    titleLabel: 'Title *',
    titlePlaceholder: 'e.g., Draft the product roadmap or Go for a 20m run',
    notesLabel: 'Notes & Context',
    notesPlaceholder: 'Add links, context, or thoughts...',
    whenLabel: 'When should this happen?',
    in2Days: 'In 2 Days',
    saturday: 'Saturday',
    priorityLabel: 'Priority',
    spaceLabel: 'Space / Category',
    stepsLabel: 'Checklist / Steps',
    createTaskBtn: 'Create Task',
    saveChangesBtn: 'Save Changes',

    recurrenceLabel: 'Repeat',
    recNone: 'Once',
    recDaily: 'Daily',
    recWeekdays: 'Weekdays',
    recWeekly: 'Weekly',
    streakBadge: (count) => `${count}d streak`,

    quickAddPlaceholder: 'Quick Add...',
    quickAddButton: 'Add Task',
    calendarTab: 'Monthly Calendar',
    plannerTab: 'Next 7 Days',
    planForThisDay: 'Plan for this day',
    noTasksOnSelectedDay: 'No tasks scheduled for this day',

    priorityUrgent: 'Urgent',
    priorityUrgentDesc: 'Must do now',
    priorityHigh: 'High',
    priorityHighDesc: 'Core priority',
    priorityMedium: 'Medium',
    priorityMediumDesc: 'Standard task',
    priorityLow: 'Low',
    priorityLowDesc: 'Nice to have',

    catGeneral: 'General',
    catPersonal: 'Personal',
    catWork: 'Work',
    catHabits: 'Habits',
    catLearning: 'Learning',
    catHealth: 'Health',

    satReviewTitle: 'Saturday Weekly Review',
    satMorningLabel: '(Saturday Morning)',
    retrospectiveFor: (label) => `Retrospective for ${label}`,
    weeklyScoreTab: 'Weekly Score',
    historyTab: (count) => `History (${count})`,
    evaluatingCycle: 'Evaluating cycle:',
    concludedWeek: (label) => `Concluded Week (${label})`,
    ongoingWeek: 'Ongoing Week',
    perfAssessment: 'Weekly Performance Assessment',
    outOf100: 'out of 100',
    completionRate: 'Completion Rate',
    keyPrioritiesHit: 'Key Priorities Hit',
    keyPrioritiesWeight: 'Weight factor: 25% of final score',
    consistencyScore: 'Consistency Score',
    consistencyDesc: 'Daily discipline & spread',
    tasksSlippedTitle: (count) => `Tasks That Slipped (${count})`,
    tasksSlippedSubtitle: 'Roll them over to this week',
    completedVictoriesTitle: (count) => `Completed Victories (${count})`,
    satReflectionLabel: 'Saturday Reflection & Journal',
    satReflectionPlaceholder: 'What went well this week? What held you back? What will you do differently next week?',
    pastReportsTitle: 'Past Weekly Reports',
    noPastReports: 'No past saved reviews yet. Complete your first review and hit "Save & Complete Review".',
    reviewsSavedLocally: 'Reviews are saved locally to your device.',
    dismissBtn: 'Dismiss',
    saveReviewBtn: 'Save & Complete Review',
    savedDone: 'Saved! ✓',

    backupTitle: 'Local Storage & Data Portability',
    backupIntro: "All your data is kept securely in your browser's local storage. No servers, no accounts, no subscriptions.",
    storedOnDevice: (count) => `${count} tasks stored on this device`,
    exportJson: 'Export Backup (JSON)',
    restoreJson: 'Restore from Backup (JSON)',
    resetSample: 'Clear All Tasks',
    closeBtn: 'Close',
    resetConfirm: 'Are you sure you want to clear all tasks from this device?',
    backupDownloaded: 'Backup downloaded successfully!',
    restoredSuccess: (count) => `Restored ${count} tasks successfully!`,

    tutorialTitle: 'Welcome to tedlist',
    tutorialSubtitle: 'A quiet, intentional space to guide your daily tasks.',
    tutorialStep1Title: 'Daily Focus & Rhythm',
    tutorialStep1Desc: 'Start each day with clear intentions. Tick them off as you accomplish them throughout the day.',
    tutorialStep2Title: 'Plan Tomorrow & Ahead',
    tutorialStep2Desc: 'Set up your tomorrow before going to sleep. When you wake up, your compass is already set.',
    tutorialStep3Title: 'Saturday Weekly Review',
    tutorialStep3Desc: 'Reflect on your week and receive a score based on completion and consistency.',
    tutorialStep4Title: '100% Local & Private',
    tutorialStep4Desc: 'Zero servers, zero tracking. All your tasks live only on your device, fully offline-ready.',
    tutorialNext: 'Next',
    tutorialPrev: 'Back',
    tutorialStart: 'Get Started',
    tutorialSkip: 'Skip Tour',

    pwaTitle: 'Download Android APK',
    pwaDesc: 'Download the standalone Android APK to run tedlist natively, fast, and 100% offline on your device.',
    pwaIosHint: 'Download and install the APK directly on your Android phone.',
    pwaInstallBtn: 'Download APK',
    pwaLaterBtn: 'Maybe Later',
    apkTitle: 'Download Android APK',
    apkDesc: 'Download tedlist APK directly for Android. Install and use it completely offline and locally on your phone with zero tracking and maximum performance.',
    apkInstallBtn: 'Download APK File',
    apkLaterBtn: 'Maybe Later',
    apkBadge: 'Android APK',
    apkOfflineBadge: '100% Offline & Local',
    apkStep1: 'Download the APK file onto your Android device.',
    apkStep2: 'Open the downloaded file and tap Install (allow unknown sources if prompted).',
    apkStep3: 'Enjoy tedlist with full offline storage and zero internet required.',
  },
  fa: {
    appName: 'tedlist',
    appSubtitle: 'مدیریت ساده و هوشمند کارها',
    newTask: 'کار جدید',
    quickAddKey: 'N',
    rhythm: 'برنامه',
    today: 'امروز',
    planner: 'برنامه‌ریزی آینده',
    saturdayReview: 'ارزیابی شنبه',
    saturdayReviewDue: 'موعد بررسی',
    allTasks: 'همه کارها',
    completedLog: 'کارهای انجام‌شده',
    spaces: 'دسته‌بندی‌ها',
    allSpaces: 'همه دسته‌ها',
    localBackup: 'پشتیبان‌گیری محلی',
    localPrivacyNote: '۱۰۰٪ خصوصی در مرورگر شما. بدون سرور و بدون ردیابی.',

    todayHeading: 'امروز',
    todaySubtitle: 'روی کارهای اصلی امروز تمرکز کن و در طول روز با خیال راحت تیک بزن.',
    plannerHeading: 'برنامه‌ریزی روزهای آینده',
    plannerSubtitle: 'برنامه فردا، آخر هفته یا روزهای پیش‌رو را از قبل مشخص کن.',
    reviewHeading: 'ارزیابی هفتگی صبح شنبه',
    reviewSubtitle: 'نمره عملکرد هفته گذشته از ۱۰۰ بر اساس کارها و پیوستگی شما.',
    completedHeading: 'کارهای انجام‌شده',
    completedSubtitle: 'دفترچه تمام کارهایی که به پایان رسانده‌اید.',
    allHeading: 'تمام کارها',
    allSubtitle: 'فهرست تمام برنامه‌ها و کارهای ثبت‌شده شما.',
    searchPlaceholder: 'جستجو در کارها، یادداشت‌ها یا دسته‌ها...',
    filterLabel: 'فیلتر:',
    allFilter: 'همه',
    addTaskBtn: 'افزودن کار',
    weeklyReviewBtn: 'ارزیابی هفتگی',
    themeToggleDark: 'حالت تیره',
    themeToggleLight: 'حالت روشن',
    themeDarkShort: 'تیره',
    themeLightShort: 'روشن',
    showingTaskCount: (count) => `نمایش ${count} کار`,
    noTasksMatchingFilters: 'هیچ کاری با فیلترهای فعال شما همخوانی ندارد.',
    archivedAccomplishments: (count) => `دستاوردهای آرشیو شده: مجموعاً ${count} کار تکمیل‌شده`,
    noCompletedTasksYet: 'هنوز کاری تکمیل نشده است. کارهای امروز را تکمیل کنید تا موفقیت شما اینجا ثبت شود!',
    satReviewHeroTitle: 'ارزیابی هفتگی و نمره‌دهی شنبه',
    satReviewHeroDesc: 'برای باز شدن پنجره ارزیابی، محاسبه نمره از ۱۰۰ و بررسی کارهای انجام‌شده و عقب‌افتاده، دکمه زیر را بزنید.',
    urgentHighBadge: 'فوری / بالا',
    ptsLabel: 'امتیاز',
    historyTaskSummary: (completed, total, urgentHigh) => `${completed} از ${total} کار انجام شد (${urgentHigh} کار با اولویت بالا)`,
    markComplete: 'تکمیل شد',
    markIncomplete: 'ناتمام',

    saturdayBannerText: 'صبح شنبه بخیر! ارزیابی و نمره هفته گذشته شما آماده است.',
    startReviewBtn: 'شروع ارزیابی',

    todayMomentum: 'پیشرفت امروز',
    tasksDoneSummary: (done, total) => `${done} از ${total} انجام شد`,
    focusForToday: (count) => `کارهای امروز (${count})`,
    allClearToday: 'همه کارهای امروز تمام شد!',
    allClearSubtitle: 'شما تمام اهداف امروز را تکمیل کرده‌اید. استراحت کنید یا برای فردا برنامه‌ریزی کنید.',
    nothingScheduledToday: 'کاری برای امروز ثبت نشده است',
    nothingScheduledSubtitle: 'کارهای امروزتان را اضافه کنید، یا وارد بخش برنامه‌ریزی آینده شوید.',
    addFirstTask: 'اولین کار را ثبت کن',
    overdueTasks: (count) => `عقب‌افتاده (${count})`,
    completedTodayCount: (count) => `انجام‌شده‌های امروز (${count})`,

    tomorrowBlueprint: 'طرح فردای من',
    tomorrowHeadline: 'فردایی آرام و باانگیزه برای خود بسازید',
    tomorrowDesc: 'امشب ۲ الی ۳ کار مهم فردا را مشخص کنید تا فردا صبح با ذهنی شفاف روزتان را شروع کنید.',
    planForTomorrowBtn: 'برنامه‌ریزی برای فردا',
    noTasksTomorrow: 'هنوز کاری برای فردا ثبت نشده. دکمه برنامه‌ریزی را بزنید.',
    next7DaysAhead: '۷ روز آینده',
    proactiveScheduling: 'زمان‌بندی پیش‌دستانه',
    taskCountLabel: (count) => `(${count} کار)`,
    addToThisDay: 'افزودن به این روز',
    emptySlot: 'برنامه‌ای ثبت نشده است.',

    stepsDone: (done, total) => `${done} از ${total} مرحله`,
    addStep: 'افزودن مرحله',
    stepPlaceholder: 'عنوان مرحله...',
    addBtn: 'افزودن',
    cancelBtn: 'انصراف',
    moveToday: 'انتقال به امروز',
    moveTomorrow: 'انتقال به فردا',
    move3Days: '۳ روز دیگر',
    editDetails: 'ویرایش جزئیات...',
    deleteTask: 'حذف کار',
    checklistHeader: (done, total) => `چک‌لیست مراحل (${done}/${total})`,
    reschedule: 'تغییر زمان‌بندی',

    editTaskTitle: 'ویرایش کار',
    newTaskTitle: 'کار یا هدف جدید',
    titleLabel: 'عنوان کار *',
    titlePlaceholder: 'مثلاً: مطالعه فصل اول یا ۳۰ دقیقه پیاده‌روی',
    notesLabel: 'یادداشت و جزئیات',
    notesPlaceholder: 'توضیحات، لینک‌ها یا نکات مهم...',
    whenLabel: 'زمان انجام چه زمانی است؟',
    in2Days: '۲ روز دیگر',
    saturday: 'شنبه',
    priorityLabel: 'اولویت',
    spaceLabel: 'دسته‌بندی',
    stepsLabel: 'مراحل انجام کار',
    createTaskBtn: 'ثبت کار',
    saveChangesBtn: 'ذخیره تغییرات',

    recurrenceLabel: 'تکرار و استمرار',
    recNone: 'یک‌بار',
    recDaily: 'هر روز',
    recWeekdays: 'روزهای کاری',
    recWeekly: 'هفتگی',
    streakBadge: (count) => `${count} روز پیوسته`,

    quickAddPlaceholder: 'افزودن سریع...',
    quickAddButton: 'ثبت کار',
    calendarTab: 'تقویم ماهانه',
    plannerTab: '۷ روز آینده',
    planForThisDay: 'افزودن کار به این تاریخ',
    noTasksOnSelectedDay: 'کاری برای این تاریخ ثبت نشده است',

    priorityUrgent: 'فوری',
    priorityUrgentDesc: 'باید فوراً انجام شود',
    priorityHigh: 'بالا',
    priorityHighDesc: 'کار اساسی و مهم',
    priorityMedium: 'معمولی',
    priorityMediumDesc: 'کارهای روتین',
    priorityLow: 'پایین',
    priorityLowDesc: 'در صورت فرصت',

    catGeneral: 'عمومی',
    catPersonal: 'شخصی',
    catWork: 'کاری',
    catHabits: 'عادت‌ها',
    catLearning: 'یادگیری',
    catHealth: 'سلامتی',

    satReviewTitle: 'ارزیابی هفتگی شنبه',
    satMorningLabel: '(صبح شنبه)',
    retrospectiveFor: (label) => `بازنگری هفته ${label}`,
    weeklyScoreTab: 'نمره این هفته',
    historyTab: (count) => `تاریخچه (${count})`,
    evaluatingCycle: 'دوره مورد بررسی:',
    concludedWeek: (label) => `هفته گذشته (${label})`,
    ongoingWeek: 'هفته جاری',
    perfAssessment: 'تحلیل عملکرد و نمره هفته',
    outOf100: 'از ۱۰۰ نمره',
    completionRate: 'درصد انجام کل کارها',
    keyPrioritiesHit: 'کارهای مهم و فوری انجام‌شده',
    keyPrioritiesWeight: 'ضریب: ۲۵٪ از کل نمره',
    consistencyScore: 'امتیاز پیوستگی روزانه',
    consistencyDesc: 'نظم و استمرار در طول روزها',
    tasksSlippedTitle: (count) => `کارهای انجام‌نشده (${count})`,
    tasksSlippedSubtitle: 'انتقال سریع به هفته جدید',
    completedVictoriesTitle: (count) => `موفقیت‌ها و کارهای تکمیل‌شده (${count})`,
    satReflectionLabel: 'دفترچه یادداشت و تأمل شنبه',
    satReflectionPlaceholder: 'این هفته چه کارهایی خوب پیش رفت؟ چه چیزی تمرکزت رو گرفت؟ هفته بعد چه هدفی داری؟',
    pastReportsTitle: 'گزارش‌های هفتگی قبلی',
    noPastReports: 'هنوز گزارشی ذخیره نشده است.',
    reviewsSavedLocally: 'تمام گزارش‌ها روی حافظه دستگاه شما ذخیره می‌شوند.',
    dismissBtn: 'بستن',
    saveReviewBtn: 'ذخیره و ثبت ارزیابی',
    savedDone: 'ذخیره شد! ✓',

    backupTitle: 'ذخیره‌سازی و پشتیبان‌گیری محلی',
    backupIntro: 'تمام داده‌های شما در حافظه محلی مرورگر ذخیره می‌شود؛ بدون حساب کاربری و بدون سرور.',
    storedOnDevice: (count) => `${count} کار در این دستگاه ذخیره شده است`,
    exportJson: 'خروجی فایل پشتیبان (JSON)',
    restoreJson: 'بازگردانی از فایل پشتیبان (JSON)',
    resetSample: 'پاک کردن تمام کارها',
    closeBtn: 'بستن',
    resetConfirm: 'آیا از پاک کردن تمام کارهای ذخیره‌شده روی این دستگاه مطمئن هستید؟',
    backupDownloaded: 'فایل پشتیبان با موفقیت دانلود شد!',
    restoredSuccess: (count) => `${count} کار با موفقیت بازیابی شد!`,

    tutorialTitle: 'به tedlist خوش آمدید',
    tutorialSubtitle: 'فضایی آرام، مینیمال و کاربردی برای مدیریت و پیشبرد کارهای روزانه شما.',
    tutorialStep1Title: 'تمرکز بر امروز',
    tutorialStep1Desc: 'هر روز کارهای اساسی همان روز را ببینید و در طول روز با آرامش آن‌ها را تیک بزنید.',
    tutorialStep2Title: 'برنامه‌ریزی فردا و روزهای آینده',
    tutorialStep2Desc: 'شب‌ها قبل از خواب کارهای مهم فردا را مشخص کنید تا صبحتان را با جهتی روشن شروع کنید.',
    tutorialStep3Title: 'ارزیابی هفتگی',
    tutorialStep3Desc: 'عملکرد هفته را بر اساس کارها و پیوستگی خود بسنجید، کارهای عقب‌افتاده را منتقل کنید و یادداشت بنویسید.',
    tutorialStep4Title: '۱۰۰٪ محلی و خصوصی',
    tutorialStep4Desc: 'بدون نیاز به سرور یا اینترنت؛ همه اطلاعات روی دستگاه شما ذخیره می‌شود و همیشه در دسترس است.',
    tutorialNext: 'بعدی',
    tutorialPrev: 'قبلی',
    tutorialStart: 'شروع کار با برنامه',
    tutorialSkip: 'رد شدن',

    pwaTitle: 'دانلود نسخه اندروید (APK)',
    pwaDesc: 'فایل نصبی مستقیم (APK) برنامه tedlist را برای گوشی اندروید دریافت کنید. کاملاً آفلاین، با ذخیره محلی و بدون نیاز به اینترنت.',
    pwaIosHint: 'فایل نصبی اندروید (APK) را دانلود کرده و مستقیماً روی گوشی نصب کنید.',
    pwaInstallBtn: 'دانلود فایل APK',
    pwaLaterBtn: 'شاید بعداً',
    apkTitle: 'دانلود نسخه اندروید (APK)',
    apkDesc: 'فایل نصبی مستقیم (APK) برنامه tedlist را برای گوشی اندروید خود دانلود کنید. کاملاً آفلاین، با ذخیره‌سازی محلی روی گوشی و بدون نیاز به اینترنت.',
    apkInstallBtn: 'دانلود مستقیم فایل APK',
    apkLaterBtn: 'شاید بعداً',
    apkBadge: 'اپلیکیشن اندروید (APK)',
    apkOfflineBadge: '۱۰۰٪ آفلاین و محلی',
    apkStep1: 'فایل نصبی APK را دانلود کنید.',
    apkStep2: 'فایل دانلود شده را باز کرده و Install را بزنید (در صورت درخواست، مجوز نصب را تأیید کنید).',
    apkStep3: 'برنامه روی گوشی نصب شده و تمام داده‌ها در حافظه محلی ذخیره خواهند شد.',
  },
};

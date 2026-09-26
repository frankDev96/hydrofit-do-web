export type TipCategory = 'Morning' | 'Workout' | 'Nutrition' | 'Habits';

export type Tip = {
    id: string;
    category: TipCategory;
    title: string;
    description: string;
};

export const TIPS: Tip[] = [
    {
        id: 'morning-flush',
        category: 'Morning',
        title: 'Morning Flush',
        description: 'Drink 250–500 ml soon after waking to replace overnight fluid loss and ease into your day.',
    },
    {
        id: 'morning-thirst-lag',
        category: 'Morning',
        title: 'Thirst Lags Behind',
        description: "Don't wait until you feel thirsty. Sip early so focus and energy stay steady.",
    },
    {
        id: 'morning-urine',
        category: 'Morning',
        title: 'Pale Yellow Check',
        description: "A pale yellow color usually means you're on track. Darker urine can be a cue to drink more.",
    },
    {
        id: 'morning-before-coffee',
        category: 'Morning',
        title: 'Water Before Coffee',
        description: "Have a glass of water before your first coffee so caffeine isn't your only morning fluid.",
    },
    {
        id: 'pre-workout',
        category: 'Workout',
        title: 'Pre-Workout Boost',
        description: 'Sip 200–300 ml about 15–30 minutes before exercise so you start primed, not catching up.',
    },
    {
        id: 'during-workout',
        category: 'Workout',
        title: 'Sip Between Sets',
        description: 'Small sips during training help maintain performance without a heavy stomach.',
    },
    {
        id: 'post-workout',
        category: 'Workout',
        title: 'Refill After Sweat',
        description: "After a sweaty session, replace fluids you lost. Don't wait until you're home and exhausted.",
    },
    {
        id: 'eat-water',
        category: 'Nutrition',
        title: 'Eat Your Water',
        description: 'Cucumber, watermelon, oranges, and soups add fluids. Snack and sip smart.',
    },
    {
        id: 'before-meals',
        category: 'Nutrition',
        title: 'Water Before Meals',
        description: 'A glass before eating is an easy habit that keeps intake steady across the day.',
    },
    {
        id: 'caffeine-balance',
        category: 'Nutrition',
        title: 'Balance the Brew',
        description: "Enjoy coffee or tea, then add water nearby so caffeine doesn't crowd out hydration.",
    },
    {
        id: 'listen-body',
        category: 'Habits',
        title: 'Listen to Your Body',
        description:
            'Use your HydroFit target as a guide, then fine-tune based on how you feel and how active you are.',
    },
    {
        id: 'desk-glass',
        category: 'Habits',
        title: 'Keep a Desk Glass',
        description:
            "A visible bottle or glass is a quiet reminder. Refill it once and you've already won the morning.",
    },
    {
        id: 'streak-cue',
        category: 'Habits',
        title: 'Protect the Streak',
        description: "You've built momentum. A small sip now keeps the chain alive and the habit automatic.",
    },
    {
        id: 'evening-taper',
        category: 'Habits',
        title: 'Ease Off at Night',
        description: "Front-load fluids earlier so you're hydrated by evening without disrupting sleep.",
    },
];

export const TIP_CATEGORIES: Array<'All' | TipCategory> = ['All', 'Morning', 'Workout', 'Nutrition', 'Habits'];

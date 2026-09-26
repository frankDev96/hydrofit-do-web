/**
 * Navigation type definitions — shared across routes.
 */
export type RootStackParamList = {
    Onboarding: undefined;
    Today: undefined;
    Main: undefined;
    Home: undefined;
    Settings: undefined;
    ReminderSound: undefined;
    LanguageSelect: undefined;
    Notifications: undefined;
    HydrationTips: { tipId?: string } | undefined;
    ContainerSelect: undefined;
    EditProfile: undefined;
    PrivacyPolicy: undefined;
    TermsOfService: undefined;
    HelpSupport: undefined;
    AdsPrivacy: undefined;
};

export type RootStackNavigationProp = {
    navigate: (screen: keyof RootStackParamList, params?: RootStackParamList[keyof RootStackParamList]) => void;
    goBack: () => void;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = {
    navigation: RootStackNavigationProp;
    route: { key: string; name: T; params: RootStackParamList[T] };
};

export type MainTabParamList = {
    Home: undefined;
    Stats: undefined;
    Plan: undefined;
    Profile: undefined;
};

export type OnboardingStackParamList = {
    Welcome: undefined;
    Onboarding: undefined;
    PrivacyPolicy: undefined;
};

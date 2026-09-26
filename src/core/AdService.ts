import { shouldOfferInterstitial } from '@common/utils/adInterstitialPolicy';

export type InterstitialTrigger = {
    logCountToday: number;
    didJustHitDailyGoal: boolean;
};

type AdsListener = () => void;

let initialized = false;
const listeners = new Set<AdsListener>();

function emit(): void {
    listeners.forEach(listener => listener());
}

async function initialize(): Promise<void> {
    initialized = true;
    emit();
}

function canRequestAds(): boolean {
    return false;
}

function subscribe(listener: AdsListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function maybeShowInterstitial(trigger: InterstitialTrigger): void {
    if (!initialized || !shouldOfferInterstitial(trigger.logCountToday, trigger.didJustHitDailyGoal)) return;
}

async function showPrivacyOptionsForm(): Promise<boolean> {
    return false;
}

function resetForTests(): void {
    initialized = false;
    listeners.clear();
}

const AdService = {
    initialize,
    canRequestAds,
    subscribe,
    maybeShowInterstitial,
    showPrivacyOptionsForm,
    resetForTests,
};

export default AdService;

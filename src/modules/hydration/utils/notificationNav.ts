import { PROFILE_ACHIEVEMENT_IDS, type ProfileAchievementId } from './profileAchievements';

export type NotificationNavTarget = 'tips' | 'profile' | 'app';

export type ResolvedNotificationNav = {
    target: NotificationNavTarget;
    tipId?: string;
    achievementId?: ProfileAchievementId;
};

const TIP_REVEAL_PREFIX = 'tip:reveal:';
const TIP_URGE_PREFIX = 'tip:urge:';
const ACHIEVEMENT_PREFIX = 'achievement:';

/** Extract catalog tip id from inbox / tray ids, if present. */
export function parseTipIdFromInboxId(inboxId: string): string | undefined {
    if (inboxId.startsWith(TIP_REVEAL_PREFIX)) {
        const tipId = inboxId.slice(TIP_REVEAL_PREFIX.length);
        return tipId.length > 0 ? tipId : undefined;
    }
    if (inboxId.startsWith(TIP_URGE_PREFIX)) {
        const rest = inboxId.slice(TIP_URGE_PREFIX.length);
        const lastColon = rest.lastIndexOf(':');
        if (lastColon <= 0) {
            return rest.length > 0 ? rest : undefined;
        }
        const tipId = rest.slice(0, lastColon);
        return tipId.length > 0 ? tipId : undefined;
    }
    return undefined;
}

function parseAchievementIdFromInboxId(inboxId: string): ProfileAchievementId | undefined {
    if (!inboxId.startsWith(ACHIEVEMENT_PREFIX)) {
        return undefined;
    }
    const id = inboxId.slice(ACHIEVEMENT_PREFIX.length);
    return (PROFILE_ACHIEVEMENT_IDS as readonly string[]).includes(id) ? (id as ProfileAchievementId) : undefined;
}

function asString(value: unknown): string | undefined {
    return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function isNavTarget(value: string | undefined): value is NotificationNavTarget {
    return value === 'tips' || value === 'profile' || value === 'app';
}

/**
 * Resolve OS notification data into an in-app navigation target.
 * Prefers explicit `nav` field; falls back to inboxId shape for older payloads.
 */
export function resolveNotificationNav(data: Record<string, unknown> | undefined | null): ResolvedNotificationNav {
    if (!data || typeof data !== 'object') {
        return { target: 'app' };
    }

    const tipIdField = asString(data.tipId);
    const achievementField = asString(data.achievementId);
    const inboxId = asString(data.inboxId);
    const navField = asString(data.nav);

    if (isNavTarget(navField)) {
        if (navField === 'tips') {
            return {
                target: 'tips',
                tipId: tipIdField ?? (inboxId ? parseTipIdFromInboxId(inboxId) : undefined),
            };
        }
        if (navField === 'profile') {
            const fromField =
                achievementField && (PROFILE_ACHIEVEMENT_IDS as readonly string[]).includes(achievementField)
                    ? (achievementField as ProfileAchievementId)
                    : undefined;
            return {
                target: 'profile',
                achievementId: fromField ?? (inboxId ? parseAchievementIdFromInboxId(inboxId) : undefined),
            };
        }
        return { target: 'app' };
    }

    if (inboxId) {
        const tipId = parseTipIdFromInboxId(inboxId);
        if (tipId || inboxId.startsWith('tip:') || inboxId === 'curated:tip') {
            return { target: 'tips', tipId };
        }
        const achievementId = parseAchievementIdFromInboxId(inboxId);
        if (achievementId) {
            return { target: 'profile', achievementId };
        }
    }

    return { target: 'app' };
}

/** Build Notifee string data for an inbox emit kind. */
export function buildTrayNavData(input: {
    kind: 'welcome' | 'achievement' | 'goal' | 'workout' | 'tip' | 'update';
    id: string;
    achievementId?: ProfileAchievementId;
}): Record<string, string> {
    switch (input.kind) {
        case 'tip': {
            const tipId = parseTipIdFromInboxId(input.id);
            return tipId ? { nav: 'tips', tipId } : { nav: 'tips' };
        }
        case 'achievement': {
            const achievementId = input.achievementId ?? parseAchievementIdFromInboxId(input.id);
            return achievementId ? { nav: 'profile', achievementId } : { nav: 'profile' };
        }
        default:
            return { nav: 'app' };
    }
}

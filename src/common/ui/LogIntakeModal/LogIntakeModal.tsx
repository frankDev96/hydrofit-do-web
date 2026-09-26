import React, { useState } from 'react';
import { absoluteFill, css } from '@/common/css';
import { withTapHaptic } from '@common/haptics/tapHaptic';
import { InfoCircleIcon } from '@common/icons';
import { formatDateTo12Hour, isPastLocalTime } from '@common/utils';
import { INTAKE_QUICK_PRESETS } from '@common/constants';
import { useTranslation } from '@i18n';
import { BorderRadius, IconSize, Spacing, useColors, useThemedStyles, type ThemeColors } from '@theme';
import { CommonAlert } from '../CommonAlert/CommonAlert';
import { CommonButton } from '../CommonButton/CommonButton';
import { CommonModal, CommonModalSection } from '../CommonModal/CommonModal';
import { CommonTimePicker } from '../CommonTimePicker/CommonTimePicker';

export type LogIntakeModalProps = {
    visible: boolean;
    initialAmount?: number;
    initialTime?: Date;
    presets?: number[];
    title?: string;
    onClose: () => void;
    onConfirm: (amountMl: number, loggedAtMs: number) => void;
};

const DEFAULT_PRESETS: number[] = [...INTAKE_QUICK_PRESETS];

export function LogIntakeModal(props: LogIntakeModalProps): React.JSX.Element {
    const sessionKey = `${String(props.visible)}:${props.initialAmount ?? ''}:${props.initialTime?.getTime() ?? ''}`;
    return <LogIntakeModalSession key={sessionKey} {...props} />;
}

function LogIntakeModalSession({
    visible,
    initialAmount = 250,
    initialTime,
    presets = DEFAULT_PRESETS,
    title,
    onClose,
    onConfirm,
}: LogIntakeModalProps): React.JSX.Element {
    const { t } = useTranslation();
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
    const [selectedTime, setSelectedTime] = useState<Date>(() => initialTime ?? new Date());
    const [futureTimeAlertVisible, setFutureTimeAlertVisible] = useState(false);
    const resolvedTitle = title ?? t('logIntake.title');

    const dismissFutureTimeAlert = () => {
        setFutureTimeAlertVisible(false);
    };

    const handleTimeChange = (next: Date) => {
        if (!isPastLocalTime(next)) {
            setFutureTimeAlertVisible(true);
            return;
        }
        setSelectedTime(next);
    };

    const handleConfirm = () => {
        onConfirm(selectedAmount, selectedTime.getTime());
    };

    const sliderFillPercent = Math.min(Math.max((selectedAmount / 1000) * 100, 5), 100);

    return (
        <>
            <CommonModal visible={visible} title={resolvedTitle} onClose={onClose}>
                <CommonModalSection label={t('logIntake.timeOfIntake')}>
                    <CommonTimePicker
                        value={selectedTime}
                        onChange={handleTimeChange}
                        accessibilityLabel={t('logIntake.timePickerA11y', { time: formatDateTo12Hour(selectedTime) })}
                    />
                </CommonModalSection>

                <CommonModalSection label={t('logIntake.amount')}>
                    <div style={styles.amountDisplayRow}>
                        <span style={styles.amountLargeValue}>{selectedAmount}</span>
                        <span style={styles.amountUnitText}>{t('common.ml')}</span>
                    </div>

                    <div style={styles.sliderTrackContainer}>
                        <div style={styles.sliderTrackBg}>
                            <div style={css(styles.sliderTrackFill, { width: `${sliderFillPercent}%` })} />
                        </div>
                    </div>
                </CommonModalSection>

                <CommonModalSection label={t('logIntake.quickPresets')}>
                    <div style={styles.presetsGrid}>
                        {presets.map(preset => {
                            const isSelected = selectedAmount === preset;
                            return (
                                <button
                                    type="button"
                                    key={preset}
                                    onClick={withTapHaptic(() => setSelectedAmount(preset))}
                                    aria-label={t('logIntake.presetA11y', { amount: preset })}
                                    style={css(styles.presetChip, isSelected && styles.presetChipSelected)}
                                >
                                    <span
                                        style={css(styles.presetChipText, isSelected && styles.presetChipTextSelected)}
                                    >
                                        {t('common.unitMlCompact', { amount: preset })}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </CommonModalSection>

                <CommonModalSection style={styles.modalActionSection}>
                    <CommonButton
                        label={resolvedTitle}
                        onPress={handleConfirm}
                        accessibilityLabel={resolvedTitle}
                        shape="rounded"
                        elevated
                    />
                </CommonModalSection>
            </CommonModal>
            <CommonAlert
                visible={futureTimeAlertVisible}
                title={t('logIntake.futureTimeTitle')}
                description={t('logIntake.futureTimeMessage')}
                icon={<InfoCircleIcon size={IconSize.lg} color={colors.primary} />}
                onClose={dismissFutureTimeAlert}
                buttons={[
                    {
                        label: t('common.gotIt'),
                        onPress: dismissFutureTimeAlert,
                        accessibilityLabel: t('common.gotIt'),
                    },
                ]}
            />
        </>
    );
}

const createStyles = (colors: ThemeColors) => ({
    amountDisplayRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingVertical: 12,
        gap: 4,
    },
    amountLargeValue: {
        fontFamily: 'Inter-Bold',
        fontSize: 36,
        lineHeight: 36,
        letterSpacing: -0.72,
        color: colors.primary,
    },
    amountUnitText: {
        fontFamily: 'Inter-Regular',
        fontSize: 18,
        lineHeight: 28,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    sliderTrackContainer: {
        height: 24,
        justifyContent: 'center',
    },
    sliderTrackBg: {
        height: 8,
        backgroundColor: colors.cardBorder,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    sliderTrackFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: BorderRadius.full,
    },
    presetsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingTop: 4,
    },
    presetChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    presetChipSelected: {
        backgroundColor: colors.primaryDeepWash,
        borderColor: colors.primary,
    },
    presetChipText: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        lineHeight: 24,
        color: colors.text,
    },
    presetChipTextSelected: {
        color: colors.primary,
        fontFamily: 'Inter-SemiBold',
    },
    modalActionSection: {
        borderTopWidth: 1,
        borderTopColor: colors.cardBorder,
        paddingTop: Spacing.md,
    },
});

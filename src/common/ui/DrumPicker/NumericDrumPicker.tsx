import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { css, type StyleProp, type ViewStyle } from '@/common/css';
import { tickHaptic } from '@common/haptics/tickHaptic';
import { formatNumericLabel } from '@common/utils';
import { Colors, Typography } from '@theme';
import { DEFAULT_VISIBLE_ITEM_COUNT, DrumPicker, type DrumPickerProps } from './DrumPicker';
import { PickerEdgeFade } from './PickerEdgeFade';

/** Height of the top/bottom fog gradient. */
const EDGE_FADE_HEIGHT = 96;

export type NumericDrumPickerProps = {
    values: number[];
    selected: number;
    onSelect: (value: number) => void;
    /** Live preview while scrolling — must not persist or trigger expensive parent work. */
    onPreviewChange?: (value: number) => void;
    unit?: string;
    style?: StyleProp<ViewStyle>;
    /** Background color for top/bottom edge fog (defaults to card white). */
    edgeFadeColor?: string;
    /** Show fog gradients at the top and bottom edges. */
    showEdgeFade?: boolean;
} & Omit<
    DrumPickerProps,
    'items' | 'selectedIndex' | 'onChange' | 'onValueChanging' | 'renderItem' | 'style' | 'hapticFeedback'
>;

/**
 * Numeric drum picker — native wheel for unselected rows;
 * selected value is larger and darker, with a highlight band (library has no fontWeight prop).
 */
export function NumericDrumPicker({
    values,
    selected,
    onSelect,
    onPreviewChange,
    unit: _unit,
    style,
    itemHeight = 50,
    textSize = Typography.drumValue.fontSize,
    visibleItemCount = DEFAULT_VISIBLE_ITEM_COUNT,
    edgeFadeColor = Colors.surfaceAlt,
    showEdgeFade = true,
    ...pickerProps
}: NumericDrumPickerProps): React.JSX.Element {
    const selectedIndex = useMemo(() => Math.max(0, values.indexOf(selected)), [selected, values]);
    const lastLiveIndexRef = useRef(selectedIndex);
    /** Skip ticks until the native wheel has settled once (avoids a second haptic on remount). */
    const hasSettledRef = useRef(false);

    useEffect(() => {
        const nextIndex = Math.max(0, values.indexOf(selected));
        lastLiveIndexRef.current = nextIndex;
    }, [selected, values]);

    useEffect(() => {
        const initial = values[selectedIndex];
        if (initial !== undefined) {
            onSelect(initial);
        }
        // Match TimeDrumPicker: sync parent once when the picker mounts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const items = useMemo(() => values.map(formatNumericLabel), [values]);

    const handleValueChanging = useCallback(
        (event: { nativeEvent: { index: number } }) => {
            const index = event.nativeEvent.index;
            if (index === lastLiveIndexRef.current) {
                return;
            }

            const value = values[index];
            if (value === undefined) {
                return;
            }

            lastLiveIndexRef.current = index;
            onPreviewChange?.(value);
            if (hasSettledRef.current) {
                tickHaptic();
            }
        },
        [onPreviewChange, values],
    );

    const handleChange = useCallback(
        (event: { nativeEvent: { index: number } }) => {
            const index = event.nativeEvent.index;
            const value = values[index];
            if (value === undefined) {
                return;
            }
            hasSettledRef.current = true;
            lastLiveIndexRef.current = index;
            onPreviewChange?.(value);
            onSelect(value);
        },
        [onPreviewChange, onSelect, values],
    );

    return (
        <div style={css(styles.container, style)}>
            <DrumPicker
                items={items}
                selectedIndex={selectedIndex}
                onValueChanging={handleValueChanging}
                onChange={handleChange}
                itemHeight={itemHeight}
                textSize={textSize}
                selectedTextSize={Typography.drumValueSelected.fontSize}
                textColor={Colors.onboardingMutedDark}
                selectedTextColor={Colors.primary}
                visibleItemCount={visibleItemCount}
                showSelectionIndicator={false}
                virtualized={false}
                style={styles.wheel}
                {...pickerProps}
            />
            <div style={css(styles.selectionBand, { height: itemHeight, marginTop: -itemHeight / 2 })} />

            {showEdgeFade ? (
                <>
                    <PickerEdgeFade position="top" height={EDGE_FADE_HEIGHT} fadeColor={edgeFadeColor} />
                    <PickerEdgeFade position="bottom" height={EDGE_FADE_HEIGHT} fadeColor={edgeFadeColor} />
                </>
            ) : null}
        </div>
    );
}

const styles = {
    container: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    wheel: {
        width: '100%',
        height: '100%',
    },
    selectionBand: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        backgroundColor: Colors.onboardingAccentMuted,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.onboardingAccentBorder,
        zIndex: 2,
    },
};

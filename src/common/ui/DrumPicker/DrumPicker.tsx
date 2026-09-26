import React from 'react';
import { css, type StyleProp, type ViewStyle } from '@/common/css';

export const DEFAULT_ITEM_HEIGHT = 44;
export const DEFAULT_VISIBLE_ITEM_COUNT = 5;

export type DrumPickerChangeEvent = {
    nativeEvent: { index: number; value: string };
};

export type DrumPickerProps = {
    items: string[];
    selectedIndex?: number;
    itemHeight?: number;
    visibleItemCount?: number;
    textColor?: string;
    selectedTextColor?: string;
    selectionIndicatorColor?: string;
    backgroundColor?: string;
    containerBackgroundColor?: string;
    itemBackgroundColor?: string;
    textSize?: number;
    selectedTextSize?: number;
    showSelectionIndicator?: boolean;
    virtualized?: boolean;
    windowSize?: number;
    style?: StyleProp<ViewStyle>;
    onChange?: (event: DrumPickerChangeEvent) => void;
    onValueChanging?: (event: DrumPickerChangeEvent) => void;
    renderItem?: (info: { item: string; label: string; index: number; isSelected: boolean }) => React.ReactNode;
};

/** Scrollable value list backed by a native select. */
export function DrumPicker({
    items,
    selectedIndex = 0,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    visibleItemCount = DEFAULT_VISIBLE_ITEM_COUNT,
    style,
    onChange,
    onValueChanging,
}: DrumPickerProps): React.JSX.Element {
    return (
        <select
            value={String(selectedIndex)}
            aria-label="Picker"
            style={css({ width: '100%', minWidth: 64, height: itemHeight * visibleItemCount }, style)}
            onChange={event => {
                const index = Number(event.target.value);
                const value = items[index] ?? '';
                const payload = { nativeEvent: { index, value } };
                onValueChanging?.(payload);
                onChange?.(payload);
            }}
        >
            {items.map((item, index) => (
                <option key={String(index)} value={index}>
                    {item}
                </option>
            ))}
        </select>
    );
}

import { useMemo } from 'react';

import { breakpoints } from '@scripts/gds';

import { type AllowMedia, type Breakpoint, type ValueType } from './types';

const BREAKPOINTS_NAMES = Object.keys(breakpoints) as (keyof typeof breakpoints)[];
const BREAKPOINT_INDICES = new Map<string, number>();
BREAKPOINTS_NAMES.forEach((e, i) => BREAKPOINT_INDICES.set(e, i));
export const isObject = (item: AllowMedia<ValueType>) =>
    typeof item === 'object' && !Array.isArray(item) && item !== null;

const setValue = <T extends Record<string, any>>(props: T, transform?: (props: T) => ValueType | undefined) =>
    transform ? transform(props) : (Object.values(props)[0] as ValueType);

/**
 * Calculate CSS Object from component props with `AllowMedia` type (user can pass object with breakpoints through prop). CSS property can be calculated based on multiple props.
 */
// export const useCSSProperty = <T extends Record<Breakpoint, ValueType>>({
export const useCSSProperty = <T extends Record<string, any>>({
    props,
    transform,
}: {
    /** Component prop or array of props. */
    props?: T;
    /** Transform function. Applies before property value assignment. */
    transform?: (props: Partial<Record<string, ValueType>>) => ValueType | undefined;
}): Partial<Record<Breakpoint, ValueType>> | undefined =>
    useMemo(() => {
        if (!props) return;
        const propsValues = Object.values(props);
        const isUndefined = propsValues.every(value => value === undefined);
        if (isUndefined) return;

        const mediaProp = propsValues.find(value => isObject(value));
        if (!mediaProp) return { xxxl: setValue(props, transform) };

        return (Object.keys(mediaProp) as Breakpoint[])
            .sort((a, b) => BREAKPOINT_INDICES.get(a)! - BREAKPOINT_INDICES.get(b)!)
            .reduce(
                (acc, bp) => {
                    const nameIndex = BREAKPOINT_INDICES.get(bp)!;
                    const nextBp = nameIndex !== -1 && BREAKPOINTS_NAMES[nameIndex];

                    const breakpointProps = {} as Record<string, ValueType>;
                    (Object.keys(props) as string[]).forEach(key => {
                        const value = props[key];
                        const breakpointValue = !(typeof value === 'object' && !Array.isArray(value) && value !== null)
                            ? value
                            : value[bp];
                        if (breakpointValue) breakpointProps[key] = breakpointValue;
                    });

                    const rule = setValue(breakpointProps, transform);

                    return {
                        ...acc,
                        [nextBp || 'xxxl']: rule,
                    };
                },
                {} as Partial<Record<Breakpoint, ValueType>>
            );
    }, [props, transform]);

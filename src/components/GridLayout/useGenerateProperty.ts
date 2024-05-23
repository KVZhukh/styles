import { type CSSProperties, useMemo } from 'react';

import { MEDIA_QUERIES } from '@scripts/gds';

import { type Breakpoint, type ValueType } from './types';

interface IProp {
    name: string;
    value: Partial<Record<Breakpoint, ValueType>>;
}

export const useGenerateProperty = ({
    props,
    mediaClasses,
}: {
    props: IProp[];
    mediaClasses: Partial<Record<Breakpoint, string>>;
}) => {
    const mediaProperties = useMemo(
        () =>
            (Object.keys(MEDIA_QUERIES) as Breakpoint[]).reduce(
                (acc, key) => {
                    const temp = props.reduce(
                        (propAcc, p) => {
                            const value = p.value?.[key];
                            if (value) {
                                propAcc[p.name] = value;
                            }

                            return propAcc;
                        },
                        {} as Record<string, ValueType>
                    );

                    if (Object.keys(temp).length) {
                        acc[key] = temp;
                    }
                    return acc;
                },
                {} as Record<Breakpoint, Record<string, ValueType>>
            ),
        [props]
    );

    const mediaStyles = useMemo(
        () =>
            (Object.keys(mediaClasses) as Breakpoint[]).reduce<Record<string, boolean>>((acc, key) => {
                const mediaValue = mediaClasses[key];
                const dataValue = mediaProperties[key];
                if (mediaValue) acc[mediaValue] = !!dataValue;
                return acc;
            }, {}),
        [mediaClasses, mediaProperties]
    );

    const vars = useMemo<CSSProperties>(
        () =>
            (Object.keys(mediaProperties) as (keyof typeof mediaProperties)[]).reduce<Record<string, string>>(
                (acc, breakpoint) => {
                    const properties = mediaProperties[breakpoint];
                    Object.keys(properties).forEach(propertyName => {
                        const propertyValue = properties[propertyName];
                        acc[breakpoint === 'xxxl' ? `--${propertyName}` : `--${propertyName}-${breakpoint}`] =
                            `${propertyValue}`;
                    });
                    return acc;
                },
                {}
            ),
        [mediaProperties]
    );

    return { mediaStyles, vars };
};

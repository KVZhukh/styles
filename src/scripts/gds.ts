// import { createMediaQueries } from '@greensight/gds';
import tokens from '../../public/tokens.json';

export const {
    layout: { breakpoints },
} = tokens;

export type MediaKey = `(max-width: ${number}px)`;
// type MediaKeyMin = `(min-width: ${number}px)`;

export const createMediaQueries = <T extends typeof breakpoints>(breakpointsParam: T) => {
    type TKey = keyof T extends string ? keyof T : never;

    const queries = Object.entries(breakpointsParam).reduce(
        (acc, [name, value]) => ({
            ...acc,
            [name]: `(max-width: ${value - 1}px)`,
            // [`${name}Min`]: `(min-width: ${value}px)`,
        }),
        {}
    );

    return queries as Record<TKey, MediaKey>;
};

export const MEDIA_QUERIES = createMediaQueries(tokens.layout.breakpoints);

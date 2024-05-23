import { type FC, type ReactNode, useMemo } from 'react';

import cn from 'classnames';

import GridLayoutItem from './components/Item';
import { toArray } from './helpers';
import styles from './styles.module.scss';
import { type AllowMedia, type Breakpoint, type ValueType } from './types';
import { useCSSProperty } from './useCSSProperty';
import { useGenerateProperty } from './useGenerateProperty';

const MEDIA_STYLES = {
    xxl: styles.componentXxl,
    xl: styles.componentXl,
    lg: styles.componentLg,
    md: styles.componentMd,
    sm: styles.componentSm,
    xs: styles.componentXs,
    xxs: styles.componentXxs,
} as Partial<Record<Breakpoint, string>>;

type DirectionType = 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';

interface IGridLayoutProps extends Partial<Omit<HTMLDivElement, 'children' | 'align'>> {
    /** Columns settings. */
    cols?: AllowMedia<ValueType>;
    rows?: AllowMedia<ValueType>;
    /** Gaps settings. */
    gap?: AllowMedia<ValueType>;
    justify?: AllowMedia<DirectionType>;
    align?: AllowMedia<DirectionType>;
    children: ReactNode;
}

const GridLayoutComponent: FC<IGridLayoutProps> = ({ cols = 12, gap = 12, rows, justify, align, children }) => {
    const gridTemplateColumns = useCSSProperty({
        props: { cols },
        transform: ({ cols: colsParam }) => {
            if (Number.isInteger(colsParam)) return `repeat(${colsParam}, 1fr)`;
            const arr = toArray(colsParam);
            return arr.map(val => (Number.isInteger(val) ? `${val}fr` : val)).join(' ');
        },
    });

    const gridTemplateRows = useCSSProperty({
        props: { rows },
        transform: ({ rows: rowsParam }) => {
            if (Number.isInteger(rowsParam)) return `repeat(${rowsParam}, 1fr)`;
            const arr = toArray(rowsParam);
            return arr.map(val => (Number.isInteger(val) ? `${val}fr` : val)).join(' ');
        },
    });

    const gridGap = useCSSProperty({
        props: { gap },
        transform: ({ gap: gapParam }) => {
            if (Array.isArray(gapParam)) return `${gapParam[0]}px ${gapParam[1]}px`;
            return Number.isInteger(gapParam) ? `${gapParam}px` : gapParam;
        },
    });

    const justifyContent = useCSSProperty({
        props: { justify },
    });

    const alignItems = useCSSProperty({
        props: { align },
    });

    const propArray = useMemo(
        () => [
            ...(gridTemplateColumns ? [{ name: 'cols', value: gridTemplateColumns }] : []),
            ...(gridTemplateRows ? [{ name: 'rows', value: gridTemplateRows }] : []),
            ...(gridGap ? [{ name: 'gap', value: gridGap }] : []),
            ...(justifyContent ? [{ name: 'justify', value: justifyContent }] : []),
            ...(alignItems ? [{ name: 'align', value: alignItems }] : []),
        ],
        [alignItems, gridGap, gridTemplateColumns, gridTemplateRows, justifyContent]
    );

    const { mediaStyles, vars } = useGenerateProperty({
        props: propArray,
        mediaClasses: MEDIA_STYLES,
    });

    return (
        <div className={cn(styles.component, mediaStyles)} style={vars}>
            {children}
        </div>
    );
};

const GridLayout = Object.assign(GridLayoutComponent, {
    Item: GridLayoutItem,
});

export default GridLayout;

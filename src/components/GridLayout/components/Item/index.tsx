import { type FC, type HTMLProps, type ReactNode, useMemo } from 'react';

import cn from 'classnames';

import { type AllowMedia, type Breakpoint, type ValueType } from '@components/GridLayout/types';
import { useGenerateProperty } from '@components/GridLayout/useGenerateProperty';

import { useCSSProperty } from '../../useCSSProperty';
import styles from './styles.module.scss';

const MEDIA_STYLES = {
    xxl: styles.componentXxl,
    xl: styles.componentXl,
    lg: styles.componentLg,
    md: styles.componentMd,
    sm: styles.componentSm,
    xs: styles.componentXs,
    xxs: styles.componentXxs,
} as Partial<Record<Breakpoint, string>>;

type DirectionType = 'start' | 'end' | 'center' | 'stretch';

interface IGridLayoutItemProps extends HTMLProps<HTMLDivElement> {
    /** Item content. */
    children?: ReactNode;

    /** Column settings. */
    col?: AllowMedia<ValueType>;
    /** Row settings. For grids only. */
    row?: AllowMedia<ValueType>;

    /** Main axis self alignment. For grids only. */
    justify?: AllowMedia<DirectionType>;
    /** Cross axis self alignment. */
    align?: AllowMedia<DirectionType>;
    /** Order. */
    order?: AllowMedia<number>;
}

const GridLayoutItem: FC<IGridLayoutItemProps> = ({
    col: colProp,
    row: rowProp,
    justify: justifyProp,
    align: alignProp,
    order: orderProp,
    children,
}) => {
    const gridColumn = useCSSProperty({
        props: { col: colProp },
        transform: ({ col: colParam }) => {
            if (Array.isArray(colParam)) return `${colParam[0]} / ${colParam[1]}`;
            if (Number.isInteger(colParam)) return `span ${colParam}`;
            return colParam;
        },
    });

    const gridRow = useCSSProperty({
        props: { row: rowProp },
        transform: ({ row: rowParam }) => {
            if (Array.isArray(rowParam)) return `${rowParam[0]} / ${rowParam[1]}`;
            if (Number.isInteger(rowParam)) return `span ${rowParam}`;
            return rowParam;
        },
    });

    const justifySelf = useCSSProperty({
        props: { justify: justifyProp },
    });

    const alignSelf = useCSSProperty({
        props: { align: alignProp },
    });

    const order = useCSSProperty({ props: { order: orderProp } });

    const propArray = useMemo(
        () => [
            ...(gridColumn ? [{ name: 'col', value: gridColumn }] : []),
            ...(gridRow ? [{ name: 'row', value: gridRow }] : []),
            ...(justifySelf ? [{ name: 'justify', value: justifySelf }] : []),
            ...(alignSelf ? [{ name: 'align', value: alignSelf }] : []),
            ...(order ? [{ name: 'order', value: order }] : []),
        ],
        [alignSelf, gridColumn, gridRow, justifySelf, order]
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

export default GridLayoutItem;

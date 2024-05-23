'use client';

import { useState } from 'react';

import GridLayout from '@components/GridLayout';

const Page = () => {
    const [value, setValue] = useState(3);
    return (
        <>
            <input type="text" value={value} onInput={e => setValue(Number(e.currentTarget.value))} />
            <GridLayout cols={{ xxxl: 3, sm: 2 }} gap={{ xxxl: 24, md: 12 }}>
                <GridLayout.Item justify="center">center</GridLayout.Item>
                <GridLayout.Item justify="end">end</GridLayout.Item>
                <GridLayout.Item order={-1}>order</GridLayout.Item>
                <GridLayout cols={2}>2</GridLayout>
                <GridLayout>3</GridLayout>
                <GridLayout>4</GridLayout>
                <div>5</div>
                <div>6</div>
                <div>7</div>
                {/* <GridLayout cols={{ xxxl: '1fr', md: '1fr' }} gap={{ xxxl: '10px' }}>
                    1
                </GridLayout>
                <GridLayout cols={{ xxxl: '1fr', md: '1fr' }} gap={{ xxxl: '10px' }}>
                    1
                </GridLayout>
                <GridLayout cols={{ xxxl: '1fr', md: '1fr' }} gap={{ xxxl: '10px' }}>
                    1
                </GridLayout>
                <GridLayout cols={{ xxxl: '3fr', md: '4fr', sm: '1fr' }} gap={{ xxxl: '10px' }}>
                    1
                </GridLayout>
                <GridLayout cols={{ xxxl: value ? `repeat(${value}, 1fr)` : '2fr' }} gap={{ xxxl: 10 }}>
                    Управляем
                </GridLayout> */}
            </GridLayout>
        </>
    );
};

export default Page;

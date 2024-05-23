import fs from 'fs';

const tokens = JSON.parse(fs.readFileSync('./public/tokens.json', 'utf8'));

const {
    colors,
    shadows,
    layout: { breakpoints },
} = tokens;

const getVars = vars => Object.keys(vars).reduce((acc, key) => `${acc}$${key}: ${vars[key]};\n`, '');
const colorVars = getVars(colors);

const shadowsVars = getVars(shadows);

const breakpointVars = getVars(breakpoints);

const mediaMq = () => {
    const mixinHead = '@mixin mq($breakpoint) {';
    const mixinBody = '    @media (max-width: #{$breakpoint - 1}px) {    \n        @content\n    }';
    const mixinFooter = '}';

    return [mixinHead, mixinBody, mixinFooter].join('\n');
};

const mediaMinMq = () => {
    const mixinHead = '@mixin mqMin($breakpoint) {';
    const mixinBody = '    @media (min-width: #{$breakpoint}px) {    \n        @content\n    }';
    const mixinFooter = '}';

    return [mixinHead, mixinBody, mixinFooter].join('\n');
};

const scale = () => {
    const mixinHead = '@function scale($value, $minorBool: false) {';
    const mixinVars = '$major: 8;\n$minor: 4;\n$maxMinorValue: 40;';
    const mixinBody =
        '@if ($minorBool) { $value: calc($value * $minor); @if ($value > $maxMinorValue) { @return #{floor(calc($value / $major)) * $major}px;} @else { @return #{$value}px}} \n@else { @return #{calc($value * $major)}px }';
    const mixinFooter = '}';
    return [mixinHead, mixinVars, mixinBody, mixinFooter].join('\n');
};

const vars = [colorVars, shadowsVars, breakpointVars, mediaMinMq(), mediaMq(), scale()];

fs.writeFileSync('./generated.module.scss', vars.join('\n'));

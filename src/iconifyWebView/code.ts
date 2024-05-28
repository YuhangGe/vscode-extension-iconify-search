import type { Icon, IconCodeType } from '../common';

function dashToCamel(name: string) {
  return name.replace(/^./, (m) => m.toUpperCase()).replace(/-\w/g, (k) => k[1].toUpperCase());
}
export function getIconCode(icon: Icon, type: IconCodeType) {
  if (type === 'tailwindcss-react' || type === 'tailwindcss') {
    return `<span ${type === 'tailwindcss-react' ? 'className' : 'class'}="icon${`-[${icon.category}--${icon.name}]`}"></span>`;
  } else if (type === 'unocss' || type === 'unocss-react') {
    return `<div ${type === 'unocss-react' ? 'className' : 'class'}="i-${icon.category}:${icon.name}"></div>`;
  } else if (type === 'iconify-icon') {
    return `<iconify-icon icon="${icon.category}:${icon.name}"></iconify-icon>`;
  } else if (type === 'unplugin-icons') {
    return `import ${dashToCamel(icon.name)} from '~icons/${icon.category}/${icon.name}';`;
  } else if (type === 'svg') {
    return icon.body;
  } else if (type === 'react') {
    return `import type { FC, SVGProps } from 'react';
export const ${dashToCamel(icon.name)}: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (${icon.body.replace(' viewBox=', ' {...props} viewBox=')})
}`;
  } else if (type === 'vue') {
    return `<script setup lang="ts">
import { defineComponent } from 'vue';
defineComponent({
  name: ${dashToCamel(icon.name)},
});
</script>
<template>
${icon.body}
</template>
`;
  } else {
    return icon.body;
  }
}

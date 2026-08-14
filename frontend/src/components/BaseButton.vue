<template>
  <button
    :class="[
      'rounded-xl font-bold shadow-lg transition duration-150 active:scale-95 flex items-center justify-center gap-2',
      size === 'sm' ? 'py-2 px-4 text-sm w-full' : 'py-3 text-lg w-full',
      variant === 'secondary' ? 'bg-muted text-text hover:bg-muted/80' :
      variant === 'danger' ? 'bg-error/15 text-error hover:bg-error/25' :
      outlined
        ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
        : 'bg-primary text-white hover:brightness-110'
    ]"
    v-bind="$attrs"
  >
    <component :is="icon" v-if="icon" :size="size === 'sm' ? 16 : 20" />
    <slot />
  </button>
</template>

<script setup>
defineProps({
  outlined: Boolean,
  variant: { type: String, default: 'primary' }, // 'primary' | 'secondary' | 'danger'
  size: { type: String, default: 'md' },
  icon: { type: [Object, Function], default: null },
})
</script>
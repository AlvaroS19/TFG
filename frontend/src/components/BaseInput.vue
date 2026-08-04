<template>
  <div class="w-full">
    <label v-if="label" class="block text-text mb-1 text-sm font-semibold">{{ label }}</label>

    <div class="relative">
      <input
        ref="inputRef"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        class="w-full bg-text bg-opacity-10 text-text placeholder:text-text/50 border border-text/30 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-primary transition"
      />

      <div class="absolute inset-y-0 right-3 flex items-center">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, defineExpose } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
})

defineEmits(['update:modelValue'])

const inputRef = ref(null)
defineExpose({ inputRef })
</script>
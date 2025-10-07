<script setup>
  import {useTemplateRef, onMounted} from 'vue'

  defineProps({
    size: {
      type: [Number, String],
      required: true,
    }
  })

  const wrapper = useTemplateRef('wrapper')

  onMounted(() => {
    if (!['absolute', 'relative'].includes(getComputedStyle(wrapper.value).display)) {
      wrapper.value.style.display = 'relative'
    }
  })
</script>

<template>
  <div ref="wrapper" class="el" :style="{width: size + 'px', height: size + 'px', perspective: (size * 3) + 'px'}">
    <div class="absolute inset-0 size-full rotating" style="transform-style: preserve-3d;">
      <div class="absolute inset-0 size-full shading" :style="`transform: rotateY(90deg) translateZ(${size / 2 - 0.5}px);`">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABX0lEQVQ4y3VSSUuDQQydXyN48OhCse4LVg+KFhcUaxXrMqJiFbwoIvKBIBQFexFcEHexrlAQix68+KOeJJCPNG0PmWSyvJdkxqXfYtj46MPaaw9mrxpZlp86MXlaC//Qhq2vIY4v3LUgdR3F/G0zps7r0Z+pwtJjO9z6ey8n7ufHsJMbwO7LIEaj1Zi7aULyooGBjn6mkSkkmISKKZ/AFu9b4Q4+J7jg5M9j5jLCDHRfyXWxpg63C3EcfieR/U2xbzhbg8RZHduODu89X0hWn7tDm4Q6IE3tkt6MR8IY2e7Yx9ggnd8b54D4dLIQSW4IIEnk1GC6UIOJTUKEjg7tDIKgKEHi2tZEzibrTnQ35fwMYJ1aS8u2WMecXYrdshU7itOMdmYBFr8eRXblys2lGejp9Aj6mfkjWacFqSTSVdEIJOmRjpLFyRiyF/1azibpDev5LVEJgP0DsqRK7y8E/2kQKqQTbHIJAAAAAElFTkSuQmCC"
          class="size-full image-pixelated"
        >
      </div>
      <div class="absolute inset-0 size-full shading reverse" :style="`transform: translateZ(${size / 2 - 0.5}px);`">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABX0lEQVQ4y3VSSUuDQQydXyN48OhCse4LVg+KFhcUaxXrMqJiFbwoIvKBIBQFexFcEHexrlAQix68+KOeJJCPNG0PmWSyvJdkxqXfYtj46MPaaw9mrxpZlp86MXlaC//Qhq2vIY4v3LUgdR3F/G0zps7r0Z+pwtJjO9z6ey8n7ufHsJMbwO7LIEaj1Zi7aULyooGBjn6mkSkkmISKKZ/AFu9b4Q4+J7jg5M9j5jLCDHRfyXWxpg63C3EcfieR/U2xbzhbg8RZHduODu89X0hWn7tDm4Q6IE3tkt6MR8IY2e7Yx9ggnd8b54D4dLIQSW4IIEnk1GC6UIOJTUKEjg7tDIKgKEHi2tZEzibrTnQ35fwMYJ1aS8u2WMecXYrdshU7itOMdmYBFr8eRXblys2lGejp9Aj6mfkjWacFqSTSVdEIJOmRjpLFyRiyF/1azibpDev5LVEJgP0DsqRK7y8E/2kQKqQTbHIJAAAAAElFTkSuQmCC"
          class="size-full image-pixelated"
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
  @reference "tailwindcss";

  .el {
    --duration: 1s;
  }

  .rotating {
    transform: rotateY(-45deg);
    animation: var(--duration) var(--ease-in-out) infinite rotating;
  }

  @keyframes rotating {
    0% {
      transform: rotateY(0deg);
    }

    100% {
      transform: rotateY(-90deg);
    }
  }

  .shading {
    --light: 0%;
    --dark: 30%;

    &::before {
      @apply block absolute inset-0 size-full bg-black;

      content: '';
      animation: var(--duration) var(--ease-in-out) infinite dark2light;
    }

    &.reverse::before {
      animation-name: light2dark;
    }
  }

  @keyframes dark2light {
    0% {
      opacity: var(--dark);
    }
    100% {
      opacity: var(--light);
    }
  }

  @keyframes light2dark {
    0% {
      opacity: var(--light);
    }
    100% {
      opacity: var(--dark);
    }
  }
</style>

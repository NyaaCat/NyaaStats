<template>
  <section>
    <header class="px-3 pb-2 flex items-end">
      <h2 class="font-medium text-cool-gray-600 uppercase tracking-wide">{{ title }}</h2>
      <div class="ml-auto">
        <slot name="header" />
      </div>
    </header>
    <div class="rounded-md overflow-hidden shadow">
      <slot />
    </div>
  </section>
</template>

<script>
  export default {
    name: 'PlayerAsidePanel',

    props: {
      title: {
        type: String,
        default: null,
      },
    },
  }
</script>

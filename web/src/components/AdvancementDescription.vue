<template>
  <div class="advancement-description">
    <div class="upper outside" />
    <div class="upper inside" />
    <div class="middle outside">
      <div class="middle inside">
        <slot />
      </div>
    </div>
    <div class="lower inside" />
    <div class="lower outside" />
  </div>
</template>

<style>
.advancement-description .upper.outside,
.advancement-description .lower.outside {
  margin: 0 4px;
  height: 2px;
  background: #000;
}

.advancement-description .upper.inside,
.advancement-description .lower.inside {
  margin: 0 2px;
  height: 2px;
  background: #555;
  border-width: 0 2px;
  border-style: solid;
  border-color: #000;
}

.advancement-description .middle.outside {
  border-width: 0 2px;
  border-style: solid;
  border-color: #000;
}

.advancement-description .middle.inside {
  border-width: 0 2px;
  border-style: solid;
  border-color: #555;
  background: #212121;
  padding: 10px 4px 4px;
  font-size: 17px;
}
</style>

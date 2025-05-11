<template>
  <div class="layout">

    <div class="render border-4">
      <slot name="renderer"></slot>
    </div>

    <div class="intro">
      <div class="description">
        <div class="title border-5">
          <h3>
            <slot name="title"></slot>
          </h3>
        </div>

        <div class="workinfo border-1">
          <p>
            <slot name="info"></slot>
          </p>
        </div>
      </div>

      <slot name="extra"></slot>
    </div>

  </div>
</template>

<style scoped src="../assets/creation.css"></style>

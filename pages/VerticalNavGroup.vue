<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const isOpen = ref(false)
</script>

<template>
  <li
    class="nav-group"
    :class="{ 'open': isOpen }"
  >
    <div
      class="nav-group-label"
      @click="isOpen = !isOpen"
    >
      <VIcon
        :icon="item.icon || 'bxs-circle'"
        class="nav-item-icon"
      />
      <span class="nav-item-title">{{ item.title }}</span>
      <span
        v-if="item.badgeContent"
        class="nav-item-badge"
        :class="item.badgeClass"
      >
        {{ item.badgeContent }}
      </span>
      <VIcon
        icon="bx-chevron-right"
        class="nav-group-arrow"
        :class="{ 'rotate': isOpen }"
      />
    </div>
    <div class="nav-group-children-wrapper">
      <ul class="nav-group-children">
        <slot />
      </ul>
    </div>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-group {
    &-label {
      position: relative;
      display: flex;
      align-items: center;
      border-radius: 0.25rem;
      cursor: pointer;
      margin-block-end: 0.25rem;
      padding-block: 0.5rem;
      padding-inline: 1rem;

      &:hover {
        background-color: rgba(var(--v-theme-primary), 0.1);
      }

      .nav-item-icon {
        margin-inline-end: 0.75rem;
        transition: color 0.2s ease;

        i {
          display: flex;
          align-items: center;
          justify-content: center;
          block-size: 100%;
          inline-size: 100%;
        }
      }

      .nav-item-title {
        flex-grow: 1;
        font-size: 0.875rem;
      }

      .nav-item-badge {
        border-radius: 0.25rem;
        background-color: rgba(var(--v-theme-primary), 0.2);
        font-size: 0.75rem;
        margin-inline-start: 0.5rem;
        padding-block: 0.125rem;
        padding-inline: 0.375rem;
      }

      .nav-group-arrow {
        margin-inline-start: 0.5rem;
        transition: transform 0.3s ease, color 0.2s ease;

        i {
          display: flex;
          align-items: center;
          justify-content: center;
          block-size: 100%;
          inline-size: 100%;
        }

        &.rotate {
          transform: rotate(90deg);
        }
      }
    }

    .nav-group-children-wrapper {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.3s ease-in-out;

      .nav-group-children {
        overflow: hidden;
        padding-inline-start: 1.5rem;
      }
    }

    &.open {
      .nav-group-children-wrapper {
        grid-template-rows: 1fr;
      }

      .nav-item-icon,
      .nav-group-arrow {
        color: rgb(var(--v-theme-primary)) !important;
      }
    }
  }
}
</style> 

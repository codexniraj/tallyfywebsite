<script setup>
import { NuxtLink } from '#components';


const props = defineProps({
  item: {
    type: null,
    required: true,
  },
})
</script>

<template>
  <li
    class="nav-link"
    :class="{ disabled: item.disable }"
  >
    <Component
      :is="item.to ? NuxtLink : 'a'"
      :to="item.to"
      :href="item.href"
      :target="item.target"
    >
      <VIcon
        :icon="item.icon || 'bxs-circle'"
        class="nav-item-icon"
      />
      <!-- 👉 Title -->
      <span class="nav-item-title">
        {{ item.title }}
      </span>
      <span
        class="nav-item-badge"
        :class="item.badgeClass"
      >
        {{ item.badgeContent }}
      </span>
    </Component>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-link {
    margin-block: 2px;

    a {
      position: relative;
      display: flex;
      align-items: center;
      border-radius: 6px;
      cursor: pointer;
      gap: 0.625rem;
      margin-inline: 0.5rem;
      padding-block: 0.625rem;
      padding-inline: 1rem;
      transition: background-color 0.25s ease-in-out;

      .nav-item-icon {
        flex-shrink: 0;
        block-size: 24px !important;
        font-size: 24px !important;
        inline-size: 24px !important;
        max-block-size: 24px !important;
        max-inline-size: 24px !important;
        min-block-size: 24px !important;
        min-inline-size: 24px !important;
        transform: none !important;
        transition: color 0.25s ease-in-out !important;

        svg,
        i {
          block-size: 24px !important;
          inline-size: 24px !important;
          transform: none !important;
        }
      }

      .nav-item-title {
        transition: color 0.25s ease-in-out;
      }

      &:hover {
        background-color: rgba(var(--v-theme-primary), 0.05);

        .nav-item-icon {
          color: rgb(var(--v-theme-primary));
        }

        .nav-item-title {
          color: rgb(var(--v-theme-primary));
        }
      }

      &.router-link-active {
        background-color: rgba(var(--v-theme-primary), 0.1);

        .nav-item-icon {
          color: rgb(var(--v-theme-primary));
        }

        .nav-item-title {
          color: rgb(var(--v-theme-primary));
        }

        &::before {
          position: absolute;
          border-radius: 0 4px 4px 0;
          background-color: rgb(var(--v-theme-primary));
          block-size: 70%;
          content: "";
          inline-size: 0.25rem;
          inset-block-start: 50%;
          inset-inline-start: -0.5rem;
          transform: translateY(-50%);
        }
      }
    }

    &.disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
}

/* Global styles to override Vuetify icon behaviors */
.v-icon.nav-item-icon {
  transform: none !important;
  transition: color 0.25s ease-in-out !important;
}

/* Target the icon when it's inside a button or clickable element */
button .v-icon.nav-item-icon,
a .v-icon.nav-item-icon {
  transform: none !important;
}

/* Target any icon animations */
.v-icon--animated.nav-item-icon {
  animation: none !important;
  transform: none !important;
}
</style>

<script>
// Add global styles to prevent icon size changes
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .nav-item-icon.v-icon,
    .nav-item-icon .v-icon,
    .nav-item-icon svg,
    .v-icon.nav-item-icon {
      min-width: 24px !important;
      min-height: 24px !important;
      width: 24px !important;
      height: 24px !important;
      font-size: 24px !important;
      transform: none !important;
      transition: color 0.2s ease-in-out !important;
    }
    
    .v-icon--size-default.nav-item-icon {
      transform: none !important;
      width: 24px !important;
      height: 24px !important;
    }
    
    /* Target both before and after click states */
    .nav-item-icon:active,
    .nav-item-icon:focus,
    .nav-item-icon.active {
      transform: none !important;
      width: 24px !important;
      height: 24px !important;
    }
  `;
  document.head.appendChild(style);
});
</script>

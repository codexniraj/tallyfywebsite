<script setup>
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";
import VerticalNavGroup from "@layouts/components/VerticalNavGroup.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";
</script>

<template>
  <!-- 👉 Dashboards -->
  <VerticalNavGroup
    :item="{
      title: 'Dashboards',
      badgeContent: '5',
      badgeClass: 'bg-error',
      icon: 'bx-home-smile',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Analytics',
        to: '/dashboard',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'CRM',
        href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/crm',
        target: '_blank',
        badgeContent: 'Pro',
        badgeClass: 'bg-light-primary text-primary',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'ECommerce',
        href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/ecommerce',
        target: '_blank',
        badgeContent: 'Pro',
        badgeClass: 'bg-light-primary text-primary',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Academy',
        href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/academy',
        target: '_blank',
        badgeContent: 'Pro',
        badgeClass: 'bg-light-primary text-primary',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Logistics',
        href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/logistics',
        target: '_blank',
        badgeContent: 'Pro',
        badgeClass: 'bg-light-primary text-primary',
      }"
    />
  </VerticalNavGroup>

  <!-- 👉 Bulk Upload -->
  <VerticalNavGroup
    :item="{
      title: 'Accounting',
      icon: 'bx-upload',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Banking',
        to: '/banking',
        icon: ' bxs-bank',
        iconSize: '22',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Journal',
        to: '/journal',
        icon: 'bx-book-bookmark',
        iconSize: '20',
        class: 'nav-journal-link'
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Sales',
        to: '/sales',
        icon: 'bx-store',
        iconSize: '22',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Sales-Return',
        to: '/sales-return',
        icon: 'bx-cart-alt',
        iconSize: '22',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Purchase',
        to: '/purchase',
        icon: 'bx-cart-add',
        iconSize: '22',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Purchase-Return',
        to: '/purchase-return',
        icon: 'bx-cart-download',
        iconSize: '22',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Ledger',
        to: '/ledger',
        icon: 'bx-book-content',
        iconSize: '22',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Items',
        to: '/items',
        icon: 'bx-package',
        iconSize: '22',
      }"
    />
  </VerticalNavGroup>

  <!-- 👉 Front Pages -->
  <VerticalNavGroup
    :item="{
      title: 'Front Pages',
      icon: 'bx-file',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Landing',
        href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/landing-page',
        target: '_blank',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Pricing',
        href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/pricing',
        target: '_blank',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Payment',
        href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/payment',
        target: '_blank',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Checkout',
        href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/checkout',
        target: '_blank',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Help Center',
        href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/help-center',
        target: '_blank',
      }"
    />
  </VerticalNavGroup>

  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Apps & Pages',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Banking',
      icon: 'bx-envelope',
      to: '/banking',
      // badgeClass: 'bg-light-primary text-primary', 
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Chat',
      icon: 'bx-chat',
      href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/apps/chat',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Calendar',
      icon: 'bx-calendar',
      href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/apps/calendar',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Kanban',
      icon: 'bx-grid',
      href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/apps/kanban',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Excel View Demo',
      icon: 'bx-table',
      to: '/excel-view-demo',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Account Settings',
      icon: 'bx-user',
      to: '/account-settings',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Login',
      icon: 'bx-log-in',
      to: '/login',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Register',
      icon: 'bx-user-plus',
      to: '/register',
    }"
  />

  <!-- 👉 User Interface -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'User Interface',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Typography',
      icon: 'bx-text',
      to: '/typography',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Icons',
      icon: 'bx-package',
      to: '/icons',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Cards',
      icon: 'bx-credit-card',
      to: '/cards',
    }"
  />

  <!-- 👉 Forms & Tables -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Forms & Tables',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Form Layouts',
      icon: 'bx-layout',
      to: '/form-layouts',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Form Validation',
      icon: 'bx-check-circle',
      href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/forms/form-validation',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Form Wizard',
      icon: 'bx-align-middle',
      href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/forms/form-wizard-numbered',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Tables',
      icon: 'bx-table',
      to: '/tables',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Data Tables',
      to: 'forms-tables-datatables',
      icon: 'bx-table',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Excel View Demo',
      to: 'excel-view-demo',
      icon: 'bx-spreadsheet',
    }"
  />

  <!-- 👉 Others -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Others',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Access Control',
      icon: 'bx-command',
      href: 'https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/access-control',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Raise Support',
      href: 'https://github.com/themeselection/sneat-vuetify-nuxtjs-admin-template-free/issues',
      icon: 'bx-phone',
      target: '_blank',
    }"
  />
</template>

<style lang="scss">
.layout-nav-type-vertical .layout-vertical-nav .nav-group .nav-link .nav-item-icon {
  font-size: 1.5rem !important;
}

.vertical-nav-group {
  .v-list-group__items {
    .vertical-nav-link {
      i {
        margin-inline-start: 0.25rem;
      }
    }
  }
}
</style>

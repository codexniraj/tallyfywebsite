import { withCtx, createVNode, ref, mergeProps, unref, resolveDynamicComponent, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderSlot, ssrRenderVNode } from 'vue/server-renderer';
import { d as VIcon } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-7-syJ-Wh.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'pinia';
import 'vue-router';

const _sfc_main$3 = {
  __name: "VerticalNavSectionTitle",
  __ssrInlineRender: true,
  props: {
    item: {
      type: null,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<li${ssrRenderAttrs(mergeProps({ class: "nav-section-title" }, _attrs))}><div class="title-wrapper"><span class="title-text">${ssrInterpolate(__props.item.heading)}</span></div></li>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("@layouts/components/VerticalNavSectionTitle.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "VerticalNavGroup",
  __ssrInlineRender: true,
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<li${ssrRenderAttrs(mergeProps({
        class: ["nav-group", unref(isOpen) && "open"]
      }, _attrs))}><div class="nav-group-label">`);
      _push(ssrRenderComponent(VIcon, {
        icon: __props.item.icon || "bxs-circle",
        class: "nav-item-icon"
      }, null, _parent));
      _push(`<span class="nav-item-title">${ssrInterpolate(__props.item.title)}</span><span class="${ssrRenderClass([__props.item.badgeClass, "nav-item-badge"])}">${ssrInterpolate(__props.item.badgeContent)}</span>`);
      _push(ssrRenderComponent(VIcon, {
        icon: "bx-chevron-right",
        class: "nav-group-arrow"
      }, null, _parent));
      _push(`</div><div class="nav-group-children-wrapper"><ul class="nav-group-children">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</ul></div></li>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("@layouts/components/VerticalNavGroup.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "VerticalNavLink",
  __ssrInlineRender: true,
  props: {
    item: {
      type: null,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<li${ssrRenderAttrs(mergeProps({
        class: ["nav-link", { disabled: __props.item.disable }]
      }, _attrs))}>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.item.to ? unref(__nuxt_component_0) : "a"), {
        to: __props.item.to,
        href: __props.item.href,
        target: __props.item.target
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VIcon, {
              icon: __props.item.icon || "bxs-circle",
              class: "nav-item-icon"
            }, null, _parent2, _scopeId));
            _push2(`<span class="nav-item-title"${_scopeId}>${ssrInterpolate(__props.item.title)}</span><span class="${ssrRenderClass([__props.item.badgeClass, "nav-item-badge"])}"${_scopeId}>${ssrInterpolate(__props.item.badgeContent)}</span>`);
          } else {
            return [
              createVNode(VIcon, {
                icon: __props.item.icon || "bxs-circle",
                class: "nav-item-icon"
              }, null, 8, ["icon"]),
              createVNode("span", { class: "nav-item-title" }, toDisplayString(__props.item.title), 1),
              createVNode("span", {
                class: ["nav-item-badge", __props.item.badgeClass]
              }, toDisplayString(__props.item.badgeContent), 3)
            ];
          }
        }),
        _: 1
      }), _parent);
      _push(`</li>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("@layouts/components/VerticalNavLink.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "NavItems",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$2, { item: {
        title: "Dashboards",
        badgeContent: "5",
        badgeClass: "bg-error",
        icon: "bx-home-smile"
      } }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, { item: {
              title: "Analytics",
              to: "/dashboard"
            } }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, { item: {
              title: "CRM",
              href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/crm",
              target: "_blank",
              badgeContent: "Pro",
              badgeClass: "bg-light-primary text-primary"
            } }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, { item: {
              title: "ECommerce",
              href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/ecommerce",
              target: "_blank",
              badgeContent: "Pro",
              badgeClass: "bg-light-primary text-primary"
            } }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, { item: {
              title: "Academy",
              href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/academy",
              target: "_blank",
              badgeContent: "Pro",
              badgeClass: "bg-light-primary text-primary"
            } }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, { item: {
              title: "Logistics",
              href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/logistics",
              target: "_blank",
              badgeContent: "Pro",
              badgeClass: "bg-light-primary text-primary"
            } }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$1, { item: {
                title: "Analytics",
                to: "/dashboard"
              } }),
              createVNode(_sfc_main$1, { item: {
                title: "CRM",
                href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/crm",
                target: "_blank",
                badgeContent: "Pro",
                badgeClass: "bg-light-primary text-primary"
              } }),
              createVNode(_sfc_main$1, { item: {
                title: "ECommerce",
                href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/ecommerce",
                target: "_blank",
                badgeContent: "Pro",
                badgeClass: "bg-light-primary text-primary"
              } }),
              createVNode(_sfc_main$1, { item: {
                title: "Academy",
                href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/academy",
                target: "_blank",
                badgeContent: "Pro",
                badgeClass: "bg-light-primary text-primary"
              } }),
              createVNode(_sfc_main$1, { item: {
                title: "Logistics",
                href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/dashboards/logistics",
                target: "_blank",
                badgeContent: "Pro",
                badgeClass: "bg-light-primary text-primary"
              } })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$2, { item: {
        title: "Front Pages",
        icon: "bx-file",
        badgeContent: "Pro",
        badgeClass: "bg-light-primary text-primary"
      } }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, { item: {
              title: "Landing",
              href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/landing-page",
              target: "_blank"
            } }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, { item: {
              title: "Pricing",
              href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/pricing",
              target: "_blank"
            } }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, { item: {
              title: "Payment",
              href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/payment",
              target: "_blank"
            } }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, { item: {
              title: "Checkout",
              href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/checkout",
              target: "_blank"
            } }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, { item: {
              title: "Help Center",
              href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/help-center",
              target: "_blank"
            } }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$1, { item: {
                title: "Landing",
                href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/landing-page",
                target: "_blank"
              } }),
              createVNode(_sfc_main$1, { item: {
                title: "Pricing",
                href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/pricing",
                target: "_blank"
              } }),
              createVNode(_sfc_main$1, { item: {
                title: "Payment",
                href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/payment",
                target: "_blank"
              } }),
              createVNode(_sfc_main$1, { item: {
                title: "Checkout",
                href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/checkout",
                target: "_blank"
              } }),
              createVNode(_sfc_main$1, { item: {
                title: "Help Center",
                href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/front-pages/help-center",
                target: "_blank"
              } })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$3, { item: {
        heading: "Apps & Pages"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Banking",
        icon: "bx-envelope",
        to: "/banking"
        // badgeClass: 'bg-light-primary text-primary', 
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Chat",
        icon: "bx-chat",
        href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/apps/chat",
        target: "_blank",
        badgeContent: "Pro",
        badgeClass: "bg-light-primary text-primary"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Calendar",
        icon: "bx-calendar",
        href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/apps/calendar",
        target: "_blank",
        badgeContent: "Pro",
        badgeClass: "bg-light-primary text-primary"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Kanban",
        icon: "bx-grid",
        href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/apps/kanban",
        target: "_blank",
        badgeContent: "Pro",
        badgeClass: "bg-light-primary text-primary"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Account Settings",
        icon: "bx-user",
        to: "/account-settings"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Login",
        icon: "bx-log-in",
        to: "/login"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Register",
        icon: "bx-user-plus",
        to: "/register"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, { item: {
        heading: "User Interface"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Typography",
        icon: "bx-text",
        to: "/typography"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Icons",
        icon: "bx-package",
        to: "/icons"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Cards",
        icon: "bx-credit-card",
        to: "/cards"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, { item: {
        heading: "Forms & Tables"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Form Layouts",
        icon: "bx-layout",
        to: "/form-layouts"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Form Validation",
        icon: "bx-check-circle",
        href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/forms/form-validation",
        target: "_blank",
        badgeContent: "Pro",
        badgeClass: "bg-light-primary text-primary"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Form Wizard",
        icon: "bx-align-middle",
        href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/forms/form-wizard-numbered",
        target: "_blank",
        badgeContent: "Pro",
        badgeClass: "bg-light-primary text-primary"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Tables",
        icon: "bx-table",
        to: "/tables"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, { item: {
        heading: "Others"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Access Control",
        icon: "bx-command",
        href: "https://demos.themeselection.com/sneat-vuetify-nuxtjs-admin-template/demo-1/access-control",
        target: "_blank",
        badgeContent: "Pro",
        badgeClass: "bg-light-primary text-primary"
      } }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { item: {
        title: "Raise Support",
        href: "https://github.com/themeselection/sneat-vuetify-nuxtjs-admin-template-free/issues",
        icon: "bx-phone",
        target: "_blank"
      } }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/components/NavItems.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };

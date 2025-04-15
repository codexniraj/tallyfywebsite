import { _ as __nuxt_component_0 } from './nuxt-link-7-syJ-Wh.mjs';
import { ref, resolveComponent, defineComponent, withCtx, renderSlot, createVNode, unref, watchEffect, h, watch, resolveDynamicComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderStyle, ssrRenderVNode } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-BooGxS71.mjs';
import Footer from './Footer-Cjp3StJ2.mjs';
import _sfc_main$4 from './NavbarThemeSwitcher-vTz2vddq.mjs';
import _sfc_main$3 from './NavItems-BTUPZtlq.mjs';
import _sfc_main$5 from './UserProfile-COkgaQxc.mjs';
import { l as logo } from './logo-C2NYPRdy.mjs';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { _ as _export_sfc, d as VIcon, R as useRoute$1, j as useDisplay } from './server.mjs';
import { u as useToggle, s as syncRef } from './index-Cv4S-JTd.mjs';
import { V as VSpacer } from './VSpacer-CLzFRj-M.mjs';
import { V as VSelect } from './VSelect-yVA5YFWl.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'pinia';
import './VTooltip-Bgj77Y-V.mjs';
import './avatar-1-BLwzgS8N.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import './VList-DvmKJPRW.mjs';
import './index--wlg-iEi.mjs';
import './ssrBoot-BtvJZs44.mjs';
import './VDivider-BRaaa0NB.mjs';
import './VListItemAction-bIOcT3PO.mjs';
import 'vue-router';
import './VTextField-BGuE7JWy.mjs';
import './VChip-BZCaV2-K.mjs';
import './VSlideGroup-CfSzG1xQ.mjs';

function useUserCompanies() {
  const authStore = useAuthStore();
  const companies = ref([]);
  const fetchCompanies = async () => {
    if (authStore.userGroup === "Gold" && authStore.userEmail) {
      const apiUrl = `http://3.108.64.167:3001/api/getUserCompanies?email=${authStore.userEmail}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        companies.value = data;
      } catch (error) {
        console.error("Error fetching companies:", error);
        companies.value = [];
      }
    } else {
      companies.value = [];
    }
  };
  watchEffect(() => {
    fetchCompanies();
  });
  return { companies, fetchCompanies };
}
const _sfc_main$2 = {
  __name: "VerticalNav",
  __ssrInlineRender: true,
  props: {
    tag: {
      type: null,
      required: false,
      default: "aside"
    },
    isOverlayNavActive: {
      type: Boolean,
      required: true
    },
    toggleIsOverlayNavActive: {
      type: Function,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const { mdAndDown } = useDisplay();
    const refNav = ref();
    const route = useRoute$1();
    watch(() => route.path, () => {
      props.toggleIsOverlayNavActive(false);
    });
    const isVerticalNavScrolled = ref(false);
    const updateIsVerticalNavScrolled = (val) => isVerticalNavScrolled.value = val;
    const handleNavScroll = (evt) => {
      isVerticalNavScrolled.value = evt.target.scrollTop > 0;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(props.tag), mergeProps({
        ref_key: "refNav",
        ref: refNav,
        "data-allow-mismatch": "",
        class: ["layout-vertical-nav", [
          {
            "visible": __props.isOverlayNavActive,
            "scrolled": unref(isVerticalNavScrolled),
            "overlay-nav": unref(mdAndDown)
          }
        ]]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="nav-header" data-v-9d37bde8${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "nav-header", {}, () => {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/",
                class: "app-logo app-title-wrapper"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a;
                  if (_push3) {
                    _push3(`<div class="d-flex" data-v-9d37bde8${_scopeId2}>${(_a = unref(logo)) != null ? _a : ""}</div><h1 class="leading-normal" data-v-9d37bde8${_scopeId2}> sneat </h1>`);
                  } else {
                    return [
                      createVNode("div", {
                        class: "d-flex",
                        innerHTML: unref(logo)
                      }, null, 8, ["innerHTML"]),
                      createVNode("h1", { class: "leading-normal" }, " sneat ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
            _push2(`</div>`);
            ssrRenderSlot(_ctx.$slots, "before-nav-items", {}, () => {
              _push2(`<div class="vertical-nav-items-shadow" data-v-9d37bde8${_scopeId}></div>`);
            }, _push2, _parent2, _scopeId);
            ssrRenderSlot(_ctx.$slots, "nav-items", { updateIsVerticalNavScrolled }, () => {
              _push2(ssrRenderComponent(unref(PerfectScrollbar), {
                tag: "ul",
                class: "nav-items",
                options: { wheelPropagation: false },
                onPsScrollY: handleNavScroll
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", {}, void 0, true)
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
            ssrRenderSlot(_ctx.$slots, "after-nav-items", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("div", { class: "nav-header" }, [
                renderSlot(_ctx.$slots, "nav-header", {}, () => [
                  createVNode(_component_NuxtLink, {
                    to: "/",
                    class: "app-logo app-title-wrapper"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: "d-flex",
                        innerHTML: unref(logo)
                      }, null, 8, ["innerHTML"]),
                      createVNode("h1", { class: "leading-normal" }, " sneat ")
                    ]),
                    _: 1
                  })
                ], true)
              ]),
              renderSlot(_ctx.$slots, "before-nav-items", {}, () => [
                createVNode("div", { class: "vertical-nav-items-shadow" })
              ], true),
              renderSlot(_ctx.$slots, "nav-items", { updateIsVerticalNavScrolled }, () => [
                createVNode(unref(PerfectScrollbar), {
                  tag: "ul",
                  class: "nav-items",
                  options: { wheelPropagation: false },
                  onPsScrollY: handleNavScroll
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "default", {}, void 0, true)
                  ]),
                  _: 3
                })
              ], true),
              renderSlot(_ctx.$slots, "after-nav-items", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("@layouts/components/VerticalNav.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const VerticalNav = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-9d37bde8"]]);
const _sfc_main$1 = defineComponent({
  setup(props, { slots }) {
    const isOverlayNavActive = ref(false);
    const isLayoutOverlayVisible = ref(false);
    const toggleIsOverlayNavActive = useToggle(isOverlayNavActive);
    const route = useRoute$1();
    const { mdAndDown } = useDisplay();
    syncRef(isOverlayNavActive, isLayoutOverlayVisible);
    return () => {
      var _a, _b, _c;
      const verticalNav = h(VerticalNav, { isOverlayNavActive: isOverlayNavActive.value, toggleIsOverlayNavActive }, {
        "nav-header": () => {
          var _a2;
          return (_a2 = slots["vertical-nav-header"]) == null ? void 0 : _a2.call(slots, { toggleIsOverlayNavActive });
        },
        "before-nav-items": () => {
          var _a2;
          return (_a2 = slots["before-vertical-nav-items"]) == null ? void 0 : _a2.call(slots);
        },
        "default": () => {
          var _a2;
          return (_a2 = slots["vertical-nav-content"]) == null ? void 0 : _a2.call(slots);
        },
        "after-nav-items": () => {
          var _a2;
          return (_a2 = slots["after-vertical-nav-items"]) == null ? void 0 : _a2.call(slots);
        }
      });
      const navbar = h("header", { class: ["layout-navbar navbar-blur"] }, [
        h("div", { class: "navbar-content-container" }, (_a = slots.navbar) == null ? void 0 : _a.call(slots, {
          toggleVerticalOverlayNavActive: toggleIsOverlayNavActive
        }))
      ]);
      const main = h("main", { class: "layout-page-content" }, h("div", { class: "page-content-container" }, (_b = slots.default) == null ? void 0 : _b.call(slots)));
      const footer = h("footer", { class: "layout-footer" }, [
        h("div", { class: "footer-content-container" }, (_c = slots.footer) == null ? void 0 : _c.call(slots))
      ]);
      const layoutOverlay = h("div", {
        class: ["layout-overlay", { visible: isLayoutOverlayVisible.value }],
        onClick: () => {
          isLayoutOverlayVisible.value = !isLayoutOverlayVisible.value;
        }
      });
      return h("div", {
        class: [
          "layout-wrapper layout-nav-type-vertical layout-navbar-static layout-footer-static layout-content-width-fluid",
          mdAndDown.value && "layout-overlay-nav",
          route.meta.layoutWrapperClasses
        ]
      }, [
        verticalNav,
        h("div", { class: "layout-content-wrapper" }, [
          navbar,
          main,
          footer
        ]),
        layoutOverlay
      ]);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("@layouts/components/VerticalNavLayout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "DefaultLayoutWithVerticalNav",
  __ssrInlineRender: true,
  setup(__props) {
    const { companies } = useUserCompanies();
    ref(true);
    const selectedCompany = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_IconBtn = resolveComponent("IconBtn");
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        navbar: withCtx(({ toggleVerticalOverlayNavActive }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="d-flex h-100 align-center" data-v-ae8867e5${_scopeId}>`);
            _push2(ssrRenderComponent(_component_IconBtn, {
              class: "ms-n3 d-lg-none",
              onClick: ($event) => toggleVerticalOverlayNavActive(true)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VIcon, { icon: "bx-menu" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VIcon, { icon: "bx-menu" })
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<div class="d-flex align-center cursor-pointer ms-lg-n3" style="${ssrRenderStyle({ "user-select": "none" })}" data-v-ae8867e5${_scopeId}></div>`);
            _push2(ssrRenderComponent(VSpacer, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(VSelect, {
              modelValue: selectedCompany.value,
              "onUpdate:modelValue": ($event) => selectedCompany.value = $event,
              class: "company-selector me-4",
              label: "Company",
              density: "compact",
              variant: "outlined",
              "hide-details": "",
              items: unref(companies),
              "item-title": "company_name",
              "item-value": "company_id",
              "return-object": "",
              style: { "max-inline-size": "200px" },
              "menu-props": { maxHeight: 200 }
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_IconBtn, null, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VIcon, { icon: "bx-bell" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VIcon, { icon: "bx-bell" })
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$4, { class: "me-1" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "d-flex h-100 align-center" }, [
                createVNode(_component_IconBtn, {
                  class: "ms-n3 d-lg-none",
                  onClick: ($event) => toggleVerticalOverlayNavActive(true)
                }, {
                  default: withCtx(() => [
                    createVNode(VIcon, { icon: "bx-menu" })
                  ]),
                  _: 2
                }, 1032, ["onClick"]),
                createVNode("div", {
                  class: "d-flex align-center cursor-pointer ms-lg-n3",
                  style: { "user-select": "none" }
                }),
                createVNode(VSpacer),
                createVNode(VSelect, {
                  modelValue: selectedCompany.value,
                  "onUpdate:modelValue": ($event) => selectedCompany.value = $event,
                  class: "company-selector me-4",
                  label: "Company",
                  density: "compact",
                  variant: "outlined",
                  "hide-details": "",
                  items: unref(companies),
                  "item-title": "company_name",
                  "item-value": "company_id",
                  "return-object": "",
                  style: { "max-inline-size": "200px" },
                  "menu-props": { maxHeight: 200 }
                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                createVNode(_component_IconBtn, null, {
                  default: withCtx(() => [
                    createVNode(VIcon, { icon: "bx-bell" })
                  ]),
                  _: 1
                }),
                createVNode(_sfc_main$4, { class: "me-1" }),
                createVNode(_sfc_main$5)
              ])
            ];
          }
        }),
        "vertical-nav-header": withCtx(({ toggleIsOverlayNavActive }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              class: "app-logo app-title-wrapper"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                var _a;
                if (_push3) {
                  _push3(`<div class="d-flex" data-v-ae8867e5${_scopeId2}>${(_a = unref(logo)) != null ? _a : ""}</div><h1 class="app-logo-title" data-v-ae8867e5${_scopeId2}> sneat </h1>`);
                } else {
                  return [
                    createVNode("div", {
                      class: "d-flex",
                      innerHTML: unref(logo)
                    }, null, 8, ["innerHTML"]),
                    createVNode("h1", { class: "app-logo-title" }, " sneat ")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_IconBtn, {
              class: "d-block d-lg-none",
              onClick: ($event) => toggleIsOverlayNavActive(false)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VIcon, { icon: "bx-x" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VIcon, { icon: "bx-x" })
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtLink, {
                to: "/",
                class: "app-logo app-title-wrapper"
              }, {
                default: withCtx(() => [
                  createVNode("div", {
                    class: "d-flex",
                    innerHTML: unref(logo)
                  }, null, 8, ["innerHTML"]),
                  createVNode("h1", { class: "app-logo-title" }, " sneat ")
                ]),
                _: 1
              }),
              createVNode(_component_IconBtn, {
                class: "d-block d-lg-none",
                onClick: ($event) => toggleIsOverlayNavActive(false)
              }, {
                default: withCtx(() => [
                  createVNode(VIcon, { icon: "bx-x" })
                ]),
                _: 2
              }, 1032, ["onClick"])
            ];
          }
        }),
        "vertical-nav-content": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$3, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$3)
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Footer, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Footer)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/components/DefaultLayoutWithVerticalNav.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DefaultLayoutWithVerticalNav = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ae8867e5"]]);

export { DefaultLayoutWithVerticalNav as default };

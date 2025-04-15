import { mergeProps, watch, resolveComponent, withCtx, unref, createVNode, toDisplayString, shallowRef, computed, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { t as toRef, a as toValue } from './index-Cv4S-JTd.mjs';
import { $ as useTheme, d as VIcon } from './server.mjs';
import { V as VTooltip } from './VTooltip-Bgj77Y-V.mjs';
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

function useCycleList(list, options) {
  const state = shallowRef(getInitialValue());
  const listRef = toRef(list);
  const index = computed({
    get() {
      var _a;
      const targetList = listRef.value;
      let index2 = (options == null ? void 0 : options.getIndexOf) ? options.getIndexOf(state.value, targetList) : targetList.indexOf(state.value);
      if (index2 < 0)
        index2 = (_a = options == null ? void 0 : options.fallbackIndex) != null ? _a : 0;
      return index2;
    },
    set(v) {
      set2(v);
    }
  });
  function set2(i) {
    const targetList = listRef.value;
    const length = targetList.length;
    const index2 = (i % length + length) % length;
    const value = targetList[index2];
    state.value = value;
    return value;
  }
  function shift(delta = 1) {
    return set2(index.value + delta);
  }
  function next(n = 1) {
    return shift(n);
  }
  function prev(n = 1) {
    return shift(-n);
  }
  function getInitialValue() {
    var _a, _b;
    return (_b = toValue((_a = options == null ? void 0 : options.initialValue) != null ? _a : toValue(list)[0])) != null ? _b : void 0;
  }
  watch(listRef, () => set2(index.value));
  return {
    state,
    index,
    next,
    prev,
    go: set2
  };
}
const _sfc_main$1 = {
  __name: "ThemeSwitcher",
  __ssrInlineRender: true,
  props: {
    themes: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const {
      name: themeName,
      global: globalTheme
    } = useTheme();
    const {
      state: currentThemeName,
      next: getNextThemeName,
      index: currentThemeIndex
    } = useCycleList(props.themes.map((t) => t.name), { initialValue: themeName });
    const changeTheme = () => {
      globalTheme.name.value = getNextThemeName();
    };
    watch(() => globalTheme.name.value, (val) => {
      currentThemeName.value = val;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_IconBtn = resolveComponent("IconBtn");
      _push(ssrRenderComponent(_component_IconBtn, mergeProps({ onClick: changeTheme }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VIcon, {
              icon: props.themes[unref(currentThemeIndex)].icon
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(VTooltip, {
              activator: "parent",
              "open-delay": "1000",
              "scroll-strategy": "close"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-capitalize"${_scopeId2}>${ssrInterpolate(unref(currentThemeName))}</span>`);
                } else {
                  return [
                    createVNode("span", { class: "text-capitalize" }, toDisplayString(unref(currentThemeName)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VIcon, {
                icon: props.themes[unref(currentThemeIndex)].icon
              }, null, 8, ["icon"]),
              createVNode(VTooltip, {
                activator: "parent",
                "open-delay": "1000",
                "scroll-strategy": "close"
              }, {
                default: withCtx(() => [
                  createVNode("span", { class: "text-capitalize" }, toDisplayString(unref(currentThemeName)), 1)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("@core/components/ThemeSwitcher.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "NavbarThemeSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const themes = [
      {
        name: "light",
        icon: "bx-sun"
      },
      {
        name: "dark",
        icon: "bx-moon"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ThemeSwitcher = _sfc_main$1;
      _push(ssrRenderComponent(_component_ThemeSwitcher, mergeProps({ themes }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/components/NavbarThemeSwitcher.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };

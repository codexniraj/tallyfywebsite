import { withCtx, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import DefaultLayoutWithVerticalNav from './DefaultLayoutWithVerticalNav-CUMQDawL.mjs';
import './nuxt-link-7-syJ-Wh.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'pinia';
import 'vue-router';
import './auth-BooGxS71.mjs';
import './Footer-Cjp3StJ2.mjs';
import './NavbarThemeSwitcher-vTz2vddq.mjs';
import './index-Cv4S-JTd.mjs';
import './VTooltip-Bgj77Y-V.mjs';
import './NavItems-BTUPZtlq.mjs';
import './UserProfile-COkgaQxc.mjs';
import './avatar-1-BLwzgS8N.mjs';
import './VList-DvmKJPRW.mjs';
import './index--wlg-iEi.mjs';
import './ssrBoot-BtvJZs44.mjs';
import './VDivider-BRaaa0NB.mjs';
import './VListItemAction-bIOcT3PO.mjs';
import './logo-C2NYPRdy.mjs';
import 'vue3-perfect-scrollbar';
import './VSpacer-CLzFRj-M.mjs';
import './VSelect-yVA5YFWl.mjs';
import './VTextField-BGuE7JWy.mjs';
import './VChip-BZCaV2-K.mjs';
import './VSlideGroup-CfSzG1xQ.mjs';

const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(DefaultLayoutWithVerticalNav, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };

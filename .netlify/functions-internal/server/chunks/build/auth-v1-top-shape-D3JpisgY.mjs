import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { unref, useSSRContext } from 'vue';
import { ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { $ as useTheme, c as VBtn } from './server.mjs';

const _sfc_main = {
  __name: "AuthProvider",
  __ssrInlineRender: true,
  setup(__props) {
    const { global } = useTheme();
    const authProviders = [
      {
        icon: "bxl-facebook",
        color: "#4267b2",
        colorInDark: "#4267b2"
      },
      {
        icon: "bxl-twitter",
        color: "#1da1f2",
        colorInDark: "#1da1f2"
      },
      {
        icon: "bxl-github",
        color: "#272727",
        colorInDark: "#fff"
      },
      {
        icon: "bxl-google",
        color: "#db4437",
        colorInDark: "#db4437"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(authProviders, (link) => {
        _push(ssrRenderComponent(VBtn, {
          key: link.icon,
          icon: link.icon,
          variant: "text",
          color: unref(global).name.value === "dark" ? link.colorInDark : link.color
        }, null, _parent));
      });
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("views/pages/authentication/AuthProvider.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const authV1BottomShape = "" + buildAssetsURL("auth-v1-bottom-shape.crxWNCWd.svg");
const authV1TopShape = "" + buildAssetsURL("auth-v1-top-shape.eAwqa87i.svg");

export { _sfc_main as _, authV1TopShape as a, authV1BottomShape as b };

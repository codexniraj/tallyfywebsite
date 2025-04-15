import { mergeProps, withCtx, createVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { V as VTable } from './VTable-BiWiDHKr.mjs';

const _sfc_main = {
  __name: "DemoSimpleTableFixedHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const desserts = [
      {
        dessert: "Frozen Yogurt",
        calories: 159,
        fat: 6,
        carbs: 24,
        protein: 4
      },
      {
        dessert: "Ice cream sandwich",
        calories: 237,
        fat: 6,
        carbs: 24,
        protein: 4
      },
      {
        dessert: "Eclair",
        calories: 262,
        fat: 6,
        carbs: 24,
        protein: 4
      },
      {
        dessert: "Cupcake",
        calories: 305,
        fat: 6,
        carbs: 24,
        protein: 4
      },
      {
        dessert: "Gingerbread",
        calories: 356,
        fat: 6,
        carbs: 24,
        protein: 4
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VTable, mergeProps({
        height: "250",
        "fixed-header": ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<thead${_scopeId}><tr${_scopeId}><th class="text-uppercase"${_scopeId}> Desserts (100g Servings) </th><th${_scopeId}> calories </th><th${_scopeId}> Fat(g) </th><th${_scopeId}> Carbs(g) </th><th${_scopeId}> protein(g) </th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(desserts, (item) => {
              _push2(`<tr${_scopeId}><td${_scopeId}>${ssrInterpolate(item.dessert)}</td><td${_scopeId}>${ssrInterpolate(item.calories)}</td><td${_scopeId}>${ssrInterpolate(item.fat)}</td><td${_scopeId}>${ssrInterpolate(item.carbs)}</td><td${_scopeId}>${ssrInterpolate(item.protein)}</td></tr>`);
            });
            _push2(`<!--]--></tbody>`);
          } else {
            return [
              createVNode("thead", null, [
                createVNode("tr", null, [
                  createVNode("th", { class: "text-uppercase" }, " Desserts (100g Servings) "),
                  createVNode("th", null, " calories "),
                  createVNode("th", null, " Fat(g) "),
                  createVNode("th", null, " Carbs(g) "),
                  createVNode("th", null, " protein(g) ")
                ])
              ]),
              createVNode("tbody", null, [
                (openBlock(), createBlock(Fragment, null, renderList(desserts, (item) => {
                  return createVNode("tr", {
                    key: item.dessert
                  }, [
                    createVNode("td", null, toDisplayString(item.dessert), 1),
                    createVNode("td", null, toDisplayString(item.calories), 1),
                    createVNode("td", null, toDisplayString(item.fat), 1),
                    createVNode("td", null, toDisplayString(item.carbs), 1),
                    createVNode("td", null, toDisplayString(item.protein), 1)
                  ]);
                }), 64))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("views/pages/tables/DemoSimpleTableFixedHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };

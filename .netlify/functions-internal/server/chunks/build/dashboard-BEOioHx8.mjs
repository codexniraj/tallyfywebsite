import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { defineComponent, createElementBlock, withCtx, createVNode, unref, toDisplayString, createTextVNode, computed, createBlock, openBlock, Fragment, renderList, ref, isRef, mergeProps, resolveComponent, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc, V as VCard, a as VCardText, d as VIcon, $ as useTheme, j as useDisplay, U as VCardItem, W as VCardTitle, c as VBtn, Z as VMenu, b as VAvatar, X as VCardSubtitle, a0 as VProgressCircular } from './server.mjs';
import { V as VList, a as VListItem, b as VListItemTitle, c as VListItemSubtitle } from './VList-DvmKJPRW.mjs';
import { c as computedWithControl } from './index-Cv4S-JTd.mjs';
import { V as VSpacer } from './VSpacer-CLzFRj-M.mjs';
import { V as VRow, a as VCol } from './VRow-DFLR6KLu.mjs';
import { V as VTabs, a as VTab } from './VTabs-DYRxxdEV.mjs';
import { V as VChip } from './VChip-BZCaV2-K.mjs';
import { V as VListItemAction } from './VListItemAction-bIOcT3PO.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'pinia';
import 'vue-router';
import './index--wlg-iEi.mjs';
import './ssrBoot-BtvJZs44.mjs';
import './VDivider-BRaaa0NB.mjs';
import './VSlideGroup-CfSzG1xQ.mjs';

const __nuxt_component_1 = defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});

const _sfc_main$8 = {
  __name: "MoreBtn",
  __ssrInlineRender: true,
  props: {
    menuList: {
      type: Array,
      required: false
    },
    itemProps: {
      type: Boolean,
      required: false
    },
    iconSize: {
      type: String,
      required: false
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_IconBtn = resolveComponent("IconBtn");
      _push(ssrRenderComponent(_component_IconBtn, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VIcon, {
              size: props.iconSize,
              icon: "bx-dots-vertical-rounded"
            }, null, _parent2, _scopeId));
            if (props.menuList) {
              _push2(ssrRenderComponent(VMenu, { activator: "parent" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(VList, {
                      items: props.menuList,
                      "item-props": props.itemProps
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(VList, {
                        items: props.menuList,
                        "item-props": props.itemProps
                      }, null, 8, ["items", "item-props"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(VIcon, {
                size: props.iconSize,
                icon: "bx-dots-vertical-rounded"
              }, null, 8, ["size"]),
              props.menuList ? (openBlock(), createBlock(VMenu, {
                key: 0,
                activator: "parent"
              }, {
                default: withCtx(() => [
                  createVNode(VList, {
                    items: props.menuList,
                    "item-props": props.itemProps
                  }, null, 8, ["items", "item-props"])
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("@core/components/MoreBtn.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = {
  __name: "CardStatisticsVertical",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    stats: {
      type: String,
      required: true
    },
    change: {
      type: Number,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const isPositive = computedWithControl(() => props.change, () => Math.sign(props.change) === 1);
    const moreList = [
      {
        title: "Yesterday",
        value: "Yesterday"
      },
      {
        title: "Last Week",
        value: "Last Week"
      },
      {
        title: "Last Month",
        value: "Last Month"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MoreBtn = _sfc_main$8;
      _push(ssrRenderComponent(VCard, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VCardText, { class: "d-flex align-center pb-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<img width="42"${ssrRenderAttr("src", props.image)} alt="image"${_scopeId2}>`);
                  _push3(ssrRenderComponent(VSpacer, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_MoreBtn, {
                    class: "me-n3 mt-n4",
                    "menu-list": moreList
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("img", {
                      width: "42",
                      src: props.image,
                      alt: "image"
                    }, null, 8, ["src"]),
                    createVNode(VSpacer),
                    createVNode(_component_MoreBtn, {
                      class: "me-n3 mt-n4",
                      "menu-list": moreList
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCardText, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="mb-1"${_scopeId2}>${ssrInterpolate(props.title)}</p><h5 class="text-h5 text-no-wrap mb-3"${_scopeId2}>${ssrInterpolate(props.stats)}</h5><span class="${ssrRenderClass([unref(isPositive) ? "text-success" : "text-error", "d-flex align-center gap-1 text-sm"])}"${_scopeId2}>`);
                  _push3(ssrRenderComponent(VIcon, {
                    size: "18",
                    icon: unref(isPositive) ? "bx-up-arrow-alt" : "bx-down-arrow-alt"
                  }, null, _parent3, _scopeId2));
                  _push3(` ${ssrInterpolate(unref(isPositive) ? Math.abs(props.change) : props.change)}% </span>`);
                } else {
                  return [
                    createVNode("p", { class: "mb-1" }, toDisplayString(props.title), 1),
                    createVNode("h5", { class: "text-h5 text-no-wrap mb-3" }, toDisplayString(props.stats), 1),
                    createVNode("span", {
                      class: [unref(isPositive) ? "text-success" : "text-error", "d-flex align-center gap-1 text-sm"]
                    }, [
                      createVNode(VIcon, {
                        size: "18",
                        icon: unref(isPositive) ? "bx-up-arrow-alt" : "bx-down-arrow-alt"
                      }, null, 8, ["icon"]),
                      createTextVNode(" " + toDisplayString(unref(isPositive) ? Math.abs(props.change) : props.change) + "% ", 1)
                    ], 2)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VCardText, { class: "d-flex align-center pb-4" }, {
                default: withCtx(() => [
                  createVNode("img", {
                    width: "42",
                    src: props.image,
                    alt: "image"
                  }, null, 8, ["src"]),
                  createVNode(VSpacer),
                  createVNode(_component_MoreBtn, {
                    class: "me-n3 mt-n4",
                    "menu-list": moreList
                  })
                ]),
                _: 1
              }),
              createVNode(VCardText, null, {
                default: withCtx(() => [
                  createVNode("p", { class: "mb-1" }, toDisplayString(props.title), 1),
                  createVNode("h5", { class: "text-h5 text-no-wrap mb-3" }, toDisplayString(props.stats), 1),
                  createVNode("span", {
                    class: [unref(isPositive) ? "text-success" : "text-error", "d-flex align-center gap-1 text-sm"]
                  }, [
                    createVNode(VIcon, {
                      size: "18",
                      icon: unref(isPositive) ? "bx-up-arrow-alt" : "bx-down-arrow-alt"
                    }, null, 8, ["icon"]),
                    createTextVNode(" " + toDisplayString(unref(isPositive) ? Math.abs(props.change) : props.change) + "% ", 1)
                  ], 2)
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
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("@core/components/cards/CardStatisticsVertical.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const illustrationJohnDark = "" + buildAssetsURL("illustration-john-dark.CXq7qNOq.png");
const illustrationJohnLight = "" + buildAssetsURL("illustration-john-light.1Av6zeMt.png");
const _sfc_main$6 = {
  __name: "AnalyticsCongratulations",
  __ssrInlineRender: true,
  setup(__props) {
    const { global } = useTheme();
    const illustrationJohn = computed(() => global.name.value === "dark" ? illustrationJohnDark : illustrationJohnLight);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VCard, mergeProps({ class: "text-center text-sm-start" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VRow, { "no-gutters": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    sm: "8",
                    order: "2",
                    "order-sm": "1"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCardItem, { class: "pb-3" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardTitle, { class: "text-primary" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Congratulations John! \u{1F389} `);
                                  } else {
                                    return [
                                      createTextVNode(" Congratulations John! \u{1F389} ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardTitle, { class: "text-primary" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Congratulations John! \u{1F389} ")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` You have done 72% more sales today. <br data-v-96c15101${_scopeId4}> Check your new raising badge in your profile. <br data-v-96c15101${_scopeId4}>`);
                              _push5(ssrRenderComponent(VBtn, {
                                variant: "tonal",
                                class: "mt-6",
                                size: "small"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` View Badges `);
                                  } else {
                                    return [
                                      createTextVNode(" View Badges ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createTextVNode(" You have done 72% more sales today. "),
                                createVNode("br"),
                                createTextVNode(" Check your new raising badge in your profile. "),
                                createVNode("br"),
                                createVNode(VBtn, {
                                  variant: "tonal",
                                  class: "mt-6",
                                  size: "small"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" View Badges ")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCardItem, { class: "pb-3" }, {
                            default: withCtx(() => [
                              createVNode(VCardTitle, { class: "text-primary" }, {
                                default: withCtx(() => [
                                  createTextVNode(" Congratulations John! \u{1F389} ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createTextVNode(" You have done 72% more sales today. "),
                              createVNode("br"),
                              createTextVNode(" Check your new raising badge in your profile. "),
                              createVNode("br"),
                              createVNode(VBtn, {
                                variant: "tonal",
                                class: "mt-6",
                                size: "small"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" View Badges ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    sm: "4",
                    order: "1",
                    "order-sm": "2",
                    class: "text-center"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<img${ssrRenderAttr("src", unref(illustrationJohn))}${ssrRenderAttr("height", _ctx.$vuetify.display.xs ? "150" : "182")} class="${ssrRenderClass([_ctx.$vuetify.display.xs ? "mt-6 mb-n2" : "position-absolute", "john-illustration flip-in-rtl"])}" data-v-96c15101${_scopeId3}>`);
                      } else {
                        return [
                          createVNode("img", {
                            src: unref(illustrationJohn),
                            height: _ctx.$vuetify.display.xs ? "150" : "182",
                            class: [_ctx.$vuetify.display.xs ? "mt-6 mb-n2" : "position-absolute", "john-illustration flip-in-rtl"]
                          }, null, 10, ["src", "height"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCol, {
                      cols: "12",
                      sm: "8",
                      order: "2",
                      "order-sm": "1"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCardItem, { class: "pb-3" }, {
                          default: withCtx(() => [
                            createVNode(VCardTitle, { class: "text-primary" }, {
                              default: withCtx(() => [
                                createTextVNode(" Congratulations John! \u{1F389} ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, null, {
                          default: withCtx(() => [
                            createTextVNode(" You have done 72% more sales today. "),
                            createVNode("br"),
                            createTextVNode(" Check your new raising badge in your profile. "),
                            createVNode("br"),
                            createVNode(VBtn, {
                              variant: "tonal",
                              class: "mt-6",
                              size: "small"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" View Badges ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(VCol, {
                      cols: "12",
                      sm: "4",
                      order: "1",
                      "order-sm": "2",
                      class: "text-center"
                    }, {
                      default: withCtx(() => [
                        createVNode("img", {
                          src: unref(illustrationJohn),
                          height: _ctx.$vuetify.display.xs ? "150" : "182",
                          class: [_ctx.$vuetify.display.xs ? "mt-6 mb-n2" : "position-absolute", "john-illustration flip-in-rtl"]
                        }, null, 10, ["src", "height"])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VRow, { "no-gutters": "" }, {
                default: withCtx(() => [
                  createVNode(VCol, {
                    cols: "12",
                    sm: "8",
                    order: "2",
                    "order-sm": "1"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCardItem, { class: "pb-3" }, {
                        default: withCtx(() => [
                          createVNode(VCardTitle, { class: "text-primary" }, {
                            default: withCtx(() => [
                              createTextVNode(" Congratulations John! \u{1F389} ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => [
                          createTextVNode(" You have done 72% more sales today. "),
                          createVNode("br"),
                          createTextVNode(" Check your new raising badge in your profile. "),
                          createVNode("br"),
                          createVNode(VBtn, {
                            variant: "tonal",
                            class: "mt-6",
                            size: "small"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" View Badges ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VCol, {
                    cols: "12",
                    sm: "4",
                    order: "1",
                    "order-sm": "2",
                    class: "text-center"
                  }, {
                    default: withCtx(() => [
                      createVNode("img", {
                        src: unref(illustrationJohn),
                        height: _ctx.$vuetify.display.xs ? "150" : "182",
                        class: [_ctx.$vuetify.display.xs ? "mt-6 mb-n2" : "position-absolute", "john-illustration flip-in-rtl"]
                      }, null, 10, ["src", "height"])
                    ]),
                    _: 1
                  })
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
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("views/dashboard/AnalyticsCongratulations.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const AnalyticsCongratulations = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-96c15101"]]);
const chart = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAMAAAArteDzAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA/UExURXDaOKfrg6DpeIbkVHfdP3PZOaXqgEdwTHTgO3LbO6nrhoPhT5vocnHeN5jnbqLpe3HeN3HeN3LeN6nqh3HdN5HlihcAAAATdFJOUynwv0IzEOEAVB75c6S8jdD74PTaCzX4AAABo0lEQVRYw+2Z25aCMAxFe6P2ggUJ//+tgzK61AqmbbJmHjgvvu11SNLUJuL0q8570STvuztLrD+NwAf4CdoJMnV3KCFzpQpi5o26QAWxrlBPDfULVJDrJDp6aCc8PdTzQA8d+lu5y3Q5n6OhZJppXnV2hEbnh+iwT9B5jI0w7UwGXcxW82JvJQCEmEHHqY7q1BV4k82djjUR0AqelEMXbHG2+gDfoKVhNQPAd+hcZFVbQEFLrGoJOOiMP7Em87kJxReAAjQU/f0J6KFGFkAv2AKFAuiEzHzYhJqx1ulno7C2l3fqhKx+uwMVxr0KWaYa9qCVShxQxQEdOKAbecplC/q+xEIh4DtUQEPBMTgFTR9TCO3ZzyXb6/RD+ttPVK6+4G5Gpz8K+qBKio7yLlX03wRXqcEJequKoacEXQiNtPW0f/c1fDzmWNmal5TZD6vUVf3f7Hm1uvZa2Y6ranhFxs8hkKntTZbysxX65seuScNLz7K9FhQySQ1WBmkHlWiIhw79h7kk0/yUZXzMMujmGcmzLA941hwsCxme1RHPkot6HfcDFH1zDC6jkicAAAAASUVORK5CYII=";
const paypal = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAMAAAArteDzAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABLUExURf8+H/9WO/9+af9AIP9DI/9jSP9GJkdwTP9IKf9mM/9UN/+Jdv+Gcv9TNf9DI/98Zf91XP9WPP8+Hf8/Hv97Zf8+HP8+HP+Ld/8+HeRD/C8AAAAXdFJOUylaydQg2WgAEgVJ+vDUNOKVffXmuJGzNH5j8AAAAbZJREFUWMPtmddyxCAMRSnuYFhX+P8vjWtc4jIWIjPJ+Dz64Yy8V6A1kHgkTYKAOBEESTrJyKQkKEzaQYqkHLSzFNE5Wgmyc7CSOCXIpJ00wZYmMUEvtCuVJPjShAT40sCP9OXlN8mYNGuElLr+ZG5OYfYMT3ThIGXmDA2vVpxKjaBAJzUXSGCtxZXUMJj0cyk1FDmngRok1ddSiR3+0ACg1jc3QPKP7qQKP3wjOcBa30i1bdE7yuTWPm9VeSPl9nmp6sYpSmtLhbmddIS2I0IOn/fSAjd83Tttgxq+qCykUnnXTz0UczsJR6dViOHPTo43S8T07s9zOu+osJqdj3/S4/CFzhfl47ffzhIZduR5zku7JnKaJaE9onWbJYfSSrnNkvzImTnOEv7TyTPXWVLulWUDGHrbjpL7KgvIIN1tJ3oJvGmKCGbcz5Lv8EunP+b0OHzuJD0Jv0WUVtBd6eL1BXyxn/fpskjdvqC6TbpmjNWs352W1kf65tss0MqHtEWSNusFT5Gkql2cEUEji0aoIi8v/4q/c37q5fjYy0G3lyN5P5cHXq45/FzI+Lk68nPJhX0d9wXmNHzutiJOQQAAAABJRU5ErkJggg==";
const walletPrimary = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAMAAADwSaEZAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA2UExURWpq/7a4/2xt/6eo/2ls/25u/3Nz/0dwTLCy/2ls/5eZ/2ls/4iK/2ps/8PE/2ls/3h7/5OV/7y13W8AAAAOdFJOUyn7QKv4HhAAz+tptduj2oLR/QAAAPVJREFUWMPt2NEKgyAYhuHfTJet1O7/ZldrGzGW5fZCMXxPOnuQoIRPLo+sMfJVxtinIfPjS+gFLjArP2efGGDNmkDWXRsxgZowQ2FmxATrIpbDrBgOMyxWKpXeqnq31rXKtVyow+fq4DK1PqS65mEuiYU8rE5jFXmyPKwjMe9IzHeuXi8X205pEBs5EvOaxBSJ+RNiao7AhpjzxadPFfN+H0ksBg4bAohFEgunxdB3pkhseTTgCxhIzKshzv37L+gwrNlnNbuwdh/W7rvrNHfTTWfTzUa6lVLpqM67a6DzDTossZMXOsaxMyE6YLLTKjv6UnP0DYEtS0ErQtU8AAAAAElFTkSuQmCC";
const hexToRgb$1 = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${Number.parseInt(result[1], 16)},${Number.parseInt(result[2], 16)},${Number.parseInt(result[3], 16)}` : null;
};
const _sfc_main$5 = {
  __name: "AnalyticsFinanceTab",
  __ssrInlineRender: true,
  setup(__props) {
    const vuetifyTheme = useTheme();
    const series = {
      income: [{
        data: [
          24,
          21,
          30,
          22,
          42,
          26,
          35,
          29
        ]
      }],
      expenses: [{
        data: [
          24,
          21,
          30,
          25,
          42,
          26,
          35,
          29
        ]
      }],
      profit: [{
        data: [
          24,
          21,
          30,
          22,
          42,
          26,
          35,
          35
        ]
      }]
    };
    const currentTab = ref("income");
    const tabData = computed(() => {
      const data = {
        income: {
          avatar: walletPrimary,
          title: "Total Income",
          stats: "$459.1k",
          profitLoss: 65,
          profitLossAmount: "6.5",
          compareToLastWeek: "$39k"
        },
        expenses: {
          avatar: paypal,
          title: "Total Expenses",
          stats: "$316.5k",
          profitLoss: 27.8,
          profitLossAmount: "7.2",
          compareToLastWeek: "$16k"
        },
        profit: {
          avatar: chart,
          title: "Total Profit",
          stats: "$147.9k",
          profitLoss: 35.1,
          profitLossAmount: "4.5",
          compareToLastWeek: "$28k"
        }
      };
      return data[currentTab.value];
    });
    const chartConfig = computed(() => {
      const currentTheme = vuetifyTheme.current.value.colors;
      const variableTheme = vuetifyTheme.current.value.variables;
      const disabledTextColor = `rgba(${hexToRgb$1(String(currentTheme["on-surface"]))},${variableTheme["disabled-opacity"]})`;
      const borderColor = `rgba(${hexToRgb$1(String(variableTheme["border-color"]))},${variableTheme["border-opacity"]})`;
      return {
        chart: {
          parentHeightOffset: 0,
          toolbar: { show: false }
        },
        dataLabels: { enabled: false },
        stroke: {
          width: 3,
          curve: "smooth"
        },
        grid: {
          strokeDashArray: 4.5,
          borderColor,
          padding: {
            left: 0,
            top: -20,
            right: 11,
            bottom: 7
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityTo: 0.25,
            opacityFrom: 0.5,
            stops: [
              0,
              95,
              100
            ],
            shadeIntensity: 0.6,
            colorStops: [[
              {
                offset: 0,
                opacity: 0.4,
                color: currentTheme.primary
              },
              {
                offset: 100,
                opacity: 0.2,
                color: currentTheme.surface
              }
            ]]
          }
        },
        theme: {
          monochrome: {
            enabled: true,
            shadeTo: "light",
            shadeIntensity: 1,
            color: currentTheme.primary
          }
        },
        xaxis: {
          axisTicks: { show: false },
          axisBorder: { show: false },
          categories: [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul"
          ],
          offsetY: 20,
          offsetX: -24,
          labels: {
            style: {
              fontSize: "14px",
              colors: disabledTextColor,
              fontFamily: "Public Sans"
            }
          }
        },
        yaxis: {
          min: 10,
          max: 50,
          show: false,
          tickAmount: 4
        },
        markers: {
          size: 8,
          strokeWidth: 6,
          strokeOpacity: 1,
          offsetX: -10,
          hover: { size: 8 },
          colors: ["transparent"],
          strokeColors: "transparent",
          discrete: [{
            size: 8,
            seriesIndex: 0,
            fillColor: "#fff",
            strokeColor: currentTheme.primary,
            dataPointIndex: series[currentTab.value][0].data.length - 1
          }]
        }
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VueApexCharts = __nuxt_component_1;
      _push(ssrRenderComponent(VCard, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VCardText, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VTabs, {
                    modelValue: unref(currentTab),
                    "onUpdate:modelValue": ($event) => isRef(currentTab) ? currentTab.value = $event : null,
                    class: "v-tabs-pill"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VTab, { value: "income" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Income `);
                            } else {
                              return [
                                createTextVNode(" Income ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VTab, { value: "expenses" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Expenses `);
                            } else {
                              return [
                                createTextVNode(" Expenses ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VTab, { value: "profit" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Profit `);
                            } else {
                              return [
                                createTextVNode(" Profit ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VTab, { value: "income" }, {
                            default: withCtx(() => [
                              createTextVNode(" Income ")
                            ]),
                            _: 1
                          }),
                          createVNode(VTab, { value: "expenses" }, {
                            default: withCtx(() => [
                              createTextVNode(" Expenses ")
                            ]),
                            _: 1
                          }),
                          createVNode(VTab, { value: "profit" }, {
                            default: withCtx(() => [
                              createTextVNode(" Profit ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VTabs, {
                      modelValue: unref(currentTab),
                      "onUpdate:modelValue": ($event) => isRef(currentTab) ? currentTab.value = $event : null,
                      class: "v-tabs-pill"
                    }, {
                      default: withCtx(() => [
                        createVNode(VTab, { value: "income" }, {
                          default: withCtx(() => [
                            createTextVNode(" Income ")
                          ]),
                          _: 1
                        }),
                        createVNode(VTab, { value: "expenses" }, {
                          default: withCtx(() => [
                            createTextVNode(" Expenses ")
                          ]),
                          _: 1
                        }),
                        createVNode(VTab, { value: "profit" }, {
                          default: withCtx(() => [
                            createTextVNode(" Profit ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCardText, { class: "d-flex align-center gap-3" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VAvatar, {
                    size: "48",
                    rounded: "",
                    image: unref(tabData).avatar
                  }, null, _parent3, _scopeId2));
                  _push3(`<div${_scopeId2}><p class="mb-0"${_scopeId2}>${ssrInterpolate(unref(tabData).title)}</p><div class="d-flex align-center gap-2"${_scopeId2}><h6 class="text-h6"${_scopeId2}>${ssrInterpolate(unref(tabData).stats)}</h6><span class="${ssrRenderClass([unref(tabData).profitLoss > 0 ? "text-success" : "text-error", "text-sm"])}"${_scopeId2}>`);
                  _push3(ssrRenderComponent(VIcon, {
                    size: "24",
                    icon: "bx-chevron-up"
                  }, null, _parent3, _scopeId2));
                  _push3(` ${ssrInterpolate(unref(tabData).profitLoss)}% </span></div></div>`);
                } else {
                  return [
                    createVNode(VAvatar, {
                      size: "48",
                      rounded: "",
                      image: unref(tabData).avatar
                    }, null, 8, ["image"]),
                    createVNode("div", null, [
                      createVNode("p", { class: "mb-0" }, toDisplayString(unref(tabData).title), 1),
                      createVNode("div", { class: "d-flex align-center gap-2" }, [
                        createVNode("h6", { class: "text-h6" }, toDisplayString(unref(tabData).stats), 1),
                        createVNode("span", {
                          class: ["text-sm", unref(tabData).profitLoss > 0 ? "text-success" : "text-error"]
                        }, [
                          createVNode(VIcon, {
                            size: "24",
                            icon: "bx-chevron-up"
                          }),
                          createTextVNode(" " + toDisplayString(unref(tabData).profitLoss) + "% ", 1)
                        ], 2)
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCardText, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_VueApexCharts, {
                    type: "area",
                    height: 230,
                    options: unref(chartConfig),
                    series: series[unref(currentTab)]
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_VueApexCharts, {
                      type: "area",
                      height: 230,
                      options: unref(chartConfig),
                      series: series[unref(currentTab)]
                    }, null, 8, ["options", "series"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCardText, { class: "d-flex align-center justify-center pt-2 gap-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VProgressCircular, {
                    size: "45",
                    color: "primary",
                    "model-value": unref(tabData).profitLoss
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="text-overline text-medium-emphasis"${_scopeId3}>$${ssrInterpolate(unref(tabData).profitLossAmount)}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "text-overline text-medium-emphasis" }, "$" + toDisplayString(unref(tabData).profitLossAmount), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div${_scopeId2}><h6 class="text-base font-weight-regular"${_scopeId2}><span class="text-capitalize d-inline-block"${_scopeId2}>${ssrInterpolate(unref(currentTab))} this week</span></h6><span class="text-sm d-inline-block"${_scopeId2}>${ssrInterpolate(unref(tabData).compareToLastWeek)} less than last week</span></div>`);
                } else {
                  return [
                    createVNode(VProgressCircular, {
                      size: "45",
                      color: "primary",
                      "model-value": unref(tabData).profitLoss
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "text-overline text-medium-emphasis" }, "$" + toDisplayString(unref(tabData).profitLossAmount), 1)
                      ]),
                      _: 1
                    }, 8, ["model-value"]),
                    createVNode("div", null, [
                      createVNode("h6", { class: "text-base font-weight-regular" }, [
                        createVNode("span", { class: "text-capitalize d-inline-block" }, toDisplayString(unref(currentTab)) + " this week", 1)
                      ]),
                      createVNode("span", { class: "text-sm d-inline-block" }, toDisplayString(unref(tabData).compareToLastWeek) + " less than last week", 1)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VCardText, null, {
                default: withCtx(() => [
                  createVNode(VTabs, {
                    modelValue: unref(currentTab),
                    "onUpdate:modelValue": ($event) => isRef(currentTab) ? currentTab.value = $event : null,
                    class: "v-tabs-pill"
                  }, {
                    default: withCtx(() => [
                      createVNode(VTab, { value: "income" }, {
                        default: withCtx(() => [
                          createTextVNode(" Income ")
                        ]),
                        _: 1
                      }),
                      createVNode(VTab, { value: "expenses" }, {
                        default: withCtx(() => [
                          createTextVNode(" Expenses ")
                        ]),
                        _: 1
                      }),
                      createVNode(VTab, { value: "profit" }, {
                        default: withCtx(() => [
                          createTextVNode(" Profit ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              createVNode(VCardText, { class: "d-flex align-center gap-3" }, {
                default: withCtx(() => [
                  createVNode(VAvatar, {
                    size: "48",
                    rounded: "",
                    image: unref(tabData).avatar
                  }, null, 8, ["image"]),
                  createVNode("div", null, [
                    createVNode("p", { class: "mb-0" }, toDisplayString(unref(tabData).title), 1),
                    createVNode("div", { class: "d-flex align-center gap-2" }, [
                      createVNode("h6", { class: "text-h6" }, toDisplayString(unref(tabData).stats), 1),
                      createVNode("span", {
                        class: ["text-sm", unref(tabData).profitLoss > 0 ? "text-success" : "text-error"]
                      }, [
                        createVNode(VIcon, {
                          size: "24",
                          icon: "bx-chevron-up"
                        }),
                        createTextVNode(" " + toDisplayString(unref(tabData).profitLoss) + "% ", 1)
                      ], 2)
                    ])
                  ])
                ]),
                _: 1
              }),
              createVNode(VCardText, null, {
                default: withCtx(() => [
                  createVNode(_component_VueApexCharts, {
                    type: "area",
                    height: 230,
                    options: unref(chartConfig),
                    series: series[unref(currentTab)]
                  }, null, 8, ["options", "series"])
                ]),
                _: 1
              }),
              createVNode(VCardText, { class: "d-flex align-center justify-center pt-2 gap-4" }, {
                default: withCtx(() => [
                  createVNode(VProgressCircular, {
                    size: "45",
                    color: "primary",
                    "model-value": unref(tabData).profitLoss
                  }, {
                    default: withCtx(() => [
                      createVNode("span", { class: "text-overline text-medium-emphasis" }, "$" + toDisplayString(unref(tabData).profitLossAmount), 1)
                    ]),
                    _: 1
                  }, 8, ["model-value"]),
                  createVNode("div", null, [
                    createVNode("h6", { class: "text-base font-weight-regular" }, [
                      createVNode("span", { class: "text-capitalize d-inline-block" }, toDisplayString(unref(currentTab)) + " this week", 1)
                    ]),
                    createVNode("span", { class: "text-sm d-inline-block" }, toDisplayString(unref(tabData).compareToLastWeek) + " less than last week", 1)
                  ])
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("views/dashboard/AnalyticsFinanceTab.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${Number.parseInt(result[1], 16)},${Number.parseInt(result[2], 16)},${Number.parseInt(result[3], 16)}` : null;
};
const _sfc_main$4 = {
  __name: "AnalyticsOrderStatistics",
  __ssrInlineRender: true,
  setup(__props) {
    const vuetifyTheme = useTheme();
    const series = [
      45,
      80,
      20,
      40
    ];
    const chartOptions = computed(() => {
      const currentTheme = vuetifyTheme.current.value.colors;
      const variableTheme = vuetifyTheme.current.value.variables;
      const secondaryTextColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["medium-emphasis-opacity"]})`;
      const primaryTextColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["high-emphasis-opacity"]})`;
      return {
        chart: {
          sparkline: { enabled: true },
          animations: { enabled: false }
        },
        stroke: {
          width: 6,
          colors: [currentTheme.surface]
        },
        legend: { show: false },
        tooltip: { enabled: false },
        dataLabels: { enabled: false },
        labels: [
          "Fashion",
          "Electronic",
          "Sports",
          "Decor"
        ],
        colors: [
          currentTheme.success,
          currentTheme.primary,
          currentTheme.secondary,
          currentTheme.info
        ],
        grid: {
          padding: {
            top: -7,
            bottom: 5
          }
        },
        states: {
          hover: { filter: { type: "none" } },
          active: { filter: { type: "none" } }
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "75%",
              labels: {
                show: true,
                name: {
                  offsetY: 17,
                  fontSize: "13px",
                  color: secondaryTextColor,
                  fontFamily: "Public Sans"
                },
                value: {
                  offsetY: -17,
                  fontSize: "18px",
                  color: primaryTextColor,
                  fontFamily: "Public Sans",
                  fontWeight: 500
                },
                total: {
                  show: true,
                  label: "Weekly",
                  fontSize: "13px",
                  lineHeight: "18px",
                  formatter: () => "38%",
                  color: secondaryTextColor,
                  fontFamily: "Public Sans"
                }
              }
            }
          }
        }
      };
    });
    const orders = [
      {
        amount: "82.5k",
        title: "Electronic",
        avatarColor: "primary",
        subtitle: "Mobile, Earbuds, TV",
        avatarIcon: "bx-mobile-alt"
      },
      {
        amount: "23.8k",
        title: "Fashion",
        avatarColor: "success",
        subtitle: "Tshirt, Jeans, Shoes",
        avatarIcon: "bx-closet"
      },
      {
        amount: 849,
        title: "Decor",
        avatarColor: "info",
        subtitle: "Fine Art, Dining",
        avatarIcon: "bx-home"
      },
      {
        amount: 99,
        title: "Sports",
        avatarColor: "secondary",
        subtitle: "Football, Cricket Kit",
        avatarIcon: "bx-football"
      }
    ];
    const moreList = [
      {
        title: "Share",
        value: "Share"
      },
      {
        title: "Refresh",
        value: "Refresh"
      },
      {
        title: "Update",
        value: "Update"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MoreBtn = _sfc_main$8;
      const _component_VueApexCharts = __nuxt_component_1;
      _push(ssrRenderComponent(VCard, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VCardItem, null, {
              append: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_MoreBtn, { "menu-list": moreList }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_MoreBtn, { "menu-list": moreList })
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Order Statistics `);
                      } else {
                        return [
                          createTextVNode(" Order Statistics ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCardSubtitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`42.82k Total Sales`);
                      } else {
                        return [
                          createTextVNode("42.82k Total Sales")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode(" Order Statistics ")
                      ]),
                      _: 1
                    }),
                    createVNode(VCardSubtitle, null, {
                      default: withCtx(() => [
                        createTextVNode("42.82k Total Sales")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCardText, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="d-flex align-center justify-space-between mb-6"${_scopeId2}><div class=""${_scopeId2}><h3 class="text-h3 mb-1"${_scopeId2}> 8,258 </h3><div class="text-caption text-medium-emphasis"${_scopeId2}> Total Orders </div></div><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_VueApexCharts, {
                    type: "donut",
                    height: 120,
                    width: "100",
                    options: unref(chartOptions),
                    series
                  }, null, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  _push3(ssrRenderComponent(VList, { class: "card-list" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(orders, (order) => {
                          _push4(ssrRenderComponent(VListItem, {
                            key: order.title
                          }, {
                            prepend: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VAvatar, {
                                  size: "40",
                                  rounded: "",
                                  variant: "tonal",
                                  color: order.avatarColor
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(VIcon, {
                                        icon: order.avatarIcon
                                      }, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(VIcon, {
                                          icon: order.avatarIcon
                                        }, null, 8, ["icon"])
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VAvatar, {
                                    size: "40",
                                    rounded: "",
                                    variant: "tonal",
                                    color: order.avatarColor
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, {
                                        icon: order.avatarIcon
                                      }, null, 8, ["icon"])
                                    ]),
                                    _: 2
                                  }, 1032, ["color"])
                                ];
                              }
                            }),
                            append: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span${_scopeId4}>${ssrInterpolate(order.amount)}</span>`);
                              } else {
                                return [
                                  createVNode("span", null, toDisplayString(order.amount), 1)
                                ];
                              }
                            }),
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VListItemTitle, { class: "font-weight-medium" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(order.title)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(order.title), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VListItemSubtitle, { class: "text-body-2" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(order.subtitle)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(order.subtitle), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VListItemTitle, { class: "font-weight-medium" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(order.title), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(VListItemSubtitle, { class: "text-body-2" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(order.subtitle), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(), createBlock(Fragment, null, renderList(orders, (order) => {
                            return createVNode(VListItem, {
                              key: order.title
                            }, {
                              prepend: withCtx(() => [
                                createVNode(VAvatar, {
                                  size: "40",
                                  rounded: "",
                                  variant: "tonal",
                                  color: order.avatarColor
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, {
                                      icon: order.avatarIcon
                                    }, null, 8, ["icon"])
                                  ]),
                                  _: 2
                                }, 1032, ["color"])
                              ]),
                              append: withCtx(() => [
                                createVNode("span", null, toDisplayString(order.amount), 1)
                              ]),
                              default: withCtx(() => [
                                createVNode(VListItemTitle, { class: "font-weight-medium" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(order.title), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(VListItemSubtitle, { class: "text-body-2" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(order.subtitle), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "d-flex align-center justify-space-between mb-6" }, [
                      createVNode("div", { class: "" }, [
                        createVNode("h3", { class: "text-h3 mb-1" }, " 8,258 "),
                        createVNode("div", { class: "text-caption text-medium-emphasis" }, " Total Orders ")
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_VueApexCharts, {
                          type: "donut",
                          height: 120,
                          width: "100",
                          options: unref(chartOptions),
                          series
                        }, null, 8, ["options"])
                      ])
                    ]),
                    createVNode(VList, { class: "card-list" }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(Fragment, null, renderList(orders, (order) => {
                          return createVNode(VListItem, {
                            key: order.title
                          }, {
                            prepend: withCtx(() => [
                              createVNode(VAvatar, {
                                size: "40",
                                rounded: "",
                                variant: "tonal",
                                color: order.avatarColor
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, {
                                    icon: order.avatarIcon
                                  }, null, 8, ["icon"])
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            append: withCtx(() => [
                              createVNode("span", null, toDisplayString(order.amount), 1)
                            ]),
                            default: withCtx(() => [
                              createVNode(VListItemTitle, { class: "font-weight-medium" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(order.title), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(VListItemSubtitle, { class: "text-body-2" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(order.subtitle), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024);
                        }), 64))
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VCardItem, null, {
                append: withCtx(() => [
                  createVNode(_component_MoreBtn, { "menu-list": moreList })
                ]),
                default: withCtx(() => [
                  createVNode(VCardTitle, null, {
                    default: withCtx(() => [
                      createTextVNode(" Order Statistics ")
                    ]),
                    _: 1
                  }),
                  createVNode(VCardSubtitle, null, {
                    default: withCtx(() => [
                      createTextVNode("42.82k Total Sales")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(VCardText, null, {
                default: withCtx(() => [
                  createVNode("div", { class: "d-flex align-center justify-space-between mb-6" }, [
                    createVNode("div", { class: "" }, [
                      createVNode("h3", { class: "text-h3 mb-1" }, " 8,258 "),
                      createVNode("div", { class: "text-caption text-medium-emphasis" }, " Total Orders ")
                    ]),
                    createVNode("div", null, [
                      createVNode(_component_VueApexCharts, {
                        type: "donut",
                        height: 120,
                        width: "100",
                        options: unref(chartOptions),
                        series
                      }, null, 8, ["options"])
                    ])
                  ]),
                  createVNode(VList, { class: "card-list" }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock(Fragment, null, renderList(orders, (order) => {
                        return createVNode(VListItem, {
                          key: order.title
                        }, {
                          prepend: withCtx(() => [
                            createVNode(VAvatar, {
                              size: "40",
                              rounded: "",
                              variant: "tonal",
                              color: order.avatarColor
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  icon: order.avatarIcon
                                }, null, 8, ["icon"])
                              ]),
                              _: 2
                            }, 1032, ["color"])
                          ]),
                          append: withCtx(() => [
                            createVNode("span", null, toDisplayString(order.amount), 1)
                          ]),
                          default: withCtx(() => [
                            createVNode(VListItemTitle, { class: "font-weight-medium" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(order.title), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(VListItemSubtitle, { class: "text-body-2" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(order.subtitle), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024);
                      }), 64))
                    ]),
                    _: 1
                  })
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("views/dashboard/AnalyticsOrderStatistics.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "AnalyticsProfitReport",
  __ssrInlineRender: true,
  setup(__props) {
    const vuetifyTheme = useTheme();
    const display = useDisplay();
    const series = [{
      data: [
        30,
        58,
        35,
        53,
        50,
        68
      ]
    }];
    const chartOptions = computed(() => {
      const currentTheme = vuetifyTheme.current.value.colors;
      return {
        chart: {
          parentHeightOffset: 0,
          toolbar: { show: false },
          dropShadow: {
            top: 12,
            blur: 4,
            left: 0,
            enabled: true,
            opacity: 0.12,
            color: currentTheme.warning
          }
        },
        tooltip: { enabled: false },
        colors: [`rgba(${hexToRgb(String(currentTheme.warning))}, 1)`],
        stroke: {
          width: 4,
          curve: "smooth",
          lineCap: "round"
        },
        grid: {
          show: false,
          padding: {
            top: -21,
            left: -5,
            bottom: -8
          }
        },
        xaxis: {
          labels: { show: false },
          axisTicks: { show: false },
          axisBorder: { show: false }
        },
        yaxis: { labels: { show: false } },
        responsive: [
          {
            breakpoint: display.thresholds.value.lg,
            options: {
              chart: {
                height: 151,
                width: "100%"
              }
            }
          },
          {
            breakpoint: display.thresholds.value.md,
            options: {
              chart: {
                height: 131,
                width: "100%"
              }
            }
          }
        ]
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VueApexCharts = __nuxt_component_1;
      _push(ssrRenderComponent(VCard, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VCardText, { class: "d-flex justify-space-between h-100" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="d-flex flex-column justify-space-between gap-y-4"${_scopeId2}><div${_scopeId2}><h5 class="text-h5 mb-1"${_scopeId2}> Profile Report </h5>`);
                  _push3(ssrRenderComponent(VChip, {
                    color: "warning",
                    size: "small"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Year 2022 `);
                      } else {
                        return [
                          createTextVNode(" Year 2022 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div${_scopeId2}><div class="d-flex gap-1 align-center text-success"${_scopeId2}>`);
                  _push3(ssrRenderComponent(VIcon, {
                    icon: "bx-up-arrow-alt",
                    size: "20"
                  }, null, _parent3, _scopeId2));
                  _push3(`<span class="text-base d-inline-block"${_scopeId2}>68.2%</span></div><h4 class="text-h4"${_scopeId2}> $84,686k </h4></div></div><div class="h-100 d-flex align-center"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_VueApexCharts, {
                    type: "line",
                    height: 131,
                    width: "80%",
                    options: unref(chartOptions),
                    series
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "d-flex flex-column justify-space-between gap-y-4" }, [
                      createVNode("div", null, [
                        createVNode("h5", { class: "text-h5 mb-1" }, " Profile Report "),
                        createVNode(VChip, {
                          color: "warning",
                          size: "small"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Year 2022 ")
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", null, [
                        createVNode("div", { class: "d-flex gap-1 align-center text-success" }, [
                          createVNode(VIcon, {
                            icon: "bx-up-arrow-alt",
                            size: "20"
                          }),
                          createVNode("span", { class: "text-base d-inline-block" }, "68.2%")
                        ]),
                        createVNode("h4", { class: "text-h4" }, " $84,686k ")
                      ])
                    ]),
                    createVNode("div", { class: "h-100 d-flex align-center" }, [
                      createVNode(_component_VueApexCharts, {
                        type: "line",
                        height: 131,
                        width: "80%",
                        options: unref(chartOptions),
                        series
                      }, null, 8, ["options"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VCardText, { class: "d-flex justify-space-between h-100" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "d-flex flex-column justify-space-between gap-y-4" }, [
                    createVNode("div", null, [
                      createVNode("h5", { class: "text-h5 mb-1" }, " Profile Report "),
                      createVNode(VChip, {
                        color: "warning",
                        size: "small"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Year 2022 ")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", null, [
                      createVNode("div", { class: "d-flex gap-1 align-center text-success" }, [
                        createVNode(VIcon, {
                          icon: "bx-up-arrow-alt",
                          size: "20"
                        }),
                        createVNode("span", { class: "text-base d-inline-block" }, "68.2%")
                      ]),
                      createVNode("h4", { class: "text-h4" }, " $84,686k ")
                    ])
                  ]),
                  createVNode("div", { class: "h-100 d-flex align-center" }, [
                    createVNode(_component_VueApexCharts, {
                      type: "line",
                      height: 131,
                      width: "80%",
                      options: unref(chartOptions),
                      series
                    }, null, 8, ["options"])
                  ])
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("views/dashboard/AnalyticsProfitReport.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "AnalyticsTotalRevenue",
  __ssrInlineRender: true,
  setup(__props) {
    const vuetifyTheme = useTheme();
    const display = useDisplay();
    const series = [
      {
        name: `${(/* @__PURE__ */ new Date()).getFullYear() - 1}`,
        data: [
          18,
          10,
          15,
          29,
          18,
          12,
          9
        ]
      },
      {
        name: `${(/* @__PURE__ */ new Date()).getFullYear() - 2}`,
        data: [
          -13,
          -18,
          -9,
          -14,
          -8,
          -17,
          -15
        ]
      }
    ];
    const chartOptions = computed(() => {
      const currentTheme = vuetifyTheme.current.value.colors;
      const variableTheme = vuetifyTheme.current.value.variables;
      const disabledTextColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["disabled-opacity"]})`;
      const primaryTextColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["high-emphasis-opacity"]})`;
      const secondaryTextColor = `rgba(${hexToRgb(String(currentTheme["on-surface"]))},${variableTheme["medium-emphasis-opacity"]})`;
      const borderColor = `rgba(${hexToRgb(String(variableTheme["border-color"]))},${variableTheme["border-opacity"]})`;
      return {
        bar: {
          chart: {
            stacked: true,
            parentHeightOffset: 6,
            offsetX: -12,
            toolbar: { show: false }
          },
          dataLabels: { enabled: false },
          stroke: {
            width: 6,
            lineCap: "round",
            colors: [currentTheme.surface]
          },
          colors: [
            `rgba(${hexToRgb(String(currentTheme.primary))}, 1)`,
            `rgba(${hexToRgb(String(currentTheme.info))}, 1)`
          ],
          legend: {
            offsetX: -22,
            offsetY: -1,
            position: "top",
            fontSize: "13px",
            horizontalAlign: "left",
            fontFamily: "Public Sans",
            labels: { colors: currentTheme.secondary },
            itemMargin: {
              vertical: 4,
              horizontal: 10
            },
            markers: {
              width: 11,
              height: 11,
              radius: 10,
              offsetX: -2
            }
          },
          states: {
            hover: { filter: { type: "none" } },
            active: { filter: { type: "none" } }
          },
          grid: {
            strokeDashArray: 6,
            borderColor,
            padding: { bottom: 5 }
          },
          plotOptions: {
            bar: {
              borderRadius: 9,
              columnWidth: "30%",
              borderRadiusApplication: "around",
              borderRadiusWhenStacked: "all"
            }
          },
          xaxis: {
            axisTicks: { show: false },
            crosshairs: { opacity: 0 },
            axisBorder: { show: false },
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul"
            ],
            labels: {
              style: {
                fontSize: "13px",
                colors: disabledTextColor,
                fontFamily: "Public Sans"
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "13px",
                colors: disabledTextColor,
                fontFamily: "Public Sans"
              }
            }
          },
          responsive: [
            {
              breakpoint: 1980,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: "32%",
                    borderRadius: 8
                  }
                }
              }
            },
            {
              breakpoint: display.thresholds.value.xl,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: "43%",
                    borderRadius: 8
                  }
                }
              }
            },
            {
              breakpoint: display.thresholds.value.lg,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: "50%",
                    borderRadius: 7
                  }
                }
              }
            },
            {
              breakpoint: display.thresholds.value.md,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: "48%",
                    borderRadius: 8
                  }
                }
              }
            },
            {
              breakpoint: display.thresholds.value.sm,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: "44%",
                    borderRadius: 6
                  }
                }
              }
            },
            {
              breakpoint: 599,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: "44%",
                    borderRadius: 8
                  }
                }
              }
            },
            {
              breakpoint: 420,
              options: {
                plotOptions: {
                  bar: {
                    columnWidth: "55%",
                    borderRadius: 6
                  }
                }
              }
            }
          ]
        },
        radial: {
          chart: { sparkline: { enabled: true } },
          labels: ["Growth"],
          stroke: { dashArray: 5 },
          colors: [`rgba(${hexToRgb(String(currentTheme.primary))}, 1)`],
          states: {
            hover: { filter: { type: "none" } },
            active: { filter: { type: "none" } }
          },
          fill: {
            type: "gradient",
            gradient: {
              shade: "dark",
              opacityTo: 0.6,
              opacityFrom: 1,
              shadeIntensity: 0.5,
              stops: [
                30,
                70,
                100
              ],
              inverseColors: false,
              gradientToColors: [currentTheme.primary]
            }
          },
          plotOptions: {
            radialBar: {
              endAngle: 150,
              startAngle: -140,
              hollow: { size: "55%" },
              track: { background: "transparent" },
              dataLabels: {
                name: {
                  offsetY: 25,
                  fontWeight: 500,
                  fontSize: "15px",
                  color: secondaryTextColor,
                  fontFamily: "Public Sans"
                },
                value: {
                  offsetY: -15,
                  fontWeight: 500,
                  fontSize: "24px",
                  color: primaryTextColor,
                  fontFamily: "Public Sans"
                }
              }
            }
          },
          responsive: [
            {
              breakpoint: 900,
              options: { chart: { height: 200 } }
            },
            {
              breakpoint: 735,
              options: { chart: { height: 200 } }
            },
            {
              breakpoint: 660,
              options: { chart: { height: 200 } }
            },
            {
              breakpoint: 600,
              options: { chart: { height: 200 } }
            }
          ]
        }
      };
    });
    const balanceData = [
      {
        icon: "bx-dollar",
        amount: "$2.54k",
        year: "2023",
        color: "primary"
      },
      {
        icon: "bx-wallet",
        amount: "$4.21k",
        year: "2022",
        color: "info"
      }
    ];
    const moreList = [
      {
        title: "Share",
        value: "Share"
      },
      {
        title: "Refresh",
        value: "Refresh"
      },
      {
        title: "Update",
        value: "Update"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MoreBtn = _sfc_main$8;
      const _component_VueApexCharts = __nuxt_component_1;
      _push(ssrRenderComponent(VCard, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VRow, { "no-gutters": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    sm: "7",
                    xl: "8",
                    class: _ctx.$vuetify.display.smAndUp ? "border-e" : "border-b"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCardItem, { class: "pb-0" }, {
                          append: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_MoreBtn, { "menu-list": moreList }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_MoreBtn, { "menu-list": moreList })
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Total Revenue`);
                                  } else {
                                    return [
                                      createTextVNode("Total Revenue")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("Total Revenue")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, { class: "pb-0" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_VueApexCharts, {
                                type: "bar",
                                height: 335,
                                options: unref(chartOptions).bar,
                                series
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_VueApexCharts, {
                                  type: "bar",
                                  height: 335,
                                  options: unref(chartOptions).bar,
                                  series
                                }, null, 8, ["options"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCardItem, { class: "pb-0" }, {
                            append: withCtx(() => [
                              createVNode(_component_MoreBtn, { "menu-list": moreList })
                            ]),
                            default: withCtx(() => [
                              createVNode(VCardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("Total Revenue")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, { class: "pb-0" }, {
                            default: withCtx(() => [
                              createVNode(_component_VueApexCharts, {
                                type: "bar",
                                height: 335,
                                options: unref(chartOptions).bar,
                                series
                              }, null, 8, ["options"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    sm: "5",
                    xl: "4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCardText, { class: "text-center pt-10" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VBtn, {
                                variant: "tonal",
                                class: "mb-2",
                                "append-icon": "bx-chevron-down"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` 2023 `);
                                    _push6(ssrRenderComponent(VMenu, { activator: "parent" }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VList, null, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`<!--[-->`);
                                                ssrRenderList(["2023", "2022", "2021"], (item, index) => {
                                                  _push8(ssrRenderComponent(VListItem, {
                                                    key: index,
                                                    value: item
                                                  }, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(ssrRenderComponent(VListItemTitle, null, {
                                                          default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                            if (_push10) {
                                                              _push10(`${ssrInterpolate(item)}`);
                                                            } else {
                                                              return [
                                                                createTextVNode(toDisplayString(item), 1)
                                                              ];
                                                            }
                                                          }),
                                                          _: 2
                                                        }, _parent9, _scopeId8));
                                                      } else {
                                                        return [
                                                          createVNode(VListItemTitle, null, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(item), 1)
                                                            ]),
                                                            _: 2
                                                          }, 1024)
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                });
                                                _push8(`<!--]-->`);
                                              } else {
                                                return [
                                                  (openBlock(), createBlock(Fragment, null, renderList(["2023", "2022", "2021"], (item, index) => {
                                                    return createVNode(VListItem, {
                                                      key: index,
                                                      value: item
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode(VListItemTitle, null, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(item), 1)
                                                          ]),
                                                          _: 2
                                                        }, 1024)
                                                      ]),
                                                      _: 2
                                                    }, 1032, ["value"]);
                                                  }), 64))
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VList, null, {
                                              default: withCtx(() => [
                                                (openBlock(), createBlock(Fragment, null, renderList(["2023", "2022", "2021"], (item, index) => {
                                                  return createVNode(VListItem, {
                                                    key: index,
                                                    value: item
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode(VListItemTitle, null, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(item), 1)
                                                        ]),
                                                        _: 2
                                                      }, 1024)
                                                    ]),
                                                    _: 2
                                                  }, 1032, ["value"]);
                                                }), 64))
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createTextVNode(" 2023 "),
                                      createVNode(VMenu, { activator: "parent" }, {
                                        default: withCtx(() => [
                                          createVNode(VList, null, {
                                            default: withCtx(() => [
                                              (openBlock(), createBlock(Fragment, null, renderList(["2023", "2022", "2021"], (item, index) => {
                                                return createVNode(VListItem, {
                                                  key: index,
                                                  value: item
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(VListItemTitle, null, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(item), 1)
                                                      ]),
                                                      _: 2
                                                    }, 1024)
                                                  ]),
                                                  _: 2
                                                }, 1032, ["value"]);
                                              }), 64))
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_VueApexCharts, {
                                type: "radialBar",
                                height: 200,
                                options: unref(chartOptions).radial,
                                series: [78]
                              }, null, _parent5, _scopeId4));
                              _push5(`<h6 class="text-h6 text-medium-emphasis mb-8 mt-1"${_scopeId4}> 62% Company Growth </h6><div class="d-flex align-center justify-center flex-wrap gap-x-6 gap-y-3"${_scopeId4}><!--[-->`);
                              ssrRenderList(balanceData, (data) => {
                                _push5(`<div class="d-flex align-center gap-2"${_scopeId4}>`);
                                _push5(ssrRenderComponent(VAvatar, {
                                  icon: data.icon,
                                  color: data.color,
                                  size: "38",
                                  rounded: "",
                                  variant: "tonal"
                                }, null, _parent5, _scopeId4));
                                _push5(`<div class="text-start"${_scopeId4}><span class="text-sm"${_scopeId4}>${ssrInterpolate(data.year)}</span><h6 class="text-h6"${_scopeId4}>${ssrInterpolate(data.amount)}</h6></div></div>`);
                              });
                              _push5(`<!--]--></div>`);
                            } else {
                              return [
                                createVNode(VBtn, {
                                  variant: "tonal",
                                  class: "mb-2",
                                  "append-icon": "bx-chevron-down"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" 2023 "),
                                    createVNode(VMenu, { activator: "parent" }, {
                                      default: withCtx(() => [
                                        createVNode(VList, null, {
                                          default: withCtx(() => [
                                            (openBlock(), createBlock(Fragment, null, renderList(["2023", "2022", "2021"], (item, index) => {
                                              return createVNode(VListItem, {
                                                key: index,
                                                value: item
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(VListItemTitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(item), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1032, ["value"]);
                                            }), 64))
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_VueApexCharts, {
                                  type: "radialBar",
                                  height: 200,
                                  options: unref(chartOptions).radial,
                                  series: [78]
                                }, null, 8, ["options"]),
                                createVNode("h6", { class: "text-h6 text-medium-emphasis mb-8 mt-1" }, " 62% Company Growth "),
                                createVNode("div", { class: "d-flex align-center justify-center flex-wrap gap-x-6 gap-y-3" }, [
                                  (openBlock(), createBlock(Fragment, null, renderList(balanceData, (data) => {
                                    return createVNode("div", {
                                      key: data.year,
                                      class: "d-flex align-center gap-2"
                                    }, [
                                      createVNode(VAvatar, {
                                        icon: data.icon,
                                        color: data.color,
                                        size: "38",
                                        rounded: "",
                                        variant: "tonal"
                                      }, null, 8, ["icon", "color"]),
                                      createVNode("div", { class: "text-start" }, [
                                        createVNode("span", { class: "text-sm" }, toDisplayString(data.year), 1),
                                        createVNode("h6", { class: "text-h6" }, toDisplayString(data.amount), 1)
                                      ])
                                    ]);
                                  }), 64))
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCardText, { class: "text-center pt-10" }, {
                            default: withCtx(() => [
                              createVNode(VBtn, {
                                variant: "tonal",
                                class: "mb-2",
                                "append-icon": "bx-chevron-down"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" 2023 "),
                                  createVNode(VMenu, { activator: "parent" }, {
                                    default: withCtx(() => [
                                      createVNode(VList, null, {
                                        default: withCtx(() => [
                                          (openBlock(), createBlock(Fragment, null, renderList(["2023", "2022", "2021"], (item, index) => {
                                            return createVNode(VListItem, {
                                              key: index,
                                              value: item
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(item), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ]),
                                              _: 2
                                            }, 1032, ["value"]);
                                          }), 64))
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(_component_VueApexCharts, {
                                type: "radialBar",
                                height: 200,
                                options: unref(chartOptions).radial,
                                series: [78]
                              }, null, 8, ["options"]),
                              createVNode("h6", { class: "text-h6 text-medium-emphasis mb-8 mt-1" }, " 62% Company Growth "),
                              createVNode("div", { class: "d-flex align-center justify-center flex-wrap gap-x-6 gap-y-3" }, [
                                (openBlock(), createBlock(Fragment, null, renderList(balanceData, (data) => {
                                  return createVNode("div", {
                                    key: data.year,
                                    class: "d-flex align-center gap-2"
                                  }, [
                                    createVNode(VAvatar, {
                                      icon: data.icon,
                                      color: data.color,
                                      size: "38",
                                      rounded: "",
                                      variant: "tonal"
                                    }, null, 8, ["icon", "color"]),
                                    createVNode("div", { class: "text-start" }, [
                                      createVNode("span", { class: "text-sm" }, toDisplayString(data.year), 1),
                                      createVNode("h6", { class: "text-h6" }, toDisplayString(data.amount), 1)
                                    ])
                                  ]);
                                }), 64))
                              ])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCol, {
                      cols: "12",
                      sm: "7",
                      xl: "8",
                      class: _ctx.$vuetify.display.smAndUp ? "border-e" : "border-b"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCardItem, { class: "pb-0" }, {
                          append: withCtx(() => [
                            createVNode(_component_MoreBtn, { "menu-list": moreList })
                          ]),
                          default: withCtx(() => [
                            createVNode(VCardTitle, null, {
                              default: withCtx(() => [
                                createTextVNode("Total Revenue")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, { class: "pb-0" }, {
                          default: withCtx(() => [
                            createVNode(_component_VueApexCharts, {
                              type: "bar",
                              height: 335,
                              options: unref(chartOptions).bar,
                              series
                            }, null, 8, ["options"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["class"]),
                    createVNode(VCol, {
                      cols: "12",
                      sm: "5",
                      xl: "4"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCardText, { class: "text-center pt-10" }, {
                          default: withCtx(() => [
                            createVNode(VBtn, {
                              variant: "tonal",
                              class: "mb-2",
                              "append-icon": "bx-chevron-down"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" 2023 "),
                                createVNode(VMenu, { activator: "parent" }, {
                                  default: withCtx(() => [
                                    createVNode(VList, null, {
                                      default: withCtx(() => [
                                        (openBlock(), createBlock(Fragment, null, renderList(["2023", "2022", "2021"], (item, index) => {
                                          return createVNode(VListItem, {
                                            key: index,
                                            value: item
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1032, ["value"]);
                                        }), 64))
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_VueApexCharts, {
                              type: "radialBar",
                              height: 200,
                              options: unref(chartOptions).radial,
                              series: [78]
                            }, null, 8, ["options"]),
                            createVNode("h6", { class: "text-h6 text-medium-emphasis mb-8 mt-1" }, " 62% Company Growth "),
                            createVNode("div", { class: "d-flex align-center justify-center flex-wrap gap-x-6 gap-y-3" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(balanceData, (data) => {
                                return createVNode("div", {
                                  key: data.year,
                                  class: "d-flex align-center gap-2"
                                }, [
                                  createVNode(VAvatar, {
                                    icon: data.icon,
                                    color: data.color,
                                    size: "38",
                                    rounded: "",
                                    variant: "tonal"
                                  }, null, 8, ["icon", "color"]),
                                  createVNode("div", { class: "text-start" }, [
                                    createVNode("span", { class: "text-sm" }, toDisplayString(data.year), 1),
                                    createVNode("h6", { class: "text-h6" }, toDisplayString(data.amount), 1)
                                  ])
                                ]);
                              }), 64))
                            ])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VRow, { "no-gutters": "" }, {
                default: withCtx(() => [
                  createVNode(VCol, {
                    cols: "12",
                    sm: "7",
                    xl: "8",
                    class: _ctx.$vuetify.display.smAndUp ? "border-e" : "border-b"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCardItem, { class: "pb-0" }, {
                        append: withCtx(() => [
                          createVNode(_component_MoreBtn, { "menu-list": moreList })
                        ]),
                        default: withCtx(() => [
                          createVNode(VCardTitle, null, {
                            default: withCtx(() => [
                              createTextVNode("Total Revenue")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, { class: "pb-0" }, {
                        default: withCtx(() => [
                          createVNode(_component_VueApexCharts, {
                            type: "bar",
                            height: 335,
                            options: unref(chartOptions).bar,
                            series
                          }, null, 8, ["options"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["class"]),
                  createVNode(VCol, {
                    cols: "12",
                    sm: "5",
                    xl: "4"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCardText, { class: "text-center pt-10" }, {
                        default: withCtx(() => [
                          createVNode(VBtn, {
                            variant: "tonal",
                            class: "mb-2",
                            "append-icon": "bx-chevron-down"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" 2023 "),
                              createVNode(VMenu, { activator: "parent" }, {
                                default: withCtx(() => [
                                  createVNode(VList, null, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock(Fragment, null, renderList(["2023", "2022", "2021"], (item, index) => {
                                        return createVNode(VListItem, {
                                          key: index,
                                          value: item
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(item), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 64))
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_VueApexCharts, {
                            type: "radialBar",
                            height: 200,
                            options: unref(chartOptions).radial,
                            series: [78]
                          }, null, 8, ["options"]),
                          createVNode("h6", { class: "text-h6 text-medium-emphasis mb-8 mt-1" }, " 62% Company Growth "),
                          createVNode("div", { class: "d-flex align-center justify-center flex-wrap gap-x-6 gap-y-3" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(balanceData, (data) => {
                              return createVNode("div", {
                                key: data.year,
                                class: "d-flex align-center gap-2"
                              }, [
                                createVNode(VAvatar, {
                                  icon: data.icon,
                                  color: data.color,
                                  size: "38",
                                  rounded: "",
                                  variant: "tonal"
                                }, null, 8, ["icon", "color"]),
                                createVNode("div", { class: "text-start" }, [
                                  createVNode("span", { class: "text-sm" }, toDisplayString(data.year), 1),
                                  createVNode("h6", { class: "text-h6" }, toDisplayString(data.amount), 1)
                                ])
                              ]);
                            }), 64))
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("views/dashboard/AnalyticsTotalRevenue.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const chartInfo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAMAAADwSaEZAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA5UExURQDB7CvN8APD7ZTm+ADG6V7a9C3N8UdwTADE8YPi9ozk93Te9Hrg9QPE7gPD7ATD7QPD7Jrn9wPD7O0XrE8AAAARdFJOUyk+5PgQjGoAHuHvwc5L8cyVr5vYNwAAAVJJREFUWMPt2MGSgyAMBuCAQIlaLbz/w65bdac6VCD8hz34X3r7JkGgTOixxXhPonhvdoPWHyH0B35ghppjdgxgrRqBrLe2YATKL+ZRmF8wguVBBocZ8jjMY7E7d5rj9KTn1xOD6fiOdggs7pmfQCxOsuKUHbnvOnvERJrlsKY/YXGq7dTt1JIzFuc6awjhAos1jSoO15iusPqQwWL5qh3rSmIv0Xp9wUo/gQsFmBY2mcSmwr0akpgWVcZpzB20wstDhTQmikViIxJjJNaHXNb7rShdFlvvNxTWAdusqIzzGDdtjVPGpk17SvnXVHlMEW7RuPFwCrvMl8ZVB8pdY5Vvg+HKGhA3h6jJ1J/wx0lS9feQ+lIbK9G1NkDWK/Wk2spqec7aA8eW2rI9Q3seraI7d/7D/AA814COb6CDJezICzqMw44JoQNM7GgVO/RFjaN/ANIfSFvn07AoAAAAAElFTkSuQmCC";
const creditCardSuccess = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMBAMAAAA1uUwYAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAqUExURXDaOEdwTL/wpH/hS5TnaHLbO3PZObTulqLqeq7sjcbxr3HdN3/hS7Xtl34OCWwAAAAKdFJOUykA8eVVHhDMfbS/E1UkAAAA80lEQVRIx+3WoQ6CUBiG4V8HqE2CZkdxs3oDBC8AixmD3RlNZpPZSFHPLahXIF6Bci8eMMH59XwycNPxbrRnY5yNs49s2cyjl5mTWJB83qAEPplPmqyYdUnbVDJfzyzJCMimDsLG1EZYjXyEWeQhzERZ1T/XXDip+iuWLUWmHacaQmnOsLXK9gwbqCzIzwRTfjZkYtiRqXTmMJV+IB+wexiGVz27yK876VlyCnp2k+oMfEIURV8/kOIY+C9sVXZgWF1lPYYZylsDl7sdWhkXbPgryRilcqtL+kcrdoeA4wecUuAwA2ceOhrBCQoOWnQeI2P7AThIfMWq7VqWAAAAAElFTkSuQmCC";
const creditCardWarning = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMBAMAAAA1uUwYAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAqUExURf+oAEdwTP/Zi/+zGP/BQP+qAP+sAP/Uev/HV//Pbv+/Q//dmf+sAv/PbKEAkOkAAAALdFJOUykA8uVVHhDRfbRbifkj8gAAAOtJREFUSMft1r8OwVAcxfEf0foz6cAsdzGweQGDB6jFXINdrBa7xW7xDF2QvgKL2cO4ram9h3uGVpB+ky7ySW51uDni6Ra+vMyZxUL08wYl8MkCseTGrCvW5poFduZqJkSedBg2lTbDKhIwzBWfYQ7Lyv65xkql6m8gW0eZjkjVI6MlYFuTnZgz8akRqHA2AgF2ARXOFOhbvlv881C/9tXOkr+XG7tzh0Y3pT7+QfJjA1OFgO1NdgasarIeYC3j1PCAbodmxoU7fCXVJqnG5SX9o+W7Q8jxQ04pcpiRM48djeQEJQctO4+Zsf0AeRydxmY6H30AAAAASUVORK5CYII=";
const _sfc_main$1 = {
  __name: "AnalyticsTransactions",
  __ssrInlineRender: true,
  setup(__props) {
    const transactions = [
      {
        amount: 82.6,
        paymentMethod: "PayPal",
        description: "Send money",
        icon: paypal,
        color: "error"
      },
      {
        paymentMethod: "Wallet",
        amount: 270.69,
        description: "Mac'D",
        icon: walletPrimary,
        color: "primary"
      },
      {
        amount: 637.91,
        paymentMethod: "Transfer",
        description: "Refund",
        icon: chartInfo,
        color: "info"
      },
      {
        paymentMethod: "Credit Card",
        amount: -838.71,
        description: "Ordered Food",
        icon: creditCardSuccess,
        color: "success"
      },
      {
        paymentMethod: "Wallet",
        amount: 203.33,
        description: "Starbucks",
        icon: walletPrimary,
        color: "primary"
      },
      {
        paymentMethod: "Mastercard",
        amount: -92.45,
        description: "Ordered Food",
        icon: creditCardWarning,
        color: "warning"
      }
    ];
    const moreList = [
      {
        title: "Share",
        value: "Share"
      },
      {
        title: "Refresh",
        value: "Refresh"
      },
      {
        title: "Update",
        value: "Update"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MoreBtn = _sfc_main$8;
      _push(ssrRenderComponent(VCard, mergeProps({ title: "Transactions" }, _attrs), {
        append: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_MoreBtn, { "menu-list": moreList }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_MoreBtn, { "menu-list": moreList })
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VCardText, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VList, { class: "card-list" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(transactions, (item) => {
                          _push4(ssrRenderComponent(VListItem, {
                            key: item.paymentMethod
                          }, {
                            prepend: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VAvatar, {
                                  rounded: "",
                                  variant: "tonal",
                                  color: item.color,
                                  image: item.icon,
                                  size: "40"
                                }, null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VAvatar, {
                                    rounded: "",
                                    variant: "tonal",
                                    color: item.color,
                                    image: item.icon,
                                    size: "40"
                                  }, null, 8, ["color", "image"])
                                ];
                              }
                            }),
                            append: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VListItemAction, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<span class="me-2" data-v-44c0441a${_scopeId5}>${ssrInterpolate(item.amount > 0 ? `+$${Math.abs(item.amount)}` : `-$${Math.abs(item.amount)}`)}</span><span class="text-disabled" data-v-44c0441a${_scopeId5}>USD</span>`);
                                    } else {
                                      return [
                                        createVNode("span", { class: "me-2" }, toDisplayString(item.amount > 0 ? `+$${Math.abs(item.amount)}` : `-$${Math.abs(item.amount)}`), 1),
                                        createVNode("span", { class: "text-disabled" }, "USD")
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VListItemAction, null, {
                                    default: withCtx(() => [
                                      createVNode("span", { class: "me-2" }, toDisplayString(item.amount > 0 ? `+$${Math.abs(item.amount)}` : `-$${Math.abs(item.amount)}`), 1),
                                      createVNode("span", { class: "text-disabled" }, "USD")
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VListItemSubtitle, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(item.paymentMethod)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(item.paymentMethod), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VListItemTitle, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(item.description)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(item.description), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VListItemSubtitle, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(item.paymentMethod), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(VListItemTitle, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(item.description), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(), createBlock(Fragment, null, renderList(transactions, (item) => {
                            return createVNode(VListItem, {
                              key: item.paymentMethod
                            }, {
                              prepend: withCtx(() => [
                                createVNode(VAvatar, {
                                  rounded: "",
                                  variant: "tonal",
                                  color: item.color,
                                  image: item.icon,
                                  size: "40"
                                }, null, 8, ["color", "image"])
                              ]),
                              append: withCtx(() => [
                                createVNode(VListItemAction, null, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "me-2" }, toDisplayString(item.amount > 0 ? `+$${Math.abs(item.amount)}` : `-$${Math.abs(item.amount)}`), 1),
                                    createVNode("span", { class: "text-disabled" }, "USD")
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              default: withCtx(() => [
                                createVNode(VListItemSubtitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(item.paymentMethod), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(VListItemTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(item.description), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024);
                          }), 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VList, { class: "card-list" }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(Fragment, null, renderList(transactions, (item) => {
                          return createVNode(VListItem, {
                            key: item.paymentMethod
                          }, {
                            prepend: withCtx(() => [
                              createVNode(VAvatar, {
                                rounded: "",
                                variant: "tonal",
                                color: item.color,
                                image: item.icon,
                                size: "40"
                              }, null, 8, ["color", "image"])
                            ]),
                            append: withCtx(() => [
                              createVNode(VListItemAction, null, {
                                default: withCtx(() => [
                                  createVNode("span", { class: "me-2" }, toDisplayString(item.amount > 0 ? `+$${Math.abs(item.amount)}` : `-$${Math.abs(item.amount)}`), 1),
                                  createVNode("span", { class: "text-disabled" }, "USD")
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            default: withCtx(() => [
                              createVNode(VListItemSubtitle, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(item.paymentMethod), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(VListItemTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(item.description), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024);
                        }), 64))
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VCardText, null, {
                default: withCtx(() => [
                  createVNode(VList, { class: "card-list" }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock(Fragment, null, renderList(transactions, (item) => {
                        return createVNode(VListItem, {
                          key: item.paymentMethod
                        }, {
                          prepend: withCtx(() => [
                            createVNode(VAvatar, {
                              rounded: "",
                              variant: "tonal",
                              color: item.color,
                              image: item.icon,
                              size: "40"
                            }, null, 8, ["color", "image"])
                          ]),
                          append: withCtx(() => [
                            createVNode(VListItemAction, null, {
                              default: withCtx(() => [
                                createVNode("span", { class: "me-2" }, toDisplayString(item.amount > 0 ? `+$${Math.abs(item.amount)}` : `-$${Math.abs(item.amount)}`), 1),
                                createVNode("span", { class: "text-disabled" }, "USD")
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          default: withCtx(() => [
                            createVNode(VListItemSubtitle, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(item.paymentMethod), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(VListItemTitle, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(item.description), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024);
                      }), 64))
                    ]),
                    _: 1
                  })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("views/dashboard/AnalyticsTransactions.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AnalyticsTransactions = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-44c0441a"]]);
const card = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUBAMAAADuRQ3yAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURWpq/0dwTLi5/6ep/5GU/25u/3Nz/7i6/62v/6Kj/4mJ/5ye/8PE/6Wm/2ls/4yP/xRl4mMAAAAMdFJOUykA7N9eHhD8wpNJe6BLX6QAAAEISURBVEjH7de/DsFQFMfxQ7SJjYFZOorNauhgMrGYa/AMliZGA4MHMInRA5gZ/Ek9gtmEFxDc1oTf5RxBKuk36fYZbnqTe++htKpZpacZdV+R+l7AAF+pQ4xMn2aJVUNRh0dNRYlZmjJcWqMUl8bI4VKTqlxqSGhU1HtNrIe6WA49UB7JhIvo3AY07sFygA4wXQJawnQGqKfpZ9TSBOhGUxhpUVMYt0BK22eVy6J7vy2HrgN64NMdawEnnx55f6Cl+pMt+DgtYDkFtIfpAtAxpitAk5j2iXsULuGpneiAldqay2BUvqsSXZBRN33n/Sp4QAue5YLHvmCEkAwmgnFHMERJRjPuwHcBZiyOwHBas44AAAAASUVORK5CYII=";
const wallet = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAMAAAArteDzAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAzUExURQDB7JDl93ng9oHi9kLS8wDE8QDG6UdwTGLZ9Gbc9WLa9CnN80DT8prn92fb8wTD7EvV8cfpimwAAAANdFJOUyn8z+J9HhAAk+StQ2b3/5lYAAABCklEQVRYw+3Z3RJDMBCG4Y1ko0ES93+1VcpoDyphvxkq74mzZ+hPkKX6nWWmQzHb2aLpcBBc4BVqSSw7o4LmpJKwOaoDSsK9UJZGeUBJvJqsPGqJ5VHGoKVSCV7bmR+1u8gm/M51+agLm2WrzbYZHOBEQ8j9XFPMYBBn+r+odwg0Rc1HvdJuo2qsMRloeroFoF4jUN8gUI1AFQL1p0eX/4EYqvq4JIWqGOXRCEB7BBoBaLg3quJVvqiv65f68fcI9EOVW6VWK8o9F+kToApxN9WI+77JQxOf0aocs0p+6ZF+kprqHkntePMrlU7TdfZPIdvHkI1uzJY8ZHiAGXNABjKY0RFmyCU9jnsCXE1nB7zpl7oAAAAASUVORK5CYII=";
const _sfc_main = {
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CardStatisticsVertical = _sfc_main$7;
      _push(ssrRenderComponent(VRow, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VCol, {
              cols: "12",
              md: "8"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(AnalyticsCongratulations, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(AnalyticsCongratulations)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCol, {
              cols: "12",
              sm: "4"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VRow, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          md: "6"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardStatisticsVertical, {
                                title: "Profit",
                                image: unref(chart),
                                stats: "$12,628",
                                change: 72.8
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardStatisticsVertical, {
                                  title: "Profit",
                                  image: unref(chart),
                                  stats: "$12,628",
                                  change: 72.8
                                }, null, 16)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          md: "6"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardStatisticsVertical, {
                                title: "Sales",
                                image: unref(wallet),
                                stats: "$4,679",
                                change: 28.42
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardStatisticsVertical, {
                                  title: "Sales",
                                  image: unref(wallet),
                                  stats: "$4,679",
                                  change: 28.42
                                }, null, 16)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCol, {
                            cols: "12",
                            md: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_CardStatisticsVertical, {
                                title: "Profit",
                                image: unref(chart),
                                stats: "$12,628",
                                change: 72.8
                              }, null, 16)
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "12",
                            md: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_CardStatisticsVertical, {
                                title: "Sales",
                                image: unref(wallet),
                                stats: "$4,679",
                                change: 28.42
                              }, null, 16)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VRow, null, {
                      default: withCtx(() => [
                        createVNode(VCol, {
                          cols: "12",
                          md: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_CardStatisticsVertical, {
                              title: "Profit",
                              image: unref(chart),
                              stats: "$12,628",
                              change: 72.8
                            }, null, 16)
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          md: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_CardStatisticsVertical, {
                              title: "Sales",
                              image: unref(wallet),
                              stats: "$4,679",
                              change: 28.42
                            }, null, 16)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCol, {
              cols: "12",
              md: "8",
              order: "2",
              "order-md": "1"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$2, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$2)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCol, {
              cols: "12",
              sm: "8",
              md: "4",
              order: "1",
              "order-md": "2"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VRow, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          sm: "6"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardStatisticsVertical, {
                                title: "Payments",
                                image: unref(paypal),
                                stats: "$2,468",
                                change: -14.82
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardStatisticsVertical, {
                                  title: "Payments",
                                  image: unref(paypal),
                                  stats: "$2,468",
                                  change: -14.82
                                }, null, 16)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          sm: "6"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardStatisticsVertical, {
                                title: "Transactions",
                                image: unref(card),
                                stats: "$14,857",
                                change: 28.14
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardStatisticsVertical, {
                                  title: "Transactions",
                                  image: unref(card),
                                  stats: "$14,857",
                                  change: 28.14
                                }, null, 16)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCol, {
                            cols: "12",
                            sm: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_CardStatisticsVertical, {
                                title: "Payments",
                                image: unref(paypal),
                                stats: "$2,468",
                                change: -14.82
                              }, null, 16)
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "12",
                            sm: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_CardStatisticsVertical, {
                                title: "Transactions",
                                image: unref(card),
                                stats: "$14,857",
                                change: 28.14
                              }, null, 16)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VRow, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCol, {
                          cols: "12",
                          sm: "12"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_sfc_main$3, null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_sfc_main$3)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCol, {
                            cols: "12",
                            sm: "12"
                          }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$3)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VRow, null, {
                      default: withCtx(() => [
                        createVNode(VCol, {
                          cols: "12",
                          sm: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_CardStatisticsVertical, {
                              title: "Payments",
                              image: unref(paypal),
                              stats: "$2,468",
                              change: -14.82
                            }, null, 16)
                          ]),
                          _: 1
                        }),
                        createVNode(VCol, {
                          cols: "12",
                          sm: "6"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_CardStatisticsVertical, {
                              title: "Transactions",
                              image: unref(card),
                              stats: "$14,857",
                              change: 28.14
                            }, null, 16)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(VRow, null, {
                      default: withCtx(() => [
                        createVNode(VCol, {
                          cols: "12",
                          sm: "12"
                        }, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$3)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCol, {
              cols: "12",
              md: "4",
              sm: "6",
              order: "3"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$4, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$4)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCol, {
              cols: "12",
              md: "4",
              sm: "6",
              order: "3"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$5, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$5)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCol, {
              cols: "12",
              md: "4",
              sm: "6",
              order: "3"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(AnalyticsTransactions, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(AnalyticsTransactions)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VCol, {
                cols: "12",
                md: "8"
              }, {
                default: withCtx(() => [
                  createVNode(AnalyticsCongratulations)
                ]),
                _: 1
              }),
              createVNode(VCol, {
                cols: "12",
                sm: "4"
              }, {
                default: withCtx(() => [
                  createVNode(VRow, null, {
                    default: withCtx(() => [
                      createVNode(VCol, {
                        cols: "12",
                        md: "6"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_CardStatisticsVertical, {
                            title: "Profit",
                            image: unref(chart),
                            stats: "$12,628",
                            change: 72.8
                          }, null, 16)
                        ]),
                        _: 1
                      }),
                      createVNode(VCol, {
                        cols: "12",
                        md: "6"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_CardStatisticsVertical, {
                            title: "Sales",
                            image: unref(wallet),
                            stats: "$4,679",
                            change: 28.42
                          }, null, 16)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(VCol, {
                cols: "12",
                md: "8",
                order: "2",
                "order-md": "1"
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$2)
                ]),
                _: 1
              }),
              createVNode(VCol, {
                cols: "12",
                sm: "8",
                md: "4",
                order: "1",
                "order-md": "2"
              }, {
                default: withCtx(() => [
                  createVNode(VRow, null, {
                    default: withCtx(() => [
                      createVNode(VCol, {
                        cols: "12",
                        sm: "6"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_CardStatisticsVertical, {
                            title: "Payments",
                            image: unref(paypal),
                            stats: "$2,468",
                            change: -14.82
                          }, null, 16)
                        ]),
                        _: 1
                      }),
                      createVNode(VCol, {
                        cols: "12",
                        sm: "6"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_CardStatisticsVertical, {
                            title: "Transactions",
                            image: unref(card),
                            stats: "$14,857",
                            change: 28.14
                          }, null, 16)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VRow, null, {
                    default: withCtx(() => [
                      createVNode(VCol, {
                        cols: "12",
                        sm: "12"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$3)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(VCol, {
                cols: "12",
                md: "4",
                sm: "6",
                order: "3"
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$4)
                ]),
                _: 1
              }),
              createVNode(VCol, {
                cols: "12",
                md: "4",
                sm: "6",
                order: "3"
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$5)
                ]),
                _: 1
              }),
              createVNode(VCol, {
                cols: "12",
                md: "4",
                sm: "6",
                order: "3"
              }, {
                default: withCtx(() => [
                  createVNode(AnalyticsTransactions)
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };

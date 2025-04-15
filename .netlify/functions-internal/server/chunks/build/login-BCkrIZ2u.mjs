import { _ as __nuxt_component_0 } from './nuxt-link-7-syJ-Wh.mjs';
import { ref, mergeProps, unref, withCtx, createVNode, useId, createTextVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { a as authV1TopShape, b as authV1BottomShape, _ as _sfc_main$1 } from './auth-v1-top-shape-D3JpisgY.mjs';
import { l as logo } from './logo-C2NYPRdy.mjs';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { useRouter } from 'vue-router';
import { u as useAuthStore } from './auth-BooGxS71.mjs';
import { T as VImg, V as VCard, U as VCardItem, a as VCardText, c as VBtn } from './server.mjs';
import { V as VForm, a as VCheckbox } from './VForm-C9TZsx-d.mjs';
import { V as VRow, a as VCol } from './VRow-DFLR6KLu.mjs';
import { V as VTextField } from './VTextField-BGuE7JWy.mjs';
import { V as VDivider } from './VDivider-BRaaa0NB.mjs';
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
import './index--wlg-iEi.mjs';

const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const poolData = {
      UserPoolId: "ap-south-1_lCMCna2RL",
      ClientId: "7mdvqnncbbn2s8m668ip9jus5o"
    };
    const userPool = new CognitoUserPool(poolData);
    const form = ref({
      email: "",
      password: "",
      remember: false
    });
    const isPasswordVisible = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();
    const userEmail = ref("");
    const handleSubmit = () => {
      const authData = new AuthenticationDetails({
        Username: form.value.email,
        Password: form.value.password
      });
      const userData = {
        Username: form.value.email,
        Pool: userPool
      };
      const cognitoUser = new CognitoUser(userData);
      cognitoUser.authenticateUser(authData, {
        onSuccess: (result) => {
          console.log("User successfully signed in.");
          console.log("Access token:", result.getAccessToken().getJwtToken());
          const idToken = result.getIdToken().getJwtToken();
          const payload = JSON.parse(atob(idToken.split(".")[1]));
          let group = "Standard";
          if (payload["cognito:groups"]) {
            if (payload["cognito:groups"].includes("Gold")) {
              group = "Gold";
            } else if (payload["cognito:groups"].includes("Silver")) {
              group = "Silver";
            } else {
              group = payload["cognito:groups"][0];
            }
          }
          console.log("User group:", group);
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              console.error("Error getting user attributes:", err);
              console.log("User name (fallback):", cognitoUser.getUsername());
            } else {
              const nameAttr = attributes.find((attr) => attr.getName() === "name");
              const name = nameAttr ? nameAttr.getValue() : cognitoUser.getUsername();
              console.log("User name:", name);
              const emailAttr = attributes.find((attr) => attr.getName() === "email");
              const email = emailAttr ? emailAttr.getValue() : form.value.email;
              userEmail.value = email;
              console.log("User email:", userEmail.value);
              authStore.setUserInfo(name, email, group);
            }
          });
          router.push("/dashboard");
        },
        onFailure: (error) => {
          console.error("Error during sign-in:", error);
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-wrapper d-flex align-center justify-center pa-4" }, _attrs))}><div class="position-relative my-sm-16">`);
      _push(ssrRenderComponent(VImg, {
        src: unref(authV1TopShape),
        class: "text-primary auth-v1-top-shape d-none d-sm-block"
      }, null, _parent));
      _push(ssrRenderComponent(VImg, {
        src: unref(authV1BottomShape),
        class: "text-primary auth-v1-bottom-shape d-none d-sm-block"
      }, null, _parent));
      _push(ssrRenderComponent(VCard, {
        class: ["auth-card", _ctx.$vuetify.display.smAndUp ? "pa-6" : "pa-0"],
        "max-width": "460"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VCardItem, { class: "justify-center" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: "/",
                    class: "app-logo"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a;
                      if (_push4) {
                        _push4(`<div class="d-flex"${_scopeId3}>${(_a = unref(logo)) != null ? _a : ""}</div><h1 class="app-logo-title"${_scopeId3}> sneat </h1>`);
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
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_NuxtLink, {
                      to: "/",
                      class: "app-logo"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", {
                          class: "d-flex",
                          innerHTML: unref(logo)
                        }, null, 8, ["innerHTML"]),
                        createVNode("h1", { class: "app-logo-title" }, " sneat ")
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
                  _push3(`<h4 class="text-h4 mb-1"${_scopeId2}> Welcome to Sneat! \u{1F44B}\u{1F3FB} </h4><p class="mb-0"${_scopeId2}> Please sign-in to your account and start the adventure </p>`);
                } else {
                  return [
                    createVNode("h4", { class: "text-h4 mb-1" }, " Welcome to Sneat! \u{1F44B}\u{1F3FB} "),
                    createVNode("p", { class: "mb-0" }, " Please sign-in to your account and start the adventure ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VCardText, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VForm, { onSubmit: handleSubmit }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VRow, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCol, { cols: "12" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VTextField, {
                                      id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                      modelValue: form.value.email,
                                      "onUpdate:modelValue": ($event) => form.value.email = $event,
                                      autofocus: "",
                                      label: "Email or Username",
                                      type: "email",
                                      placeholder: "johndoe@email.com"
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VTextField, {
                                        id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                        modelValue: form.value.email,
                                        "onUpdate:modelValue": ($event) => form.value.email = $event,
                                        autofocus: "",
                                        label: "Email or Username",
                                        type: "email",
                                        placeholder: "johndoe@email.com"
                                      }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCol, { cols: "12" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VTextField, {
                                      id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                      modelValue: form.value.password,
                                      "onUpdate:modelValue": ($event) => form.value.password = $event,
                                      label: "Password",
                                      placeholder: "\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7",
                                      type: isPasswordVisible.value ? "text" : "password",
                                      autocomplete: "password",
                                      "append-inner-icon": isPasswordVisible.value ? "bx-hide" : "bx-show",
                                      "onClick:appendInner": ($event) => isPasswordVisible.value = !isPasswordVisible.value
                                    }, null, _parent6, _scopeId5));
                                    _push6(`<div class="d-flex align-center justify-space-between flex-wrap my-6"${_scopeId5}>`);
                                    _push6(ssrRenderComponent(VCheckbox, {
                                      id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                      modelValue: form.value.remember,
                                      "onUpdate:modelValue": ($event) => form.value.remember = $event,
                                      label: "Remember me"
                                    }, null, _parent6, _scopeId5));
                                    _push6(`<a class="text-primary" href="javascript:void(0)"${_scopeId5}>Forgot Password?</a></div>`);
                                    _push6(ssrRenderComponent(VBtn, {
                                      block: "",
                                      type: "submit"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Login `);
                                        } else {
                                          return [
                                            createTextVNode(" Login ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VTextField, {
                                        id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                        modelValue: form.value.password,
                                        "onUpdate:modelValue": ($event) => form.value.password = $event,
                                        label: "Password",
                                        placeholder: "\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7",
                                        type: isPasswordVisible.value ? "text" : "password",
                                        autocomplete: "password",
                                        "append-inner-icon": isPasswordVisible.value ? "bx-hide" : "bx-show",
                                        "onClick:appendInner": ($event) => isPasswordVisible.value = !isPasswordVisible.value
                                      }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "onClick:appendInner"]),
                                      createVNode("div", { class: "d-flex align-center justify-space-between flex-wrap my-6" }, [
                                        createVNode(VCheckbox, {
                                          id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                          modelValue: form.value.remember,
                                          "onUpdate:modelValue": ($event) => form.value.remember = $event,
                                          label: "Remember me"
                                        }, null, 8, ["id", "modelValue", "onUpdate:modelValue"]),
                                        createVNode("a", {
                                          class: "text-primary",
                                          href: "javascript:void(0)"
                                        }, "Forgot Password?")
                                      ]),
                                      createVNode(VBtn, {
                                        block: "",
                                        type: "submit"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Login ")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                class: "text-body-1 text-center"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<span class="d-inline-block"${_scopeId5}>New on our platform?</span>`);
                                    _push6(ssrRenderComponent(_component_NuxtLink, {
                                      class: "text-primary ms-1 d-inline-block text-body-1",
                                      to: "/register"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Create an account `);
                                        } else {
                                          return [
                                            createTextVNode(" Create an account ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode("span", { class: "d-inline-block" }, "New on our platform?"),
                                      createVNode(_component_NuxtLink, {
                                        class: "text-primary ms-1 d-inline-block text-body-1",
                                        to: "/register"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Create an account ")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                class: "d-flex align-center"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VDivider, null, null, _parent6, _scopeId5));
                                    _push6(`<span class="mx-4 text-high-emphasis"${_scopeId5}>or</span>`);
                                    _push6(ssrRenderComponent(VDivider, null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VDivider),
                                      createVNode("span", { class: "mx-4 text-high-emphasis" }, "or"),
                                      createVNode(VDivider)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                class: "text-center"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_sfc_main$1, null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_sfc_main$1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                      modelValue: form.value.email,
                                      "onUpdate:modelValue": ($event) => form.value.email = $event,
                                      autofocus: "",
                                      label: "Email or Username",
                                      type: "email",
                                      placeholder: "johndoe@email.com"
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                      modelValue: form.value.password,
                                      "onUpdate:modelValue": ($event) => form.value.password = $event,
                                      label: "Password",
                                      placeholder: "\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7",
                                      type: isPasswordVisible.value ? "text" : "password",
                                      autocomplete: "password",
                                      "append-inner-icon": isPasswordVisible.value ? "bx-hide" : "bx-show",
                                      "onClick:appendInner": ($event) => isPasswordVisible.value = !isPasswordVisible.value
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "onClick:appendInner"]),
                                    createVNode("div", { class: "d-flex align-center justify-space-between flex-wrap my-6" }, [
                                      createVNode(VCheckbox, {
                                        id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                        modelValue: form.value.remember,
                                        "onUpdate:modelValue": ($event) => form.value.remember = $event,
                                        label: "Remember me"
                                      }, null, 8, ["id", "modelValue", "onUpdate:modelValue"]),
                                      createVNode("a", {
                                        class: "text-primary",
                                        href: "javascript:void(0)"
                                      }, "Forgot Password?")
                                    ]),
                                    createVNode(VBtn, {
                                      block: "",
                                      type: "submit"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Login ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, {
                                  cols: "12",
                                  class: "text-body-1 text-center"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", { class: "d-inline-block" }, "New on our platform?"),
                                    createVNode(_component_NuxtLink, {
                                      class: "text-primary ms-1 d-inline-block text-body-1",
                                      to: "/register"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Create an account ")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, {
                                  cols: "12",
                                  class: "d-flex align-center"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VDivider),
                                    createVNode("span", { class: "mx-4 text-high-emphasis" }, "or"),
                                    createVNode(VDivider)
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, {
                                  cols: "12",
                                  class: "text-center"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$1)
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
                          createVNode(VRow, null, {
                            default: withCtx(() => [
                              createVNode(VCol, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode(VTextField, {
                                    id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                    modelValue: form.value.email,
                                    "onUpdate:modelValue": ($event) => form.value.email = $event,
                                    autofocus: "",
                                    label: "Email or Username",
                                    type: "email",
                                    placeholder: "johndoe@email.com"
                                  }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode(VTextField, {
                                    id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                    modelValue: form.value.password,
                                    "onUpdate:modelValue": ($event) => form.value.password = $event,
                                    label: "Password",
                                    placeholder: "\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7",
                                    type: isPasswordVisible.value ? "text" : "password",
                                    autocomplete: "password",
                                    "append-inner-icon": isPasswordVisible.value ? "bx-hide" : "bx-show",
                                    "onClick:appendInner": ($event) => isPasswordVisible.value = !isPasswordVisible.value
                                  }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "onClick:appendInner"]),
                                  createVNode("div", { class: "d-flex align-center justify-space-between flex-wrap my-6" }, [
                                    createVNode(VCheckbox, {
                                      id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                      modelValue: form.value.remember,
                                      "onUpdate:modelValue": ($event) => form.value.remember = $event,
                                      label: "Remember me"
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"]),
                                    createVNode("a", {
                                      class: "text-primary",
                                      href: "javascript:void(0)"
                                    }, "Forgot Password?")
                                  ]),
                                  createVNode(VBtn, {
                                    block: "",
                                    type: "submit"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Login ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, {
                                cols: "12",
                                class: "text-body-1 text-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", { class: "d-inline-block" }, "New on our platform?"),
                                  createVNode(_component_NuxtLink, {
                                    class: "text-primary ms-1 d-inline-block text-body-1",
                                    to: "/register"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Create an account ")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, {
                                cols: "12",
                                class: "d-flex align-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VDivider),
                                  createVNode("span", { class: "mx-4 text-high-emphasis" }, "or"),
                                  createVNode(VDivider)
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, {
                                cols: "12",
                                class: "text-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode(_sfc_main$1)
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
                } else {
                  return [
                    createVNode(VForm, {
                      onSubmit: withModifiers(handleSubmit, ["prevent"])
                    }, {
                      default: withCtx(() => [
                        createVNode(VRow, null, {
                          default: withCtx(() => [
                            createVNode(VCol, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(VTextField, {
                                  id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                  modelValue: form.value.email,
                                  "onUpdate:modelValue": ($event) => form.value.email = $event,
                                  autofocus: "",
                                  label: "Email or Username",
                                  type: "email",
                                  placeholder: "johndoe@email.com"
                                }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(VCol, { cols: "12" }, {
                              default: withCtx(() => [
                                createVNode(VTextField, {
                                  id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                  modelValue: form.value.password,
                                  "onUpdate:modelValue": ($event) => form.value.password = $event,
                                  label: "Password",
                                  placeholder: "\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7",
                                  type: isPasswordVisible.value ? "text" : "password",
                                  autocomplete: "password",
                                  "append-inner-icon": isPasswordVisible.value ? "bx-hide" : "bx-show",
                                  "onClick:appendInner": ($event) => isPasswordVisible.value = !isPasswordVisible.value
                                }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "onClick:appendInner"]),
                                createVNode("div", { class: "d-flex align-center justify-space-between flex-wrap my-6" }, [
                                  createVNode(VCheckbox, {
                                    id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                    modelValue: form.value.remember,
                                    "onUpdate:modelValue": ($event) => form.value.remember = $event,
                                    label: "Remember me"
                                  }, null, 8, ["id", "modelValue", "onUpdate:modelValue"]),
                                  createVNode("a", {
                                    class: "text-primary",
                                    href: "javascript:void(0)"
                                  }, "Forgot Password?")
                                ]),
                                createVNode(VBtn, {
                                  block: "",
                                  type: "submit"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Login ")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(VCol, {
                              cols: "12",
                              class: "text-body-1 text-center"
                            }, {
                              default: withCtx(() => [
                                createVNode("span", { class: "d-inline-block" }, "New on our platform?"),
                                createVNode(_component_NuxtLink, {
                                  class: "text-primary ms-1 d-inline-block text-body-1",
                                  to: "/register"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Create an account ")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(VCol, {
                              cols: "12",
                              class: "d-flex align-center"
                            }, {
                              default: withCtx(() => [
                                createVNode(VDivider),
                                createVNode("span", { class: "mx-4 text-high-emphasis" }, "or"),
                                createVNode(VDivider)
                              ]),
                              _: 1
                            }),
                            createVNode(VCol, {
                              cols: "12",
                              class: "text-center"
                            }, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$1)
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VCardItem, { class: "justify-center" }, {
                default: withCtx(() => [
                  createVNode(_component_NuxtLink, {
                    to: "/",
                    class: "app-logo"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: "d-flex",
                        innerHTML: unref(logo)
                      }, null, 8, ["innerHTML"]),
                      createVNode("h1", { class: "app-logo-title" }, " sneat ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(VCardText, null, {
                default: withCtx(() => [
                  createVNode("h4", { class: "text-h4 mb-1" }, " Welcome to Sneat! \u{1F44B}\u{1F3FB} "),
                  createVNode("p", { class: "mb-0" }, " Please sign-in to your account and start the adventure ")
                ]),
                _: 1
              }),
              createVNode(VCardText, null, {
                default: withCtx(() => [
                  createVNode(VForm, {
                    onSubmit: withModifiers(handleSubmit, ["prevent"])
                  }, {
                    default: withCtx(() => [
                      createVNode(VRow, null, {
                        default: withCtx(() => [
                          createVNode(VCol, { cols: "12" }, {
                            default: withCtx(() => [
                              createVNode(VTextField, {
                                id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                modelValue: form.value.email,
                                "onUpdate:modelValue": ($event) => form.value.email = $event,
                                autofocus: "",
                                label: "Email or Username",
                                type: "email",
                                placeholder: "johndoe@email.com"
                              }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, { cols: "12" }, {
                            default: withCtx(() => [
                              createVNode(VTextField, {
                                id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                modelValue: form.value.password,
                                "onUpdate:modelValue": ($event) => form.value.password = $event,
                                label: "Password",
                                placeholder: "\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7",
                                type: isPasswordVisible.value ? "text" : "password",
                                autocomplete: "password",
                                "append-inner-icon": isPasswordVisible.value ? "bx-hide" : "bx-show",
                                "onClick:appendInner": ($event) => isPasswordVisible.value = !isPasswordVisible.value
                              }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "type", "append-inner-icon", "onClick:appendInner"]),
                              createVNode("div", { class: "d-flex align-center justify-space-between flex-wrap my-6" }, [
                                createVNode(VCheckbox, {
                                  id: ("useId" in _ctx ? _ctx.useId : unref(useId))(),
                                  modelValue: form.value.remember,
                                  "onUpdate:modelValue": ($event) => form.value.remember = $event,
                                  label: "Remember me"
                                }, null, 8, ["id", "modelValue", "onUpdate:modelValue"]),
                                createVNode("a", {
                                  class: "text-primary",
                                  href: "javascript:void(0)"
                                }, "Forgot Password?")
                              ]),
                              createVNode(VBtn, {
                                block: "",
                                type: "submit"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Login ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "12",
                            class: "text-body-1 text-center"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "d-inline-block" }, "New on our platform?"),
                              createVNode(_component_NuxtLink, {
                                class: "text-primary ms-1 d-inline-block text-body-1",
                                to: "/register"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Create an account ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "12",
                            class: "d-flex align-center"
                          }, {
                            default: withCtx(() => [
                              createVNode(VDivider),
                              createVNode("span", { class: "mx-4 text-high-emphasis" }, "or"),
                              createVNode(VDivider)
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "12",
                            class: "text-center"
                          }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$1)
                            ]),
                            _: 1
                          })
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
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };

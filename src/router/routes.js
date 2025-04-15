const routes = [
  {
    path: "/",
    component: () => import("layouts/PocetnaLayout.vue"),
  },
  {
    path: "/login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/LoginIndex.vue") }],
  },
  {
    path: "/main",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "nastavnici",
        component: () => import("src/pages/PageNastavnici.vue"),
        meta: { auth: true },
      },
      {
        path: "tecajevi",
        component: () => import("src/pages/PageTecajevi.vue"),
        meta: { auth: true },
      },
      {
        path: "polaznici",
        component: () => import("src/pages/PagePolaznici.vue"),
        meta: { auth: true },
      },
      {
        path: "ispiti",
        component: () => import("src/pages/IspitnoPolaganje.vue"),
        meta: { auth: true },
      },
      {
        path: "izvjesca",
        component: () => import("src/pages/PageIzvjesca.vue"),
        meta: { auth: true },
      },
      {
        path: "uplate",
        component: () => import("src/pages/PageUplate.vue"),
        meta: { auth: true },
      },
      {
        path: "kontakt",
        component: () => import("src/pages/PageKontakt.vue"),
        meta: { auth: true },
      },
      {
        path: "pomoc",
        component: () => import("src/pages/PagePomoc.vue"),
        meta: { auth: true },
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

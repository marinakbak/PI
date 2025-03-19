import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { auth } from "../boot/firebase"; // 🔹 Import Firebase auth

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // 🔹 Provjera autentifikacije prije nego što korisnik pristupi zaštićenim stranicama
  Router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.auth);

    if (requiresAuth && !auth.currentUser) {
      next("/login"); // Ako korisnik nije prijavljen, preusmjeri ga na login
    } else {
      next(); // Dozvoli pristup
    }
  });

  return Router;
});

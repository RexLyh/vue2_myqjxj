import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/BallGame",
    name: "BallGame",
    component: () =>
      import(/* webpackChunkName: "ballgame" */ "../views/BallGameView.vue"),
  },
  {
    path: "/YourView",
    name: "YourView",
    component: () =>
      import(/* webpackChunkName: "your" */ "../views/YourView.vue"),
  },
  {
    path: "/GameView",
    name: "GameView",
    component: () =>
      import(/* webpackChunkName: "game" */ "../views/GameView.vue"),
  },
  {
    path: "/EmojiMatchGame",
    name: "EmojiMatchGame",
    component: () =>
      import(
        /* webpackChunkName: "EmojiMatchGame" */ "../views/EmojiMatchGame.vue"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

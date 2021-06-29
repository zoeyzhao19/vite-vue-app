import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import "nprogress/nprogress.css";
/**
 * meta
 *  auth: 是否需要登录才能访问
 *  redirect: 登录状态下该页面是否需要重定向
 */
const routes: Array<RouteRecordRaw> = [];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

export default router;

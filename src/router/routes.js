import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import FileManagement from "@/pages/management/FileManagement.vue";
import RechargeManagement from "@/pages/management/RechargeManagement.vue";

import Login from "@/pages/Login.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "仪表盘",
        component: Dashboard
      },
      {
        path: "/files",
        name: "文件管理",
        component: FileManagement
      },
      {
        path: "/recharge",
        name: "流量充值",
        component: RechargeManagement
      }
    ]
  },
  { path: "/login", component: Login },
  { path: "*", component: NotFound }
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
 function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;

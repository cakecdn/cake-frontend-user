import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Notifications from "@/pages/Notifications.vue";
import UserManagement from "@/pages/UserManagement.vue";
import NodeManagement from "@/pages/NodeManagement.vue";
import CodeManagement from "@/pages/CodeManagement.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Typography from "@/pages/Typography.vue";
import TableList from "@/pages/TableList.vue";

import Login from "@/pages/Login.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "仪表盘",
        component: Dashboard
      },
      {
        path: "profile",
        name: "用户信息",
        component: UserProfile
      },
      {
        path: "notifications",
        name: "提醒",
        component: Notifications
      },
      {
        path: "members",
        name: "用户管理",
        component: UserManagement
      },
      {
        path: "nodes",
        name: "节点管理",
        component: NodeManagement
      },
      {
        path: "codes",
        name: "充值码管理",
        component: CodeManagement
      },
      {
        path: "icons",
        name: "icons",
        component: Icons
      },
      {
        path: "maps",
        name: "maps",
        component: Maps
      },
      {
        path: "typography",
        name: "typography",
        component: Typography
      },
      {
        path: "table-list",
        name: "table-list",
        component: TableList
      }
    ]
  },
  {path: "/login", component: Login},
  {path: "*", component: NotFound}
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

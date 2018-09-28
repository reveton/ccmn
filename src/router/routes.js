// Dynamic Loading Modules

// Views
const Dashboard = resolve => { require.ensure(['../views/Dashboard.vue'], ()=>{ resolve(require('../views/Dashboard.vue')); }); };

//Pages
const Page404 = resolve => { require.ensure(['../pages/Page404.vue'], ()=>{ resolve(require('../pages/Page404.vue')); }); };
const Location = resolve => { require.ensure(['../views/Location.vue'], ()=>{ resolve(require('../views/Location.vue')); }); };

export const routes = [
    {
        path : '',
        name: 'home',
        components:{
            default: Dashboard
        }
    },
    {   path : '/dashboard',
        components:{
            default: Dashboard
        }
    },
    {
        path : '/location',
        name: 'Location',
        component: Location
    },
    {
        path: '/404',
        name: '404',
        component: Page404,
    },
    {
        path: '*',
        redirect: '/404'
    }
];
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Login from '@/components/Login'
import Analysis from '@/components/analysis/index.vue'
import Studentsetting from '@/components/studentsetting/index.vue'
import Classsetting from '@/components/classsetting/index.vue'
import Recordsetting from '@/components/recordsetting/index.vue'
import First from '@/components/first/index.vue'
import History from '@/components/first/history.vue'
import Online from '@/components/online/index'
import detailSeat from '@/components/detailSeat/index.vue'
import seatQuery from '@/components/seatQuery/index.vue'
import onlineSeat from '@/components/onlineSeat/index.vue'
import top5MoreDetail from '@/components/top5MoreDetail/index.vue'
import teacher from '@/components/teacher/index.vue'
import code from '@/components/code/index.vue'
import eyedown from '@/components/eyedown/index'
import nocheck from '@/components/nocheck/index'
import noclock from '@/components/noclock/index'
import nocheckPersent from '@/components/nocheckPersent.vue'
import allBadPersent from '@/components/allBadPersent.vue'
import ranking from '@/components/ranking/index.vue'
import coparation from '@/components/coparation/index.vue'
import clert from '@/components/clert/index.vue'
import school from '@/components/school/index.vue'
import schoolAccount from '@/components/schoolAccount.vue'
Vue.use(Router)

export default new Router({
  routes: [
     {path: '/', redirect: '/login'},
     {path: '/login',component: Login},
     {path: '/detailSeat/',component: detailSeat},
	   {path: '/onlineSeat/',component: onlineSeat},
     {path: '/top5MoreDetail', component: top5MoreDetail},
     {path: '/nocheckPersent', component: nocheckPersent},
     {path: '/allBadPersent', component: allBadPersent},
     {
       path: '/home',
       component: Home,
       children: [
         {path: '/first', component: First },
         {path: '/history', component: History},
         {path: '/studentsetting', component: Studentsetting},
         {path: '/classsetting', component: Classsetting},
         {path: '/recordsetting', component: Recordsetting},
         {path: '/analysis', component: Analysis},
         {path: '/online', component: Online},
         {path: '/detailSeat', component: detailSeat},
         {path: '/seatQuery', component: seatQuery},
         {path: '/teacher', component: teacher},
         {path: '/code', component: code},
         {path: '/eyedown', component: eyedown},
         {path: '/nocheck', component: nocheck},
         {path: '/noclock', component: noclock},
         {path: '/ranking', component: ranking},
         {path: '/coparation',component: coparation},
         {path: '/clert',component: clert},
         {path: '/school', component: school},
          {path: '/schoolAccount', component: schoolAccount},
       ]
     }
  ]
})

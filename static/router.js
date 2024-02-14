import Home from './components/home.js'
import Login from './components/login.js'
import Register from './components/register.js'
import AdminDash from './components/admindash.js'
import EditCategory from './components/editcat.js'
import MgrDash from './components/mgrdash.js'
import ViewProds from './components/viewprods.js'
import addprod from './components/addprod.js'
import editprod from './components/editprod.js'
import catalogue from './components/catalogue.js'
import viewcart from './components/viewcart.js'
import final from './components/final.js'
import search from './components/search.js'

const routes = [
  { path: '/', component: Home, name: 'Home'},
  { path: '/login', component: Login, name: 'Login'},
  { path: '/signup', component: Register, name: 'Register'},
  { path: '/admin-dashboard', component: AdminDash, name: 'Admin-Dashboard'},
  { path: '/admin-dashboard/edit-category/:cname', component: EditCategory, name: 'edit-category-admin' },
  { path: '/manager-dashboard', component: MgrDash, name: 'Manager-Dashboard'},
  { path: '/manager-dashboard/edit-category/:cname', component: EditCategory, name: 'edit-category-manager' },
  { path: '/view-products/:cname', component: ViewProds, name:'view-products'},
  { path: '/add-product/:cname', component: addprod, name:'add-products'},
  { path: '/edit-product/:pname', component: editprod, name:'edit-product'},
  { path: '/catalogue', component: catalogue, name:'catalogue'},
  { path: '/view-cart', component: viewcart, name:'view-cart'},
  { path: '/thank-you', component: final, name:'final'},
  { path: '/search', component:search, name:'search'}

]

export default new VueRouter({
  routes,
})
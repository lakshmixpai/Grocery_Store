export default{
    template:   `
    <nav class="navbar navbar-expand-lg bg-secondary">
  <div class="container-fluid">
    <a class="navbar-brand" >
    <img src="https://i.ibb.co/84bmzRg/logo.png" alt="logo" width="115" height="80"></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
        <router-link class="nav-link active fs-5" aria-current="page" to="/admin-dashboard" v-if="role=='admin'">Home</router-link>
        <router-link class="nav-link active fs-5" aria-current="page" to="/manager-dashboard" v-if="role=='mgr'">Home</router-link>
        <router-link class="nav-link active fs-5" aria-current="page" to="/catalogue" v-if="role=='cust'">Home</router-link>
        </li>
        <li class="nav-item">
        <router-link class="nav-link active fs-5" aria-current="page" to="/search" v-if="is_login">Search</router-link>
        </li>
        <li class="nav-item">
        <router-link class="nav-link active fs-5" aria-current="page" to="/view-cart" v-if="role=='cust'">View Cart</router-link>
        </li>
      </ul>
      <div class="col-md-1 ms-auto fs-5" v-if="is_login">
        <button class="nav-link" @click='logout' >Logout</button> </div>
      </div>

  </div>
</nav>
    `,

    data() {
      return {
        role: localStorage.getItem('role'),
        is_login: localStorage.getItem('auth-token'),
      }
    },
    methods: {
      logout() {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('role')
        this.$router.push({ path: '/login' })
      },
    },
  }
export default {
    template: `
    <div class="container mt-5">
      <div class="d-flex justify-content-center">
        <div class="card p-5 bg-light">
          <h1 class="mb-4">Edit Category</h1>
  
          <div class="mb-3 row">
            <label for="currentCname" class="col-md-6 col-form-label">Current Category Name:</label>
            <div class="col-md-6">
              <input type="text" readonly class="form-control-plaintext" id="currentCname" :value="$route.params.cname">
            </div>
          </div>
  
          <div class="mb-3 row">
            <label for="newCname" class="col-md-6 col-form-label">New Category Name:</label>
            <div class="col-md-6">
              <input type="text" class="form-control" id="newCname" v-model="newcname" required>
            </div>
          </div>
    
        <div v-if="role=='admin'">
        <button type="button" class="btn btn-primary" @click="editCategory">Edit</button>
        </div>
        <div v-if="role=='mgr'">
        <button type="button" class="btn btn-primary" @click="editCategory" v-if="role=='mgr'">Request Edit</button>
        </div>
      </div>
      </div>
      </div>
  
      `,
  
    data() {
      return {
        newcname: '', 
        token: localStorage.getItem('auth-token'),
        role:localStorage.getItem('role')
      };
    },
  
    methods: {
      async editCategory() {
        const res = await fetch(`/api/category`, { 
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.token,
          },
          body: JSON.stringify({
            cname: this.$route.params.cname,
            new_cname: this.newcname,
          }),
        });

        const data = await res.json()

        if (res.ok) {
          console.log(data.message);
          if(this.role == 'admin'){
            this.$router.push({ path: '/admin-dashboard' });
          }
          else if(this.role == 'mgr'){
            this.$router.push({ path: '/manager-dashboard' });
          }
        } else {
          console.error(data.message);
        }
      },
    },
  };
  
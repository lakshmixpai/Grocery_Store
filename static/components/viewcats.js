// CategoryComponent.js

export default {
  template: `
    <div>
    <div class="container mt-5">
      <div class="card mb-3 mt-3 border-success" style="max-width: 700px;">
        <div class="row g-3">
          <div class="col-md-4">
            <img :src="category.link" class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{{ category.cname }}</h5>
              <div class="btn-group" role="group">
                <router-link :to="{ name: 'view-products', params: { cname: category.cname } }" class="btn btn-outline-primary">View Products</router-link>
                <router-link :to="{ name: 'add-products', params: { cname: category.cname } }" class="btn btn-outline-success" v-if="role=='mgr'">Add Product</router-link>
              </div>
              <p></p>
              <div class="btn-group" role="group">
                <router-link :to="{ name: 'edit-category-admin', params: { cname: category.cname } }" class="btn btn-outline-primary" v-if="role=='admin'">Edit</router-link>
                <router-link :to="{ name: 'edit-category-manager', params: { cname: category.cname } }" class="btn btn-outline-primary" v-if="role=='mgr'">Request Edit</router-link>
                <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" :data-bs-target="'#deleteConfirm-' + category.cname" v-if="role=='admin'">Delete</button>
                <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" :data-bs-target="'#deleteConfirm-' + category.cname" v-if="role=='mgr'">Request Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" :id="'deleteConfirm-' + category.cname" tabindex="-1" :aria-labelledby="'deleteConfirmLabel-' + category.cname" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" :id="'deleteConfirmLabel-' + category.cname">Are you sure you want to delete?</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
              <button type="button" class="btn btn-danger" @click="deleteCategory(category.cname)">Yes, delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  `,

  props: ['category'],

  data() {
    return {
      token: localStorage.getItem('auth-token'),
      role: localStorage.getItem('role'),
      cname: "",
    };
  },

  methods: {
    async deleteCategory(cname_to_del) {
      const res = await fetch(`/api/category`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': this.token,
        },
        body: JSON.stringify({
          cname: cname_to_del,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(data.message);
        this.$router.go(0);
      } else {
        console.error(data.message);
      }
    },
  },
};

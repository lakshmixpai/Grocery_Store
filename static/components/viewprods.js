export default {
    template: `
      <div>
      <div class="container mt-3">
      <h1>{{ $route.params.cname }}</h1>
      <hr class="my-4"></div>
      <div v-for="product in products">
      <div class="container mt-3">
            <div class="card mb-3 mt-3 border-success" style="max-width: 700px;">
            <div class="row g-3">
              <div class="col-md-4">
              <img :src="product.link" class="img-fluid rounded-start" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">{{ product.pname }}</h5>
                  <ul class="list-group list-group-flush">
                  <li class="list-group-item">Price: {{ product.rate }}/{{product.unit}}</li>
                  <li class="list-group-item">Quantity in Stock: {{product.quantity}}</li>
                  <li class="list-group-item">Manufacturing Date: {{product.mdate}}</li>
                  <li class="list-group-item">Expiry Date: {{product.edate}}</li>
                  <li class="list-group-item">Description: {{product.desc}}</li>
                </ul>
                  <div class="btn-group" role="group">
      
                    <router-link :to="{ name: 'edit-product', params: { pname: product.pname } }" class="btn btn-outline-primary" v-if="role=='mgr'">Edit</router-link>
                    
                    <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" :data-bs-target="'#deleteConfirm-' + product.pname" v-if="role=='mgr'">Delete</button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
      
          <div class="modal fade" :id="'deleteConfirm-' + product.pname" tabindex="-1" :aria-labelledby="'deleteConfirmLabel-' + product.pname" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" :id="'deleteConfirmLabel-'+ product.pname">Are you sure you want to delete?</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                  <button type="button" class="btn btn-primary" @click="deleteProduct(product.pname)">Yes, delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
  
      `,
  
    data() {
      return {
        token: localStorage.getItem('auth-token'),
        role: localStorage.getItem('role'),
        products: [],

      };
    },

    async mounted() {
        const res = await fetch(`/api/get-products/${this.$route.params.cname }`, {
            method: 'GET',
            headers: {
              'Authentication-Token': this.token,
            },
          });
        
        const data = await res.json()
        
        if (res.ok) {
          this.products = data
          console.log(data.message)          
        } else {
          console.log(data.message)
        }

      },

      methods:
      {
        async deleteProduct(pname_to_del){
            const res = await fetch(`/api/product`, { 
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authentication-Token': this.token,
                },
                body: JSON.stringify({
                  pname: pname_to_del,
                }),
              });

              const data = await res.json()
              if (res.ok) {
                console.log(data.message);
                this.$router.go(0)
              } else {
                console.error(data.message);
              }
        }
      }
 
  };
  
export default {
    template: `
      <div>
      <div v-for="product in products">
            <div class="card mb-3 mt-3 border-success" style="max-width: 800px;">
            <div class="row g-3">
              <div class="col-md-4">
              <img :src="product.link" class="img-fluid rounded-start" alt="...">
              </div>
              <div class="col-md-5">
                <div class="card-body">
                
                  <h5 class="card-title">{{ product.pname }}</h5>
                  <ul class="list-group list-group-flush">
                  <li class="list-group-item">Price: {{product.rate}}/{{product.unit}}</li>
                  <li class="list-group-item">Manufacturing Date: {{product.mdate}}</li>
                  <li class="list-group-item">Expiry Date: {{product.edate}}</li>
                  <li class="list-group-item">Description: {{product.desc}}</li>
                </ul>
                </div>
                </div>

              <div class="col-md-3 d-flex align-items-center">
              <div class="card-body text-center">
              <div v-if="product.quantity!=0" >
              <div class="input-group mb-2">
                  <input
                    type="number"
                    :id="'quantity-' + product.pname"
                    class="form-control"
                    placeholder="0"
                    v-model="quantities[product.pname]" min="0" step="0.25"
                  />
                  <span class="input-group-text">{{ product.unit }}s</span>
                </div>
              <button type="button" class="btn btn-primary btn-block" @click="addToCart(product.pname)"> Add To Cart </button>
              </div>
              <div class="text-danger-emphasis fs-3 fw-bolder" v-if="product.quantity==0">OUT OF STOCK</div>
              </div>
              </div>

              </div>
                
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
        products: [],
        quantities: []

      };
    },

    async mounted() {
        const res = await fetch(`/api/get-products/${this.category}`, {
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

      methods: {
        async addToCart(pname) {
          const quantity = this.quantities[pname] || 0;
          const res = await fetch(`/api/cart`, {
            method: 'POST',
            headers: {
              'Authentication-Token': this.token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pname: pname,
                quantity: quantity
              }),
          });

          const data = await res.json()
        
        if (res.ok) {
          console.log(data.message) 
          this.$router.go(0)         
        } else {
          console.log(data.message)
        }

        },
      },
 
  };
  
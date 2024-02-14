export default {
    template: `
    <div>
    <div class="container mt-5" v-if="products!=null">
      <div class="mb-4 h3">Your Cart Details</div>
      <h5>Edit Your cart details if you wish!</h5>
      <hr class="my-4">
    <div v-for="product in products" :key="product.id">
      <div class="card mb-3 mt-3 border-success" style="max-width: 800px;">
        <div class="row g-3">
          <div class="col-md-4">
            <img :src="product.link" class="img-fluid rounded-start" alt="...">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{{ product.pname }}</h5>
              <ul class="list-group list-group-flush">
              <li class="list-group-item">Price: {{ product.price}}</li>
              <li class="list-group-item">
              <div class="mb-3 row align-items-center">
              <div class="input-group mb-2">
              <label for="quantity" class="col-md-6 col-form-label">Quantity To Purchase: </label>
              <div class="col-md-6 d-flex">
              <input type="number" :id="'quantity-' + product.pname" class="form-control mb-2" v-model="product.quantity" min="0" step="0.25">
                  <span class="input-group-text">{{ product.unit }}s</span>
                  <button @click="update(product)" class="btn btn-primary ms-2 ">Update</button>
                </div>        
                        
                 </div>
            </div>  
              </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <h3>Total to be Paid: {{total}}</h3>
    <button @click="checkout" class="btn btn-primary mt-3">Checkout</button>
    </div></div>
  </div>
      `,
  
    data() {
      return {
        token: localStorage.getItem('auth-token'),
        role: localStorage.getItem('role'),
        products: null,
        total:0,
        runt:0
      };
    },

    async mounted() {
        const res = await fetch(`/api/cart`, {
            method: 'GET',
            headers: {
              'Authentication-Token': this.token,
            },
          });
        
        const data = await res.json()
        
        if (res.ok) {
          this.products = data
          for (const product of this.products){this.total = this.total + parseFloat(product.price); }     
        } else {
          console.log(data.message)
        }
        },
      

      methods:
      {
        async update(product){
          const res = await fetch(`/api/cart`, {
            method: 'PUT',
            headers: {
              'Authentication-Token': this.token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pname: product.pname,
              quantity: product.quantity,
            }),
          });
          const data = await res.json()
          
          if (res.ok) {
            this.$router.go(0)
            console.log(data.message)          
          } else {
            console.log(data.message)
          }
        },
 
          
        async checkout(){
            const res = await fetch(`/api/cart`, {
                method: 'DELETE',
                headers: {
                  'Authentication-Token': this.token,
                },
              });
            
            const data = await res.json()
            
            if (res.ok) {
              this.$router.push({ path: `/thank-you` })
              console.log(data.message) 
                       
            } else {
              console.log(data.message)
            }

      }
 
  }
}
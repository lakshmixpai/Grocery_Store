
export default {
    template: `
    <div>

    <div class="mb-4 row">
    <label for="search" class="col-md-3 col-form-label">Search:</label>
    <div class="col-md-4">
      <input type="text" class="form-control" id="search" v-model="search">
    </div>
    </div>


    <div class="mb-4 row">
    <label for="search" class="col-md-3 col-form-label">Search based on Category:</label>
    <div class="col-md-4">
      <select class="form-select" v-model="cname">
        <option selected>Select Category</option>
        <option v-for="category in categories" :value="category.cname">{{ category.cname }}</option>
      </select>
    </div>
  </div>

    <div class="mb-4 row">
    <label for="minprice" class="col-md-3 col-form-label">Minimum Price:</label>
    <div class="col-md-4">
      <input type="number" class="form-control" id="minprice" v-model="minprice" min="0" step="0.25">
    </div>
    </div>

    <div class="mb-4 row">
    <label for="maxprice" class="col-md-3 col-form-label">Maximum Price:</label>
    <div class="col-md-4">
      <input type="number" class="form-control" id="maxprice" v-model="maxprice" min="0" step="0.25">
    </div>
    </div>
    <button @click="searchprod" class="btn btn-primary mt-3">Search</button>
    <hr class="my-4">

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

      <div class="col-md-3 d-flex align-items-center" v-if="role=='cust'">
      <div class="card-body text-center">
      <div v-if="product.quantity!=0" >
      <div class="input-group mb-2">
      <input
        type="number"
        :id="'quantity-' + product.pname"
        class="form-control"
        placeholder="0"
        v-model="quantities[product.pname]"
      />
      <span class="input-group-text">{{ product.unit }}s</span>
    </div>
      <button type="button" class="btn btn-primary btn-block" @click="addToCart(product.pname)"> Add To Cart </button>
      </div>
      <div class="text-danger-emphasis fs-3 fw-bolder" v-if="product.quantity==0">OUT OF STOCK</div>
      </div>
      </div>
      </div>
      </div></div>
    </div>`
    ,

    data(){
        return{
        token: localStorage.getItem('auth-token'),
        role:localStorage.getItem('role'),
        categories: [],
        products:[],
        search:null,
        cname:null,
        minprice:null,
        maxprice:null,
        quantities: []

        }
    },

    methods:{
        async searchprod(){
            const res = await fetch('/api/search', {
                method: 'PUT',
                headers: {
                  'Authentication-Token': this.token,
                  'Content-Type': 'application/json',
                },
                body:
                    JSON.stringify({search: this.search,
                        cname: this.cname,
                        minprice: this.minprice,
                        maxprice: this.maxprice})
              })
              const data = await res.json()
              if (res.ok) {
                this.products = data
              } else {
                alert(data.message)
              }
        },
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

    async mounted() {
        const res = await fetch('/api/category', {
          headers: {
            'Authentication-Token': this.token,
          },
        })
        const data = await res.json()
        if (res.ok) {
          this.categories = data
        } else {
          alert(data.message)
        }
      },

    
}
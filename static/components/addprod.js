export default {
    template: `
      <div>
      <div class="d-flex justify-content-center">
      <div class="container mt-5">
      
        <div class="card p-5 bg-light">
          <h2 class="mb-3">{{ $route.params.cname }}: Add Product </h2>

          <div class="row g-3 align-items-center mb-3">
          <div class="col-md-5">
            <label for="pname" class="col-form-label">Product Name:</label>
          </div>
          <div class="col-auto">
            <input type="text" id="pname" class="form-control" v-model="pname" required>
          </div>
          </div>

          <div class="row g-3 align-items-center mb-3">
          <div class="col-md-5">
            <label for="mdate" class="col-form-label">Manufacture Date:</label>
          </div>
          <div class="col-auto">
            <input type="date" id="mdate" class="form-control" v-model="mdate">
          </div>
          </div>

          <div class="row g-3 align-items-center mb-3">
          <div class="col-md-5">
            <label for="edate" class="col-form-label">Expiry Date:</label>
          </div>
          <div class="col-auto">
            <input type="date" id="edate" class="form-control" v-model="edate" >
          </div>
          </div>

          <div class="row g-3 align-items-center mb-3">
          <div class="col-md-5">
            <label for="rate" class="col-form-label">Price:</label>
          </div>
          <div class="col-auto">
            <input type="number" id="rate" class="form-control" v-model="rate" min="0.25" step="0.25" required>
          </div>
          </div>

          
          <div class="row g-3 align-items-center mb-3">
          <div class="col-md-5">
            <label for="unit" class="col-form-label">Unit of measurement:</label>
          </div>
          <div class="col-auto">
          <select class="form-select" v-model="unit">
          <option value="unit"> per unit</option>
          <option value="kg"> per kg</option>
          <option value="l"> per litre</option>
          </select>
          </div>
          </div>
          
          <div class="row g-3 align-items-center mb-3">
          <div class="col-md-5">
            <label for="quantity" class="col-form-label">Quantity in Stock:</label>
          </div>
          <div class="col-auto">
            <input type="number" id="quantity" class="form-control" v-model="quantity" min="0.25" step="0.25" required>
          </div>
          </div>

          <div class="row g-3 align-items-center mb-3">
          <div class="col-md-5">
            <label for="desc" class="col-form-label">Description:</label>
          </div>
          <div class="col-auto">
            <input type="text" id="desc" class="form-control" v-model="desc">
          </div>
          </div>

          
          <div class="row g-3 align-items-center mb-3">
          <div class="col-md-5">
            <label for="link" class="col-form-label">Link for image:</label>
          </div>
          <div class="col-auto">
            <input type="text" id="link" class="form-control" v-model="link">
          </div>
          </div>

          <button type="button" class="btn btn-primary mt-3" @click="addProduct">Create</button>
      </div>
      </div></div></div>
  
      `,
  
    data() {
      return {
        token: localStorage.getItem('auth-token'),
        role:localStorage.getItem('role'),
        pname: "",
        mdate: null,
        edate: null,
        rate: "",
        unit: "",
        cname: this.$route.params.cname,
        quantity: "",
        desc: "",
        link: "",

      };
    },

    methods:{
        async addProduct(){
            const res = await fetch('/api/product', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authentication-Token': this.token,
                  
                },
                body: JSON.stringify({
                    pname: this.pname,
                    mdate: this.mdate,
                    edate: this.edate,
                    rate: this.rate,
                    unit: this.unit,
                    cname: this.cname,
                    quantity: this.quantity,
                    desc: this.desc,
                    link: this.link
                }),
              })

              const data = await res.json()
              this.msg = data.message
              if (res.ok) {
                this.$router.push({ path: `/view-products/${this.cname}` })
              } else {
                console.log(data.message)
              }
        }
    }
  

  };
  
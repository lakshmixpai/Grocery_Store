export default {
    template: `
      <div>
          <h2 class="mb-3"> Edit {{ $route.params.pname }} </h2>

          <h4 class="mb-3"> Current Details </h4>
            <div class="card mb-3 mt-3" style="max-width: 700px;">
            <div class="row g-3">
              <div class="col-md-4">
              <img :src="product.link" class="img-fluid rounded-start" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <ul class="list-group list-group-flush">
                  <li class="list-group-item">Price: {{ product.rate }}/{{product.unit}}</li>
                  <li class="list-group-item">Quantity in Stock: {{product.quantity}}</li>
                  <li class="list-group-item">Manufacturing Date: {{product.mdate}}</li>
                  <li class="list-group-item">Expiry Date: {{product.edate}}</li>
                  <li class="list-group-item">Description: {{product.desc}}</li>
                </ul>
                </div>
              </div>
            </div>
            </div>

        <h4 class="mb-3"> Edit Required Details: </h4>
          <div class="row g-3 align-items-center mb-3">
          <div class="col-auto">
            <label for="pname" class="col-form-label">Product Name:</label>
          </div>
          <div class="col-auto">
            <input type="text" id="pname" class="form-control" v-model="new_pname">
          </div>
          </div>

          <div class="row g-3 align-items-center mb-3">
          <div class="col-auto">
            <label for="cname" class="col-form-label">Category Name:</label>
          </div>
          <div class="col-auto">
            <input type="text" id="cname" class="form-control" v-model="cname">
          </div>
          </div>

          <div class="row g-3 align-items-center mb-3">
          <div class="col-auto">
            <label for="mdate" class="col-form-label">Manufacture Date:</label>
          </div>
          <div class="col-auto">
            <input type="date" id="mdate" class="form-control" v-model="mdate">
          </div>
          </div>

          <div class="row g-3 align-items-center mb-3">
          <div class="col-auto">
            <label for="edate" class="col-form-label">Expiry Date:</label>
          </div>
          <div class="col-auto">
            <input type="date" id="edate" class="form-control" v-model="edate">
          </div>
          </div>

          <div class="row g-3 align-items-center mb-3">
          <div class="col-auto">
            <label for="rate" class="col-form-label">Price:</label>
          </div>
          <div class="col-auto">
            <input type="number" id="rate" class="form-control" v-model="rate" min="0.25" step="0.25">
          </div>
          </div>

          
          <div class="row g-3 align-items-center mb-3">
          <div class="col-auto">
            <label for="unit" class="col-form-label">Unit of measurement:</label>
          </div>
          <div class="col-auto">
          <select class="form-select" v-model="unit">
          <option selected>Select unit</option>
          <option value="unit"> per unit</option>
          <option value="kg"> per kg</option>
          <option value="l"> per litre</option>
          </select>
          </div>
          </div>
          
          <div class="row g-3 align-items-center mb-3">
          <div class="col-auto">
            <label for="quantity" class="col-form-label">Quantity in Stock:</label>
          </div>
          <div class="col-auto">
            <input type="number" id="quantity" class="form-control" v-model="quantity" min="0.25" step="0.25">
          </div>
          </div>

          <div class="row g-3 align-items-center mb-3">
          <div class="col-auto">
            <label for="desc" class="col-form-label">Description:</label>
          </div>
          <div class="col-auto">
            <input type="text" id="desc" class="form-control" v-model="desc">
          </div>
          </div>

          
          <div class="row g-3 align-items-center mb-3">
          <div class="col-auto">
            <label for="link" class="col-form-label">Link for image:</label>
          </div>
          <div class="col-auto">
            <input type="text" id="link" class="form-control" v-model="link">
          </div>
          </div>

          <button type="button" class="btn btn-primary" @click="editProduct">Edit</button>
      </div>
      </div>
  
      `,
  
    data() {
      return {
        token: localStorage.getItem('auth-token'),
        role:localStorage.getItem('role'),
        pname: this.$route.params.pname,
        new_pname:null,
        mdate: null,
        edate: null,
        rate: null,
        unit: null,
        cname: null,
        quantity: null,
        desc: null,
        link: null,
        product: []

      };
    },


    async mounted() {
      const res = await fetch(`/api/get-product-det/${this.$route.params.pname }`, {
        method: 'GET',
        headers: {
          'Authentication-Token': this.token,
        },
      });
    
    const data = await res.json()
    
    if (res.ok) {
      this.product = data
      console.log(data.message)          
    } else {
      console.log(data.message)
    }

    },

    methods:{
        async editProduct(){
            const res = await fetch('/api/product', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authentication-Token': this.token,
                  
                },
                body: JSON.stringify({
                    pname: this.pname,
                    new_pname: this.new_pname,
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

              console.log(data)
              if (res.ok) {
                this.$router.push({ path: `'/manager-dashboard'`})
              } else {
                console.log(data.message)
              }
        }
    }
  

  };
  
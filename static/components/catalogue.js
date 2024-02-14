import catalogueprods from "./catalogueprods.js";

export default {
    template: `
    <div>
    <div class="mb-5 " v-for="category in categories">
    <div class="container mt-5">
    
    <div class="card mb-3 border-success" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-4">
          <img :src="category.link" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8 d-flex align-items-center">
          <div class="card-body text-center">
            <h1 class="card-text">{{category.cname}}</h1>
          </div>
        </div>
      </div>
    </div>
    <hr class="my-4">
    <catalogueprods :category="category.cname" />
    </div>
    </div>
  </div>
  
      
    `,

    data(){
      return{
        token: localStorage.getItem('auth-token'),
        role: localStorage.getItem('role'),
        categories: [],
      }
    },

    components:{
        catalogueprods
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

    };
  
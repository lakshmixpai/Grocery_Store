
import MgrCategories from './viewcats.js'
import CreateCat from './createcat.js' 

export default {
    template: `
    <div>
    <button @click='downlodResource' class="btn btn-primary mt-3">Download Product Details</button><span v-if='isWaiting'> Downloading </span>
    <CreateCat/>   

    <MgrCategories v-for="(category, index) in categories" :key="index" :category="category" />

    </div>
    `,
    data(){
        return{
        token: localStorage.getItem('auth-token'),
        categories: [],
        isWaiting: false,
        }
    },
    
    components:{
        MgrCategories,
        CreateCat
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

      methods: {
        async downlodResource() {
          this.isWaiting = true
          const res = await fetch('/download-csv')
          const data = await res.json()
          if (res.ok) {
            const taskId = data['task-id']
            const intv = setInterval(async () => {
              const csv_res = await fetch(`/get-csv/${taskId}`)
              if (csv_res.ok) {
                this.isWaiting = false
                clearInterval(intv)
                window.location.href = `/get-csv/${taskId}`
              }
            }, 1000)
          }
        },
      },
    }

import AdminActions from './adminactions.js'
import AdminCategories from './viewcats.js'
import CreateCat from './createcat.js' 

export default {
    template: `
    <div>
    <AdminActions />

    <CreateCat/>   

    <AdminCategories v-for="(category, index) in categories" :key="index" :category="category" />

    </div>
    `,
    data(){
        return{
        token: localStorage.getItem('auth-token'),
        categories: [],
        }
    },
    
    components:{
        AdminActions,
        AdminCategories,
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

}

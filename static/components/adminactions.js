export default {
    template: `
    <div>

    <div class="row row-cols-1 row-cols-md-3 g-4">
    
    <div class="col" v-if="countnotapproved != 0">
    <div class="card text-bg-light mb-3" style="max-width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Categories to Approve</h5>
        <div v-for="cat in cats">
          <div class="btn-group" role="group" v-if="!cat.approved">
            <p class="card-text">{{ cat.cname }}
            <button type="button" class="btn btn-success btn-sm" @click="catApprove(cat.cname)">Approve</button>
            <button type="button" class="btn btn-danger btn-sm" @click="catReject(cat.cname)">Reject</button>
            </p></div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="col" v-if="countnotedited != 0">
    <div class="card text-bg-light mb-3" style="max-width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Category Edits to Approve</h5>
        <div v-for="cat in cats">
          <div v-if="cat.new_cname !== null">
          <div class="btn-group" role="group">
            <p class="card-text">{{ cat.cname }} to {{cat.new_cname}}
            <button type="button" class="btn btn-success btn-sm" @click="catApproveEdit(cat.cname)">Approve</button>
            <button type="button" class="btn btn-danger btn-sm" @click="catRejectEdit(cat.cname)">Reject</button>
            </p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="col" v-if="countnotdeleted != 0">
    <div class="card text-bg-light mb-3" style="max-width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Category Deletes to Approve</h5>
        <div v-for="cat in cats">
          <div v-if="cat.del_req">
            <div class="btn-group" role="group">
            <p class="card-text">{{ cat.cname }}
            <button type="button" class="btn btn-success btn-sm" @click="catApproveDelete(cat.cname)">Approve</button>
            <button type="button" class="btn btn-danger btn-sm" @click="catRejectDelete(cat.cname)">Reject</button>
          </p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="col" v-if="countmgrnotapproved!= 0">
    <div class="card text-bg-light mb-3" style="max-width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">Managers to Approve</h5>
        <div v-for="user in mgrs">
            <div class="btn-group" role="group">
            <p class="card-text">{{ user.id }}. {{user.username}} 
            <button type="button" class="btn btn-success btn-sm" @click="mgrApprove(user.id)">Approve</button>
            <button type="button" class="btn btn-danger btn-sm" @click="mgrReject(user.id)">Reject</button>
            </p></div>
          </div>
        </div>
      </div>
    </div>
  

  </div>
  </div>

    
    `,

    data() {
      return {
        cats:[],
        mgrs:[],
        countnotapproved: 0,
        countnotedited: 0,
        countnotdeleted: 0,
        countmgrnotapproved: 0,
        role: localStorage.getItem('role'),
        token: localStorage.getItem('auth-token'),
      }
    },

    methods:{
      async catApprove(cname){
        const el = await fetch(`/api/approve-cat/${cname}`,{
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
          },
        })  
  
        const data = await el.json()
        
        if (el.ok) {
          console.log(data.message)
          this.$router.go(0)
        }
        else {
          console.log(data.message)
        }

      },
      async catReject(cname){
        const res = await fetch(`/api/reject-cat/${cname}`,{
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
          },
        })  
  
        const data = await res.json()
        if (res.ok) {
          console.log(data.message)
          this.$router.go(0)
        }
        else {
          console.log(data.message)
        }

      },

      async catApproveEdit(cname){
        const el = await fetch(`/api/approve-catedit/${cname}`,{
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
          },
        })  
  
        const data = await el.json()
        
        if (el.ok) {
          console.log(data.message)
          this.$router.go(0)
        }
        else {
          console.log(data.message)
        }

      },
      async catRejectEdit(cname){
        const res = await fetch(`/api/reject-catedit/${cname}`,{
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
          },
        })  
  
        const data = await res.json()
        if (res.ok) {
          console.log(data.message)
          this.$router.go(0)
        }
        else {
          console.log(data.message)
        }

      },


      async catApproveDelete(cname){
        const el = await fetch(`/api/approve-catdel/${cname}`,{
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
          },
        })  
  
        const data = await el.json()
        
        if (el.ok) {
          console.log(data.message)
          this.$router.go(0)
        }
        else {
          console.log(data.message)
        }

      },

      async catRejectDelete(cname){
        const res = await fetch(`/api/reject-catdel/${cname}`,{
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
          },
        })  
  
        const data = await res.json()
        if (res.ok) {
          console.log(data.message)
          this.$router.go(0)
        }
        else {
          console.log(data.message)
        }

      },

      async mgrApprove(uid){
        const el = await fetch(`/api/approve-mgrs/${uid}`,{
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
          },
        })  
  
        const data = await el.json()
        
        if (el.ok) {
          console.log(data.message)
          this.$router.go(0)
        }
        else {
          console.log(data.message)
        }

      },

      async mgrReject(uid){
        const res = await fetch(`/api/reject-mgrs/${uid}`,{
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
          },
        })  
  
        const data = await res.json()
        if (res.ok) {
          console.log(data.message)
          this.$router.go(0)
        }
        else {
          console.log(data.message)
        }

      },
    },

    async mounted() {
      const res = await fetch('/api/category', {
        method: 'GET',
        headers: {
          'Authentication-Token': this.token,
        },
      })  

      const data = await res.json().catch((e) => {})

      if (res.ok) {
        this.cats = data
        this.countnotapproved = this.cats.filter(cat => !cat.approved).length
        this.countnotedited = this.cats.filter(cat => cat.new_cname && cat.new_cname.trim() !== '').length
        this.countnotdeleted = this.cats.filter(cat => cat.del_req).length
        console.log(data)
      }
      else {
        console.log(data.message)
      }

      const res2 = await fetch('/api/get-unapproved-mgrs',{
        method: 'GET',
        headers: {
          'Authentication-Token': this.token,
        },
      })  

      const data2 = await res2.json()
      if (res2.ok) {
        this.mgrs = data2
        this.countmgrnotapproved = this.mgrs.length
      }
      else {
        console.log(data2.message)
      }

    }
  }
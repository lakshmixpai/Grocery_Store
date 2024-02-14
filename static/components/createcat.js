export default {
  template: `
    <div class="container mt-5">
      <div class="mb-4 h3">CATEGORIES</div>

      <form class="row g-2">
        <div class="col-md-4">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" placeholder="Category Name" v-model="new_cname" required>
            <label for="floatingInput">Enter Category Name</label>
          </div>
        </div>

        <div class="col-md-4">
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingLink" placeholder="Image Link" v-model="new_link">
          <label for="floatingLink">Category Image Link</label>
        </div>
      </div>

      <div class="col-md-4">
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingDesc" placeholder="Category Description" v-model="new_desc">
          <label for="floatingDesc">Enter Category Description</label>
        </div>
      </div>

        <div class="col-md-6">
          <button type="submit" class="btn btn-primary p-3" @click='createCategory' v-if="role=='admin'">Create</button>
          <button type="submit" class="btn btn-primary p-3" @click='createCategory' v-if="role=='mgr'">Request to Create</button>
        </div>
      </form>
      <hr class="my-4">
    </div>
  `,

  data() {
    return {
      token: localStorage.getItem('auth-token'),
      role: localStorage.getItem('role'),
      new_cname: null,
      new_link: null,
      new_desc: null
    };
  },

  methods: {
    async createCategory() {
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': this.token,
        },
        body: JSON.stringify({
          cname: this.new_cname,
          link: this.new_link,
          desc: this.new_desc
        }),
      });

      const data = await res.json();
      if (res.ok) {
        this.$router.go(0);
      } else {
        console.log(data.message);
      }
    },
  },
};

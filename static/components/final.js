export default {
    template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-6">
          <img src="https://i.ibb.co/84bmzRg/logo.png" alt="Grocery Shop Image" class="img-fluid border rounded" style="border-width: 4px;">
        </div>
        <div class="col-md-6">
          <h1 class="display-4">Thank you for Visiting Nourish Nook!</h1>
          <p>We appreciate your business and hope you enjoy the products you've selected. Our team is working diligently to prepare and deliver your order.</p>
          <p>Should you have any questions or concerns, feel free to reach out to our customer support team. We're here to assist you!</p>
          <div class="mt-4">

          <button @click="logout" class="btn btn-success ms-2">Logout and Return Home</button>

        </div>
      </div>
    </div>
  
    `,
    data() {
        return {
          role: localStorage.getItem('role'),
        }
      },
      methods: {
        logout() {
          localStorage.removeItem('auth-token')
          localStorage.removeItem('role')
          this.$router.push({ path: '/' })
        },
      },
    }
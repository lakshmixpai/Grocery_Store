export default {
    template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-6">
          <img src="https://i.ibb.co/84bmzRg/logo.png" alt="Grocery Shop Image" class="img-fluid border rounded" style="border-width: 4px;">
        </div>
        <div class="col-md-6">
          <h1 class="display-4">Welcome to Nourish Nook!</h1>
          <p class="lead">Feed Your Body, Fuel Your Spirit</p>
          <p>Discover a wide variety of fresh and healthy ingredients to nourish your body and soul.</p>
          <p>Join us on a journey to vibrant well-being!</p>
          <div class="mt-4">
          <router-link to="/login" class="btn btn-primary me-2">Login</router-link>
          <router-link to="/signup" class="btn btn-outline-primary">Sign Up</router-link>
       
        </div>
        </div>
      </div>
    </div>
  
    `,
  }
  
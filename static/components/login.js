export default {
    template: `<div>
    <form>
    <div class='d-flex justify-content-center mt-5'>
    <div class="mb-3 p-5 bg-light">
    <h2 class="mb-4">Login: Enter Your Details</h2>
    <div class="form-floating mb-3">
    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="det.email" required>
    <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating mb-3">
    <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="det.password" required>
    <label for="floatingPassword">Password</label>
    </div>
    
    <div class="text-danger mb-3" v-if="error">*{{error}}</div>

    <button type="submit" class="btn btn-primary btn-lg btn-block" @click='login'>Sign in</button>

    </div> 
    </div>
    </form>
    </div>
    `,

    data() {
        return {
            det: {
                email: "",
                password: "",
            },
            error: "",
        }
    },

    methods: {
        async login() {
            this.error = ""
            const res = await fetch('/api/ulogin',{
                method: 'POST',
                headers: {'Content-Type': 'application/json', },
                body: JSON.stringify(this.det)
            })

            const data = await res.json()

            if(res.ok){
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('role', data.role)
                if(data.role == 'admin'){this.$router.push({ path: '/admin-dashboard'})}
                else if(data.role == 'mgr'){this.$router.push({ path: '/manager-dashboard'})}
                else {this.$router.push({ path: '/catalogue'})}
            }
            else {this.error = data.message}


        }
    }


}
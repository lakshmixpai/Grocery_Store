export default {
    template: `
    <form>
    <div class='d-flex justify-content-center mt-5'>
    <div class="mb-3 p-5 bg-light">
    <h2 class="mb-4">Register: Enter Your Details</h2>
    <div class="form-check form-check-inline">
    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="cust" v-model="det.role" checked>
    <label class="form-check-label" for="inlineRadio1">Customer</label>
    </div>

    <div class="form-check form-check-inline">
    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="mgr" v-model="det.role">
    <label class="form-check-label" for="inlineRadio2">Store Manager</label>
    </div>

    <div class="form-floating mb-3">
    <input type="username" class="form-control" id="floatingUsername" placeholder="username" v-model="det.username" required>
    <label for="floatingUsername">Username</label>
    </div>
    
    <div class="form-floating mb-3">
    <input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com" v-model="det.email" required>
    <label for="floatingEmail">Email address</label>
    </div>

    <div class="form-floating mb-3">
    <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="det.password" required>
    <label for="floatingPassword">Password</label>
    
    <div id="passwordHelpBlock" class="form-text">
    Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
    </div>
    </div>

    <div class="text-danger mb-3" v-if="error">*{{error}}</div>

    <button type="submit" class="btn btn-primary btn-lg btn-block" @click='register'>Sign up</button>

    </div> 
    </div>
    </form>
    `,

    data() {
        return {
            det: {
                username: "",
                email: "",
                password: "",
                role:"cust"
            },
            error: "",
        }
    },

    methods: {
        async register() {
            const res = await fetch('/api/uregister',{
                method: 'POST',
                headers: {'Content-Type': 'application/json', },
                body: JSON.stringify(this.det)
            })

            const data = await res.json()
            
            if(res.ok){
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('role', data.role)
                if(data.role == 'cust'){this.$router.push({ path: '/catalogue'})}
                else if(data.role == 'mgr'){this.$router.push({ path: '/login'})}
            }
            else {this.error = data.message}


        }
    }


}
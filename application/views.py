from flask import jsonify, request
from flask import render_template
from flask import current_app as app, send_file
from .models import *
from flask_restful import reqparse, fields, marshal
from flask_security import auth_required, roles_required
from sqlalchemy import or_
from .sec import datastore
from flask_bcrypt import Bcrypt 
from flask_restful import  marshal, fields
from application.sec import datastore
from .tasks import *
import flask_excel as excel
from celery.result import AsyncResult



bcrypt = Bcrypt(app) 

@app.get('/')
def home():
    return render_template("index.html")

@app.post('/api/uregister')
def uregister():
    det = request.get_json()

    (username,email,password, role) = (det.get("username"),det.get("email"),det.get("password"), det.get("role"))
    
    if not email or not username or not password:
        return jsonify({"message":"All details not entered"}), 400

    if datastore.find_user(email=email):
        return jsonify({"message":"User already exists"}), 404
    
    if role == "cust":
        datastore.create_user(username=username, email=email, password = bcrypt.generate_password_hash(password),roles=["cust"])
        status = VisitBought(email = email, visit = True)
        db.session.add(status)
    else: 
        datastore.create_user(username=username, email=email, password = bcrypt.generate_password_hash(password),roles=["cust"], active = False)
    db.session.commit()

    user = datastore.find_user(email=email)

    return jsonify({"token": user.get_auth_token(), "email": email, "role": user.roles[0].name})


@app.post('/api/ulogin')
def ulogin():
    det = request.get_json()

    (email,password) = (det.get("email"),det.get("password"))
    
    if not email:
        return jsonify({"message":"Email not provided"}), 400
    
    if not password:
        return jsonify({"message":"Password not provided"}), 400
    
    user =  datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User not found"}), 404
    
    if bcrypt.check_password_hash(user.password, password):
        status = VisitBought.query.filter_by(email = email)
        status.visit = True
        db.session.commit()
        return jsonify({"token": user.get_auth_token(), "email": email, "role": user.roles[0].name}), 200

    else:
        return jsonify({"message": "Wrong Password"}), 400
    
product_fields = {
    'pid': fields.Integer,
    'pname': fields.String,
    'mdate': fields.DateTime(dt_format='iso8601'),
    'edate': fields.DateTime(dt_format='iso8601'),
    'rate': fields.Integer,
    'unit': fields.String,
    'cname': fields.String,
    'quantity': fields.Float,
    'desc': fields.String,
    'link': fields.String,
}

@auth_required("token")
@app.get('/api/get-products/<cname>')
def getprods(cname):
    prods = Product.query.filter_by(cname = cname).all()
    return marshal(prods, product_fields)

@auth_required("token")
@app.get('/api/get-product-det/<pname>')
def getproddet(pname):
    prod = Product.query.filter_by(pname = pname).first()
    return marshal(prod, product_fields)

user_fields = {
    "id": fields.Integer,
    "username": fields.String,
}

@auth_required("token")
@roles_required("admin")
@app.get('/api/get-unapproved-mgrs')
def getunappmgrs():
    users = User.query.filter_by(active = False).all()
    if users:
        return marshal(users, user_fields)
    else:
        return jsonify({"message": "No users found"}), 404

@auth_required("token")
@roles_required("admin")
@app.put('/api/approve-mgrs/<int:user_id>')
def appmgrs(user_id):
    user = datastore.find_user(id=user_id)
    if user:
        user.active = True
        db.session.commit()
        return jsonify({"message": "Approved"})
    else:
        return jsonify({"message": "User not found"}), 404
    
@auth_required("token")
@roles_required("admin")
@app.put('/api/approve-cat/<cname>')
def appcat(cname):
    cat = Category.query.filter_by(cname = cname).first()
    if cat:
        cat.approved = True
        db.session.commit()
        return jsonify({"message": "Approved"})
    else:
        return jsonify({"message": "Category not found"}), 404

@auth_required("token")
@roles_required("admin")
@app.put('/api/approve-catedit/<cname>')
def appcatedit(cname):
    cat = Category.query.filter_by(cname = cname).first()
    if cat:
        cat.cname = cat.new_cname
        cat.new_cname = None
        db.session.commit()
        return jsonify({"message": "Category Edit Approved"})
    else:
        return jsonify({"message": "Category Edit Not Possible"}), 404
    
@auth_required("token")
@roles_required("admin")
@app.put('/api/approve-catdel/<cname>')
def appcatdel(cname):
    cat = Category.query.filter_by(cname = cname).first()
    if cat:
        db.session.delete(cat)
        db.session.commit()
        return jsonify({"message": "Category Delete Approved"})
    else:
        return jsonify({"message": "Category Delete Not Possible"}), 404
    
@auth_required("token")
@roles_required("admin")
@app.put('/api/reject-mgrs/<int:user_id>')
def rejmgrs(user_id):
    user = datastore.find_user(id=user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Manager Rejected"})
    else:
        return jsonify({"message": "Manager Rejection Not Possible"}), 404

@auth_required("token") 
@roles_required("admin")
@app.put('/api/reject-cat/<cname>')
def rejcat(cname):
    cat = Category.query.filter_by(cname = cname).first()
    if cat:
        db.session.delete(cat)
        db.session.commit()
        return jsonify({"message": "Category Rejected"})
    else:
        return jsonify({"message": "Category Rejection Not Possible"}), 404

@auth_required("token")
@roles_required("admin")
@app.put('/api/reject-catedit/<cname>')
def rejcatedit(cname):
    cat = Category.query.filter_by(cname = cname).first()
    if cat:
        cat.new_cname = None
        db.session.commit()
        return jsonify({"message": "Category Edit Rejected"})
    else:
        return jsonify({"message": "Category Edit Rejection Not Possible"}), 404
    
@auth_required("token")
@roles_required("admin")
@app.put('/api/reject-catdel/<cname>')
def rejcatdel(cname):
    cat = Category.query.filter_by(cname = cname).first()
    if cat:
        cat.del_req = False
        db.session.commit()
        return jsonify({"message": "Category Delete Rejected"})
    else:
        return jsonify({"message": "Category Delete Rejection Not Possible"}), 404
    
search_parser = reqparse.RequestParser()
search_parser.add_argument('search', type=str)
search_parser.add_argument('cname', type=str)
search_parser.add_argument('minprice', type=float)
search_parser.add_argument('maxprice', type=float)

@auth_required("token")
@app.put('/api/search')
def scat():
        args = search_parser.parse_args()
        search = args.get("search")
        cname = args.get("cname")
        minprice = args.get("minprice")
        maxprice = args.get("maxprice")

        prods_query = Product.query

        if search:
            prods_query = prods_query.filter(or_(Product.cname.like(f'%{search}%'), Product.pname.like(f'%{search}%')))       
        if cname:
            prods_query = prods_query.filter_by(cname=cname)
        if minprice:
            prods_query = prods_query.filter(Product.rate >= minprice)
        if maxprice:
            prods_query = prods_query.filter(Product.rate <= maxprice)

        products = prods_query.all()
        if len(products) > 0:
            return marshal(products, product_fields)
        return jsonify({"message": "No Products Found"}), 404


@app.get('/download-csv')
def download_csv():
    task = export_products_to_csv.delay()
    return jsonify({"task-id": task.id})


@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True, download_name='prod.csv', mimetype='text/csv')
    else:
        return jsonify({"message": "Task Pending"}), 404
    


from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, roles_accepted,current_user
from datetime import datetime
from flask import jsonify
from .models import *
from .database import db
from decimal import Decimal
from .instances import cache

api = Api(prefix ='/api')

cat_parser = reqparse.RequestParser()
cat_parser.add_argument('cname', type=str, required = True)
cat_parser.add_argument('new_cname', type=str)
cat_parser.add_argument('link', type=str)
cat_parser.add_argument('desc', type=str)

category_fields = {
    'cname': fields.String,
    'approved': fields.Boolean,
    'new_cname': fields.String,
    'del_req': fields.Boolean,
    'link': fields.String,
}

class Categories(Resource):
    @auth_required("token")
    @cache.cached(timeout=60)
    def get(self):
        if current_user.has_role("admin"):
            categories = Category.query.all()
        else:
            categories = Category.query.filter_by(approved = True).all()
        if len(categories) > 0:
            return marshal(categories, category_fields)
        else:
            return {"message": "No Categories Added Yet"}, 404

    @auth_required("token")
    @roles_accepted("admin","mgr")    
    def post(self):
        cache.clear()
        args = cat_parser.parse_args()
        cname = args.get("cname")
        desc = args.get("desc")
        link= args.get("link")

        if Category.query.filter_by(cname = cname, approved = True).first(): 
            return {"message": "Category Already Exists"}, 400
        
        elif Category.query.filter_by(cname = cname, approved = False).first():
            return {"message": "Category Not Approved Yet"}, 400
            
        else:
            if current_user.has_role("mgr"):
                cat = Category(cname=cname,desc = desc, link=link,approved = False)
            else:
                cat = Category(cname=cname,desc = desc, link=link,approved = True)
            
            db.session.add(cat)
            db.session.commit()
            if current_user.has_role("mgr"):        
                return {"message": "Category Creation Requested"}, 201    
            return {"message": "Category Created"}, 201
            
    
    @auth_required("token")
    @roles_accepted("admin","mgr")    
    def delete(self):
        cache.clear()
        args = cat_parser.parse_args()
        cname = args.get("cname")
        print(cname)
        cat = Category.query.filter_by(cname = cname).first()

        if cat:
            if current_user.has_role("mgr"):
                cat.del_req = True
                db.session.commit()
                return {"message": "Category Deletion Requested"}
            prods = Product.query.filter_by(cname = cname)
            for prod in prods:
                db.session.delete(prod)
            db.session.delete(cat)
            db.session.commit()

            return {"message": "Category Deleted"}
        
        return {"message": "Category Not Found"}, 404

    @auth_required("token")
    @roles_accepted("admin","mgr") 
    def put(self):
        cache.clear()
        args = cat_parser.parse_args()
        cname = args.get("cname")
        new_name = args.get("new_cname")

        new_cat_check = Category.query.filter_by(cname=new_name).first()

        cat = Category.query.filter_by(cname = cname).first()
        products = Product.query.filter_by(cname=cname).all()

        if new_cat_check is None:
            if current_user.has_role("mgr"):
                cat.new_cname = new_name
                db.session.commit()
                return jsonify({"message": "Category Edit Requested"})
            
           
            for product in products:
                product.cname = new_name
            cat.cname = new_name
            db.session.commit()

            return jsonify({"message": "Category Edited Successfully"})

        return jsonify({"message": "Category Already Exists"}), 400

prod_parser = reqparse.RequestParser()
prod_parser.add_argument('pname', type=str, required=True)
prod_parser.add_argument('new_pname', type=str)
prod_parser.add_argument('mdate', type=lambda s: datetime.strptime(s, '%Y-%m-%d') )
prod_parser.add_argument('edate', type=lambda s: datetime.strptime(s, '%Y-%m-%d') )
prod_parser.add_argument('rate', type=int)
prod_parser.add_argument('unit', type=str)
prod_parser.add_argument('cname', type=str)
prod_parser.add_argument('quantity', type=float)  
prod_parser.add_argument('desc', type=str)
prod_parser.add_argument('link', type=str)

product_fields = {
    'pname': fields.String,
    'mdate': fields.DateTime(dt_format='%Y-%m-%d'),
    'edate': fields.DateTime(dt_format='%Y-%m-%d'), 
    'rate': fields.Integer,
    'unit': fields.String,
    'cname': fields.String,
    'quantity': fields.Float,  
    'desc': fields.String,
    'link': fields.String,
    'del_req': fields.Boolean,
}

class Products(Resource):
    @auth_required("token")
    @cache.cached(timeout=60)
    def get(self):
        products = Product.query.all()

        if len(products) > 0:
            return marshal(products, product_fields)
        else:
            return {"message": "No Products Added Yet"}, 
        

    @auth_required("token")
    @roles_required("mgr")    
    def post(self):
        cache.clear()
        args = prod_parser.parse_args()
        pname = args.get("pname")
        mdate = args.get("mdate")
        edate = args.get("edate")
        rate = args.get("rate")
        unit = args.get("unit")
        cname = args.get("cname")
        quantity = args.get("quantity")
        desc = args.get("desc")
        link = args.get("link")
    
        if Product.query.filter_by(pname = pname).first(): 
            return {"message": "Product Already Exists"}, 400
        
        else:
            prod = Product(pname = pname,link = link, mdate = mdate, edate = edate,rate = rate, unit = unit, quantity = quantity,desc = desc,cname = cname)
            db.session.add(prod)
            db.session.commit()
   
            return {"message": "Product Created"}, 201
    
    @auth_required("token")
    @roles_required("mgr") 
    def put(self):
        cache.clear()
        args = prod_parser.parse_args()
        pname = args.get("pname")
        new_pname = args.get("new_pname")
        new_mdate = args.get("mdate")
        new_edate = args.get("edate")
        new_rate = args.get("rate")
        new_unit = args.get("unit")
        new_cname = args.get("cname")
        new_quantity = args.get("quantity")
        new_desc = args.get("desc")
        new_link = args.get("link")

        prod = Product.query.filter_by(pname = pname).first()
        new_prod_check = Product.query.filter_by(pname = new_pname).first()
        if new_prod_check is None:
            if new_pname:
                prod.pname = new_pname
            if new_link:
                prod.link = new_link
            if new_desc:
                prod.desc = new_desc
            if new_cname:     
                prod.cname = new_cname
            if new_mdate:
                prod.mdate = new_mdate
            if new_edate:
                prod.edate = new_edate
            if new_rate:
                prod.rate = new_rate
            if new_unit:
                prod.unit = new_unit
            if new_quantity:
                prod.quantity = new_quantity
            db.session.commit()

            return {"message": "Product Edited Successfully"}

        return {"message": "Product Already Exists"}, 400
    
    @auth_required("token")
    @roles_accepted("mgr")    
    def delete(self):
        cache.clear()
        args = prod_parser.parse_args()
        pname = args.get("pname")
        
        prod = Product.query.filter_by(pname = pname).first()

        if prod: 
            db.session.delete(prod)
            db.session.commit()
            return {"message": "Product Deleted"}
        
        return {"message": "Product Not Found"}, 404

cart_parser = reqparse.RequestParser()
cart_parser.add_argument('pname', type=str, required=True)
cart_parser.add_argument('quantity', type=str)  

cart_fields = {
    'pname': fields.String,
    'quantity': fields.Float,  
    'price': fields.Float,
}



class CartDet(Resource):
    @auth_required("token")
    @roles_required("cust")
    @cache.cached(timeout=60)
    def get(self):
        cart_prods = Cart.query.all()

        if len(cart_prods) > 0:
            cart_data = []

            for cart_prod in cart_prods:
                product = Product.query.filter_by(pname=cart_prod.pname).first()
                if product:
                    cart_data.append({
                        'pname': cart_prod.pname,
                        'quantity': cart_prod.quantity,
                        'price': cart_prod.price,
                        'link': product.link,
                        'unit': product.unit
                    })

            return jsonify(cart_data)
        else:
            return {"message": "No Products Added Yet"}, 404


    @auth_required("token")
    @roles_required("cust")
    def post(self):
        cache.clear()
        args = prod_parser.parse_args()
        pname = args.get("pname")
        quant = args.get("quantity")

        prod = Product.query.filter_by(pname = pname).first()
        if quant:
            if prod:
                cache.clear()
                cart_item_check = Cart.query.filter_by(pname = pname).first()
                if cart_item_check and prod.quantity >= cart_item_check.quantity + Decimal(quant): 
                    cart_item_check.quantity = cart_item_check.quantity + Decimal(quant)
                    cart_item_check.price = cart_item_check.quantity*prod.rate
                    db.session.commit()
                    return {"message": "Added to cart"}

                elif float(prod.quantity) >= quant:
                    cart_item = Cart(pname = prod.pname, quantity = quant, price = quant*prod.rate)
                    db.session.add(cart_item)
                    db.session.commit()
                    return {"message": "Added to cart"}
                return {"message": "Quantity Not Available"}, 400 
            return {"message": "Product Not Found"}, 404
        return {"message": "Quantity is Null"}, 400
    
    @auth_required("token")
    @roles_required("cust")
    def put(self):
        cache.clear()
        args = prod_parser.parse_args()
        pname = args.get("pname")
        quant = args.get("quantity")

        prod = Product.query.filter_by(pname = pname).first()
        if quant:
            if prod:
                cart_item_check = Cart.query.filter_by(pname = pname).first()
                if prod.quantity >= Decimal(quant): 
                    cart_item_check.quantity = Decimal(quant)
                    cart_item_check.price = quant*prod.rate
                    db.session.commit()
                    return {"message": "Quantity Updated"}
                return {"message": "Quantity Not Available"}, 400 
            return {"message": "Product Not Found"}, 404
        return {"message": "Quantity is Null"}, 400
    
    

    @auth_required("token")
    @roles_required("cust")
    def delete(self):
        cache.clear()
        cart_items = Cart.query.all()

        for cart_item in cart_items:
            order_item = Orders(email = current_user.email,pname = cart_item.pname, quantity = cart_item.quantity, price = cart_item.price )
            db.session.add(order_item)
            product = Product.query.filter_by(pname = cart_item.pname).first()
            product.quantity -= cart_item.quantity
            db.session.delete(cart_item)

        db.session.commit()
        return {"message": "Cart Cleared"}

api.add_resource(Categories, '/category')
api.add_resource(Products, '/product')
api.add_resource(CartDet, '/cart')


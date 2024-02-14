from application.database import db
from application.models import Role
from app import app
from application.sec import datastore
from application.views import bcrypt

with app.app_context():
    datastore.find_or_create_role(name="admin", description="User is an admin")
    datastore.find_or_create_role(name="mgr", description="User is a store manager")
    datastore.find_or_create_role(name="cust", description="User is a customer")
    db.session.commit()

    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(email="admin@email.com", password=bcrypt.generate_password_hash("admin"), roles=["admin"])
    
    if not datastore.find_user(email="mgr1@email.com"):
        datastore.create_user(email="mgr1@email.com", password=bcrypt.generate_password_hash("mgr1"), roles=["mgr"])

    try:
        db.session.commit()
    except:
        pass
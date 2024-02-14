from .database import db
from flask_security import UserMixin, RoleMixin

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, unique = True,primary_key = True,nullable = False,autoincrement = True)
    username = db.Column(db.String)
    email = db.Column(db.String,nullable = False, unique=True)
    password = db.Column(db.String(255),nullable = False)
    active = db.Column(db.Boolean)
    fs_uniquifier = db.Column(db.String(255),unique=True, nullable = False)
    roles = db.relationship('Role', secondary='roles_users',backref=db.backref('users', lazy='dynamic'))

class VisitBought(db.Model):
    __tablename__ = 'visit'
    email = db.Column(db.String,nullable = False, unique=True, primary_key = True)
    visit = db.Column(db.Boolean, default = False)

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer, unique = True,primary_key = True,nullable = False,autoincrement = True)
    name = db.Column(db.String, unique = True,nullable = False)
    description = db.Column(db.String,nullable = False)

class Product(db.Model):
    __tablename__ = 'products'
    pid = db.Column(db.Integer, unique = True,primary_key = True,nullable = False)
    pname = db.Column(db.String,nullable = False, unique = True)
    mdate = db.Column(db.Date)
    edate = db.Column(db.Date)
    rate = db.Column(db.Integer,nullable = False)
    unit = db.Column(db.String,nullable = False)
    cname = db.Column('cname',db.String(255), db.ForeignKey('category.cname'))
    quantity = db.Column(db.Numeric,nullable = False)
    desc = db.Column(db.String)
    link = db.Column(db.String)

class Category(db.Model):
    __tablename__ = 'category'
    cname = db.Column(db.String(255),unique = True,primary_key = True,nullable = False)
    approved = db.Column(db.Boolean(), default=True)
    new_cname = db.Column(db.String(255), default = None)
    del_req = db.Column(db.Boolean(), default=False)
    desc = db.Column(db.String)
    link = db.Column(db.String)

class Cart(db.Model):
    __tablename__ = 'cart'
    pname = db.Column(db.String,nullable = False,primary_key = True)
    quantity = db.Column(db.Numeric(precision=10, scale=2),nullable = False)
    price = db.Column(db.Numeric(precision=10, scale=2))

class Orders(db.Model):
    __tablename__ = 'order'
    id = db.Column(db.Integer, unique = True,primary_key = True,nullable = False, autoincrement = True)
    email = db.Column(db.String,nullable = False)
    pname = db.Column(db.String,nullable = False)
    quantity = db.Column(db.Numeric(precision=10, scale=2),nullable = False)
    price = db.Column(db.Numeric(precision=10, scale=2),nullable = False)
    
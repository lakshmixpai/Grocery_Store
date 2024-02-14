from celery import shared_task
from .models import *
import flask_excel as excel
from jinja2 import Template
from .sec import datastore
from .mail import send_email

@shared_task(ignore_result=False)
def export_products_to_csv():
        products = Product.query.all()
        csv_output = excel.make_response_from_query_sets(query_sets=products, column_names=["pid","pname","mdate","edate","rate","unit","cname","quantity",'desc','link'], file_type='csv')
        filename = 'product_export.csv'
        with open(filename, 'wb') as f:
            f.write(csv_output.data)

        return filename

@shared_task(ignore_result=False)
def monthly_report():
    template_str = """
        <div class="container">
        <p>
            Hi {{ user_name }},
        </p>
        <p class="message">
            We have loved having you as a part of the Nourish Nook family! 
        </p>
        <p class="message">
            Here are all your order details! If you find any discrepancies, let us know.
            Hope you have had a good time too!
        </p>
         <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {% for order in orders %}
                <tr>
                    <td>{{ order.pname }}</td>
                    <td>{{ order.quantity }}</td>
                    <td>${{ order.price }}</td>
                </tr>
                {% endfor %}
            </tbody>
        </table>

        <p class="message">
            Total Expenditure: ${{ total }}
        </p>

        <p class="closing">
            Best Wishes,
            <br>
            The Team
        </p>
        </div>
        
        """
    users=User.query.all()
    for user in users:
        if user.has_role("cust"):    
            template = Template(template_str)
            address = user.email
            subject = "Your month with us!"
            orders = Orders.query.filter_by(email = user.email).all()

            total = 0
            for order in orders:
                total += order.price

            message = template.render(username = user.username, orders = orders, total = total)

            send_email(address,subject,message)



@shared_task(ignore_result=False)
def daily_reminder():
    template_str = """
        <div class="container">
        <p>
            Hi {{ user_name }},
        </p>
        <p class="message">
            We noticed you haven't visited today, and we wanted to send a friendly reminder that you're missed here.
        </p>
        <p class="message">
            Whenever you have a moment, we'd love to see you again. Your presence brightens up our day!
        </p>
        <p class="closing">
            Best Wishes,
            <br>
            The Team
        </p>
        </div>
        """
    
    users=VisitBought.query.all()
    for user in users:
        if not user.visit:
            user_det = datastore.find_user(email = user.email)
            template = Template(template_str)
            address = user_det.email
            subject = f"We miss you {user_det.username}!"
            message = template.render(username = user_det.username)
            
            send_email(address,subject,message)
            user.visit=False
            db.session.commit()
    

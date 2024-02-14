# Grocery_Store
Project for Modern App Development 2 -IITM BS Degree in Data Science and Applications

## Description
The grocery store multi-user app is tailored for both buying and selling groceries, allowing users to conveniently purchase a variety of products across one or multiple sections. In addition, the admin possesses the capability to enhance the app by adding new categories and editing the same. The store manager can add new products in each category and suggest changes in categories. 

## Technologies Used:
* Python: Primarily used for developing controllers and serving as the host programming language for the application.
* Vue.js: Employed for developing the front-end of the application.
* HTML: Responsible for constructing the required Vue components and templates.
* CSS: Utilized for styling the web pages, ensuring an aesthetically pleasing and user-friendly interface.
* Bootstrap: Integrated to enhance the front-end, providing an appealing design and improved navigation.
* SQLite: Serves as the database for the application.
* Flask: Acts as the web framework for the application.
* Flask-Restful: Used for developing the RESTful API.
* Flask-SQLAlchemy: Employed to access and modify the application's SQLite database.
* Flask-Celery: Utilized for handling asynchronous background jobs in the backend.
* Flask-Caching: Implemented for caching API outputs, thereby increasing performance.
* Redis: Used as an in-memory database for the API cache and as a message broker for Celery.
* Git: Responsible for version control.

## Architecture
The architectural design adheres to a client-server model, utilizing Vue.js as the front-end framework and Python-Flask as the back-end framework. Vue.js takes charge of the presentation layer and oversees user interactions through its MVVM architecture. On the other hand, Python-Flask manages server-side logic, including handling HTTP requests and responses, managing asynchronous tasks, and facilitating interactions with the database.

The core functionalities are:
* User signup and login (using RBAC)
* Mandatory Admin Login (using RBAC)
* Store Manager Signup and Login (using RBAC)
* Category Management
* Product Management
* Search for Category/Product
* Buy products from one or multiple Categories
* Daily Reminder Jobs
* Scheduled Job - Monthly Activity Report
* User Triggered Async Job - Export as CSV

## Instructions for running the application

1. Clone the repo
2. Navigate to the root folder of the application
3. Open terminals for the following commands in order:
    * redis-server
    * mailhog
    * python main.py
    * celery -A app:celery_app worker --pool=solo -l info
    * celery -A app:celery_app beat -l INFO
The app can then be accessed from your web browser at http://localhost:3000


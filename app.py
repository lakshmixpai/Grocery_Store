import os
from flask import Flask
from application.config import Config
from flask_security import Security
from application.database import db
from application.models import *
from application.resources import api
from application.sec import datastore
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import *
from application.instances import cache


def create_app():
    app = Flask(__name__)
    app.secret_key = "myapp"
    app.config.from_object(Config)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    cache.init_app(app)
    app.security = Security(app, datastore, register_blueprint=False)
    with app.app_context():
        import application.views
        db.create_all()

    return app

app = create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(day_of_month='30', hour=18, minute=58), 
        monthly_report.s(), 
        name='Monthly Analytics Report'
    )
    sender.add_periodic_task(
        crontab(hour=18, minute= 58),

        daily_reminder.s(),
        name="Daily Reminder"
    )

if __name__ == "__main__":
    app.run()

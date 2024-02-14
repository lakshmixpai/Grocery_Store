import os
#from zoneinfo import ZoneInfo
basedir=os.path.abspath(os.path.dirname(__file__))

class Config():
    SQLITE_DB_DIR=os.path.join(basedir, "../database_dir")
    SQLALCHEMY_DATABASE_URI="sqlite:///"+os.path.join(SQLITE_DB_DIR, "database.sqlite3")
    DEBUG=True
    SECURITY_PASSWORD_SALT = "mysecureapp"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'

    CACHE_TYPE= "RedisCache"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_URL= 'redis://localhost:6379/3'
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 3
    CACHE_DEFAULT_TIMEOUT= 300

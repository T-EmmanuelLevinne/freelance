# Server Configuration
HOST = '0.0.0.0'
DEBUG = True

# Admin credentials (should be set via environment variables in production)
import os
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin_elmer")
ADMIN_PASSWORD_HASH = os.environ.get("ADMIN_PASSWORD_HASH", "$2b$12$AkODLlBB1AZe8z2JwIcNluvgOgs6d7cJ2SZDVzPn6ZZh8JTqHbJH.").encode("utf-8") 
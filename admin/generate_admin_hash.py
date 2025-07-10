import bcrypt

# Set your admin username and password here
admin_username = "admin_elmer"
admin_password = "elmeradmin09306335273"

# Generate salt and hash
salt = bcrypt.gensalt()
hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), salt)

print("Store these securely in your backend/database:")
print("Admin Username:", admin_username)
print("Admin Password Hash:", hashed_password.decode()) 
#!/bin/bash
# Script khởi tạo PostgreSQL cho VinFast

# Tạo database
sudo -u postgres createdb vinfast

# Tạo user
sudo -u postgres createuser -P vinfast_user

# Cấp quyền
sudo -u postgres psql -c "ALTER ROLE vinfast_user WITH CREATEDB;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vinfast TO vinfast_user;"

echo "✅ PostgreSQL database đã tạo thành công!"
echo "Database: vinfast"
echo "User: vinfast_user"
echo "Password: (enter your password)"

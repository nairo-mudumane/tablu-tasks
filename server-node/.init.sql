-- Optional: Create application-specific user
CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'app_password';
GRANT ALL PRIVILEGES ON my_app.* TO 'app_user'@'%';
FLUSH PRIVILEGES;
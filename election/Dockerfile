# Use Nginx to serve static content
FROM nginx:alpine

# Copy static files to the Nginx html directory
COPY . /usr/share/nginx/html

# Cloud Run requires port 8080
EXPOSE 8080

# Update Nginx to listen on port 8080 (Cloud Run requirement)
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

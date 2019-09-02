---
layout: [post, post-xml]              
title:  "Deploy Keras models to production level easily"        
date:   2019-08-27 10:00                                
author: s-gbz
categories: [Softwareentwicklung]                    
tags: [Keras, TensorFlow, Flask, Docker, Deep Learning, Künstliche Intelligenz]
---
Moving your Deep Learning models from the developers playground to serious production stage can be a hard feat to accomplish.
After endless research I'm most glad to proudly serve you an easy to execute guide for deploying Keras models to production level.

# Tools for success: Flask, WSGI, Docker, Nginx
This tutorial makes use of a Server running CentOs 7.5 but you can use any UNIX distribution you prefer.

## Making our model accessible to requests

### Flask
Flask is a lightweight web framework.
**Flask does not scale with rising request loads and hence is not production ready by default.**

## Making our server scaleable 
To solve this problem we make us of gevent - a coroutine-based concurrency library for Python.
[WSGI](https://www.fullstackpython.com/wsgi-servers.html)

# Dockerize the application
We use Docker to guarantee equal execution conditions on all systems.  

```Dockerfile
FROM python:3

WORKDIR /usr/src/app/uploads

WORKDIR /usr/src/app

RUN pip install Werkzeug Flask flask-cors numpy Keras gevent pillow h5py tensorflow

WORKDIR /usr/src/app/models

COPY models .

WORKDIR /usr/src/app/facenality-frontend

COPY facenality-frontend .

WORKDIR /usr/src/app

COPY app.py .

CMD [ "python" , "app.py"]
```

Imagine every command as a seperate layer.
Consequent builds can be significantly fastened up if unchanged layers are reused from previous builds, while modified files are pushed on top.

## Docker-compose
Docker-compose allows us to have a static IP when we serve our image.
We use the specified address to enable a proxy pass via nginx. 

```yml
version: '3.3'
services:
 facenality:
   container_name: facenality
   image: facenality
   restart: always
   networks:
     facenality-net:
       ipv4_address: 172.16.239.10

networks:
 facenality-net:
   driver: bridge
   ipam:
     driver: default
     config:
       - subnet: 172.16.239.0/24
```     

# Preparing nginx
"NGINX is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more." - From the official nginx glossar. 

Follow [this instructions ](https://linuxize.com/post/how-to-install-nginx-on-centos-7/) to install nginx.
Use `sudo` and your favorite editor to open `/etc/nginx/nginx.conf`.
Copy and adapt the configuration file as following:

```bash
events { }

http {
    server {
	    ssl_certificate /path/to/your/cert.pem;        
        ssl_certificate_key /path/to/your/private/key.pem;
        listen 443 ssl;
        client_max_body_size 15M;

	    location / { 
            proxy_pass                          http://172.16.239.10:5000;
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;  
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        }
    }

    server {
        listen 80 default_server;
        return 301 https://$host$request_uri;
    }
}
```

`events { }` is a mandatory part of the configuration that we'll leave blank since we have no use for it.
Instead we'll focus on the `http` block containing our `server` rules.

## nginx - Establishing a secure connection
Enabling a secure connection between server and client requires encryption from the server side.
`ssl_certificate` and `ssl_certificate_key` provide such service -
specify the paths to your cert and key files in this parameter.
`listen 443 ssl` orders the server to use port 443 for our newly established secure connection.
Lastly we specify the `client_max_body_size` parameter and allow attached files to be up to 15 megabytes big.

## nginx - Hiding the port
To avoid port exposure we use the nginx reverse proxy capabilities.
Our application is running on port 5000.
HTTPS is set to port 443 by default.
The command block `location /` sets up a proxy that redirects such traffic to our dockerized application via `proxy_pass`.
Note that we use the static IP `http://172.16.239.10:5000` defined in the previous docker-compose file.
We need to specify `proxy_set_header Host`, because we're switching ports here.
Read [this guide](https://www.digitalocean.com/community/tutorials/understanding-nginx-http-proxying-load-balancing-buffering-and-caching) for further information on this topic.  

### Redirecting http to https
Since we value the privacy of our users we want them to access our model with a secure connection only.
For this we need to redirect unencrypted traffic to our secure line.
The second `server` block serves this purpose by listening to unencrypted requests on port 80 and responding with a 301 "permanently moved".
This status code guides incoming traffic to keep the requested address, but access it on `https` instead of plain `http`.


# Conclusion
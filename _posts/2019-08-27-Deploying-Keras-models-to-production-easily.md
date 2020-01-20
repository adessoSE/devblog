---
layout: [post, post-xml]              
title:  "Deploy Keras models to production level easily"        
date:   2019-08-27 10:00                                
author: s-gbz
categories: [Softwareentwicklung]                    
tags: [Deep Learning, Künstliche Intelligenz, Keras, TensorFlow, Flask, Docker]
---
Moving your Deep Learning models from the developers playground to a serious production stage can be a hard feat to accomplish.
After endless research I'm most glad to serve you an easy to execute guide for deploying Keras models to production level.

# Plan of attack
This article assumes you want to deploy your Keras model.
Adapting it to other frameworks can be tiresome.
We will avoid that and expand it otherwise.
Here is what we're going to do:

1. Prepare a Flask application in combination with Gevent.
2. Dockerize it.
3. Use nginx to setup a reverse proxy.

I will proceed to shortly explain _how_ and why we will use Flask.
Feel free to skip ahead if you're more interested to get started.

## Understanding Keras models
In case you're unsure what models we're talking about:
Deep Learning models are a synonym for [Artificial Neural Networks](https://pathmind.com/wiki/neural-network).
These networks are inspired by the design of our brains.  
They work by processing huge amounts of data and drawing conclusions from it.

We use such networks or rather *models* to 
- predict traffic
- predict prices
- classify images
- or even draw paintings.

[Keras](https://keras.io) is a high level framework that allows for rapid construction of such models.

## Using Flask properly
Flask is a [Web Server Gateway Interface](https://www.fullstackpython.com/wsgi-servers.html) or more simply:
A lightweight web framework.
It's well documented and easy to use, but Flask is single threaded.
It can handle only one request at a time.
This creates a bottleneck in our application.

### Making Flask scaleable
To resolve this bottleneck we use [Gevent](http://www.gevent.org/index.html) - a concurrency library that enables our application to handle parallel requests.
(Because parts of Gevent are written in C).

PS: It's functionality is similar to [Gunicorn](https://gunicorn.org).
You might use Gunicorn as well if you prefer.
This tutorial sticks to Gevent, because it's easier in my opinion.

# Creating our Flask app
We'll now proceed to building the app.
The code samples will cover all major functions. 

Feel free to checkout the full project at [GitHub](https://github.com/s-gbz/keras-flask-deploy-webapp).

## App and folder structure
A scaleable structure is the first step in building a scaleable and robust application.

![App-folder-structure](/assets/images/posts/deploying-keras-models-to-production-easily/deployment-ordner-struktur.PNG)

Let's run over the contents quickly
- `models` is where you store your models.
Make sure to export them in `.h5` format
- `frontend` lives up to its name and contains your frontend files.
Default implementations usually split this folder into `static` and `templates`. 
- `uploads` is the place to store your users uploaded files.
You might consider deleting them as soon as your model is done predicting.

### Defining the Flask app
We define our app by creating a Flask instance.

```python
app = Flask(__name__, template_folder='frontend', static_folder='frontend', static_url_path='')
```

Usual Flask applications contain a `template` and `static` folder.
Frontend developers using Frameworks like Angular or React have their build artifacts usually served in a single directory.
We copy the ease of having a single directory and thus point the folder paths to `frontend`.

### Enabling CORS
Web applications usually consist of multiple instances that need to communicate.
Those instances usually run on different ports and don't know each other.
We thus need to explicitly allow communication between them.
This is done by setting rules for Cross-Origin Resource Sharing ([CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)).


```python
CORS(app)
```

This `CORS` statement serves as a wildcard and specifies no rules.
Keep in mind that it could be a security threat.
Make sure to evaluate necessary limitations once your application is running.

Read the official [Flask CORS documentation](https://flask-cors.readthedocs.io/en/latest) how to define further rules.

## Loading a single model
To load a model we make use of the `keras.models` library.

```python
model = load_model(MODEL_PATH)
```

### Loading multiple model
This paragraph is only relevant if you intend using multiple models.
Feel free to skip it if you don't.

---
Every TensorFlow model is accompanied by a [Session]() and a [Graph]().
Using multiple models requires handling and calling it's corresponding Sessions and Graphs.
We define arrays to track them.

```python
MODELS = []
GRAPHS = []
SESSIONS = []
```

We also specify model names to prepare directory paths and call `load_models()` to load them one by one.
Also don't just name your models "1, 2, 3". Stick to [Clean Code](https://dzone.com/articles/naming-conventions-from-uncle-bobs-clean-code-phil)!

```python
MODEL_NAMES = ["classify_cats", "classify_dogs", "classify_faces"]

def load_models():
    for i in range(AMOUNT_OF_MODELS):
        load_single_model("models/" + MODEL_NAMES[i] + ".h5")
        print("Model " + str(i) + " of "+ AMOUNT_OF_MODELS + " loaded.")
    print('Ready to go! Visit -> http://127.0.0.1:5000/')
```

Remember that we need to manage Sessions and Graphs?
Let's dive into `load_single_model()` to see how it's done.
(Thanks to all participants who contributed to this solution on [GitHub](https://github.com/keras-team/keras/issues/8538)!)

```python
def load_single_model(path):
    graph = Graph()
    with graph.as_default():
        session = Session()
        with session.as_default():
            model = load_model(path)
            model._make_predict_function() 
            
            models.append(model)
            graphs.append(graph)
            sessions.append(session)
```

First we'll create a new Graph.

```python
graph = Graph()
with graph.as_default():
```

If that works we create a new Session as well.
We use `with` in both cases since the operations might fail.
For those familiar with Java: [`with`](https://www.geeksforgeeks.org/with-statement-in-python/) is Pythons [`try/ catch`](https://www.w3schools.com/java/java_try_catch.asp) mechanism.


```python
        session = Session()
        with session.as_default():
```


You might encounter the following warning now: `Context manager 'generator' doesn't implement __enter__ and __exit__.`
We can stay calm since this is just a [bug](https://github.com/PyCQA/pylint/issues/1542).

Keras lets us build predict functions beforehand.
This is optional but advisable since it [accelerates](https://github.com/keras-team/keras/issues/6124#issuecomment-292752653) the models first response time.

```python
model._make_predict_function()
```

The steps repeat for every model we load.
We store our newly created items in the arrays we prepared.

## Defining request URLs
Flask annotations allow us to define RequestMappings easily.

```python
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')
```

In order to create a new mapping we define a route (`'/'`) and accepted operations (`'GET'`) - the single slash path `'/'` signifies the base route.
Navigating to `http://localhost:5000` triggers `index()` to serve `index.html` since
Flask applications run on port 5000 by default.

### Requesting the predict function
The same principles applies for calls to the predict function.

```python
@app.route('/predict', methods=['POST'])
def upload():
    if request.method == 'POST':
        # Get the file from the POST request
        file_to_predict = request.files['file']

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        local_file_path = os.path.join(
            basepath, 'uploads', secure_filename(file_to_predict.filename))
        file_to_predict.save(local_file_path)

        predictions = models_predict(local_file_path)
        os.remove(local_file_path)

        return jsonify(predictions)
```

We define `/predict` as our request path.
Since most models require user input to return results, we only accept `POST` requests.

```python
@app.route('/predict', methods=['POST'])
```

To process the request, we extract the attached file by using the `file` key.

```python
        file_to_predict = request.files['file']
```

After saving the file we pass its newly constructed path to our models for prediction.

```python
        preds = models_predict(local_file_path)
```

Respecting the privacy of our users we delete the file as prediction is done.

```python
        os.remove(local_file_path)
```

The results are then parsed into JSON and returned as a request response.
We avoid discussing the predict function to prevent this blog post from growing longer than it already is :-)

## Serving our Flask app with Gevent
It's time to serve our app in production mode.
As mentioned above, Gevent helps us with that.

```python
if __name__ == '__main__':
    load_models()
    wsgi_server = WSGIServer(('0.0.0.0', 5000), app)
    wsgi_server.serve_forever()
```

After loading our models we need to define and start a Gevent instance.
We use Gevents static `WSGIServer` since Flask is a **W**eb **S**erver **G**ateway **I**nterface.

```python
    wsgi_server = WSGIServer(('0.0.0.0', 5000), app)
```

The arguments we pass include `'0.0.0.0'` to set the host.
Though it's optional, some users might experience issues on Firefox if it's unset.
`app` is our Flask application and `5000` the port we expose.
You may use any free port.

The application now runs until shutdown.

```python
    wsgi_server.serve_forever()
```

### Test run!
To serve the application, open a shell inside the application directory.
- Use pip to install the requirements via `pip install requirements.txt`.
  You might as well use anaconda!
- Copy your models and frontend files into the respective folders.
- Run `python app.py` and open `http://localhost:5000` in your favourite browser.

Enjoy the result, but don't get too comfortable.
It's time for shipping!

# Moving to a server with Docker-/Compose
Now that our application is prepared to handle waves of requests it's time to move it to a server. 
This example server is running [CentOs 7.5](https://centos.org) but you can use any UNIX distribution you prefer.

We use [Docker](https://docker.com) to make transport and deployment of the application easier:
By defining a set of rules we create an image of a virtual machine that contains our data and runs in it's own capsuled environment.

Dockerizing applications saves us the trouble of preparing separate deployment schemes for different operating systems.
Instead we can focus on building ideal execution environments.

## Dockerize the application
Let's look at our set of rules to create a Docker image.
This set of rules is called a Dockerfile.

```Dockerfile
FROM python:3

WORKDIR /usr/src/app/uploads

WORKDIR /usr/src/app

RUN pip install Werkzeug Flask flask-cors numpy Keras gevent pillow h5py tensorflow

WORKDIR /usr/src/app/models

COPY models .

WORKDIR /usr/src/app/frontend

COPY frontend .

WORKDIR /usr/src/app

COPY app.py .

CMD [ "python" , "app.py"]
```

This Dockerfile might seem long for our rather simple application, but that's another great advantage of Docker:
Every command creates and serves as a separate layer in the build.
Consecutive builds evaluate if layers have been modified and push changes to the top.
Unchanged layers are reused and thus greatly speed up the build time.

Mind to move layers that are modified frequently to the bottom of the Dockerfile.

### Examining the Dockerfile
Let's examine the commands.
We first select a base image that will serve as a foundation.
You can browse [DockerHub](https://hub.docker.com/) for a collection of available images.

```Dockerfile
FROM python:3
```

Before copying our data to the image we need to make sure the respective directories exist.
`WORKDIR` will help us with that.

```Dockerfile
WORKDIR /usr/src/app/models
WORKDIR ...
```
If the specified directory exists, `WORKDIR` navigates into it or otherwise creates it first.
We repeat this step for every directory before using `COPY` to move our data.

```Dockerfile
COPY models .
COPY ...
```

`COPY` is supposed to check and create directories before copying files.
We rely on `WORKDIR` though, because some users experienced trouble with directories that weren't created.

`RUN` executes commands in a shell.
We use it to install our dependencies.

```Dockerfile
RUN pip install tensorflow Flask ... 
```

Note that we established a base structure and installed dependencies before moving any files.
This order sequence will greatly decrease consequtive build time, because we avoid reinstalling dependencies when something in our app changes.

Take note that `CMD` is no layer of the image build, but serves as the default command on container startup.
There can be only _one_ `CMD` command per Dockerfile.

```Dockerfile
CMD [ "python" , "app.py"]
```

### Building a Docker image
Let's build our image!

```shell
docker image build --tag deploy-keras-easily .
```

We add a `--tag` flag to name the image.
The final `.` parameter instructs Docker to use the Dockerfile in the current directory -
use the `--file` flag to specify Dockerfiles you named differently.

[Read the docs](https://docs.docker.com/engine/reference/commandline/image_build/) for more information on building images.

### Running a Docker image
Images are run in Docker containers.
There's a [number of arguments](https://docs.docker.com/engine/reference/commandline/run/) that can be used with `docker run`.

```shell
docker run -p 5000:5000 deploy-keras-easily
```

We select our image by the name tag `deploy-keras-easily`.
Advanced users may use the first two characters of the image hash as well.
We use the `-p` flag to bridge our local port 5000 to the port on the container.

Note that the container will be running in the shell until it is closed.
Add `-d` to detach the container from the shell and have it run in the background.

### Stopping a Docker container
We can stop a running container with `docker kill` and its name tag or hash.

```shell
docker kill deploy-keras-easily
```

Use `docker container ls` to list and find active containers in case you forgot the name or hash.

## Docker-compose
"Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services.
Then, with a single command, you create and start all the services from your configuration." - [docker docks](https://docs.docker.com/compose/)

Another benefit:
Docker-compose allows us to have a static IP when we serve our image.
We'll use this IP to enable a proxy pass via nginx later on.

```yml
version: '3.3'
services:
 deploy-keras-easily-service:
   container_name: deploy-keras-easily
   image: deploy-keras-easily
   restart: always
   networks:
     deploy-keras-easily-net:
       ipv4_address: 172.16.239.10

networks:
 deploy-keras-easily-net:
   driver: bridge
   ipam:
     driver: default
     config:
       - subnet: 172.16.239.0/24
```

We first define a service for our Docker image.
One service is enough since our application is bundled into one image.
More complex applications could profit from expanding the number of services though.

```yml
services:
    deploy-keras-easily-service:
    container_name: deploy-keras-easily
    image: deploy-keras-easily
    restart: always
    networks:
     deploy-keras-easily-net:
       ipv4_address: 172.16.239.10
```

Let's highlight the service features.
Our first feature is automatic container restart.
We can instruct our service to reboot on unexpected shutdown.

```yml
   restart: always
```

Second and most important feature is that we can set a static IP for our service.
This static IP should be your server address.

```yml
       ipv4_address: 172.16.239.10
```

Let's finish the network configuration by defining a subnet lastly.
Refer to your servers network setting and copy the subnet.

```yml
networks:
 deploy-keras-easily-net:
   driver: bridge
   ipam:
     driver: default
     config:
       - subnet: 172.16.239.0/24
```

### Adding volumes
Containers are volatile and destroyed on shutdown.
Applications that need to persist data make use of [volumes](https://docs.docker.com/storage/).
We avoid data storage and hence avoid volumes.

Read this instruction how to [expand the compose file](https://docs.docker.com/compose/compose-file/#volumes) in case you do need volumes.

## Starting Docker-Compose
Our app should only be started by `docker-compose` from now on.
Add a `-d` flag to run the containers detached in the background.

```shell
docker-compose up
```

Congratulation!
The application is now available at http://172.16.239.10:5000 (or the IP you set in the compose settings).
But what's with the exposed port and the unencrypted traffic?
Time to fix that in our last step!

# Preparing nginx
"NGINX ['Engine X'] is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more." - [nginx glossar](https://www.nginx.com/resources/glossary/nginx/).

We will use nginx to force https and hide our ports.
Assuming you're on CentOS 7 as well, follow [this instructions](https://linuxize.com/post/how-to-install-nginx-on-centos-7/) to install nginx.
Use `sudo` and your favorite editor to open `/etc/nginx/nginx.conf`.
Copy and adapt the configuration file as following.

```nginx
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
`ssl_certificate` and `ssl_certificate_key` provide such service.
_Specify the paths to your cert and key files in this parameter._

```nginx
	    ssl_certificate /path/to/your/cert.pem;        
        ssl_certificate_key /path/to/your/private/key.pem;
```

Basic, unencrypted HTTP connections use port 80 to communicate.
Using a secure, encrypted channel requires communication on port 443.

```nginx
        listen 443 ssl;
        client_max_body_size 10M;
```

`listen 443 ssl` orders the server to expect incomming traffic on our secure line.
We also order the server to reject files that excede 10 megabytes.
Define this parameter as you need.

```nginx
        client_max_body_size 10M;
```
### Forcing HTTPS
Setting up HTTPS is not enough, because plain HTTP is allowed by default.
We need to make sure that users access the application on a secure connection only.
To do that we add a redirection rule.

```nginx
    server {
        listen 80 default_server;
        return 301 https://$host$request_uri;
    }
```

This `server` block now listens to unencrypted requests on port 80 and responds with the [status code 301](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301) "permanently moved".
Incoming traffic is thereby guided to keep the requested address, but access it on `https` instead of plain `http`.

## nginx - Hiding the port
Our application is running on port 5000.
It's a mandatory part of our current URL.
Exposed ports don't look nice though and bother users to memorize them.
They can reveal the applications technology and be a security threat.
We avoid port exposure by using a Reverse Proxy.

### Enabling a Reverse Proxy
[Reverse Proxies](https://www.nginx.com/resources/glossary/reverse-proxy-server/) offer a wide array of features.
We'll use it to hide our application by denying access to port 5000.
Client requests will have to address the plain server IP.
The proxy will then redirect the traffic to our application.
The command block `location` sets up such a proxy.

```nginx
	    location / { 
            proxy_pass                          http://172.16.239.10:5000;
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;  
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        }
```

The `/` behind `location` redirects traffic aimed at the base path of our application.
`proxy_pass` defines the URL to hide.
Note that we use the static IP defined in the previous docker-compose file.

Remember that we force clients to use HTTPS?
We need to set `proxy_set_header`, because we route to an internal application and switch from port 443 to 5000.

# Conclusion
Deploying Deep Learning models doesn't have to be as complicated as it seems.
Let's rewind our steps:
- First we've setup a simple app structure, defined RequestMappings and wrapped our Flask application in Gevent.
- Next we've dockerized our data and service.
We also defined a network to have a static IP for the container. 
- As a final touch we used nginx to hide the ports and force secure connections.

Try your own models and fork the code at [GitHub](https://github.com/s-gbz/keras-flask-deploy-webapp).
Happy deploying! :-)

PS: You should be properly served by this guide.
Here are some alternatives in case you don't.
Keep in mind that you need to adapt them to Keras though! 
- [TensorFlow Serving](https://www.tensorflow.org/tfx/guide/serving)
- [Deep Learning for Java](http://deeplearning4j.org/) + [Spring Boot](https://spring.io/projects/spring-boot)

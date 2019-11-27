---
layout: [post, post-xml]              
title:  "Deploy Keras models to production level easily"        
date:   2019-08-27 10:00                                
author: s-gbz
categories: [Softwareentwicklung]                    
tags: [Keras, TensorFlow, Flask, Docker, Deep Learning, Künstliche Intelligenz]
---
Moving your Deep Learning models from the developers playground to a serious production stage can be a hard feat to accomplish.
After endless research I'm most glad to serve you an easy to execute guide for deploying Keras models to production level.

# Deployment: The struggle of the right tool
This article is written from personal experience.
Some of you might relate to it:
I had a hard time finding the right tool and proper guide how to deploy my Deep Learning model.

## TensorFlow Serving
As a beginner in the field of DataScience, TensorFlow Serving seemed like the obvious choice.
The concept seemed robust, clean and most importantly, developed by Google. 
The only downside: I was using Keras on top of TensorFlow. 
Available guides for porting those models were limited. 
I had no idea how to apply the concept to _my_ needs, so I moved on.

## DeepLearning4J
Most developers know their way around Java: It's easy to learn, versatile and get's the job done.
The user application I wrote to collect data for the Deep Learning was based on it.
So I tried porting the model from Keras to DeepLearning4J (a Java based Deep Learning framework).
After much trial and error it too didn't work for me. 

## Flask: A single thread solution
After some more research, Flask was the final choice:
Flask is a [Web Server Gateway Interface](https://www.fullstackpython.com/wsgi-servers.html) or more simply: a lightweight web framework.
- The single biggest advantage of it:
It's well documented, easy to set up and easy to use.
- The single biggest disadvantage of it:
**Flask is single threaded -> Flask does not scale with rising request loads and hence is not production ready by default.**

Allthough my project was not expected to generate millions, thousands (or even hundreds) of users at the time, I wanted to do things "properly".

## Gevent: Make it concurrent
Luckily I discovered [Gevent](http://www.gevent.org/index.html) - a coroutine-based concurrency library for Python.
Gevent contains structures that are implemented in C and is thus able to create separate handlers for incoming requests.

It's functionality is similiar to [Gunicorn](https://gunicorn.org).
One might as well consider using it instead.
To me Gevent just seemed easier to handle.

# Creating our Flask app
We'll now proceed to building the app.
The code samples will cover all major functions. 

Feel free to checkout the full project at [GitHub](https://github.com/s-gbz/keras-flask-deploy-webapp).

## App and folder structure
A scaleable structure is the first step in building a scaleable and robust application.

![App-folder-structure](../assets/images/posts/deploying-keras-models-to-production-easily/deployment-ordner-struktur.PNG)

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

        preds = models_predict(local_file_path)
        os.remove(local_file_path)

        return jsonify(preds)   
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
Now that our app is ready all that's left to do is serve it in production mode.
As mentioned above, Gevent helps us with that.

```python
if __name__ == '__main__':
    load_models()
    http_server = WSGIServer(('0.0.0.0', 5000), app)
    http_server.serve_forever()
```

Besides loading our models we need to define our Gevent instance.
Since Flask is a **W**eb**S**erver**G**ate**I**nterface we assign it to Gevents static `WSGIServer` instance and pass following arguments:
- `'0.0.0.0'` sets the host parameter.
(Though it's optional, some users might experience issues on Firefox if it's unset.)
- `5000` exports port 5000.
(You can pass and use any free port.) 
- `app` is our Flask application.
- `serve_forever()` - the application continues running until shutdown.

### Test run!
To run and test our application, open a shell inside the application directory.
- Use **pip** to install the requirements via `pip install requirements.txt`.
- Copy your models and frontend files into the respective folders.
- Run `python app.py` and open `http://localhost:5000` in your favourite browser.

Enjoy the result, but don't get too comfortable.
It's time for shipping!

# Get ready for shipping: Docker-/Compose
Now that our application is prepared to handle waves of requests it's time to move it to a server. 
The example server is running [CentOs 7.5](https://centos.org) but you can use any UNIX distribution you prefer.

## Dockerize the application
We use [Docker](https://docker.com) to make transport and deployment of the application easier:
By defining a set of rules we create an image of a virtual machine that contains our data and runs in it's own capsuled environment.
"Dockerizing" applications allows us to focus on building ideal execution environments.
Thereby we need not prepare seperate deployment scripts for Windows, MacOS or the countless UNIX versions out there.

Let's look at the set of rules to create our Docker image.
This is called a Dockerfile:

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
Every command creates and serves as a seperate layer in the final build.
Consecutive builds evaluate if layers have been modified and push changes to the top.
Unchanged layers are reused and thus greatly speed up the build time
**-> Layers that are modified more frequently are added last.**

### Examining the Dockerfile
Let's examine the commands.
We first select a base image that will serve as a foundation:

```Dockerfile
FROM python:3
```

To copy our data we need to make sure the directories exist, `WORKDIR` will help us with that.

```Dockerfile
WORKDIR /usr/src/app/uploads
```
If a given directory exists, `WORKDIR` navigates into it or otherwise creates it first.
We repeat this step for every folder to avoid errors - 
altough `COPY` is supposed to behave equally, some users experienced trouble with directories that weren't created.

`RUN` executes passed commands in a shell.
We make use of it to install our Python dependencies.

```Dockerfile
RUN pip install Werkzeug Flask flask-cors numpy Keras gevent pillow h5py tensorflow
```

Take note that `CMD` is no layer of the image build, but serves as a default command on container startup.
There can be only _one_ `CMD` command per Dockerfile.

```Dockerfile
CMD [ "python" , "app.py"]
```

### Build a Docker image
We build the image by executing:

```shell
docker image build --tag deploy-keras-easily .
```

`docker image build` is the base command.
We add a `--tag` flag to name our image.
The final `.` parameter instructs Docker to use the Dockerfile in the current directory -
use the `--file` flag to point at a Dockerfile in case you named it differently.
[Read the docs](https://docs.docker.com/engine/reference/commandline/image_build/) for more information on building images.

### Run a Docker image
To create a new instance of our built image we open a terminal and execute:

```shell
docker run ... deploy-keras-easily
```

The container will be running until shutdown.
Type `docker container ls` to list active containers.
Type `docker kill _name_of_active_container_` to stop such one.

## Docker-compose
"Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services.
Then, with a single command, you create and start all the services from your configuration." - [docker docks](https://docs.docker.com/compose/)

Docker-compose allows us to have a static IP when we serve our image.
We use this IP to enable a proxy pass via nginx later on. 

```yml
version: '3.3'
services:
 deploy-keras-easily:
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

Consider the two important points in this file:
We define a service and a network.

```yml
services:
 deploy-keras-easily: <- Our (first) service
    ...

 # more-services-can-be-defined:
    ...
 
networks:
    ...
```

There's no need to define [volumes](https://docs.docker.com/storage/), since we don't persist user data.
Read this instruction how to [expand the compose](https://docs.docker.com/compose/compose-file/#volumes) file in case you do.

### Examining the Docker-Compose configuration
Allthough most parameters in the file are self explanatory, some deserve further attention.
We can instruct our service to restart on unexpected shutdown.

```yml
deploy-keras-easily:
   ...
   restart: always
```

Last but not least we define a static IP for our service:
```yml
   networks:
     deploy-keras-easily-net:
       ipv4_address: 172.16.239.10
```

The IP can be set freely usualy.
Check the servers IP configuration when in doubt.      

### Starting/ Composing the Docker-Compose
Starting our app should only be performed by the following way from now on:

```shell
docker-compose up
# Add -d to run the containers detached in background
```

Needless to mention that Docker-Compose offers great comfort in comparison to `docker run`:
- Multiple containers including their seperate configurations can be run in a single command
- Containers are monitored, shutdown and removed properly if needed

The application should be available at http://172.16.239.10:5000 now - give your self some credit!
But what's with the exposed port and the unencrypted traffic?
Time to fix that in our **last step**!

# Preparing nginx
"NGINX ['Engine X'] is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more." - [nginx glossar](https://www.nginx.com/resources/glossary/nginx/).
We will use nginx to **force https and hide our ports**.

Assuming you're on CentOS 7 as well, follow [this instructions](https://linuxize.com/post/how-to-install-nginx-on-centos-7/) to install nginx.
Use `sudo` and your favorite editor to open `/etc/nginx/nginx.conf`.
Copy and adapt the configuration file as following:

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

```nginx
	    ssl_certificate /path/to/your/cert.pem;        
        ssl_certificate_key /path/to/your/private/key.pem;
```

`ssl_certificate` and `ssl_certificate_key` provide such service.
_Specify the paths to your cert and key files in this parameter._

```nginx
        listen 443 ssl;
        client_max_body_size 15M;
```

`listen 443 ssl` orders the server to use port 443 for our newly established secure connection.
Lastly we specify the `client_max_body_size` parameter and allow attached files to be up to 15 megabytes big.

## nginx - Hiding the port
To avoid port exposure we use the nginx reverse proxy capabilities.
Our application is running on port 5000.
HTTPS is set to port 443 by default.
The command block `location /` sets up a proxy that redirects such traffic to our dockerized application via `proxy_pass`.

```nginx
	    location / { 
            proxy_pass                          http://172.16.239.10:5000;
            proxy_set_header Host               $host;
            proxy_set_header X-Real-IP          $remote_addr;  
            proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        }
```

Note that we use the static IP `http://172.16.239.10:5000` defined in the previous docker-compose file.
We need to specify `proxy_set_header Host`, because we're switching ports here.
Read [this guide](https://www.digitalocean.com/community/tutorials/understanding-nginx-http-proxying-load-balancing-buffering-and-caching) for further information on this topic.  

### Redirecting http to https
Since we value the privacy of our users we want them to access our model with a secure connection only:

```nginx
    server {
        listen 80 default_server;
        return 301 https://$host$request_uri;
    }
```

For this we need to redirect unencrypted traffic to our secure line.
The second `server` block serves this purpose by listening to unencrypted requests on port 80 and responding with a 301 "permanently moved".
This status code guides incoming traffic to keep the requested address, but access it on `https` instead of plain `http`.

# Conclusion
Deploying Deep Learning Models doesn't have to be as complicated as it seems.
Let's rewind our steps:
- First we've setup a simpel app structure, defined RequestMappings and wrapped our **Flask** application in **Gevent**.
- Next we've **dockerized** our data and service.
We also defined a network to have a static IP for the container. 
- As a final touch we used **nginx** to hide the ports and force secure connections.

You can find the code at [GitHub](https://github.com/mtobeiyf/keras-flask-deploy-webapp).
I highly encourage you to fork the repository and try to include your own models.

Best of luck and until next time!
Developing
==========

#### Starting Elasticsearch
A sample Elasticsearch Docker container can be started with `make es` with the
name: `ufo_es`.

If you're using boot2docker or an elasticsearch not at `localhost`, you'll need
to set an environment variable like `export ELASTICSEARCH_HOST=$(boot2docker
ip)`.

#### Loading data
Assuming you have the right file in `data/...`, you can load it using `make
index`.

#### Frontend
Start a webserver on port 8000:

`grunt dev`

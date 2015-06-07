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

#### Data sources

* [Texas Historical Commission](http://atlas.thc.state.tx.us/shell-mrd.htm)
* [Dataset](https://s3-us-west-2.amazonaws.com/data.codingnews.info/Historical+Marker_20150521_145030_254.csv)

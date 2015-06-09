ELASTICSEARCH_URL = https://ik44vn6o9c:q2jynmlzrj@texplorer-4276945103.us-west-2.bonsai.io

help:
	@echo "help:"
	@echo "-------------------------------------------"
	@echo "data   Get data"
	@echo "es     Start an Elasticsearch Cluster"
	@echo "index  Index the csv in Elasticsearch"

data: data/Historical\ Marker_20150521_145030_254.csv
data/Historical\ Marker_20150521_145030_254.csv:
	mkdir -p data
	curl https://s3-us-west-2.amazonaws.com/data.codingnews.info/Historical+Marker_20150521_145030_254.csv > "$@"

es:
	@docker rm -f ufo_es &>/dev/null || true
	@sleep 1
	docker run -d --name=ufo_es -p 9200:9200 elasticsearch \
	  elasticsearch -Des.http.cors.enabled=true

index:
	python main.py


# Github Pages Deployment
gh-pages:
# delete and recreate the existing "gh-pages" branch
	@git branch -D gh-pages 2>/dev/null || true
	git checkout -b gh-pages
# create static files:
	NODE_ENV=production ELASTICSEARCH_URL=$(ELASTICSEARCH_URL) grunt build
# add them to the repo (wouldn't normally do this)
	git add -f app.js
	git commit -m "deploy to gh-pages"
# have to use `-f` because you're not deploying master:
	git push origin -f gh-pages
	git checkout -
	git branch -D gh-pages

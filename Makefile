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

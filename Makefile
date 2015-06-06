help:
	@echo "help:"
	@echo "-------------------------------------------"
	@echo "es     Start an Elasticsearch Cluster"
	@echo "index  Index the csv in Elasticsearch"

es:
	@docker rm -f ufo_es &>/dev/null || true
	@sleep 1
	docker run -d --name=ufo_es -p 9200:9200 elasticsearch

index:
	python main.py

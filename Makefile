help:
	@echo "help:"
	@echo "-------------------------------------------"
	@echo ""


es:
	@docker rm -f ufo_es &>/dev/null || true
	@sleep 1
	docker run -d --name=ufo_es -p 9200:9200 elasticsearch

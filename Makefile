# docker listener service makefile

APP_SERVICE_NAME = "jobber"

# get the workdir depending on the OS
ifeq ($(OS),Windows_NT)
	WORK_DIR = $(CURDIR)
else
	WORK_DIR = $(PWD)
endif

.PHONY: start
start:
	docker-compose -f docker-compose.yaml up -d

.PHONY: stop
stop:
	docker-compose -f docker-compose.yaml down
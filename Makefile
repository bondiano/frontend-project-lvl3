all: install start

start:
	npx webpack serve

install:
	npm install

build:
	npm run build

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

.PHONY: test

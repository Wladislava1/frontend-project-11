install:
	npm ci
	
lint:
	npx eslint .

dev:
	npx webpack serve

clean:
	rm -rf dist

build:
	NODE_ENV=production npx webpack
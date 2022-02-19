# Target: build
# Build the React frontend.
.PHONY: build
build: init
	@npm run build

# Target: init
# Download the required node_modules.
.PHONY: init
init:
ifeq ("$(wildcard node_modules)","")
	@npm install
endif

# Target: dev
# Open the dev server.
.PHONY: dev
dev: init
	@npm start

# Target: test
# Run tests.
.PHONY: test
test:
	@true

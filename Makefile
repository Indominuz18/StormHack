# Target: all
# Builds everything.
all: server web
	@true

# Target: web
# Builds the website frontend.
.PHONY: web
web:
	@$(MAKE) --directory="web"

# Target: web/{target}
# Builds the {target} for the web.
.PHONY: web/%
web/%:
	@$(MAKE) --directory="web" "$*"

# Target: server
# Builds the website server.
.PHONY: server
server:
	@$(MAKE) --directory="server"

# Target: server/{target}
# Builds the {target} for the server.
.PHONY: server/%
server/%:
	@$(MAKE) --directory="server" "$*"

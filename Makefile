# Paths
PROJECT_DIR = .
CERTS_DIR = $(PROJECT_DIR)/certs
COMPOSE_FILE = docker-compose.yml
COMPOSE_ENV_FILE = compose.env

include $(COMPOSE_ENV_FILE)

# Programs
DOCKER_COMPOSE = docker-compose

CA_NAME = crunchbuttonLocalCA
CA_KEY = $(CERTS_DIR)/$(CA_NAME).key
CA_CRT = $(CERTS_DIR)/$(CA_NAME).crt
CA_ORGANSIATION = Crunchbutton local
HOSTS = $(CRUNCHBUTTON_HOST) $(COCKPIT_HOST) $(COCKPIT_BETA_HOST) $(EVENT_HOST) $(LOG_HOST)
HOST_KEYS = $(addsuffix .key, $(addprefix $(CERTS_DIR)/, $(HOSTS)))
HOST_CERTIFICATES = $(addsuffix .crt, $(addprefix $(CERTS_DIR)/, $(HOSTS)))

help:
	echo "Use \"make install\" to prepare your development environment."
	echo "Use \"make uninstall\" to remove the CA and the hosts."
	echo "Use \"make up\" to start all docker containers."

all: install up

dist-clean: uninstall-ca
	rm -rf $(CERTS_DIR)

clean:

install: generate-certs install-hostnames install-ca

uninstall: uninstall-hostnames uninstall-ca
	rm -rf $(CERTS_DIR)

up:
	$(DOCKER_COMPOSE) --file $(COMPOSE_FILE) --env-file $(COMPOSE_ENV_FILE) up

down:
	$(DOCKER_COMPOSE) --file $(COMPOSE_FILE) --env-file $(COMPOSE_ENV_FILE) down

install-hostnames:
	echo "Adding hostnames set in $(COMPOSE_ENV_FILE) to /etc/hosts."
	echo "127.0.0.1       $(HOSTS)" | sudo tee -a /etc/hosts
	echo "127.0.0.1       $(COCKPIT_HOST)" | sudo tee -a /etc/hosts
	echo "127.0.0.1       $(LOG_HOST)" | sudo tee -a /etc/hosts
	echo "127.0.0.1       $(EVENT_HOST)" | sudo tee -a /etc/hosts
	echo "127.0.0.1       $(COCKPIT_BETA_HOST)" | sudo tee -a /etc/hosts

uninstall-hostnames:
	echo "Remove hostnames set in $(COMPOSE_ENV_FILE) from /etc/hosts."
	sudo sed -i '/127.0.0.1       $(CRUNCHBUTTON_HOST)/d' /etc/hosts
	sudo sed -i '/127.0.0.1       $(COCKPIT_HOST)/d' /etc/hosts
	sudo sed -i '/127.0.0.1       $(LOG_HOST)/d' /etc/hosts
	sudo sed -i '/127.0.0.1       $(EVENT_HOST)/d' /etc/hosts
	sudo sed -i '/127.0.0.1       $(COCKPIT_BETA_HOST)/d' /etc/hosts

generate-certs: $(HOST_CERTIFICATES) $(HOST_KEYS)
	echo "Generated CA certificate and certificates for all the hosts."
	echo "To use them in your Browser you have to trust the CA certificate ($(CA_CRT))."
	echo "If you run linux you can use \"make install-ca\" to install the CA certificate."

$(CERTS_DIR):
	mkdir -p $(CERTS_DIR)

$(CA_CRT) : $(CA_KEY) | $(CERTS_DIR)
	openssl req -x509 -new -nodes -key $< -sha256 -days 30 -out $@ -subj "/O=$(CA_ORGANSIATION)"

$(CA_KEY) : | $(CERTS_DIR)
	openssl genrsa -out $@ 4096

$(CERTS_DIR)/%.crt : $(CERTS_DIR)/%.csr $(CA_CRT) $(CA_KEY) | $(CERTS_DIR)
	openssl x509 -req -in $< -CA $(CA_CRT) -CAkey $(CA_KEY) -CAcreateserial -out $@ -days 30 -sha256

$(CERTS_DIR)/%.csr : $(CERTS_DIR)/%.key | $(CERTS_DIR)
	openssl req -new -sha256 -key $< -subj "/O=$(CA_ORGANSIATION)/CN=$*" -out $@

$(CERTS_DIR)/%.key : | $(CERTS_DIR)
	openssl genrsa -out $@ 2048

install-ca: $(CA_CRT)
	sudo cp $(CA_CRT) /etc/ca-certificates/trust-source/anchors/$(CA_NAME).crt
	sudo trust extract-compat

uninstall-ca:
	- sudo rm /etc/ca-certificates/trust-source/anchors/$(CA_NAME).crt
	sudo trust extract-compat

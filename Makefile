SHELL := /bin/bash

DOCKER_COMPOSE ?= $(shell if command -v docker-compose >/dev/null 2>&1; then echo docker-compose; else echo "docker compose"; fi)

# Colores ANSI
GREEN  := \033[0;32m
RED    := \033[0;31m
YELLOW := \033[0;33m
CYAN   := \033[0;36m
BOLD   := \033[1m
RESET  := \033[0m

PASS := $(GREEN)[PASS]$(RESET)
FAIL := $(RED)[FAIL]$(RESET)

.PHONY: help encender apagar reiniciar logs test status

help:
	@echo "Comandos disponibles:"
	@echo "  make encender   # Levanta backend y frontend en segundo plano"
	@echo "  make apagar     # Detiene los contenedores"
	@echo "  make reiniciar  # Reconstruye y levanta todo"
	@echo "  make logs       # Muestra logs de servicios"
	@echo "  make test       # Smoke tests de backend y frontend"
	@echo "  make status     # Estado de los contenedores del proyecto"

encender:
	$(DOCKER_COMPOSE) up -d --build

apagar:
	$(DOCKER_COMPOSE) down

reiniciar:
	$(DOCKER_COMPOSE) down --remove-orphans && $(DOCKER_COMPOSE) up -d --build

logs:
	$(DOCKER_COMPOSE) logs -f --tail=200

status:
	@printf "$(BOLD)$(CYAN)VoyagerAI — Contenedores$(RESET)\n"
	@$(DOCKER_COMPOSE) ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"

test:
	@printf "\n$(BOLD)$(CYAN)══════════════════════════════════════════$(RESET)\n"
	@printf "$(BOLD)$(CYAN)      VoyagerAI — Suite de Tests          $(RESET)\n"
	@printf "$(BOLD)$(CYAN)══════════════════════════════════════════$(RESET)\n\n"

	@printf "$(YELLOW)▶ Estado de contenedores$(RESET)\n"
	@$(DOCKER_COMPOSE) ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || true
	@printf "\n"

	@printf "$(YELLOW)── [1/6] Backend health check (GET /api/v1/health → 200)$(RESET)\n"
	@HTTP=$$(curl -s -o /tmp/_voyager_health.json -w "%{http_code}" http://localhost:8001/api/v1/health); \
	if [ "$$HTTP" = "200" ]; then \
		printf "  HTTP $$HTTP  $(PASS)  /api/v1/health\n"; \
		printf "  Body: %s\n" "$$(cat /tmp/_voyager_health.json)"; \
	else \
		printf "  HTTP $$HTTP  $(FAIL)  /api/v1/health no responde\n"; exit 1; \
	fi
	@printf "\n"

	@printf "$(YELLOW)── [2/6] Backend payload: campo status=ok$(RESET)\n"
	@BODY=$$(curl -s http://localhost:8001/api/v1/health); \
	if echo "$$BODY" | grep -q '"status".*"ok"'; then \
		printf "  $(PASS)  status=ok presente en la respuesta\n"; \
	else \
		printf "  $(FAIL)  status!=ok  body=$$BODY\n"; exit 1; \
	fi
	@printf "\n"

	@printf "$(YELLOW)── [3/6] Backend payload: versión presente$(RESET)\n"
	@BODY=$$(curl -s http://localhost:8001/api/v1/health); \
	VERSION=$$(echo "$$BODY" | grep -o '"version":"[^"]*"' | head -1); \
	if [ -n "$$VERSION" ]; then \
		printf "  $(PASS)  $$VERSION\n"; \
	else \
		printf "  $(FAIL)  campo 'version' no encontrado en body=$$BODY\n"; exit 1; \
	fi
	@printf "\n"

	@printf "$(YELLOW)── [4/6] Backend: GET /api/v1/trips → 200$(RESET)\n"
	@HTTP=$$(curl -s -o /tmp/_voyager_trips.json -w "%{http_code}" http://localhost:8001/api/v1/trips); \
	if [ "$$HTTP" = "200" ]; then \
		COUNT=$$(cat /tmp/_voyager_trips.json | grep -o '"id"' | wc -l); \
		printf "  HTTP $$HTTP  $(PASS)  /api/v1/trips  ($$COUNT viajes en BD)\n"; \
	else \
		printf "  HTTP $$HTTP  $(FAIL)  /api/v1/trips\n"; exit 1; \
	fi
	@printf "\n"

	@printf "$(YELLOW)── [5/6] Backend: GET /api/v1/trips/999999 → 404$(RESET)\n"
	@HTTP=$$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/v1/trips/999999); \
	if [ "$$HTTP" = "404" ]; then \
		printf "  HTTP $$HTTP  $(PASS)  recurso inexistente devuelve 404 correctamente\n"; \
	else \
		printf "  HTTP $$HTTP  $(FAIL)  /api/v1/trips/999999 debería ser 404\n"; exit 1; \
	fi
	@printf "\n"

	@printf "$(YELLOW)── [6/6] Frontend accesible (GET http://localhost:5173 → 200)$(RESET)\n"
	@HTTP=$$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173); \
	if [ "$$HTTP" = "200" ]; then \
		printf "  HTTP $$HTTP  $(PASS)  http://localhost:5173\n"; \
	else \
		printf "  HTTP $$HTTP  $(FAIL)  frontend no responde en puerto 5173\n"; exit 1; \
	fi
	@printf "\n"

	@printf "$(BOLD)$(GREEN)══════════════════════════════════════════$(RESET)\n"
	@printf "$(BOLD)$(GREEN)   ✓  Todos los tests pasaron             $(RESET)\n"
	@printf "$(BOLD)$(GREEN)══════════════════════════════════════════$(RESET)\n\n"
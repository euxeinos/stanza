.PHONY: dev
dev:
	(trap 'kill 0' SIGINT; \
	cd backend && uv run uvicorn app.main:app --reload --port 8000 & \
	cd frontend && tsc --watch --preserveWatchOutput & \
	uvx livereload frontend -p 8080 & \
	wait)

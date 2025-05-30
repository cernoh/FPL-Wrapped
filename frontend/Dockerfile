FROM oven/bun:1
WORKDIR /app
COPY frontend/package.json frontend/bun.lockb ./
RUN bun install --frozen-lockfile
COPY frontend/ .
EXPOSE 5173
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]
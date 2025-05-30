# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy go mod file from backend directory
COPY backend/go.mod ./

# Download dependencies (this will create go.sum)
RUN go mod download

# Copy source code from backend directory
COPY backend/ .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Expose port (adjust if your Go app uses a different port)
EXPOSE 8080

# Run the binary
CMD ["./main"]
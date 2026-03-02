# ==========================================
# Stage 1: Build Stage
# ==========================================
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Add dependencies first to cache Maven downloads (improves CI/CD build speeds)
# Note: Using .mvn wrapper to ensure consistent Maven versioning across environments
COPY .mvn/ .mvn/
COPY mvnw ./
COPY pom.xml ./

# Give executable permissions to the wrapper
RUN chmod +x ./mvnw

# Download dependencies offline
RUN ./mvnw dependency:go-offline -B

# Copy application source
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# ==========================================
# Stage 2: Production Run Stage
# ==========================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Best Practice: Run Application as a non-root user to mitigate privilege escalation
# We create a dedicated group and user for running the Spring Boot app.
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy over only the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Explicitly expose port 8080 so Docker/orchestrators know what port to connect to
EXPOSE 8080

# Run the application using the non-root user
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

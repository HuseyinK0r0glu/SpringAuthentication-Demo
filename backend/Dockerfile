# Multi-stage Dockerfile for Spring Boot application
# This approach creates a smaller final image by separating build and runtime stages

# ===========================================
# STAGE 1: BUILD STAGE
# ===========================================
# Use Maven image with OpenJDK 17 for building the application
# This image contains Maven build tool and Java Development Kit (JDK)
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set the working directory inside the container
# All subsequent commands will run from this directory
WORKDIR /app

# Copy the Maven configuration file (pom.xml) first
# This is done separately to leverage Docker layer caching
# If pom.xml hasn't changed, this layer will be cached
COPY pom.xml .

# Download all Maven dependencies and cache them
# This step downloads all dependencies listed in pom.xml
# The -B flag runs in batch mode (non-interactive)
# The -o flag runs in offline mode after downloading
RUN mvn dependency:go-offline -B

# Copy the source code into the container
# This includes all Java files, resources, and configuration
COPY src ./src

# Build the Spring Boot application
# - clean: removes previous build artifacts
# - package: compiles, tests, and packages the application
# - -DskipTests: skips running tests during build (for faster builds)
RUN mvn clean package -DskipTests

# ===========================================
# STAGE 2: RUNTIME STAGE
# ===========================================
# Use a smaller JRE-only image for the runtime
# This image only contains Java Runtime Environment, not the full JDK
# This makes the final image much smaller (~150MB vs ~500MB)
FROM eclipse-temurin:17-jre-jammy

# Set the working directory for the runtime container
WORKDIR /app

# Copy the built JAR file from the build stage
# The --from=build flag copies from the previous stage
# The *.jar pattern matches the Spring Boot JAR file
# We rename it to app.jar for simplicity
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 (Spring Boot default port)
# This documents which port the application uses
# Note: This doesn't actually publish the port, it's just documentation
EXPOSE 8080

# Define the command to run when the container starts
# This tells Docker how to start the Spring Boot application
# The array format is preferred over shell format for better signal handling
ENTRYPOINT ["java","-jar","app.jar"]
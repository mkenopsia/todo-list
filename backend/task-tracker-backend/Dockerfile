FROM amazoncorretto:17-alpine
WORKDIR /backend
COPY target/*.jar backend.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "backend.jar"]

#FROM maven:3.8.8 as builder
#WORKDIR /app
#COPY pom.xml .
#COPY src ./src
#RUN mvn package
#
#FROM amazoncorretto:17-alpine
#WORKDIR /backend
#COPY --from=builder /app/target/*.jar backend.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "backend.jar"]
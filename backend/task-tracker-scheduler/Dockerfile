FROM amazoncorretto:17-alpine
WORKDIR /scheduler
COPY target/*.jar scheduler.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "scheduler.jar"]

#FROM maven:3.8.8 as builder
#WORKDIR /app
#COPY pom.xml .
#COPY src ./src
#RUN maven package
#
#FROM amazoncorretto:17-alpine
#WORKDIR /scheduler
#COPY --from=builder /app/target/*.jar scheduler.jar
#EXPOSE 8081
#ENTRYPOINT ["java", "-jar", "scheduler.jar"]
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x gradlew
RUN ./gradlew bootJar -x test

FROM eclipse-temurin:17-jre
WORKDIR /app
# app.jar과 build/libs 경로 둘 다 복사 (Railway의 Start Command와 기본 ENTRYPOINT 둘 다 호환)
RUN mkdir -p /app/build/libs
COPY --from=build /app/build/libs/api-0.0.1-SNAPSHOT.jar /app/app.jar
COPY --from=build /app/build/libs/api-0.0.1-SNAPSHOT.jar /app/build/libs/api-0.0.1-SNAPSHOT.jar

ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Xmx512m -jar /app/app.jar"]

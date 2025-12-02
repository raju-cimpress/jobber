## Section 6: gRPC Transport

```sh
jobber git:(main) npm i @grpc/grpc-js @grpc/proto-loader @nestjs/microservices ts-proto
```

@grpc/grpc-js ->

@grpc/proto-loader ->

@nestjs/microservices ->
ts-proto ->

### Generate ts file for .proto files

```sh
jobber git:(main) protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./types ./proto/*.proto --ts_proto_opt=nestJs=true
```

### Install and configure apache pulsar client

```sh
#Create new library in mono-repo for pulsar client
#use @nx/nest:library
jobber git:(main) nx g library libs/pulsar

#install the pulsar-client package
jobber git:(main) npm i pulsar-client
#✔ Which linter would you like to use? · eslint
#✔ Which unit test runner would you like to use? · jest

#Create new application in mono-repo for consuming/executing the message in pulsar queue
#use @nx/nest:application
jobber git:(main) nx g app apps/executor

#install the graphql type json package
jobber git:(main) npm i graphql-type-json
```

### Get queue data from Apache Pulsar in docker

```sh
18a7089999d6:/pulsar/bin$ ./pulsar-admin topics stats persistent://public/default/Fibonacci
```

### Dockerize the whole service

```sh
#Remove the end to end test projects
nx generate @nx/workspace:remove --projectName=executor-e2e
nx generate @nx/workspace:remove --projectName=auth-e2e
nx generate @nx/workspace:remove --projectName=jobs-e2e

#Rename library nestjs with graphql

#Create new library in nestjs for common code and functionalities
#use @nx/nest:library
jobber git:(main) nx g library libs/nestjs
#✔ Which linter would you like to use? · eslint
#✔ Which unit test runner would you like to use? · jest


#Create new library in grpc
#use @nx/nest:library
jobber git:(main) nx g library libs/grpc
#✔ Which linter would you like to use? · eslint
#✔ Which unit test runner would you like to use? · jest

#Create new library in prisma
#use @nx/nest:library
jobber git:(main) nx g library libs/prisma
#✔ Which linter would you like to use? · eslint
#✔ Which unit test runner would you like to use? · jest


#Build all the libraries
jobber git:(main) nx run-many --target=build --projects=graphql,pulsar,prisma

#Build all the apps including the libraries
jobber git:(main) nx run-many --target=build --projects=auth,jobs,executor

#Add package module-alias for getting dependent libraries in complied dist apps independently
jobber git:(main) npm i module-alias

#Define _moduleAliases in root package.json for all libraries
#Note to include require('module-alias/register'); in main.ts of apps

#Run indivdual app from dist
jobber git:(main) node ./dist/apps/auth/main

#Test the dockerfile of individual app
jobber git:(main) docker build -t jobs -f apps/jobs/Dockerfile . --no-cache

jobber git:(main) docker run jobs

#Use common webpack file for all the libs using webpack-merge
jobber git:(main) npm i --save-dev webpack-merge
```

### Logging

```sh
#intall packages for at root level
jobber git:(main) npm i nestjs-pino pino-http

#Pritify the logs for development
jobber git:(main) npm i --save-dev pino-pretty

#intall uuid package for at root level
jobber git:(main) npm i uuid
```

### Kubernetes

```sh
#Elastic Container Registry
add entry in .github/ci.yml
```

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


```

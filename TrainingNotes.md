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

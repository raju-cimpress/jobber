import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from '@apollo/server';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';

export class GqlLoggerPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger(GqlLoggerPlugin.name);

  async requestDidStart(
    requestContext: GraphQLRequestContext<BaseContext>
  ): Promise<GraphQLRequestListener<BaseContext> | void> {
    const startTime = Date.now();
    const { request } = requestContext;
    const requestId = uuidv4();

    this.logger.log({
      requestId,
      headers: request.http?.headers,
      query: request.query,
      variables: request.variables,
    });

    return {
      willSendResponse: async (responseContext) => {
        const duration = Date.now() - startTime;

        this.logger.log({
          requestId,
          query: request.query,
          statusCode: responseContext.response?.http?.status || 200,
          duration,
        });
      },
    };
  }
}

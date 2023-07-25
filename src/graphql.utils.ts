import {
  GraphQLModule,
  GraphQLSchemaHost,
  GraphQLDefinitionsFactory,
  GqlOptionsFactory,
} from '@nestjs/graphql';
import { Provider, Injectable, UnauthorizedException } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { printSchema } from 'graphql';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { PubSub } from 'graphql-subscriptions';
import { fetchConfig } from './app.config';
import { GameService } from './game/game.service';
import { AuthService } from './accounts/auth/auth.service';

const PATH_SOURCES = ['./**/*.graphql'];
const PATH_GEN_ROOT = join(process.cwd(), 'gen/graphql/');
const PATH_GEN_SDL = join(PATH_GEN_ROOT, 'schema.gql');
const PATH_GEN_TYPES = join(PATH_GEN_ROOT, 'index.ts');

const corsConfig = fetchConfig('app', 'cors');

// Global GraphQL Configuration
// - This generates types whenever app starts
@Injectable()
class ConfigService implements GqlOptionsFactory {
  constructor(private gameService: GameService, private authService: AuthService) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      driver: ApolloDriver,
      typePaths: PATH_SOURCES,
      playground: true,
      subscriptions: {
        'graphql-ws': {
          onConnect: async (ctx: any) => {
            const {
              connectionParams: { auth_token },
              extra,
            } = ctx;
            try {
              const decodedToken = this.authService.verifyToken(auth_token);
              const { sub, gameId } = decodedToken;
              extra.user = { sub, gameId };
            } catch (e) {
              throw new UnauthorizedException();
            }
          },
          onDisconnect: async (ctx: any) => {
            const { sub, gameId } = ctx.extra.user;
            await this.gameService.handleDisconnect(sub, gameId);
            return ctx;
            },
          },
      },
      context: (context)=>context,
      definitions: {
        path: PATH_GEN_TYPES,
        outputAs: 'class',
      },
    };
  }
}

export const GQLModule = GraphQLModule.forRootAsync({
  driver: ApolloDriver,
  useClass: ConfigService
});

// PUB_SUB provider to enable subscriptions
export const GQLSubscriptionProvider: Provider = { provide: 'PUB_SUB', useValue: new PubSub() };

// Generate typings manually
export const generateGraphQLTypes = async (watch = false) => {
  const definitionsFactory = new GraphQLDefinitionsFactory();

  return definitionsFactory.generate({
    typePaths: PATH_SOURCES,
    path: PATH_GEN_TYPES,
    outputAs: 'class',
    watch,
  });
};

// Helper to generate unified GraphQL SDL
export const generateGraphQLSchema = (app) => {
  const { schema } = app.get(GraphQLSchemaHost);
  writeFileSync(PATH_GEN_SDL, printSchema(schema));
};

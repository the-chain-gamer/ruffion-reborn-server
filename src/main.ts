import { NestFactory, repl } from '@nestjs/core';
import { AppModule } from './app.module';
import { fetchConfig } from './app.config';
import { generateGraphQLSchema } from './graphql.utils';
var compression = require('compression')
const REPL_FLAG = '--with-repl';

async function bootstrap() {
  const port = fetchConfig('app', 'port');
  const cors = fetchConfig('app', 'cors');
  const startREPL = process.argv.includes(REPL_FLAG);

  // Start Web Server
  const app = await NestFactory.create(AppModule,{cors});
  // app.use(compression());
  app.use(compression({
    filter: () => { return true },
    threshold: 0
  }));
  await app.listen(port);
  // Generate GraphQL SDL
  generateGraphQLSchema(app);

  // Start REPL if enabled with flag
  if (startREPL) await repl(AppModule);
}

bootstrap();

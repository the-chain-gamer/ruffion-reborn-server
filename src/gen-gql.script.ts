import { RunInContext } from './app.script';
import { generateGraphQLTypes } from './graphql.utils';

/**
 * Generate GraphQL Schema and Types
 */
const generate = async () => {
  await generateGraphQLTypes();
  // generateGraphQLSchema(app);
};

RunInContext(generate);

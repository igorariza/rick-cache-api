import express, { Application, Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { connectDatabase } from './config/database';
import { initializeRedis } from './config/redis';
import { typeDefs } from './schema/characterSchema';
import { resolvers } from './resolvers/characterResolver';
import logger from './middleware/logger';
import { runCronJobManually } from './utils/cronJob';
import { exec } from 'child_process';
import playground from 'graphql-playground-middleware-express';

const PORT = process.env.PORT || 4000;

const app: Application = express();

app.use(logger);

app.post('/cronjob/run', async (req: Request, res: Response) => {
  console.log('Running cron job manually...');
  try {
    await runCronJobManually();
    res.status(200).send('Cron job executed successfully.');
  } catch (error) {
    console.error('Error executing cron job:', error);
    res.status(500).send('Error executing cron job.');
  }
});

const runMigration = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec('/bin/bash ./entry.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration process error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Migration process stderr: ${stderr}`);
      }
      console.log(`Migration process output: ${stdout}`);
      resolve();
    });
  });
};

(async () => {
  try {
    await connectDatabase();
    console.log('Database connected successfully');

    await initializeRedis();
    console.log('Redis connected successfully');

    await runMigration();
    console.log('Migration process completed successfully');

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
    });

    await server.start();
    //server.applyMiddleware({ app });
    console.log(`Apollo Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    app.get('/graphql', playground({ endpoint: '/graphql' }));
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
})();

export default app;
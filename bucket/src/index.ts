import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { getRouter } from "./routes";

const port = process.env.API_PORT || 3002;

const app = express();
app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));
app.use(bodyParser.json());
app.use(morgan('combined'));

getRouter(app);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

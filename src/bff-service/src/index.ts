import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { BAD_GATEWAY, INTERNAL_SERVER_ERROR, OK } from 'http-status';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.all(
    '/*',
    (req: Request, res: Response) => {
        console.log('URL', req.url);

        console.log('ORIGINAL URL', req.originalUrl);

        console.log('QUERY:', req.query);

        console.log('METHOD:', req.method);

        console.log('BODY : ', req.body);

        const method = req.method;

        const body =
            Object.keys(req.body).length === 0 ? null : { data: req.body };

        const recipientName = req.originalUrl.split('/')[1];

        console.log('recipientName', recipientName);

        const recipientURL = process.env[recipientName];

        if (recipientURL) {
            console.log('recipientURL', recipientURL);

            axios({
                method: method,
                url: recipientURL,
                ...body,
            })
                .then(({ data }) => {
                    console.log('Resp to BFF:', data);

                    res.status(OK).json(data);
                })
                .catch((error) => {
                    console.error('BFF Error:', JSON.stringify(error));
                    if (error) {
                        const { status, data } = error.response;
                        res.status(status).json(data);
                    } else {
                        res.status(INTERNAL_SERVER_ERROR).json({
                            error: error.message,
                        });
                    }
                });
        } else {
            res.status(BAD_GATEWAY).json({ error: 'Cannot process request' });
        }

        // next();
    }
    // (req: Request, res: Response) => {
    //     res.send('Express app ts');
    // }
);

app.listen(port, () =>
    console.log(`Server is running at http://localhost:${port}`)
);

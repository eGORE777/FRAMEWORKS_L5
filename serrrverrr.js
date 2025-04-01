const http = require('http');  
const url = require('url');  
const querystring = require('querystring');  

class Middleware {  
    constructor() {  
        this.handlers = [];  
    }  

    use(handler) {  
        this.handlers.push(handler);  
    }  

    async run(req, res) {  
        for (const handler of this.handlers) {  
            await handler(req, res);  
            if (res.finished) return; 
        }  
    }  
}  

class Request {  
    constructor(req) {  
        this.body = '';  
        this.params = {};  
        this.query = {};  

        this.parseBody(req);  
        this.parseQuery(req);  
    }  

    parseBody(req) {  
        req.on('data', chunk => {  
            this.body += chunk.toString();  
        });  

        req.on('end', () => {  
            this.body = querystring.parse(this.body);  
        });  
    }  

    parseQuery(req) {  
        this.query = querystring.parse(url.parse(req.url).query);  
    }  
}  

class Response {  
    constructor(res) {  
        this.res = res;  
        this.finished = false;  
    }  

    send(data) {  
        this.res.writeHead(200, { 'Content-Type': 'text/plain' });  
        this.res.end(data);  
        this.finished = true;  
    }  

    json(data) {  
        this.res.writeHead(200, { 'Content-Type': 'application/json' });  
        this.res.end(JSON.stringify(data));  
        this.finished = true;  
    }  

    status(code) {  
        this.res.statusCode = code;  
        return this;  
    }  

    end() {  
        this.finished = true;  
    }  
}  

class MiniExpress {  
    constructor() {  
        this.routes = {};  
        this.middleware = new Middleware();  
    }  

    addRoute(method, path, handler) {  
        if (!this.routes[method]) {  
            this.routes[method] = {};  
        }  
        this.routes[method][path] = handler;  
    }  

    use(handler) {  
        this.middleware.use(handler);  
    }  

    async requestHandler(req, res) {  
        const reqObj = new Request(req);  
        const resObj = new Response(res);  

        await this.middleware.run(reqObj, resObj);  

        if (resObj.finished) return; // Если middleware завершает ответ  

        const routeHandler = this.routes[req.method]?.[url.parse(req.url).pathname];  
        if (routeHandler) {  
            try {  
                await routeHandler(reqObj, resObj);  
            } catch (err) {  
                this.handleError(err, resObj);  
            }  
        } else {  
            resObj.status(404).send('Not Found');  
        }  
    }  

    handleError(err, res) {  
        console.error(err);  
        res.status(500).send('Internal Server Error');  
    }  

    listen(port) {  
        const server = http.createServer((req, res) => this.requestHandler(req, res));  
        server.listen(port, () => {  
            console.log(`Server is listening on port ${port}`);  
        });  
    }  
}  


const app = new MiniExpress();  


app.use(async (req, res) => {  
    console.log(`${req.method} ${req.url}`);  
});  


app.addRoute('GET', '/', async (req, res) => {  
    res.send('Welcome to Mini Express!');  
});  


app.addRoute('POST', '/data', async (req, res) => {  
    res.json(req.body);  
});  


app.addRoute('PUT', '/data', async (req, res) => {  
    res.json({ message: 'Data updated', data: req.body });  
});  


app.addRoute('DELETE', '/data', async (req, res) => {  
    res.send('Data deleted');  
});  


app.listen(3000);  
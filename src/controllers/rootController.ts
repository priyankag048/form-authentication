import { Request, Response, NextFunction} from 'express';
import { controller, get, use } from "./decorators";


function checkAuth(req:Request, res: Response, next: NextFunction): void {
    if(req.session && req.session.loggedIn) {
        next();
        return;
    }
    res.status(403).send('Not permitted');
}

@controller('')
class RootController {
    @get('/')
    getRoot(req:Request, res: Response): void {
        if(req.session && req.session.loggedIn) {
            res.status(200).send(`
                <div>
                    <h1>You are logged in</h1>
                    <p>You can visit our preotected site <a href="/protected">here</a>
                    <p> <a href="/auth/logout">Logout</a></p>
                   
                </div>
            `)
        } else {
            res.status(200).send(`
                <div>
                    <div>You are not logged in</div>
                    <a href="/auth/login">Login</a>
                </div>
            `)
        }
    }

    @get('/protected')
    @use(checkAuth)
    getProtected(req:Request, res:Response): void {
        res.status(200).send('Welcome to protected route, logged in user')
    };
}
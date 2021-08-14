import 'reflect-metadata';
import { NextFunction, RequestHandler, Request,Response  } from 'express';
import { AppRouter } from '../../AppRouter'
import { Methods } from './Methods';
import { MetadataKeys } from './MetadataKeys';


function bodyValidators(keys: string[]): RequestHandler {
    return function(req: Request, res: Response, next: NextFunction) {
        if(!req.body) {
            res.status(400).send('Invalid Request');
            return;
        }
        for(let key of keys) {
            if(!req.body[key]) {
                res.status(400).send('Invalid Request');
                return;
            }
        }
        next()
    }
}

export function controller(routePrefix: string) {
    return function(target: Function ){
        const router = AppRouter.getInstance();
        for(let key in target.prototype) {
          const handler = target.prototype[key];
          const path = Reflect.getMetadata(MetadataKeys.path,target.prototype, key);
          const method: Methods = Reflect.getMetadata(
              MetadataKeys.method,
              target.prototype,
              key);
          const middlewares = Reflect.getMetadata(
              MetadataKeys.middleware,
              target.prototype,
              key) || [];
          const reqdBodyProps = Reflect.getMetadata(
              MetadataKeys.validator,
              target.prototype, 
              key) || [];
            const validator = bodyValidators(reqdBodyProps)
          if(path && method) {
            router[method](`${routePrefix}${path}`,...middlewares, validator, handler)
          }
        }
    }
}
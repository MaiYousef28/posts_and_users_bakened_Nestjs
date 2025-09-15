import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";



@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    private readonly logger = new Logger(LoggingInterceptor.name);


    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const requst = context.switchToHttp().getRequest();
        const { method , url ,body ,query, params}= requst ;
        const userAgent = requst.get('user-agent') || 'unknown' ;

        const userId = requst?.user?.id || 'unathonticated'

        this.logger.log(`
            [${method},${url}- User:${userId}- userAgent${userAgent}]
            `)
            const startTime =  Date.now();
            return next.handle().pipe(
                tap({
                    next:(data)=>{
                        const endTime = Date.now();
                        const duration = endTime- startTime 
                        this.logger.log(`[${method} ${url}- ${duration}ms- Response size ${ JSON.stringify(data)?.length || 0}`)
                    },
                    error:(error)=>{
                        const endTime = Date.now();
                        const duration = endTime- startTime 
                        this.logger.log(`[${method} ${url}- ${duration}ms - Error ${error.message}]`)
                    },
                        
                })
            )
        
    }
}
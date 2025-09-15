import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";



@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    private readonly logger = new Logger(LoggingInterceptor.name);


    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const requst = context.switchToHttp().getRequest();
        const { method , url ,body ,query, params}= requst ;
        const userAgent = requst.get('user-agent') || 'unknown'
        const userId = requst?.user?.id || 'unathonticated'

        this.logger.log(`
            [$]
            `)
        
    }
}
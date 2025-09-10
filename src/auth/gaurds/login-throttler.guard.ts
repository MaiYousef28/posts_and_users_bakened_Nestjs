import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";




@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard{
// get email from reuest 
  protected async getTracker(req: Record<string, any>): Promise<string> {
      const email = req.body?.email || 'anonymous'
      return `login_${email}`
  } 
// set a limit to 5 

  protected getLimit(): Promise<number>{
    return Promise.resolve(5)
  }
// time window for multiple time of 1 minute
   protected getTtl(): Promise<number>{
    return Promise.resolve(60000)
  }
  protected async throwThrottlingException(): Promise<void> {
      throw new ThrottlerException(`Too many attempt please try again after 1 minutes`)
  }
}
 
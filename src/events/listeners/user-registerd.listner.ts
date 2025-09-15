import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { UseRegisteredEvent } from "../user-event.service";





@Injectable()
export class UserRegisteredListener{
    private readonly logger = new Logger(UserRegisteredListener.name);
    @OnEvent('user.registered')
    handleUserRegisteredEvent(event:UseRegisteredEvent):void {
        const {user , timeStamp} = event ;

        this.logger.log(`welcome ${user.email}, you account has been created at ${timeStamp.toISOString()}`)
    }
}
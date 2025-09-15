import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventsService } from './user-event.service';
import { UserRegisteredListener } from './listeners/user-registerd.listner';

@Module({
    imports:[
        EventEmitterModule.forRoot({
            global:true ,
            wildcard:false,
            maxListeners:20,
            verboseMemoryLeak:true,
        }),

    ],
    providers:[UserEventsService, UserRegisteredListener],
    exports:[UserEventsService]
})
export class EventsModule {}

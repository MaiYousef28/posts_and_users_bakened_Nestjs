import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { timeStamp } from "console";
import { User } from "src/auth/entites/user-entity";



export interface UseRegisteredEvent{
    user:{
        id:number ;
        email:string ;
        name:string ;
    },
    timeStamp: Date,
}

@Injectable()
export class UseEventsService{
    constructor(
        private readonly eventEmitter: EventEmitter2
    ){}


    emitUserRegisterd(user:User): void{
        const userRegisteredData : UseRegisteredEvent ={
            user:{
                id:user.id,
                email:user.email ,
                name:user.name
            },
            timeStamp: new Date()
        }
        this.eventEmitter.emit('user.registered', userRegisteredData)
    }
}
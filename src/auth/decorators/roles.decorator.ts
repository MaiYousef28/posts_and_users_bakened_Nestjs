import { SetMetadata } from "@nestjs/common"
import { UserRole } from "../entites/user-entity"



// this is a unique idintifer for storing and retriving roles requirment as metadata on the route handler
export const ROLES_KEY ='roles'
// roles decorator  will marke the routes with the roles that are allowed to accces them 
// the roles guard read the metadata to check if thr user has permission 
export const Roles =(...roles:UserRole[])=> SetMetadata(ROLES_KEY,roles)
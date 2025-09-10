import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../entites/user-entity";


/**
 * expected workflow
 * client send a request to protected route 
 * then we have a jwt guard --> this will validate the token and attach the current user in the request
 * after that the role Guard will check if the current user matches thr required role
 * if not found it will do forbidden 
 * if yes it will acesses the next controller 
 
 */

@Injectable()
export class RoleGuard implements CanActivate{
// reflector help to acess metadata
    constructor(private reflector: Reflector){}
// restrict user if try to acess a router not allowed --> this will protect from going to the next method 
    canActivate(context: ExecutionContext): boolean {
        ///retrive the roles meta data set by the roles decreator 
        // controller --> handler "example register"==> if i didn't psaa any required roles this mean it can be accesabile by all and should return true  
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,[
            context.getHandler(),
            context.getClass()
            ]
         );
        if(!requiredRoles){
            return true
        };
        const {user}= context.switchToHttp().getRequest();

        if(!user){
            throw new ForbiddenException('User not authenticate')
        }

        const hasRequiredRole = requiredRoles.some((role)=> user.role === role);
        if(!hasRequiredRole){
            throw new ForbiddenException('Insuffecient permission')
        }
        
        return true ;

    }
}
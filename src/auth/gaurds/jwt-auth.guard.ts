import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// The aim of this is to protect  routes that require authontication 
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){



}
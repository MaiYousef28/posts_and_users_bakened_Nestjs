import { User } from "src/auth/entites/user-entity";
import { Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm";


@Entity()
export class FileEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    originName: string; 

    @Column()
    mimeType: string ;

    @Column()
    size:number ;

    @Column()
    url: string ;
/// this is for cloudinary
    @Column()
    publicId: string ;

    @Column({nullable:true})
    description: string ;

    @ManyToOne(()=>User,{eager:true} )
    uploader:User;

    @CreateDateColumn()
    createdAt:Date;


}
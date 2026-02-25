import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";

@Entity()
export class Story {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    fandom: string;

    @Column()
    genre: string;

    @Column()
    prompt: string;

    @CreateDateColumn()
    createdAt: Date;
}

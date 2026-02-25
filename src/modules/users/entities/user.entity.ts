import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Story} from "../../stories/entities/story.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Story, story => story.user)
    stories: Story[];
}

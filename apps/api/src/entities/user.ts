import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { hashSync, genSaltSync } from 'bcryptjs';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date | null;

    @Column({ nullable: false, unique: true, length: 20 })
    username!: string;

    @Column({ nullable: false, unique: true, length: 255 })
    email!: string;

    @Column({ nullable: false })
    hashPassword!: string;

    @Column({ nullable: false })
    salt!: string;
    
    setPassword(password: string) {
        this.salt = genSaltSync(12);
        this.hashPassword = hashSync(password, this.salt);
    }

    verifyPassword(password: string) {
        const hash = hashSync(password, this.salt);

        return hash === this.hashPassword;
    }
}
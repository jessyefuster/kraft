import type { Relation } from 'typeorm';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { hashSync, genSaltSync } from 'bcryptjs';

import { RoleEntity } from './role';

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => RoleEntity, { nullable: true })
    @JoinColumn({ name: 'roleId' })
    role!: Relation<RoleEntity> | undefined | null;

    @Column({ nullable: true })
    roleId!: string | null;

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
    
    set password(password: string) {
        this.salt = genSaltSync(12);
        this.hashPassword = hashSync(password, this.salt);
    }

    verifyPassword(password: string) {
        const hash = hashSync(password, this.salt);

        return hash === this.hashPassword;
    }
}
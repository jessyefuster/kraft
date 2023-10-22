import type {
    Relation
} from 'typeorm';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn
} from 'typeorm';

import { PermissionEntity } from './permission';

@Entity({ name: 'role' })
export class RoleEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: false, unique: true, length: 255 })
    name!: string;

    @Column({ type: 'varchar', nullable: true, length: 255 })
    description!: string | null;

    @Column({ type: 'boolean', default: false })
    isRoot!: boolean;

    @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
        onDelete: 'CASCADE'
    })
    @JoinTable()
    permissions!: Relation<PermissionEntity[]> | undefined;
}

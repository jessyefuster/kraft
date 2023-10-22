import type {
    Relation
} from 'typeorm';
import {
    Column,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { ALL_PERMISSIONS, AnyPermission } from '../models/permissions';
import { PermissionGroupEntity } from './permissionGroup';
import { RoleEntity } from './role';

@Entity({ name: 'permission' })
export class PermissionEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => PermissionGroupEntity, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    group!: Relation<PermissionGroupEntity> | null;

    @Column({
        type: 'enum',
        enum: ALL_PERMISSIONS,
        nullable: false
    })
    code!: AnyPermission;

    @Column({ type: 'varchar', nullable: true, length: 255 })
    description!: string | null;

    @ManyToMany(() => RoleEntity, (role) => role.permissions, {
        onDelete: 'CASCADE'
    })
    roles!: Relation<RoleEntity[]> | undefined;
}

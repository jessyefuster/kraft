import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation
} from 'typeorm';

import { PermissionEntity } from './permission';

@Entity({ name: 'permission_group' })
export class PermissionGroupEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToMany(() => PermissionEntity, (permission) => permission.group)
    permissions!: Relation<PermissionEntity[]>;

    @Column({ nullable: false, unique: true, length: 20 })
    code!: string;

    @Column({ type: 'varchar', nullable: true, length: 255 })
    description!: string | null;
}

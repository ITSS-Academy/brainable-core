import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Storage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    folderName: string;

    @ManyToOne(() => Storage, (storage) => storage)
    photo: Storage;
}

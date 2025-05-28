import { Band } from "src/bands/band.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'musics'})
export class Music {
  @PrimaryGeneratedColumn('increment')
  id: number;
  
  @Column({type: 'varchar', length: 255, nullable: false})
  name: string;
  
  @ManyToOne(() => Band, (band) => band.musics, { onDelete: 'CASCADE' })
  band: Band;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
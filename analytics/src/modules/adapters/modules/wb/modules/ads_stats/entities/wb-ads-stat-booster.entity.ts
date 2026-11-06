import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WbAdsStatEntity } from "./wb-ads-stat.entity";

@Entity('wb_ads_stat_boosters')
export class WbAdsStatBoosterEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    avg_position: number;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'int' })
    nm: number;

    @ManyToOne(() => WbAdsStatEntity, stat => stat.booster_stats, {
        onDelete: 'CASCADE',
    })
    stat: WbAdsStatEntity;
}
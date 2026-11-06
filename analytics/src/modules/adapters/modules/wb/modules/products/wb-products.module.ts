import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WbProductsService } from './wb-products.service';
import { WbProductEntity } from './entities/wb-product.entity';
import { WbProductPhotoEntity } from './entities/wb-product-photo.entity';
import { WbProductDimensionEntity } from './entities/wb-product-dimension.entity';
import { WbProductCharacteristicEntity } from './entities/wb-product-characteristic.entity';
import { WbProductSizeEntity } from './entities/wb-product-size.entity';
import { WbProductTagEntity } from './entities/wb-product-tag.entity';
import { WbProductWholesaleEntity } from './entities/wb-product-wholesale.entity';
import { SyncSnapshotsModule } from 'src/modules/sync/modules/sync-snapshots/sync-snapshots.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WbProductEntity,
            WbProductPhotoEntity,
            WbProductDimensionEntity,
            WbProductCharacteristicEntity,
            WbProductSizeEntity,
            WbProductTagEntity,
            WbProductWholesaleEntity,
        ]),
        HttpModule,
        SyncSnapshotsModule
    ],
    providers: [WbProductsService],
    exports: [WbProductsService],
})
export class WbProductsModule { }

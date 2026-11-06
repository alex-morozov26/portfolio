import { Injectable } from '@nestjs/common';
import { DataSourceEntity } from '../entities/data-source.entity';
import { DataSourceExtendedViewDto } from '../dto/data-source-extended-view.dto';

@Injectable()
export class DataSourcesExtendMapper {
    mapToView(dataSource: DataSourceEntity): DataSourceExtendedViewDto {
        return new DataSourceExtendedViewDto(dataSource);
    }
}

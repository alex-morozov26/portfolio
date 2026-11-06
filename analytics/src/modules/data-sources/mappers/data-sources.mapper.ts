import { Injectable } from '@nestjs/common';
import { DataSourceEntity } from '../entities/data-source.entity';
import { DataSourceViewDto } from '../dto/data-source-view.dto';

@Injectable()
export class DataSourcesMapper {
    mapToView(dataSource: DataSourceEntity): DataSourceViewDto {
        return new DataSourceViewDto(dataSource);
    }
}

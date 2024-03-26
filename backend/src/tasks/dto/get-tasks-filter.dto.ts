import { IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class FilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  status?: TaskStatus | any;
}

import { IsOptional, IsString } from 'class-validator';

export class GetTaskFilter {
  @IsOptional()
  @IsString()
  search?: string;
}

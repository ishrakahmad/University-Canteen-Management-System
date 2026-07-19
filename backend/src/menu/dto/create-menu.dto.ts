import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsBoolean()
  @IsNotEmpty()
  isAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  isAvailableToday?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  dailyQuantity?: number;

  @IsOptional()
  @IsString() 
  categoryId?: string;
}

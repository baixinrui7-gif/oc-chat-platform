import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  emoji?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  personality?: string;

  @IsString()
  @IsOptional()
  background?: string;

  @IsString()
  @IsOptional()
  greeting?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}

export class UpdateCharacterDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  emoji?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  personality?: string;

  @IsString()
  @IsOptional()
  background?: string;

  @IsString()
  @IsOptional()
  greeting?: string;
}

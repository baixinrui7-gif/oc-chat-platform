import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  characterId: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  title?: string;
}

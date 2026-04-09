import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto, UpdateCharacterDto } from './dto';

@Controller('api/characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.characterService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.characterService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateCharacterDto) {
    return this.characterService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCharacterDto) {
    return this.characterService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.characterService.remove(id);
  }
}

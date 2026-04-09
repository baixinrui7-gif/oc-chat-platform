import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto';

@Controller('api/conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  findAll(@Query('characterId') characterId?: string) {
    return this.conversationService.findAll(characterId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateConversationDto) {
    return this.conversationService.create(createDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(id);
  }
}

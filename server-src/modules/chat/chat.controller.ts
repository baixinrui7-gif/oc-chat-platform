import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  getMessages(@Query('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }

  @Post('send')
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.chatService.sendMessage(sendMessageDto);
  }
}

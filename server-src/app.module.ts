import { Module } from '@nestjs/common';
import { CharacterModule } from './modules/character/character.module';
import { ChatModule } from './modules/chat/chat.module';
import { ConversationModule } from './modules/conversation/conversation.module';

@Module({
  imports: [
    CharacterModule,
    ChatModule,
    ConversationModule,
  ],
})
export class AppModule {}

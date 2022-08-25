import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import V1Module from '../v1/v1.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'nestdb',
    }),
    V1Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

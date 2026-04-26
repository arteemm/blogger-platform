import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules/user-accounts/userAccounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggersPlatform.module';
import { TestingModule } from './modules/testing/testing.module';

const mongoURI =
  process.env.MONGO_URL || 'mongodb://localhost/nest-blogger-platform';
const dbName = 'home-task';

@Module({
  imports: [
    MongooseModule.forRoot(mongoURI + dbName),
    UserAccountsModule,
    BloggersPlatformModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

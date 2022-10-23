import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { User, UserSchema } from './user.schema'
import { CardsModule } from './card/cards.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI, {
      retryWrites: true,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      connectionFactory(connection) {
        if (connection.readyState === 1) {
          console.log('connected')
        }

        connection.on('disconnected', () => console.log('disconnect'))
        return connection
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

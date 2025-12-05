import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGO_URI || ''),

    ScheduleModule.forRoot(),
    WeatherModule,
    UsersModule,
    AuthModule,
    PokemonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

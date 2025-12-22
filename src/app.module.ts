import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
      validationSchema: Joi.object({
        MYSQLDB_HOST: Joi.string().required(),
        MYSQLDB_LOCAL_PORT: Joi.number().required(),
        MYSQLDB_USER: Joi.string().required(),
        MYSQL_ROOT_PASSWORD: Joi.string().required(),
        MYSQLDB_DATABASE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('MYSQLDB_HOST'),
          port: configService.get<number>('MYSQLDB_LOCAL_PORT'),
          username: configService.get('MYSQLDB_USER'),
          password: configService.get('MYSQL_ROOT_PASSWORD'),
          database: configService.get('MYSQLDB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
    UsersModule,
  ],
})
export class AppModule {}

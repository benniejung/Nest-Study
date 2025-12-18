import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: process.env.MYSQLDB_HOST,
//       port: Number(process.env.MYSQLDB_LOCAL_PORT),
//       username: process.env.MYSQLDB_USER,
//       password: process.env.MYSQLDB_PASSWORD,
//       database: process.env.MYSQLDB_DATABASE,
//     }),
//   ],
// })
// export class AppModule {}

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
        MYSQLDB_PASSWORD: Joi.string().required(),
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
          password: configService.get('MYSQLDB_PASSWORD'),
          database: configService.get('MYSQLDB_DATABASE'),
        };
      },
    }),
  ],
})
export class AppModule {}

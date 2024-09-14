import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'parcial-practico',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
  }),
    AerolineaModule,
    AeropuertoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

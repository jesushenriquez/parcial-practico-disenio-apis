import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aeropuerto } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoController } from './aeropuerto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aeropuerto])],
  providers: [AeropuertoService],
  controllers: [AeropuertoController],
  exports: [AeropuertoService],
})
export class AeropuertoModule {}

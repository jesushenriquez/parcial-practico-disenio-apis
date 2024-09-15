import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aeropuerto } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Aeropuerto])],
  providers: [AeropuertoService],
  controllers: [],
  exports: [AeropuertoService],
})
export class AeropuertoModule {}

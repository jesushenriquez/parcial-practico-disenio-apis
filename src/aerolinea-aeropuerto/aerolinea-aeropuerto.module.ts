import { Module } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from '../aerolinea/aerolinea.entity';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aerolinea, Aeropuerto])],
  providers: [AerolineaAeropuertoService],
  controllers: [],
})
export class AerolineaAeropuertoModule {}

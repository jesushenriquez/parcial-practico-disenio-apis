import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';

@Module({
  imports: [TypeOrmModule.forFeature([Aerolinea])],
  providers: [AerolineaService],
  controllers: [],
  exports: [AerolineaService],
})
export class AerolineaModule {}

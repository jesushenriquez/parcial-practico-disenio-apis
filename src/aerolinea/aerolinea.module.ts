import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aerolinea } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { AerolineaController } from './aerolinea.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aerolinea])],
  providers: [AerolineaService],
  controllers: [AerolineaController],
  exports: [AerolineaService],
})
export class AerolineaModule {}

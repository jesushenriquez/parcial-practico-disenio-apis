import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Controller('airlines')
export class AerolineaAeropuertoController {
  constructor(private readonly aerolineaAeropuertoService: AerolineaAeropuertoService) {}

  @Post(':aerolineaId/airports/:aeropuertoId')
  addAirportToAirline(
    @Param('aerolineaId') aerolineaId: number,
    @Param('aeropuertoId') aeropuertoId: number,
  ) {
    return this.aerolineaAeropuertoService.addAirportToAirline(
      aerolineaId,
      aeropuertoId,
    );
  }

  @Get(':aerolineaId/airports')
  findAirportsFromAirline(@Param('aerolineaId') aerolineaId: number) {
    return this.aerolineaAeropuertoService.findAirportsFromAirline(aerolineaId);
  }

  @Get(':aerolineaId/airports/:aeropuertoId')
  findAirportFromAirline(
    @Param('aerolineaId') aerolineaId: number,
    @Param('aeropuertoId') aeropuertoId: number,
  ) {
    return this.aerolineaAeropuertoService.findAirportFromAirline(
      aerolineaId,
      aeropuertoId,
    );
  }

  @Put(':aerolineaId/airports')
  updateAirportsFromAirline(
    @Param('aerolineaId') aerolineaId: number,
    @Body('aeropuertosIds') aeropuertosIds: number[],
  ) {
    return this.aerolineaAeropuertoService.updateAirportsFromAirline(
      aerolineaId,
      aeropuertosIds,
    );
  }

  @Delete(':aerolineaId/airports/:aeropuertoId')
  deleteAirportFromAirline(
    @Param('aerolineaId') aerolineaId: number,
    @Param('aeropuertoId') aeropuertoId: number,
  ) {
    return this.aerolineaAeropuertoService.deleteAirportFromAirline(aerolineaId, aeropuertoId);
  }
}

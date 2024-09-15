import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { Aerolinea } from './aerolinea.entity';

@Controller('airlines')
export class AerolineaController {
  constructor(private readonly aerolineaService: AerolineaService) {}

  @Get()
  findAll() {
    return this.aerolineaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.aerolineaService.findOne(id);
  }

  @Post()
  create(@Body() aerolinea: Aerolinea) {
    return this.aerolineaService.create(aerolinea);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() aerolinea: Aerolinea) {
    return this.aerolineaService.update(id, aerolinea);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.aerolineaService.delete(id);
  }
}

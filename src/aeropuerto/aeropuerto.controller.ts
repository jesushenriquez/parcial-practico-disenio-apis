import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { Aeropuerto } from './aeropuerto.entity';

@Controller('airports')
export class AeropuertoController {
  constructor(private readonly aeropuertoService: AeropuertoService) {}

  @Get()
  findAll() {
    return this.aeropuertoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.aeropuertoService.findOne(id);
  }

  @Post()
  create(@Body() aeropuerto: Aeropuerto) {
    return this.aeropuertoService.create(aeropuerto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() aeropuerto: Aeropuerto) {
    return this.aeropuertoService.update(id, aeropuerto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.aeropuertoService.delete(id);
  }
}

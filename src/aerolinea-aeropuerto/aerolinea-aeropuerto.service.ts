import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Aerolinea } from '../aerolinea/aerolinea.entity';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AerolineaAeropuertoService {
  constructor(
    @InjectRepository(Aerolinea)
    private readonly aerolineaRepository: Repository<Aerolinea>,
    @InjectRepository(Aeropuerto)
    private readonly aeropuertoRepository: Repository<Aeropuerto>,
  ) {}

  async addAirportToAirline(
    aerolineaId: number,
    aeropuertoId: number,
  ): Promise<Aerolinea> {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    const aeropuerto = await this.aeropuertoRepository.findOne({
      where: { id: aeropuertoId },
    });
    if (!aeropuerto) throw new NotFoundException('Aeropuerto no encontrado');

    aerolinea.aeropuertos.push(aeropuerto);
    return await this.aerolineaRepository.save(aerolinea);
  }

  async findAirportsFromAirline(aerolineaId: number): Promise<Aeropuerto[]> {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');
    return aerolinea.aeropuertos;
  }

  async findAirportFromAirline(
    aerolineaId: number,
    aeropuertoId: number,
  ): Promise<Aeropuerto> {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    const aeropuerto = aerolinea.aeropuertos.find((a) => a.id === aeropuertoId);
    if (!aeropuerto)
      throw new NotFoundException(
        'El aeropuerto no está asociado a la aerolínea',
      );

    return aeropuerto;
  }

  async updateAirportsFromAirline(
    aerolineaId: number,
    aeropuertosIds: number[],
  ): Promise<Aerolinea> {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    const aeropuertos =
      await this.aeropuertoRepository.findByIds(aeropuertosIds);
    if (aeropuertos.length !== aeropuertosIds.length)
      throw new NotFoundException('Uno o más aeropuertos no existen');

    aerolinea.aeropuertos = aeropuertos;
    return await this.aerolineaRepository.save(aerolinea);
  }

  async deleteAirportFromAirline(
    aerolineaId: number,
    aeropuertoId: number,
  ): Promise<void> {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id: aerolineaId },
      relations: ['aeropuertos'],
    });
    if (!aerolinea) throw new NotFoundException('Aerolínea no encontrada');

    const aeropuertoIndex = aerolinea.aeropuertos.findIndex(
      (a) => a.id === aeropuertoId,
    );
    if (aeropuertoIndex === -1)
      throw new NotFoundException(
        'El aeropuerto no está asociado a la aerolínea',
      );

    aerolinea.aeropuertos.splice(aeropuertoIndex, 1);
    await this.aerolineaRepository.save(aerolinea);
  }
}

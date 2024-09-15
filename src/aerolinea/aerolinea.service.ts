import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aerolinea } from './aerolinea.entity';

@Injectable()
export class AerolineaService {
  constructor(
    @InjectRepository(Aerolinea)
    private readonly aerolineaRepository: Repository<Aerolinea>,
  ) {}

  async findAll(): Promise<Aerolinea[]> {
    return await this.aerolineaRepository.find({ relations: ['aeropuertos'] });
  }

  async findOne(id: number): Promise<Aerolinea> {
    const aerolinea = await this.aerolineaRepository.findOne({
      where: { id },
      relations: ['aeropuertos'],
    });
    if (!aerolinea)
      throw new NotFoundException(`La aerolínea con ID ${id} no existe`);
    return aerolinea;
  }

  async create(aerolineaData: Aerolinea): Promise<Aerolinea> {
    if (new Date(aerolineaData.fechaFundacion) >= new Date())
      throw new BadRequestException(
        'La fecha de fundación debe ser en el pasado',
      );
    return await this.aerolineaRepository.save(aerolineaData);
  }

  async update(id: number, aerolineaData: Aerolinea): Promise<Aerolinea> {
    const aerolinea = await this.findOne(id);
    if (new Date(aerolineaData.fechaFundacion) >= new Date())
      throw new BadRequestException(
        'La fecha de fundación debe ser en el pasado',
      );
    Object.assign(aerolinea, aerolineaData);
    return await this.aerolineaRepository.save(aerolinea);
  }

  async delete(id: number): Promise<void> {
    const aerolinea = await this.findOne(id);
    await this.aerolineaRepository.remove(aerolinea);
  }
}

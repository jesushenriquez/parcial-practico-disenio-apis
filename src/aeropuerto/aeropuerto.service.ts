import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aeropuerto } from './aeropuerto.entity';

@Injectable()
export class AeropuertoService {
  constructor(
    @InjectRepository(Aeropuerto)
    private readonly aeropuertoRepository: Repository<Aeropuerto>,
  ) {}

  async findAll(): Promise<Aeropuerto[]> {
    return await this.aeropuertoRepository.find({ relations: ['aerolineas'] });
  }

  async findOne(id: number): Promise<Aeropuerto> {
    const aeropuerto = await this.aeropuertoRepository.findOne({
      where: { id },
      relations: ['aerolineas'],
    });
    if (!aeropuerto)
      throw new NotFoundException(`El aeropuerto con ID ${id} no existe`);
    return aeropuerto;
  }

  async create(aeropuertoData: Aeropuerto): Promise<Aeropuerto> {
    if (aeropuertoData.codigo.length !== 3)
      throw new BadRequestException(
        'El código del aeropuerto debe tener exactamente 3 caracteres',
      );
    return await this.aeropuertoRepository.save(aeropuertoData);
  }

  async update(id: number, aeropuertoData: Aeropuerto): Promise<Aeropuerto> {
    const aeropuerto = await this.findOne(id);
    if (aeropuertoData.codigo.length !== 3)
      throw new BadRequestException(
        'El código del aeropuerto debe tener exactamente 3 caracteres',
      );
    Object.assign(aeropuerto, aeropuertoData);
    return await this.aeropuertoRepository.save(aeropuerto);
  }

  async delete(id: number): Promise<void> {
    const aeropuerto = await this.findOne(id);
    await this.aeropuertoRepository.remove(aeropuerto);
  }
}

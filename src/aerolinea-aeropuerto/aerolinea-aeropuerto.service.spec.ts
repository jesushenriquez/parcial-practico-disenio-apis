import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';
import { Aerolinea } from '../aerolinea/aerolinea.entity';
import { Aeropuerto } from '../aeropuerto/aeropuerto.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('AerolineaAeropuertoService', () => {
  let service: AerolineaAeropuertoService;
  let aerolineaRepository: Repository<Aerolinea>;
  let aeropuertoRepository: Repository<Aeropuerto>;

  const aerolinea: Aerolinea = {
    id: 1,
    nombre: 'Aerolínea 1',
    descripcion: 'Descripción 1',
    fechaFundacion: new Date('2000-01-01'),
    paginaWeb: 'http://aerolinea1.com',
    aeropuertos: [],
  };

  const aeropuerto: Aeropuerto = {
    id: 1,
    nombre: 'Aeropuerto 1',
    codigo: 'ABC',
    pais: 'Colombia',
    ciudad: 'Bogotá',
    aerolineas: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AerolineaAeropuertoService,
        {
          provide: getRepositoryToken(Aerolinea),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Aeropuerto),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AerolineaAeropuertoService>(AerolineaAeropuertoService);
    aerolineaRepository = module.get<Repository<Aerolinea>>(getRepositoryToken(Aerolinea));
    aeropuertoRepository = module.get<Repository<Aeropuerto>>(getRepositoryToken(Aeropuerto));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('addAirportToAirline', () => {
    it('debería asociar un aeropuerto a una aerolínea', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue({
        ...aerolinea,
        aeropuertos: [],
      });
      jest.spyOn(aeropuertoRepository, 'findOne').mockResolvedValue(aeropuerto);
      jest.spyOn(aerolineaRepository, 'save').mockResolvedValue({
        ...aerolinea,
        aeropuertos: [aeropuerto],
      });

      const result = await service.addAirportToAirline(1, 1);
      expect(result.aeropuertos).toContain(aeropuerto);
    });

    it('debería lanzar NotFoundException si la aerolínea no existe', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addAirportToAirline(1, 1)).rejects.toThrow(
        new NotFoundException('Aerolínea no encontrada'),
      );
    });

    it('debería lanzar NotFoundException si el aeropuerto no existe', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(aerolinea);
      jest.spyOn(aeropuertoRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addAirportToAirline(1, 1)).rejects.toThrow(
        new NotFoundException('Aeropuerto no encontrado'),
      );
    });
  });

  describe('findAirportsFromAirline', () => {
    it('debería retornar los aeropuertos asociados a una aerolínea', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue({
        ...aerolinea,
        aeropuertos: [aeropuerto],
      });

      const aeropuertos = await service.findAirportsFromAirline(1);
      expect(aeropuertos).toEqual([aeropuerto]);
    });

    it('debería lanzar NotFoundException si la aerolínea no existe', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findAirportsFromAirline(1)).rejects.toThrow(
        new NotFoundException('Aerolínea no encontrada'),
      );
    });
  });

  describe('findAirportFromAirline', () => {
    it('debería retornar un aeropuerto asociado a una aerolínea', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue({
        ...aerolinea,
        aeropuertos: [aeropuerto],
      });

      const result = await service.findAirportFromAirline(1, 1);
      expect(result).toEqual(aeropuerto);
    });

    it('debería lanzar NotFoundException si la aerolínea no existe', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findAirportFromAirline(1, 1)).rejects.toThrow(
        new NotFoundException('Aerolínea no encontrada'),
      );
    });

    it('debería lanzar NotFoundException si el aeropuerto no está asociado', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue({
        ...aerolinea,
        aeropuertos: [],
      });

      await expect(service.findAirportFromAirline(1, 1)).rejects.toThrow(
        new NotFoundException('El aeropuerto no está asociado a la aerolínea'),
      );
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('debería actualizar los aeropuertos asociados a una aerolínea', async () => {
      const nuevosAeropuertos = [aeropuerto];

      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(aerolinea);
      jest.spyOn(aeropuertoRepository, 'findByIds').mockResolvedValue(nuevosAeropuertos);
      jest.spyOn(aerolineaRepository, 'save').mockResolvedValue({
        ...aerolinea,
        aeropuertos: nuevosAeropuertos,
      });

      const result = await service.updateAirportsFromAirline(1, [1]);
      expect(result.aeropuertos).toEqual(nuevosAeropuertos);
    });

    it('debería lanzar NotFoundException si la aerolínea no existe', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateAirportsFromAirline(1, [1])).rejects.toThrow(
        new NotFoundException('Aerolínea no encontrada'),
      );
    });

    it('debería lanzar NotFoundException si uno o más aeropuertos no existen', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(aerolinea);
      jest.spyOn(aeropuertoRepository, 'findByIds').mockResolvedValue([]);

      await expect(service.updateAirportsFromAirline(1, [1])).rejects.toThrow(
        new NotFoundException('Uno o más aeropuertos no existen'),
      );
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('debería eliminar el aeropuerto asociado a la aerolínea', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue({
        ...aerolinea,
        aeropuertos: [aeropuerto],
      });
      jest.spyOn(aerolineaRepository, 'save').mockResolvedValue(aerolinea);

      await expect(service.deleteAirportFromAirline(1, 1)).resolves.toBeUndefined();
    });

    it('debería lanzar NotFoundException si la aerolínea no existe', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteAirportFromAirline(1, 1)).rejects.toThrow(
        new NotFoundException('Aerolínea no encontrada'),
      );
    });

    it('debería lanzar NotFoundException si el aeropuerto no está asociado', async () => {
      jest.spyOn(aerolineaRepository, 'findOne').mockResolvedValue({
        ...aerolinea,
        aeropuertos: [],
      });

      await expect(service.deleteAirportFromAirline(1, 1)).rejects.toThrow(
        new NotFoundException('El aeropuerto no está asociado a la aerolínea'),
      );
    });
  });
});

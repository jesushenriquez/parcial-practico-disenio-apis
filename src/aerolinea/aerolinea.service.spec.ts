// aerolinea.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { Aerolinea } from './aerolinea.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<Aerolinea>;

  const aerolineaArray: Aerolinea[] = [
    {
      id: 1,
      nombre: 'Aerolínea 1',
      descripcion: 'Descripción 1',
      fechaFundacion: new Date('2000-01-01'),
      paginaWeb: 'http://aerolinea1.com',
      aeropuertos: [],
    },
    {
      id: 2,
      nombre: 'Aerolínea 2',
      descripcion: 'Descripción 2',
      fechaFundacion: new Date('1995-05-15'),
      paginaWeb: 'http://aerolinea2.com',
      aeropuertos: [],
    },
  ];

  const oneAerolinea: Aerolinea = {
    id: 1,
    nombre: 'Aerolínea 1',
    descripcion: 'Descripción 1',
    fechaFundacion: new Date('2000-01-01'),
    paginaWeb: 'http://aerolinea1.com',
    aeropuertos: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AerolineaService,
        {
          provide: getRepositoryToken(Aerolinea),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<Aerolinea>>(
      getRepositoryToken(Aerolinea),
    );
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar un array de aerolíneas', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(aerolineaArray);
      const aerolineas = await service.findAll();
      expect(aerolineas).toEqual(aerolineaArray);
    });
  });

  describe('findOne', () => {
    it('debería retornar una aerolínea por ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(oneAerolinea);
      const aerolinea = await service.findOne(1);
      expect(aerolinea).toEqual(oneAerolinea);
    });

    it('debería lanzar NotFoundException si la aerolínea no existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('La aerolínea con ID 1 no existe'),
      );
    });
  });

  describe('create', () => {
    it('debería crear y retornar una nueva aerolínea', async () => {
      const aerolineaData = {
        nombre: 'Aerolínea Nueva',
        descripcion: 'Descripción Nueva',
        fechaFundacion: new Date('1990-01-01'),
        paginaWeb: 'http://aerolineanueva.com',
      } as Aerolinea;

      jest.spyOn(repository, 'save').mockResolvedValue({
        id: 3,
        ...aerolineaData,
        aeropuertos: [],
      });

      const nuevaAerolinea = await service.create(aerolineaData);
      expect(nuevaAerolinea).toEqual({
        id: 3,
        ...aerolineaData,
        aeropuertos: [],
      });
    });

    it('debería lanzar BadRequestException si la fecha de fundación es en el futuro', async () => {
      const aerolineaData = {
        nombre: 'Aerolínea Futura',
        descripcion: 'Descripción Futura',
        fechaFundacion: new Date('3000-01-01'),
        paginaWeb: 'http://aerolineafutura.com',
      } as Aerolinea;

      await expect(service.create(aerolineaData)).rejects.toThrow(
        new BadRequestException('La fecha de fundación debe ser en el pasado'),
      );
    });
  });

  describe('update', () => {
    it('debería actualizar y retornar la aerolínea actualizada', async () => {
      const aerolineaData = {
        nombre: 'Aerolínea Actualizada',
        descripcion: 'Descripción Actualizada',
        fechaFundacion: new Date('1980-01-01'),
        paginaWeb: 'http://aerolineaactualizada.com',
      } as Aerolinea;

      jest.spyOn(service, 'findOne').mockResolvedValue(oneAerolinea);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...oneAerolinea,
        ...aerolineaData,
      });

      const updatedAerolinea = await service.update(1, aerolineaData);
      expect(updatedAerolinea).toEqual({
        ...oneAerolinea,
        ...aerolineaData,
      });
    });

    it('debería lanzar BadRequestException si la fecha de fundación es en el futuro', async () => {
      const aerolineaData = {
        nombre: 'Aerolínea Futura',
        descripcion: 'Descripción Futura',
        fechaFundacion: new Date('3000-01-01'),
        paginaWeb: 'http://aerolineafutura.com',
      } as Aerolinea;

      jest.spyOn(service, 'findOne').mockResolvedValue(oneAerolinea);

      await expect(service.update(1, aerolineaData)).rejects.toThrow(
        new BadRequestException('La fecha de fundación debe ser en el pasado'),
      );
    });

    it('debería lanzar NotFoundException si la aerolínea no existe', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('La aerolínea con ID 1 no existe'));

      const aerolineaData = {
        nombre: 'Aerolínea Nueva',
        descripcion: 'Descripción Nueva',
        fechaFundacion: new Date('1990-01-01'),
        paginaWeb: 'http://aerolineanueva.com',
      } as Aerolinea;

      await expect(service.update(1, aerolineaData)).rejects.toThrow(
        new NotFoundException('La aerolínea con ID 1 no existe'),
      );
    });
  });

  describe('delete', () => {
    it('debería eliminar la aerolínea', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(oneAerolinea);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await expect(service.delete(1)).resolves.toBeUndefined();
    });

    it('debería lanzar NotFoundException si la aerolínea no existe', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('La aerolínea con ID 1 no existe'));

      await expect(service.delete(1)).rejects.toThrow(
        new NotFoundException('La aerolínea con ID 1 no existe'),
      );
    });
  });
});

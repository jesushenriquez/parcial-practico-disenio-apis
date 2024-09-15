import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { Aeropuerto } from './aeropuerto.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<Aeropuerto>;

  const aeropuertoArray: Aeropuerto[] = [
    {
      id: 1,
      nombre: 'Aeropuerto Internacional',
      codigo: 'ABC',
      pais: 'Colombia',
      ciudad: 'Bogotá',
      aerolineas: [],
    },
    {
      id: 2,
      nombre: 'Aeropuerto Nacional',
      codigo: 'DEF',
      pais: 'Colombia',
      ciudad: 'Medellín',
      aerolineas: [],
    },
  ];

  const oneAeropuerto: Aeropuerto = {
    id: 1,
    nombre: 'Aeropuerto Internacional',
    codigo: 'ABC',
    pais: 'Colombia',
    ciudad: 'Bogotá',
    aerolineas: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AeropuertoService,
        {
          provide: getRepositoryToken(Aeropuerto),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<Aeropuerto>>(getRepositoryToken(Aeropuerto));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar un array de aeropuertos', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(aeropuertoArray);
      const aeropuertos = await service.findAll();
      expect(aeropuertos).toEqual(aeropuertoArray);
    });
  });

  describe('findOne', () => {
    it('debería retornar un aeropuerto por ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(oneAeropuerto);
      const aeropuerto = await service.findOne(1);
      expect(aeropuerto).toEqual(oneAeropuerto);
    });

    it('debería lanzar NotFoundException si el aeropuerto no existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('El aeropuerto con ID 1 no existe'),
      );
    });
  });

  describe('create', () => {
    it('debería crear y retornar un nuevo aeropuerto', async () => {
      const aeropuertoData = {
        nombre: 'Nuevo Aeropuerto',
        codigo: 'GHI',
        pais: 'Colombia',
        ciudad: 'Cali',
      } as Aeropuerto;

      jest.spyOn(repository, 'save').mockResolvedValue({
        id: 3,
        ...aeropuertoData,
        aerolineas: [],
      });

      const nuevoAeropuerto = await service.create(aeropuertoData);
      expect(nuevoAeropuerto).toEqual({
        id: 3,
        ...aeropuertoData,
        aerolineas: [],
      });
    });

    it('debería lanzar BadRequestException si el código no tiene 3 caracteres', async () => {
      const aeropuertoData = {
        nombre: 'Aeropuerto Inválido',
        codigo: 'INVALID',
        pais: 'Colombia',
        ciudad: 'Cartagena',
      } as Aeropuerto;

      await expect(service.create(aeropuertoData)).rejects.toThrow(
        new BadRequestException(
          'El código del aeropuerto debe tener exactamente 3 caracteres',
        ),
      );
    });
  });

  describe('update', () => {
    it('debería actualizar y retornar el aeropuerto actualizado', async () => {
      const aeropuertoData = {
        nombre: 'Aeropuerto Actualizado',
        codigo: 'JKL',
        pais: 'Colombia',
        ciudad: 'Barranquilla',
      } as Aeropuerto;

      jest.spyOn(service, 'findOne').mockResolvedValue(oneAeropuerto);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...oneAeropuerto,
        ...aeropuertoData,
      });

      const updatedAeropuerto = await service.update(1, aeropuertoData);
      expect(updatedAeropuerto).toEqual({
        ...oneAeropuerto,
        ...aeropuertoData,
      });
    });

    it('debería lanzar BadRequestException si el código no tiene 3 caracteres', async () => {
      const aeropuertoData = {
        nombre: 'Aeropuerto Inválido',
        codigo: 'TOO LONG',
        pais: 'Colombia',
        ciudad: 'Pereira',
      } as Aeropuerto;

      jest.spyOn(service, 'findOne').mockResolvedValue(oneAeropuerto);

      await expect(service.update(1, aeropuertoData)).rejects.toThrow(
        new BadRequestException(
          'El código del aeropuerto debe tener exactamente 3 caracteres',
        ),
      );
    });

    it('debería lanzar NotFoundException si el aeropuerto no existe', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('El aeropuerto con ID 1 no existe'));

      const aeropuertoData = {
        nombre: 'Aeropuerto Nuevo',
        codigo: 'MNO',
        pais: 'Colombia',
        ciudad: 'Manizales',
      } as Aeropuerto;

      await expect(service.update(1, aeropuertoData)).rejects.toThrow(
        new NotFoundException('El aeropuerto con ID 1 no existe'),
      );
    });
  });

  describe('delete', () => {
    it('debería eliminar el aeropuerto', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(oneAeropuerto);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await expect(service.delete(1)).resolves.toBeUndefined();
    });

    it('debería lanzar NotFoundException si el aeropuerto no existe', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException('El aeropuerto con ID 1 no existe'),
        );

      await expect(service.delete(1)).rejects.toThrow(
        new NotFoundException('El aeropuerto con ID 1 no existe'),
      );
    });
  });
});

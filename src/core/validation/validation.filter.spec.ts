import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { ValidationException, ValidationFilter } from './validation.filter';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('System header validation service', () => {
  let service: ValidationFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationFilter],
    }).compile();
    service = module.get<ValidationFilter>(ValidationFilter);
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Http exception', () => {
      service.catch(
        new ValidationException({
          errors: { start_time: ['test error 1', 'test error 2'] },
        }),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockHttpArgumentsHost).toBeCalledWith();
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledWith();
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        error: {
          errors: {
            start_time: ['test error 1', 'test error 2'],
          },
        },
        message: '',
        statusCode: 400,
        success: false,
      });
    });
  });
});

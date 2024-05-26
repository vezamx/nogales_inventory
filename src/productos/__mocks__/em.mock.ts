export const mockedEm = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  persistAndFlush: jest.fn(),
  findOneOrFail: jest.fn(),
  assign: jest.fn(),
};

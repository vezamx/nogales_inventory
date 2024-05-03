import { compareSync } from 'bcrypt';
import { generarLlaveEmpleado } from './userinformation';

describe('Users helpers', () => {
  beforeAll(async () => {
    //setup environment variables
    require('dotenv').config();
  });

  describe('generarLlaveEmpleado', () => {
    it('should generate a hash', async () => {
      const name = 'test';
      const numEmpleado = 1;
      const llaveEmpleado = `${name}${numEmpleado}`;
      const hash = await generarLlaveEmpleado(name, numEmpleado);
      expect(hash).toBeDefined();
      expect(compareSync(llaveEmpleado, hash)).toBe(true);
    });
  });
});

import { hash } from 'bcrypt';
require('dotenv').config();

export const generarLlaveEmpleado = async (
  name: string,
  numEmpleado: number,
) => {
  const llaveEmpleado = `${name}${numEmpleado}`;
  return hash(llaveEmpleado, parseInt(process.env.SALT_ROUNDS));
};

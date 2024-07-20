export const ERROR_MESSAGES = {
  BAD_REQUEST: 'La solicitud no pudo ser procesada.',
  FORBIDDEN: 'No tienes permisos para acceder a este recurso.',
  INVALID_OPERATION: 'Operación no válida.',
  NOT_FOUND: 'El recurso solicitado existe.',
  INTERNAL_SERVER_ERROR:
    'La operación no pudo ser completada. Inténtalo más tarde.',
  CONTENT_DUPLICATED: 'El contenido ya existe.',
  PRODUCT_NOT_FOUND: 'Producto no encontrado.',
  COMANDA_CLOSED: 'La comanda ya ha sido cerrada.',
  MESA_HAS_COMANDAS: 'La mesa tiene comandas activas.',
  WARNING_SECTIONS_DELETE:
    'La sección fue eliminaram con exito, sin embargo, las mesas asignadas a esta seccion fueron eliminadas igualmente.',
  MESA_HAS_COMANDA:
    'La mesa ya tiene una comanda abierta. Si deseas aabrir una comanda en esa mesa, separa la mesa en dos comandas.',
};

export const MODELS = {
  INSUMOS: 'Insumos',
  USERS: 'Users',
  PRODUCTOS: 'Productos',
};

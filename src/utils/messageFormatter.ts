export const FormatResourceChangeMessage = (
  resourceName: string,
  action: 'create' | 'delete' | 'update',
) => {
  switch (action) {
    case 'create':
      return `Se ha creado un recursos de tipo ${resourceName}`;
    case 'delete':
      return `Se ha eliminado un recursos de tipo ${resourceName}`;
    case 'update':
      return `Se ha actualizado un recursos de tipo ${resourceName}`;
    default:
      return `Se ha modificado un recursos de tipo ${resourceName}`;
  }
};

import PermissionService from "../service/permissions";
import PERMISSION from "../repository/permissions";

const getPermissions = {
  method: 'GET',
  path: '/permissions',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.PERMISSIONS_READ);

    return await PermissionService.getPermissions();
  },
};

const userPermissions = {
  method: 'GET',
  path: '/users/{id}/permissions',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.PERMISSIONS_READ);

    return await PermissionService.getDerivedUserPermissions(request.params.id);
  },
};

export default [
  getPermissions,
  userPermissions,
];
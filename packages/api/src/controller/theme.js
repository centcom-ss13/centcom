import ThemeService from '../service/theme';
import PermissionService from "../service/permissions";
import PERMISSION from "../repository/permissions";

const getTheme = {
  method: 'GET',
  path: '/theme',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.THEME_VIEW);

    return await ThemeService.getTheme();
  },
};

const editTheme = {
  method: 'PUT',
  path: '/theme/{id}',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.THEME_EDIT);

    const id = parseInt(request.params.id, 10);

    return await ThemeService.editTheme(id, request.payload.input, request.payload.sender_id);
  },
};

const deleteTheme = {
  method: 'DELETE',
  path: '/theme/{id}',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.THEME_EDIT);

    return await ThemeService.deleteTheme(request.params.id);
  },
};

const createTheme = {
  method: 'POST',
  path: '/theme',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.THEME_EDIT);

    return await ThemeService.createTheme(request.payload.input, request.payload.sender_id);
  },
};

const getUserThemes = {
  method: 'GET',
  path: '/users/:userId/theme',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.USER_THEME_READ);

    return await ThemeService.getUserTheme(request.params.id);
  },
};

const setUserTheme = {
  method: 'PUT',
  path: '/users/:userId/theme/:themeId',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.USER_THEME_EDIT);

    return await ThemeService.setUserTheme(
      request.params.userId,
      request.params.themeId,
      request.payload
    );
  },
};

export default [
  getTheme,
  createTheme,
  editTheme,
  deleteTheme,
  getUserThemes,
  setUserTheme,
];
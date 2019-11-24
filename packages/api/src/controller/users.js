import UserService from '../service/users';
import GroupService from '../service/groups';
import { stripKeysFromObject } from "../util/queryUtils";
import { decryptUserSecrets } from '../mapper/user';
import PermissionService from "../service/permissions";
import PERMISSION from "../repository/permissions";
import { getUserId } from '../util/request';

const getUser = {
  method: 'GET',
  path: '/users/{id}',
  handler: async function (request, h) {
    const requestingUserId = await getUserId(request);
    const id = request.params.id;

    if(requestingUserId === id) {
      await PermissionService.requiresPermission(request, PERMISSION.USER_READ_OWN);
    } else {
      await PermissionService.requiresPermission(request, PERMISSION.USER_READ_ANY);
    }

    const user = await UserService.getUser(id);

    const prunedUser = stripKeysFromObject(user, ['password']);

    return prunedUser;
  },
};

const getUsers = {
  method: 'GET',
  path: '/users',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.USER_READ_ANY);

    const users = await UserService.getUsers();

    const prunedUsers = users.map(user => stripKeysFromObject(user, ['password']));

    return prunedUsers;
  },
};

const editUser = {
  method: 'PUT',
  path: '/users/{id}',
  handler: async function (request, h) {
    const requestingUserId = await getUserId(request);
    const id = parseInt(request.params.id, 10);

    if(requestingUserId === id) {
      await PermissionService.requiresAnyPermission(request, [PERMISSION.USER_EDIT_ANY, PERMISSION.USER_EDIT_OWN]);
    } else {
      await PermissionService.requiresPermission(request, PERMISSION.USER_EDIT_ANY);
    }

    const decryptedUser = await decryptUserSecrets(request.payload.input);

    return await UserService.editUser(id, decryptedUser);
  },
};

const deleteUser = {
  method: 'DELETE',
  path: '/users/{id}',
  handler: async function (request, h) {
    const requestingUserId = await getUserId(request);
    const id = request.params.id;

    if(requestingUserId === id) {
      await PermissionService.requiresPermission(request, PERMISSION.USER_DELETE_OWN);
    } else {
      await PermissionService.requiresPermission(request, PERMISSION.USER_DELETE_ANY);
    }

    return await UserService.deleteUser(id);
  },
};

const createUser = {
  method: 'POST',
  path: '/users',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.USER_CREATE);

    const { input, sender_id } = request.payload;

    const {
      permissions = [],
      groups = [],
    } = input;

    await PermissionService.requiresAllPermissions(request, permissions);

    const decryptedUser = await decryptUserSecrets(request.payload.input, request.payload.sender_id);

    return await UserService.createUser(decryptedUser);
  },
};


export default [
  getUser,
  getUsers,
  editUser,
  deleteUser,
  createUser,
];
import GroupService from '../service/groups';
import PermissionService from "../service/permissions";
import PERMISSION from "../repository/permissions";

const getGroup = {
  method: 'GET',
  path: '/groups/{id}',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(PERMISSION.GROUP_READ);

    return await GroupService.getGroup(request.params.id);
  },
};

const getGroups = {
  method: 'GET',
  path: '/groups',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.GROUP_READ);

    return await GroupService.getGroups();
  },
};

const editGroup = {
  method: 'PUT',
  path: '/groups/{id}',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.GROUP_READ);

    const id = parseInt(request.params.id, 10);

    return await GroupService.editGroup(id, request.payload.input, request.payload.sender_id);
  },
};

const deleteGroup = {
  method: 'DELETE',
  path: '/groups/{id}',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.GROUP_DELETE);

    return await GroupService.deleteGroup(request.params.id);
  },
};

const createGroup = {
  method: 'POST',
  path: '/groups',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.GROUP_CREATE);

    return await GroupService.createGroup(request.payload.input, request.payload.sender_id);
  },
};

const groupsForUser = {
  method: 'GET',
  path: '/users/{id}/groups',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.GROUP_READ);

    return await GroupService.getGroupsForUser(request.params.id);
  },
};

export default [
  getGroup,
  getGroups,
  editGroup,
  deleteGroup,
  createGroup,
  groupsForUser,
];
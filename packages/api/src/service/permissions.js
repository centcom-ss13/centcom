import UserPermissionRepository from '../repository/userPermissions';
import GroupRepository from '../repository/userGroups';
import GroupPermissionRepository from '../repository/userGroupPermissions';
import Boom from '@hapi/boom';
import permissions from '../repository/permissions';
import { getUserId } from '../util/request';
import { unique, flatMap } from '../util/arrayUtils';

function getDefaultPermissions() {
  return Object.values(permissions)
    .filter(({ granted }) => granted)
    .map(({ name }) => name);
}

function isDefaultPermission(permission) {
  return getDefaultPermissions().some(name => permission.name === name);
}

async function getDerivedUserPermissions(user_id) {
  const [
    userPermissions,
    userGroups,
    allUserGroupPermissions,
  ] = await Promise.all([
    UserPermissionRepository.getPermissionsForUser(user_id),
    GroupRepository.getGroupsForUser(user_id),
    GroupPermissionRepository.getAllGroupPermissions(),
  ]);

  const aggregatedPermissions = unique([
    ...getDefaultPermissions(),
    ...userPermissions,
    ...(allUserGroupPermissions
      .filter(({ group_id }) =>
        userGroups
          .map(({ id }) => id)
          .includes(group_id))
      .map(({ permission }) => permission)),
  ]);

  return aggregatedPermissions;
}

function getPermissions() {
  return permissions;
}

async function doesUserHavePermission(user_id, permission) {
  if (isDefaultPermission(permission)) {
    return true;
  } else if (user_id === undefined || user_id === null) {
    return false;
  }
  const derivedPermissions = await getDerivedUserPermissions(user_id);

  return derivedPermissions.some(checkPermission => checkPermission === permission.name);
}

async function doesUserHaveAllPermissions(user_id, permissions) {
  if (permissions.every(permission => isDefaultPermission(permission))) {
    return true;
  } else if (user_id === undefined || user_id === null) {
    return false;
  }
  const derivedPermissions = await getDerivedUserPermissions(user_id);

  return permissions
    .map(({ name }) => name)
    .every(checkPermission =>
      derivedPermissions.includes(checkPermission));
}

async function doesUserHaveAnyPermission(user_id, permissions) {
  if (permissions.some(permission => isDefaultPermission(permission))) {
    return true;
  } else if (user_id === undefined || user_id === null) {
    return false;
  }
  const derivedPermissions = await getDerivedUserPermissions(user_id);

  return permissions
    .map(({ name }) => name)
    .some(checkPermission =>
      derivedPermissions.includes(checkPermission));
}

async function doesRequestHavePermission(request, permission) {
  const userId = await getUserId(request);

  return doesUserHavePermission(userId, permission);
}

async function doesRequestHaveAllPermissions(request, permissions) {
  const userId = await getUserId(request);

  return doesUserHaveAllPermissions(userId, permissions);
}

async function doesRequestHaveAnyPermission(request, permissions) {
  const userId = await getUserId(request);

  return doesUserHaveAnyPermission(userId, permissions);
}

async function requiresPermission(request, permission) {
  const userId = await getUserId(request);
  if (await doesUserHavePermission(userId, permission)) {
    return true;
  } else {
    throw Boom.forbidden(`User does not have permission: ${permission.name}`)
  }
}

async function requiresAllPermissions(request, permissions) {
  const userId = await getUserId(request);
  if (await doesUserHaveAllPermissions(userId, permissions)) {
    return true;
  } else {
    throw Boom.unauthorized()
  }
}

async function requiresAnyPermission(request, permissions) {
  const userId = await getUserId(request);
  if (await doesUserHaveAnyPermission(userId, permissions)) {
    return true;
  } else {
    throw Boom.unauthorized(`User does not have any permission: ${JSON.stringify(permissions.map(({ name }) => name))}`)
  }
}

export default {
  getDerivedUserPermissions,
  doesUserHavePermission,
  doesUserHaveAllPermissions,
  doesUserHaveAnyPermission,
  requiresPermission,
  requiresAllPermissions,
  requiresAnyPermission,
  getPermissions,
  doesRequestHavePermission,
  doesRequestHaveAllPermissions,
  doesRequestHaveAnyPermission,
};
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

async function doesUserHavePermissions(user_id, permissions) {
  if (permissions.every(permission => isDefaultPermission(permission))) {
    return true;
  } else if (user_id === undefined || user_id === null) {
    return false;
  }
  const derivedPermissions = await getDerivedUserPermissions(user_id);

  return permissions.map(({ name }) => name).every(checkPermission => derivedPermissions.includes(checkPermission));
}

async function requiresPermission(request, permission) {
  const userId = await getUserId(request);
  if (await doesUserHavePermission(userId, permission)) {
    return true;
  } else {
    throw Boom.unauthorized(`User does not have permission: ${permission.name}`)
  }
}

async function requiresPermissions(request, permissions) {
  const userId = await getUserId(request);
  if (await doesUserHavePermissions(userId, permissions)) {
    return true;
  } else {
    throw Boom.unauthorized(`User does not have permissions: ${JSON.stringify(permissions.map(({ name }) => name))}`)
  }
}

export default {
  getDerivedUserPermissions,
  doesUserHavePermission,
  doesUserHavePermissions,
  requiresPermission,
  requiresPermissions,
  getPermissions,
};
import GroupRepository from '../repository/userGroups';
import GroupPermissionRepository from '../repository/userGroupPermissions';
import {getDB} from "../broker/database";
import { getUserId } from "../util/request";
import Boom from "@hapi/boom";

const db = getDB();

async function getGroup(id) {
  const [
    group,
    permissions,
  ] = await Promise.all([
    GroupRepository.getGroup(id),
    GroupPermissionRepository.getPermissionsForGroup(id),
  ]);

  return {
    ...group,
    permissions,
  };
}

async function getGroups() {
  const [
    groups,
    groupPermissions,
  ] = await Promise.all([
    GroupRepository.getGroups(),
    GroupPermissionRepository.getAllGroupPermissions(),
  ]);

  return groups.map(group => {
    const currentGroupPermissions = groupPermissions
    .filter(({ group_id }) => group_id === group.id)
    .map(({ permission }) => permission);

    return {
      ...group,
      permissions: currentGroupPermissions,
    };
  });
}

async function getGroupsForUser(user_id) {
  return await GroupRepository.getGroupsForUser(user_id);
}

async function editGroup(id, { name, description, permissions = [] }) {
  return await db.transaction(async () => {
    const groupEditFuture = GroupRepository.editGroup(id, { name, description });

    const groupCurrentPermissions = await GroupPermissionRepository.getPermissionsForGroup(id);

    const newGroupPermissions = permissions.filter(permission => !groupCurrentPermissions.includes(permission));
    const removedGroupPermissions = groupCurrentPermissions.filter(permission => !permissions.includes(permission));

    const permissionAddFutures = newGroupPermissions.map(permission => GroupPermissionRepository.addPermissionToGroup(id, permission));
    const permissionRemoveFutures = removedGroupPermissions.map(permission => GroupPermissionRepository.removePermissionFromGroup(id, permission));

    const results = Promise.all([
      groupEditFuture,
      ...permissionAddFutures,
      ...permissionRemoveFutures,
    ]);

    return results;
  });
}

async function deleteGroup(id) {
  return await GroupRepository.deleteGroup(id);
}

async function createGroup({ name, description, permissions = [] }) {
  return await db.transaction(async () => {
    const group = await GroupRepository.createGroup({ name, description });

    const permissionAddFutures = permissions.map(permission => GroupPermissionRepository.addPermissionToGroup(group.id, permission));

    const results = Promise.all([
      ...permissionAddFutures,
    ]);

    return results;
  });
}

async function doesUserHaveGroup(user_id, group) {
  if (user_id === undefined || user_id === null) {
    return false;
  }
  const userGroups = await getGroupsForUser(user_id);

  return userGroups.some(checkGroup => checkGroup === group.name);
}

async function doesUserHaveAllGroups(user_id, groups) {
  if (user_id === undefined || user_id === null) {
    return false;
  }
  const userGroups = await getGroupsForUser(user_id);

  return groups.map(({ name }) => name).every(checkGroup => userGroups.includes(checkGroup));
}

async function doesUserHaveAnyGroup(user_id, groups) {
  if (user_id === undefined || user_id === null) {
    return false;
  }
  const userGroups = await getGroupsForUser(user_id);

  return groups.map(({ name }) => name).some(checkGroup => userGroups.includes(checkGroup));
}

async function doesRequestHaveGroup(request, group) {
  const userId = await getUserId(request);

  return doesUserHaveGroup(userId, group);
}

async function doesRequestHaveAllGroups(request, groups) {
  const userId = await getUserId(request);

  return doesUserHaveAllGroups(userId, groups);
}

async function doesRequestHaveAnyGroup(request, groups) {
  const userId = await getUserId(request);

  return doesUserHaveAnyGroup(userId, groups);
}

async function requiresGroup(request, group) {
  const userId = await getUserId(request);
  if (await doesUserHaveGroup(userId, group)) {
    return true;
  } else {
    throw Boom.forbidden(`User does not have group: ${group.name}`)
  }
}

async function requiresAllGroups(request, groups) {
  const userId = await getUserId(request);
  if (await doesUserHaveAllGroups(userId, groups)) {
    return true;
  } else {
    throw Boom.unauthorized()
  }
}

async function requiresAnyGroup(request, groups) {
  const userId = await getUserId(request);
  if (await doesUserHaveAnyGroup(userId, groups)) {
    return true;
  } else {
    throw Boom.unauthorized(`User does not have any group: ${JSON.stringify(groups.map(({ name }) => name))}`)
  }
}

export default {
  getGroup,
  getGroups,
  editGroup,
  deleteGroup,
  createGroup,
  getGroupsForUser,
  doesRequestHaveGroup,
  doesRequestHaveAllGroups,
  doesRequestHaveAnyGroup,
  requiresGroup,
  requiresAllGroups,
  requiresAnyGroup,
}
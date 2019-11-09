import JobService from '../service/jobs';
import PermissionService from "../service/permissions";
import PERMISSION from "../repository/permissions";

const getJobs = {
  method: 'GET',
  path: '/jobs',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.JOB_READ);

    return await JobService.getJobs();
  },
};

const editJob = {
  method: 'PUT',
  path: '/jobs/{id}',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.JOB_EDIT);

    const id = parseInt(request.params.id, 10);

    return await JobService.editJob(id, request.payload.input, request.payload.sender_id);
  },
};

const deleteJob = {
  method: 'DELETE',
  path: '/jobs/{id}',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.JOB_DELETE);

    return await JobService.deleteJob(request.params.id);
  },
};

const createJob = {
  method: 'POST',
  path: '/jobs',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.JOB_CREATE);

    return await JobService.createJob(request.payload.input, request.payload.sender_id);
  },
};

export default [
  getJobs,
  createJob,
  editJob,
  deleteJob,
];
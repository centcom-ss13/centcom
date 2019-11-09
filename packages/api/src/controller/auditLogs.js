import auditLogService from '../service/auditLogs';
import PermissionService from "../service/permissions";
import PERMISSION from "../repository/permissions";

const getAuditLogs = {
  method: 'GET',
  path: '/auditLogs',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.AUDIT_LOGS);

    return await auditLogService.getAuditLogs();
  },
};

export default [
  getAuditLogs,
];
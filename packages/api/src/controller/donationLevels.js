import DonationLevelService from '../service/donationLevels';
import PermissionService from "../service/permissions";
import PERMISSION from "../repository/permissions";

const getDonationLevels = {
  method: 'GET',
  path: '/donationLevels',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.DONATION_LEVELS_READ);

    return await DonationLevelService.getDonationLevels();
  },
  options: {
    auth: false,
  },
};

const editDonationLevel = {
  method: 'PUT',
  path: '/donationLevels/{id}',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.DONATION_LEVELS_EDIT);

    const id = parseInt(request.params.id, 10);

    return await DonationLevelService.editDonationLevel(id, request.payload.input, request.payload.sender_id);
  },
};

const deleteDonationLevel = {
  method: 'DELETE',
  path: '/donationLevels/{id}',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.DONATION_LEVELS_DELETE);

    return await DonationLevelService.deleteDonationLevel(request.params.id);
  },
};

const createDonationLevel = {
  method: 'POST',
  path: '/donationLevels',
  handler: async function (request, h) {
    await PermissionService.requiresPermission(request, PERMISSION.DONATION_LEVELS_CREATE);

    return await DonationLevelService.createDonationLevel(request.payload.input, request.payload.sender_id);
  },
};

export default [
  getDonationLevels,
  createDonationLevel,
  editDonationLevel,
  deleteDonationLevel,
];
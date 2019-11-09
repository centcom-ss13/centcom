import UserService from "../service/users";

async function getUserId(request) {
  try {
    const credentials = await request.auth.credentials;

    const userId = credentials && credentials.id;

    if(!userId) {
      return undefined;
    }

    const user = await UserService.getUser(userId);

    if(!user) {
      return undefined;
    }

    return user.id;
  } catch(e) {
    return undefined;
  }
}

export {
  getUserId,
}
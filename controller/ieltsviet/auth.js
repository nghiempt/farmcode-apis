const {
  statusCode,
  successMessage,
  failMessage,
} = require('~/common/message');
const { ieltsvietService } = require('~/service');

async function loginWithGoogle(request, reply) {
  try {
    console.log(request.user);
    const data = await ieltsvietService.user.getUserByEmail({
      email: request.user?.emails[0]?.value?.toLowerCase(),
    });
    if (data) {
      reply.redirect(
        `${process.env.CLIENT_URL}/sso?account_id=${data?._id}`
      );
    } else {
      const dataAccount = {
        email: request.user?.emails[0]?.value?.toLowerCase(),
        password: '',
        name: request.user?.displayName,
        status: true,
        phone: '',
        role: 'personal',
        avatar: request?.user?.picture,
      };
      const newUser =
        await ieltsvietService.user.createUserGG(dataAccount);
      reply.redirect(
        `${process.env.CLIENT_URL}/sso?account_id=${newUser?.insertedId}`
      );
    }
  } catch (error) {
    reply.redirect(`${process.env.CLIENT_URL}/sso?account_id=null`);
  }
}

module.exports = {
  loginWithGoogle,
};

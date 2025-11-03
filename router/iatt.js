const { iattController } = require('~/controller');
const fastifyPassport = require('@fastify/passport');

function iattRoute(fastify, options, done) {
  fastify.post(
    '/auth/login-email',
    iattController.auth.loginWithEmail
  );
  fastify.post(
    '/auth/login-phone',
    iattController.auth.loginWithPhone
  );
  fastify.get(
    '/auth/login/google',
    {
      preValidation: fastifyPassport.authenticate('google', {
        scope: ['profile', 'email'],
      }),
    },
    async () => {
      console.log(
        '>>>>> Redirecting to Google for Authentication <<<<<<'
      );
    }
  );
  fastify.get(
    '/auth/login/google/callback',
    {
      preValidation: fastifyPassport.authenticate('google', {
        failureRedirect: process.env.CLIENT_URL,
      }),
    },
    iattController.auth.loginWithGoogle
  );

  fastify.get('/account/', iattController.account.getAllAccounts);
  fastify.get('/account/:id', iattController.account.getAccount);
  fastify.post(
    '/account/update/:id',
    iattController.account.updateProfile
  );
  fastify.post(
    '/account/change-password/:id',
    iattController.account.changePassword
  );

  fastify.get('/product/', iattController.product.getAllProducts);
  fastify.get('/product/:id', iattController.product.getProduct);
  fastify.post('/product/', iattController.product.createProduct);
  fastify.put('/product/:id', iattController.product.updateProduct);
  fastify.delete(
    '/product/:id',
    iattController.product.deleteProduct
  );

  fastify.get('/blog/', iattController.blog.getAllBlogs);
  fastify.get('/blog/:id', iattController.blog.getBlog);
  fastify.post('/blog/', iattController.blog.createBlog);
  fastify.put('/blog/:id', iattController.blog.updateBlog);
  fastify.delete('/blog/:id', iattController.blog.deleteBlog);

  fastify.get('/order/', iattController.order.getAllOrders);
  fastify.get(
    '/order/get-all/:id',
    iattController.order.getAllOrdersById
  );
  fastify.get('/order/:id', iattController.order.getOrder);
  fastify.post('/order/', iattController.order.createOrder);
  fastify.post(
    '/order/no-login',
    iattController.order.createOrderWithoutLogin
  );
  fastify.post(
    '/temp-order-album/',
    iattController.order.createTempAlbumOrder
  );
  fastify.post(
    '/order-album/',
    iattController.order.createOrderAlbum
  );
  fastify.post(
    '/order-album/no-login',
    iattController.order.createOrderAlbumWithoutLogin
  );
  fastify.put('/order/:id', iattController.order.updateOrder);
  fastify.delete('/order/:id', iattController.order.deleteOrder);

  fastify.post('/payment/momo', iattController.payment.momo);
  fastify.post(
    '/payment/momo/callback',
    iattController.payment.callback
  );

  fastify.post(
    '/helper/upscale-ppi',
    iattController.helper.upscalePPI
  );
  fastify.post(
    '/helper/background-remove',
    iattController.helper.backgroundRemove
  );
  fastify.post('/helper/enhance', iattController.helper.enhance);
  fastify.post('/helper/image-ai', iattController.helper.imageAi);
  fastify.post(
    '/helper/smooth-skin',
    iattController.helper.smoothSkin
  );

  fastify.post('/discount/', iattController.discount.checkDiscount);

  fastify.get(
    '/comment/:id',
    iattController.comment.getAllCommentsByProductId
  );
  done();
}

module.exports = iattRoute;

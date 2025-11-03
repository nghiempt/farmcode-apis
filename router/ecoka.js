const { ecokaController } = require('~/controller');

function ecokaRoute(fastify, options, done) {
  fastify.get('/product', ecokaController.product.getAllProducts);
  fastify.get('/product/:id', ecokaController.product.getProductById);
  fastify.post('/product/', ecokaController.product.createProduct);
  fastify.put('/product/:id', ecokaController.product.updateProduct);
  fastify.delete(
    '/product/:id',
    ecokaController.product.deleteProduct
  );

  fastify.get('/blog', ecokaController.blog.getAllBlogs);
  fastify.get('/blog/:id', ecokaController.blog.getBlogById);
  fastify.post('/blog/', ecokaController.blog.createBlog);
  fastify.put('/blog/:id', ecokaController.blog.updateBlog);
  fastify.delete('/blog/:id', ecokaController.blog.deleteBlog);

  fastify.get('/esg', ecokaController.esg.getAllEsgs);
  fastify.put('/esg/:id', ecokaController.esg.updateEsg);

  fastify.get(
    '/enterprise',
    ecokaController.enterprise.getAllEnterprises
  );
  fastify.put(
    '/enterprise/:id',
    ecokaController.enterprise.updateEnterprise
  );
  done();
}

module.exports = ecokaRoute;

const { ieltsvietController } = require('~/controller');
const fastifyPassport = require('@fastify/passport');

function ieltsvietRoute(fastify, options, done) {
  fastify.get('/slider', ieltsvietController.slider.getAllSliders);
  fastify.post('/slider', ieltsvietController.slider.createSlider);
  fastify.put('/slider/:id', ieltsvietController.slider.updateSlider);
  fastify.delete(
    '/slider/:id',
    ieltsvietController.slider.deleteSlider
  );
  // kjckjsndc

  fastify.get('/courses', ieltsvietController.course.getAllCourses);
  fastify.post('/course', ieltsvietController.course.createCourse);
  fastify.put('/course/:id', ieltsvietController.course.updateCourse);
  fastify.delete(
    '/course/:id',
    ieltsvietController.course.deleteCourse
  );

  fastify.get('/videos', ieltsvietController.video.getAllVideos);
  fastify.post('/video', ieltsvietController.video.createVideo);
  fastify.put('/video/:id', ieltsvietController.video.updateVideo);
  fastify.delete('/video/:id', ieltsvietController.video.deleteVideo);

  fastify.get('/review', ieltsvietController.review.getAllReviews);
  fastify.get('/review/:id', ieltsvietController.review.getReview);
  fastify.post('/review', ieltsvietController.review.createReview);
  fastify.put('/review/:id', ieltsvietController.review.updateReview);
  fastify.delete(
    '/review/:id',
    ieltsvietController.review.deleteReview
  );

  fastify.get('/blog', ieltsvietController.blog.getAllBlogs);
  fastify.get('/blog/:id', ieltsvietController.blog.getBlog);
  fastify.post('/blog', ieltsvietController.blog.createBlog);
  fastify.put('/blog/:id', ieltsvietController.blog.updateBlog);
  fastify.delete('/blog/:id', ieltsvietController.blog.deleteBlog);

  fastify.get(
    '/account/',
    ieltsvietController.account.getAllAccounts
  );
  fastify.get('/account/:id', ieltsvietController.account.getAccount);
  fastify.post(
    '/account/',
    ieltsvietController.account.createAccount
  );
  fastify.put(
    '/account/:id',
    ieltsvietController.account.updateAccount
  );
  fastify.delete(
    '/account/:id',
    ieltsvietController.account.deleteAccount
  );
  fastify.post('/account/:id', ieltsvietController.account.login);
  fastify.post(
    '/account/check/:id',
    ieltsvietController.account.check
  );
  fastify.get(
    '/account/search-day',
    ieltsvietController.account.searchInDay
  );
  fastify.get(
    '/account/search-month/:month',
    ieltsvietController.account.searchInMonth
  );

  fastify.get('/author/', ieltsvietController.author.getAllAuthors);
  fastify.get('/author/:id', ieltsvietController.author.getAuthor);

  fastify.get(
    '/timekeeping/',
    ieltsvietController.timekeeping.getAllTimekeepings
  );
  fastify.get(
    '/timekeeping/:id',
    ieltsvietController.timekeeping.getTimekeeping
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
    ieltsvietController.auth.loginWithGoogle
  );
  fastify.post('/user/login', ieltsvietController.user.loginUser);
  fastify.get('/user/', ieltsvietController.user.getAllUsers);
  fastify.get('/user/:id', ieltsvietController.user.getUser);
  fastify.post('/user', ieltsvietController.user.createUser);
  fastify.put('/user/:id', ieltsvietController.user.updateUser);
  fastify.delete('/user/:id', ieltsvietController.user.deleteUser);
  fastify.post(
    '/user/change-password/:id',
    ieltsvietController.user.changePassword
  );

  fastify.get(
    '/test/collection',
    ieltsvietController.test.getAllCollections
  );
  fastify.get(
    '/test/collection/:id',
    ieltsvietController.test.getCollection
  );
  fastify.post(
    '/test/collection',
    ieltsvietController.test.createCollection
  );
  fastify.put(
    '/test/collection/:id',
    ieltsvietController.test.updateCollection
  );
  fastify.delete(
    '/test/collection/:id',
    ieltsvietController.test.deleteCollection
  );

  fastify.get('/test', ieltsvietController.test.getAllTests);
  fastify.get('/test/:id', ieltsvietController.test.getTest);
  fastify.post('/test', ieltsvietController.test.createTest);
  fastify.put('/test/:id', ieltsvietController.test.updateTest);
  fastify.delete('/test/:id', ieltsvietController.test.deleteTest);

  fastify.post(
    '/test/skill',
    ieltsvietController.test.createSkillTest
  );
  fastify.get(
    '/test/skill',
    ieltsvietController.test.getAllSkillTests
  );
  fastify.get(
    '/test/writing-answer',
    ieltsvietController.test.getAllWritingAnswers
  );

  fastify.get(
    '/test/user-answer/:id',
    ieltsvietController.test.getAllUserAnswers
  );

  fastify.get(
    '/test/skill/:id',
    ieltsvietController.test.getSkillTest
  );
  fastify.put(
    '/test/skill/:id',
    ieltsvietController.test.updateSkillTest
  );
  fastify.delete(
    '/test/skill/:id',
    ieltsvietController.test.deleteSkillTest
  );

  fastify.get('/test/part/:id', ieltsvietController.test.getPart);
  fastify.get(
    '/test/question/:id',
    ieltsvietController.test.getQuestion
  );

  fastify.put('/test/submit/', ieltsvietController.test.updateSubmit);

  fastify.post('/test/submit', ieltsvietController.test.createSubmit);

  fastify.get(
    '/complete-user-test/:id',
    ieltsvietController.test.getCompleteTestByUserId
  );

  fastify.get(
    '/complete-test/:id/:user_id',
    ieltsvietController.test.getCompleteTest
  );

  fastify.post('/send-email', ieltsvietController.test.sendEmail);

  done();
}

module.exports = ieltsvietRoute;

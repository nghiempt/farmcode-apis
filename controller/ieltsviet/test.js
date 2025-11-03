const {
  statusCode,
  successMessage,
  failMessage,
} = require('~/common/message');
const { ieltsvietService } = require('~/service');

async function getAllCollections(request, reply) {
  try {
    const data = await ieltsvietService.test.getAllCollections();
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getCollection(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.getCollection(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createCollection(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.test.createCollection(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteCollection(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.deleteCollection(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}
async function updateCollection(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.test.updateCollection(
      id,
      body
    );
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getAllTests(request, reply) {
  try {
    const data = await ieltsvietService.test.getAllTests();
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getTest(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.getTest(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getAllWritingAnswers(request, reply) {
  try {
    const data = await ieltsvietService.test.getAllWritingAnswer();
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getAllUserAnswers(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.getAllAnswerByUserId(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createTest(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.test.createTest(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteTest(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.deleteTest(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}
async function updateTest(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    const data = await ieltsvietService.test.updateTest(id, body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getAllSkillTests(request, reply) {
  try {
    let type = '';
    if (request.query.type) {
      type = request.query.type;
    }
    const data = await ieltsvietService.test.getAllSkillTests(type);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getSkillTest(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.getSkillTest(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createSkillTest(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.test.createSkillTest(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteSkillTest(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.deleteSkillTest(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function updateSkillTest(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body;
    let type = '';
    if (request.query.type) {
      type = request.query.type;
    }
    const data = await ieltsvietService.test.updateSkillTest(
      id,
      body,
      type
    );
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    console.log(err);
    reply
      .status(statusCode.internalError)
      .send({ message: err.message });
  }
}

async function getPart(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.getPart(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getQuestion(request, reply) {
  try {
    const { id } = request.params;
    const data = await ieltsvietService.test.getQuestion(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function updateSubmit(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.test.updateSubmit(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createSubmit(request, reply) {
  try {
    const body = request.body;
    const data = await ieltsvietService.test.createSubmit(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getCompleteTestByUserId(request, reply) {
  try {
    const { id } = request.params;
    const data =
      await ieltsvietService.test.getCompleteTestByUserId(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getCompleteTest(request, reply) {
  try {
    const { id, user_id } = request.params;
    const data = await ieltsvietService.test.getCompleteTest(
      id,
      user_id
    );
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function sendEmail(request, reply) {
  try {
    console.log('==============Sending email...==============');

    const data = request.body;

    const transporter = ieltsvietService.test.transporter();
    const mailOptions = ieltsvietService.test.mailOptions(data);

    await ieltsvietService.test.createFeedback(data);

    const info = await transporter.sendMail(mailOptions);

    return reply.status(statusCode.success).send({
      message: 'Email sent successfully',
      data: info.response,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    reply
      .status(statusCode.internalError)
      .send({ message: error.message || failMessage.internalError });
  }
}

module.exports = {
  sendEmail,
  getAllCollections,
  getCollection,
  createCollection,
  deleteCollection,
  updateCollection,
  getAllTests,
  getTest,
  getAllWritingAnswers,
  createTest,
  deleteTest,
  updateTest,
  getAllSkillTests,
  getSkillTest,
  createSkillTest,
  deleteSkillTest,
  updateSkillTest,
  getPart,
  getQuestion,
  createSubmit,
  updateSubmit,
  getCompleteTestByUserId,
  getCompleteTest,
  getAllUserAnswers,
};

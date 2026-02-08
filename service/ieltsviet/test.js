const { ieltsvietModel } = require('~/model');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const { log } = require('console');
const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');
const { text } = require('stream/consumers');
const OpenAI = require('openai');
const cors = require('cors');

// const app = require('express')();
// app.use(cors());

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

// Helper function to normalize answers for comparison
function normalizeAnswer(answer) {
  if (Array.isArray(answer)) {
    return answer.map((item) =>
      typeof item === 'string' ? item.toLowerCase().trim() : item
    );
  }
  return typeof answer === 'string'
    ? answer.toLowerCase().trim()
    : answer;
}

// Helper function to compare answers (handles both arrays and strings)
function compareAnswers(correctAnswer, userAnswer) {
  const normalizedCorrect = normalizeAnswer(correctAnswer);
  const normalizedUser = normalizeAnswer(userAnswer);

  if (
    Array.isArray(normalizedCorrect) &&
    Array.isArray(normalizedUser)
  ) {
    return (
      normalizedCorrect.length === normalizedUser.length &&
      normalizedCorrect.every(
        (val, index) => val === normalizedUser[index]
      )
    );
  }

  return normalizedCorrect === normalizedUser;
}

async function getAllCollections() {
  const collections = await ieltsvietModel.testcollection.find({});
  return collections.filter((collection) => !collection.deleted_at);
}

async function getCollection(id) {
  const collection = await ieltsvietModel.testcollection.findOne({
    _id: new ObjectId(id),
  });
  return collection;
}

async function updateCollection(id, data) {
  return ieltsvietModel.testcollection.updateOne(
    { _id: new ObjectId(id) },
    data
  );
}

async function createCollection(data) {
  let full_tests = [];
  for (const full_test of data.full_tests) {
    const full_test_insert = await createTest(full_test);
    full_tests.push(full_test_insert.data.test_id);
  }
  const data_insert = {
    name: data.name,
    full_tests: full_tests,
  };
  const insertedCollection =
    await ieltsvietModel.testcollection.insertOne(data_insert);
  return {
    message: 'Create collection successfully',
    data: {
      collection_id: insertedCollection.insertedId,
    },
  };
}

async function deleteCollection(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.testcollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: dataUpdate }
  );
}

async function getAllTests() {
  const tests = await ieltsvietModel.btest.find({});
  return tests.filter((test) => !test.deleted_at);
}

async function getTest(id) {
  const test = await ieltsvietModel.btest.findOne({
    _id: new ObjectId(id),
  });
  return test;
}

async function updateTest(id, data) {
  for (const test of data.tests) {
    switch (test.skill) {
      case 'R':
        const result_r = await updateSkillTest(
          test._id,
          test,
          'reading'
        );
        break;
      case 'L':
        const result_l = await updateSkillTest(
          test._id,
          test,
          'listening'
        );
        break;
      case 'W':
        const result_w = await updateSkillTest(
          test._id,
          test,
          'writing'
        );
        break;
    }
  }
  const data_update = {
    name: data.name,
    thumbnail: data.thumbnail,
    description: data.description,
  };
  return ieltsvietModel.btest.updateOne(
    { _id: new ObjectId(id) },
    { $set: data_update }
  );
}

async function createTest(data) {
  let r_id = '';
  let l_id = '';
  let w_id = '';
  for (const test of data.tests) {
    switch (test.skill) {
      case 'R':
        const result_r = await createSkillTest(test);
        r_id = result_r.data.test_id;
        break;
      case 'L':
        const result_l = await createSkillTest(test);
        l_id = result_l.data.test_id;
        break;
      case 'W':
        const result_w = await createSkillTest(test);
        w_id = result_w.data.test_id;
        break;
    }
  }
  const full_test_insert = {
    name: data.name,
    thumbnail: data.thumbnail,
    description: data.description,
    r_id: r_id,
    l_id: l_id,
    w_id: w_id,
  };
  const insertedFullTest =
    await ieltsvietModel.btest.insertOne(full_test_insert);
  return {
    message: 'Create test successfully',
    data: {
      test_id: insertedFullTest.insertedId,
    },
  };
}

async function deleteTest(id) {
  // const dataUpdate = {
  //   deleted_at: new Date(),
  // };
  // return ieltsvietModel.btest.updateOne(
  //   { _id: new ObjectId(id) },
  //   { $set: dataUpdate }
  // );

  try {
    const test = await ieltsvietModel.btest.findOne({
      _id: new ObjectId(id),
    });
    if (!test) {
      throw new Error('Test not found');
    }

    const dataUpdate = {
      deleted_at: new Date(),
    };

    const btestUpdate = await ieltsvietModel.btest.updateOne(
      { _id: new ObjectId(id) },
      { $set: dataUpdate }
    );

    const skillTestIds = [test.r_id, test.l_id, test.w_id].filter(
      (id) => id
    );
    const skillTestUpdates = await Promise.all(
      skillTestIds.map((skillId) => deleteSkillTest(skillId))
    );

    return {
      btestUpdate,
      skillTestUpdates,
    };
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
}

async function getAllSkillTests(type) {
  if (type) {
    let skill = '';
    switch (type) {
      case 'reading':
        skill = 'R';
        break;
      case 'listening':
        skill = 'L';
        break;
      case 'writing':
        skill = 'W';
        break;
    }
    var tests = await ieltsvietModel.stest.find({
      type: skill,
    });
  } else {
    var tests = await ieltsvietModel.stest.find({});
  }
  // const processedTests = [];
  // const existingTests = tests.filter((test) => !test.deleted_at);
  // for (const test of existingTests) {
  //   let totalQuestions = 0;
  //   for (const partId of test.parts) {
  //     const part = await ieltsvietModel.testpart.findOne({
  //       _id: new ObjectId(partId),
  //       deleted_at: { $exists: false },
  //     });
  //     totalQuestions += part.question.length;
  //   }
  //   processedTests.push({
  //     ...test,
  //     number_of_questions: totalQuestions,
  //   });
  // }

  return tests.filter((test) => !test.deleted_at);
}

async function getAllWritingAnswer() {
  const completeWriting = await ieltsvietModel.completepart.find({
    test_type: 'W',
  });
  return completeWriting.filter((test) => !test.deleted_at);
}

async function getAllAnswerByUserId(userId) {
  const completeWriting = await ieltsvietModel.completepart.find({
    user_id: userId,
  });
  return completeWriting.filter((test) => !test.deleted_at);
}

async function getPart(id) {
  const part = await ieltsvietModel.testpart.findOne({
    _id: new ObjectId(id),
    deleted_at: { $exists: false },
  });
  let questions = [];
  for (const question of part.question) {
    const questionData = await ieltsvietModel.question.findOne({
      _id: new ObjectId(question),
      deleted_at: { $exists: false },
    });
    questions.push(questionData);
  }
  part.question = questions;
  return part;
}

async function getQuestion(id) {
  const question = await ieltsvietModel.question.findOne({
    _id: new ObjectId(id),
  });
  return question;
}

async function getSkillTest(id) {
  const test = await ieltsvietModel.stest.findOne({
    _id: new ObjectId(id),
    deleted_at: { $exists: false },
  });
  let totalQuestions = 0;
  for (const partId of test.parts) {
    const part = await ieltsvietModel.testpart.findOne({
      _id: new ObjectId(partId),
      deleted_at: { $exists: false },
    });
    totalQuestions += part.question.length;
  }
  test.number_of_questions = totalQuestions;
  return test;
}

async function updateSkillTest(id, data, type) {
  try {
    for (const part of data.parts) {
      if (type) {
        let skill = '';
        const testpart = await ieltsvietModel.testpart.findOne({
          _id: new ObjectId(part._id),
          deleted_at: { $exists: false },
        });
        switch (type) {
          case 'reading':
            skill = 'R';
            for (const question of part.question) {
              let question_update;
              const current_question =
                await ieltsvietModel.question.findOne({
                  _id: new ObjectId(question._id),
                  deleted_at: { $exists: false },
                });

              // If question type has changed, completely replace all fields
              if (current_question.q_type !== question.q_type) {
                let updateOperation = {};
                switch (question.q_type) {
                  case 'MP':
                    updateOperation = {
                      $set: {
                        q_type: 'MP',
                        question: question.question,
                        choices: question.choices,
                        isMultiple: question.isMultiple,
                        answer: question.answer,
                      },
                    };
                    // Remove other fields
                    await ieltsvietModel.question.updateOne(
                      { _id: new ObjectId(current_question._id) },
                      {
                        $unset: {
                          image: '',
                          start_passage: '',
                          end_passage: '',
                          heading: '',
                          options: '',
                          paragraph_id: '',
                          feature: '',
                          sentence: '',
                        },
                      }
                    );
                    break;
                  case 'FB':
                    updateOperation = {
                      $set: {
                        q_type: 'FB',
                        image: question.image,
                        start_passage: question.start_passage,
                        end_passage: question.end_passage,
                        answer: question.answer,
                      },
                    };
                    // Remove other fields
                    await ieltsvietModel.question.updateOne(
                      { _id: new ObjectId(current_question._id) },
                      {
                        $unset: {
                          question: '',
                          choices: '',
                          isMultiple: '',
                          heading: '',
                          options: '',
                          paragraph_id: '',
                          feature: '',
                          sentence: '',
                        },
                      }
                    );
                    break;
                  case 'MH':
                    updateOperation = {
                      $set: {
                        q_type: 'MH',
                        heading: question.heading,
                        answer: question.answer,
                        options: question.options,
                        paragraph_id: question.paragraph_id,
                      },
                    };
                    // Remove other fields
                    await ieltsvietModel.question.updateOne(
                      { _id: new ObjectId(current_question._id) },
                      {
                        $unset: {
                          question: '',
                          choices: '',
                          isMultiple: '',
                          image: '',
                          start_passage: '',
                          end_passage: '',
                          feature: '',
                          sentence: '',
                        },
                      }
                    );
                    break;
                  case 'MF':
                    updateOperation = {
                      $set: {
                        q_type: 'MF',
                        feature: question.feature,
                        answer: question.answer,
                        options: question.options,
                      },
                    };
                    // Remove other fields
                    await ieltsvietModel.question.updateOne(
                      { _id: new ObjectId(current_question._id) },
                      {
                        $unset: {
                          question: '',
                          choices: '',
                          isMultiple: '',
                          image: '',
                          start_passage: '',
                          end_passage: '',
                          heading: '',
                          paragraph_id: '',
                          sentence: '',
                        },
                      }
                    );
                    break;
                  case 'TFNG':
                    updateOperation = {
                      $set: {
                        q_type: 'TFNG',
                        sentence: question.sentence,
                        answer: question.answer,
                      },
                    };
                    // Remove other fields
                    await ieltsvietModel.question.updateOne(
                      { _id: new ObjectId(current_question._id) },
                      {
                        $unset: {
                          question: '',
                          choices: '',
                          isMultiple: '',
                          image: '',
                          start_passage: '',
                          end_passage: '',
                          heading: '',
                          options: '',
                          paragraph_id: '',
                          feature: '',
                        },
                      }
                    );
                    break;
                }
                await ieltsvietModel.question.updateOne(
                  { _id: new ObjectId(current_question._id) },
                  updateOperation
                );
              } else {
                // If question type hasn't changed, update only the relevant fields
                switch (question.q_type) {
                  case 'MP':
                    question_update = {
                      question: question.question,
                      choices: question.choices,
                      isMultiple: question.isMultiple,
                      answer: question.answer,
                    };
                    break;
                  case 'FB':
                    question_update = {
                      image: question.image,
                      start_passage: question.start_passage,
                      end_passage: question.end_passage,
                      answer: question.answer,
                    };
                    break;
                  case 'MH':
                    question_update = {
                      heading: question.heading,
                      answer: question.answer,
                      options: question.options,
                      paragraph_id: question.paragraph_id,
                    };
                    break;
                  case 'MF':
                    question_update = {
                      feature: question.feature,
                      answer: question.answer,
                      options: question.options,
                    };
                    break;
                  case 'TFNG':
                    question_update = {
                      sentence: question.sentence,
                      answer: question.answer,
                    };
                    break;
                }
                await ieltsvietModel.question.updateOne(
                  { _id: new ObjectId(current_question._id) },
                  { $set: question_update }
                );
              }
            }
            const reading_part_update = {
              image: part.image || testpart.image || '',
              content: part.content || testpart.content || '',
              part_num: part.part_num || testpart.part_num || 0,
            };

            await ieltsvietModel.testpart.updateOne(
              { _id: new ObjectId(testpart._id) },
              { $set: reading_part_update }
            );
            break;
          case 'listening':
            skill = 'L';
            for (const question of part.question) {
              let question_update;
              const current_question =
                await ieltsvietModel.question.findOne({
                  _id: new ObjectId(question._id),
                  deleted_at: { $exists: false },
                });

              // If question type has changed, completely replace all fields
              if (current_question.q_type !== question.q_type) {
                let updateOperation = {};
                switch (question.q_type) {
                  case 'MP':
                    updateOperation = {
                      $set: {
                        q_type: 'MP',
                        question: question.question,
                        choices: question.choices,
                        isMultiple: question.isMultiple,
                        answer: question.answer,
                      },
                    };
                    // Remove other fields
                    await ieltsvietModel.question.updateOne(
                      { _id: new ObjectId(current_question._id) },
                      {
                        $unset: {
                          image: '',
                          start_passage: '',
                          end_passage: '',
                          heading: '',
                          options: '',
                          paragraph_id: '',
                          feature: '',
                          sentence: '',
                        },
                      }
                    );
                    break;
                  case 'FB':
                    updateOperation = {
                      $set: {
                        q_type: 'FB',
                        image: question.image,
                        start_passage: question.start_passage,
                        end_passage: question.end_passage,
                        answer: question.answer,
                      },
                    };
                    // Remove other fields
                    await ieltsvietModel.question.updateOne(
                      { _id: new ObjectId(current_question._id) },
                      {
                        $unset: {
                          question: '',
                          choices: '',
                          isMultiple: '',
                          heading: '',
                          options: '',
                          paragraph_id: '',
                          feature: '',
                          sentence: '',
                        },
                      }
                    );
                    break;
                  case 'MH':
                    updateOperation = {
                      $set: {
                        q_type: 'MH',
                        heading: question.heading,
                        answer: question.answer,
                        options: question.options,
                        paragraph_id: question.paragraph_id,
                      },
                    };
                    // Remove other fields
                    await ieltsvietModel.question.updateOne(
                      { _id: new ObjectId(current_question._id) },
                      {
                        $unset: {
                          question: '',
                          choices: '',
                          isMultiple: '',
                          image: '',
                          start_passage: '',
                          end_passage: '',
                          feature: '',
                          sentence: '',
                        },
                      }
                    );
                    break;
                  case 'MF':
                    updateOperation = {
                      $set: {
                        q_type: 'MF',
                        feature: question.feature,
                        answer: question.answer,
                        options: question.options,
                      },
                    };
                    // Remove other fields
                    await ieltsvietModel.question.updateOne(
                      { _id: new ObjectId(current_question._id) },
                      {
                        $unset: {
                          question: '',
                          choices: '',
                          isMultiple: '',
                          image: '',
                          start_passage: '',
                          end_passage: '',
                          heading: '',
                          paragraph_id: '',
                          sentence: '',
                        },
                      }
                    );
                    break;
                  case 'TFNG':
                    updateOperation = {
                      $set: {
                        q_type: 'TFNG',
                        sentence: question.sentence,
                        answer: question.answer,
                      },
                    };
                    // Remove other fields
                    await ieltsvietModel.question.updateOne(
                      { _id: new ObjectId(current_question._id) },
                      {
                        $unset: {
                          question: '',
                          choices: '',
                          isMultiple: '',
                          image: '',
                          start_passage: '',
                          end_passage: '',
                          heading: '',
                          options: '',
                          paragraph_id: '',
                          feature: '',
                        },
                      }
                    );
                    break;
                }
                await ieltsvietModel.question.updateOne(
                  { _id: new ObjectId(current_question._id) },
                  updateOperation
                );
              } else {
                // If question type hasn't changed, update only the relevant fields
                switch (question.q_type) {
                  case 'MP':
                    question_update = {
                      question: question.question,
                      choices: question.choices,
                      isMultiple: question.isMultiple,
                      answer: question.answer,
                    };
                    break;
                  case 'FB':
                    question_update = {
                      image: question.image,
                      start_passage: question.start_passage,
                      end_passage: question.end_passage,
                      answer: question.answer,
                    };
                    break;
                  case 'MH':
                    question_update = {
                      heading: question.heading,
                      answer: question.answer,
                      options: question.options,
                      paragraph_id: question.paragraph_id,
                    };
                    break;
                  case 'MF':
                    question_update = {
                      feature: question.feature,
                      answer: question.answer,
                      options: question.options,
                    };
                    break;
                  case 'TFNG':
                    question_update = {
                      sentence: question.sentence,
                      answer: question.answer,
                    };
                    break;
                }
                await ieltsvietModel.question.updateOne(
                  { _id: new ObjectId(current_question._id) },
                  { $set: question_update }
                );
              }
            }
            const listening_part_update = {
              audio: part.audio || testpart.audio,
              part_num: part.part_num || testpart.part_num,
            };
            await ieltsvietModel.testpart.updateOne(
              { _id: new ObjectId(testpart._id) },
              { $set: listening_part_update }
            );
            break;
          case 'writing':
            skill = 'W';
            for (const question of part.question) {
              let question_update;
              const current_question =
                await ieltsvietModel.question.findOne({
                  _id: new ObjectId(question._id),
                  deleted_at: { $exists: false },
                });
              question_update = {
                image: question.image || '',
                content: question.topic,
              };
              await ieltsvietModel.question.updateOne(
                { _id: new ObjectId(current_question._id) },
                { $set: question_update }
              );
            }
            const writing_part_update = {
              part_num: part.part_num || testpart.part_num,
            };
            await ieltsvietModel.testpart.updateOne(
              { _id: new ObjectId(testpart._id) },
              { $set: writing_part_update }
            );
            break;
        }
      }
    }

    return ieltsvietModel.stest.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: data.name,
          thumbnail: data.thumbnail || '',
          time: data.time,
        },
      }
    );
  } catch (error) {
    throw new Error(`Failed to update skill test: ${error.message}`);
  }
}

async function createSkillTest(data) {
  let testId;
  try {
    switch (data.skill) {
      case 'R': {
        const data_insert_r = {
          type: 'R',
          parts: [],
          name: data.name,
          thumbnail: data.thumbnail || '',
          time: data.time,
        };
        const stest =
          await ieltsvietModel.stest.insertOne(data_insert_r);
        testId = stest.insertedId;

        for (const part of data.parts) {
          const part_insert_r = {
            stest_id: stest.insertedId,
            type: 'R',
            image: part.image,
            content: part.content,
            part_num: part.part_num,
            question: [],
          };
          const insertedPart =
            await ieltsvietModel.testpart.insertOne(part_insert_r);
          await ieltsvietModel.stest.updateOne(
            { _id: stest.insertedId },
            { $addToSet: { parts: insertedPart.insertedId } }
          );

          for (const question of part.questions) {
            let question_insert_r;
            switch (question.q_type) {
              case 'MP':
                question_insert_r = {
                  q_type: 'MP',
                  part_id: insertedPart.insertedId,
                  question: question.question,
                  choices: question.choices,
                  isMultiple: question.isMultiple,
                  answer: question.answer,
                };
                break;
              case 'FB':
                question_insert_r = {
                  q_type: 'FB',
                  part_id: insertedPart.insertedId,
                  image: question.image,
                  start_passage: question.start_passage,
                  end_passage: question.end_passage,
                  answer: question.answer,
                };
                break;
              case 'MH':
                question_insert_r = {
                  q_type: 'MH',
                  part_id: insertedPart.insertedId,
                  heading: question.heading,
                  answer: question.answer,
                  options: question.options,
                  paragraph_id: question.paragraph_id,
                };
                break;
              case 'MF':
                question_insert_r = {
                  q_type: 'MF',
                  part_id: insertedPart.insertedId,
                  feature: question.feature,
                  answer: question.answer,
                  options: question.options,
                };
                break;
              case 'TFNG':
                question_insert_r = {
                  q_type: 'TFNG',
                  part_id: insertedPart.insertedId,
                  sentence: question.sentence,
                  answer: question.answer,
                };
                break;
              case 'W':
                question_insert_r = {
                  q_type: 'W',
                  part_id: insertedPart.insertedId,
                  image: question.image,
                  content: question.topic,
                };
                break;
              default:
                throw new Error(
                  `Invalid question type: ${question.q_type}`
                );
            }
            const insertedQuestion =
              await ieltsvietModel.question.insertOne(
                question_insert_r
              );
            await ieltsvietModel.testpart.updateOne(
              { _id: insertedPart.insertedId },
              { $addToSet: { question: insertedQuestion.insertedId } }
            );
          }
        }
        break;
      }
      case 'L': {
        const data_insert_l = {
          type: 'L',
          parts: [],
          name: data.name,
          thumbnail: data.thumbnail || '',
          time: data.time,
        };
        const stest_l =
          await ieltsvietModel.stest.insertOne(data_insert_l);
        testId = stest_l.insertedId;

        for (const part of data.parts) {
          const part_insert_l = {
            stest_id: stest_l.insertedId,
            type: 'L',
            audio: part.audio,
            part_num: part.part_num,
            question: [],
          };
          const insertedPart =
            await ieltsvietModel.testpart.insertOne(part_insert_l);
          await ieltsvietModel.stest.updateOne(
            { _id: stest_l.insertedId },
            { $addToSet: { parts: insertedPart.insertedId } }
          );

          for (const question of part.questions) {
            let question_insert_l;
            switch (question.q_type) {
              case 'MP':
                question_insert_l = {
                  q_type: 'MP',
                  part_id: insertedPart.insertedId,
                  question: question.question,
                  choices: question.choices,
                  isMultiple: question.isMultiple,
                  answer: question.answer,
                };
                break;
              case 'FB':
                question_insert_l = {
                  q_type: 'FB',
                  part_id: insertedPart.insertedId,
                  image: question.image,
                  start_passage: question.start_passage,
                  end_passage: question.end_passage,
                  answer: question.answer,
                };
                break;
              case 'MH':
                question_insert_l = {
                  q_type: 'MH',
                  part_id: insertedPart.insertedId,
                  heading: question.heading,
                  answer: question.answer,
                  options: question.options,
                  paragraph_id: question.paragraph_id,
                };
                break;
              case 'MF':
                question_insert_l = {
                  q_type: 'MF',
                  part_id: insertedPart.insertedId,
                  feature: question.feature,
                  answer: question.answer,
                  options: question.options,
                };
                break;
              case 'TFNG':
                question_insert_l = {
                  q_type: 'TFNG',
                  part_id: insertedPart.insertedId,
                  sentence: question.sentence,
                  answer: question.answer,
                  options: question.options,
                };
                break;
              case 'W':
                question_insert_l = {
                  q_type: 'W',
                  part_id: insertedPart.insertedId,
                  image: question.image || '',
                  content: question.topic,
                };
                break;
              default:
                throw new Error(
                  `Invalid question type: ${question.q_type}`
                );
            }
            const insertedQuestion =
              await ieltsvietModel.question.insertOne(
                question_insert_l
              );
            await ieltsvietModel.testpart.updateOne(
              { _id: insertedPart.insertedId },
              { $addToSet: { question: insertedQuestion.insertedId } }
            );
          }
        }
        break;
      }
      case 'W': {
        const data_insert_w = {
          type: 'W',
          parts: [],
          name: data.name,
          thumbnail: data.thumbnail || '',
          time: data.time,
        };
        const stest_w =
          await ieltsvietModel.stest.insertOne(data_insert_w);
        testId = stest_w.insertedId;

        for (const part of data.parts) {
          const part_insert_w = {
            stest_id: stest_w.insertedId,
            type: 'W',
            part_num: part.part_num,
            question: [],
          };
          const insertedPart =
            await ieltsvietModel.testpart.insertOne(part_insert_w);
          await ieltsvietModel.stest.updateOne(
            { _id: stest_w.insertedId },
            { $addToSet: { parts: insertedPart.insertedId } }
          );

          for (const question of part.questions) {
            let question_insert_w;
            switch (question.q_type) {
              case 'MP':
                question_insert_w = {
                  q_type: 'MP',
                  part_id: insertedPart.insertedId,
                  choices: question.choices,
                  isMultiple: question.isMultiple,
                  answer: question.answer,
                };
                break;
              case 'FB':
                question_insert_w = {
                  q_type: 'FB',
                  part_id: insertedPart.insertedId,
                  image: question.image,
                  start_passage: question.start_passage,
                  end_passage: question.end_passage,
                  answer: question.answer,
                };
                break;
              case 'MH':
                question_insert_w = {
                  q_type: 'MH',
                  part_id: insertedPart.insertedId,
                  heading: question.heading,
                  answer: question.answer,
                  options: question.options,
                  paragraph_id: question.paragraph_id,
                };
                break;
              case 'MF':
                question_insert_w = {
                  q_type: 'MF',
                  part_id: insertedPart.insertedId,
                  feature: question.feature,
                  answer: question.answer,
                  options: question.options,
                };
                break;
              case 'TFNG':
                question_insert_w = {
                  q_type: 'TFNG',
                  part_id: insertedPart.insertedId,
                  sentence: question.sentence,
                  answer: question.answer,
                };
                break;
              case 'W':
                question_insert_w = {
                  q_type: 'W',
                  part_id: insertedPart.insertedId,
                  image: question.image,
                  content: question.topic,
                };
                break;
              default:
                throw new Error(
                  `Invalid question type: ${question.q_type}`
                );
            }
            const insertedQuestion =
              await ieltsvietModel.question.insertOne(
                question_insert_w
              );
            await ieltsvietModel.testpart.updateOne(
              { _id: insertedPart.insertedId },
              { $addToSet: { question: insertedQuestion.insertedId } }
            );
          }
        }
        break;
      }
      default:
        throw new Error(`Invalid skill type: ${data.skill}`);
    }

    return {
      message: 'Create skill test successfully',
      data: {
        test_id: testId,
      },
    };
  } catch (error) {
    throw new Error(`Failed to create skill test: ${error.message}`);
  }
}

async function deleteSkillTest(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.stest.updateOne(
    { _id: new ObjectId(id) },
    { $set: dataUpdate }
  );
}

async function updateSubmit(data) {
  let parts = [];
  let test_type = '';
  let total_correct = 0;
  let total_incorrect = 0;
  let total_pass = 0;

  for (const part of data.parts) {
    const testpart = await ieltsvietModel.testpart.findOne({
      _id: new ObjectId(part.part_id),
      deleted_at: { $exists: false },
    });
    if (testpart.type === 'R' || testpart.type === 'L') {
      test_type = testpart.type;
      let correct_count = 0;
      let incorrect_count = 0;
      let pass_count = 0;
      let user_answers = [];
      for (const user_answer of part.user_answers) {
        let is_correct = false;
        let is_incorrect = false;
        let is_pass = false;
        const question = await ieltsvietModel.question.findOne({
          _id: new ObjectId(user_answer.question_id),
          deleted_at: { $exists: false },
        });
        if (question) {
          // Handle different question types
          switch (question.q_type) {
            case 'MP':
              if (
                question.answer.length ===
                  user_answer.answer.length &&
                question.answer.every(
                  (val, index) => val === user_answer.answer[index]
                )
              ) {
                correct_count++;
                is_correct = true;
              } else if (
                user_answer.answer.length === 0 &&
                question.answer.length !== user_answer.answer.length
              ) {
                pass_count++;
                is_pass = true;
              } else if (
                user_answer.answer.length !== 0 &&
                question.answer !== user_answer.answer
              ) {
                incorrect_count++;
                is_incorrect = true;
              }
              break;
            case 'FB':
              if (
                compareAnswers(
                  testpart.type === 'R'
                    ? question.answer
                    : question.answer[0][0],
                  testpart.type === 'R'
                    ? user_answer.answer
                    : user_answer.answer[0]
                )
              ) {
                correct_count++;
                is_correct = true;
              } else if (
                user_answer.answer.length === 0 &&
                question.answer.length !== user_answer.answer.length
              ) {
                pass_count++;
                is_pass = true;
              } else if (
                user_answer.answer.length !== 0 &&
                !compareAnswers(
                  testpart.type === 'R'
                    ? question.answer
                    : question.answer[0][0],
                  testpart.type === 'R'
                    ? user_answer.answer
                    : user_answer.answer[0]
                )
              ) {
                incorrect_count++;
                is_incorrect = true;
              }
              break;
            case 'MH':
              // For Matching Headings questions
              if (
                user_answer.answer &&
                question.answer &&
                compareAnswers(question.answer, user_answer.answer[0])
              ) {
                correct_count++;
                is_correct = true;
              } else if (
                !user_answer.answer ||
                user_answer.answer.length === 0
              ) {
                pass_count++;
                is_pass = true;
              } else {
                incorrect_count++;
                is_incorrect = true;
              }
              break;
            case 'MF':
              // For Matching Features questions
              if (
                user_answer.answer &&
                question.answer &&
                compareAnswers(question.answer, user_answer.answer[0])
              ) {
                correct_count++;
                is_correct = true;
              } else if (
                !user_answer.answer ||
                user_answer.answer.length === 0
              ) {
                pass_count++;
                is_pass = true;
              } else {
                incorrect_count++;
                is_incorrect = true;
              }
              break;
            case 'TFNG':
              // For True/False/Not Given questions
              if (
                user_answer.answer &&
                question.answer &&
                compareAnswers(question.answer, user_answer.answer[0])
              ) {
                correct_count++;
                is_correct = true;
              } else if (
                !user_answer.answer ||
                user_answer.answer.length === 0
              ) {
                pass_count++;
                is_pass = true;
              } else {
                incorrect_count++;
                is_incorrect = true;
              }
              break;
          }

          user_answers.push({
            question_id: user_answer.question_id,
            q_type: question.q_type,
            answer: user_answer.answer,
            correct_answer: question.answer,
            is_correct,
            is_pass,
            is_incorrect,
          });
        }
      }
      total_correct += correct_count;
      total_incorrect += incorrect_count;
      total_pass += pass_count;
      parts.push({
        type: testpart.type,
        part_id: part.part_id,
        user_answers: user_answers,
        correct_count: correct_count,
        incorrect_count: incorrect_count,
        pass_count: pass_count,
        is_complete: part.is_complete,
      });
    } else if (testpart.type === 'W') {
      test_type = testpart.type;
      let user_answers = [];
      for (const user_answer of part.user_answers) {
        const question = await ieltsvietModel.question.findOne({
          _id: new ObjectId(user_answer.question_id),
          deleted_at: { $exists: false },
        });
        if (question) {
          if (question.q_type === 'W') {
            user_answers.push({
              question_id: user_answer.question_id,
              answer: user_answer.answer,
              topic: question.content,
              image: question.image || '',
            });
          }
        }
      }

      parts.push({
        type: testpart.type,
        part_id: part.part_id,
        user_answers: user_answers,
        is_complete: part.is_complete,
      });
    }
  }

  let score = 0;
  if (total_correct >= 0 && total_correct <= 1) {
    score = 0;
  } else if (total_correct >= 2 && total_correct <= 3) {
    score = 1;
  } else if (total_correct >= 4 && total_correct <= 5) {
    score = 2;
  } else if (total_correct >= 5 && total_correct <= 6) {
    score = 3;
  } else if (total_correct >= 7 && total_correct <= 9) {
    score = 3.5;
  } else if (total_correct >= 10 && total_correct <= 12) {
    score = 4;
  } else if (total_correct >= 13 && total_correct <= 15) {
    score = 4.5;
  } else if (total_correct >= 16 && total_correct <= 19) {
    score = 5;
  } else if (total_correct >= 20 && total_correct <= 22) {
    score = 5.5;
  } else if (total_correct >= 23 && total_correct <= 26) {
    score = 6;
  } else if (total_correct >= 27 && total_correct <= 29) {
    score = 6.5;
  } else if (total_correct >= 30 && total_correct <= 32) {
    score = 7;
  } else if (total_correct >= 33 && total_correct <= 34) {
    score = 7.5;
  } else if (total_correct >= 35 && total_correct <= 36) {
    score = 8;
  } else if (total_correct >= 37 && total_correct <= 38) {
    score = 8.5;
  } else if (total_correct >= 39 && total_correct <= 40) {
    score = 9;
  }

  const data_insert = {
    user_id: data.user_id,
    user_email: data.user_email,
    test_id: data.test_id,
    test_type: test_type,
    result: parts,
    score: score,
    correct_answer: total_correct,
    incorrect_answer: total_incorrect,
    pass_answer: total_pass,
  };

  const insertedSubmit = await ieltsvietModel.completepart.updateOne(
    {
      user_id: data.user_id,
      test_id: data.test_id,
      deleted_at: { $exists: false },
    },
    { $set: data_insert }
  );

  return {
    message: 'Update submit successfully',
    data: {
      submit_id: insertedSubmit.insertedId,
      result: parts,
    },
  };
}

async function createSubmit(data) {
  let parts = [];
  let test_type = '';
  let total_correct = 0;
  let total_incorrect = 0;
  let total_pass = 0;

  for (const part of data.parts) {
    const testpart = await ieltsvietModel.testpart.findOne({
      _id: new ObjectId(part.part_id),
      deleted_at: { $exists: false },
    });
    if (testpart.type === 'R' || testpart.type === 'L') {
      test_type = testpart.type;
      let correct_count = 0;
      let incorrect_count = 0;
      let pass_count = 0;
      let user_answers = [];

      for (const user_answer of part.user_answers) {
        let is_correct = false;
        let is_incorrect = false;
        let is_pass = false;
        const question = await ieltsvietModel.question.findOne({
          _id: new ObjectId(user_answer.question_id),
          deleted_at: { $exists: false },
        });

        if (question) {
          // Handle different question types
          switch (question.q_type) {
            case 'MP':
              if (
                question.answer.length ===
                  user_answer.answer.length &&
                question.answer.every(
                  (val, index) => val === user_answer.answer[index]
                )
              ) {
                correct_count++;
                is_correct = true;
              } else if (
                user_answer.answer.length === 0 &&
                question.answer.length !== user_answer.answer.length
              ) {
                pass_count++;
                is_pass = true;
              } else if (
                user_answer.answer.length !== 0 &&
                question.answer !== user_answer.answer
              ) {
                incorrect_count++;
                is_incorrect = true;
              }
              break;
            case 'FB':
              if (
                compareAnswers(
                  // testpart.type === 'R'
                  //   ? question.answer
                  //   : question.answer[0][0],
                  // testpart.type === 'R'
                  //   ? user_answer.answer
                  //   : user_answer.answer[0]
                  testpart.type === 'R'
                    ? question.answer
                    : question.answer[0],
                  testpart.type === 'R'
                    ? user_answer.answer
                    : user_answer.answer[0]
                )
              ) {
                // console.log(
                //   testpart.type === 'R'
                //     ? question.answer
                //     : question.answer[0][0]
                // );
                // console.log(
                //   testpart.type === 'R'
                //     ? user_answer.answer
                //     : user_answer.answer[0]
                // );
                correct_count++;
                is_correct = true;
              } else if (
                user_answer.answer.length === 0 &&
                question.answer.length !== user_answer.answer.length
              ) {
                pass_count++;
                is_pass = true;
              } else if (
                user_answer.answer.length !== 0 &&
                !compareAnswers(
                  testpart.type === 'R'
                    ? question.answer
                    : question.answer[0],
                  testpart.type === 'R'
                    ? user_answer.answer
                    : user_answer.answer[0]
                )
              ) {
                // console.log(
                //   testpart.type === 'R'
                //     ? question.answer
                //     : question.answer[0][0]
                // );
                // console.log(
                //   testpart.type === 'R'
                //     ? user_answer.answer
                //     : user_answer.answer[0]
                // );
                incorrect_count++;
                is_incorrect = true;
              }
              break;
            case 'MH':
              // For Matching Headings questions
              if (
                user_answer.answer &&
                question.answer &&
                compareAnswers(question.answer, user_answer.answer[0])
              ) {
                correct_count++;
                is_correct = true;
              } else if (
                !user_answer.answer ||
                user_answer.answer.length === 0
              ) {
                pass_count++;
                is_pass = true;
              } else {
                incorrect_count++;
                is_incorrect = true;
              }
              break;
            case 'MF':
              // For Matching Features questions
              if (
                user_answer.answer &&
                question.answer &&
                compareAnswers(question.answer, user_answer.answer[0])
              ) {
                correct_count++;
                is_correct = true;
              } else if (
                !user_answer.answer ||
                user_answer.answer.length === 0
              ) {
                pass_count++;
                is_pass = true;
              } else {
                incorrect_count++;
                is_incorrect = true;
              }
              break;
            case 'TFNG':
              // For True/False/Not Given questions
              if (
                user_answer.answer &&
                question.answer &&
                compareAnswers(question.answer, user_answer.answer[0])
              ) {
                correct_count++;
                is_correct = true;
              } else if (
                !user_answer.answer ||
                user_answer.answer.length === 0
              ) {
                pass_count++;
                is_pass = true;
              } else {
                incorrect_count++;
                is_incorrect = true;
              }
              break;
          }

          user_answers.push({
            question_id: user_answer.question_id,
            q_type: question.q_type,
            answer: user_answer.answer,
            correct_answer: question.answer,
            is_correct,
            is_pass,
            is_incorrect,
          });
        }
      }
      total_correct += correct_count;
      total_incorrect += incorrect_count;
      total_pass += pass_count;
      parts.push({
        type: testpart.type,
        part_id: part.part_id,
        user_answers: user_answers,
        correct_count: correct_count,
        incorrect_count: incorrect_count,
        pass_count: pass_count,
        is_complete: part.is_complete,
      });
    } else if (testpart.type === 'W') {
      test_type = testpart.type;
      let user_answers = [];
      for (const user_answer of part.user_answers) {
        const question = await ieltsvietModel.question.findOne({
          _id: new ObjectId(user_answer.question_id),
          deleted_at: { $exists: false },
        });
        if (question) {
          if (question.q_type === 'W') {
            user_answers.push({
              question_id: user_answer.question_id,
              answer: user_answer.answer,
              topic: question.content,
              image: question.image || '',
            });
          }
        }
      }

      parts.push({
        type: testpart.type,
        part_id: part.part_id,
        user_answers: user_answers,
        is_complete: part.is_complete,
      });
    }
  }

  let score = 0;
  if (total_correct >= 0 && total_correct <= 1) {
    score = 0;
  } else if (total_correct >= 2 && total_correct <= 3) {
    score = 1;
  } else if (total_correct >= 4 && total_correct <= 5) {
    score = 2;
  } else if (total_correct >= 5 && total_correct <= 6) {
    score = 3;
  } else if (total_correct >= 7 && total_correct <= 9) {
    score = 3.5;
  } else if (total_correct >= 10 && total_correct <= 12) {
    score = 4;
  } else if (total_correct >= 13 && total_correct <= 15) {
    score = 4.5;
  } else if (total_correct >= 16 && total_correct <= 19) {
    score = 5;
  } else if (total_correct >= 20 && total_correct <= 22) {
    score = 5.5;
  } else if (total_correct >= 23 && total_correct <= 26) {
    score = 6;
  } else if (total_correct >= 27 && total_correct <= 29) {
    score = 6.5;
  } else if (total_correct >= 30 && total_correct <= 32) {
    score = 7;
  } else if (total_correct >= 33 && total_correct <= 34) {
    score = 7.5;
  } else if (total_correct >= 35 && total_correct <= 36) {
    score = 8;
  } else if (total_correct >= 37 && total_correct <= 38) {
    score = 8.5;
  } else if (total_correct >= 39 && total_correct <= 40) {
    score = 9;
  }

  let user = '';
  if (data.user_id !== '') {
    user = await ieltsvietModel.user.findOne({
      _id: new ObjectId(data.user_id),
    });
  }

  const test_name = await ieltsvietModel.stest.findOne({
    _id: new ObjectId(data.test_id),
  });

  const data_insert = {
    user_id: data.user_id,
    user_email: data.user_email,
    test_id: data.test_id,
    test_type: test_type,
    result: parts,
    score: score,
    correct_answer: total_correct,
    incorrect_answer: total_incorrect,
    pass_answer: total_pass,
    user_avatar: user !== '' ? user.avatar : user,
    user_name: user !== '' ? user.user_name : user,
    test_name: test_name ? test_name.name : '',
    test_image: test_name ? test_name.thumbnail : '',
  };

  const insertedSubmit =
    await ieltsvietModel.completepart.insertOne(data_insert);
  return {
    message: 'Create submit successfully',
    data: {
      submit_id: insertedSubmit.insertedId,
      result: parts,
    },
  };
}

async function getCompleteTestByUserId(id) {
  const test = await ieltsvietModel.completepart.find({
    user_id: id,
  });
  return test;
}

async function getCompleteTest(id, user_id) {
  const test = await ieltsvietModel.completepart.findOne({
    test_id: id,
    user_id: user_id,
  });
  return test;
}

function transporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TRUE for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

function mailOptionsQA(data) {
  if (!data || !data.user_email || !data.user_name) {
    throw new Error('Invalid data for email options');
  }
  return {
    from: {
      name: 'IELTS Viet Q&A',
      address: process.env.EMAIL_USER,
    },
    to: [`${process.env.EMAIL_CENTER}`],
    subject: 'Student Q&A IELTS VIET',
    text: 'Student Q&A from: ' + `${data.user_name}`,
    html: ` 
          <h1 style="color: black;">Student's question information</h1>
          <p style="color: black; font-size: 16px;">
            Student's name:
            <span style="font-style: italic; font-weight: bold; color: black;"
              >${data.user_name}</span
            >
          </p>

          <p style="color: black; font-size: 16px;">
          Student's email:
            <span style="font-style: italic; font-weight: bold; color: black;"
              >${data.user_email}</span
          ></p>

          <p style="color: black; font-size: 16px;">
            Phone number:
            <span style="font-style: italic; font-weight: bold; color: black;"
              >${data.phone}</span
            ></p>
          
          <p style="color: black; font-size: 16px;">
            Profession:
            <span style="font-style: italic; font-weight: bold; color: black;"
              >${data.profession}</span
            ></p>

          <p style="color: black; font-size: 16px;">
          Question content:
            <span style="font-style: italic; font-weight: bold; color: black;"
              >${data.question}</span
            ></p>
          `,
  };
}

function mailOptions(data) {
  const task1Score = parseFloat(data?.writing_feedback?.[0]?.score);
  const task2Score = parseFloat(data?.writing_feedback?.[1]?.score);
  const rawOverallScore = (task1Score + task2Score * 2) / 3;

  const overallScore = Math.round(rawOverallScore * 2) / 2;

  return {
    from: {
      name: 'IELTS Viet',
      address: process.env.EMAIL_USER,
    },
    to: [`${data.user_email}`],
    subject: 'Feedback IELTS Viet Writing Test',
    text:
      'Feedback IELTS Viet Writing Test for: ' + `${data.test_name}`,
    html: ` 
          <h1 style="color: black;">${data.test_name}</h1>
          <h3 style="color: black;">Writing task 1 score: <strong>${data.writing_feedback[0].score}</strong></h3>
          <p style="color: black;">
            Teacher's feedback:
            <span style="font-style: italic; font-weight: bold; color: black;"
              >${data.writing_feedback[0].teacher}</span
            >
          </p>
          <p style="color: black;">${data.writing_feedback[0].feedback}</p>
          <p style="color: black;">
            -----------------------------------------------------
          </p>
          ${
            data?.writing_feedback?.length === 2
              ? `
          <h3 style="color: black;">Writing task 2 score: <strong>${data?.writing_feedback[1]?.score}</strong></h3>
          <p style="color: black;">
            Teacher's feedback:
            <span style="font-style: italic; font-weight: bold; color: black;"
              >${data?.writing_feedback[1]?.teacher}</span
            >
          </p>
          <p style="color: black;">${data?.writing_feedback[1]?.feedback}</p>
          <p style="color: black;">
            -----------------------------------------------------
          </p>
         `
              : ''
          }

          <h1 style="color: black;">Writing Overall: ${data.writing_feedback.length === 2 ? overallScore.toFixed(1) : data.writing_feedback[0].score}</h1>
          `,
    // attachments: [
    //   // {
    //   //   filename: 'test.pdf',
    //   //   path: path.join(__dirname, 'test.pdf'),
    //   //   contentType: 'application/pdf',
    //   // },
    //   {
    //     filename: 'logo-ielts-viet.png',
    //     path: path.join(
    //       __dirname,
    //       '/attachments/logo-ielts-viet.png'
    //     ),
    //     contentType: 'image/png',
    //   },
    // ],
  };
}

async function createFeedback(data) {
  const data_insert = {
    ...data,
  };

  const feedbackResponse =
    await ieltsvietModel.feedback.insertOne(data_insert);

  const writing_feedback = await ieltsvietModel.feedback.findOne({
    _id: feedbackResponse.insertedId,
  });

  let overallScore = 0;
  if (writing_feedback) {
    if (writing_feedback?.writing_feedback?.length === 2) {
      const score1 = Number(
        writing_feedback?.writing_feedback?.[0]?.score
      );
      const score2 = Number(
        writing_feedback?.writing_feedback?.[1]?.score
      );
      const rawOverallScore = (score1 + score2 * 2) / 3;
      overallScore = Math.round(rawOverallScore * 2) / 2;
    } else {
      overallScore = Number(
        writing_feedback?.writing_feedback?.[0]?.score
      );
    }
  }

  const test = await getCompleteTest(data.test_id, data.user_id);

  const updateResult = await ieltsvietModel.completepart.updateOne(
    {
      test_id: data.test_id,
      user_id: data.user_id,
      deleted_at: { $exists: false },
    },
    {
      $set: {
        score: overallScore,
        updated_at: new Date(),
      },
    }
  );

  return {
    message: 'Feedback created and test score updated successfully',
    data: {
      feedback_id: feedbackResponse.insertedId,
      overall_score: overallScore,
      test_id: data.test_id,
    },
  };
}

async function getFeedbackByTestId(testId, userId) {
  const feedbacks = await ieltsvietModel.feedback.findOne({
    test_id: testId,
    user_id: userId,
    deleted_at: { $exists: false },
  });
  return feedbacks;
}

const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askChatGPT(userMessage) {
  try {
    const content = [
      {
        type: 'text',
        text: `Tôi có một raw data của bài ${userMessage.test_type === 'R' ? 'IELTS Reading' : 'IELTS Listening'} Test: ${userMessage.content} Hãy phân tích cho tôi các dạng câu hỏi trong bài viết và các trường dữ liệu thích hợp trong dạng câu hỏi đó ví dụ Dạng Multiple choice (MP) sẽ có cấu trúc dữ liệu sau: { 'q_type': 'MP', 'question': string, 'choices': string [], 'isMultiple': boolean, 'answer': string [] } Dạng Fill in the blank (FB) sẽ có cấu trúc kiểu dữ liệu sau: { 'q_type': 'FB', 'image': string, 'start_passage': string, 'end_passage': string, 'answer': string [] } Dạng Matching Headings (MH) sẽ có cấu trúc dữ liệu sau: { 'q_type': 'MH', 'heading': string, 'answer': string, 'options': string [], 'paragraph_id': string, } Dạng Matching Features (MF) sẽ có cấu trúc dữ liệu sau: { 'q_type': 'MF', 'feature': string, 'answer': string, 'options': string [], } Dạng True/False/Not Given (TFNG) sẽ có cấu trúc dữ liệu sau: { 'q_type': 'TFNG', 'sentence': string, 'answer': string (TRUE | FALSE | NOT GIVEN) } Dựa vào 5 dạng câu hỏi trên hãy phân tích dữ liệu trong file và lấy các trường dữ liệu thích hợp cho dạng câu hỏi đó. Nếu có dạng câu hỏi khác ngoài 5 dạng câu hỏi trên, hãy phân tích dữ liệu câu hỏi trong dạng bài đó và chuyển hóa thành 1 trong 5 dạng trên. Lưu ý: Viết đầy đủ câu hỏi trong từng dạng và viết từng câu hỏi đừng gom chung câu hỏi trong một dạng vào một json, đảm bảo luôn có đáp án rõ ràng cho mỗi câu hỏi. Sau đó hãy dựa vào cấu trúc json sau đây: ${userMessage.test_type === 'R' ? "{ 'skill': 'R', 'parts': [ { 'image': '', 'content': ' 'part_num': 1, 'questions': [ Questions data ] }, { 'image': '', 'content': ', 'part_num': 2, 'questions': [ Questions data ] }, { 'image': '', 'content': ', 'part_num': 3, 'questions': [ Questions data ] } ], 'name': file-name, 'thumbnail': '', 'time': 60 } Hãy phân tích toàn bộ dữ liệu để lấy dữ liệu bài đọc của từng section trong ielts reading và câu hỏi tương ứng trong section bài đọc đó. Hãy viết và trả về cho tôi dưới dạng 1 file json tổng hợp. Lưu ý: ở passage 1 bắt buộc phải có đủ 13 câu hỏi, passage 2 bắt buộc phải có đủ 13 câu hỏi, passage 3 bắt buộc phải có đủ 14 câu hỏi và mỗi passage chỉ được có 2 - 3 dạng câu hỏi trong 5 dạng câu hỏi trên, bắt buộc phải có tổng cộng 40 câu hỏi trong một bài test." : "{ 'skill': 'L', 'parts': [ { 'audio': '', 'part_num': 1, 'questions': [ Questions data ] }, { 'audio': '', 'part_num': 2, 'questions': [ Questions data ] }, { 'audio': '', 'part_num': 3, 'questions': [ Questions data ] }, { 'audio': '', 'part_num': 4, 'questions': [ Questions data ] } ], 'name': file-name, 'thumbnail': '', 'time': 60 } Hãy phân tích toàn bộ dữ liệu để lấy dữ liệu bài đọc của từng section (tổng cộng có 4 section) trong ielts listening và câu hỏi tương ứng trong section bài nghe đó. Hãy viết và trả về cho tôi dưới dạng 1 file json tổng hợp. Lưu ý: ở passage 1 bắt buộc phải có đủ 10 câu hỏi, passage 2 bắt buộc phải có đủ 10 câu hỏi, passage 3 bắt buộc phải có đủ 10 câu hỏi, passage 4 bắt buộc phải có đủ 10 câu hỏi và mỗi passage chỉ được có 2 - 3 dạng câu hỏi trong 5 dạng câu hỏi trên, bắt buộc phải có tổng cộng 40 câu hỏi trong một bài test."} Chỉ trả về dữ liệu json không cần giải thích gì thêm.`,
      },
    ];

    const messages = [
      {
        role: 'system',
        content: `Bạn là một chuyên gia phân tích các dạng đề ${userMessage.test_type === 'R' ? 'IELTS Reading' : 'IELTS Listening'} và chuyển đổi chúng thành định dạng JSON. Phân tích dữ liệu bài đọc và câu hỏi, sau đó trả về kết quả dưới dạng JSON theo cấu trúc được yêu cầu, đảm bảo mỗi câu hỏi có các trường dữ liệu phù hợp với loại câu hỏi.`,
      },
      {
        role: 'user',
        content: content,
      },
    ];

    // console.log('userMessage', userMessage);
    // console.log('content', content);

    // Add timeout and retry logic to handle 504 errors
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const chatCompletion =
          await openAIClient.chat.completions.create({
            model: 'gpt-5',
            messages: messages,
            // max_tokens: 10000,
          });

        console.log(
          'chatCompletion',
          chatCompletion.choices[0].message.content
        );
        return chatCompletion.choices[0].message.content;
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error.message);

        // If it's a 504 error and we have retries left, wait and retry
        if (error.status === 504 && attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`Waiting ${waitTime}ms before retry...`);
          await new Promise((resolve) =>
            setTimeout(resolve, waitTime)
          );
          continue;
        }

        // If it's not a 504 or we're out of retries, break
        break;
      }
    }

    // If all retries failed, throw the last error
    throw lastError || new Error('All retry attempts failed');
  } catch (error) {
    console.error('Error interacting with ChatGPT API:', error);

    // Provide more specific error information
    if (error.status === 504) {
      throw new Error(
        'OpenAI API timeout (504). The request took too long to process. Please try again or reduce the content size.'
      );
    } else if (error.status === 429) {
      throw new Error(
        'OpenAI API rate limit exceeded (429). Please wait before making another request.'
      );
    } else if (error.status >= 500) {
      throw new Error(
        `OpenAI API server error (${error.status}). Please try again later.`
      );
    } else {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}

module.exports = {
  transporter,
  mailOptions,
  getAllCollections,
  getCollection,
  updateCollection,
  createCollection,
  deleteCollection,
  getAllTests,
  getAllWritingAnswer,
  getTest,
  updateTest,
  createTest,
  deleteTest,
  getAllSkillTests,
  getSkillTest,
  updateSkillTest,
  createSkillTest,
  deleteSkillTest,
  getPart,
  getQuestion,
  updateSubmit,
  createSubmit,
  getCompleteTestByUserId,
  getCompleteTest,
  getAllAnswerByUserId,
  createFeedback,
  getFeedbackByTestId,
  askChatGPT,
  mailOptionsQA,
};

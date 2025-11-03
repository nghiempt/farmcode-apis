require('dotenv').config();

const { statusCode, failMessage } = require('~/common/message');
const { exec } = require("child_process");
const util = require("util");
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { MongoClient } = require('mongodb');

const mongoDBUrl = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME_BOT_BRIDGE;

const BOT_BRIDGE_BASE_URL = process.env.BOT_BRIDGE_BASE_URL;
const BOT_BRIDGE_API_ENDPOINT = process.env.BOT_BRIDGE_API_ENDPOINT;
const BOT_BRIDGE_HOST = process.env.BOT_BRIDGE_HOST;
const BOT_BRIDGE_TOKEN = process.env.BOT_BRIDGE_TOKEN;

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let marketWarehouse = null;
let client = null;
let db = null;
let _testCasesCol = null;

async function connection(uniqueFind) {
  if (db) {
    console.log('>>>>>> Reusing existing DB connection <<<<<<');
    return _testCasesCol.find({ unique: uniqueFind }).toArray()
  }
  client = new MongoClient(mongoDBUrl, connectOptions);
  try {
    await client.connect();
    db = client.db(dbName);
    marketWarehouse = db.collection('market_warehouses');
    _testCasesCol = db.collection('test_cases');
    await marketWarehouse.createIndex({
      created_at: 1,
      updated_at: 1,
      created_by: 1,
      updated_by: 1,
    });
    console.log('>>>>>>>> Connected to DB Successfully <<<<<<<<');
    return _testCasesCol.find({ unique: uniqueFind }).toArray()
  } catch (e) {
    console.error('Connection error:', e);
  }
}

function generateYamlFile(data, targetDir) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('No data provided for YAML generation');
  }
  const yamlConfig = {
    description: "Test Infofinland Flowise Master Filter",
    prompts: ["{{question}}"],
    providers: [
      {
        id: "https",
        config: {
          request: `POST ${BOT_BRIDGE_API_ENDPOINT} HTTP/1.1
Host: ${BOT_BRIDGE_HOST}
Content-Type: application/json
Authorization: Bearer ${BOT_BRIDGE_TOKEN}

{
  "question": "{{question}}"
}`,
          transformResponse: 'json.text'
        }
      }
    ],
    tests: data.map(item => ({
      vars: {
        question: item.question
      },
      assert: [
        {
          type: "icontains",
          value: item.answer
        }
      ]
    })),
    sharing: {
      apiBaseUrl: BOT_BRIDGE_BASE_URL,
      appBaseUrl: BOT_BRIDGE_BASE_URL
    }
  };
  const yamlContent = yaml.dump(yamlConfig, {
    lineWidth: -1,
    noRefs: true
  });
  const randomFileName = `test_config_${Math.random().toString(36).substring(2)}.yaml`;
  const filePath = path.join(targetDir, randomFileName);
  fs.writeFileSync(filePath, yamlContent, 'utf8');
  return filePath;
}

async function handler(request, reply) {
  try {
    console.log('>>>>>> Request Body <<<<<<<<', request.body);
    const data = await connection(request?.body?.unique);
    const targetDir = path.join(process.cwd(), 'controller', 'bot-bridge');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const yamlFile = generateYamlFile(data, targetDir);
    const fileName = path.basename(yamlFile);
    const options = {
      cwd: targetDir,
      timeout: 30000,
      maxBuffer: 1024 * 1024 * 10,
      shell: true
    };
    const command = `promptfoo eval --verbose --config ${fileName}`;
    try {
      const exec = util.promisify(require('child_process').exec);
      const { stdout } = await exec(command, options);
      return reply.status(statusCode.success).send({
        success: true,
        data: {
          stdout: stdout.trim(),
          yamlFile: fileName,
        }
      });
    } catch (execError) {
      try {
        const { stdout: versionOutput } = await exec('promptfoo --version', { shell: true });
        console.log('promptfoo version:', versionOutput.trim());
      } catch (versionError) {
        console.error('Error checking promptfoo version:', versionError.message);
      }
      return reply.status(statusCode.success).send({
        success: true,
        data: {
          stdout: execError.stdout ? execError.stdout.trim() : null,
          yamlFile: fileName,
          command: command,
        }
      });
    }
  } catch (error) {
    return reply.status(statusCode.internalError).send({
      success: false,
      message: failMessage.internalError,
      error: error.message,
      stack: error.stack
    });
  }
}

module.exports = {
  handler,
};
const { statusCode, successMessage, failMessage } = require('~/common/message');
require('dotenv').config();

async function upscalePPI(request, reply) {
  try {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ message: 'NO FILE UPLOADED' });
    }

    const originalFilename = data.filename;
    const fileExtension = originalFilename.split('.').pop().toLowerCase();
    const fileBuffer = await data.toBuffer();

    console.log("====================================");
    console.log(originalFilename);
    console.log(fileExtension);
    console.log(fileBuffer);
    console.log("====================================");

    const myHeaders = new Headers();
    myHeaders.append("Apikey", "651cb124-2137-42c6-825d-3e1ada596fbe");

    // Convert Buffer to Blob
    const inputFile = Buffer.from(fileBuffer);

    const formdata = new FormData();
    formdata.append("inputFile", inputFile);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };

    const response = await fetch("https://api.cloudmersive.com/convert/image/set-dpi/300", requestOptions);
    const arrayBuffer = await response.arrayBuffer();
    // Chuyển thành Buffer
    const resultBuffer = Buffer.from(arrayBuffer);
    console.log(resultBuffer);


    console.log("====================================");
    reply.status(statusCode.success).send({ message: successMessage.index });
  } catch (err) {
    // console.log(err);
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function smoothSkin(request, reply) {
  try {
    const body = request.body;
    const imageUrl = body.image_url;
    const format = body.format;
    const formData = new FormData();
    formData.append('image_url', imageUrl);
    formData.append('format', format);
    const response = await fetch('https://api.picsart.io/tools/1.0/enhance/face', {
      method: 'POST',
      headers: {
        'x-picsart-api-key': process.env.PICSART_API_KEY,
        'accept': 'application/json' 
      },
      body: formData, 
    });
    const resultData = await response.json();
    const imageDownloadUrl = resultData.data.url;

    const imageResponse = await fetch(imageDownloadUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', imageBlob, { filename: 'image.png' });
    cloudinaryFormData.append('upload_preset', 'portal');
    cloudinaryFormData.append('folder', 'iatt');

    const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/farmcode/image/upload', {
      method: 'POST',
      body: cloudinaryFormData,
    });

    const cloudinaryData = await cloudinaryResponse.json();
    reply.status(statusCode.success).send({ data: cloudinaryData.secure_url, message: successMessage.index });
  } catch (err) {
    console.log(err);
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function imageAi(request, reply) {
  try {
    const body = request.body;
    const imageUrl = body.imageUrl;
    const style = body.style;
    const response = await fetch("https://phototoanime1.p.rapidapi.com/photo-to-anime", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-rapidapi-host": "phototoanime1.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        Authorization: "Bearer FIX_ME",
      },
      body: new URLSearchParams({
        url: imageUrl,
        style: style,
      }),
    });
    const resultData = await response.json();
    const imageDownloadUrl = resultData.body.imageUrl;

    const imageResponse = await fetch(imageDownloadUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', imageBlob, { filename: 'image.png' });
    cloudinaryFormData.append('upload_preset', 'portal');
    cloudinaryFormData.append('folder', 'iatt');

    const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/farmcode/image/upload', {
      method: 'POST',
      body: cloudinaryFormData,
    });

    const cloudinaryData = await cloudinaryResponse.json();
    reply.status(statusCode.success).send({ data: cloudinaryData.secure_url, message: successMessage.index });
  } catch (err) {
    console.log(err);
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}


async function backgroundRemove(request, reply) {
  try {
    const { imageUrl } = request.body;
    const formData = new FormData();
    formData.append('sync', '0');
    formData.append('image_url', imageUrl);
    const response = await fetch('https://techhk.aoscdn.com/api/tasks/visual/segmentation', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.PICWISH_API_KEY, // Only include API key in headers
      },
      body: formData, // Let fetch handle FormData headers
    });

    const jsonData = await response.json();
    // console.log("API Response Data:", jsonData);
    const taskId = jsonData.data.task_id;
    let resultData;
    while (true) {
      const resultResponse = await fetch(`https://techhk.aoscdn.com/api/tasks/visual/segmentation/${taskId}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': process.env.PICWISH_API_KEY,
        },
      });

      resultData = await resultResponse.json();

      if (resultData.data && resultData.data.state === 1) {
        // Process completed successfully
        break;
      } else if (resultData.data && resultData.data.state_detail === "Failed") {
        // API returned a failure state
        throw new Error("Image processing failed.");
      }

      // Wait before polling again (e.g., 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const imageDownloadUrl = resultData.data.image;

    const imageResponse = await fetch(imageDownloadUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', imageBlob, { filename: 'image.png' });
    cloudinaryFormData.append('upload_preset', 'portal');
    cloudinaryFormData.append('folder', 'iatt');

    const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/farmcode/image/upload', {
      method: 'POST',
      body: cloudinaryFormData,
    });

    const cloudinaryData = await cloudinaryResponse.json();
    reply.status(statusCode.success).send({ data: cloudinaryData.secure_url, message: successMessage.index });
  } catch (err) {
    console.log(err);
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function enhance(request, reply) {
  try {
    const { imageUrl } = request.body;
    const formData = new FormData();
    formData.append('sync', '0');
    formData.append('image_url', imageUrl);
    const response = await fetch('https://techhk.aoscdn.com/api/tasks/visual/scale', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.PICWISH_API_KEY, // Only include API key in headers
      },
      body: formData, // Let fetch handle FormData headers
    });

    const jsonData = await response.json();
    const taskId = jsonData.data.task_id;
    let resultData;
    while (true) {
      const resultResponse = await fetch(`https://techhk.aoscdn.com/api/tasks/visual/scale/${taskId}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': process.env.PICWISH_API_KEY,
        },
      });

      resultData = await resultResponse.json();

      if (resultData.data && resultData.data.state === 1) {
        // Process completed successfully
        break;
      } else if (resultData.data && resultData.data.state_detail === "Failed") {
        // API returned a failure state
        throw new Error("Image processing failed.");
      }

      // Wait before polling again (e.g., 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const imageDownloadUrl = resultData.data.image;

    const imageResponse = await fetch(imageDownloadUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', imageBlob, { filename: 'image.png' });
    cloudinaryFormData.append('upload_preset', 'portal');
    cloudinaryFormData.append('folder', 'iatt');

    const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/farmcode/image/upload', {
      method: 'POST',
      body: cloudinaryFormData,
    });

    const cloudinaryData = await cloudinaryResponse.json();
    reply.status(statusCode.success).send({ data: cloudinaryData.secure_url, message: successMessage.index });
  } catch (err) {
    console.log(err);
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}


module.exports = {
  upscalePPI,
  backgroundRemove,
  enhance,
  imageAi,
  smoothSkin,
};
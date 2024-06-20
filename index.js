const serverless = require("serverless-http");
const express = require("express");
const app = express();
const getSignedUrl=require("./src/s3URLGenerator").getURL;
const putSignedUrl=require("./src/s3URLGenerator").putURL;
const deletePhoto=require("./src/s3URLGenerator").deletePhoto;
let imgTemplate=require("./src/imageTemplate").imgHTML;
let uiHTML=require("./src/ui").uiHTML;

app.post("/getPhotos/upload", async (req, res, next) => {
  let reqObject=JSON.parse(req.apiGateway.event.body);
  let UploadUrl=await putSignedUrl(reqObject.filename,reqObject.contentType,reqObject.folderName);
  console.log(UploadUrl);
  return res.status(200).json({
    message: UploadUrl,
  });
});

app.get("/getPhotos/:id", async(req, res, next) => {
  let folder=req.params.id;
  const urlList=await getSignedUrl(folder);
  let allImages=``;
  for(i=0;i<urlList.length;i++){
    let imgtemp=imgTemplate;
    imgtemp=imgtemp.replace(`"<<URL>>"`,`"${urlList[i].url}"`);
    imgtemp=imgtemp.replace("*giveImgName*",`"${urlList[i].Key}"`);
    allImages=allImages+imgtemp;
  }
  let resHTML=uiHTML.replace("//putImagesHere//",allImages);
  resHTML=resHTML.replace("//folderName//",`"${folder}"`);
  return res.type(".html").status(200).end(resHTML);
});

app.post("/deletePhoto", async(req, res, next) => {
  let reqObject=JSON.parse(req.apiGateway.event.body);
  await deletePhoto(reqObject.imageName,reqObject.folName);
  console.log("after deletion.....");
  return res.status(200).json({
    status:"Success",
    message:`${reqObject.imageName} Deleted Successfully`
  })
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);

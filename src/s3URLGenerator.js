const {S3Client,GetObjectCommand,ListObjectsV2Command,PutObjectCommand,DeleteObjectCommand}=require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const client = new S3Client({ 
    region: "ap-southeast-1",
    credentials: {
        accessKeyId:process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.MY_AWS_SECRET_ACCESS_KEY
    }
});

async function getURL(folderName){

    const urlList=[];

    const listCommand=new ListObjectsV2Command({
        Bucket:process.env.BUCKET_NAME,
        Prefix:folderName
    })

    const getList=await client.send(listCommand);

    console.log(getList);
    const arr=getList.Contents;
    if(getList.KeyCount==0){
        console.log(`NonExisting/Empty Folder ${getList.Prefix}`);
        return urlList;
    }
    for(i=0;i<arr.length;i++){
        const command=new GetObjectCommand({
            Bucket:process.env.BUCKET_NAME,
            Key:arr[i].Key
        })
        const url=await getSignedUrl(client,command);
        let imgName=arr[i].Key;
        imgName=imgName.split("/")[1];
        console.log(imgName);
        urlList.push({url:url,Key:imgName});
    }
    return urlList;
}

async function putURL(filename,ct,folderName){
    const command=new PutObjectCommand({
        Bucket:process.env.BUCKET_NAME,
        Key:`${folderName}/${filename}`,
        ContentType:ct
    })
    const url=await getSignedUrl(client,command);
     return url;
}

async function deletePhoto(imageName,folderNameOfDelObject){
    console.log("inside deletion.....");
    console.log(imageName);
    console.log(folderNameOfDelObject);
    const delcommand=new DeleteObjectCommand({
        Bucket:process.env.BUCKET_NAME,
        Key:`${folderNameOfDelObject}/${imageName}`,
    })
    await client.send(delcommand);
    console.log("deletion done....")
    return;
}


module.exports.getURL=getURL;
module.exports.putURL=putURL;
module.exports.deletePhoto=deletePhoto;
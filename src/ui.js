const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webpage with Responsive Upload Button</title>
    <style>
    .delete-btn {
        height: 50px;
        width: 60px;
        margin-top: 10px;
        position: relative;
        background-color: #f44336; /* Red */
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1; 
    }
    .delete-btn:hover {
         background-color: #dd3333; /* Darker red on hover */
        }
        body {
            background-color: #e6f2ff; /* Light blue background color */
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow:auto;
        }
        .upload-form {
            background-color: #fff;
            padding: 20px;
            text-align: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 9999;
        }
        .upload-btn, .submit-btn {
            padding: 10px 20px;
            margin: 10px;
            border: none;
            background-color: #4CAF50; /* Green */
            color: white;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
        }
        .submit-btn {
            background-color: #f44336; /* Red */
        }
        /* Hide the default file input */
        .file-input {
            display: none;
        }
        /* Style the label to look like a button */
        .upload-label {
            padding: 10px 20px;
            background-color: #4CAF50; /* Green */
            color: white;
            font-size: 16px;
            cursor: pointer;
            border-radius: 5px;
        }
        .image-container {
            margin-top: 300px; /* Adjust as needed */
            max-width: 100%;
            width: 80%;
            background-color: #002147; /* Dark blue background color */
            padding: 20px;
            border-radius: 10px;
        }
        .image-container img {
            display: block;
            margin: 0 auto;
            max-width: 100%;
            height: auto;
        }

        .loader {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            position: fixed;
            top: 50%;
            left: 50%;
            right: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            background-color:rgb(69, 151, 132);
            display:none;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
<div class="loader"></div>
<div class="upload-form">
    <h2>Upload Your File</h2>
    <!-- Wrap the input inside a label for better responsiveness -->
    <label for="fileInput" class="upload-label">Choose File</label>
    <input type="file" id="fileInput" class="file-input">
    <button type="submit" class="submit-btn" onclick="uploadFile()">Submit</button>
    <button class="submit-btn" onclick="refreshSite()">Refresh After Changes</button>
</div>
</body>
//putImagesHere//

<script>
    
    // JavaScript to display the chosen file name
    const folderName= //folderName// ;
    const fileInput = document.getElementById('fileInput');
    const uploadLabel = document.querySelector('.upload-label');
    let loader=document.getElementsByClassName("loader")[0];
    let loader_background=document.getElementsByClassName("loader-background")[0];
    let filename="";
    let contentType="";

    fileInput.addEventListener('change', function() {
        fileName = this.files[0].name;
        contentType=this.files[0].type;
        uploadLabel.textContent = fileName;
    });

    function uploadFile() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a file.');
            return;
        }

        const metaData={
            filename:fileName,
            contentType:contentType,
            folderName:folderName
        }

        fetch('/getPhotos/upload/', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(metaData)
        })
        .then(async(response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let resp=await response.json();
            console.log(resp);
            loader.style.display="flex";
            document.body.style.overflow="hidden";
            await uploadImageToBucket(file,resp.message);
        })
        .then(data => {
            loader.style.display="none";
            document.body.style.overflow="auto";
            uploadLabel.textContent="Choose File";
            console.log('File upload successful:', data);
        })
        .catch(error => {
            console.error('There was a problem with the upload:', error);
            // Handle error if needed
        });
    }

   async function uploadImageToBucket(imageFile,url) { 
        await fetch(url, {
            method: 'PUT',
            'Content-Type':'multipart/form-data',
            body: imageFile
        })
        .catch(error => {
            console.error('There was a problem with the image upload:', error);
            // Handle error if needed
        });
    }

    function refreshSite(){
        window.location.reload();
    }
     function deleteImage(event){
        imageName=event.target.id;
        let obj={
        imageName:imageName,
        folName:folderName
         }

    loader.style.display="flex";
    document.body.style.overflow="hidden";

    fetch('/deletePhoto', {
    method: 'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body: JSON.stringify(obj)
}).then(async(response) => {
    loader.style.display="none";
    document.body.style.overflow="auto";
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    let resp=await response.json();
    console.log(resp);
}).catch(error => {
    console.error('There was a problem with the image deletion:', error);
    // Handle error if needed
});
}

</script>

</html>
`

module.exports.uiHTML = html;


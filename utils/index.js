import { storage } from '../firebase/clientApp';

export function getFileSize(bytes) {
    const exp = Math.log(bytes) / Math.log(1024) | 0;
    const result = (bytes / Math.pow(1024, exp)).toFixed(2);
    const unit = exp === 0 ? 'Bytes' : 'KMGTPEZY'[exp - 1] + 'B';

    return `${result} ${unit}`;
}

export function getImageSize(imageURL) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = function () {
            resolve({ width: this.naturalWidth, height: this.naturalHeight });
        }
        image.onerror = reject;
        image.src = imageURL;
    });
}

export function getCroppedImg(image, crop, fileName, fileMimeType = "image/jpeg") {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            blob.name = fileName;
            resolve(blob);
        }, fileMimeType);
    });
}

export function downloadBlob(blob) {
    const dataImg = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = dataImg;
    link.download = name;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );

    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(dataImg);
        link.remove();
    }, 100);
}

export function uploadFileToFirebaseStorage(dirName, fileName, img) {
    if (!img) {
        console.error(`not an image, the image file is a ${typeof (img)}`);
        return;
    }
    const uploadTask = storage.ref(`/${dirName}/${fileName}`).put(img);
    //initiates the firebase side uploading 
    uploadTask.on('state_changed',
        (snapShot) => {
            console.log(snapShot)
        }, (err) => {
            console.log(err)
        }, () => {
            storage.ref(dirName).child(fileName).getDownloadURL()
                .then(fireBaseUrl => {
                    fetch(fireBaseUrl)
                        .then((response) => response.blob())
                        .then((blob) => {
                            downloadBlob(blob);
                        })
                        .catch(console.error);
                })
        });
}
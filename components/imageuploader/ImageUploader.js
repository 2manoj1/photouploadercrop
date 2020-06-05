import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/router';
import { Row, Col, Button, Alert } from 'reactstrap';
import styles from './ImageUploader.module.scss';
import ImageTabsCropper from './ImageTabsCropper';
import { ERR_FILE_SIZE_1024, ERR_GENERIC, FILE_FORMAT_SUPPORT, FILE_MAX_WIDTH, FILE_MAX_HEIGHT, FILE_UPLOADER_MSG } from '../../constants';
import { getImageSize, getFileSize } from '../../utils';


const ImageUploader = () => {
  const router = useRouter();
  const [selectedImgFile, setSelectedImgFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const onDrop = useCallback(acceptedFiles => {
    setErrorMsg("");
    setSelectedImgFile(null);
    if (acceptedFiles?.length > 1) {
      setErrorMsg(File_UPLOAD_LIMIT);
      return;
    }
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      getImageSize(reader?.result).then(({ width, height }) => {
        if (+width === FILE_MAX_WIDTH && +height === FILE_MAX_HEIGHT) {
          return true;
        }
        setErrorMsg(`${ERR_FILE_SIZE_1024} - File Name: ${file.name}`);
        return false;
      }).then((d) => {
        if (d) {
          setSelectedImgFile(Object.assign(file, {
            preview: reader?.result
          }));
        }
      })
        .catch((err) => {
          setErrorMsg(ERR_GENERIC);
          console.error(err);
        });

    }
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: FILE_FORMAT_SUPPORT,
    onDrop,
    multiple: false
  });

  const onDismiss = () => setErrorMsg("");

  const imgPreviewComp = selectedImgFile && (
    <div>
      <div>{`File Name: ${selectedImgFile.name}`}</div>
      <div>{`File Size: ${getFileSize(selectedImgFile.size)}`}</div>
      <p>Adjust corp and upload one by one Image to cloud</p>
      <p>Note: After Upload file will download in local system</p>
    </div>
  );

  return (
    <>
      <Row className="py-2">
        <Col xs="5">
          <div {...getRootProps()} style={{ width: 400, height: 100, border: '1px green solid' }}>
            <input {...getInputProps()} />
            <p className="text-center">{FILE_UPLOADER_MSG}</p>
          </div>
        </Col>
        <Col xs="5">
          <aside className={styles.thumbsContainer}>
            {imgPreviewComp}
          </aside>
        </Col>
        <Col>
          <Button color="primary" onClick={() => router.push('/photos')}>All Photos</Button>
        </Col>
      </Row>
      <Row>
        <Alert color="danger" isOpen={errorMsg !== ""} toggle={onDismiss}>{errorMsg}</Alert>
      </Row>

      {selectedImgFile && <ImageTabsCropper selectedImgFile={selectedImgFile} />}
    </>
  )
}

export default ImageUploader;
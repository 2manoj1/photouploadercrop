import React, { useCallback, useState, useEffect,useRef } from 'react';
import { Row, Col, Button } from 'reactstrap';
import ReactCrop from 'react-image-crop';
import { getCroppedImg, uploadFileToFirebaseStorage } from '../../utils';

const ImageCropper = ({data, selectedImgFile}) => {
  const [crop, setCrop] = useState(null);
  const imgRef = useRef(null);
  useEffect(() => {
    const {x, y, width, height, unit} = data;
    setCrop({
      x,
      y,
      unit,
      width,
      height
    });
  }, [data]);

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  const handleFireBaseUpload = async () => {
    if (imgRef.current && crop.width && crop.height) {
      const time = (new Date()).getTime();
      const fileName = `${data.imgType}_${time}_${selectedImgFile.name}`;
      const croppedImg = await getCroppedImg(imgRef.current, crop, fileName, selectedImgFile.type);

      uploadFileToFirebaseStorage('images', fileName, croppedImg);
    }
  }

  return (
    <>
      {selectedImgFile && <Row>
        <Col xs="12" className="text-center">
          {crop && <ReactCrop
            src={selectedImgFile.preview}
            locked={!data.isResizeble}
            crop={crop}
            onImageLoaded={onLoad}
            onChange={newCrop => {
              setCrop(newCrop)
            }} />}
        </Col>
        <Col className="text-center">
          <Button className="fabBtn" color="primary" onClick={handleFireBaseUpload}>
            Upload
        </Button>
        </Col>
      </Row>
      }
    </>
  )
}

export default ImageCropper;
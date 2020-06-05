import React, { useState } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Card, CardImg, Modal, ModalBody, ModalHeader, Spinner, Button, NavLink } from 'reactstrap';
import useFirebaseImg from '../../hooks/useFirebaseImg';

const Gallary = () => {
    const [imgUrls, loading] = useFirebaseImg('/images');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImg, setCurrentImg] = useState(null);


    const toggleModal = () => {
        setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen)
    }

    const showModalImage = selectedImg => {
        toggleModal();
        setCurrentImg(selectedImg);
    }

    return (
        <Container>
            <Row>
                <Col md={{ size: 10, offset: 1 }} className="thumbnail-gallery">
                    <Link href="/">
                        <Button className="my-2" color="primary">Home</Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col md={{ size: 10, offset: 1 }} className="thumbnail-gallery">
                    <h5 className="text-center my-3"> Gallery </h5>
                    <Row>
                        {loading && (<Col sm="12" className="d-flex justify-content-center">
                            <Spinner
                                className="text-center"
                                color="info" style={{ width: '5rem', height: '5rem' }}
                                type="grow" />
                        </Col>)}
                        {!loading && imgUrls.map((imgItem, i) => (
                            <Col
                                md="3"
                                className="my-2"
                                key={i}
                                onClick={() => showModalImage(imgItem)}

                            >
                                <Card className="image-card">
                                    <CardImg src={imgItem.url} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
            {currentImg && <Modal
                className="modal-xl"
                isOpen={isModalOpen}
                toggle={toggleModal}
            >
                <ModalHeader toggle={toggleModal}>{currentImg.metaData.name}</ModalHeader>
                <ModalBody>

                    <Row>
                        <Col md="12">
                            <div className="d-flex justify-content-center">
                                {currentImg && <img src={currentImg.url} alt={currentImg.metaData.filePath} className="img-fluid" />}
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>}
        </Container>
    );
};

export default Gallary;
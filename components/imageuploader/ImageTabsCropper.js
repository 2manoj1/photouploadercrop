import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import ImageCropper from './ImageCropper';
import imageCropProperty from '../../constants/imgInfo';

const ImageTabsCropper = ({selectedImgFile}) => {
    const [activeTab, setActiveTab] = useState(imageCropProperty[0].id);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }
    const activeDataContent = imageCropProperty.find(item => item.id === activeTab);
    return (
        <div>
            <Nav tabs>
                {
                    imageCropProperty?.map((item, i) => (
                    <NavItem key={item.id}>
                        <NavLink
                            className={classnames({ active: activeTab === item.id })}
                            onClick={() => toggle(item.id)}
                        >
                            {item.dispalyText}
                        </NavLink>
                    </NavItem>))
                }
            </Nav>
            <TabContent activeTab={activeTab}>
                <Row>
                    <Col sm="12">
                        {activeDataContent && <ImageCropper data={activeDataContent} selectedImgFile={selectedImgFile}/>}
                    </Col>
                </Row>
            </TabContent>
        </div>
    );
};

export default ImageTabsCropper;
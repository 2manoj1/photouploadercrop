import React, {useState, useEffect} from 'react';
import { storage } from '../firebase/clientApp';

export default function useFirebaseImg(storagePath = '/images') {
    const [imgUrls, setImgUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const getAllPhotos = async () => {
            try {
                const stRef = storage.ref();
                const imagesRef = stRef.child(storagePath);
                const result = await imagesRef.listAll();
                const allUrlsPromise = result.items.map(async (imageRef) => {
                    try {
                        const metaData = await imageRef.getMetadata();
                        const url = await imageRef.getDownloadURL();
                        return { metaData, url };
                    }
                    catch (err) {
                        console.error(err);
                        return err;
                    }
                });
                const allUrls = await Promise.all(allUrlsPromise);
                setImgUrls(allUrls);
                setLoading(false)
            }
            catch (err) {
                console.error(err);
                setError(err);
            }
        }
        getAllPhotos();
    }, [storagePath]);
    return [imgUrls, loading, error];

}
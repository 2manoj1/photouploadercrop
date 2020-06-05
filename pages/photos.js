import Head from 'next/head';
import Gallary from '../components/photosgallary/Gallary';


const Photos = () => {
    return (
        <div>
            <Head>
                <title>All Photos from Firebase</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Gallary/>
            </main>
        </div>
    );
}

export default Photos;


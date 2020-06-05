import Head from 'next/head'
import ImageUploader from '../components/imageuploader/ImageUploader'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ImageUploader />
      </main>
    </div>
  )
}

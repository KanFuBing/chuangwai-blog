import { ListItem, ListItemButton, ListItemText, Divider, Button, Link } from '@mui/material'
import { ref } from 'firebase/storage'
import { uploadBytes, getDownloadURL } from 'firebase/storage'
import { GetServerSideProps } from 'next'
import router from 'next/router'
import { ChangeEvent, useState } from 'react'
import Layout from '../../layout'
import { adminDb } from '../../utils/admin'
import { addFbDoc, storage } from '../../utils/firebase'
import propsWrapper from '../../utils/ssr'
import { BlogPageProps, Article } from '../../utils/types'

type ConsolePageProps = BlogPageProps & {
  docs: Article[]
}

const ConsolePage = ({ docs, settings }: ConsolePageProps) => {
  const [isDisabled, setIsDisabled] = useState(false)
  const newArticle = async () => {
    setIsDisabled(true)
    const article = await addFbDoc('articles', {
      time: Date.now(),
      title: '新文章',
      tags: [],
      cover: ''
    })
    router.push(`/console/article/${article.id}`)
  }

  const [selectedFile, setSelectedFile] = useState<File>()
  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile((event.target.files as FileList)[0])
  }
  const [url, setUrl] = useState('')
  const upload = () => {
    if (selectedFile) {
      const fileName = `${Math.random()}.${selectedFile.name.split('.')[1]}`
      uploadBytes(ref(storage, fileName), selectedFile).then(async snapshot => {
        setUrl(await getDownloadURL(snapshot.ref))
      })
    }
  }
  const copyUrl = () => {
    navigator.clipboard.writeText(url)
  }

  return (
    <Layout title='控制台' {...settings}>
      <ListItem>
        <ListItemButton onClick={() => router.push(`/console/settings`)}>
          <ListItemText primary='设定' />
        </ListItemButton>
      </ListItem>
      <Divider />
      {
        docs.map(article => (
          <nav key={article.id}>
            <ListItem>
              <ListItemButton onClick={() => router.push(`/console/article/${article.id}`)}>
                <ListItemText primary={`${article.title} （时间：${new Date(article.time).toLocaleDateString()}，ID：${article.id}）`} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </nav>
        ))
      }
      <br></br>

      <Button onClick={newArticle} disabled={isDisabled} variant='outlined'>新文章</Button>
      <br></br><br></br>
      <Divider></Divider>

      <br></br>
      <input type='file' onChange={changeHandler} style={{
        fontFamily: "'Noto Serif SC'",
        borderStyle: 'inset',
        width: '100%'
      }}></input>
      <Button variant='contained' onClick={upload}>上传</Button>
      <br></br><br></br>
      <Link href={url} target='_blank' rel='noreferrer' sx={{
        borderStyle: 'outset',
        width: '100%',
        display: 'block',
        overflow: 'scroll'
      }}>{url}<br></br></Link>
      <Button variant='outlined' onClick={copyUrl}>Copy</Button>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const articlesSnapPromise = adminDb.collection('articles').orderBy('time', 'desc').get()
  return await propsWrapper({ querySnapPromises: [articlesSnapPromise] })
}

export default ConsolePage

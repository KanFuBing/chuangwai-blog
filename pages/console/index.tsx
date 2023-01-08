import { ListItem, ListItemButton, ListItemText, Divider, Button, Link, Typography } from '@mui/material'
import { ref } from 'firebase/storage'
import { uploadBytes, getDownloadURL } from 'firebase/storage'
import { GetServerSideProps } from 'next'
import router from 'next/router'
import { ChangeEvent, useState } from 'react'
import Layout from '../../layout'
import { adminDb, ssGetColSnap } from '../../utils/admin'
import { addFbDoc, storage } from '../../utils/firebase'
import propsWrapper from '../../utils/ssr'
import { BlogPageProps, Article, Tag } from '../../utils/types'

type ConsolePageProps = BlogPageProps & {
  docs: (Article | Tag)[]
}

const ConsolePage = ({ docs, settings }: ConsolePageProps) => {
  const articles = docs.filter(doc => doc.hasOwnProperty('title')) as Article[]
  const tags = docs.filter(doc => doc.hasOwnProperty('name')) as Tag[]

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
  const newTag = async () => {
    setIsDisabled(true)
    const tag = await addFbDoc('tags', {
      description: '',
      name: '新标签',
    })
    router.push(`/console/tag/${tag.id}`)
  }

  const [selectedFile, setSelectedFile] = useState<File>()
  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile((event.target.files as FileList)[0])
  }
  const [url, setUrl] = useState('')
  const upload = () => {
    if (selectedFile) {
      const path = `blog/${Math.random()}.${selectedFile.name.split('.')[1]}`
      uploadBytes(ref(storage, path), selectedFile).then(async snapshot => {
        setUrl(await getDownloadURL(snapshot.ref))
      })
    }
  }
  const copyUrl = () => {
    navigator.clipboard.writeText(url)
  }

  return (
    <Layout title='控制台' {...settings}>
      <Typography variant='h4'>设定与文章</Typography>
      <br></br>
      <Divider></Divider>  
      <ListItem>
        <ListItemButton onClick={() => router.push(`/console/settings`)}>
          <ListItemText primary='设定' />
        </ListItemButton>
      </ListItem>
      <Divider />

      {
        articles.map(article => (
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
      <Typography variant='h4'>标签</Typography>
      <br></br>
      <Divider></Divider>   
      {
        tags.map(tag => (
          <nav key={tag.id}>
            <ListItem>
              <ListItemButton onClick={() => router.push(`/console/tag/${tag.id}`)}>
                <ListItemText primary={tag.name} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </nav>
        ))
      }
      <br></br>
      <Button onClick={newTag} disabled={isDisabled} variant='outlined'>新标签</Button>
      
      
      <br></br><br></br>
      <Divider></Divider>
      <br></br>
      <Typography variant='h4'>文件</Typography>
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
  const tagsSnapPromise = ssGetColSnap('tags')
  return await propsWrapper({ querySnapPromises: [articlesSnapPromise, tagsSnapPromise] })
}

export default ConsolePage

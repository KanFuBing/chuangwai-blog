# 窗外博客

***主要自用的极简 Blog。***

> 为了写博客而写代码，决不为写代码而写博客。

以 Google 免费服务 [`Firebase`](https://firebase.google.com/) 的 `Firestore` 和 `Storage` 为后端，前端使用 `Next.js` 和 `Material UI`。完全使用安全规则鉴权，坚持不使用 API 控制读写权限。

已有功能：
- `Firebase` 自带的 `Google Analytics`
- 采用 [`Markdown-it`](https://github.com/markdown-it/markdown-it) 实现 Markdown 支持
- 侧边栏简介
- 在 `/console` 路径下的在线编辑器
- 用 `Middleware` 屏蔽大陆 IP
- 标签分类（用空格分割标签）
- 图床
- 评论

已知问题和权宜之计：

- [ ] 无法自动执行 script 标签；通过手动加上 `id='Markdown Script'` 并于加载完毕后在全局范围内执行 
  
> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKanFuBing%2Fchuangwai-blog&env=NEXT_PUBLIC_FIREBASE_CONFIG&envDescription=Firebase%20Configuration)
> 
> 若想使用，请创建一个 `Firebase` 项目，然后参考以下内容：
> 
> Firestore 安全规则：
> ```js
> rules_version = '2';
> service cloud.firestore {
> match /databases/{database}/documents {
> 	function isAdmin() {
>    	return request.auth.uid == 'Your Account UID in Firebase Authentication of Your App';
>    }
>  
>    match /articles/{document=**} {
>      allow write: if isAdmin();
>      allow read;
>    }
>    match /settings/{document=**} {
>    	allow write: if isAdmin();
>      allow read;
>    }
>    match /texts/{document=**} {
>    	allow write: if isAdmin();
>      allow read;
>    }
>    match /comments/{document=**} {
>      allow read;
>      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid && request.resource.data.user == request.auth.token.name
>      allow delete: if request.auth.uid == resource.data.uid;
>    }
>  }
>}
>```
>
> Storage 安全规则：
> ```js
>rules_version = '2';
>service firebase.storage {
>  match /b/{bucket}/o {
>  	function isAdmin() {
>    	return request.auth.uid == 'Your Account UID in Firebase Authentication of Your App';
>    }
>   
>  match /{allPaths=**} {
>      allow read: if true;
>      allow create: if isAdmin();
>    }
>  }
>}
>```
>
> 环境变量：
> ```js
> NEXT_PUBLIC_FIREBASE_CONFIG="Your Firebase Configuration in JSON Format"
> ```

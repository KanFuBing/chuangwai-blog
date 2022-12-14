# 窗外博客 ![](public/favicon-32x32.png)

***自用的极简 Blog。***

> 为了写博客而写代码，决不为写代码而写博客。

以 Google 免费 Baas 服务 [`Firebase`](https://firebase.google.com/) 的 `Firestore` 和 `Storage` 为后端，前端使用 `Next.js` 和 `Material UI`。完全使用安全规则鉴权，坚持不使用 API 控制读写权限。

目前，全面采用 `firebase-admin` 进行服务器端渲染。

已有功能：
- 基于 [`next-pwa`](https://www.npmjs.com/package/next-pwa) 的 `PWA`
- `Firebase` 自带的 `Google Analytics` 和 `Performance`
- `Firebase App Check` 避免博客被攻击或滥用
- 基于 `Firebase Authentication` 的 `Twitter`、`GitHub` 和 `Google` 登入
- 自动生成于 `/api/sitemap.txt` 的 `Google Sitemap`
- 采用 [`Markdown-it`](https://github.com/markdown-it/markdown-it) 实现 `Markdown` 支持
- 在 `/console` 路径下的在线编辑器和 Markdown 查看器
- 用 `Middleware` 屏蔽大陆 IP
- 标签分类（用空格分割标签）
- 侧边栏简介
- 精确分页
- 图床
- 评论

已知问题和权宜之计：

- [ ] 无法自动执行 script 标签；通过手动加上 `id='Markdown Script'` 并于加载完毕后在全局范围内执行 
- [ ] `Sitemap` 无效
  
> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKanFuBing%2Fchuangwai-blog&env=NEXT_PUBLIC_FIREBASE_CONFIG,FIREBASE_ADMIN_CONFIG,RECAPTCHA_PUBLIC_KEY&envDescription=NEXT_PUBLIC_FIREBASE_CONFIG%3D%22Your%20Firebase%20Configuration%20in%20JSON%20Format%22%2C%20FIREBASE_ADMIN_CONFIG%3D%22Your%20Firebase%20Admin%20Service%20Account%20Configuration%20in%20JSON%20Format%22%2C%20RECAPTCHA_PUBLIC_KEY%3D%22Your%20ReCAPTCHA%20Public%20Key%20For%20App%20Check%22&demo-title=Chuangwai%20Blog&demo-description=%E7%AA%97%E5%A4%96%E6%B5%AE%E5%86%B0%EF%BC%8C%E5%8D%9A%E5%AE%A2%E7%AB%99%E7%82%B9&demo-url=https%3A%2F%2Fchuangwai.top%2F&demo-image=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fchuang-wai.appspot.com%2Fo%2F0.4270071503869033.png%3Falt%3Dmedia%26token%3Dcf75b2ee-bdeb-4465-84ce-59b5b45b9b1e)
> 
> 若想使用，请创建一个 `Firebase` 项目，设置好 `Analytics`、`Authentication (Google + Twitter + GitHub)`、`Firestore`、`Storage`，然后部署于 `Vercel`。可参考以下内容：
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
> FIREBASE_ADMIN_CONFIG="Your Firebase Admin Service Account Configuration in JSON Format"
> RECAPTCHA_PUBLIC_KEY="Your ReCAPTCHA Public Key For App Check"
> NEXT_PUBLIC_ENV="development || production, not neccesary, only needed when debugging locally"
> ```

export enum AuthenticationStateType {
  Authenticated = 'Authenticated',
  Unauthenticated = 'Unauthenticated',
  Initializing = 'Initializing',
}

export type ImageTag = {
  text: string
  pos: {
    x: number
    y: number
  }
}

export type PostTag = string

export type Comment = {
  id: string
  text: string
  author: string
  createdAt: string
  postId: string
}

export type Post = {
  id: string
  imageTags: ImageTag[]
  title: string
  description: string
  createdAt: number
  postTags: PostTag[]
  image: string
  isResolved: boolean
  comments: Comment[]
}

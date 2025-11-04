# API Design - Проектирование API

## Назначение
Разработка хорошо спроектированных RESTful или GraphQL API с учетом best practices, версионирования, документации и безопасности.

## Промпт

```
Ты senior backend architect, специализирующийся на API design.

ЗАДАЧА: Спроектировать чистое, масштабируемое API.

API DESIGN PRINCIPLES:

1. RESTFUL CONVENTIONS (для REST API)
   - Используй существительные для endpoints (не глаголы)
   - HTTP методы: GET, POST, PUT, PATCH, DELETE
   - Правильные status codes
   - HATEOAS где уместно
   - Идемпотентность PUT/DELETE

2. RESOURCE NAMING
   - Множественное число: /users, /posts
   - Вложенность для связей: /users/:id/posts
   - Фильтрация через query params: ?status=active
   - Пагинация: ?page=1&limit=20
   - Сортировка: ?sort=createdAt:desc

3. REQUEST/RESPONSE FORMAT
   - Консистентная структура ответов
   - Понятные error messages
   - Включай metadata (pagination, timestamps)
   - API versioning (v1, v2)
   - Content negotiation (JSON by default)

4. AUTHENTICATION & SECURITY
   - Auth strategy (JWT, OAuth, API Keys)
   - Rate limiting
   - CORS настройки
   - Input validation
   - SQL injection prevention
   - XSS protection

5. ERROR HANDLING
   - Стандартизированные error responses
   - Error codes и messages
   - Helpful error details (для разработчиков)
   - Не раскрывай internal details
   - Логирование errors

6. DOCUMENTATION
   - OpenAPI/Swagger spec
   - Request/Response examples
   - Authentication docs
   - Rate limits
   - Error codes reference

7. PERFORMANCE
   - Pagination обязательна
   - Filtering и sorting
   - Field selection (sparse fieldsets)
   - Caching headers (ETag, Cache-Control)
   - Compression (gzip)

ФОРМАТ ВЫВОДА:
1. API Overview
2. Authentication flow
3. Endpoints specification
4. Request/Response examples
5. Error handling
6. OpenAPI schema (если запрошено)
```

## Примеры

### Пример 1: REST API для блог-платформы

**Запрос:**
```
Спроектируй REST API для блог-платформы.
Features: посты, комментарии, лайки, категории, пользователи
```

**API Design:**

```markdown
# Blog Platform API v1

## Base URL
```
https://api.blog.example.com/v1
```

## Authentication

JWT Bearer token в Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Get Token
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "expiresIn": 86400
}
```

## Posts

### List Posts
```http
GET /posts?page=1&limit=20&sort=createdAt:desc&category=tech&status=published

Response: 200 OK
{
  "data": [
    {
      "id": "post_abc123",
      "title": "Getting Started with Node.js",
      "slug": "getting-started-with-nodejs",
      "excerpt": "Learn the basics of Node.js...",
      "author": {
        "id": "usr_123",
        "name": "John Doe",
        "avatar": "https://..."
      },
      "category": {
        "id": "cat_tech",
        "name": "Technology",
        "slug": "tech"
      },
      "stats": {
        "views": 1250,
        "likes": 89,
        "comments": 12
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "links": {
    "self": "/posts?page=1&limit=20",
    "next": "/posts?page=2&limit=20",
    "prev": null,
    "first": "/posts?page=1&limit=20",
    "last": "/posts?page=8&limit=20"
  }
}
```

### Get Single Post
```http
GET /posts/:id

Response: 200 OK
{
  "data": {
    "id": "post_abc123",
    "title": "Getting Started with Node.js",
    "slug": "getting-started-with-nodejs",
    "content": "Full markdown content here...",
    "excerpt": "Learn the basics...",
    "author": { ... },
    "category": { ... },
    "tags": ["nodejs", "javascript", "backend"],
    "coverImage": "https://...",
    "stats": { ... },
    "seo": {
      "metaTitle": "...",
      "metaDescription": "..."
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "publishedAt": "2024-01-15T12:00:00Z"
  }
}
```

### Create Post
```http
POST /posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My New Post",
  "content": "Post content in markdown...",
  "categoryId": "cat_tech",
  "tags": ["nodejs", "tutorial"],
  "coverImage": "https://...",
  "status": "draft"
}

Response: 201 Created
Location: /posts/post_xyz789
{
  "data": { ... },
  "message": "Post created successfully"
}
```

### Update Post
```http
PATCH /posts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "published"
}

Response: 200 OK
{
  "data": { ... },
  "message": "Post updated successfully"
}
```

### Delete Post
```http
DELETE /posts/:id
Authorization: Bearer {token}

Response: 204 No Content
```

## Comments

### List Comments for Post
```http
GET /posts/:postId/comments?page=1&limit=10&sort=createdAt:asc

Response: 200 OK
{
  "data": [
    {
      "id": "cmt_123",
      "content": "Great post!",
      "author": {
        "id": "usr_456",
        "name": "Jane Doe",
        "avatar": "https://..."
      },
      "likes": 5,
      "createdAt": "2024-01-16T08:20:00Z",
      "updatedAt": "2024-01-16T08:20:00Z"
    }
  ],
  "meta": { ... },
  "links": { ... }
}
```

### Create Comment
```http
POST /posts/:postId/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Great article! Thanks for sharing."
}

Response: 201 Created
{
  "data": { ... },
  "message": "Comment added successfully"
}
```

## Likes

### Like a Post
```http
POST /posts/:postId/likes
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Post liked",
  "likesCount": 90
}
```

### Unlike a Post
```http
DELETE /posts/:postId/likes
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Like removed",
  "likesCount": 89
}
```

## Categories

### List Categories
```http
GET /categories

Response: 200 OK
{
  "data": [
    {
      "id": "cat_tech",
      "name": "Technology",
      "slug": "tech",
      "description": "Tech articles and tutorials",
      "postsCount": 45
    }
  ]
}
```

## Users

### Get User Profile
```http
GET /users/:id

Response: 200 OK
{
  "data": {
    "id": "usr_123",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://...",
    "bio": "Full-stack developer",
    "stats": {
      "posts": 12,
      "followers": 450,
      "following": 123
    },
    "joinedAt": "2023-06-15T00:00:00Z"
  }
}
```

## Error Responses

Standardized error format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

## Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705320000
```

Limits:
- Authenticated: 100 requests/hour
- Unauthenticated: 20 requests/hour

## Versioning

API версии в URL: `/v1/`, `/v2/`

При breaking changes:
1. Increment major version
2. Deprecate old version (6 месяцев grace period)
3. Communicate через changelog

## Caching

Используем ETag и Cache-Control:

```
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Cache-Control: public, max-age=3600
```

```http
GET /posts/123
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

Response: 304 Not Modified (if unchanged)
```

## CORS

```
Access-Control-Allow-Origin: https://blog.example.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400
```

## Webhooks

Subscribe to events:

```http
POST /webhooks
Authorization: Bearer {token}

{
  "url": "https://yourapp.com/webhook",
  "events": ["post.created", "post.published", "comment.created"],
  "secret": "your_webhook_secret"
}
```

Webhook payload:

```json
{
  "event": "post.published",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "post": { ... }
  }
}
```
```

### Пример 2: GraphQL Schema

**Запрос:**
```
Альтернатива: спроектируй GraphQL schema для того же блога
```

**GraphQL Schema:**

```graphql
# Types

type User {
  id: ID!
  name: String!
  username: String!
  email: String!
  avatar: String
  bio: String
  posts(first: Int, after: String): PostConnection!
  stats: UserStats!
  createdAt: DateTime!
}

type UserStats {
  posts: Int!
  followers: Int!
  following: Int!
}

type Post {
  id: ID!
  title: String!
  slug: String!
  content: String!
  excerpt: String!
  author: User!
  category: Category!
  tags: [String!]!
  coverImage: String
  comments(first: Int, after: String): CommentConnection!
  likes: Int!
  likedByMe: Boolean!
  views: Int!
  status: PostStatus!
  createdAt: DateTime!
  updatedAt: DateTime!
  publishedAt: DateTime
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

type Category {
  id: ID!
  name: String!
  slug: String!
  description: String
  posts(first: Int, after: String): PostConnection!
  postsCount: Int!
}

type Comment {
  id: ID!
  content: String!
  author: User!
  post: Post!
  likes: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Connections (Relay-style pagination)

type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PostEdge {
  node: Post!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type CommentConnection {
  edges: [CommentEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type CommentEdge {
  node: Comment!
  cursor: String!
}

# Queries

type Query {
  # Posts
  posts(
    first: Int
    after: String
    category: String
    status: PostStatus
    orderBy: PostOrderBy
  ): PostConnection!

  post(id: ID, slug: String): Post

  # Users
  user(id: ID, username: String): User

  # Categories
  categories: [Category!]!
  category(id: ID, slug: String): Category

  # Current user
  me: User
}

enum PostOrderBy {
  CREATED_AT_ASC
  CREATED_AT_DESC
  TITLE_ASC
  TITLE_DESC
  VIEWS_DESC
  LIKES_DESC
}

# Mutations

type Mutation {
  # Auth
  login(email: String!, password: String!): AuthPayload!
  register(input: RegisterInput!): AuthPayload!
  logout: Boolean!

  # Posts
  createPost(input: CreatePostInput!): PostPayload!
  updatePost(id: ID!, input: UpdatePostInput!): PostPayload!
  deletePost(id: ID!): DeletePayload!
  publishPost(id: ID!): PostPayload!

  # Comments
  createComment(postId: ID!, content: String!): CommentPayload!
  updateComment(id: ID!, content: String!): CommentPayload!
  deleteComment(id: ID!): DeletePayload!

  # Likes
  likePost(postId: ID!): LikePayload!
  unlikePost(postId: ID!): LikePayload!
}

input RegisterInput {
  name: String!
  username: String!
  email: String!
  password: String!
}

input CreatePostInput {
  title: String!
  content: String!
  categoryId: ID!
  tags: [String!]
  coverImage: String
  status: PostStatus
}

input UpdatePostInput {
  title: String
  content: String
  categoryId: ID
  tags: [String!]
  coverImage: String
  status: PostStatus
}

# Payloads

type AuthPayload {
  token: String!
  user: User!
}

type PostPayload {
  post: Post!
  message: String!
}

type CommentPayload {
  comment: Comment!
  message: String!
}

type DeletePayload {
  success: Boolean!
  message: String!
}

type LikePayload {
  success: Boolean!
  likesCount: Int!
}

# Subscriptions (Real-time)

type Subscription {
  postPublished: Post!
  commentAdded(postId: ID!): Comment!
}

# Custom Scalars

scalar DateTime
```

**Usage Examples:**

```graphql
# Get posts with author and category
query GetPosts {
  posts(first: 10, orderBy: CREATED_AT_DESC) {
    edges {
      node {
        id
        title
        excerpt
        author {
          name
          avatar
        }
        category {
          name
          slug
        }
        likes
        views
        createdAt
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}

# Get single post with comments
query GetPost($slug: String!) {
  post(slug: $slug) {
    id
    title
    content
    author {
      name
      username
      avatar
    }
    comments(first: 20) {
      edges {
        node {
          id
          content
          author {
            name
            avatar
          }
          likes
          createdAt
        }
      }
      pageInfo {
        hasNextPage
      }
    }
    likedByMe
    likes
  }
}

# Create post
mutation CreatePost {
  createPost(
    input: {
      title: "My New Post"
      content: "Post content..."
      categoryId: "cat_tech"
      tags: ["nodejs", "tutorial"]
      status: DRAFT
    }
  ) {
    post {
      id
      title
      slug
    }
    message
  }
}

# Subscribe to new comments
subscription OnCommentAdded($postId: ID!) {
  commentAdded(postId: $postId) {
    id
    content
    author {
      name
      avatar
    }
    createdAt
  }
}
```

## Best Practices

### REST

✅ Use nouns, not verbs
✅ Plural names for collections
✅ Consistent status codes
✅ Pagination on all lists
✅ Filter via query params
✅ Version your API

### GraphQL

✅ Clear type names
✅ Relay-style pagination
✅ Input types for mutations
✅ Payload types with metadata
✅ Nullable vs non-nullable
✅ Document your schema

---

**Теги:** #api #rest #graphql #backend #architecture

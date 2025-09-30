# AI Chat Platform

A modern, fully functional AI chat platform built with Next.js 15, TypeScript, and Prisma. This platform enables users to create AI chatbots, upload and process documents, and view comprehensive analytics.

## 🚀 Features

### 📊 Dashboard

- **Overview**: Central dashboard with key statistics
- **Quick Actions**: Direct access to frequently used functions
- **Real-time Updates**: Live data from conversations and documents

### 📄 Document Management

- **Multi-format Support**: PDF, DOCX, TXT, JPG, PNG files
- **URL Processing**: Automatic processing of website content
- **Drag & Drop Upload**: Intuitive file upload interface
- **Document Viewer**: Built-in viewer for document preview
- **Chunking & Embedding**: Automatic text processing for AI optimization
- **Status Tracking**: Real-time processing status (PROCESSING, COMPLETED, FAILED)
- **Metadata Extraction**: Automatic extraction of document information

### 🤖 AI Chatbot

- **Customizable Settings**:
  - Name and welcome message
  - Color scheme (primary and secondary colors)
  - Tone (professional, friendly, casual)
  - Temperature and response length
  - Fallback messages
- **Embed Code**: Easy integration on websites
- **Live Preview**: Real-time preview of chatbot appearance
- **API Key Management**: Secure access to chatbot functionality
- **Domain Whitelisting**: Restricted access to specific domains
- **Rate Limiting**: Configurable user limits

### 💬 Conversation Management

- **Chat History**: Complete conversation logs
- **Rating System**: 1-5 star ratings with comments
- **Source Tracking**: Which documents were used for answers
- **Performance Metrics**: Response time, token usage, confidence scores
- **Export Functionality**: Export conversations for analysis
- **Filtering & Search**: Advanced search options in conversations

### 📈 Analytics & Reporting

- **Conversation Statistics**:
  - Total number of conversations
  - Average rating
  - Response time metrics
  - Growth percentages
- **Rating Distribution**: Visual representation of user ratings
- **Top Questions**: Most asked questions with trends
- **Conversation Charts**: Timeline of chat activity
- **Performance Insights**: AI model performance and optimization tips

### 🔐 Authentication & Security

- **NextAuth.js Integration**: Secure user authentication
- **Role-based Access**: ADMIN and USER roles
- **Session Management**: Secure session handling
- **API Security**: Protected endpoints with authentication

### ⚙️ Settings & Configuration

- **User Settings**: Profile and preferences
- **Integration Settings**: API configurations
- **System Logs**: Comprehensive logging for debugging
- **Database Management**: Prisma ORM for data management

## 🛠️ Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **TanStack Query**: Data fetching and caching

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Database ORM
- **PostgreSQL**: Primary database
- **NextAuth.js**: Authentication
- **bcryptjs**: Password hashing

### Development Tools

- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **Turbopack**: Fast development builds

## 📁 Project Structure

```
ai-chat-platform/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main application pages
│   └── api/               # API routes
├── components/            # React components
│   ├── analytics/         # Analytics components
│   ├── auth/              # Authentication components
│   ├── chatbot/           # Chatbot components
│   ├── conversations/     # Conversation components
│   ├── dashboard/         # Dashboard components
│   ├── documents/         # Document management
│   ├── shared/            # Shared components
│   └── ui/                # UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── prisma/                # Database schema and migrations
└── types/                 # TypeScript type definitions
```

## 🚀 Installation & Setup

### Requirements

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-chat-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the following variables:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ai_chat_platform"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📖 Usage

### Getting Started

1. **Register an account** via the signup page
2. **Upload documents** in the Documents section
3. **Configure your chatbot** in Settings
4. **Copy the embed code** and add to your website
5. **View analytics** to monitor performance

### Document Upload

- Supported formats: PDF, DOCX, TXT, JPG, PNG
- Maximum file size: 10MB
- Drag & drop or click to upload
- Automatic processing and chunking

### Chatbot Configuration

- Customize appearance with colors and styling
- Set behavior with temperature and response length
- Configure welcome messages and fallback texts
- Test with live preview

### Viewing Analytics

- Dashboard with overview statistics
- Conversation trends and patterns
- Rating analyses and user feedback
- Performance metrics and optimization tips

## 🔧 API Endpoints

### Documents

- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - List documents
- `GET /api/documents/[id]` - Document details
- `DELETE /api/documents/[id]` - Delete document

### Chatbot

- `GET /api/chatbot/settings` - Chatbot settings
- `PUT /api/chatbot/settings` - Update settings
- `POST /api/chat` - Chat endpoint

### Conversations

- `GET /api/conversations` - List conversations
- `GET /api/conversations/[id]` - Conversation details
- `POST /api/conversations/[id]/rate` - Rate conversation

### Analytics

- `GET /api/analytics/stats` - Overview statistics
- `GET /api/analytics/conversations` - Conversation data
- `GET /api/analytics/ratings` - Rating data

## 🗄️ Database Schema

### Key Models

- **User**: Users and authentication
- **Document**: Uploaded documents and metadata
- **DocumentChunk**: Processed text chunks with embeddings
- **ChatbotSettings**: Chatbot configuration
- **Conversation**: Conversations and ratings
- **ConversationSource**: Sources used in answers
- **SystemLog**: System logging

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository with Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms

- **Railway**: For PostgreSQL hosting
- **Supabase**: Database and authentication
- **Docker**: Container deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:

- Open a GitHub issue
- Check the documentation
- Contact the developers

---

**Made with ❤️ for modern AI chat solutions**

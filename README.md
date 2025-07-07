# Legal Document Similarity Search System

A comprehensive legal document similarity search system that implements four different similarity algorithms and provides detailed performance comparisons. Built with React, Node.js, Pinecone vector database, and OpenAI embeddings.

## 🚀 Features

- **Four Similarity Algorithms**: Cosine Similarity, Euclidean Distance, MMR (Maximal Marginal Relevance), and Hybrid Similarity
- **Real-time Document Processing**: Upload PDF and Word documents with automatic text extraction
- **Vector Database Integration**: Pinecone for efficient similarity search with 1024-dimension embeddings
- **Performance Metrics**: Precision, Recall, Diversity Score, Response Time, MAP, and NDCG
- **Side-by-side Comparison**: View results from all four algorithms simultaneously
- **Modern UI**: Beautiful React interface with drag-and-drop file upload
- **Real-time Search**: Instant search results with loading states and progress indicators

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Shadcn UI** for modern component library
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **Pinecone** vector database for similarity search
- **OpenAI** text-embedding-ada-002 for embeddings
- **Supabase** for document storage and metadata
- **PDF-Parse** and **Mammoth** for document processing

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- npm or yarn package manager
- Pinecone account and API key
- OpenAI account and API key
- Supabase account and project setup

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd legal-embeddings
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Pinecone Configuration
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   PINECONE_INDEX_NAME=your_index_name
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

4. **Database Setup**
   
   Run the Supabase migrations to create the necessary tables:
   ```bash
   npx supabase db push
   ```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   npm run dev:server
   ```
   The backend will be available at `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:8081`

### Production Mode

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📖 Usage

### 🔍 Document Upload

1. Navigate to the application in your browser
2. Use the drag-and-drop area or click to select PDF/Word documents
3. Documents are automatically processed and stored in Pinecone
4. Text is extracted and chunked for optimal search performance

### 🔎 Similarity Search

1. Enter your search query in the search bar
2. The system runs all four similarity algorithms simultaneously:
   - **Cosine Similarity**: Standard vector similarity using dot product
   - **Euclidean Distance**: Distance-based similarity measurement
   - **MMR**: Balances relevance and diversity to avoid redundant results
   - **Hybrid**: Combines semantic search with legal entity matching

3. View results in a side-by-side comparison grid
4. Analyze performance metrics for each algorithm

### 📊 Performance Metrics

- **Precision**: Accuracy of relevant results in top results
- **Recall**: Coverage of all relevant documents
- **Diversity Score**: Variety in document types and content
- **Response Time**: Algorithm execution time
- **MAP**: Mean Average Precision for ranking quality
- **NDCG**: Normalized Discounted Cumulative Gain

## 🏗️ Architecture

### 📁 Project Structure

```
legal-embeddings/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages
│   ├── hooks/             # Custom React hooks
│   └── integrations/      # External service integrations
├── server/                # Backend Node.js application
│   ├── index.js          # Express server setup
│   └── services/         # Business logic services
│       ├── documentService.js    # Document processing
│       ├── pineconeService.js    # Vector database operations
│       └── searchService.js      # Search algorithms
├── supabase/             # Database migrations and config
└── public/               # Static assets
```

### 🔄 Data Flow

1. **Document Upload**: Files → Text Extraction → Chunking → Embedding Generation → Pinecone Storage
2. **Search Process**: Query → Embedding → Four Parallel Searches → Results Aggregation → Metrics Calculation
3. **UI Updates**: Real-time progress → Results Display → Performance Comparison

## 🧪 API Endpoints

### 📤 Document Upload
```http
POST /api/upload
Content-Type: multipart/form-data

Body: file (PDF or Word document)
```

### 🔍 Search Documents
```http
POST /api/search
Content-Type: application/json

{
  "query": "search terms",
  "limit": 10
}
```

### 🏥 Health Check
```http
GET /api/health
```

## 🔧 Configuration

### 🎯 Pinecone Setup

1. Create a Pinecone index with:
   - **Dimensions**: 1536 (for OpenAI text-embedding-ada-002)
   - **Metric**: Cosine similarity
   - **Environment**: Choose based on your region

2. Update your `.env` file with the correct index name and environment

### 📊 Supabase Setup

1. Create a new Supabase project
2. Enable Row Level Security (RLS)
3. Create a storage bucket named `legal-documents`
4. Run the provided migrations

## 🚨 Troubleshooting

### Common Issues

1. **Server won't start**: Check if all environment variables are set correctly
2. **Pinecone connection failed**: Verify API key and index configuration
3. **File upload errors**: Ensure Supabase storage bucket exists and has proper permissions
4. **Search returns no results**: Check if documents have been properly indexed

### 📝 Logs

Check the console output for detailed error messages and debugging information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing excellent embedding models
- Pinecone for the vector database infrastructure
- Supabase for backend services
- The React and Node.js communities for amazing tools and libraries

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem

---

**Built with ❤️ for legal document analysis and similarity search**

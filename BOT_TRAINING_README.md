# Bot Training System

This system allows you to create custom AI chatbots for Australian small businesses.

## Features

### File Upload System

- Supports .txt, .md, .doc, .docx files
- Automatic text extraction from documents
- File management with upload/remove functionality

### Website Data Integration

- Website URL input for automatic content scraping
- Intelligent content extraction from web pages
- Automatic integration of website data into training

### Bot Configuration

- Bot name and personality settings
- Manual training data input
- Combined training data from files, websites, and manual input
- Built-in bot configuration training data
- Comprehensive bot best practices and guidelines

### Chat Interface

- Real-time chat with your trained bot
- Message history with timestamps
- Auto-scroll to latest messages
- Loading indicators during API calls

### API Integration

- OpenAI GPT-3.5-turbo integration
- Australian small business context
- Error handling and response management

## Setup

1. Ensure you have your OpenAI API key in `.env.local`:

   ```
   OPENAI_API_KEY=your_api_key_here
   ```

2. The system is ready to use at `/bots/train-your-own`

## Usage

1. **Configure Your Bot**: Enter bot name and personality
2. **Add Training Data**:
   - Upload files (.txt, .md, .doc, .docx)
   - Scrape website content by entering a URL
   - Add bot configuration training data
   - Add manual training data
3. **Save Configuration**: Save your bot settings
4. **Start Chatting**: Begin conversations with your trained bot

## API Routes

- `POST /api/bots/train-your-own` - Chat endpoint for the train-your-own bot

## File Types Supported

- `.txt` - Plain text files
- `.md` - Markdown files
- `.doc` - Microsoft Word documents
- `.docx` - Microsoft Word documents (newer format)

## Error Handling

The system includes comprehensive error handling for:

- Invalid file types
- File processing errors
- API communication failures
- Network issues
- OpenAI API errors

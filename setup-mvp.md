# Jobbcentralen MVP Setup Guide

## Quick Start Instructions

### 1. Environment Setup

Create a `.env` file in the root directory with your credentials:

```env
# Supabase Configuration (get these from your Supabase project dashboard)
NUXT_SUPABASE_URL=https://your-project.supabase.co
NUXT_SUPABASE_ANON_KEY=your_anon_key_here

# OpenAI Configuration (get from https://platform.openai.com)
OPENAI_API_KEY=sk-your-openai-key-here
```

### 2. Supabase Database Setup

1. **Create a new Supabase project** at https://supabase.co
2. **Go to SQL Editor** in your Supabase dashboard
3. **Copy and paste** the entire contents of `database/mvp-schema.sql`
4. **Run the SQL** to create all tables, policies, and sample jobs

### 3. Create Storage Bucket

1. **Go to Storage** in your Supabase dashboard
2. **Create a new bucket** named `cv`
3. **Make it private** (uncheck "Public bucket")
4. **Add the following policies** to the `cv` bucket:

```sql
-- In the Storage policies section, add these 4 policies for the 'cv' bucket:

CREATE POLICY "Users can upload their own CVs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'cv' AND auth.uid() = owner);

CREATE POLICY "Users can view their own CVs" ON storage.objects
FOR SELECT USING (bucket_id = 'cv' AND auth.uid() = owner);

CREATE POLICY "Users can update their own CVs" ON storage.objects
FOR UPDATE USING (bucket_id = 'cv' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own CVs" ON storage.objects
FOR DELETE USING (bucket_id = 'cv' AND auth.uid() = owner);
```

### 4. Start Development

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### 5. Test the MVP Features

1. **Visit** http://localhost:3000
2. **Sign up** using the magic link authentication
3. **Upload a CV** (PDF, DOCX, or TXT file)
4. **Browse jobs** to see the 5 sample jobs
5. **View job matches** on your dashboard
6. **Test CV optimization** on a job detail page

## Core MVP Features Available

- ✅ **Magic Link Authentication** - Sign in with email
- ✅ **CV Upload & Processing** - Upload PDF/DOCX/TXT files
- ✅ **Job Browsing** - View and search 5 sample jobs
- ✅ **Job Matching** - Basic keyword-based matching algorithm
- ✅ **AI CV Optimization** - OpenAI-powered CV suggestions
- ✅ **Document Management** - View uploaded CVs
- ✅ **Responsive Design** - Mobile-first UI

## What's NOT Included in MVP

- ❌ Premium features/payments
- ❌ Cover letter support
- ❌ Job scraping
- ❌ Advanced matching algorithms
- ❌ Email notifications
- ❌ User profiles

## Testing the Core Functionality

### Test CV Upload
1. Go to Dashboard
2. Upload a CV file (try with a PDF containing relevant keywords like "JavaScript", "React", "Stockholm")
3. Check that it appears in the dashboard

### Test Job Matching
1. After uploading CV, refresh the dashboard
2. You should see job matches based on keyword overlap
3. Higher scores mean better matches

### Test CV Optimization
1. Click on any job from the jobs page
2. If you have a CV uploaded, click "Optimize CV"
3. Wait for OpenAI to generate suggestions
4. View the side-by-side comparison

## Sample Jobs Included

The MVP includes 5 sample Swedish tech jobs:
- Frontend Developer (Stockholm)
- Full Stack Developer (Göteborg)
- UX Designer (Malmö)
- Backend Developer (Stockholm)
- Data Analyst (Remote)

## Troubleshooting

### Common Issues

1. **"Failed to upload file"**
   - Check that the `cv` storage bucket exists
   - Verify storage policies are set correctly
   - Ensure file is under 5MB

2. **"No job matches found"**
   - Make sure you've uploaded a CV first
   - Check that the sample jobs were inserted (run the SQL again if needed)

3. **"OpenAI optimization failed"**
   - Verify your OpenAI API key is correct
   - Check that you have credits in your OpenAI account

4. **Authentication issues**
   - Verify Supabase URL and anon key in `.env`
   - Check email settings in Supabase Auth dashboard

### Checking Database

You can verify the setup worked by running these queries in Supabase SQL Editor:

```sql
-- Check if jobs were inserted
SELECT COUNT(*) FROM jobs;

-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

## Next Steps After MVP

Once the MVP is working, you can add:
- Job scraping from external sources
- Enhanced matching algorithms
- Premium features and payments
- Email notifications
- User profiles and preferences
- Cover letter support

Happy coding! 🚀

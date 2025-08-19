# 🚀 Update Google Apps Script Deployment

## The Problem
Your emails are showing green instead of blue and missing your logo because the Google Apps Script deployment hasn't been updated with the new templates.

## How to Fix This

### Step 1: Go to Google Apps Script
1. Open your browser and go to: https://script.google.com/
2. Find your Veteran Legacy Life project
3. Click on it to open

### Step 2: Update Templates.gs
1. In the left sidebar, click on `Templates.gs`
2. **Delete all the current content** in the file
3. **Copy the entire content** from `funnel-app/google_scripts/Templates.gs`
4. **Paste it** into the Google Apps Script editor
5. **Save** the file (Ctrl+S or Cmd+S)

### Step 3: Deploy the Updated Script
1. Click the **"Deploy"** button at the top
2. Select **"New deployment"**
3. Give it a description like "Updated email templates with blue design and logo"
4. Click **"Deploy"**
5. **Copy the new deployment URL**

### Step 4: Update Your Frontend
1. Open `funnel-app/src/config/globalConfig.ts`
2. Replace the old deployment URL with the new one
3. Save the file

### Step 5: Test
1. Complete a test application through your funnel
2. Check the emails - they should now be blue with your logo!

## What's Fixed
- ✅ Blue color scheme (matching your website)
- ✅ Your logo in header and footer
- ✅ Professional design
- ✅ Proper beneficiary formatting
- ✅ Removed unnecessary columns

## If You Still See Green Emails
- Clear your browser cache
- Check that you're using the new deployment URL
- Make sure all files are saved and deployed

The emails should now look professional and match your brand! 🎉 
# Firestore Setup Guide

Follow these steps exactly to fix "Missing or insufficient permissions" and feed loading issues.

## 1. Enable Cloud Firestore Database
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Firestore Database** in the left sidebar.
3. Click **Create database** if you haven't already.
4. Choose a location and select **Start in test mode** OR **Start in locked mode** (either is fine, as we will override the rules next).

## 2. Apply Security Rules (CRITICAL)
This fixes the `Missing or insufficient permissions` error during signup and video loading.

1. In the Firestore Database section, click the **Rules** tab.
2. Replace everything in the editor with the content from [firestore.rules](file:///c:/Users/Shubham/OneDrive/Desktop/Learntok/learntok-web/firestore.rules).
3. Click **Publish**.

## 3. Enable Authentication Providers
1. Go to **Authentication** in the Firebase Console.
2. Click the **Sign-in method** tab.
3. Enable **Email/Password** (and **Google** if you want to use it).

## 4. Required Index (For Home Feed)
Without this, the feed will crash with an "index required" error.

Without custom composite indexes, the Home page will show a "FirebaseError: The query requires an index."

| Collection | Fields to Index | Query Scope |
|------------|-----------------|-------------|
| `videos`   | `status` (Ascending), `createdAt` (Descending) | Collection |

### How to Create the Index

1. **Option A: Click the URL in Console**
   Open the browser console (F12) while the application is running. You will see an error message from Firebase with a direct link. Clicking this link will pre-fill the index creation form in the Firebase Console.

2. **Option B: Manual Creation**
   - In the Firestore Database section, navigate to the **Indexes** tab.
   - Click **Add Index**.
   - Set Collection ID to `videos`.
   - Add Field: `status` (Ascending).
   - Add Field: `createdAt` (Descending).
   - Click **Create Index**.

> [!NOTE]
> It usually takes a few minutes for the index to be building. Once the status changes to "Enabled", the home feed will start working immediately.

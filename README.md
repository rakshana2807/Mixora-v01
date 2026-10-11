# MIXORA V3 — Administration & Setup Guide

Welcome to the MIXORA V3 Shop Owner Administration System. This guide explains how to configure and secure your admin credentials when connecting this Vanilla JS frontend to a production backend (like Supabase).

## 1. Authentication Configuration

In the current demonstration mode, the application uses local validation. For production, you **must** configure a secure backend authentication provider.

### Supabase Setup (Recommended)
1. Go to your Supabase Project Dashboard.
2. Navigate to **Authentication > Users**.
3. Invite your admin user (e.g., `owner@mixora.example`).
4. Replace the mock authentication logic in `js/admin-login.js` with the official Supabase Client:
   ```javascript
   const { data, error } = await supabase.auth.signInWithPassword({
       email: email,
       password: secret
   });
   if (error) throw error;
   ```

## 2. Administrator Authorization (Role-Based Access Control)

Simply being able to log in should **not** grant administrator privileges. You must enforce authorization using backend roles.

### Setting up the "Owner" Role
1. Create a `user_roles` table in your database containing `user_id` and `role`.
2. Insert a record for your admin user: `role = 'owner'`.
3. In `js/admin-login.js`, after a successful login, fetch the user's role:
   ```javascript
   const { data: roleData } = await supabase
       .from('user_roles')
       .select('role')
       .eq('user_id', data.user.id)
       .single();
       
   if (roleData.role !== 'owner') {
       throw new Error('Unauthorized Access. You do not have owner privileges.');
   }
   ```
4. **CRITICAL:** Use Row Level Security (RLS) policies on your Supabase tables to ensure that only users with the `owner` role can read ALL orders, modify menu items, and access customer records. 

## 3. Security Rules & Best Practices

To keep the application secure in production:
* **Never** hardcode the actual admin email and secret code in `js/admin-login.js`. The current hardcoded values (`owner@mixora.example` / `mixora2026`) are strictly for local demonstration purposes.
* **Never** store the secret code (password) in `LocalStorage`. Rely on the secure JWT token provided by your authentication provider.
* **Protect Database Queries:** Do not rely solely on the frontend router to protect data. If a regular customer navigates to `/admin.html` without the owner role, the backend RLS must block them from fetching the `orders` table.
* **Customer Registration:** Do not allow public registration to automatically grant the `owner` role. New owners should be provisioned manually by a database administrator.

## 4. Launching Live Mode

Once the backend is integrated:
1. Remove all references to `window.Storage.get` and `window.Storage.set` inside `js/admin.js` and `js/profile.js`.
2. Map these calls to your backend API or Supabase Realtime subscriptions.
3. The dashboard is already structured to ingest real data exactly as it reads the demo `LocalStorage` schema!

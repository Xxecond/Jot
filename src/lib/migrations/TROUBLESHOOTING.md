# Authentication Troubleshooting Guide

## Issue: 404 "User not found" after token is verified

### Root Cause
The user record doesn't exist in MongoDB, even though the JWT token is valid and decoded successfully.

### Common Causes

1. **Missing magicToken Fields** (Most Common)
   - User model was missing `magicToken` and `magicTokenExpiry` fields
   - Existing users created before the schema update don't have these fields
   - **Solution**: Run the migration script (see below)

2. **Different Database**
   - App is connecting to a different MongoDB database than where users were created
   - **Solution**: Check `MONGO_URI` environment variable

3. **User Was Deleted**
   - The user record was manually deleted from the database
   - **Solution**: Delete the token from browser storage and sign up again

4. **Database Connection Issue**
   - MongoDB is down or unreachable
   - **Solution**: Test connection with `mongosh` or check MongoDB Atlas status

### Quick Debugging

#### 1. Check if a specific user exists:
```bash
# Visit in browser (development only):
http://localhost:3000/api/debug/auth-check?userId=6a20ddada63e37f84031bdd7
```

#### 2. Check by email:
```bash
http://localhost:3000/api/debug/auth-check?email=user@example.com
```

#### 3. See database stats:
```bash
http://localhost:3000/api/debug/auth-check
```

### Fix: Run Migration Script

If existing users are missing magicToken fields:

```bash
# Option 1: Using Node directly (if using ES modules)
node --experimental-modules src/lib/migrations/addMagicTokenFields.js

# Option 2: If your project uses CommonJS
node src/lib/migrations/addMagicTokenFields.js

# Option 3: Using npm script (add to package.json if needed)
npm run migrate:add-magic-token
````

### Verify the Fix

1. **Check logs**: Look for migration completion message
2. **Test login**: Try the magic link flow again
3. **Verify endpoint**: Check `/api/debug/auth-check` to confirm users exist

### Browser Console Errors

```
❌ Failed to get user: Request failed with status code 404
```

**Next steps:**
1. Open `/api/debug/auth-check?userId=YOUR_USER_ID` in browser
2. Check if user is found or missing
3. Run migration if users are missing fields
4. Clear cookies: `localStorage.removeItem('token')`
5. Try login again

### Environment Variables to Check

```
# Make sure MONGO_URI is correct
MONGO_URI=mongodb://...

# JWT_SECRET should be set
JWT_SECRET=your-secret-key

# NEXT_PUBLIC_BASE_URL for magic links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Production Considerations

- Don't expose `/api/debug/auth-check` in production (it's guarded but should be removed)
- Always backup database before migrations
- Run migrations during low-traffic periods
- Monitor logs for authentication issues

### Still Having Issues?

1. Check MongoDB logs
2. Verify database credentials
3. Test with `mongosh` directly to query users
4. Check if cookies are being set (DevTools → Application → Cookies)
5. Verify JWT_SECRET is the same across all deploys

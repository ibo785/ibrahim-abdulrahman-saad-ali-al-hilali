# Security Specification for Echo Share

## 1. Data Invariants
- An Item must have a valid ownerId matching the authenticated User.
- A Transaction must involve a provider and a receiver, both of whom must be valid users.
- A Message must have a senderId matching the authenticated User.
- Points cannot be modified by the user directly (only via server-side logic, or strict rules if client-side logic is used with points_log verification).
- Admins have read/write access to reports.
- Users can only read their own private PII (email, phone, etc.) if isolated, or we use rules to restrict access.

## 2. The "Dirty Dozen" Payloads (Denial Tests)

1. **Identity Spoofing**: Create an item with someone else's `ownerId`.
2. **Resource Poisoning**: Use a 1MB string as a document ID for an item.
3. **State Shortcutting**: Update a transaction status directly from `pending` to `completed` without provider acceptance.
4. **Unauthorized Deletion**: User A trying to delete User B's item.
5. **PII Leak**: Authenticated user trying to list all users to see private emails.
6. **Point Injection**: User trying to increment their own `points` field.
7. **Negative Points**: Transaction that results in negative points (if applicable).
8. **Shadow Field Injection**: Adding `isVerified: true` to a user profile during registration.
9. **Infinite Message Loop**: Sending a message to self or spamming.
10. **Admin Escalation**: Attempting to set `role: 'admin'` on own user doc.
11. **Expired Item Update**: Updating an item that is already marked as `exchanged`.
12. **Malformed ID**: Creating a wishlist with a document ID containing special characters that could exploit path parsing.

## 3. Test Runner Concept
The tests will ensure `PERMISSION_DENIED` for the above payloads.

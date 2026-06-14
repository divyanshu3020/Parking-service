# Database Package - Commands Reference

## Current Commands

### Setup & Installation
```bash
bun install
```
Installs all dependencies including Prisma and PostgreSQL client

### Database Migrations
```bash
bun run generate
```
Generates Prisma client based on current schema.prisma. Run after schema changes.

```bash
bun run push
```
Pushes schema changes to PostgreSQL database and creates/updates tables. **Use in development only.**

## Future Commands (To Be Added)

### Data Management
```bash
# Seed database with initial data
bun run seed
```
Will populate database with default/test data. Create `prisma/seed.ts` for this.

```bash
# Open Prisma Studio (GUI for database)
bunx prisma studio
```
Opens browser UI to view/edit database records directly.

### Migrations (Production)
```bash
bunx prisma migrate deploy
```
Applies pending migrations in production. Use after `prisma migrate dev` in dev environment.

```bash
bunx prisma migrate reset
```
⚠️ **DEV ONLY** - Drops database and reruns migrations. Clears all data.

```bash
bunx prisma migrate status
```
Shows which migrations have been applied to the database.

## Environment Variables

Create `.env` file:
```
DATABASE_URL=postgresql://user:password@host:5432/parking_db
```

## Useful Tips

- After schema changes → run `bun run generate` → run `bun run push`
- Prisma Client is auto-generated in `node_modules/.prisma/client`
- Schema file: `prisma/schema.prisma`
- Migrations stored in: `prisma/migrations/`

## Database Models

**User**
- id (unique identifier)
- email (unique)
- phoneNumber
- createdAt, updatedAt
- Relation: otpSessions (one-to-many)

**OTPSession**
- id (unique identifier)
- workflowId (unique - workflow tracking)
- otp (6-digit code)
- email
- phoneNumber (optional)
- attempts (verification attempts)
- expiresAt (expiration timestamp)
- userId (links to User)
- createdAt, updatedAt

-- Fix: remove foreign key constraint from refresh_tokens.user_id
-- Staff and delivery agents are in per-tenant tables, not public.users

ALTER TABLE "refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_user_id_users_id_fk";

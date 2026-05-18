CREATE TABLE IF NOT EXISTS "user_restaurants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"role" "user_role" NOT NULL,
	"permissions" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "restaurant_users";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_restaurant_id_restaurants_id_fk";
--> statement-breakpoint
ALTER TABLE "delivery_agents" DROP CONSTRAINT "delivery_agents_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "staff" DROP CONSTRAINT "staff_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "restaurant_id";--> statement-breakpoint
ALTER TABLE "delivery_agents" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "staff" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_restaurants" ADD CONSTRAINT "user_restaurants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_restaurants" ADD CONSTRAINT "user_restaurants_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_unique" UNIQUE("phone");
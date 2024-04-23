CREATE TABLE IF NOT EXISTS "assets" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"reg_nr" varchar(256),
	"model" varchar(256),
	"make" varchar(256),
	"year" varchar(256),
	"active" boolean,
	"avg_fuel_consumption" real,
	"distance_travelled" integer,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"hashed_password" text NOT NULL,
	"name" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "drivers" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"surname" varchar(256),
	"id_number" varchar(256),
	"date_of_birth" date,
	"mobile_nr" varchar(256),
	"physical_address" text,
	"postal_address" text,
	"email" varchar(256),
	"license_type" varchar(256),
	"last_renewed_date" date,
	"license_expiry" date,
	"vehicle_restriction" integer,
	"driver_restriction" integer,
	"image" varchar(256),
	"hand_prints" varchar(256),
	"comments" text,
	"active" boolean,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracking_types" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(256)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

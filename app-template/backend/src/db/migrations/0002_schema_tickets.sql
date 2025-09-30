CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject" varchar(500) NOT NULL,
	"status" varchar(50) NOT NULL,
	"priority" varchar(50) NOT NULL,
	"requester_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tickets_status_idx" ON "tickets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tickets_priority_idx" ON "tickets" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "tickets_requester_id_idx" ON "tickets" USING btree ("requester_id");--> statement-breakpoint
CREATE INDEX "tickets_created_at_idx" ON "tickets" USING btree ("created_at");
-- Base schema generated from blueprint.models

-- Authentication and session management tables

-- Migrations tracking table
CREATE TABLE IF NOT EXISTS "migrations" (
  "id" SERIAL PRIMARY KEY,
  "filename" VARCHAR(255) UNIQUE NOT NULL,
  "executed_at" TIMESTAMP DEFAULT NOW()
);

-- Users table (required for authentication)
CREATE TABLE IF NOT EXISTS "users" (
  "userid" UUID PRIMARY KEY,
  "oauthid" TEXT NOT NULL UNIQUE,
  "source" TEXT NOT NULL CHECK("source" IN ('google', 'facebook', 'apple', 'github', 'userpass')),
  "username" TEXT NOT NULL,
  "email" TEXT,
  "avatarurl" TEXT,
  "userlevel" INTEGER NOT NULL DEFAULT 1 CHECK("userlevel" IN (0, 1, 2)),
  "usertier" INTEGER NOT NULL DEFAULT 0,
  "lastlogindate" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createddate" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isactive" INTEGER NOT NULL DEFAULT 1
);

-- Indexes for Users table
CREATE INDEX IF NOT EXISTS idx_users_oauthid ON "users"("oauthid");
CREATE INDEX IF NOT EXISTS idx_users_email ON "users"("email");
CREATE INDEX IF NOT EXISTS idx_users_usertier ON "users"("usertier");

-- UserSession table
CREATE TABLE IF NOT EXISTS "usersession" (
  "id" UUID PRIMARY KEY,
  "sessiontoken" TEXT NOT NULL UNIQUE,
  "userid" UUID NOT NULL,
  "expirationdate" TEXT NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE
);

-- Indexes for UserSession table
CREATE INDEX IF NOT EXISTS idx_session_token ON "usersession"("sessiontoken");
CREATE INDEX IF NOT EXISTS idx_session_user ON "usersession"("userid");
CREATE INDEX IF NOT EXISTS idx_session_expiry ON "usersession"("expirationdate");

-- OAuthTokens table
CREATE TABLE IF NOT EXISTS "oauthtokens" (
  "id" UUID PRIMARY KEY,
  "userid" UUID NOT NULL,
  "provider" TEXT NOT NULL CHECK("provider" IN ('google', 'facebook', 'apple', 'github', 'userpass')),
  "accesstoken" TEXT NOT NULL,
  "refreshtoken" TEXT,
  "expiresat" TEXT,
  "createdat" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedat" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE
);

-- Indexes for OAuthTokens table
CREATE INDEX IF NOT EXISTS idx_oauth_user ON "oauthtokens"("userid");
CREATE INDEX IF NOT EXISTS idx_oauth_provider ON "oauthtokens"("userid", "provider");

-- Model: customers
CREATE TABLE IF NOT EXISTS "customers" (
  "id" UUID NOT NULL PRIMARY KEY,
  "userid" UUID NOT NULL,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "date_of_birth" DATE,
  "gender" VARCHAR(20),
  "company_name" VARCHAR(255),
  "vat_number" VARCHAR(50),
  "customer_type" VARCHAR(50),
  "status" VARCHAR(50),
  "loyalty_points" INTEGER,
  "loyalty_tier" VARCHAR(50),
  "total_spent" DECIMAL,
  "total_orders" INTEGER,
  "preferred_language" VARCHAR(10),
  "preferred_currency" VARCHAR(10),
  "marketing_consent" BOOLEAN,
  "newsletter_subscribed" BOOLEAN,
  "notes" TEXT,
  "tags" JSONB,
  "metadata" JSONB,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "last_login_at" TIMESTAMP,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: subscription_tiers
CREATE TABLE IF NOT EXISTS "subscription_tiers" (
  "id" UUID NOT NULL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "slug" VARCHAR(50) NOT NULL,
  "description" TEXT,
  "price" DECIMAL NOT NULL,
  "billing_period" VARCHAR(20),
  "stripe_price_id" VARCHAR(255),
  "features" JSONB,
  "limits" JSONB,
  "display_order" INTEGER,
  "enabled" BOOLEAN,
  "is_featured" BOOLEAN,
  "trial_days" INTEGER,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP
);

-- Model: subscriptions
CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" UUID NOT NULL PRIMARY KEY,
  "customersid" UUID NOT NULL,
  "tiersid" UUID,
  "stripe_subscription_id" VARCHAR(255),
  "stripe_customer_id" VARCHAR(255),
  "status" VARCHAR(50) NOT NULL,
  "user_tier" VARCHAR(50) NOT NULL,
  "price_id" VARCHAR(255),
  "current_period_start" TIMESTAMP,
  "current_period_end" TIMESTAMP,
  "cancel_at_period_end" BOOLEAN,
  "canceled_at" TIMESTAMP,
  "trial_start" TIMESTAMP,
  "trial_end" TIMESTAMP,
  "metadata" JSONB,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: saas_orders
CREATE TABLE IF NOT EXISTS "saas_orders" (
  "id" UUID NOT NULL PRIMARY KEY,
  "customersid" UUID NOT NULL,
  "subscriptionsid" UUID,
  "order_number" VARCHAR(50) NOT NULL,
  "stripe_invoice_id" VARCHAR(255),
  "stripe_payment_intent_id" VARCHAR(255),
  "stripe_charge_id" VARCHAR(255),
  "amount" DECIMAL NOT NULL,
  "currency" VARCHAR(10),
  "status" VARCHAR(50),
  "payment_status" VARCHAR(50),
  "description" TEXT,
  "billing_reason" VARCHAR(100),
  "invoice_url" TEXT,
  "invoice_pdf" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: employees
CREATE TABLE IF NOT EXISTS "employees" (
  "id" UUID NOT NULL PRIMARY KEY,
  "employee_number" VARCHAR(50),
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "avatar_url" TEXT,
  "job_title" VARCHAR(150),
  "department" VARCHAR(100),
  "manager_id" UUID,
  "hire_date" DATE,
  "employment_type" VARCHAR(50),
  "status" VARCHAR(50),
  "location" VARCHAR(255),
  "timezone" VARCHAR(50),
  "hourly_rate" DECIMAL,
  "skills" JSONB,
  "bio" TEXT,
  "social_links" JSONB,
  "settings" JSONB,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: projects
CREATE TABLE IF NOT EXISTS "projects" (
  "id" UUID NOT NULL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "owner_id" UUID NOT NULL,
  "status" VARCHAR(50),
  "priority" VARCHAR(20),
  "visibility" VARCHAR(20),
  "color" VARCHAR(20),
  "icon" VARCHAR(50),
  "start_date" DATE,
  "due_date" DATE,
  "completed_at" TIMESTAMP,
  "budget" DECIMAL,
  "budget_spent" DECIMAL,
  "progress" INTEGER,
  "task_count" INTEGER,
  "completed_task_count" INTEGER,
  "settings" JSONB,
  "metadata" JSONB,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: tasks
CREATE TABLE IF NOT EXISTS "tasks" (
  "id" UUID NOT NULL PRIMARY KEY,
  "project_id" UUID NOT NULL,
  "parent_task_id" UUID,
  "title" VARCHAR(500) NOT NULL,
  "description" TEXT,
  "status" VARCHAR(50),
  "priority" VARCHAR(20),
  "assignee_id" UUID,
  "reporter_id" UUID,
  "due_date" DATE,
  "start_date" DATE,
  "completed_at" TIMESTAMP,
  "estimated_hours" DECIMAL,
  "actual_hours" DECIMAL,
  "position" INTEGER,
  "labels" JSONB,
  "attachments" JSONB,
  "checklist" JSONB,
  "comment_count" INTEGER,
  "metadata" JSONB,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: task_comments
CREATE TABLE IF NOT EXISTS "task_comments" (
  "id" UUID NOT NULL PRIMARY KEY,
  "task_id" UUID NOT NULL,
  "author_id" UUID NOT NULL,
  "content" TEXT NOT NULL,
  "parent_comment_id" UUID,
  "attachments" JSONB,
  "mentions" JSONB,
  "edited_at" TIMESTAMP,
  "created_at" TIMESTAMP
);

-- Model: project_members
CREATE TABLE IF NOT EXISTS "project_members" (
  "id" UUID NOT NULL PRIMARY KEY,
  "project_id" UUID NOT NULL,
  "employee_id" UUID NOT NULL,
  "role" VARCHAR(50),
  "joined_at" TIMESTAMP,
  "invited_by" VARCHAR(36),
  "notifications_enabled" BOOLEAN,
  "settings" JSONB
);

-- Model: time_entries
CREATE TABLE IF NOT EXISTS "time_entries" (
  "id" UUID NOT NULL PRIMARY KEY,
  "project_id" UUID,
  "task_id" UUID,
  "description" TEXT,
  "start_time" TIMESTAMP NOT NULL,
  "end_time" TIMESTAMP,
  "duration_minutes" INTEGER,
  "is_running" BOOLEAN,
  "is_billable" BOOLEAN,
  "hourly_rate" DECIMAL,
  "tags" JSONB,
  "metadata" JSONB,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "employeeid" UUID,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: invoices
CREATE TABLE IF NOT EXISTS "invoices" (
  "id" UUID NOT NULL PRIMARY KEY,
  "customer_id" UUID NOT NULL,
  "invoice_number" VARCHAR(50) NOT NULL,
  "status" VARCHAR(20),
  "issue_date" DATE NOT NULL,
  "due_date" DATE NOT NULL,
  "client_name" VARCHAR(255) NOT NULL,
  "client_email" VARCHAR(255),
  "client_address" TEXT,
  "line_items" JSONB,
  "subtotal" DECIMAL,
  "tax_rate" DECIMAL,
  "tax_amount" DECIMAL,
  "discount_amount" DECIMAL,
  "total" DECIMAL,
  "amount_paid" DECIMAL,
  "currency" VARCHAR(10),
  "notes" TEXT,
  "payment_terms" VARCHAR(100),
  "project_id" UUID,
  "time_entry_ids" JSONB,
  "paid_at" TIMESTAMP,
  "sent_at" TIMESTAMP,
  "metadata" JSONB,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "employeeid" UUID,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- PasswordAuth table for username/password authentication
CREATE TABLE IF NOT EXISTS "passwordauth" (
  "id" UUID PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "passwordhash" TEXT NOT NULL,
  "salt" TEXT NOT NULL,
  "verificationtoken" TEXT,
  "verificationtokenexpires" TIMESTAMP,
  "emailverified" BOOLEAN DEFAULT FALSE,
  "resettoken" TEXT,
  "resettokenexpires" TIMESTAMP,
  "createdat" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedat" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for PasswordAuth
CREATE INDEX IF NOT EXISTS idx_passwordauth_email ON "passwordauth"("email");
CREATE INDEX IF NOT EXISTS idx_passwordauth_verification_token ON "passwordauth"("verificationtoken");
CREATE INDEX IF NOT EXISTS idx_passwordauth_reset_token ON "passwordauth"("resettoken");
CREATE INDEX IF NOT EXISTS idx_passwordauth_email_verified ON "passwordauth"("emailverified");

-- FormSubmissions table for storing form data
CREATE TABLE IF NOT EXISTS "form_submissions" (
  "id" SERIAL PRIMARY KEY,
  "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "form_name" VARCHAR(255) NOT NULL,
  "form_data" JSONB NOT NULL
);

-- Indexes for FormSubmissions
CREATE INDEX IF NOT EXISTS idx_form_submissions_name ON "form_submissions"("form_name");
CREATE INDEX IF NOT EXISTS idx_form_submissions_timestamp ON "form_submissions"("timestamp");

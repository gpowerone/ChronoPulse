# Architecture Documentation

This document provides an overview of the application architecture, including database schema, API endpoints, and view components.

Generated on: 2025-12-04T05:20:53.742Z

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Views and Components](#views-and-components)
4. [Data Flow](#data-flow)

## Database Schema

### Tables

#### Customers

- **ID**: customers
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| userid | UUID | - | true | foreign | false | - |
| first_name | VARCHAR | 255 | true | - | false | - |
| last_name | VARCHAR | 255 | true | - | false | - |
| email | VARCHAR | 255 | true | - | false | - |
| phone | VARCHAR | 50 | false | - | false | - |
| date_of_birth | DATE | - | false | - | false | - |
| gender | VARCHAR | 20 | false | - | false | - |
| company_name | VARCHAR | 255 | false | - | false | - |
| vat_number | VARCHAR | 50 | false | - | false | - |
| customer_type | VARCHAR | 50 | false | - | false | - |
| status | VARCHAR | 50 | false | - | false | - |
| loyalty_points | INTEGER | - | false | - | false | - |
| loyalty_tier | VARCHAR | 50 | false | - | false | - |
| total_spent | DECIMAL | 10,2 | false | - | false | - |
| total_orders | INTEGER | - | false | - | false | - |
| preferred_language | VARCHAR | 10 | false | - | false | - |
| preferred_currency | VARCHAR | 10 | false | - | false | - |
| marketing_consent | BOOLEAN | - | false | - | false | - |
| newsletter_subscribed | BOOLEAN | - | false | - | false | - |
| notes | TEXT | - | false | - | false | - |
| tags | JSONB | - | false | - | false | - |
| metadata | JSONB | - | false | - | false | - |
| created_at | TIMESTAMP | - | false | - | false | - |
| updated_at | TIMESTAMP | - | false | - | false | - |
| last_login_at | TIMESTAMP | - | false | - | false | - |

**Authentication Requirements:**
- Add: true
- Get: true
- Update: true
- Delete: true

#### Subscription Tiers

- **ID**: tiers
- **User-specific data**: false
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| name | VARCHAR | 100 | true | - | false | - |
| slug | VARCHAR | 50 | true | - | false | - |
| description | TEXT | - | false | - | false | - |
| price | DECIMAL | 10,2 | true | - | false | - |
| billing_period | VARCHAR | 20 | false | - | false | - |
| stripe_price_id | VARCHAR | 255 | false | foreign | false | - |
| features | JSONB | - | false | - | false | - |
| limits | JSONB | - | false | - | false | - |
| display_order | INTEGER | - | false | - | false | - |
| enabled | BOOLEAN | - | false | - | false | - |
| is_featured | BOOLEAN | - | false | - | false | - |
| trial_days | INTEGER | - | false | - | false | - |
| created_at | TIMESTAMP | - | false | - | false | - |
| updated_at | TIMESTAMP | - | false | - | false | - |

**Authentication Requirements:**
- Add: true
- Get: false
- Update: true
- Delete: true

#### Subscriptions

- **ID**: subscriptions
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| customersid | UUID | - | true | foreign | false | - |
| tiersid | UUID | - | false | foreign | false | - |
| stripe_subscription_id | VARCHAR | 255 | false | foreign | false | - |
| stripe_customer_id | VARCHAR | 255 | false | foreign | false | - |
| status | VARCHAR | 50 | true | - | false | - |
| user_tier | VARCHAR | 50 | true | - | false | - |
| price_id | VARCHAR | 255 | false | foreign | false | - |
| current_period_start | TIMESTAMP | - | false | - | false | - |
| current_period_end | TIMESTAMP | - | false | - | false | - |
| cancel_at_period_end | BOOLEAN | - | false | - | false | - |
| canceled_at | TIMESTAMP | - | false | - | false | - |
| trial_start | TIMESTAMP | - | false | - | false | - |
| trial_end | TIMESTAMP | - | false | - | false | - |
| metadata | JSONB | - | false | - | false | - |
| created_at | TIMESTAMP | - | false | - | false | - |
| updated_at | TIMESTAMP | - | false | - | false | - |

**Authentication Requirements:**
- Add: true
- Get: true
- Update: true
- Delete: true

#### SaaS Orders

- **ID**: saas_orders
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| customersid | UUID | - | true | foreign | false | - |
| subscriptionsid | UUID | - | false | foreign | false | - |
| order_number | VARCHAR | 50 | true | - | false | - |
| stripe_invoice_id | VARCHAR | 255 | false | foreign | false | - |
| stripe_payment_intent_id | VARCHAR | 255 | false | foreign | false | - |
| stripe_charge_id | VARCHAR | 255 | false | foreign | false | - |
| amount | DECIMAL | 10,2 | true | - | false | - |
| currency | VARCHAR | 10 | false | - | false | - |
| status | VARCHAR | 50 | false | - | false | - |
| payment_status | VARCHAR | 50 | false | - | false | - |
| description | TEXT | - | false | - | false | - |
| billing_reason | VARCHAR | 100 | false | - | false | - |
| invoice_url | TEXT | - | false | - | false | - |
| invoice_pdf | TEXT | - | false | - | false | - |
| metadata | JSONB | - | false | - | false | - |
| created_at | TIMESTAMP | - | false | - | false | - |
| updated_at | TIMESTAMP | - | false | - | false | - |

**Authentication Requirements:**
- Add: true
- Get: true
- Update: true
- Delete: true

#### Employees

- **ID**: employees
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| employee_number | VARCHAR | 50 | false | - | false | - |
| first_name | VARCHAR | 100 | true | - | false | - |
| last_name | VARCHAR | 100 | true | - | false | - |
| email | VARCHAR | 255 | true | - | false | - |
| phone | VARCHAR | 50 | false | - | false | - |
| avatar_url | TEXT | - | false | - | false | - |
| job_title | VARCHAR | 150 | false | - | false | - |
| department | VARCHAR | 100 | false | - | false | - |
| manager_id | UUID | - | false | foreign | false | - |
| hire_date | DATE | - | false | - | false | - |
| employment_type | VARCHAR | 50 | false | - | false | - |
| status | VARCHAR | 50 | false | - | false | - |
| location | VARCHAR | 255 | false | - | false | - |
| timezone | VARCHAR | 50 | false | - | false | - |
| hourly_rate | DECIMAL | 10,2 | false | - | false | - |
| skills | JSONB | - | false | - | false | - |
| bio | TEXT | - | false | - | false | - |
| social_links | JSONB | - | false | - | false | - |
| settings | JSONB | - | false | - | false | - |
| created_at | TIMESTAMP | - | false | - | false | - |
| updated_at | TIMESTAMP | - | false | - | false | - |

**Authentication Requirements:**
- Add: true
- Get: true
- Update: true
- Delete: true

#### Projects

- **ID**: projects
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| name | VARCHAR | 255 | true | - | false | - |
| slug | VARCHAR | 100 | true | - | false | - |
| description | TEXT | - | false | - | false | - |
| owner_id | UUID | - | true | foreign | false | - |
| status | VARCHAR | 50 | false | - | false | - |
| priority | VARCHAR | 20 | false | - | false | - |
| visibility | VARCHAR | 20 | false | - | false | - |
| color | VARCHAR | 20 | false | - | false | - |
| icon | VARCHAR | 50 | false | - | false | - |
| start_date | DATE | - | false | - | false | - |
| due_date | DATE | - | false | - | false | - |
| completed_at | TIMESTAMP | - | false | - | false | - |
| budget | DECIMAL | 12,2 | false | - | false | - |
| budget_spent | DECIMAL | 12,2 | false | - | false | - |
| progress | INTEGER | - | false | - | false | - |
| task_count | INTEGER | - | false | - | false | - |
| completed_task_count | INTEGER | - | false | - | false | - |
| settings | JSONB | - | false | - | false | - |
| metadata | JSONB | - | false | - | false | - |
| created_at | TIMESTAMP | - | false | - | false | - |
| updated_at | TIMESTAMP | - | false | - | false | - |

**Authentication Requirements:**
- Add: true
- Get: true
- Update: true
- Delete: true

#### Tasks

- **ID**: tasks
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| project_id | UUID | - | true | foreign | false | - |
| parent_task_id | UUID | - | false | foreign | false | - |
| title | VARCHAR | 500 | true | - | false | - |
| description | TEXT | - | false | - | false | - |
| status | VARCHAR | 50 | false | - | false | - |
| priority | VARCHAR | 20 | false | - | false | - |
| assignee_id | UUID | - | false | foreign | false | - |
| reporter_id | UUID | - | false | foreign | false | - |
| due_date | DATE | - | false | - | false | - |
| start_date | DATE | - | false | - | false | - |
| completed_at | TIMESTAMP | - | false | - | false | - |
| estimated_hours | DECIMAL | 8,2 | false | - | false | - |
| actual_hours | DECIMAL | 8,2 | false | - | false | - |
| position | INTEGER | - | false | - | false | - |
| labels | JSONB | - | false | - | false | - |
| attachments | JSONB | - | false | - | false | - |
| checklist | JSONB | - | false | - | false | - |
| comment_count | INTEGER | - | false | - | false | - |
| metadata | JSONB | - | false | - | false | - |
| created_at | TIMESTAMP | - | false | - | false | - |
| updated_at | TIMESTAMP | - | false | - | false | - |

**Authentication Requirements:**
- Add: true
- Get: true
- Update: true
- Delete: true

#### Task Comments

- **ID**: task_comments
- **User-specific data**: false
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| task_id | UUID | - | true | foreign | false | - |
| author_id | UUID | - | true | foreign | false | - |
| content | TEXT | - | true | - | false | - |
| parent_comment_id | UUID | - | false | foreign | false | - |
| attachments | JSONB | - | false | - | false | - |
| mentions | JSONB | - | false | - | false | - |
| edited_at | TIMESTAMP | - | false | - | false | - |
| created_at | TIMESTAMP | - | false | - | false | - |

**Authentication Requirements:**
- Add: true
- Get: true
- Update: true
- Delete: true

#### Project Members

- **ID**: project_members
- **User-specific data**: false
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| project_id | UUID | - | true | foreign | false | - |
| employee_id | UUID | - | true | foreign | false | - |
| role | VARCHAR | 50 | false | - | false | - |
| joined_at | TIMESTAMP | - | false | - | false | - |
| invited_by | VARCHAR | 36 | false | - | false | - |
| notifications_enabled | BOOLEAN | - | false | - | false | - |
| settings | JSONB | - | false | - | false | - |

**Authentication Requirements:**
- Add: true
- Get: true
- Update: true
- Delete: true

#### Time Entries

- **ID**: time_entries
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| project_id | UUID | - | false | foreign | false | - |
| task_id | UUID | - | false | foreign | false | - |
| description | TEXT | - | false | - | false | - |
| start_time | TIMESTAMP | - | true | - | false | - |
| end_time | TIMESTAMP | - | false | - | false | - |
| duration_minutes | INTEGER | - | false | - | false | - |
| is_running | BOOLEAN | - | false | - | false | - |
| is_billable | BOOLEAN | - | false | - | false | - |
| hourly_rate | DECIMAL | 10,2 | false | - | false | - |
| tags | JSONB | - | false | - | false | - |
| metadata | JSONB | - | false | - | false | - |
| created_at | TIMESTAMP | - | false | - | false | - |
| updated_at | TIMESTAMP | - | false | - | false | - |
| employeeid | UUID | - | false | foreign | false | - |

**Authentication Requirements:**
- Add: true
- Get: true
- Update: true
- Delete: true

#### Invoices

- **ID**: invoices
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| customer_id | UUID | - | true | foreign | false | - |
| invoice_number | VARCHAR | 50 | true | - | false | - |
| status | VARCHAR | 20 | false | - | false | - |
| issue_date | DATE | - | true | - | false | - |
| due_date | DATE | - | true | - | false | - |
| client_name | VARCHAR | 255 | true | - | false | - |
| client_email | VARCHAR | 255 | false | - | false | - |
| client_address | TEXT | - | false | - | false | - |
| line_items | JSONB | - | false | - | false | - |
| subtotal | DECIMAL | 10,2 | false | - | false | - |
| tax_rate | DECIMAL | 5,2 | false | - | false | - |
| tax_amount | DECIMAL | 10,2 | false | - | false | - |
| discount_amount | DECIMAL | 10,2 | false | - | false | - |
| total | DECIMAL | 10,2 | false | - | false | - |
| amount_paid | DECIMAL | 10,2 | false | foreign | false | - |
| currency | VARCHAR | 10 | false | - | false | - |
| notes | TEXT | - | false | - | false | - |
| payment_terms | VARCHAR | 100 | false | - | false | - |
| project_id | UUID | - | false | foreign | false | - |
| time_entry_ids | JSONB | - | false | - | false | - |
| paid_at | TIMESTAMP | - | false | - | false | - |
| sent_at | TIMESTAMP | - | false | - | false | - |
| metadata | JSONB | - | false | - | false | - |
| created_at | TIMESTAMP | - | false | - | false | - |
| updated_at | TIMESTAMP | - | false | - | false | - |
| employeeid | UUID | - | false | foreign | false | - |

**Authentication Requirements:**
- Add: true
- Get: true
- Update: true
- Delete: true

### Relationships

#### Subscriptions Relationships

- **Subscriptions.customersid** → **Customers.id** (many-to-one)
- **Subscriptions.tiersid** → **Subscription Tiers.id** (many-to-one)

#### SaaS Orders Relationships

- **SaaS Orders.customersid** → **Customers.id** (many-to-one)
- **SaaS Orders.subscriptionsid** → **Subscriptions.id** (many-to-one)

#### Tasks Relationships

- **Tasks.project_id** → **Projects.id** (many-to-one)

#### Task Comments Relationships

- **Task Comments.task_id** → **Tasks.id** (many-to-one)

#### Project Members Relationships

- **Project Members.project_id** → **Projects.id** (many-to-one)
- **Project Members.employee_id** → **Employees.id** (many-to-one)

#### Time Entries Relationships

- **Time Entries.customer_id** → **Customers.id** (many-to-one)
- **Time Entries.project_id** → **Projects.id** (many-to-one)
- **Time Entries.task_id** → **Tasks.id** (many-to-one)

#### Invoices Relationships

- **Invoices.customer_id** → **Customers.id** (many-to-one)
- **Invoices.project_id** → **Projects.id** (many-to-one)

## API Endpoints

### GET /api/CustomersList

- **ID**: customerslist
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (customerslist_input):**
*Input object for CustomersList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| page | number | No | - | - |
| limit | number | No | - | - |
| search | string | No | - | - |
| status | string | No | - | - |
| customer_type | string | No | - | - |
| loyalty_tier | string | No | - | - |
| newsletter_subscribed | boolean | No | - | - |
| sort_by | string | No | - | - |
| sort_order | string | No | - | - |

**Output Format (customerslist_output):**
*Output object for CustomersList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<any> | Yes | - | - |
| pagination | object | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that lists customers with pagination and filtering. Accept query parameters: page (default 1), limit (default 20), search (searches first_name, last_name, email, phone), status, customer_type, loyalty_tier, newsletter_subscribed (boolean), sort_by (default 'created_at'), sort_order (default 'DESC'). Return array of customers with pagination metadata including total, pages, current page, and limit. Only admins can list all customers.

### GET /api/CustomersGet

- **ID**: customersget
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (customersget_input):**
*Input object for CustomersGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (customersget_output):**
*Output object for CustomersGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| userid | string | Yes | - | - |
| first_name | string | Yes | - | - |
| last_name | string | Yes | - | - |
| email | string | Yes | - | - |
| phone | string | No | - | - |
| date_of_birth | string | No | - | - |
| gender | string | No | - | - |
| company_name | string | No | - | - |
| vat_number | string | No | - | - |
| customer_type | string | Yes | - | - |
| status | string | Yes | - | - |
| loyalty_points | number | Yes | - | - |
| loyalty_tier | string | Yes | - | - |
| total_spent | number | Yes | - | - |
| total_orders | number | Yes | - | - |
| preferred_language | string | Yes | - | - |
| preferred_currency | string | Yes | - | - |
| marketing_consent | boolean | Yes | - | - |
| newsletter_subscribed | boolean | Yes | - | - |
| notes | string | No | - | - |
| tags | array<any> | Yes | - | - |
| metadata | object | Yes | - | - |
| created_at | string | Yes | - | - |
| updated_at | string | Yes | - | - |
| last_login_at | string | No | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves a single customer by ID from the query parameter. This is an admin-only endpoint for customer management. Return the complete customer object including all fields. Return 404 error if customer not found. Include validation that the ID is a valid UUID format.

### POST /api/CustomersCreate

- **ID**: customerscreate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (customerscreate_input):**
*Input object for CustomersCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| userid | string | Yes | - | - |
| first_name | string | Yes | - | - |
| last_name | string | Yes | - | - |
| email | string | Yes | - | - |
| phone | string | No | - | - |
| date_of_birth | string | No | - | - |
| gender | string | No | - | - |
| company_name | string | No | - | - |
| vat_number | string | No | - | - |
| customer_type | string | No | - | - |
| preferred_language | string | No | - | - |
| preferred_currency | string | No | - | - |
| marketing_consent | boolean | No | - | - |
| newsletter_subscribed | boolean | No | - | - |
| notes | string | No | - | - |
| tags | array<any> | No | - | - |

**Output Format (customerscreate_output):**
*Output object for CustomersCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| userid | string | Yes | - | - |
| first_name | string | Yes | - | - |
| last_name | string | Yes | - | - |
| email | string | Yes | - | - |
| phone | string | No | - | - |
| date_of_birth | string | No | - | - |
| gender | string | No | - | - |
| company_name | string | No | - | - |
| vat_number | string | No | - | - |
| customer_type | string | Yes | - | - |
| status | string | Yes | - | - |
| loyalty_points | number | Yes | - | - |
| loyalty_tier | string | Yes | - | - |
| total_spent | number | Yes | - | - |
| total_orders | number | Yes | - | - |
| preferred_language | string | Yes | - | - |
| preferred_currency | string | Yes | - | - |
| marketing_consent | boolean | Yes | - | - |
| newsletter_subscribed | boolean | Yes | - | - |
| notes | string | No | - | - |
| tags | array<any> | Yes | - | - |
| metadata | object | Yes | - | - |
| created_at | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that creates a new customer profile. Accept JSON body with userid (required, must be valid user UUID), first_name (required), last_name (required), email (required, must be unique), phone (optional), date_of_birth (optional), gender (optional), company_name (optional), vat_number (optional), customer_type (optional, default 'individual'), preferred_language (optional, default 'en'), preferred_currency (optional, default 'USD'), marketing_consent (optional, default false), newsletter_subscribed (optional, default false), notes (optional), and tags (optional array). Generate new UUID for id. Validate userid exists in users table. Validate email is unique. Return complete created customer object.

### PUT /api/CustomersUpdate

- **ID**: customersupdate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (customersupdate_input):**
*Input object for CustomersUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| first_name | string | No | - | - |
| last_name | string | No | - | - |
| email | string | No | - | - |
| phone | string | No | - | - |
| date_of_birth | string | No | - | - |
| gender | string | No | - | - |
| company_name | string | No | - | - |
| vat_number | string | No | - | - |
| customer_type | string | No | - | - |
| status | string | No | - | - |
| preferred_language | string | No | - | - |
| preferred_currency | string | No | - | - |
| marketing_consent | boolean | No | - | - |
| newsletter_subscribed | boolean | No | - | - |
| notes | string | No | - | - |
| tags | array<any> | No | - | - |
| metadata | object | No | - | - |

**Output Format (customersupdate_output):**
*Output object for CustomersUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| userid | string | Yes | - | - |
| first_name | string | Yes | - | - |
| last_name | string | Yes | - | - |
| email | string | Yes | - | - |
| phone | string | No | - | - |
| date_of_birth | string | No | - | - |
| gender | string | No | - | - |
| company_name | string | No | - | - |
| vat_number | string | No | - | - |
| customer_type | string | Yes | - | - |
| status | string | Yes | - | - |
| loyalty_points | number | Yes | - | - |
| loyalty_tier | string | Yes | - | - |
| total_spent | number | Yes | - | - |
| total_orders | number | Yes | - | - |
| preferred_language | string | Yes | - | - |
| preferred_currency | string | Yes | - | - |
| marketing_consent | boolean | Yes | - | - |
| newsletter_subscribed | boolean | Yes | - | - |
| notes | string | No | - | - |
| tags | array<any> | Yes | - | - |
| metadata | object | Yes | - | - |
| created_at | string | Yes | - | - |
| updated_at | string | Yes | - | - |

**Implementation Notes:**
Create a PUT endpoint that updates an existing customer by ID from the query parameter. This is an admin-only endpoint for customer management. Accept JSON body with optional fields: first_name, last_name, email, phone, date_of_birth, gender, company_name, vat_number, customer_type, status, preferred_language, preferred_currency, marketing_consent, newsletter_subscribed, notes, tags, metadata. Validate ID exists. If email is being updated, ensure it's unique. Update the updated_at timestamp. Return the complete updated customer object.

### DELETE /api/CustomersDelete

- **ID**: customersdelete
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (customersdelete_input):**
*Input object for CustomersDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (customersdelete_output):**
*Output object for CustomersDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Create a DELETE endpoint that soft deletes a customer by ID from the query parameter. Instead of actually deleting the record, update the status to 'deleted' and set updated_at to current timestamp. Only admins can delete customers. Return success message.

### GET /api/CustomersByUser

- **ID**: customersbyuser
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (customersbyuser_input):**
*Input object for CustomersByUser API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|

**Output Format (customersbyuser_output):**
*Output object for CustomersByUser API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| userid | string | Yes | - | - |
| first_name | string | Yes | - | - |
| last_name | string | Yes | - | - |
| email | string | Yes | - | - |
| phone | string | No | - | - |
| date_of_birth | string | No | - | - |
| gender | string | No | - | - |
| company_name | string | No | - | - |
| vat_number | string | No | - | - |
| customer_type | string | Yes | - | - |
| status | string | Yes | - | - |
| loyalty_points | number | Yes | - | - |
| loyalty_tier | string | Yes | - | - |
| total_spent | number | Yes | - | - |
| total_orders | number | Yes | - | - |
| preferred_language | string | Yes | - | - |
| preferred_currency | string | Yes | - | - |
| marketing_consent | boolean | Yes | - | - |
| newsletter_subscribed | boolean | Yes | - | - |
| notes | string | No | - | - |
| tags | array<any> | Yes | - | - |
| metadata | object | Yes | - | - |
| created_at | string | Yes | - | - |
| updated_at | string | Yes | - | - |
| last_login_at | string | No | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves the customer profile for the authenticated user. Use the user ID from session (NOT from query parameter - userid should never be passed from frontend for security). This is for logged-in users to get their own customer profile only. Return the complete customer object. Return 404 error if no customer profile exists for the user.

### GET /api/TiersList

- **ID**: tierslist
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (tierslist_input):**
*Input object for TiersList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| enabled | boolean | No | - | - |
| sort | string | No | - | - |
| order | string | No | - | - |

**Output Format (tierslist_output):**
*Output object for TiersList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<any> | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves a list of subscription tiers. Support query parameters: enabled (filter by enabled status, default shows all for admin, only enabled for non-admin), sort (name, price, display_order), order (asc/desc). Return array of tier objects including all fields. Order results by display_order ascending by default. For non-admin users, only return enabled tiers.

### POST /api/CreateSubscription

- **ID**: subscription_create
- **Authentication Required**: registereduser
- **User Tier**: None
- **Required API Keys**: NEXT_PUBLIC_STRIPE_CONNECT_ACCOUNT_ID

**Input Parameters (subscription_create_input):**
*Input object for CreateSubscription API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| price_id | string | Yes | - | - |
| trial_days | number | No | - | - |

**Output Format (subscription_create_output):**
*Output object for CreateSubscription API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| checkoutUrl | string | Yes | - | - |
| sessionId | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that initiates a Stripe subscription checkout session. Accept price_id (Stripe price ID for the subscription tier) and optional trial_days. Look up or create customer record for the authenticated user. Create a Stripe Checkout session in subscription mode using the connected account. If no subscription exists for this customer, create one with status 'pending'. Store the Stripe session ID. Return the checkout URL to redirect the user to Stripe for payment. Handle all error cases properly including missing Stripe configuration.

### GET /api/TiersGet

- **ID**: tiersget
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (tiersget_input):**
*Input object for TiersGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | No | - | - |
| slug | string | No | - | - |

**Output Format (tiersget_output):**
*Output object for TiersGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| slug | string | Yes | - | - |
| description | string | No | - | - |
| price | number | Yes | - | - |
| billing_period | string | Yes | - | - |
| stripe_price_id | string | No | - | - |
| features | array<any> | Yes | - | - |
| limits | object | Yes | - | - |
| display_order | number | Yes | - | - |
| enabled | boolean | Yes | - | - |
| is_featured | boolean | Yes | - | - |
| trial_days | number | Yes | - | - |
| created_at | string | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves a single subscription tier by ID or slug from the query parameter. Accept either 'id' or 'slug' query parameter. Return the complete tier object with all fields. Return 404 if tier not found.

### GET /api/SubscriptionsList

- **ID**: subscriptionslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (subscriptionslist_input):**
*Input object for SubscriptionsList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|

**Output Format (subscriptionslist_output):**
*Output object for SubscriptionsList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<any> | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves the current user's subscription(s). Returns subscription records filtered by the logged-in user's customer ID. Include all subscription fields including tier info, status, current period dates, and cancellation status. Order by created_at descending. User must be authenticated.

### GET /api/SaaSOrdersList

- **ID**: saas_orderslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (saas_orderslist_input):**
*Input object for SaaSOrdersList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|

**Output Format (saas_orderslist_output):**
*Output object for SaaSOrdersList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<any> | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves the current user's SaaS payment/order history. Returns saas_orders records filtered by the logged-in user's customer ID. Include all order fields including amount, status, payment status, invoice URLs, and descriptions. Order by created_at descending. User must be authenticated.

### POST /api/TiersCreate

- **ID**: tierscreate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (tierscreate_input):**
*Input object for TiersCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| name | string | Yes | - | - |
| slug | string | Yes | - | - |
| description | string | No | - | - |
| price | number | Yes | - | - |
| billing_period | string | No | - | - |
| stripe_price_id | string | No | - | - |
| features | array<any> | No | - | - |
| limits | object | No | - | - |
| display_order | number | No | - | - |
| enabled | boolean | No | - | - |
| is_featured | boolean | No | - | - |
| trial_days | number | No | - | - |

**Output Format (tierscreate_output):**
*Output object for TiersCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| slug | string | Yes | - | - |
| description | string | No | - | - |
| price | number | Yes | - | - |
| billing_period | string | Yes | - | - |
| stripe_price_id | string | No | - | - |
| features | array<any> | Yes | - | - |
| limits | object | Yes | - | - |
| display_order | number | Yes | - | - |
| enabled | boolean | Yes | - | - |
| is_featured | boolean | Yes | - | - |
| trial_days | number | Yes | - | - |
| created_at | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that creates a new subscription tier. Accept JSON body with name (required), slug (required, lowercase alphanumeric with dashes), description (optional), price (required, decimal), billing_period (optional, default 'monthly'), stripe_price_id (optional), features (optional, array of strings), limits (optional, object), display_order (optional, default 0), enabled (optional, default true), is_featured (optional, default false), trial_days (optional, default 0). Generate a new UUID for the id field. Validate that name and slug are not empty and slug is unique. Return the complete created tier object.

### PUT /api/TiersUpdate

- **ID**: tiersupdate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (tiersupdate_input):**
*Input object for TiersUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | No | - | - |
| slug | string | No | - | - |
| description | string | No | - | - |
| price | number | No | - | - |
| billing_period | string | No | - | - |
| stripe_price_id | string | No | - | - |
| features | array<any> | No | - | - |
| limits | object | No | - | - |
| display_order | number | No | - | - |
| enabled | boolean | No | - | - |
| is_featured | boolean | No | - | - |
| trial_days | number | No | - | - |

**Output Format (tiersupdate_output):**
*Output object for TiersUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| slug | string | Yes | - | - |
| description | string | No | - | - |
| price | number | Yes | - | - |
| billing_period | string | Yes | - | - |
| stripe_price_id | string | No | - | - |
| features | array<any> | Yes | - | - |
| limits | object | Yes | - | - |
| display_order | number | Yes | - | - |
| enabled | boolean | Yes | - | - |
| is_featured | boolean | Yes | - | - |
| trial_days | number | Yes | - | - |
| updated_at | string | Yes | - | - |

**Implementation Notes:**
Create a PUT endpoint that updates an existing subscription tier by ID from the query parameter. Accept JSON body with optional fields: name, slug, description, price, billing_period, stripe_price_id, features, limits, display_order, enabled, is_featured, trial_days. Only update fields that are provided in the request body. Validate that if slug is provided, it's unique (excluding current record). Return the complete updated tier object. Return 404 if tier not found.

### DELETE /api/TiersDelete

- **ID**: tiersdelete
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (tiersdelete_input):**
*Input object for TiersDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (tiersdelete_output):**
*Output object for TiersDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |
| id | string | No | - | - |

**Implementation Notes:**
Create a DELETE endpoint that deletes a subscription tier by ID from the query parameter. Validate that the tier exists before deletion. Check if any subscriptions have this tier's slug as their user_tier and prevent deletion if they exist (return error message indicating subscribers must be migrated first). Return success confirmation with deleted tier id. Return 404 if tier not found.

### GET /api/EmployeesList

- **ID**: employeeslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (employeeslist_input):**
*Input object for EmployeesList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| page | number | No | - | - |
| limit | number | No | - | - |
| search | string | No | - | - |
| department | string | No | - | - |
| status | string | No | - | - |
| employment_type | string | No | - | - |
| sort_by | string | No | - | - |
| sort_order | string | No | - | - |

**Output Format (employeeslist_output):**
*Output object for EmployeesList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<any> | Yes | - | - |
| pagination | object | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that lists employees with optional filtering. Accept query parameters: page (default 1), limit (default 20), search (searches first_name, last_name, email), department, status, employment_type, sort_by (default 'last_name'), sort_order (default 'ASC'). Return array of employees with pagination metadata.

### GET /api/EmployeesGet

- **ID**: employeesget
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (employeesget_input):**
*Input object for EmployeesGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | No | - | - |
| userid | string | No | - | - |

**Output Format (employeesget_output):**
*Output object for EmployeesGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | object | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves a single employee by ID or userid. Accept query parameter: id or userid. Return the complete employee object.

### POST /api/EmployeesCreate

- **ID**: employeescreate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (employeescreate_input):**
*Input object for EmployeesCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| userid | string | Yes | - | - |
| first_name | string | Yes | - | - |
| last_name | string | Yes | - | - |
| email | string | Yes | - | - |
| phone | string | No | - | - |
| avatar_url | string | No | - | - |
| job_title | string | No | - | - |
| department | string | No | - | - |
| manager_id | string | No | - | - |
| hire_date | string | No | - | - |
| employment_type | string | No | - | - |
| location | string | No | - | - |
| timezone | string | No | - | - |
| hourly_rate | number | No | - | - |
| skills | array<any> | No | - | - |
| bio | string | No | - | - |

**Output Format (employeescreate_output):**
*Output object for EmployeesCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| employee_number | string | Yes | - | - |
| first_name | string | Yes | - | - |
| last_name | string | Yes | - | - |
| email | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that creates a new employee profile. Accept JSON body with userid (required), first_name (required), last_name (required), email (required), and optional fields: phone, avatar_url, job_title, department, manager_id, hire_date, employment_type, location, timezone, hourly_rate, skills array, bio. Auto-generate employee_number. Admin only.

### PUT /api/EmployeesUpdate

- **ID**: employeesupdate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (employeesupdate_input):**
*Input object for EmployeesUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| first_name | string | No | - | - |
| last_name | string | No | - | - |
| phone | string | No | - | - |
| avatar_url | string | No | - | - |
| job_title | string | No | - | - |
| department | string | No | - | - |
| manager_id | string | No | - | - |
| employment_type | string | No | - | - |
| status | string | No | - | - |
| location | string | No | - | - |
| timezone | string | No | - | - |
| skills | array<any> | No | - | - |
| bio | string | No | - | - |

**Output Format (employeesupdate_output):**
*Output object for EmployeesUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | object | Yes | - | - |

**Implementation Notes:**
Create a PUT endpoint that updates an existing employee. Accept JSON body with id (required) and optional fields. Users can update their own profile, admins can update anyone. Return the updated employee.

### DELETE /api/EmployeesDelete

- **ID**: employeesdelete
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (employeesdelete_input):**
*Input object for EmployeesDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (employeesdelete_output):**
*Output object for EmployeesDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |

**Implementation Notes:**
Create a DELETE endpoint that deletes an employee by ID. Admin only. Accept query parameter id.

### GET /api/ProjectsList

- **ID**: projectslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (projectslist_input):**
*Input object for ProjectsList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| page | number | No | - | - |
| limit | number | No | - | - |
| search | string | No | - | - |
| status | string | No | - | - |
| priority | string | No | - | - |
| owner_id | string | No | - | - |
| sort_by | string | No | - | - |
| sort_order | string | No | - | - |

**Output Format (projectslist_output):**
*Output object for ProjectsList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<any> | Yes | - | - |
| pagination | object | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that lists projects the user has access to. Accept query parameters: page (default 1), limit (default 20), search (searches name, description), status, priority, owner_id, sort_by (default 'updated_at'), sort_order (default 'DESC'). Return array of projects with pagination metadata. Users see projects they own or are members of.

### GET /api/ProjectsGet

- **ID**: projectsget
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (projectsget_input):**
*Input object for ProjectsGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | No | - | - |
| slug | string | No | - | - |

**Output Format (projectsget_output):**
*Output object for ProjectsGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | object | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves a single project by ID or slug. Include member count and owner details. Only accessible by project members or admins.

### POST /api/ProjectsCreate

- **ID**: projectscreate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (projectscreate_input):**
*Input object for ProjectsCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| name | string | Yes | - | - |
| description | string | No | - | - |
| status | string | No | - | - |
| priority | string | No | - | - |
| visibility | string | No | - | - |
| color | string | No | - | - |
| icon | string | No | - | - |
| start_date | string | No | - | - |
| due_date | string | No | - | - |
| budget | number | No | - | - |

**Output Format (projectscreate_output):**
*Output object for ProjectsCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| slug | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that creates a new project. Accept JSON body with name (required), and optional: description, status, priority, visibility, color, icon, start_date, due_date, budget. Auto-generate slug from name. Set owner to current user's employee ID. Add owner as project member with 'owner' role.

### PUT /api/ProjectsUpdate

- **ID**: projectsupdate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (projectsupdate_input):**
*Input object for ProjectsUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | No | - | - |
| description | string | No | - | - |
| status | string | No | - | - |
| priority | string | No | - | - |
| visibility | string | No | - | - |
| color | string | No | - | - |
| icon | string | No | - | - |
| start_date | string | No | - | - |
| due_date | string | No | - | - |
| budget | number | No | - | - |

**Output Format (projectsupdate_output):**
*Output object for ProjectsUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | object | Yes | - | - |

**Implementation Notes:**
Create a PUT endpoint that updates a project. Accept JSON body with id (required) and optional fields. Only project owner or admin can update. Update completed_at when status changes to completed.

### DELETE /api/ProjectsDelete

- **ID**: projectsdelete
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (projectsdelete_input):**
*Input object for ProjectsDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (projectsdelete_output):**
*Output object for ProjectsDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |

**Implementation Notes:**
Create a DELETE endpoint that deletes a project and all its related data (tasks, comments, members). Only project owner or admin can delete.

### GET /api/TasksList

- **ID**: taskslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (taskslist_input):**
*Input object for TasksList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| project_id | string | Yes | - | - |
| status | string | No | - | - |
| priority | string | No | - | - |
| assignee_id | string | No | - | - |
| search | string | No | - | - |
| sort_by | string | No | - | - |
| sort_order | string | No | - | - |

**Output Format (taskslist_output):**
*Output object for TasksList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<any> | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that lists tasks for a project. Accept query parameters: project_id (required), status, priority, assignee_id, search, sort_by (default 'position'), sort_order (default 'ASC'). Include assignee details.

### GET /api/TasksGet

- **ID**: tasksget
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (tasksget_input):**
*Input object for TasksGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (tasksget_output):**
*Output object for TasksGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | object | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves a single task by ID. Include assignee and reporter details, and subtask count.

### POST /api/TasksCreate

- **ID**: taskscreate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (taskscreate_input):**
*Input object for TasksCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| project_id | string | Yes | - | - |
| title | string | Yes | - | - |
| description | string | No | - | - |
| status | string | No | - | - |
| priority | string | No | - | - |
| assignee_id | string | No | - | - |
| parent_task_id | string | No | - | - |
| due_date | string | No | - | - |
| start_date | string | No | - | - |
| estimated_hours | number | No | - | - |
| labels | array<any> | No | - | - |

**Output Format (taskscreate_output):**
*Output object for TasksCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| title | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that creates a new task. Accept JSON body with project_id (required), title (required), and optional: description, status, priority, assignee_id, parent_task_id, due_date, start_date, estimated_hours, labels array. Set reporter_id to current user. Update project task_count.

### PUT /api/TasksUpdate

- **ID**: tasksupdate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (tasksupdate_input):**
*Input object for TasksUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| title | string | No | - | - |
| description | string | No | - | - |
| status | string | No | - | - |
| priority | string | No | - | - |
| assignee_id | string | No | - | - |
| due_date | string | No | - | - |
| estimated_hours | number | No | - | - |
| actual_hours | number | No | - | - |
| position | number | No | - | - |
| labels | array<any> | No | - | - |
| checklist | array<any> | No | - | - |

**Output Format (tasksupdate_output):**
*Output object for TasksUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | object | Yes | - | - |

**Implementation Notes:**
Create a PUT endpoint that updates a task. Accept JSON body with id (required) and optional fields. Update completed_at when status changes to done. Update project progress when task completes.

### DELETE /api/TasksDelete

- **ID**: tasksdelete
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (tasksdelete_input):**
*Input object for TasksDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (tasksdelete_output):**
*Output object for TasksDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |

**Implementation Notes:**
Create a DELETE endpoint that deletes a task and its comments. Update project task counts.

### GET /api/TaskCommentsList

- **ID**: taskcommentslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (taskcommentslist_input):**
*Input object for TaskCommentsList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| task_id | string | Yes | - | - |

**Output Format (taskcommentslist_output):**
*Output object for TaskCommentsList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<any> | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that lists comments for a task. Include author details. Sort by created_at ascending.

### POST /api/TaskCommentsCreate

- **ID**: taskcommentscreate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (taskcommentscreate_input):**
*Input object for TaskCommentsCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| task_id | string | Yes | - | - |
| content | string | Yes | - | - |
| parent_comment_id | string | No | - | - |

**Output Format (taskcommentscreate_output):**
*Output object for TaskCommentsCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| content | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that creates a new comment on a task. Accept task_id, content, and optional parent_comment_id for replies. Set author to current user. Update task comment_count.

### GET /api/ProjectMembersList

- **ID**: projectmemberslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (projectmemberslist_input):**
*Input object for ProjectMembersList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| project_id | string | Yes | - | - |

**Output Format (projectmemberslist_output):**
*Output object for ProjectMembersList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<any> | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that lists members of a project. Include employee details. Sort by role (owner first) then name.

### POST /api/ProjectMembersAdd

- **ID**: projectmembersadd
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (projectmembersadd_input):**
*Input object for ProjectMembersAdd API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| project_id | string | Yes | - | - |
| employee_id | string | Yes | - | - |
| role | string | No | - | - |

**Output Format (projectmembersadd_output):**
*Output object for ProjectMembersAdd API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| role | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that adds a member to a project. Accept project_id, employee_id, and optional role (default 'member'). Only project owners/admins can add members.

### DELETE /api/ProjectMembersRemove

- **ID**: projectmembersremove
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (projectmembersremove_input):**
*Input object for ProjectMembersRemove API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (projectmembersremove_output):**
*Output object for ProjectMembersRemove API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |

**Implementation Notes:**
Create a DELETE endpoint that removes a member from a project. Cannot remove the project owner. Only owners/admins can remove members, or members can remove themselves.

### GET /api/TimeEntriesList

- **ID**: timeentrieslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (timeentrieslist_input):**
*Input object for TimeEntriesList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| project_id | string | No | - | - |
| task_id | string | No | - | - |
| start_date | string | No | - | - |
| end_date | string | No | - | - |
| is_billable | boolean | No | - | - |
| search | string | No | - | - |
| page | number | No | - | - |
| limit | number | No | - | - |

**Output Format (timeentrieslist_output):**
*Output object for TimeEntriesList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<any> | Yes | - | - |
| total | number | Yes | - | - |
| page | number | Yes | - | - |
| limit | number | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that lists time entries for the current user. Accept query parameters: project_id (optional), task_id (optional), start_date (optional), end_date (optional), is_billable (optional), search, page, limit. Return entries with project and task details if they exist. Sort by start_time descending by default.

### POST /api/TimeEntriesCreate

- **ID**: timeentriescreate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (timeentriescreate_input):**
*Input object for TimeEntriesCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| description | string | No | - | - |
| project_id | string | No | - | - |
| task_id | string | No | - | - |
| start_time | string | Yes | - | - |
| end_time | string | No | - | - |
| duration_minutes | number | No | - | - |
| is_billable | boolean | No | - | - |
| is_running | boolean | No | - | - |
| hourly_rate | number | No | - | - |
| tags | array<any> | No | - | - |

**Output Format (timeentriescreate_output):**
*Output object for TimeEntriesCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| start_time | string | Yes | - | - |
| is_running | boolean | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that creates a new time entry. Accept JSON body with description (optional), project_id (optional), task_id (optional), start_time (required), end_time (optional), duration_minutes (optional - calculated if end_time provided), is_billable (default true), is_running (default false), hourly_rate (optional), tags (optional array). Set customer_id by looking up the customer record for the current user. If is_running is true, stop any other running timers for this customer.

### PUT /api/TimeEntriesUpdate

- **ID**: timeentriesupdate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (timeentriesupdate_input):**
*Input object for TimeEntriesUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| description | string | No | - | - |
| project_id | string | No | - | - |
| task_id | string | No | - | - |
| start_time | string | No | - | - |
| end_time | string | No | - | - |
| duration_minutes | number | No | - | - |
| is_billable | boolean | No | - | - |
| is_running | boolean | No | - | - |
| hourly_rate | number | No | - | - |
| tags | array<any> | No | - | - |

**Output Format (timeentriesupdate_output):**
*Output object for TimeEntriesUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| updated_at | string | Yes | - | - |

**Implementation Notes:**
Create a PUT endpoint that updates an existing time entry. Accept JSON body with id (required) and optional fields: description, project_id, task_id, start_time, end_time, duration_minutes, is_billable, is_running, hourly_rate, tags. Recalculate duration if start/end times changed. If setting is_running to true, stop other running timers. Only allow updating own entries unless admin.

### DELETE /api/TimeEntriesDelete

- **ID**: timeentriesdelete
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (timeentriesdelete_input):**
*Input object for TimeEntriesDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (timeentriesdelete_output):**
*Output object for TimeEntriesDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |

**Implementation Notes:**
Create a DELETE endpoint that deletes a time entry by ID. Only allow deleting own entries unless admin.

### GET /api/TimeEntriesSummary

- **ID**: timeentriessummary
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (timeentriessummary_input):**
*Input object for TimeEntriesSummary API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| start_date | string | Yes | - | - |
| end_date | string | Yes | - | - |
| group_by | string | No | - | - |
| project_id | string | No | - | - |
| is_billable | boolean | No | - | - |

**Output Format (timeentriessummary_output):**
*Output object for TimeEntriesSummary API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| total_minutes | number | Yes | - | - |
| billable_minutes | number | Yes | - | - |
| total_earnings | number | Yes | - | - |
| entries_count | number | Yes | - | - |
| breakdown | array<any> | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that returns time tracking summary/reports. Accept query parameters: start_date (required), end_date (required), group_by (optional: 'day', 'week', 'project', 'task'), project_id (optional), is_billable (optional). Return total hours, billable hours, total earnings, and breakdown by group_by parameter.

### GET /api/InvoicesList

- **ID**: invoiceslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (invoiceslist_input):**
*Input object for InvoicesList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| status | string | No | - | - |
| client_name | string | No | - | - |
| start_date | string | No | - | - |
| end_date | string | No | - | - |
| search | string | No | - | - |
| page | number | No | - | - |
| limit | number | No | - | - |

**Output Format (invoiceslist_output):**
*Output object for InvoicesList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<any> | Yes | - | - |
| total | number | Yes | - | - |
| page | number | Yes | - | - |
| limit | number | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that lists invoices for the current user. Accept query parameters: status (optional), client_name (optional), start_date (optional), end_date (optional), search (optional), page, limit. Return invoices with customer details if available. Sort by issue_date descending by default.

### GET /api/InvoicesGet

- **ID**: invoicesget
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (invoicesget_input):**
*Input object for InvoicesGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (invoicesget_output):**
*Output object for InvoicesGet API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| invoice_number | string | Yes | - | - |
| status | string | Yes | - | - |
| client_name | string | Yes | - | - |
| total | number | Yes | - | - |
| line_items | array<any> | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves a single invoice by ID. Include all invoice details, line items, and customer information if available. Only return invoices owned by the current user.

### POST /api/InvoicesCreate

- **ID**: invoicescreate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (invoicescreate_input):**
*Input object for InvoicesCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| client_name | string | Yes | - | - |
| client_email | string | No | - | - |
| client_address | string | No | - | - |
| customer_id | string | No | - | - |
| issue_date | string | Yes | - | - |
| due_date | string | Yes | - | - |
| line_items | array<any> | Yes | - | - |
| tax_rate | number | No | - | - |
| discount_amount | number | No | - | - |
| currency | string | No | - | - |
| notes | string | No | - | - |
| payment_terms | string | No | - | - |
| project_id | string | No | - | - |
| time_entry_ids | array<any> | No | - | - |

**Output Format (invoicescreate_output):**
*Output object for InvoicesCreate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| invoice_number | string | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that creates a new invoice. Auto-generate an invoice number if not provided. Calculate subtotal, tax_amount, and total from line_items. Set default status to 'draft'.

### PUT /api/InvoicesUpdate

- **ID**: invoicesupdate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (invoicesupdate_input):**
*Input object for InvoicesUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| client_name | string | No | - | - |
| client_email | string | No | - | - |
| client_address | string | No | - | - |
| status | string | No | - | - |
| issue_date | string | No | - | - |
| due_date | string | No | - | - |
| line_items | array<any> | No | - | - |
| tax_rate | number | No | - | - |
| discount_amount | number | No | - | - |
| amount_paid | number | No | - | - |
| notes | string | No | - | - |
| payment_terms | string | No | - | - |

**Output Format (invoicesupdate_output):**
*Output object for InvoicesUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| message | string | Yes | - | - |

**Implementation Notes:**
Create a PUT endpoint that updates an existing invoice. Recalculate totals if line_items change. Handle status transitions (draft->sent->paid). Only allow updates to invoices owned by the current user.

### DELETE /api/InvoicesDelete

- **ID**: invoicesdelete
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (invoicesdelete_input):**
*Input object for InvoicesDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (invoicesdelete_output):**
*Output object for InvoicesDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| message | string | Yes | - | - |

**Implementation Notes:**
Create a DELETE endpoint that deletes an invoice. Only allow deletion of invoices owned by the current user. Prevent deletion of paid invoices.

### POST /api/InvoicesFromTimeEntries

- **ID**: invoicesfromtimeentries
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (invoicesfromtimeentries_input):**
*Input object for InvoicesFromTimeEntries API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| time_entry_ids | array<any> | Yes | - | - |
| client_name | string | Yes | - | - |
| client_email | string | No | - | - |
| due_date | string | Yes | - | - |
| tax_rate | number | No | - | - |
| notes | string | No | - | - |

**Output Format (invoicesfromtimeentries_output):**
*Output object for InvoicesFromTimeEntries API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| invoice_number | string | Yes | - | - |
| total | number | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that creates an invoice from time entries. Accept an array of time entry IDs. Calculate line items from time entries using their duration and hourly rate. Group by project if multiple projects. Mark time entries as invoiced.

### GET /api/InvoicesSummary

- **ID**: invoicessummary
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (invoicessummary_input):**
*Input object for InvoicesSummary API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| start_date | string | No | - | - |
| end_date | string | No | - | - |

**Output Format (invoicessummary_output):**
*Output object for InvoicesSummary API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| total_invoiced | number | Yes | - | - |
| total_paid | number | Yes | - | - |
| total_outstanding | number | Yes | - | - |
| overdue_count | number | Yes | - | - |
| breakdown | array<any> | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that returns invoice statistics for the current user. Include total invoiced amount, total paid, total outstanding, overdue count, and breakdown by status.

## Views and Components

### Logos

#### Logo

- **ID**: 1b59a2d2-9253-47d9-84d6-18888ea959b6
- **Type**: logo

**Description:**
/logo.png

### Menus

#### Header Menu

- **ID**: ee3d24f8-0927-41f5-a36b-a35b7d00b3a4
- **Type**: menu

**Description:**
92c79375-c5fc-44ac-b927-beb6e137d083

#### Footer Menu

- **ID**: 5a914c52-d135-4b2c-87ef-b6a66823558b
- **Type**: menu

**Description:**
7eca67ef-4188-45be-b7cf-17df3c6b45e1

#### User Dashboard Menu

- **ID**: 6e669839-9950-4cbb-acc6-f027109a38db
- **Type**: menu

**Description:**
bd84ce69-8525-49fc-8122-1f0ae0deb099

#### Admin Dashboard Menu

- **ID**: 39c87a3b-93fe-4405-9a73-6da1d8d07943
- **Type**: menu

**Description:**
5306ff10-9370-4c63-95aa-427492e9e637

### Login Buttons

#### Login Button

- **ID**: 363a914d-5c67-4ac7-8faa-730a6ed1efb0
- **Type**: loginbutton

### Containers

#### Header

- **ID**: b93d654b-9453-46e2-8f01-108adf3898e8
- **Type**: container

**Description:**
[{"viewId":"1b59a2d2-9253-47d9-84d6-18888ea959b6","colpos":2,"colposmd":10,"colpossm":8},{"viewId":"ee3d24f8-0927-41f5-a36b-a35b7d00b3a4","colpos":8,"colposmd":1,"colpossm":2},{"viewId":"2c932815-e995-4946-af20-671cdf993e3b","colpos":1,"colposmd":0,"colpossm":0},{"viewId":"363a914d-5c67-4ac7-8faa-730a6ed1efb0","colpos":1,"colposmd":1,"colpossm":2}]

### Icon Bars

#### Header Icon Bar

- **ID**: 2c932815-e995-4946-af20-671cdf993e3b
- **Type**: iconbar

**Description:**
[]

### socialbar

#### Social Media Bar

- **ID**: e3ddc464-ecd7-4309-9a38-d147597c9337
- **Type**: socialbar

**Description:**
{"bluesky":"","x":"","facebook":"","youtube":"","instagram":"","discord":"","tiktok":""}

### Text Sections

#### Copyright

- **ID**: 43670e43-8015-45e6-8dda-74e5402c234d
- **Type**: text

**Description:**
© 2025 ChronoPulse. All rights reserved.

#### Our Story

- **ID**: ac9dbb2f-7914-460b-95c8-a2528646f129
- **Type**: text

**Description:**
<section class="w-full pt-12 sm:pt-16 pb-12 sm:pb-16">
  <h1 class="px-4 sm:px-6 md:px-8 mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">About TimeFlow</h1>
  
  <div class="px-4 sm:px-6 md:px-8">
    <p class="mb-8 sm:mb-12 text-lg">We believe your time is your most valuable asset. At ChronoPulse, we built TimeFlow to help professionals and teams reclaim control over every minute of their workday, transforming how you track, manage, and optimize your time.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 sm:mb-16">
      <div class="p-4 sm:p-6">
        <h2 class="text-xl font-semibold mb-4">Our Mission</h2>
        <p class="mb-4">TimeFlow exists for one purpose: to empower professionals and teams to take control of their time so they can focus on what truly matters. Whether you are a freelancer juggling multiple clients, an agency managing complex projects, or a growing team scaling operations, we provide the clarity and insights you need to work smarter, not harder.</p>
        <p>We are committed to helping businesses become more productive, profitable, and balanced through intelligent time management.</p>
      </div>
      <div class="p-4 sm:p-6">
        <h2 class="text-xl font-semibold mb-4">Our Story</h2>
        <p class="mb-4">TimeFlow was born from frustration. Our founding team spent years wrestling with clunky, overcomplicated time tracking tools that demanded more attention than the actual work. Spreadsheets that never added up correctly. Software bloated with features no one asked for. Interfaces that felt like solving a puzzle before you could log a single hour.</p>
        <p>We knew there had to be a better way. So we built it.</p>
      </div>
    </div>
    
    <hr class="border-t border-white/10 mb-10 sm:mb-12">
    
    <h2 class="mb-6 sm:mb-8 text-xl font-semibold">Our Core Values</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Simplicity</h3>
        <p class="text-sm">Powerful does not have to mean complicated. Our Time Tracking interface lets you start and stop timers with a single click. No training manuals required. No steep learning curves. Just intuitive design that gets out of your way.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Accuracy</h3>
        <p class="text-sm">Every second counts when billing clients or analyzing productivity. TimeFlow delivers precise tracking and reliable Dashboard Analytics you can trust for invoicing, reporting, and strategic decision-making.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Empowerment</h3>
        <p class="text-sm">We build tools that help you focus on what matters most. Less time managing time means more time creating, building, and growing your business. TimeFlow gives you back the hours you deserve.</p>
      </div>
      
    </div>
    
    <hr class="border-t border-white/10 mb-10 sm:mb-12">
    
    <h2 class="mb-6 sm:mb-8 text-xl font-semibold">Built for the Way You Work</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">For Freelancers</h3>
        <p class="text-sm mb-4">Track billable hours across multiple clients with ease. Generate professional Invoices in minutes and use Dashboard Analytics to understand where your time goes.</p>
        <ul class="list-disc pl-5 space-y-2 text-sm">
          <li>Client-based time tracking</li>
          <li>Instant invoice generation</li>
          <li>Project-level insights</li>
        </ul>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">For Agencies</h3>
        <p class="text-sm mb-4">Manage Team Members across multiple projects. Use our Project Workspace and Task Board to coordinate efforts while Customer Management keeps client relationships organized.</p>
        <ul class="list-disc pl-5 space-y-2 text-sm">
          <li>Multi-project oversight</li>
          <li>Team Directory management</li>
          <li>Client billing workflows</li>
        </ul>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">For Growing Teams</h3>
        <p class="text-sm mb-4">Scale confidently with Admin Dashboard Analytics and Subscription Management. Our Employee Directory and Project Board features grow alongside your organization.</p>
        <ul class="list-disc pl-5 space-y-2 text-sm">
          <li>Scalable team management</li>
          <li>Administrative oversight</li>
          <li>Flexible pricing tiers</li>
        </ul>
      </div>
      
    </div>
    
    <hr class="border-t border-white/10 mb-10 sm:mb-12">
    
    <h2 class="mb-6 sm:mb-8 text-xl font-semibold">Powerful Features, Effortless Experience</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 sm:mb-16">
      <div class="p-4 sm:p-6">
        <h3 class="font-semibold mb-4">Complete Time Management</h3>
        <p class="mb-4">TimeFlow combines everything you need in one seamless platform. From tracking your first minute to analyzing quarterly productivity trends, we have you covered.</p>
        <ul class="list-disc pl-5 space-y-2">
          <li>One-click Time Tracking with project assignment</li>
          <li>My Projects workspace for organized oversight</li>
          <li>Tasks Manager to break down complex deliverables</li>
          <li>Invoice Management for seamless billing</li>
        </ul>
      </div>
      <div class="p-4 sm:p-6">
        <h3 class="font-semibold mb-4">Insights That Drive Growth</h3>
        <p class="mb-4">Understanding where time goes is the first step to optimizing it. Our analytics transform raw data into actionable intelligence.</p>
        <ul class="list-disc pl-5 space-y-2">
          <li>Dashboard with real-time productivity metrics</li>
          <li>Project-level profitability analysis</li>
          <li>Team performance insights for managers</li>
          <li>Historical trends to inform planning</li>
        </ul>
      </div>
    </div>
    
    <hr class="border-t border-white/10 mb-10 sm:mb-12">
    
    <h2 class="mb-6 sm:mb-8 text-xl font-semibold">Our Vision for the Future</h2>
    
    <div class="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 mb-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="p-4 sm:p-6">
          <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 class="font-semibold text-lg mb-3">Where We Are Headed</h3>
          <p class="text-sm">We envision a world where time tracking is invisible, where intelligent systems anticipate your needs and surface insights before you ask. Where every professional, regardless of team size, has access to enterprise-grade productivity tools.</p>
        </div>
        <div class="p-4 sm:p-6">
          <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <h3 class="font-semibold text-lg mb-3">Our Promise</h3>
          <p class="text-sm">As ChronoPulse grows, we remain committed to our founding principles. TimeFlow will always prioritize simplicity without sacrificing power. We will continue listening to our community of freelancers, agencies, and growing teams to build features that solve real problems.</p>
        </div>
      </div>
    </div>
    
    <div class="p-4 sm:p-6">
      <h3 class="font-semibold text-lg mb-4">Join Thousands Who Have Taken Control of Their Time</h3>
      <p class="mb-4">Every hour you spend wrestling with inadequate tools is an hour stolen from the work you love. TimeFlow gives that time back. Start tracking smarter today and discover what becomes possible when time is on your side.</p>
      <p class="font-medium">Welcome to ChronoPulse. Welcome to TimeFlow. Welcome to clarity.</p>
    </div>
    
  </div>
</section>

#### Common Questions

- **ID**: 3cfb6a8a-1c03-48ee-8d1e-3ca2b5aef128
- **Type**: text

**Description:**
<section class="w-full pt-12 sm:pt-16 pb-12 sm:pb-16">
  <h1 class="px-4 sm:px-6 md:px-8 mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h1>
  
  <div class="px-4 sm:px-6 md:px-8">
    <p class="mb-8 sm:mb-12 text-lg">Find answers to the most common questions about TimeFlow by ChronoPulse. Whether you are just getting started or looking to maximize your time tracking efficiency, we have got you covered.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">How does time tracking work?</h3>
        <p class="text-sm">TimeFlow makes tracking your work effortless. Simply navigate to the Time Tracker page, select your project, and click start to begin logging hours. You can pause, resume, or stop the timer at any time. Manual time entries are also supported if you prefer to log hours after completing work. All tracked time syncs automatically with your Dashboard Analytics for real-time insights.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Can I track time across multiple projects?</h3>
        <p class="text-sm">Absolutely. TimeFlow is built for professionals managing complex workloads. From the My Projects page, create and organize unlimited projects. Each project has its own dedicated Project Workspace where you can switch between tasks seamlessly. The Time Tracker allows you to allocate hours to specific projects, and your Dashboard Analytics displays breakdowns by project.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">How do I generate invoices from tracked time?</h3>
        <p class="text-sm">Converting tracked hours into professional invoices is simple. Head to the Invoices page where you can select a client from Customer Management, choose the date range, and TimeFlow automatically calculates totals based on your billable rates. Customize invoice details, add notes, and generate polished invoices ready to send to your clients.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">What subscription plans are available?</h3>
        <p class="text-sm">ChronoPulse offers flexible Subscription Tiers to match every need. Visit our Pricing Plans page to compare options ranging from individual freelancer plans to enterprise solutions. Each tier unlocks different features including team size limits, advanced analytics, and priority support. Manage your current plan anytime from the My Subscription page.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Can I invite team members?</h3>
        <p class="text-sm">Yes, collaboration is at the heart of TimeFlow. Use the Team Directory to invite colleagues via email. Once they join, add them to specific projects through Project Members. Team leads can monitor hours across all members via the Admin Dashboard Analytics. The Employee Directory keeps everyone organized with profiles and contact information.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        <h3 class="font-semibold text-lg mb-3">How accurate is the time tracking?</h3>
        <p class="text-sm">TimeFlow tracks time down to the second with precision timing technology. Our system runs continuously in the background without battery drain, and automatic idle detection prevents logging inactive periods. Syncing happens in real-time across all devices, ensuring your time data is always accurate and up-to-date in your Dashboard Analytics.</p>
      </div>
      
    </div>
    
    <hr class="border-t border-white/10 mb-10 sm:mb-12">
    
    <h2 class="mb-6 sm:mb-8 text-xl sm:text-2xl font-semibold">Data, Billing, and Getting Started</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Can I export my data?</h3>
        <p class="text-sm">Your data belongs to you. TimeFlow allows full export capabilities from the Dashboard. Download time entries, project summaries, invoices, and team reports in multiple formats including CSV and PDF. This makes it easy to archive records, share with accountants, or migrate data if needed.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Is there a mobile app?</h3>
        <p class="text-sm">TimeFlow is fully responsive and works beautifully on any device. Access your Time Tracker, Task Board, and Dashboard from your smartphone or tablet browser with the same powerful features as the desktop experience. Track time on the go, manage tasks, and review analytics wherever work takes you.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">How do I handle billable vs non-billable hours?</h3>
        <p class="text-sm">TimeFlow makes distinguishing between billable and non-billable work straightforward. When logging time through the Time Tracker, toggle the billable status for each entry. Non-billable hours like internal meetings or admin tasks are tracked separately. Your Invoices page automatically filters to show only billable hours when generating client invoices.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">What happens to my data if I cancel?</h3>
        <p class="text-sm">We believe in data transparency. If you cancel your subscription through My Subscription, you retain read-only access to your account for 30 days. During this period, you can export all time entries, invoices, and project data. After 30 days, data is securely deleted from our servers unless you reactivate your account.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">How do I get started?</h3>
        <p class="text-sm">Getting started with TimeFlow takes just minutes. Click the login button to create your free account. Complete the Welcome to TimeFlow onboarding guide to set up your first project, configure your billing rates in Customer Management, and start tracking time immediately. Our About TimeFlow page has additional resources if you need help.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Can I integrate with other tools?</h3>
        <p class="text-sm">TimeFlow integrates seamlessly with your existing workflow. Connect with popular project management and accounting tools to sync data automatically. The Tasks Manager works alongside your Task Board for unified task tracking. Check our integrations settings to connect calendar apps, payment processors, and collaboration platforms.</p>
      </div>
      
    </div>
    
    <hr class="border-t border-white/10 mb-10 sm:mb-12">
    
    <h2 class="mb-6 sm:mb-8 text-xl sm:text-2xl font-semibold">Quick Reference Guide</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div class="p-4 sm:p-6">
        <h3 class="font-semibold text-lg mb-4">Key Pages to Know</h3>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Dashboard</strong> - Your central hub for analytics and overview</li>
          <li><strong>Time Tracker</strong> - Start, stop, and manage time entries</li>
          <li><strong>My Projects</strong> - Create and organize all your projects</li>
          <li><strong>Invoices</strong> - Generate professional invoices from tracked time</li>
          <li><strong>Task Board</strong> - Manage tasks with visual workflow boards</li>
          <li><strong>Team Directory</strong> - Invite and manage team members</li>
        </ul>
      </div>
      <div class="p-4 sm:p-6">
        <h3 class="font-semibold text-lg mb-4">For Administrators</h3>
        <ul class="list-disc pl-5 space-y-2">
          <li><strong>Admin Dashboard</strong> - Company-wide analytics and oversight</li>
          <li><strong>Manage Tiers</strong> - Configure subscription tier settings</li>
          <li><strong>Customer Management</strong> - Add and organize client information</li>
          <li><strong>Employee Directory</strong> - Full team roster and profiles</li>
          <li><strong>Project Members</strong> - Assign team members to projects</li>
          <li><strong>Subscription Management</strong> - Handle billing and plan changes</li>
        </ul>
      </div>
    </div>
    
    <div class="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8">
      <h3 class="font-semibold text-lg mb-4">Still have questions?</h3>
      <p class="mb-4">Our support team at ChronoPulse is here to help. Visit the About TimeFlow page for additional resources, tutorials, and contact information. We typically respond to inquiries within 24 hours on business days.</p>
      <p class="text-sm">TimeFlow is designed to make time tracking effortless so you can focus on what matters most: doing great work.</p>
    </div>
    
  </div>
</section>

#### Welcome to TimeFlow

- **ID**: 4fa21be8-1a39-49a5-8ef3-a83f77a00209
- **Type**: text

**Description:**
<section class="w-full pt-12 sm:pt-16 pb-12 sm:pb-16">
  <h1 class="px-4 sm:px-6 md:px-8 mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">Welcome to TimeFlow by ChronoPulse</h1>
  
  <div class="px-4 sm:px-6 md:px-8">
    <p class="mb-8 sm:mb-12 text-lg">Stop wrestling with spreadsheets and start reclaiming your time. TimeFlow is the modern time tracking solution built for freelancers, agencies, and teams who demand precision, simplicity, and results. From one-click timers to seamless invoice generation, everything you need to boost productivity and get paid faster is right here.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Effortless Time Tracking</h3>
        <p class="text-sm">Start tracking instantly with one-click timers. Our intuitive Time Tracker captures every billable minute without disrupting your workflow. No complicated setup, no learning curve.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Smart Project Management</h3>
        <p class="text-sm">Organize work your way with Projects, Project Workspace, and Task Board features. Keep every client, deadline, and deliverable perfectly structured in one centralized hub.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Automated Invoicing</h3>
        <p class="text-sm">Transform tracked hours into professional invoices instantly. Our Invoice Management system eliminates manual data entry, so you spend less time on paperwork and more time doing what you love.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Insightful Analytics</h3>
        <p class="text-sm">Make data-driven decisions with Dashboard Analytics. Visualize where your time goes, identify profitable projects, and uncover opportunities to optimize your productivity.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Team Collaboration</h3>
        <p class="text-sm">Manage your entire crew with Team Directory, Team Members, and Employee Directory features. Assign tasks, track team performance, and keep everyone aligned on project goals.</p>
      </div>
      
      <div class="bg-white/5 border border-white/10 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Customer Management</h3>
        <p class="text-sm">Keep all your client relationships organized in one place. Store contact details, track project history, and maintain professional relationships that drive repeat business.</p>
      </div>
      
    </div>
    
    <hr class="border-t border-white/10 mb-10 sm:mb-12">
    
    <h2 class="mb-6 text-xl font-semibold">Built for the Way You Work</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div class="p-4 sm:p-6">
        <h3 class="font-semibold mb-3">For Freelancers</h3>
        <p class="mb-4">Take control of your independent business with tools designed for solo professionals who need to track time, manage clients, and invoice efficiently.</p>
        <ul class="list-disc pl-5 space-y-2">
          <li>Track billable hours across multiple clients</li>
          <li>Generate professional invoices in seconds</li>
          <li>Monitor your productivity with personal analytics</li>
          <li>Manage subscriptions and pricing plans flexibly</li>
        </ul>
      </div>
      <div class="p-4 sm:p-6">
        <h3 class="font-semibold mb-3">For Agencies and Teams</h3>
        <p class="mb-4">Scale your operations with powerful team management features that keep everyone productive and projects on track.</p>
        <ul class="list-disc pl-5 space-y-2">
          <li>Coordinate team members with Project Board views</li>
          <li>Access Admin Dashboard Analytics for oversight</li>
          <li>Organize tasks efficiently with Tasks Manager</li>
          <li>Manage subscription tiers for your entire organization</li>
        </ul>
      </div>
    </div>
    
    <hr class="border-t border-white/10 mb-10 sm:mb-12">
    
    <h2 class="mb-6 text-xl font-semibold">Your Productivity, Elevated</h2>
    
    <p class="mb-6">ChronoPulse TimeFlow is more than a time tracker. It is your complete business command center where every second is accounted for, every project stays organized, and every invoice gets paid on time. Join thousands of professionals who have transformed the way they work.</p>
    
    <p class="font-medium text-lg">Ready to take control of your time? Explore our Pricing Plans and start your journey to effortless productivity today.</p>
    
  </div>
</section>

#### My Subscription Dashboard Link

- **ID**: 07293905-b025-439d-bb01-ee3964efde67
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': '0c04644b-0ee2-43b8-adf1-8fa166df8625' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Dashboard</a>

#### Manage Tiers Dashboard Link

- **ID**: c9dc5c89-182d-4e0a-8317-423d5ad6c643
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': '61d8f02c-561b-4f3e-801d-456ca687b6c6' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Admin Dashboard</a>

#### Customer Management Dashboard Link

- **ID**: 2b9e7c71-4481-4fdf-b268-fa1d395ae1bd
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': '61d8f02c-561b-4f3e-801d-456ca687b6c6' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Admin Dashboard</a>

#### Team Directory Dashboard Link

- **ID**: e8237ef2-ba9f-48bb-8dc2-0117316dd763
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': '61d8f02c-561b-4f3e-801d-456ca687b6c6' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Admin Dashboard</a>

#### My Projects Dashboard Link

- **ID**: 795ebd33-0874-4454-89b5-5b90aab56f06
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': '0c04644b-0ee2-43b8-adf1-8fa166df8625' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Dashboard</a>

#### Project Workspace Dashboard Link

- **ID**: d6269fcc-76d3-47ef-89a5-7229889ba09a
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': '0c04644b-0ee2-43b8-adf1-8fa166df8625' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Dashboard</a>

#### Team Members Dashboard Link

- **ID**: 0e8b1de4-3e2f-4d97-aab8-d3507d03ae3c
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': '0c04644b-0ee2-43b8-adf1-8fa166df8625' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Dashboard</a>

#### Time Tracker Dashboard Link

- **ID**: 71abe409-1eb8-4cc1-a133-4f369959d534
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': '0c04644b-0ee2-43b8-adf1-8fa166df8625' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Dashboard</a>

#### Invoices Dashboard Link

- **ID**: e63bd07d-da4c-4592-977d-70d4a283e523
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': '0c04644b-0ee2-43b8-adf1-8fa166df8625' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Dashboard</a>

#### Task Board Dashboard Link

- **ID**: 3e6f791e-9583-489d-9c88-3793f680cb8c
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': '0c04644b-0ee2-43b8-adf1-8fa166df8625' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Dashboard</a>

#### Terms of Service

- **ID**: 562abb41-d109-4d0c-86ff-ee0f939d8885
- **Type**: text

**Description:**
Sitepaige is not a licensed attorney and cannot write legal terms and conditions. Put your terms and conditions here.

#### Privacy Policy

- **ID**: a87470b4-c737-4740-b607-8e1a41751ce2
- **Type**: text

**Description:**
Sitepaige is not a licensed attorney and cannot write privacy policies. Put your privacy policy here.

### cta

#### Hero Content

- **ID**: 11af0e38-c1f4-4a95-9afc-251859d81d85
- **Type**: cta

**Description:**
{"headline":"Master Your Time, Amplify Your Productivity","subheader":"ChronoPulse transforms how teams track, analyze, and optimize work hours with intelligent, seamless time management","buttons":[{"buttonTitle":"Start Free Trial","page":"a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d"}],"headlineStyle":{"fontFamily":"Outfit","color":"#ffffff","fontSize":"text-5xl md:text-7xl lg:text-8xl","fontWeight":"800"},"subheaderStyle":{"fontFamily":"Inter","color":"#e5e5e5","fontSize":"text-xl md:text-2xl"},"buttonStyle":{"fontFamily":"Outfit","color":"#ffffff","backgroundColor":"#6366f1","rounded":"rounded-full"}}

### Code Sections

#### Customer Management

- **ID**: 0398345b-412c-43f7-85bf-11e1445b9f0c
- **Type**: component
- **Consumes APIs**:
  - GET /api/CustomersList (Auth Required)
  - GET /api/CustomersGet (Auth Required)
  - POST /api/CustomersCreate (Auth Required)
  - PUT /api/CustomersUpdate (Auth Required)
  - DELETE /api/CustomersDelete (Auth Required)
  - GET /api/CustomersByUser (Auth Required)

**Description:**
{"libraryComponent":"customers"}

#### Pricing Page

- **ID**: ac203ca4-b920-465c-85b0-ffbaf333fda3
- **Type**: component
- **Consumes APIs**:
  - POST /api/CreateSubscription (Auth Required)
  - GET /api/TiersList (Auth Required)

**Description:**
{"libraryComponent":"pricing_page"}

#### Subscription Management

- **ID**: 010bee53-6155-4c67-820c-1ea092eaff19
- **Type**: component

**Description:**
{"libraryComponent":"subscription_management"}

#### Subscription Tiers

- **ID**: f90d10e7-7b12-4baf-bcd8-0b9c82122b0c
- **Type**: component
- **Consumes APIs**:
  - POST /api/TiersCreate (Auth Required)
  - GET /api/TiersList (Auth Required)
  - GET /api/TiersGet (Auth Required)
  - PUT /api/TiersUpdate (Auth Required)
  - DELETE /api/TiersDelete (Auth Required)

**Description:**
{"libraryComponent":"tiers_management"}

#### Employee Directory

- **ID**: ae0da521-adf8-41ad-82e6-0492231847ea
- **Type**: component
- **Consumes APIs**:
  - GET /api/EmployeesList (Auth Required)
  - GET /api/EmployeesGet (Auth Required)
  - POST /api/EmployeesCreate (Auth Required)
  - PUT /api/EmployeesUpdate (Auth Required)
  - DELETE /api/EmployeesDelete (Auth Required)

**Description:**
{"libraryComponent":"employees_admin"}

#### Projects

- **ID**: a0c0a5f0-db28-43dc-9ad8-642eb9e820bc
- **Type**: component
- **Consumes APIs**:
  - GET /api/ProjectsList (Auth Required)
  - GET /api/ProjectsGet (Auth Required)
  - POST /api/ProjectsCreate (Auth Required)
  - PUT /api/ProjectsUpdate (Auth Required)
  - DELETE /api/ProjectsDelete (Auth Required)

**Description:**
{"libraryComponent":"project_list"}

#### Project Board

- **ID**: 117c1046-fd55-4c12-b9a6-ed032671dd78
- **Type**: component
- **Consumes APIs**:
  - GET /api/ProjectsGet (Auth Required)
  - PUT /api/ProjectsUpdate (Auth Required)
  - GET /api/TasksList (Auth Required)
  - GET /api/TasksGet (Auth Required)
  - POST /api/TasksCreate (Auth Required)
  - PUT /api/TasksUpdate (Auth Required)
  - DELETE /api/TasksDelete (Auth Required)
  - GET /api/TaskCommentsList (Auth Required)
  - POST /api/TaskCommentsCreate (Auth Required)
  - GET /api/ProjectMembersList (Auth Required)

**Description:**
{"libraryComponent":"project_detail"}

#### Project Members

- **ID**: 11a18352-c3c4-4370-885c-963c3a52f437
- **Type**: component
- **Consumes APIs**:
  - GET /api/ProjectMembersList (Auth Required)
  - POST /api/ProjectMembersAdd (Auth Required)
  - DELETE /api/ProjectMembersRemove (Auth Required)

**Description:**
{"libraryComponent":"project_member"}

#### Time Tracking

- **ID**: 0aa1765a-aeea-449b-a462-3e7cb5f37190
- **Type**: component
- **Consumes APIs**:
  - GET /api/TimeEntriesList (Auth Required)
  - POST /api/TimeEntriesCreate (Auth Required)
  - PUT /api/TimeEntriesUpdate (Auth Required)
  - DELETE /api/TimeEntriesDelete (Auth Required)
  - GET /api/TimeEntriesSummary (Auth Required)

**Description:**
{"libraryComponent":"time_tracking"}

#### Invoice Management

- **ID**: 083a8591-cfd0-4859-823b-86a9c487fc84
- **Type**: component
- **Consumes APIs**:
  - GET /api/InvoicesList (Auth Required)
  - GET /api/InvoicesGet (Auth Required)
  - POST /api/InvoicesCreate (Auth Required)
  - PUT /api/InvoicesUpdate (Auth Required)
  - DELETE /api/InvoicesDelete (Auth Required)
  - POST /api/InvoicesFromTimeEntries (Auth Required)
  - GET /api/InvoicesSummary (Auth Required)

**Description:**
{"libraryComponent":"invoices_admin"}

#### Dashboard Analytics

- **ID**: 7d15ebbe-5036-45ca-8602-1d550fc6497c
- **Type**: component
- **Consumes APIs**:
  - POST /api/CustomersCreate (Auth Required)
  - GET /api/CustomersByUser (Auth Required)
  - GET /api/TiersList (Auth Required)
  - POST /api/CreateSubscription (Auth Required)
  - GET /api/TiersGet (Auth Required)
  - GET /api/SubscriptionsList (Auth Required)
  - GET /api/SaaSOrdersList (Auth Required)
  - GET /api/EmployeesList (Auth Required)
  - GET /api/EmployeesGet (Auth Required)
  - PUT /api/EmployeesUpdate (Auth Required)
  - GET /api/ProjectsList (Auth Required)
  - GET /api/ProjectsGet (Auth Required)
  - POST /api/ProjectsCreate (Auth Required)
  - PUT /api/ProjectsUpdate (Auth Required)
  - DELETE /api/ProjectsDelete (Auth Required)
  - GET /api/TasksList (Auth Required)
  - GET /api/TasksGet (Auth Required)
  - POST /api/TasksCreate (Auth Required)
  - PUT /api/TasksUpdate (Auth Required)
  - DELETE /api/TasksDelete (Auth Required)
  - GET /api/TaskCommentsList (Auth Required)
  - POST /api/TaskCommentsCreate (Auth Required)
  - GET /api/ProjectMembersList (Auth Required)
  - POST /api/ProjectMembersAdd (Auth Required)
  - DELETE /api/ProjectMembersRemove (Auth Required)
  - GET /api/TimeEntriesList (Auth Required)
  - POST /api/TimeEntriesCreate (Auth Required)
  - PUT /api/TimeEntriesUpdate (Auth Required)
  - DELETE /api/TimeEntriesDelete (Auth Required)
  - GET /api/TimeEntriesSummary (Auth Required)
  - GET /api/InvoicesList (Auth Required)
  - GET /api/InvoicesGet (Auth Required)
  - POST /api/InvoicesCreate (Auth Required)
  - PUT /api/InvoicesUpdate (Auth Required)
  - DELETE /api/InvoicesDelete (Auth Required)
  - POST /api/InvoicesFromTimeEntries (Auth Required)
  - GET /api/InvoicesSummary (Auth Required)

#### Admin Dashboard Analytics

- **ID**: 87ee1554-58c4-400a-a595-bfdffd10a5ea
- **Type**: component
- **Consumes APIs**:
  - GET /api/CustomersList (Auth Required)
  - GET /api/CustomersGet (Auth Required)
  - POST /api/CustomersCreate (Auth Required)
  - PUT /api/CustomersUpdate (Auth Required)
  - DELETE /api/CustomersDelete (Auth Required)
  - GET /api/CustomersByUser (Auth Required)
  - GET /api/TiersList (Auth Required)
  - POST /api/CreateSubscription (Auth Required)
  - GET /api/TiersGet (Auth Required)
  - GET /api/SubscriptionsList (Auth Required)
  - GET /api/SaaSOrdersList (Auth Required)
  - POST /api/TiersCreate (Auth Required)
  - PUT /api/TiersUpdate (Auth Required)
  - DELETE /api/TiersDelete (Auth Required)
  - GET /api/EmployeesList (Auth Required)
  - GET /api/EmployeesGet (Auth Required)
  - POST /api/EmployeesCreate (Auth Required)
  - PUT /api/EmployeesUpdate (Auth Required)
  - DELETE /api/EmployeesDelete (Auth Required)
  - GET /api/ProjectsList (Auth Required)
  - GET /api/ProjectsGet (Auth Required)
  - POST /api/ProjectsCreate (Auth Required)
  - PUT /api/ProjectsUpdate (Auth Required)
  - DELETE /api/ProjectsDelete (Auth Required)
  - GET /api/TasksList (Auth Required)
  - GET /api/TasksGet (Auth Required)
  - POST /api/TasksCreate (Auth Required)
  - PUT /api/TasksUpdate (Auth Required)
  - DELETE /api/TasksDelete (Auth Required)
  - GET /api/TaskCommentsList (Auth Required)
  - POST /api/TaskCommentsCreate (Auth Required)
  - GET /api/ProjectMembersList (Auth Required)
  - POST /api/ProjectMembersAdd (Auth Required)
  - DELETE /api/ProjectMembersRemove (Auth Required)
  - GET /api/TimeEntriesList (Auth Required)
  - POST /api/TimeEntriesCreate (Auth Required)
  - PUT /api/TimeEntriesUpdate (Auth Required)
  - DELETE /api/TimeEntriesDelete (Auth Required)
  - GET /api/TimeEntriesSummary (Auth Required)
  - GET /api/InvoicesList (Auth Required)
  - GET /api/InvoicesGet (Auth Required)
  - POST /api/InvoicesCreate (Auth Required)
  - PUT /api/InvoicesUpdate (Auth Required)
  - DELETE /api/InvoicesDelete (Auth Required)
  - POST /api/InvoicesFromTimeEntries (Auth Required)
  - GET /api/InvoicesSummary (Auth Required)

#### Tasks Manager

- **ID**: e18237ce-5af7-4adf-8f6b-8e80ebd5b2cd
- **Type**: component
- **Consumes APIs**:
  - GET /api/TasksList (Auth Required)
  - GET /api/TasksGet (Auth Required)
  - POST /api/TasksCreate (Auth Required)
  - PUT /api/TasksUpdate (Auth Required)
  - DELETE /api/TasksDelete (Auth Required)
  - GET /api/TaskCommentsList (Auth Required)
  - POST /api/TaskCommentsCreate (Auth Required)

### User Admin

#### UserAdminView

- **ID**: e73bdad5-5662-4c0a-a875-a15846389e73
- **Type**: useradmin

### Login Components

#### LoginView

- **ID**: 42822d86-a52f-48ce-8528-13ccb1613dd9
- **Type**: login

## Data Flow

### API to View Mapping

- **GET /api/CustomersList** is used by:
  - Customer Management
  - Admin Dashboard Analytics

- **GET /api/CustomersGet** is used by:
  - Customer Management
  - Admin Dashboard Analytics

- **POST /api/CustomersCreate** is used by:
  - Customer Management
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **PUT /api/CustomersUpdate** is used by:
  - Customer Management
  - Admin Dashboard Analytics

- **DELETE /api/CustomersDelete** is used by:
  - Customer Management
  - Admin Dashboard Analytics

- **GET /api/CustomersByUser** is used by:
  - Customer Management
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/TiersList** is used by:
  - Pricing Page
  - Subscription Tiers
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/CreateSubscription** is used by:
  - Pricing Page
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/TiersGet** is used by:
  - Subscription Tiers
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/SubscriptionsList** is used by:
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/SaaSOrdersList** is used by:
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/TiersCreate** is used by:
  - Subscription Tiers
  - Admin Dashboard Analytics

- **PUT /api/TiersUpdate** is used by:
  - Subscription Tiers
  - Admin Dashboard Analytics

- **DELETE /api/TiersDelete** is used by:
  - Subscription Tiers
  - Admin Dashboard Analytics

- **GET /api/EmployeesList** is used by:
  - Employee Directory
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/EmployeesGet** is used by:
  - Employee Directory
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/EmployeesCreate** is used by:
  - Employee Directory
  - Admin Dashboard Analytics

- **PUT /api/EmployeesUpdate** is used by:
  - Employee Directory
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **DELETE /api/EmployeesDelete** is used by:
  - Employee Directory
  - Admin Dashboard Analytics

- **GET /api/ProjectsList** is used by:
  - Projects
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/ProjectsGet** is used by:
  - Projects
  - Project Board
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/ProjectsCreate** is used by:
  - Projects
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **PUT /api/ProjectsUpdate** is used by:
  - Projects
  - Project Board
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **DELETE /api/ProjectsDelete** is used by:
  - Projects
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/TasksList** is used by:
  - Project Board
  - Dashboard Analytics
  - Admin Dashboard Analytics
  - Tasks Manager

- **GET /api/TasksGet** is used by:
  - Project Board
  - Dashboard Analytics
  - Admin Dashboard Analytics
  - Tasks Manager

- **POST /api/TasksCreate** is used by:
  - Project Board
  - Dashboard Analytics
  - Admin Dashboard Analytics
  - Tasks Manager

- **PUT /api/TasksUpdate** is used by:
  - Project Board
  - Dashboard Analytics
  - Admin Dashboard Analytics
  - Tasks Manager

- **DELETE /api/TasksDelete** is used by:
  - Project Board
  - Dashboard Analytics
  - Admin Dashboard Analytics
  - Tasks Manager

- **GET /api/TaskCommentsList** is used by:
  - Project Board
  - Dashboard Analytics
  - Admin Dashboard Analytics
  - Tasks Manager

- **POST /api/TaskCommentsCreate** is used by:
  - Project Board
  - Dashboard Analytics
  - Admin Dashboard Analytics
  - Tasks Manager

- **GET /api/ProjectMembersList** is used by:
  - Project Board
  - Project Members
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/ProjectMembersAdd** is used by:
  - Project Members
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **DELETE /api/ProjectMembersRemove** is used by:
  - Project Members
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/TimeEntriesList** is used by:
  - Time Tracking
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/TimeEntriesCreate** is used by:
  - Time Tracking
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **PUT /api/TimeEntriesUpdate** is used by:
  - Time Tracking
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **DELETE /api/TimeEntriesDelete** is used by:
  - Time Tracking
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/TimeEntriesSummary** is used by:
  - Time Tracking
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/InvoicesList** is used by:
  - Invoice Management
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/InvoicesGet** is used by:
  - Invoice Management
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/InvoicesCreate** is used by:
  - Invoice Management
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **PUT /api/InvoicesUpdate** is used by:
  - Invoice Management
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **DELETE /api/InvoicesDelete** is used by:
  - Invoice Management
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/InvoicesFromTimeEntries** is used by:
  - Invoice Management
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/InvoicesSummary** is used by:
  - Invoice Management
  - Dashboard Analytics
  - Admin Dashboard Analytics

### Pages

| Page Name | Access Level | User Tier | Description |
|-----------|--------------|-----------|-------------|
| Home (Home) | public | all | Homepage |
| Pricing Plans | everyone | free | Pricing page showing subscription tiers and plans |
| My Subscription | registereduser | free | Subscription management page with link to Stripe billing portal |
| Manage Tiers | admin | free | Admin interface for managing subscription tiers and pricing |
| Customer Management | admin | free | Admin page for managing customer profiles and information |
| Team Directory | admin | free | Admin page for managing employee directory |
| My Projects | registereduser | free | List of all projects the user has access to |
| Project Workspace | registereduser | free | Project detail view with kanban task board |
| Team Members | registereduser | free | Component for managing project team members |
| Time Tracker | registereduser | free | Time tracking interface with timer and entry management |
| Invoices | registereduser | free | Invoice management interface for creating and tracking invoices |
| Task Board | registereduser | all | Manage and organize your tasks |
| About TimeFlow | everyone | all | Learn more about our time tracking solution |
| FAQ | everyone | all | Frequently asked questions about TimeFlow |
| Dashboard | registereduser | all | User dashboard page |
| Admin Dashboard | admin | all | Admin dashboard page |
| Login | everyone | all | User login page |
| Terms of Service | everyone | all | Legal terms and conditions for using the application |
| Privacy Policy | everyone | all | Details about how user data is collected and handled |

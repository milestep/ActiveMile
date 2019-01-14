# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20190102122747) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string   "accountable_type"
    t.integer  "accountable_id"
    t.string   "provider"
    t.string   "uid"
    t.string   "token"
    t.string   "email"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["accountable_type", "accountable_id"], name: "index_accounts_on_accountable_type_and_accountable_id", using: :btree
    t.index ["uid"], name: "index_accounts_on_uid", using: :btree
  end

  create_table "active_admin_comments", force: :cascade do |t|
    t.string   "namespace"
    t.text     "body"
    t.string   "resource_id",   null: false
    t.string   "resource_type", null: false
    t.string   "author_type"
    t.integer  "author_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree
  end

  create_table "admin_users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true, using: :btree
  end

  create_table "agencies", force: :cascade do |t|
    t.string   "email"
    t.string   "password_digest"
    t.string   "token"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "agency_name"
    t.string   "address"
    t.string   "title"
    t.string   "website"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "github_token"
    t.string   "github_username"
  end

  create_table "analytics", force: :cascade do |t|
    t.string   "title"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.jsonb    "analyzed_files"
  end

  create_table "articles", force: :cascade do |t|
    t.string   "title"
    t.string   "type"
    t.integer  "workspace_id"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.integer  "registers_count", default: 0
    t.index ["workspace_id"], name: "index_articles_on_workspace_id", using: :btree
  end

  create_table "avatars", force: :cascade do |t|
    t.integer  "profile_id"
    t.string   "picture"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["profile_id"], name: "index_avatars_on_profile_id", using: :btree
  end

  create_table "counterparties", force: :cascade do |t|
    t.string   "name"
    t.date     "date"
    t.string   "type"
    t.integer  "workspace_id"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.boolean  "active",          default: true
    t.integer  "registers_count", default: 0
    t.integer  "salary",          default: 0
    t.index ["workspace_id"], name: "index_counterparties_on_workspace_id", using: :btree
  end

  create_table "customers", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "password_digest"
    t.string   "token"
    t.string   "company_name"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.boolean  "email_confirmed", default: false
    t.string   "github_token"
    t.string   "github_username"
  end

  create_table "developers", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "password_digest"
    t.string   "token"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "agency_id"
    t.string   "github_token"
    t.string   "github_username"
    t.index ["agency_id"], name: "index_developers_on_agency_id", using: :btree
  end

  create_table "educations", force: :cascade do |t|
    t.string   "institution"
    t.string   "location"
    t.string   "technologies", default: [],              array: true
    t.string   "degree"
    t.date     "start_year"
    t.date     "end_year"
    t.integer  "profile_id"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["profile_id"], name: "index_educations_on_profile_id", using: :btree
  end

  create_table "engagements", force: :cascade do |t|
    t.integer  "job_id"
    t.integer  "developer_id"
    t.integer  "customer_id"
    t.integer  "state",        default: 0
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.index ["customer_id"], name: "index_engagements_on_customer_id", using: :btree
    t.index ["developer_id"], name: "index_engagements_on_developer_id", using: :btree
    t.index ["job_id"], name: "index_engagements_on_job_id", using: :btree
  end

  create_table "experiences", force: :cascade do |t|
    t.string   "company"
    t.string   "position"
    t.string   "technologies", default: [],              array: true
    t.date     "start_year"
    t.date     "end_year"
    t.integer  "profile_id"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["profile_id"], name: "index_experiences_on_profile_id", using: :btree
  end

  create_table "favorites", force: :cascade do |t|
    t.string   "resource_type"
    t.integer  "resource_id"
    t.string   "owner_type"
    t.integer  "owner_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["owner_type", "owner_id"], name: "index_favorites_on_owner_type_and_owner_id", using: :btree
    t.index ["resource_type", "resource_id"], name: "index_favorites_on_resource_type_and_resource_id", using: :btree
  end

  create_table "features", force: :cascade do |t|
    t.boolean "sales",        default: false, null: false
    t.integer "workspace_id",                 null: false
  end

  create_table "holidays", force: :cascade do |t|
    t.string   "name"
    t.date     "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "inventory_items", force: :cascade do |t|
    t.string   "name"
    t.date     "date"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "workspace_id",    null: false
    t.integer  "counterparty_id"
  end

  create_table "jobs", force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.string   "estimated_length"
    t.text     "commitment"
    t.date     "desired_start_date"
    t.string   "language"
    t.string   "timezone"
    t.text     "programming_languages",                         default: [],              array: true
    t.text     "skills",                                        default: [],              array: true
    t.integer  "customer_id"
    t.datetime "created_at",                                                 null: false
    t.datetime "updated_at",                                                 null: false
    t.decimal  "fixed_price",           precision: 8, scale: 2
    t.datetime "deleted_at"
    t.index ["customer_id"], name: "index_jobs_on_customer_id", using: :btree
    t.index ["deleted_at"], name: "index_jobs_on_deleted_at", using: :btree
  end

  create_table "neuros", force: :cascade do |t|
    t.float    "accuracy"
    t.integer  "repo_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "oauth_access_grants", force: :cascade do |t|
    t.integer  "resource_owner_id", null: false
    t.integer  "application_id",    null: false
    t.string   "token",             null: false
    t.integer  "expires_in",        null: false
    t.text     "redirect_uri",      null: false
    t.datetime "created_at",        null: false
    t.datetime "revoked_at"
    t.string   "scopes"
    t.index ["token"], name: "index_oauth_access_grants_on_token", unique: true, using: :btree
  end

  create_table "oauth_access_tokens", force: :cascade do |t|
    t.integer  "resource_owner_id"
    t.integer  "application_id"
    t.string   "token",                               null: false
    t.string   "refresh_token"
    t.integer  "expires_in"
    t.datetime "revoked_at"
    t.datetime "created_at",                          null: false
    t.string   "scopes"
    t.string   "previous_refresh_token", default: "", null: false
    t.index ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true, using: :btree
    t.index ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id", using: :btree
    t.index ["token"], name: "index_oauth_access_tokens_on_token", unique: true, using: :btree
  end

  create_table "oauth_applications", force: :cascade do |t|
    t.string   "name",                      null: false
    t.string   "uid",                       null: false
    t.string   "secret",                    null: false
    t.text     "redirect_uri",              null: false
    t.string   "scopes",       default: "", null: false
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["uid"], name: "index_oauth_applications_on_uid", unique: true, using: :btree
  end

  create_table "offers", force: :cascade do |t|
    t.integer  "developer_id"
    t.integer  "job_id"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.integer  "state",        default: 0
    t.index ["developer_id"], name: "index_offers_on_developer_id", using: :btree
    t.index ["job_id"], name: "index_offers_on_job_id", using: :btree
  end

  create_table "profiles", force: :cascade do |t|
    t.text     "about"
    t.string   "country"
    t.string   "city"
    t.string   "timezone"
    t.text     "languages",              default: [],              array: true
    t.string   "phonenumber"
    t.string   "skype"
    t.string   "github_username"
    t.text     "preferred_environments", default: [],              array: true
    t.text     "payment_methods",        default: [],              array: true
    t.text     "programming_languages",  default: [],              array: true
    t.text     "frameworks",             default: [],              array: true
    t.text     "tools",                  default: [],              array: true
    t.integer  "developer_id"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.integer  "customer_id"
    t.index ["developer_id"], name: "index_profiles_on_developer_id", using: :btree
  end

  create_table "registers", force: :cascade do |t|
    t.date     "date"
    t.float    "value"
    t.text     "note"
    t.integer  "workspace_id"
    t.integer  "article_id"
    t.integer  "counterparty_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.integer  "client_id"
    t.integer  "sales_manager_id"
    t.index ["article_id"], name: "index_registers_on_article_id", using: :btree
    t.index ["counterparty_id"], name: "index_registers_on_counterparty_id", using: :btree
    t.index ["workspace_id"], name: "index_registers_on_workspace_id", using: :btree
  end

  create_table "repos", force: :cascade do |t|
    t.integer  "customer_id"
    t.string   "name"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "staffs", force: :cascade do |t|
    t.string   "email"
    t.string   "password_digest"
    t.string   "token"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "password_digest"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
  end

  create_table "workspaces", force: :cascade do |t|
    t.string   "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "articles", "workspaces"
  add_foreign_key "avatars", "profiles"
  add_foreign_key "counterparties", "workspaces"
  add_foreign_key "oauth_access_grants", "oauth_applications", column: "application_id"
  add_foreign_key "oauth_access_tokens", "oauth_applications", column: "application_id"
  add_foreign_key "offers", "developers"
  add_foreign_key "offers", "jobs"
  add_foreign_key "registers", "articles"
  add_foreign_key "registers", "counterparties"
  add_foreign_key "registers", "workspaces"
end

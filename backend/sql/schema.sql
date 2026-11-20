-- =====================================================================
--  MolaPlus — MySQL schema (Bluehost / PHP backend)
--  Mirrors the former Supabase/Postgres data model used by the site.
--
--  Import on Bluehost:
--    1. cPanel  ->  MySQL Databases  ->  create a database + user, grant ALL.
--    2. cPanel  ->  phpMyAdmin  ->  select the database  ->  Import  ->  this file.
--       (or:  mysql -u USER -p DBNAME < schema.sql )
--
--  Charset: utf8mb4 everywhere so names/comments in any language are safe.
-- =====================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ---------------------------------------------------------------------
--  Orders placed through /order  (was: SMS-only, now persisted + SMS)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  reference     VARCHAR(20)     NOT NULL,
  customer_name VARCHAR(80)     NOT NULL,
  phone         VARCHAR(20)     NOT NULL,
  county        VARCHAR(80)     NOT NULL,
  town          VARCHAR(80)     NOT NULL,
  address       VARCHAR(220)    NOT NULL,
  coordinates   VARCHAR(60)     NULL,
  notes         VARCHAR(220)    NULL,
  items         JSON            NOT NULL,          -- [{name, quantity}, ...]
  status        ENUM('new','contacted','fulfilled','cancelled') NOT NULL DEFAULT 'new',
  sms_sent      TINYINT(1)      NOT NULL DEFAULT 0,
  ip            VARCHAR(45)     NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_reference (reference),
  KEY idx_orders_created (created_at),
  KEY idx_orders_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Simple IP rate limiting for order submissions (sliding 15-min window).
CREATE TABLE IF NOT EXISTS order_rate_limit (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ip          VARCHAR(45)     NOT NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_rate_ip_time (ip, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  Blog posts (Studio CMS).  `record` holds the full post JSON exactly as
--  the frontend expects (slug, title, category, sections, etc.).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id           CHAR(36)     NOT NULL,              -- uuid
  slug         VARCHAR(200) NULL,
  record       JSON         NOT NULL,              -- published Post object
  revision     INT          NOT NULL DEFAULT 1,
  archived     TINYINT(1)   NOT NULL DEFAULT 0,
  published    TINYINT(1)   NOT NULL DEFAULT 0,
  published_at VARCHAR(40)  NULL,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blog_posts_slug (slug),
  KEY idx_blog_posts_public (published, archived, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Edit history for posts (used by Studio admin).
CREATE TABLE IF NOT EXISTS blog_revisions (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id    CHAR(36)     NOT NULL,
  content    JSON         NOT NULL,
  action     VARCHAR(40)  NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_blog_revisions_post (post_id, id),
  CONSTRAINT fk_blog_revisions_post FOREIGN KEY (post_id)
    REFERENCES blog_posts (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  Public article engagement
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_post_views (
  slug       VARCHAR(200) NOT NULL,
  views      BIGINT       NOT NULL DEFAULT 0,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (slug),
  KEY idx_blog_views_count (views)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_post_reactions (
  slug        VARCHAR(200) NOT NULL,
  visitor_key VARCHAR(128) NOT NULL,
  reaction    ENUM('helpful','not_helpful') NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (slug, visitor_key),
  KEY idx_blog_reactions_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_post_comments (
  id          CHAR(36)     NOT NULL,
  slug        VARCHAR(200) NOT NULL,
  author_name VARCHAR(80)  NOT NULL,
  body        VARCHAR(2000) NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_blog_comments_slug (slug, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
--  Studio admin accounts (replaces Supabase Auth + blog_editors).
--  Create the first editor with backend/sql/create-admin.php
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_editors (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email         VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,            -- password_hash(), bcrypt
  display_name  VARCHAR(120) NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blog_editors_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Server-side sessions for the Studio admin (cookie -> row).
CREATE TABLE IF NOT EXISTS admin_sessions (
  token      CHAR(64)     NOT NULL,               -- random, stored hashed server-side
  editor_id  BIGINT UNSIGNED NOT NULL,
  expires_at TIMESTAMP    NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (token),
  KEY idx_admin_sessions_editor (editor_id),
  CONSTRAINT fk_admin_sessions_editor FOREIGN KEY (editor_id)
    REFERENCES blog_editors (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- This script was generated by a beta version of the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;

CREATE TABLE IF NOT EXISTS public.users (
    id serial NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    created_at timestamp without time zone DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.urls (
    id serial NOT NULL,
    url text NOT NULL,
    short_url text NOT NULL,
    created_at time without time zone NOT NULL DEFAULT NOW(),
    user_id integer,
    visits integer NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE (short_url)
);

ALTER TABLE
    IF EXISTS public.urls
ADD
    FOREIGN KEY (user_id) REFERENCES public.users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

END;
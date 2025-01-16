--
-- PostgreSQL database dump
--

-- Dumped from database version 17rc1
-- Dumped by pg_dump version 17rc1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: habit_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habit_progress (
    id integer NOT NULL,
    habit_id integer NOT NULL,
    completion_date date NOT NULL,
    completion_count integer DEFAULT 1,
    current_streak integer DEFAULT 0,
    longest_streak integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    complete boolean DEFAULT false
);


ALTER TABLE public.habit_progress OWNER TO postgres;

--
-- Name: habit_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habit_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.habit_progress_id_seq OWNER TO postgres;

--
-- Name: habit_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habit_progress_id_seq OWNED BY public.habit_progress.id;


--
-- Name: habits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habits (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    frequency integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    experience_points integer DEFAULT 0,
    level integer DEFAULT 1
);


ALTER TABLE public.habits OWNER TO postgres;

--
-- Name: habits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.habits_id_seq OWNER TO postgres;

--
-- Name: habits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habits_id_seq OWNED BY public.habits.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: habit_progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habit_progress ALTER COLUMN id SET DEFAULT nextval('public.habit_progress_id_seq'::regclass);


--
-- Name: habits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habits ALTER COLUMN id SET DEFAULT nextval('public.habits_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: habit_progress habit_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habit_progress
    ADD CONSTRAINT habit_progress_pkey PRIMARY KEY (id);


--
-- Name: habits habits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habits
    ADD CONSTRAINT habits_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_completion_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_completion_date ON public.habit_progress USING btree (completion_date);


--
-- Name: idx_habit_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_habit_id ON public.habit_progress USING btree (habit_id);


--
-- Name: habit_progress habit_progress_habit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habit_progress
    ADD CONSTRAINT habit_progress_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


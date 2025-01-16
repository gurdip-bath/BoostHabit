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

--
-- Data for Name: habits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.habits (id, name, description, frequency, created_at, updated_at, experience_points, level) FROM stdin;
1	testing_habit	testing_description	7	2024-12-11 20:09:23.829654	2024-12-11 20:09:23.829654	5	1
\.


--
-- Data for Name: habit_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.habit_progress (id, habit_id, completion_date, completion_count, current_streak, longest_streak, created_at, updated_at, complete) FROM stdin;
2	1	2024-12-11	1	1	1	2024-12-11 20:24:10.400081	2024-12-11 20:24:10.400081	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password) FROM stdin;
1	testuser@example.com	password123
\.


--
-- Name: habit_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.habit_progress_id_seq', 2, true);


--
-- Name: habits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.habits_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--


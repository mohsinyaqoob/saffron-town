--
-- PostgreSQL database dump
--

\restrict 9r8scGfPN5C9xqtGcx4UEtaR8JmefJ095497b4zV1UWv5e5BVuC3ZJ7Wlt1eL5q

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.10 (Debian 17.10-1.pgdg13+1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: prisma_postgres; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS prisma_postgres WITH SCHEMA public;


--
-- Name: EXTENSION prisma_postgres; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION prisma_postgres IS 'prisma_postgres';


--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'PAID',
    'OVERDUE',
    'CANCELLED'
);


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PAID',
    'FAILED'
);


--
-- Name: ServiceabilityStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ServiceabilityStatus" AS ENUM (
    'SERVICEABLE',
    'NOT_SERVICEABLE',
    'UNKNOWN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BulkEnquiry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BulkEnquiry" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    name character varying(120) NOT NULL,
    phone character varying(22) NOT NULL,
    email character varying(254),
    organization character varying(200),
    "businessType" character varying(80),
    "approxGrams" character varying(80),
    message text,
    "clientIp" character varying(45),
    "emailNotifiedAt" timestamp(3) without time zone
);


--
-- Name: Customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Customer" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    name character varying(120) NOT NULL,
    email character varying(254),
    phone character varying(22),
    "companyName" character varying(160),
    "taxId" character varying(80),
    "billingAddress" text,
    city character varying(100),
    state character varying(100),
    "postalCode" character varying(30),
    country character varying(100),
    notes text,
    "deletedAt" timestamp(3) without time zone
);


--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "invoiceNumber" character varying(64) NOT NULL,
    status public."InvoiceStatus" DEFAULT 'DRAFT'::public."InvoiceStatus" NOT NULL,
    "issueDate" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone,
    currency character varying(8) DEFAULT 'INR'::character varying NOT NULL,
    "customerId" text NOT NULL,
    "customerName" character varying(120) NOT NULL,
    "customerEmail" character varying(254),
    "customerPhone" character varying(22),
    "customerCompanyName" character varying(160),
    "billingAddress" text,
    "billingCity" character varying(100),
    "billingState" character varying(100),
    "billingPostalCode" character varying(30),
    "billingCountry" character varying(100),
    "subtotalPaise" integer NOT NULL,
    "taxTotalPaise" integer DEFAULT 0 NOT NULL,
    "discountTotalPaise" integer DEFAULT 0 NOT NULL,
    "totalPaise" integer NOT NULL,
    notes text,
    "paymentTerms" text
);


--
-- Name: InvoiceLineItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."InvoiceLineItem" (
    id text NOT NULL,
    "invoiceId" text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    description character varying(300) NOT NULL,
    quantity integer NOT NULL,
    "unitPricePaise" integer NOT NULL,
    "taxRatePercent" integer DEFAULT 0 NOT NULL,
    "discountPaise" integer DEFAULT 0 NOT NULL,
    "lineSubtotalPaise" integer NOT NULL,
    "lineTaxPaise" integer DEFAULT 0 NOT NULL,
    "lineTotalPaise" integer NOT NULL
);


--
-- Name: Order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    "subtotalRupees" integer NOT NULL,
    "customerName" text NOT NULL,
    phone text NOT NULL,
    "cityPin" text,
    notes text,
    email text NOT NULL,
    pincode text NOT NULL,
    "heardAboutUs" text,
    "deliveryAddress" text,
    "paymentMethod" text DEFAULT 'ONLINE'::text NOT NULL,
    "razorpayOrderId" text,
    "razorpayPaymentId" text,
    source text
);


--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    "productName" text NOT NULL,
    "variantId" text NOT NULL,
    "variantLabel" text NOT NULL,
    quantity integer NOT NULL,
    "unitPriceRupees" integer NOT NULL,
    "lineTotalRupees" integer NOT NULL
);


--
-- Name: PincodeServiceability; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PincodeServiceability" (
    id text NOT NULL,
    "partnerCode" character varying(60) NOT NULL,
    pincode character varying(12) NOT NULL,
    status public."ServiceabilityStatus" NOT NULL,
    detail jsonb,
    "checkedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: BulkEnquiry; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BulkEnquiry" (id, "createdAt", "updatedAt", name, phone, email, organization, "businessType", "approxGrams", message, "clientIp", "emailNotifiedAt") FROM stdin;
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Customer" (id, "createdAt", "updatedAt", name, email, phone, "companyName", "taxId", "billingAddress", city, state, "postalCode", country, notes, "deletedAt") FROM stdin;
cmpwrg6qm0000vvvi4c5n4lis	2026-06-02 14:56:31.006	2026-06-02 15:16:18.698	Sukruti Engineering Services LLP	\N	‪+91 99009 17718‬	Sukruti Engineering Services LLP	29ADUFS8980Q1ZE	Ramakrishna Road, Sumedha\nNear Sujatha Kalyana Mantapa\nM V Extension, Hosakote\nBengaluru Rural	Hosakote	Karnataka	\N	India	\N	\N
cmqb7ri7c00030kvi4gvbjw5b	2026-06-12 17:41:59.401	2026-06-13 03:20:06.751	Mohsin	hi@mo.com	9055404321	\N	\N	Hello world	\N	\N	190002	\N	\N	2026-06-13 03:20:06.749
cmr10c5mt000004l7bbvwu18a	2026-06-30 18:56:06.533	2026-06-30 18:56:06.533	Santosh Kumar Kanakam	santhosh.kanakam@gmail.com	9665713929	\N	\N	Quarter Type 7, Building 6/2, Koradi TPS Colony, Mahadula, Koradi	\N	\N	441111	\N	\N	\N
cmrbqebp20000f2vipmcrghak	2026-07-08 07:03:19.479	2026-07-09 12:33:33.87	Test User	test@example.com	9876543210	\N	\N	123 Test Street, Test Nagar, New Delhi	\N	\N	110001	\N	\N	2026-07-09 12:33:33.589
cmrds70ha000004l7vnnxjtjc	2026-07-09 17:29:09.934	2026-07-09 17:30:48.181	ALDOTILAK CHATTARNAS VIJAY	tilak08@gmail.com	8861035488	\N	\N	G-09 Kristal Quartz 2, Kristal Campus 10, Near Spandana Hospital, Sarjapur	\N	\N	562125	\N	\N	\N
cmri32e6m000004k0sv4zwzww	2026-07-12 17:44:34.894	2026-07-12 17:44:34.894	Jawahar	jawahar.rossi46@gmail.com	9566321015	\N	\N	A103, shambhavi apartments, nellikuppam road, Guduvanchery, chennai	\N	\N	603202	\N	\N	\N
cmrjlhbe0000004lbolzf6v0g	2026-07-13 19:07:50.376	2026-07-13 19:07:50.376	Joseph Sebastian	nikhilbond004@gmail.com	9074897720	\N	\N	Mesthiriparambil house\nUpputhara PO Upputhara\nIdukki, kerala\n685505	\N	\N	685505	\N	\N	\N
cmrm11mpe000004jjw2pqif7y	2026-07-15 11:59:04.754	2026-07-15 11:59:04.754	Deshmane pooja	sudrukpooja@gmail.com	9699624051	\N	\N	Maitree mega city, mahadev nagar raykarmala, dhayri	\N	\N	411041	\N	\N	\N
cmrm8nr7r000004jzm7dyrnhj	2026-07-15 15:32:14.344	2026-07-15 15:32:14.344	Dr. Zahid Kuchay	kuchay.zahid@gmail.com	+917006108618	\N	\N	Humhama, Srinagar	\N	\N	897987	\N	\N	\N
cmrmakxbo000004juq2lbxlp6	2026-07-15 16:26:01.524	2026-07-15 16:26:01.524	Dr. R. Balamurugan	rbalaudt@gmail.com	8610427997	\N	\N	30/72, 3rd Street, \nSNR Nagar,\nNear Union Office,\nUdumalpet,\nTirupur District	\N	\N	642126	\N	\N	\N
cmqb7q78c00000kvi0u4r4zdf	2026-06-12 17:40:58.524	2026-07-24 10:07:55.856	Mohsin Yaqoob	hi@mohsinyaqoob.com	9055404321	\N	\N	Zadi Masjid, Safakadal	\N	\N	190002	\N	\N	2026-06-13 03:20:04.286
cms0mcg5p000004jl1y4e9zrj	2026-07-25 17:04:07.885	2026-07-25 17:04:07.885	Nilesh kumar	neelzalindra@gmail.com	6378388824	\N	\N	Godara ki dhani,Nawalgarh	\N	\N	333042	\N	\N	\N
cms2agfrl000004ld5gnripg1	2026-07-26 21:06:50.961	2026-07-26 21:06:50.961	Swapnil Deopa	deopaswapnil1009@gmail.com	8476949488	\N	\N	Shree Jee Traders, Cement Road. Ward no.8 Tanakpur, Champawat (uttarakhand )	\N	\N	262309	\N	\N	\N
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Invoice" (id, "createdAt", "updatedAt", "invoiceNumber", status, "issueDate", "dueDate", currency, "customerId", "customerName", "customerEmail", "customerPhone", "customerCompanyName", "billingAddress", "billingCity", "billingState", "billingPostalCode", "billingCountry", "subtotalPaise", "taxTotalPaise", "discountTotalPaise", "totalPaise", notes, "paymentTerms") FROM stdin;
cmpwrngpf0001vvviqyc9tc2w	2026-06-02 15:02:10.515	2026-06-02 15:34:54.461	INV-2026-060201	PAID	2026-06-02 00:00:00	2026-06-02 00:00:00	INR	cmpwrg6qm0000vvvi4c5n4lis	Sukruti Engineering Services LLP	\N	‪+91 99009 17718‬	Sukruti Engineering Services LLP	Ramakrishna Road, Sumedha\nNear Sujatha Kalyana Mantapa\nM V Extension, Hosakote\nBengaluru Rural	Hosakote	Karnataka	\N	India	589900	0	0	589900	The courier has been shipped to:\nBoby John, Kannampuzha House, Moozhikkulam, Kurumassery  P O, Angamaly-683579,Kerala\nPhone: +91 9387532483 ,9446612080\n\nBlueDart Tracking ID: 17630033072	\N
cmri3smys000004i2dfw43xd8	2026-07-12 18:04:59.332	2026-07-12 18:05:07.793	INV-2026-0002	PAID	2026-07-12 00:00:00	2026-07-12 00:00:00	INR	cmri32e6m000004k0sv4zwzww	Jawahar	jawahar.rossi46@gmail.com	9566321015	\N	A103, shambhavi apartments, nellikuppam road, Guduvanchery, chennai	\N	\N	603202	\N	129900	0	0	129900	\N	\N
\.


--
-- Data for Name: InvoiceLineItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."InvoiceLineItem" (id, "invoiceId", "sortOrder", description, quantity, "unitPricePaise", "taxRatePercent", "discountPaise", "lineSubtotalPaise", "lineTaxPaise", "lineTotalPaise") FROM stdin;
cmpwstkb10002cyvixhm2slfi	cmpwrngpf0001vvviqyc9tc2w	0	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++ (10g)	1	589900	0	0	589900	0	589900
cmri3su0s000204i29yp9k7rx	cmri3smys000004i2dfw43xd8	0	Pure Kashmiri Mongra Kesar Grade A++ (2g)	1	129900	0	0	129900	0	129900
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Order" (id, "createdAt", "updatedAt", status, currency, "subtotalRupees", "customerName", phone, "cityPin", notes, email, pincode, "heardAboutUs", "deliveryAddress", "paymentMethod", "razorpayOrderId", "razorpayPaymentId", source) FROM stdin;
cmp1i1cci000004icx6672nqm	2026-05-11 17:52:10.434	2026-05-11 17:52:10.434	PAID	INR	999	Rashid v	9745088717	\N	\N	rashidvayalil717@gmail.com	673303	\N	\N	ONLINE	\N	\N	\N
cmphyg7u7000004jvl0zhjzoz	2026-05-23 06:15:57.103	2026-05-23 06:15:57.103	PAID	INR	1299	Rakeshsinh Dabhi	9898508585	\N	\N	rpsinhdabhi@gmail.com	380005	Other	31, Nilkanth avenue, near maruti suzuki showroom, motera stadium road, Motera gaam, Ahmedabad	ONLINE	\N	\N	\N
cmpif6lfi000004l8dfi4qxo7	2026-05-23 14:04:21.63	2026-05-23 14:04:21.63	PAID	INR	3049	Tophan Kumar Biswal	+918658528556	\N	\N	tophankumarbiswal@gmail.com	800018	Google search	Parvath nagar	ONLINE	\N	\N	\N
cmr10c5u9000104l786ilo8x3	2026-06-30 18:56:06.801	2026-06-30 18:56:06.801	PAID	INR	1299	Santosh Kumar Kanakam	9665713929	\N	\N	santhosh.kanakam@gmail.com	441111	Google search	Quarter Type 7, Building 6/2, Koradi TPS Colony, Mahadula, Koradi	ONLINE	order_T7wtWSZpA2vwcJ	pay_T7wtqKsx7QBOmK	\N
cmrds94nx000304l7ue6zokwr	2026-07-09 17:30:48.67	2026-07-09 17:31:08.164	PAID	INR	1299	ALDOTILAK CHATTARNAS VIJAY	8861035488	\N	Preferred delivery window - before 15th July	tilak08@gmail.com	562125	Friend or family referral	G-09 Kristal Quartz 2, Kristal Campus 10, Near Spandana Hospital, Sarjapur	ONLINE	order_TBUGf7GcslvVLM	pay_TBUGniM1Cr0l6p	\N
cmri32ejv000104k0zxf3d5re	2026-07-12 17:44:35.371	2026-07-12 17:45:21.827	PAID	INR	1299	Jawahar	9566321015	\N	\N	jawahar.rossi46@gmail.com	603202	Google search	A103, shambhavi apartments, nellikuppam road, Guduvanchery, chennai	ONLINE	order_TCg6a9CWSpotOB	pay_TCg72vcvjZDozJ	\N
cmrjlhbrr000104lb27xozf0g	2026-07-13 19:07:50.871	2026-07-13 19:08:21.051	PAID	INR	1299	Joseph Sebastian	9074897720	\N	\N	nikhilbond004@gmail.com	685505	Other	Mesthiriparambil house\nUpputhara PO Upputhara\nIdukki, kerala\n685505	ONLINE	order_TD63eMfnZhMfme	pay_TD63t6HfBEVl8N	\N
cmrm11n2q000104jjjyukqxya	2026-07-15 11:59:05.234	2026-07-15 11:59:05.234	PAID	INR	1299	Deshmane pooja	9699624051	\N	\N	sudrukpooja@gmail.com	411041	Google search	Maitree mega city, mahadev nagar raykarmala, dhayri	ONLINE	order_TDloy2ppLAzlrS	\N	\N
cmrmakxos000104juk03m571j	2026-07-15 16:26:01.997	2026-07-15 16:28:43.974	PAID	INR	1299	Dr. R. Balamurugan	8610427997	\N	\N	rbalaudt@gmail.com	642126	Google search	30/72, 3rd Street, \nSNR Nagar,\nNear Union Office,\nUdumalpet,\nTirupur District	ONLINE	order_TDqMxiuC0mzLsn	pay_TDqPn3dzWeYcrh	\N
cms0mcgt6000104jluuuso15q	2026-07-25 17:04:08.73	2026-07-25 17:04:41.249	PAID	INR	1299	Nilesh kumar	6378388824	\N	\N	neelzalindra@gmail.com	333042	Other	Godara ki dhani,Nawalgarh	ONLINE	order_THoMQ27WaeNbHr	pay_THoMlKN6yryIIT	\N
cms2agg4s000104ld5xogupdy	2026-07-26 21:06:51.436	2026-07-26 21:07:24.394	PAID	INR	1299	Swapnil Deopa	8476949488	\N	\N	deopaswapnil1009@gmail.com	262309	Google search	Shree Jee Traders, Cement Road. Ward no.8 Tanakpur, Champawat (uttarakhand )	ONLINE	order_TIH1vggKZkWucd	pay_TIH270nJE0J5TQ	\N
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrderItem" (id, "orderId", "productId", "productName", "variantId", "variantLabel", quantity, "unitPriceRupees", "lineTotalRupees") FROM stdin;
cmp1i1cin000104icpbi9l4oe	cmp1i1cci000004icx6672nqm	mongra-saffron	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++	mongra-2g	2g	1	999	999
cmphyg809000104jvltfzbg6b	cmphyg7u7000004jvl0zhjzoz	mongra-saffron	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++	mongra-2g	2g	1	1299	1299
cmpif6lm9000104l8lnvv8p97	cmpif6lfi000004l8dfi4qxo7	mongra-saffron	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++	mongra-5g	5g	1	3049	3049
cmr10c6df000204l72p7swqpo	cmr10c5u9000104l786ilo8x3	mongra-saffron	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++	mongra-2g	2g	1	1299	1299
cmrds94uo000404l743x2x0e4	cmrds94nx000304l7ue6zokwr	mongra-saffron	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++	mongra-2g	2g	1	1299	1299
cmri32eqb000204k0q3d7vu6t	cmri32ejv000104k0zxf3d5re	mongra-saffron	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++	mongra-2g	2g	1	1299	1299
cmrjlhbyt000204lb7x7ctn3c	cmrjlhbrr000104lb27xozf0g	mongra-saffron	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++	mongra-2g	2g	1	1299	1299
cmrm11n95000204jjv11tb9me	cmrm11n2q000104jjjyukqxya	mongra-saffron	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++	mongra-2g	2g	1	1299	1299
cmrmakxv6000204jul7b71e9b	cmrmakxos000104juk03m571j	mongra-saffron	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++	mongra-2g	2g	1	1299	1299
cms0mch5h000204jlm7wnnr1h	cms0mcgt6000104jluuuso15q	mongra-saffron	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++	mongra-2g	2g	1	1299	1299
cms2aggb4000204ld838ykemf	cms2agg4s000104ld5xogupdy	mongra-saffron	Pure Kashmiri Mongra Kesar (Saffron) — Grade A++	mongra-2g	2g	1	1299	1299
\.


--
-- Data for Name: PincodeServiceability; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PincodeServiceability" (id, "partnerCode", pincode, status, detail, "checkedAt", "updatedAt") FROM stdin;
cmrmdrri700000jvi6lgpd2si	shree_maruti	190002	SERVICEABLE	[{"Pincode": "190002", "sp_name": "SRINAGAR-JEHANGIR CHOWK", "area_name": "BOHRI KADAL", "area_type": "DELIVERY ZONE"}, {"Pincode": "190002", "sp_name": "SRINAGAR-IDGAH", "area_name": "SRINAGAR IDGAH", "area_type": "DELIVERY ZONE"}]	2026-07-15 17:55:19.423	2026-07-15 17:55:19.423
cmrmdrrr600010jvi4o73cwcl	shree_maruti	000000	NOT_SERVICEABLE	\N	2026-07-15 17:55:19.746	2026-07-15 17:55:19.746
cmrmdspso000071viyq40ji2a	shree_maruti	380005	SERVICEABLE	[{"Pincode": "380005", "sp_name": "AHMEDABAD-SABARMATI", "area_name": "Kabir Chowk ", "area_type": "DELIVERY ZONE"}, {"Pincode": "380005", "sp_name": "AHMEDABAD-SABARMATI", "area_name": "Sabarmati ", "area_type": "DELIVERY ZONE"}, {"Pincode": "380005", "sp_name": "AHMEDABAD-CHANDKHEDA-VISAT", "area_name": "MOTERA ", "area_type": "DELIVERY ZONE"}, {"Pincode": "380005", "sp_name": "AHMEDABAD-CHANDKHEDA-VISAT", "area_name": "O N G C ", "area_type": "DELIVERY ZONE"}]	2026-07-15 17:56:03.864	2026-07-15 17:56:03.864
cmrmdsq0m000171vigolbi7ha	shree_maruti	411041	SERVICEABLE	[{"Pincode": "411041", "sp_name": "PUNE-DHAYARI", "area_name": "Dhayari B O", "area_type": "DELIVERY ZONE"}, {"Pincode": "411041", "sp_name": "PUNE-DHAYARI", "area_name": "Nanded B O", "area_type": "DELIVERY ZONE"}, {"Pincode": "411041", "sp_name": "PUNE-DHAYARI", "area_name": "Sinhgad Technical Education Society", "area_type": "DELIVERY ZONE"}, {"Pincode": "411041", "sp_name": "PUNE-DHAYARI", "area_name": "Vadgaon Budruk S O", "area_type": "DELIVERY ZONE"}]	2026-07-15 17:56:04.15	2026-07-15 17:56:04.15
cmrmdsq8c000271vigfmkbtog	shree_maruti	441111	NOT_SERVICEABLE	\N	2026-07-15 17:56:04.428	2026-07-15 17:56:04.428
cmrmdsqg1000371vi5cipy8to	shree_maruti	562125	SERVICEABLE	[{"Pincode": "562125", "sp_name": "BENGALURU-HSR-CO", "area_name": "ONLY DOMMASANDRA, SARJAPURA", "area_type": "DELIVERY ZONE"}, {"Pincode": "562125", "sp_name": "BENGALURU-HSR-CO", "area_name": "V KANALLI , ITTANGUR , BILLAPURA CHIKKATIRUPATHI ROAD, BAGLUR ROAD, DODDA TIMMASANDRA ROAD", "area_type": "DELIVERY ZONE"}, {"Pincode": "562125", "sp_name": "SARJAPUR", "area_name": "SARJAPUR", "area_type": "DELIVERY ZONE"}]	2026-07-15 17:56:04.705	2026-07-15 17:56:04.705
cmrmdsqo4000471vijj701e1f	shree_maruti	603202	SERVICEABLE	[{"Pincode": "603202", "sp_name": "MARAI MALAI NAGAR", "area_name": "Guduvanchery S O", "area_type": "DELIVERY ZONE"}, {"Pincode": "603202", "sp_name": "MARAI MALAI NAGAR", "area_name": "Kannivakkam B O", "area_type": "DELIVERY ZONE"}, {"Pincode": "603202", "sp_name": "MARAI MALAI NAGAR", "area_name": "Karanaipuduchery B O", "area_type": "DELIVERY ZONE"}, {"Pincode": "603202", "sp_name": "MARAI MALAI NAGAR", "area_name": "Kayarambedu  B O", "area_type": "DELIVERY ZONE"}, {"Pincode": "603202", "sp_name": "MARAI MALAI NAGAR", "area_name": "MADAMBAKKAM B O", "area_type": "DELIVERY ZONE"}, {"Pincode": "603202", "sp_name": "MARAI MALAI NAGAR", "area_name": "PONDUR VILLAGE,KANNIVAKKAM VILLAGE,KAYRAMBEDU VILLAGE,MADAMBAKKAM VILLAGE", "area_type": "NON DELIVERY ZONE"}]	2026-07-15 17:56:04.996	2026-07-15 17:56:04.996
cmrmdsqvv000571viedci7weo	shree_maruti	642126	SERVICEABLE	[{"Pincode": "642126", "sp_name": "POLLACHI", "area_name": "UDUMALPET", "area_type": "DELIVERY ZONE"}]	2026-07-15 17:56:05.275	2026-07-15 17:56:05.275
cmrmdsr3f000671vio2m8j2gb	shree_maruti	673303	NOT_SERVICEABLE	\N	2026-07-15 17:56:05.547	2026-07-15 17:56:05.547
cmrmdsrb1000771vi80rm480a	shree_maruti	685505	NOT_SERVICEABLE	\N	2026-07-15 17:56:05.821	2026-07-15 17:56:05.821
cmrmdsriw000871vi8cj6tv9y	shree_maruti	800018	SERVICEABLE	[{"Pincode": "800018", "sp_name": "PATNA-BANK ROAD", "area_name": "Bataganj S O", "area_type": "DELIVERY ZONE"}]	2026-07-15 17:56:06.104	2026-07-15 17:56:06.104
cmrmdsrqi000971vib9lfpuri	shree_maruti	897987	NOT_SERVICEABLE	\N	2026-07-15 17:56:06.378	2026-07-15 17:56:06.378
cms0mcj6j000304jlfja23o70	shree_maruti	333042	NOT_SERVICEABLE	\N	2026-07-25 17:04:11.803	2026-07-25 17:04:11.803
cms2aghmy000304ldm76rpfyn	shree_maruti	262309	NOT_SERVICEABLE	\N	2026-07-26 21:06:53.387	2026-07-26 21:06:53.387
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f8fbed25-d79a-4c11-aee3-bec9507875b4	79ab936bc705698a10103b5c4c7cad5a47796f66b3f5c44785bd8cdde3759a72	2026-05-09 12:59:24.417287+00	20250418120000_init	\N	\N	2026-05-09 12:59:23.75687+00	1
b7772d6f-f2a2-4bf6-9562-385816e2ca3d	89b6d6905fb3ce65b07754af024c865c910332c8f2ef029f6ea534424f465001	2026-05-09 12:59:25.456219+00	20260206120000_order_email_pincode_heard	\N	\N	2026-05-09 12:59:24.578652+00	1
9ea30172-62c8-4180-9b47-2f5befb3f197	f58466586bbf004474fcc31a66cdaa570d90b16b080d57af4eef9db5ad38c01c	2026-05-09 12:59:26.097963+00	20260507120000_bulk_enquiry	\N	\N	2026-05-09 12:59:25.614137+00	1
b500181d-c3a4-4e08-a53e-66f7326b6be4	c9b4d0e0adbe913316510a00c42131e90518d0cdd7266d03f6f15ae9821090a5	2026-05-12 16:44:43.021483+00	20260509120000_order_delivery_address	\N	\N	2026-05-12 16:44:42.555118+00	1
8459d0a3-b13a-4da2-8e87-9ffbb1490110	e2c3d09ad7ed16585c5828d0e55176331fbbda3ccc4559be95d9b4ab1e391901	2026-05-20 15:37:44.917013+00	20260520120000_order_email_optional	\N	\N	2026-05-20 15:37:44.469795+00	1
028f58cb-c0d3-447e-98a0-75a9e9acb622	7276319f4b6b6ce9bfef66c14cef97b0f76146c9dd521c383d06752389bfb9e6	2026-05-20 15:37:45.630233+00	20260520130000_order_email_required	\N	\N	2026-05-20 15:37:45.09827+00	1
d8be81f8-2e25-446a-8061-4f26201094cf	22e82de20d80bf6001a6fbd0bccb007f1def0e09bfadb2301b2c1800faf8344d	2026-05-20 15:46:03.066543+00	20260520140000_bulk_enquiry_drop_timeline	\N	\N	2026-05-20 15:46:02.492735+00	1
62821fcb-f4dd-4762-baab-721cf7052019	f659023b906ac4545ae759fc1579423c83e0636174f0932ea7e89ab605ad1532	2026-06-02 14:14:15.149144+00	20260602195000_invoice_management	\N	\N	2026-06-02 14:14:13.407249+00	1
47a894dc-4b05-4c7d-b750-3782bc1bc418	38a00b75e245582982de290d4ef26babfecf79ccca07fedf8316fadc86196932	2026-06-08 11:28:34.590591+00	20260608120000_order_status_lifecycle	\N	\N	2026-06-08 11:28:33.762053+00	1
\.


--
-- Name: BulkEnquiry BulkEnquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BulkEnquiry"
    ADD CONSTRAINT "BulkEnquiry_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: InvoiceLineItem InvoiceLineItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InvoiceLineItem"
    ADD CONSTRAINT "InvoiceLineItem_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: PincodeServiceability PincodeServiceability_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PincodeServiceability"
    ADD CONSTRAINT "PincodeServiceability_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: BulkEnquiry_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BulkEnquiry_createdAt_idx" ON public."BulkEnquiry" USING btree ("createdAt");


--
-- Name: Customer_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Customer_createdAt_idx" ON public."Customer" USING btree ("createdAt");


--
-- Name: Customer_deletedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Customer_deletedAt_idx" ON public."Customer" USING btree ("deletedAt");


--
-- Name: Customer_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Customer_email_idx" ON public."Customer" USING btree (email);


--
-- Name: Customer_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Customer_name_idx" ON public."Customer" USING btree (name);


--
-- Name: InvoiceLineItem_invoiceId_sortOrder_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "InvoiceLineItem_invoiceId_sortOrder_idx" ON public."InvoiceLineItem" USING btree ("invoiceId", "sortOrder");


--
-- Name: Invoice_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Invoice_createdAt_idx" ON public."Invoice" USING btree ("createdAt");


--
-- Name: Invoice_customerId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Invoice_customerId_idx" ON public."Invoice" USING btree ("customerId");


--
-- Name: Invoice_dueDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Invoice_dueDate_idx" ON public."Invoice" USING btree ("dueDate");


--
-- Name: Invoice_invoiceNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON public."Invoice" USING btree ("invoiceNumber");


--
-- Name: Invoice_issueDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Invoice_issueDate_idx" ON public."Invoice" USING btree ("issueDate");


--
-- Name: Invoice_status_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Invoice_status_createdAt_idx" ON public."Invoice" USING btree (status, "createdAt");


--
-- Name: Order_source_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Order_source_idx" ON public."Order" USING btree (source);


--
-- Name: PincodeServiceability_partnerCode_pincode_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PincodeServiceability_partnerCode_pincode_key" ON public."PincodeServiceability" USING btree ("partnerCode", pincode);


--
-- Name: PincodeServiceability_pincode_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "PincodeServiceability_pincode_idx" ON public."PincodeServiceability" USING btree (pincode);


--
-- Name: InvoiceLineItem InvoiceLineItem_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."InvoiceLineItem"
    ADD CONSTRAINT "InvoiceLineItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Invoice Invoice_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 9r8scGfPN5C9xqtGcx4UEtaR8JmefJ095497b4zV1UWv5e5BVuC3ZJ7Wlt1eL5q


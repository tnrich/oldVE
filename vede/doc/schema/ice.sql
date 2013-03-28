--
-- PostgreSQL database dump
--

SET client_encoding = 'UTF8';
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'Standard public schema';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: account_entry_relationship; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE account_entry_relationship (
    id bigint NOT NULL,
    accounts_id bigint,
    entries_id bigint
);


ALTER TABLE public.account_entry_relationship OWNER TO teselagen;

--
-- Name: account_entry_relationship_id_seq; Type: SEQUENCE; Schema: public;
Owner: teselagen
--

CREATE SEQUENCE account_entry_relationship_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.account_entry_relationship_id_seq OWNER TO teselagen;

--
-- Name: account_group; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE account_group (
    account_id bigint NOT NULL,
    group_id bigint NOT NULL
);


ALTER TABLE public.account_group OWNER TO teselagen;

--
-- Name: account_preferences; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE account_preferences (
    id bigint NOT NULL,
    preferences text,
    restriction_enzymes text,
    accounts_id bigint NOT NULL
);


ALTER TABLE public.account_preferences OWNER TO teselagen;

--
-- Name: account_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner:
teselagen
--

CREATE SEQUENCE account_preferences_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.account_preferences_id_seq OWNER TO teselagen;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE accounts (
    id bigint NOT NULL,
    creation_time timestamp without time zone,
    description text NOT NULL,
    email character varying(100) NOT NULL,
    firstname character varying(50) NOT NULL,
    initials character varying(10) NOT NULL,
    institution character varying(255) NOT NULL,
    ip character varying(20) NOT NULL,
    is_subscribed integer NOT NULL,
    lastlogin_time timestamp without time zone,
    lastname character varying(50) NOT NULL,
    modification_time timestamp without time zone,
    "password" character varying(40) NOT NULL,
    "type" character varying(255)
);


ALTER TABLE public.accounts OWNER TO teselagen;

--
-- Name: accounts_funding_source; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE accounts_funding_source (
    id bigint NOT NULL,
    accounts_id bigint NOT NULL,
    funding_source_id bigint NOT NULL
);


ALTER TABLE public.accounts_funding_source OWNER TO teselagen;

--
-- Name: accounts_funding_source_id_seq; Type: SEQUENCE; Schema: public;
Owner: teselagen
--

CREATE SEQUENCE accounts_funding_source_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.accounts_funding_source_id_seq OWNER TO teselagen;

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE accounts_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.accounts_id_seq OWNER TO teselagen;

--
-- Name: arabidopsis_seed; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE arabidopsis_seed (
    ecotype character varying(255) NOT NULL,
    generation character varying(255) NOT NULL,
    harvest_date timestamp without time zone,
    homozygosity character varying(255) NOT NULL,
    parents character varying(255) NOT NULL,
    plant_type character varying(255) NOT NULL,
    senttoabrc boolean,
    entries_id bigint NOT NULL
);


ALTER TABLE public.arabidopsis_seed OWNER TO teselagen;

--
-- Name: assembly_relationship; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE assembly_relationship (
    id bigint NOT NULL,
    description character varying(1023),
    name character varying(128),
    ontology character varying(128)
);


ALTER TABLE public.assembly_relationship OWNER TO teselagen;

--
-- Name: assembly_relationship_id_seq; Type: SEQUENCE; Schema: public;
Owner: teselagen
--

CREATE SEQUENCE assembly_relationship_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.assembly_relationship_id_seq OWNER TO teselagen;

--
-- Name: attachments; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE attachments (
    id bigint NOT NULL,
    description text NOT NULL,
    file_id character varying(36) NOT NULL,
    filename character varying(255) NOT NULL,
    entries_id bigint NOT NULL
);


ALTER TABLE public.attachments OWNER TO teselagen;

--
-- Name: attachments_id_seq; Type: SEQUENCE; Schema: public; Owner:
teselagen
--

CREATE SEQUENCE attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.attachments_id_seq OWNER TO teselagen;

--
-- Name: bulk_upload; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE bulk_upload (
    id bigint NOT NULL,
    creation_time timestamp without time zone NOT NULL,
    import_type character varying(50),
    last_update_time timestamp without time zone NOT NULL,
    name character varying(50),
    account_id bigint NOT NULL,
    group_id bigint
);


ALTER TABLE public.bulk_upload OWNER TO teselagen;

--
-- Name: bulk_upload_entry; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE bulk_upload_entry (
    bulk_upload_id bigint NOT NULL,
    entry_id bigint NOT NULL
);


ALTER TABLE public.bulk_upload_entry OWNER TO teselagen;

--
-- Name: bulk_upload_id_seq; Type: SEQUENCE; Schema: public; Owner:
teselagen
--

CREATE SEQUENCE bulk_upload_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.bulk_upload_id_seq OWNER TO teselagen;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE comments (
    id bigint NOT NULL,
    body text NOT NULL,
    creation_time timestamp without time zone,
    accounts_id bigint NOT NULL,
    entries_id bigint NOT NULL
);


ALTER TABLE public.comments OWNER TO teselagen;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO teselagen;

--
-- Name: configuration; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE configuration (
    id bigint NOT NULL,
    "key" character varying(255) NOT NULL,
    value character varying(1024) NOT NULL
);


ALTER TABLE public.configuration OWNER TO teselagen;

--
-- Name: configuration_id_seq; Type: SEQUENCE; Schema: public; Owner:
teselagen
--

CREATE SEQUENCE configuration_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.configuration_id_seq OWNER TO teselagen;

--
-- Name: entries; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:
--

CREATE TABLE entries (
    id bigint NOT NULL,
    alias character varying(127),
    bio_safety_level integer,
    creation_time timestamp without time zone,
    creator character varying(127),
    creator_email character varying(127),
    intellectual_property text,
    keywords character varying(127),
    long_description text,
    long_description_type character varying(31) NOT NULL,
    modification_time timestamp without time zone,
    "owner" character varying(127),
    owner_email character varying(127),
    record_id character varying(36) NOT NULL,
    record_type character varying(127) NOT NULL,
    literature_references text,
    short_description text,
    status character varying(127),
    version_id character varying(36) NOT NULL,
    visibility integer
);


ALTER TABLE public.entries OWNER TO teselagen;

--
-- Name: entries_funding_source; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE entries_funding_source (
    id bigint NOT NULL,
    entries_id bigint NOT NULL,
    funding_source_id bigint NOT NULL
);


ALTER TABLE public.entries_funding_source OWNER TO teselagen;

--
-- Name: entries_funding_source_id_seq; Type: SEQUENCE; Schema: public;
Owner: teselagen
--

CREATE SEQUENCE entries_funding_source_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.entries_funding_source_id_seq OWNER TO teselagen;

--
-- Name: entries_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE entries_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.entries_id_seq OWNER TO teselagen;

--
-- Name: entry_entry_assembly_relationship; Type: TABLE; Schema: public;
Owner: teselagen; Tablespace:
--

CREATE TABLE entry_entry_assembly_relationship (
    id bigint NOT NULL,
    "object" bigint,
    relationship bigint,
    subject bigint
);


ALTER TABLE public.entry_entry_assembly_relationship OWNER TO teselagen;

--
-- Name: entry_entry_assembly_relationship_id_seq; Type: SEQUENCE; Schema:
public; Owner: teselagen
--

CREATE SEQUENCE entry_entry_assembly_relationship_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.entry_entry_assembly_relationship_id_seq OWNER TO
teselagen;

--
-- Name: entry_labels; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE entry_labels (
    id bigint NOT NULL,
    entries_id bigint,
    labels_id bigint
);


ALTER TABLE public.entry_labels OWNER TO teselagen;

--
-- Name: entry_labels_id_seq; Type: SEQUENCE; Schema: public; Owner:
teselagen
--

CREATE SEQUENCE entry_labels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.entry_labels_id_seq OWNER TO teselagen;

--
-- Name: feature_feature_relationship; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE feature_feature_relationship (
    id bigint NOT NULL,
    "object" bigint,
    relationship bigint,
    subject bigint
);


ALTER TABLE public.feature_feature_relationship OWNER TO teselagen;

--
-- Name: feature_feature_relationship_id_seq; Type: SEQUENCE; Schema:
public; Owner: teselagen
--

CREATE SEQUENCE feature_feature_relationship_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.feature_feature_relationship_id_seq OWNER TO teselagen;

--
-- Name: feature_relationship; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE feature_relationship (
    id bigint NOT NULL,
    description character varying(1023),
    name character varying(128),
    ontology character varying(128)
);


ALTER TABLE public.feature_relationship OWNER TO teselagen;

--
-- Name: feature_relationship_id_seq; Type: SEQUENCE; Schema: public;
Owner: teselagen
--

CREATE SEQUENCE feature_relationship_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.feature_relationship_id_seq OWNER TO teselagen;

--
-- Name: features; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE features (
    id bigint NOT NULL,
    auto_find integer,
    genbank_type character varying(127),
    hash_sha character varying(40) NOT NULL,
    identification character varying(127),
    name character varying(127),
    "sequence" text NOT NULL
);


ALTER TABLE public.features OWNER TO teselagen;

--
-- Name: features_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE features_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.features_id_seq OWNER TO teselagen;

--
-- Name: folder; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:
--

CREATE TABLE folder (
    id bigint NOT NULL,
    creation_time timestamp without time zone,
    description character varying(1023),
    modification_time timestamp without time zone,
    name character varying(255) NOT NULL,
    owner_email character varying(255) NOT NULL,
    parent_id bigint
);


ALTER TABLE public.folder OWNER TO teselagen;

--
-- Name: folder_entry; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE folder_entry (
    folder_id bigint NOT NULL,
    entry_id bigint NOT NULL
);


ALTER TABLE public.folder_entry OWNER TO teselagen;

--
-- Name: folder_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE folder_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.folder_id_seq OWNER TO teselagen;

--
-- Name: funding_source; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE funding_source (
    id bigint NOT NULL,
    funding_source character varying(255) NOT NULL,
    principal_investigator character varying(255) NOT NULL
);


ALTER TABLE public.funding_source OWNER TO teselagen;

--
-- Name: funding_source_id_seq; Type: SEQUENCE; Schema: public; Owner:
teselagen
--

CREATE SEQUENCE funding_source_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.funding_source_id_seq OWNER TO teselagen;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:
--

CREATE TABLE groups (
    id bigint NOT NULL,
    description character varying(255) NOT NULL,
    label character varying(127) NOT NULL,
    uuid character varying(36) NOT NULL,
    parent bigint,
    fk_parent bigint
);


ALTER TABLE public.groups OWNER TO teselagen;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE groups_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.groups_id_seq OWNER TO teselagen;

--
-- Name: labels; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:
--

CREATE TABLE labels (
    id bigint NOT NULL,
    body text NOT NULL,
    accounts_id bigint NOT NULL
);


ALTER TABLE public.labels OWNER TO teselagen;

--
-- Name: labels_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE labels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.labels_id_seq OWNER TO teselagen;

--
-- Name: links; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:
--

CREATE TABLE links (
    id bigint NOT NULL,
    link character varying(1023),
    url character varying(1023),
    entries_id bigint NOT NULL
);


ALTER TABLE public.links OWNER TO teselagen;

--
-- Name: links_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.links_id_seq OWNER TO teselagen;

--
-- Name: moderator; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE moderator (
    id bigint NOT NULL,
    account_id bigint NOT NULL
);


ALTER TABLE public.moderator OWNER TO teselagen;

--
-- Name: moderator_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE moderator_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.moderator_id_seq OWNER TO teselagen;

--
-- Name: names; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:
--

CREATE TABLE "names" (
    id bigint NOT NULL,
    name character varying(127) NOT NULL,
    entries_id bigint NOT NULL
);


ALTER TABLE public."names" OWNER TO teselagen;

--
-- Name: names_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE names_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.names_id_seq OWNER TO teselagen;

--
-- Name: news; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:
--

CREATE TABLE news (
    id bigint NOT NULL,
    body text NOT NULL,
    creation_time timestamp without time zone,
    is_published integer NOT NULL,
    modification_time timestamp without time zone,
    publication_time timestamp without time zone,
    title character varying(255) NOT NULL
);


ALTER TABLE public.news OWNER TO teselagen;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE news_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.news_id_seq OWNER TO teselagen;

--
-- Name: parameters; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE parameters (
    id bigint NOT NULL,
    "key" character varying(255) NOT NULL,
    parameter_type character varying(255) NOT NULL,
    value character varying(4095) NOT NULL,
    entries_id bigint NOT NULL
);


ALTER TABLE public.parameters OWNER TO teselagen;

--
-- Name: parameters_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE parameters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.parameters_id_seq OWNER TO teselagen;

--
-- Name: part_numbers; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE part_numbers (
    id bigint NOT NULL,
    part_number character varying(127) NOT NULL,
    entries_id bigint NOT NULL
);


ALTER TABLE public.part_numbers OWNER TO teselagen;

--
-- Name: part_numbers_id_seq; Type: SEQUENCE; Schema: public; Owner:
teselagen
--

CREATE SEQUENCE part_numbers_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.part_numbers_id_seq OWNER TO teselagen;

--
-- Name: parts; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:
--

CREATE TABLE parts (
    package_format character varying(255) NOT NULL,
    pkgd_dna_fwd_hash character varying(40),
    pkgd_dna_rev_hash character varying(40),
    entries_id bigint NOT NULL
);


ALTER TABLE public.parts OWNER TO teselagen;

--
-- Name: permission_read_groups; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE permission_read_groups (
    id integer NOT NULL,
    entry_id bigint,
    group_id bigint
);


ALTER TABLE public.permission_read_groups OWNER TO teselagen;

--
-- Name: permission_read_groups_id_seq; Type: SEQUENCE; Schema: public;
Owner: teselagen
--

CREATE SEQUENCE permission_read_groups_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.permission_read_groups_id_seq OWNER TO teselagen;

--
-- Name: permission_read_users; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE permission_read_users (
    id integer NOT NULL,
    account_id bigint,
    entry_id bigint
);


ALTER TABLE public.permission_read_users OWNER TO teselagen;

--
-- Name: permission_read_users_id_seq; Type: SEQUENCE; Schema: public;
Owner: teselagen
--

CREATE SEQUENCE permission_read_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.permission_read_users_id_seq OWNER TO teselagen;

--
-- Name: permission_write_groups; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE permission_write_groups (
    id integer NOT NULL,
    entry_id bigint,
    group_id bigint
);


ALTER TABLE public.permission_write_groups OWNER TO teselagen;

--
-- Name: permission_write_groups_id_seq; Type: SEQUENCE; Schema: public;
Owner: teselagen
--

CREATE SEQUENCE permission_write_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.permission_write_groups_id_seq OWNER TO teselagen;

--
-- Name: permission_write_users; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE permission_write_users (
    id integer NOT NULL,
    account_id bigint,
    entry_id bigint
);


ALTER TABLE public.permission_write_users OWNER TO teselagen;

--
-- Name: permission_write_users_id_seq; Type: SEQUENCE; Schema: public;
Owner: teselagen
--

CREATE SEQUENCE permission_write_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.permission_write_users_id_seq OWNER TO teselagen;

--
-- Name: plasmids; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE plasmids (
    backbone character varying(127),
    circular boolean,
    origin_of_replication character varying(127),
    promoters character varying(512),
    entries_id bigint NOT NULL
);


ALTER TABLE public.plasmids OWNER TO teselagen;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE projects (
    id bigint NOT NULL,
    creation_time timestamp without time zone,
    data text,
    description text,
    modification_time timestamp without time zone,
    name character varying(255) NOT NULL,
    "type" character varying(31) NOT NULL,
    uuid character varying(36) NOT NULL,
    accounts_id bigint NOT NULL
);


ALTER TABLE public.projects OWNER TO teselagen;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.projects_id_seq OWNER TO teselagen;

--
-- Name: samples; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:
--

CREATE TABLE samples (
    id bigint NOT NULL,
    creation_time timestamp without time zone,
    depositor character varying(127),
    label character varying(127),
    modification_time timestamp without time zone,
    notes text,
    uuid character varying(36),
    entries_id bigint NOT NULL,
    location_id bigint
);


ALTER TABLE public.samples OWNER TO teselagen;

--
-- Name: samples_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE samples_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.samples_id_seq OWNER TO teselagen;

--
-- Name: selection_markers; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE selection_markers (
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    entries_id bigint NOT NULL
);


ALTER TABLE public.selection_markers OWNER TO teselagen;

--
-- Name: selection_markers_id_seq; Type: SEQUENCE; Schema: public; Owner:
teselagen
--

CREATE SEQUENCE selection_markers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.selection_markers_id_seq OWNER TO teselagen;

--
-- Name: sequence_annotation_location; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE sequence_annotation_location (
    id bigint NOT NULL,
    genbank_end integer NOT NULL,
    genbank_start integer NOT NULL,
    inbetween boolean,
    single_residue boolean,
    sequence_feature_id bigint
);


ALTER TABLE public.sequence_annotation_location OWNER TO teselagen;

--
-- Name: sequence_annotation_location_id_seq; Type: SEQUENCE; Schema:
public; Owner: teselagen
--

CREATE SEQUENCE sequence_annotation_location_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.sequence_annotation_location_id_seq OWNER TO teselagen;

--
-- Name: sequence_feature; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE sequence_feature (
    id bigint NOT NULL,
    flag character varying(255),
    description text,
    feature_end integer,
    feature_start integer,
    genbank_type character varying(127),
    name character varying(127),
    strand integer,
    feature_id bigint,
    sequence_id bigint
);


ALTER TABLE public.sequence_feature OWNER TO teselagen;

--
-- Name: sequence_feature_attribute; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE sequence_feature_attribute (
    id bigint NOT NULL,
    "key" character varying(511),
    quoted boolean NOT NULL,
    value character varying(4095),
    sequence_feature_id bigint
);


ALTER TABLE public.sequence_feature_attribute OWNER TO teselagen;

--
-- Name: sequence_feature_attribute_id_seq; Type: SEQUENCE; Schema: public;
Owner: teselagen
--

CREATE SEQUENCE sequence_feature_attribute_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.sequence_feature_attribute_id_seq OWNER TO teselagen;

--
-- Name: sequence_feature_id_seq; Type: SEQUENCE; Schema: public; Owner:
teselagen
--

CREATE SEQUENCE sequence_feature_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.sequence_feature_id_seq OWNER TO teselagen;

--
-- Name: sequences; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE sequences (
    id bigint NOT NULL,
    fwd_hash character varying(40),
    rev_hash character varying(40),
    "sequence" text,
    sequence_user text,
    entries_id bigint
);


ALTER TABLE public.sequences OWNER TO teselagen;

--
-- Name: sequences_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE sequences_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.sequences_id_seq OWNER TO teselagen;

--
-- Name: session_data; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE session_data (
    session_key character varying(40) NOT NULL,
    session_data bytea,
    expire_date bigint,
    accounts_id bigint
);


ALTER TABLE public.session_data OWNER TO teselagen;

--
-- Name: storage; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:
--

CREATE TABLE "storage" (
    id bigint NOT NULL,
    description character varying(1023),
    "index" character varying(31),
    name character varying(255) NOT NULL,
    owner_email character varying(255) NOT NULL,
    schemes oid,
    storage_type character varying(255),
    uuid character varying(36) NOT NULL,
    parent_id bigint
);


ALTER TABLE public."storage" OWNER TO teselagen;

--
-- Name: storage_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE storage_id_seq
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.storage_id_seq OWNER TO teselagen;

--
-- Name: strains; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:
--

CREATE TABLE strains (
    genotype_phenotype character varying(255),
    host character varying(255),
    plasmids character varying(512),
    entries_id bigint NOT NULL
);


ALTER TABLE public.strains OWNER TO teselagen;

--
-- Name: trace_sequence; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE trace_sequence (
    id bigint NOT NULL,
    creation_time timestamp without time zone NOT NULL,
    depositor character varying(255) NOT NULL,
    file_id character varying(36) NOT NULL,
    filename character varying(255) NOT NULL,
    "sequence" text NOT NULL,
    entries_id bigint NOT NULL
);


ALTER TABLE public.trace_sequence OWNER TO teselagen;

--
-- Name: trace_sequence_alignments; Type: TABLE; Schema: public; Owner:
teselagen; Tablespace:
--

CREATE TABLE trace_sequence_alignments (
    id bigint NOT NULL,
    modification_time timestamp without time zone NOT NULL,
    query_alignment text NOT NULL,
    query_end integer NOT NULL,
    query_start integer NOT NULL,
    score integer NOT NULL,
    sequence_hash character varying(40),
    strand integer NOT NULL,
    subject_alignment text NOT NULL,
    subject_end integer NOT NULL,
    subject_start integer NOT NULL,
    trace_sequence_id bigint NOT NULL
);


ALTER TABLE public.trace_sequence_alignments OWNER TO teselagen;

--
-- Name: trace_sequence_alignments_id_seq; Type: SEQUENCE; Schema: public;
Owner: teselagen
--

CREATE SEQUENCE trace_sequence_alignments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.trace_sequence_alignments_id_seq OWNER TO teselagen;

--
-- Name: trace_sequence_id_seq; Type: SEQUENCE; Schema: public; Owner:
teselagen
--

CREATE SEQUENCE trace_sequence_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.trace_sequence_id_seq OWNER TO teselagen;

--
-- Name: workspace; Type: TABLE; Schema: public; Owner: teselagen;
Tablespace:
--

CREATE TABLE workspace (
    id bigint NOT NULL,
    date_added bigint,
    date_visited bigint,
    in_workspace boolean NOT NULL,
    number_visited bigint NOT NULL,
    starred boolean NOT NULL,
    account_id bigint NOT NULL,
    entry_id bigint NOT NULL
);


ALTER TABLE public.workspace OWNER TO teselagen;

--
-- Name: workspace_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen
--

CREATE SEQUENCE workspace_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE public.workspace_id_seq OWNER TO teselagen;

--
-- Name: account_entry_relationship_pkey; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY account_entry_relationship
    ADD CONSTRAINT account_entry_relationship_pkey PRIMARY KEY (id);


--
-- Name: account_group_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY account_group
    ADD CONSTRAINT account_group_pkey PRIMARY KEY (account_id, group_id);


--
-- Name: account_preferences_accounts_id_key; Type: CONSTRAINT; Schema:
public; Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY account_preferences
    ADD CONSTRAINT account_preferences_accounts_id_key UNIQUE (accounts_id);


--
-- Name: account_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY account_preferences
    ADD CONSTRAINT account_preferences_pkey PRIMARY KEY (id);


--
-- Name: accounts_funding_source_pkey; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY accounts_funding_source
    ADD CONSTRAINT accounts_funding_source_pkey PRIMARY KEY (id);


--
-- Name: accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: arabidopsis_seed_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY arabidopsis_seed
    ADD CONSTRAINT arabidopsis_seed_pkey PRIMARY KEY (entries_id);


--
-- Name: assembly_relationship_pkey; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY assembly_relationship
    ADD CONSTRAINT assembly_relationship_pkey PRIMARY KEY (id);


--
-- Name: attachments_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- Name: bulk_upload_entry_entry_id_key; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY bulk_upload_entry
    ADD CONSTRAINT bulk_upload_entry_entry_id_key UNIQUE (entry_id);


--
-- Name: bulk_upload_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY bulk_upload
    ADD CONSTRAINT bulk_upload_pkey PRIMARY KEY (id);


--
-- Name: comments_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: configuration_key_key; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY configuration
    ADD CONSTRAINT configuration_key_key UNIQUE ("key");


--
-- Name: configuration_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY configuration
    ADD CONSTRAINT configuration_pkey PRIMARY KEY (id);


--
-- Name: entries_funding_source_pkey; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY entries_funding_source
    ADD CONSTRAINT entries_funding_source_pkey PRIMARY KEY (id);


--
-- Name: entries_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY entries
    ADD CONSTRAINT entries_pkey PRIMARY KEY (id);


--
-- Name: entries_record_id_key; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY entries
    ADD CONSTRAINT entries_record_id_key UNIQUE (record_id);


--
-- Name: entry_entry_assembly_relationship_pkey; Type: CONSTRAINT; Schema:
public; Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY entry_entry_assembly_relationship
    ADD CONSTRAINT entry_entry_assembly_relationship_pkey PRIMARY KEY (id);


--
-- Name: entry_labels_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY entry_labels
    ADD CONSTRAINT entry_labels_pkey PRIMARY KEY (id);


--
-- Name: feature_feature_relationship_pkey; Type: CONSTRAINT; Schema:
public; Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY feature_feature_relationship
    ADD CONSTRAINT feature_feature_relationship_pkey PRIMARY KEY (id);


--
-- Name: feature_relationship_pkey; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY feature_relationship
    ADD CONSTRAINT feature_relationship_pkey PRIMARY KEY (id);


--
-- Name: features_hash_sha_key; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY features
    ADD CONSTRAINT features_hash_sha_key UNIQUE (hash_sha);


--
-- Name: features_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: folder_entry_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY folder_entry
    ADD CONSTRAINT folder_entry_pkey PRIMARY KEY (folder_id, entry_id);


--
-- Name: folder_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY folder
    ADD CONSTRAINT folder_pkey PRIMARY KEY (id);


--
-- Name: funding_source_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY funding_source
    ADD CONSTRAINT funding_source_pkey PRIMARY KEY (id);


--
-- Name: groups_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: labels_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY labels
    ADD CONSTRAINT labels_pkey PRIMARY KEY (id);


--
-- Name: links_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY links
    ADD CONSTRAINT links_pkey PRIMARY KEY (id);


--
-- Name: moderator_account_id_key; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY moderator
    ADD CONSTRAINT moderator_account_id_key UNIQUE (account_id);


--
-- Name: moderator_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY moderator
    ADD CONSTRAINT moderator_pkey PRIMARY KEY (id);


--
-- Name: names_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY "names"
    ADD CONSTRAINT names_pkey PRIMARY KEY (id);


--
-- Name: news_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: parameters_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY parameters
    ADD CONSTRAINT parameters_pkey PRIMARY KEY (id);


--
-- Name: part_numbers_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY part_numbers
    ADD CONSTRAINT part_numbers_pkey PRIMARY KEY (id);


--
-- Name: parts_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY parts
    ADD CONSTRAINT parts_pkey PRIMARY KEY (entries_id);


--
-- Name: permission_read_groups_pkey; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY permission_read_groups
    ADD CONSTRAINT permission_read_groups_pkey PRIMARY KEY (id);


--
-- Name: permission_read_users_pkey; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY permission_read_users
    ADD CONSTRAINT permission_read_users_pkey PRIMARY KEY (id);


--
-- Name: permission_write_groups_pkey; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY permission_write_groups
    ADD CONSTRAINT permission_write_groups_pkey PRIMARY KEY (id);


--
-- Name: permission_write_users_pkey; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY permission_write_users
    ADD CONSTRAINT permission_write_users_pkey PRIMARY KEY (id);


--
-- Name: plasmids_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY plasmids
    ADD CONSTRAINT plasmids_pkey PRIMARY KEY (entries_id);


--
-- Name: projects_accounts_id_key; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_accounts_id_key UNIQUE (accounts_id);


--
-- Name: projects_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: samples_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY samples
    ADD CONSTRAINT samples_pkey PRIMARY KEY (id);


--
-- Name: selection_markers_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY selection_markers
    ADD CONSTRAINT selection_markers_pkey PRIMARY KEY (id);


--
-- Name: sequence_annotation_location_pkey; Type: CONSTRAINT; Schema:
public; Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY sequence_annotation_location
    ADD CONSTRAINT sequence_annotation_location_pkey PRIMARY KEY (id);


--
-- Name: sequence_feature_attribute_pkey; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY sequence_feature_attribute
    ADD CONSTRAINT sequence_feature_attribute_pkey PRIMARY KEY (id);


--
-- Name: sequence_feature_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY sequence_feature
    ADD CONSTRAINT sequence_feature_pkey PRIMARY KEY (id);


--
-- Name: sequences_entries_id_key; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY sequences
    ADD CONSTRAINT sequences_entries_id_key UNIQUE (entries_id);


--
-- Name: sequences_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY sequences
    ADD CONSTRAINT sequences_pkey PRIMARY KEY (id);


--
-- Name: session_data_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY session_data
    ADD CONSTRAINT session_data_pkey PRIMARY KEY (session_key);


--
-- Name: storage_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY "storage"
    ADD CONSTRAINT storage_pkey PRIMARY KEY (id);


--
-- Name: strains_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;
Tablespace:
--

ALTER TABLE ONLY strains
    ADD CONSTRAINT strains_pkey PRIMARY KEY (entries_id);


--
-- Name: trace_sequence_alignments_pkey; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY trace_sequence_alignments
    ADD CONSTRAINT trace_sequence_alignments_pkey PRIMARY KEY (id);


--
-- Name: trace_sequence_alignments_trace_sequence_id_key; Type: CONSTRAINT;
Schema: public; Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY trace_sequence_alignments
    ADD CONSTRAINT trace_sequence_alignments_trace_sequence_id_key UNIQUE
(trace_sequence_id);


--
-- Name: trace_sequence_file_id_key; Type: CONSTRAINT; Schema: public;
Owner: teselagen; Tablespace:
--

ALTER TABLE ONLY trace_sequence
    ADD CONSTRAINT trace_sequence_file_id_key UNIQUE (file_id);


--
-- Name: trace_sequence_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY trace_sequence
    ADD CONSTRAINT trace_sequence_pkey PRIMARY KEY (id);


--
-- Name: workspace_pkey; Type: CONSTRAINT; Schema: public; Owner:
teselagen; Tablespace:
--

ALTER TABLE ONLY workspace
    ADD CONSTRAINT workspace_pkey PRIMARY KEY (id);


--
-- Name: fk1b57c1eafc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY parameters
    ADD CONSTRAINT fk1b57c1eafc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fk33ca506ce9cfa5bf; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY entry_labels
    ADD CONSTRAINT fk33ca506ce9cfa5bf FOREIGN KEY (labels_id) REFERENCES
labels(id);


--
-- Name: fk33ca506cfc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY entry_labels
    ADD CONSTRAINT fk33ca506cfc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fk41a99a8a58ae3ff6; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY feature_feature_relationship
    ADD CONSTRAINT fk41a99a8a58ae3ff6 FOREIGN KEY (relationship) REFERENCES
feature_relationship(id);


--
-- Name: fk41a99a8a7c20ba5; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY feature_feature_relationship
    ADD CONSTRAINT fk41a99a8a7c20ba5 FOREIGN KEY ("object") REFERENCES
features(id);


--
-- Name: fk41a99a8ad56bbd92; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY feature_feature_relationship
    ADD CONSTRAINT fk41a99a8ad56bbd92 FOREIGN KEY (subject) REFERENCES
features(id);


--
-- Name: fk4217ec959dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY workspace
    ADD CONSTRAINT fk4217ec959dc7ff20 FOREIGN KEY (account_id) REFERENCES
accounts(id);


--
-- Name: fk4217ec95fa53045; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY workspace
    ADD CONSTRAINT fk4217ec95fa53045 FOREIGN KEY (entry_id) REFERENCES
entries(id);


--
-- Name: fk43bacc3715846c7; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY account_entry_relationship
    ADD CONSTRAINT fk43bacc3715846c7 FOREIGN KEY (accounts_id) REFERENCES
accounts(id);


--
-- Name: fk43bacc37fc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY account_entry_relationship
    ADD CONSTRAINT fk43bacc37fc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fk453a8b389dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY permission_write_users
    ADD CONSTRAINT fk453a8b389dc7ff20 FOREIGN KEY (account_id) REFERENCES
accounts(id);


--
-- Name: fk453a8b38fa53045; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY permission_write_users
    ADD CONSTRAINT fk453a8b38fa53045 FOREIGN KEY (entry_id) REFERENCES
entries(id);


--
-- Name: fk4a2982a42beaf6ca; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY permission_write_groups
    ADD CONSTRAINT fk4a2982a42beaf6ca FOREIGN KEY (group_id) REFERENCES
groups(id);


--
-- Name: fk4a2982a4fa53045; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY permission_write_groups
    ADD CONSTRAINT fk4a2982a4fa53045 FOREIGN KEY (entry_id) REFERENCES
entries(id);


--
-- Name: fk6234fb9fc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY links
    ADD CONSTRAINT fk6234fb9fc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fk63bd748fc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY "names"
    ADD CONSTRAINT fk63bd748fc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fk6581ae0fc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY parts
    ADD CONSTRAINT fk6581ae0fc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fk6ab9bfc6fc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY selection_markers
    ADD CONSTRAINT fk6ab9bfc6fc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fk6f2740092fbae9d0; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY samples
    ADD CONSTRAINT fk6f2740092fbae9d0 FOREIGN KEY (location_id) REFERENCES
"storage"(id);


--
-- Name: fk6f274009fc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY samples
    ADD CONSTRAINT fk6f274009fc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fk6fb26759fc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY plasmids
    ADD CONSTRAINT fk6fb26759fc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fk7563ebe615846c7; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY account_preferences
    ADD CONSTRAINT fk7563ebe615846c7 FOREIGN KEY (accounts_id) REFERENCES
accounts(id);


--
-- Name: fk7a9c1ac122d9eea6; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY bulk_upload_entry
    ADD CONSTRAINT fk7a9c1ac122d9eea6 FOREIGN KEY (bulk_upload_id)
REFERENCES bulk_upload(id);


--
-- Name: fk7a9c1ac1fa53045; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY bulk_upload_entry
    ADD CONSTRAINT fk7a9c1ac1fa53045 FOREIGN KEY (entry_id) REFERENCES
entries(id);


--
-- Name: fk8882a5059dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY moderator
    ADD CONSTRAINT fk8882a5059dc7ff20 FOREIGN KEY (account_id) REFERENCES
accounts(id);


--
-- Name: fk8a386a8f9dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY permission_read_users
    ADD CONSTRAINT fk8a386a8f9dc7ff20 FOREIGN KEY (account_id) REFERENCES
accounts(id);


--
-- Name: fk8a386a8ffa53045; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY permission_read_users
    ADD CONSTRAINT fk8a386a8ffa53045 FOREIGN KEY (entry_id) REFERENCES
entries(id);


--
-- Name: fk8fb0427b8a35e0bb; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY "storage"
    ADD CONSTRAINT fk8fb0427b8a35e0bb FOREIGN KEY (parent_id) REFERENCES
"storage"(id);


--
-- Name: fk8fd2ed9efc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY strains
    ADD CONSTRAINT fk8fd2ed9efc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fk9c4df034da7bb7f5; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY trace_sequence_alignments
    ADD CONSTRAINT fk9c4df034da7bb7f5 FOREIGN KEY (trace_sequence_id)
REFERENCES trace_sequence(id);


--
-- Name: fka06ad5e1fc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY arabidopsis_seed
    ADD CONSTRAINT fka06ad5e1fc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fka395b795d31bc3a7; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY sequence_feature_attribute
    ADD CONSTRAINT fka395b795d31bc3a7 FOREIGN KEY (sequence_feature_id)
REFERENCES sequence_feature(id);


--
-- Name: fka4e78e2d2beaf6ca; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY permission_read_groups
    ADD CONSTRAINT fka4e78e2d2beaf6ca FOREIGN KEY (group_id) REFERENCES
groups(id);


--
-- Name: fka4e78e2dfa53045; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY permission_read_groups
    ADD CONSTRAINT fka4e78e2dfa53045 FOREIGN KEY (entry_id) REFERENCES
entries(id);


--
-- Name: fka787a547d31bc3a7; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY sequence_annotation_location
    ADD CONSTRAINT fka787a547d31bc3a7 FOREIGN KEY (sequence_feature_id)
REFERENCES sequence_feature(id);


--
-- Name: fkb45d1c6edae0334a; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY folder
    ADD CONSTRAINT fkb45d1c6edae0334a FOREIGN KEY (parent_id) REFERENCES
folder(id);


--
-- Name: fkb63dd9d4d2678899; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT fkb63dd9d4d2678899 FOREIGN KEY (parent) REFERENCES
groups(id);


--
-- Name: fkb63dd9d4f2398153; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT fkb63dd9d4f2398153 FOREIGN KEY (fk_parent) REFERENCES
groups(id);


--
-- Name: fkb75a651615846c7; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY accounts_funding_source
    ADD CONSTRAINT fkb75a651615846c7 FOREIGN KEY (accounts_id) REFERENCES
accounts(id);


--
-- Name: fkb75a65161b5673e5; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY accounts_funding_source
    ADD CONSTRAINT fkb75a65161b5673e5 FOREIGN KEY (funding_source_id)
REFERENCES funding_source(id);


--
-- Name: fkbd9e80d2fc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY sequences
    ADD CONSTRAINT fkbd9e80d2fc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fkbdd05fff15846c7; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY labels
    ADD CONSTRAINT fkbdd05fff15846c7 FOREIGN KEY (accounts_id) REFERENCES
accounts(id);


--
-- Name: fkbe89f32c1b5673e5; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY entries_funding_source
    ADD CONSTRAINT fkbe89f32c1b5673e5 FOREIGN KEY (funding_source_id)
REFERENCES funding_source(id);


--
-- Name: fkbe89f32cfc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY entries_funding_source
    ADD CONSTRAINT fkbe89f32cfc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fkc468557bfc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY trace_sequence
    ADD CONSTRAINT fkc468557bfc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fkc479187a15846c7; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT fkc479187a15846c7 FOREIGN KEY (accounts_id) REFERENCES
accounts(id);


--
-- Name: fkc8dc1ce2beaf6ca; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY bulk_upload
    ADD CONSTRAINT fkc8dc1ce2beaf6ca FOREIGN KEY (group_id) REFERENCES
groups(id);


--
-- Name: fkc8dc1ce9dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY bulk_upload
    ADD CONSTRAINT fkc8dc1ce9dc7ff20 FOREIGN KEY (account_id) REFERENCES
accounts(id);


--
-- Name: fkc9d348783bc5f36a; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY sequence_feature
    ADD CONSTRAINT fkc9d348783bc5f36a FOREIGN KEY (feature_id) REFERENCES
features(id);


--
-- Name: fkc9d3487885308eaa; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY sequence_feature
    ADD CONSTRAINT fkc9d3487885308eaa FOREIGN KEY (sequence_id) REFERENCES
sequences(id);


--
-- Name: fkcbe4fd617eea5906; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY folder_entry
    ADD CONSTRAINT fkcbe4fd617eea5906 FOREIGN KEY (folder_id) REFERENCES
folder(id);


--
-- Name: fkcbe4fd61fa53045; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY folder_entry
    ADD CONSTRAINT fkcbe4fd61fa53045 FOREIGN KEY (entry_id) REFERENCES
entries(id);


--
-- Name: fkd3f3cbb0fc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY attachments
    ADD CONSTRAINT fkd3f3cbb0fc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fkd568f5fefc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY part_numbers
    ADD CONSTRAINT fkd568f5fefc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fkd71153b315846c7; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY session_data
    ADD CONSTRAINT fkd71153b315846c7 FOREIGN KEY (accounts_id) REFERENCES
accounts(id);


--
-- Name: fkdc17ddf415846c7; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT fkdc17ddf415846c7 FOREIGN KEY (accounts_id) REFERENCES
accounts(id);


--
-- Name: fkdc17ddf4fc51d767; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT fkdc17ddf4fc51d767 FOREIGN KEY (entries_id) REFERENCES
entries(id);


--
-- Name: fkdff9cded2beaf6ca; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY account_group
    ADD CONSTRAINT fkdff9cded2beaf6ca FOREIGN KEY (group_id) REFERENCES
groups(id);


--
-- Name: fkdff9cded9dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY account_group
    ADD CONSTRAINT fkdff9cded9dc7ff20 FOREIGN KEY (account_id) REFERENCES
accounts(id);


--
-- Name: fkede3f5971d1a4969; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY entry_entry_assembly_relationship
    ADD CONSTRAINT fkede3f5971d1a4969 FOREIGN KEY (subject) REFERENCES
entries(id);


--
-- Name: fkede3f5974f70977c; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY entry_entry_assembly_relationship
    ADD CONSTRAINT fkede3f5974f70977c FOREIGN KEY ("object") REFERENCES
entries(id);


--
-- Name: fkede3f5974fe93e06; Type: FK CONSTRAINT; Schema: public; Owner:
teselagen
--

ALTER TABLE ONLY entry_entry_assembly_relationship
    ADD CONSTRAINT fkede3f5974fe93e06 FOREIGN KEY (relationship) REFERENCES
assembly_relationship(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--089e01160dde5e856604d886cd32
Content-Type: text/html; charset=ISO-8859-1
Content-Transfer-Encoding: quoted-printable

Another option would be interacting directly with the postgresql databases =
in which ICE stores the data. This is not exactly recommended since all the=
 logic inside jbei registry is not being used and may cause inconsistency i=
n the db.<br>
<br>- Rodrigo<br><br><div class=3D"gmail_quote">---------- Forwarded messag=
e ----------<br>From: <b class=3D"gmail_sendername"></b> <span dir=3D"ltr">=
&lt;rpavez@pushscience&gt;</span><br>Date: Fri, Mar 22, 2013 at 2:26 PM<br>=
Subject: ice schema<br>
To: <a href=3D"mailto:rpavez@teselagen.com">rpavez@teselagen.com</a><br><br=
><br>--<br>
-- PostgreSQL database dump<br>
--<br>
<br>
SET client_encoding =3D &#39;UTF8&#39;;<br>
SET check_function_bodies =3D false;<br>
SET client_min_messages =3D warning;<br>
<br>
--<br>
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres<br>
--<br>
<br>
COMMENT ON SCHEMA public IS &#39;Standard public schema&#39;;<br>
<br>
<br>
SET search_path =3D public, pg_catalog;<br>
<br>
SET default_tablespace =3D &#39;&#39;;<br>
<br>
SET default_with_oids =3D false;<br>
<br>
--<br>
-- Name: account_entry_relationship; Type: TABLE; Schema: public; Owner: te=
selagen; Tablespace:<br>
--<br>
<br>
CREATE TABLE account_entry_relationship (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 accounts_id bigint,<br>
=A0 =A0 entries_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.account_entry_relationship OWNER TO teselagen;<br>
<br>
--<br>
-- Name: account_entry_relationship_id_seq; Type: SEQUENCE; Schema: public;=
 Owner: teselagen<br>
--<br>
<br>
CREATE SEQUENCE account_entry_relationship_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.account_entry_relationship_id_seq OWNER TO teselagen;<br=
>
<br>
--<br>
-- Name: account_group; Type: TABLE; Schema: public; Owner: teselagen; Tabl=
espace:<br>
--<br>
<br>
CREATE TABLE account_group (<br>
=A0 =A0 account_id bigint NOT NULL,<br>
=A0 =A0 group_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.account_group OWNER TO teselagen;<br>
<br>
--<br>
-- Name: account_preferences; Type: TABLE; Schema: public; Owner: teselagen=
; Tablespace:<br>
--<br>
<br>
CREATE TABLE account_preferences (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 preferences text,<br>
=A0 =A0 restriction_enzymes text,<br>
=A0 =A0 accounts_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.account_preferences OWNER TO teselagen;<br>
<br>
--<br>
-- Name: account_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner:=
 teselagen<br>
--<br>
<br>
CREATE SEQUENCE account_preferences_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.account_preferences_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: accounts; Type: TABLE; Schema: public; Owner: teselagen; Tablespac=
e:<br>
--<br>
<br>
CREATE TABLE accounts (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 creation_time timestamp without time zone,<br>
=A0 =A0 description text NOT NULL,<br>
=A0 =A0 email character varying(100) NOT NULL,<br>
=A0 =A0 firstname character varying(50) NOT NULL,<br>
=A0 =A0 initials character varying(10) NOT NULL,<br>
=A0 =A0 institution character varying(255) NOT NULL,<br>
=A0 =A0 ip character varying(20) NOT NULL,<br>
=A0 =A0 is_subscribed integer NOT NULL,<br>
=A0 =A0 lastlogin_time timestamp without time zone,<br>
=A0 =A0 lastname character varying(50) NOT NULL,<br>
=A0 =A0 modification_time timestamp without time zone,<br>
=A0 =A0 &quot;password&quot; character varying(40) NOT NULL,<br>
=A0 =A0 &quot;type&quot; character varying(255)<br>
);<br>
<br>
<br>
ALTER TABLE public.accounts OWNER TO teselagen;<br>
<br>
--<br>
-- Name: accounts_funding_source; Type: TABLE; Schema: public; Owner: tesel=
agen; Tablespace:<br>
--<br>
<br>
CREATE TABLE accounts_funding_source (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 accounts_id bigint NOT NULL,<br>
=A0 =A0 funding_source_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.accounts_funding_source OWNER TO teselagen;<br>
<br>
--<br>
-- Name: accounts_funding_source_id_seq; Type: SEQUENCE; Schema: public; Ow=
ner: teselagen<br>
--<br>
<br>
CREATE SEQUENCE accounts_funding_source_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.accounts_funding_source_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<=
br>
--<br>
<br>
CREATE SEQUENCE accounts_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.accounts_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: arabidopsis_seed; Type: TABLE; Schema: public; Owner: teselagen; T=
ablespace:<br>
--<br>
<br>
CREATE TABLE arabidopsis_seed (<br>
=A0 =A0 ecotype character varying(255) NOT NULL,<br>
=A0 =A0 generation character varying(255) NOT NULL,<br>
=A0 =A0 harvest_date timestamp without time zone,<br>
=A0 =A0 homozygosity character varying(255) NOT NULL,<br>
=A0 =A0 parents character varying(255) NOT NULL,<br>
=A0 =A0 plant_type character varying(255) NOT NULL,<br>
=A0 =A0 senttoabrc boolean,<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.arabidopsis_seed OWNER TO teselagen;<br>
<br>
--<br>
-- Name: assembly_relationship; Type: TABLE; Schema: public; Owner: teselag=
en; Tablespace:<br>
--<br>
<br>
CREATE TABLE assembly_relationship (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 description character varying(1023),<br>
=A0 =A0 name character varying(128),<br>
=A0 =A0 ontology character varying(128)<br>
);<br>
<br>
<br>
ALTER TABLE public.assembly_relationship OWNER TO teselagen;<br>
<br>
--<br>
-- Name: assembly_relationship_id_seq; Type: SEQUENCE; Schema: public; Owne=
r: teselagen<br>
--<br>
<br>
CREATE SEQUENCE assembly_relationship_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.assembly_relationship_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: attachments; Type: TABLE; Schema: public; Owner: teselagen; Tables=
pace:<br>
--<br>
<br>
CREATE TABLE attachments (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 description text NOT NULL,<br>
=A0 =A0 file_id character varying(36) NOT NULL,<br>
=A0 =A0 filename character varying(255) NOT NULL,<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.attachments OWNER TO teselagen;<br>
<br>
--<br>
-- Name: attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: teselag=
en<br>
--<br>
<br>
CREATE SEQUENCE attachments_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.attachments_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: bulk_upload; Type: TABLE; Schema: public; Owner: teselagen; Tables=
pace:<br>
--<br>
<br>
CREATE TABLE bulk_upload (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 creation_time timestamp without time zone NOT NULL,<br>
=A0 =A0 import_type character varying(50),<br>
=A0 =A0 last_update_time timestamp without time zone NOT NULL,<br>
=A0 =A0 name character varying(50),<br>
=A0 =A0 account_id bigint NOT NULL,<br>
=A0 =A0 group_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.bulk_upload OWNER TO teselagen;<br>
<br>
--<br>
-- Name: bulk_upload_entry; Type: TABLE; Schema: public; Owner: teselagen; =
Tablespace:<br>
--<br>
<br>
CREATE TABLE bulk_upload_entry (<br>
=A0 =A0 bulk_upload_id bigint NOT NULL,<br>
=A0 =A0 entry_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.bulk_upload_entry OWNER TO teselagen;<br>
<br>
--<br>
-- Name: bulk_upload_id_seq; Type: SEQUENCE; Schema: public; Owner: teselag=
en<br>
--<br>
<br>
CREATE SEQUENCE bulk_upload_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.bulk_upload_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: comments; Type: TABLE; Schema: public; Owner: teselagen; Tablespac=
e:<br>
--<br>
<br>
CREATE TABLE comments (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 body text NOT NULL,<br>
=A0 =A0 creation_time timestamp without time zone,<br>
=A0 =A0 accounts_id bigint NOT NULL,<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.comments OWNER TO teselagen;<br>
<br>
--<br>
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<=
br>
--<br>
<br>
CREATE SEQUENCE comments_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.comments_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: configuration; Type: TABLE; Schema: public; Owner: teselagen; Tabl=
espace:<br>
--<br>
<br>
CREATE TABLE configuration (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 &quot;key&quot; character varying(255) NOT NULL,<br>
=A0 =A0 value character varying(1024) NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.configuration OWNER TO teselagen;<br>
<br>
--<br>
-- Name: configuration_id_seq; Type: SEQUENCE; Schema: public; Owner: tesel=
agen<br>
--<br>
<br>
CREATE SEQUENCE configuration_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.configuration_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: entries; Type: TABLE; Schema: public; Owner: teselagen; Tablespace=
:<br>
--<br>
<br>
CREATE TABLE entries (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 alias character varying(127),<br>
=A0 =A0 bio_safety_level integer,<br>
=A0 =A0 creation_time timestamp without time zone,<br>
=A0 =A0 creator character varying(127),<br>
=A0 =A0 creator_email character varying(127),<br>
=A0 =A0 intellectual_property text,<br>
=A0 =A0 keywords character varying(127),<br>
=A0 =A0 long_description text,<br>
=A0 =A0 long_description_type character varying(31) NOT NULL,<br>
=A0 =A0 modification_time timestamp without time zone,<br>
=A0 =A0 &quot;owner&quot; character varying(127),<br>
=A0 =A0 owner_email character varying(127),<br>
=A0 =A0 record_id character varying(36) NOT NULL,<br>
=A0 =A0 record_type character varying(127) NOT NULL,<br>
=A0 =A0 literature_references text,<br>
=A0 =A0 short_description text,<br>
=A0 =A0 status character varying(127),<br>
=A0 =A0 version_id character varying(36) NOT NULL,<br>
=A0 =A0 visibility integer<br>
);<br>
<br>
<br>
ALTER TABLE public.entries OWNER TO teselagen;<br>
<br>
--<br>
-- Name: entries_funding_source; Type: TABLE; Schema: public; Owner: tesela=
gen; Tablespace:<br>
--<br>
<br>
CREATE TABLE entries_funding_source (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 entries_id bigint NOT NULL,<br>
=A0 =A0 funding_source_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.entries_funding_source OWNER TO teselagen;<br>
<br>
--<br>
-- Name: entries_funding_source_id_seq; Type: SEQUENCE; Schema: public; Own=
er: teselagen<br>
--<br>
<br>
CREATE SEQUENCE entries_funding_source_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.entries_funding_source_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: entries_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<b=
r>
--<br>
<br>
CREATE SEQUENCE entries_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.entries_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: entry_entry_assembly_relationship; Type: TABLE; Schema: public; Ow=
ner: teselagen; Tablespace:<br>
--<br>
<br>
CREATE TABLE entry_entry_assembly_relationship (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 &quot;object&quot; bigint,<br>
=A0 =A0 relationship bigint,<br>
=A0 =A0 subject bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.entry_entry_assembly_relationship OWNER TO teselagen;<br=
>
<br>
--<br>
-- Name: entry_entry_assembly_relationship_id_seq; Type: SEQUENCE; Schema: =
public; Owner: teselagen<br>
--<br>
<br>
CREATE SEQUENCE entry_entry_assembly_relationship_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.entry_entry_assembly_relationship_id_seq OWNER TO tesela=
gen;<br>
<br>
--<br>
-- Name: entry_labels; Type: TABLE; Schema: public; Owner: teselagen; Table=
space:<br>
--<br>
<br>
CREATE TABLE entry_labels (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 entries_id bigint,<br>
=A0 =A0 labels_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.entry_labels OWNER TO teselagen;<br>
<br>
--<br>
-- Name: entry_labels_id_seq; Type: SEQUENCE; Schema: public; Owner: tesela=
gen<br>
--<br>
<br>
CREATE SEQUENCE entry_labels_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.entry_labels_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: feature_feature_relationship; Type: TABLE; Schema: public; Owner: =
teselagen; Tablespace:<br>
--<br>
<br>
CREATE TABLE feature_feature_relationship (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 &quot;object&quot; bigint,<br>
=A0 =A0 relationship bigint,<br>
=A0 =A0 subject bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.feature_feature_relationship OWNER TO teselagen;<br>
<br>
--<br>
-- Name: feature_feature_relationship_id_seq; Type: SEQUENCE; Schema: publi=
c; Owner: teselagen<br>
--<br>
<br>
CREATE SEQUENCE feature_feature_relationship_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.feature_feature_relationship_id_seq OWNER TO teselagen;<=
br>
<br>
--<br>
-- Name: feature_relationship; Type: TABLE; Schema: public; Owner: teselage=
n; Tablespace:<br>
--<br>
<br>
CREATE TABLE feature_relationship (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 description character varying(1023),<br>
=A0 =A0 name character varying(128),<br>
=A0 =A0 ontology character varying(128)<br>
);<br>
<br>
<br>
ALTER TABLE public.feature_relationship OWNER TO teselagen;<br>
<br>
--<br>
-- Name: feature_relationship_id_seq; Type: SEQUENCE; Schema: public; Owner=
: teselagen<br>
--<br>
<br>
CREATE SEQUENCE feature_relationship_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.feature_relationship_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: features; Type: TABLE; Schema: public; Owner: teselagen; Tablespac=
e:<br>
--<br>
<br>
CREATE TABLE features (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 auto_find integer,<br>
=A0 =A0 genbank_type character varying(127),<br>
=A0 =A0 hash_sha character varying(40) NOT NULL,<br>
=A0 =A0 identification character varying(127),<br>
=A0 =A0 name character varying(127),<br>
=A0 =A0 &quot;sequence&quot; text NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.features OWNER TO teselagen;<br>
<br>
--<br>
-- Name: features_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<=
br>
--<br>
<br>
CREATE SEQUENCE features_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.features_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: folder; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:=
<br>
--<br>
<br>
CREATE TABLE folder (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 creation_time timestamp without time zone,<br>
=A0 =A0 description character varying(1023),<br>
=A0 =A0 modification_time timestamp without time zone,<br>
=A0 =A0 name character varying(255) NOT NULL,<br>
=A0 =A0 owner_email character varying(255) NOT NULL,<br>
=A0 =A0 parent_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.folder OWNER TO teselagen;<br>
<br>
--<br>
-- Name: folder_entry; Type: TABLE; Schema: public; Owner: teselagen; Table=
space:<br>
--<br>
<br>
CREATE TABLE folder_entry (<br>
=A0 =A0 folder_id bigint NOT NULL,<br>
=A0 =A0 entry_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.folder_entry OWNER TO teselagen;<br>
<br>
--<br>
-- Name: folder_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<br=
>
--<br>
<br>
CREATE SEQUENCE folder_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.folder_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: funding_source; Type: TABLE; Schema: public; Owner: teselagen; Tab=
lespace:<br>
--<br>
<br>
CREATE TABLE funding_source (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 funding_source character varying(255) NOT NULL,<br>
=A0 =A0 principal_investigator character varying(255) NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.funding_source OWNER TO teselagen;<br>
<br>
--<br>
-- Name: funding_source_id_seq; Type: SEQUENCE; Schema: public; Owner: tese=
lagen<br>
--<br>
<br>
CREATE SEQUENCE funding_source_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.funding_source_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: groups; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:=
<br>
--<br>
<br>
CREATE TABLE groups (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 description character varying(255) NOT NULL,<br>
=A0 =A0 label character varying(127) NOT NULL,<br>
=A0 =A0 uuid character varying(36) NOT NULL,<br>
=A0 =A0 parent bigint,<br>
=A0 =A0 fk_parent bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.groups OWNER TO teselagen;<br>
<br>
--<br>
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<br=
>
--<br>
<br>
CREATE SEQUENCE groups_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.groups_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: labels; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:=
<br>
--<br>
<br>
CREATE TABLE labels (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 body text NOT NULL,<br>
=A0 =A0 accounts_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.labels OWNER TO teselagen;<br>
<br>
--<br>
-- Name: labels_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<br=
>
--<br>
<br>
CREATE SEQUENCE labels_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.labels_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: links; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:<=
br>
--<br>
<br>
CREATE TABLE links (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 link character varying(1023),<br>
=A0 =A0 url character varying(1023),<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.links OWNER TO teselagen;<br>
<br>
--<br>
-- Name: links_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<br>
--<br>
<br>
CREATE SEQUENCE links_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.links_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: moderator; Type: TABLE; Schema: public; Owner: teselagen; Tablespa=
ce:<br>
--<br>
<br>
CREATE TABLE moderator (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 account_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.moderator OWNER TO teselagen;<br>
<br>
--<br>
-- Name: moderator_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen=
<br>
--<br>
<br>
CREATE SEQUENCE moderator_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.moderator_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: names; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:<=
br>
--<br>
<br>
CREATE TABLE &quot;names&quot; (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 name character varying(127) NOT NULL,<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.&quot;names&quot; OWNER TO teselagen;<br>
<br>
--<br>
-- Name: names_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<br>
--<br>
<br>
CREATE SEQUENCE names_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.names_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: news; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:<b=
r>
--<br>
<br>
CREATE TABLE news (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 body text NOT NULL,<br>
=A0 =A0 creation_time timestamp without time zone,<br>
=A0 =A0 is_published integer NOT NULL,<br>
=A0 =A0 modification_time timestamp without time zone,<br>
=A0 =A0 publication_time timestamp without time zone,<br>
=A0 =A0 title character varying(255) NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.news OWNER TO teselagen;<br>
<br>
--<br>
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<br>
--<br>
<br>
CREATE SEQUENCE news_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.news_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: parameters; Type: TABLE; Schema: public; Owner: teselagen; Tablesp=
ace:<br>
--<br>
<br>
CREATE TABLE parameters (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 &quot;key&quot; character varying(255) NOT NULL,<br>
=A0 =A0 parameter_type character varying(255) NOT NULL,<br>
=A0 =A0 value character varying(4095) NOT NULL,<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.parameters OWNER TO teselagen;<br>
<br>
--<br>
-- Name: parameters_id_seq; Type: SEQUENCE; Schema: public; Owner: teselage=
n<br>
--<br>
<br>
CREATE SEQUENCE parameters_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.parameters_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: part_numbers; Type: TABLE; Schema: public; Owner: teselagen; Table=
space:<br>
--<br>
<br>
CREATE TABLE part_numbers (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 part_number character varying(127) NOT NULL,<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.part_numbers OWNER TO teselagen;<br>
<br>
--<br>
-- Name: part_numbers_id_seq; Type: SEQUENCE; Schema: public; Owner: tesela=
gen<br>
--<br>
<br>
CREATE SEQUENCE part_numbers_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.part_numbers_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: parts; Type: TABLE; Schema: public; Owner: teselagen; Tablespace:<=
br>
--<br>
<br>
CREATE TABLE parts (<br>
=A0 =A0 package_format character varying(255) NOT NULL,<br>
=A0 =A0 pkgd_dna_fwd_hash character varying(40),<br>
=A0 =A0 pkgd_dna_rev_hash character varying(40),<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.parts OWNER TO teselagen;<br>
<br>
--<br>
-- Name: permission_read_groups; Type: TABLE; Schema: public; Owner: tesela=
gen; Tablespace:<br>
--<br>
<br>
CREATE TABLE permission_read_groups (<br>
=A0 =A0 id integer NOT NULL,<br>
=A0 =A0 entry_id bigint,<br>
=A0 =A0 group_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.permission_read_groups OWNER TO teselagen;<br>
<br>
--<br>
-- Name: permission_read_groups_id_seq; Type: SEQUENCE; Schema: public; Own=
er: teselagen<br>
--<br>
<br>
CREATE SEQUENCE permission_read_groups_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.permission_read_groups_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: permission_read_users; Type: TABLE; Schema: public; Owner: teselag=
en; Tablespace:<br>
--<br>
<br>
CREATE TABLE permission_read_users (<br>
=A0 =A0 id integer NOT NULL,<br>
=A0 =A0 account_id bigint,<br>
=A0 =A0 entry_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.permission_read_users OWNER TO teselagen;<br>
<br>
--<br>
-- Name: permission_read_users_id_seq; Type: SEQUENCE; Schema: public; Owne=
r: teselagen<br>
--<br>
<br>
CREATE SEQUENCE permission_read_users_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.permission_read_users_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: permission_write_groups; Type: TABLE; Schema: public; Owner: tesel=
agen; Tablespace:<br>
--<br>
<br>
CREATE TABLE permission_write_groups (<br>
=A0 =A0 id integer NOT NULL,<br>
=A0 =A0 entry_id bigint,<br>
=A0 =A0 group_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.permission_write_groups OWNER TO teselagen;<br>
<br>
--<br>
-- Name: permission_write_groups_id_seq; Type: SEQUENCE; Schema: public; Ow=
ner: teselagen<br>
--<br>
<br>
CREATE SEQUENCE permission_write_groups_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.permission_write_groups_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: permission_write_users; Type: TABLE; Schema: public; Owner: tesela=
gen; Tablespace:<br>
--<br>
<br>
CREATE TABLE permission_write_users (<br>
=A0 =A0 id integer NOT NULL,<br>
=A0 =A0 account_id bigint,<br>
=A0 =A0 entry_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.permission_write_users OWNER TO teselagen;<br>
<br>
--<br>
-- Name: permission_write_users_id_seq; Type: SEQUENCE; Schema: public; Own=
er: teselagen<br>
--<br>
<br>
CREATE SEQUENCE permission_write_users_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.permission_write_users_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: plasmids; Type: TABLE; Schema: public; Owner: teselagen; Tablespac=
e:<br>
--<br>
<br>
CREATE TABLE plasmids (<br>
=A0 =A0 backbone character varying(127),<br>
=A0 =A0 circular boolean,<br>
=A0 =A0 origin_of_replication character varying(127),<br>
=A0 =A0 promoters character varying(512),<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.plasmids OWNER TO teselagen;<br>
<br>
--<br>
-- Name: projects; Type: TABLE; Schema: public; Owner: teselagen; Tablespac=
e:<br>
--<br>
<br>
CREATE TABLE projects (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 creation_time timestamp without time zone,<br>
=A0 =A0 data text,<br>
=A0 =A0 description text,<br>
=A0 =A0 modification_time timestamp without time zone,<br>
=A0 =A0 name character varying(255) NOT NULL,<br>
=A0 =A0 &quot;type&quot; character varying(31) NOT NULL,<br>
=A0 =A0 uuid character varying(36) NOT NULL,<br>
=A0 =A0 accounts_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.projects OWNER TO teselagen;<br>
<br>
--<br>
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<=
br>
--<br>
<br>
CREATE SEQUENCE projects_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.projects_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: samples; Type: TABLE; Schema: public; Owner: teselagen; Tablespace=
:<br>
--<br>
<br>
CREATE TABLE samples (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 creation_time timestamp without time zone,<br>
=A0 =A0 depositor character varying(127),<br>
=A0 =A0 label character varying(127),<br>
=A0 =A0 modification_time timestamp without time zone,<br>
=A0 =A0 notes text,<br>
=A0 =A0 uuid character varying(36),<br>
=A0 =A0 entries_id bigint NOT NULL,<br>
=A0 =A0 location_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.samples OWNER TO teselagen;<br>
<br>
--<br>
-- Name: samples_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<b=
r>
--<br>
<br>
CREATE SEQUENCE samples_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.samples_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: selection_markers; Type: TABLE; Schema: public; Owner: teselagen; =
Tablespace:<br>
--<br>
<br>
CREATE TABLE selection_markers (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 name character varying(50) NOT NULL,<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.selection_markers OWNER TO teselagen;<br>
<br>
--<br>
-- Name: selection_markers_id_seq; Type: SEQUENCE; Schema: public; Owner: t=
eselagen<br>
--<br>
<br>
CREATE SEQUENCE selection_markers_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.selection_markers_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: sequence_annotation_location; Type: TABLE; Schema: public; Owner: =
teselagen; Tablespace:<br>
--<br>
<br>
CREATE TABLE sequence_annotation_location (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 genbank_end integer NOT NULL,<br>
=A0 =A0 genbank_start integer NOT NULL,<br>
=A0 =A0 inbetween boolean,<br>
=A0 =A0 single_residue boolean,<br>
=A0 =A0 sequence_feature_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.sequence_annotation_location OWNER TO teselagen;<br>
<br>
--<br>
-- Name: sequence_annotation_location_id_seq; Type: SEQUENCE; Schema: publi=
c; Owner: teselagen<br>
--<br>
<br>
CREATE SEQUENCE sequence_annotation_location_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.sequence_annotation_location_id_seq OWNER TO teselagen;<=
br>
<br>
--<br>
-- Name: sequence_feature; Type: TABLE; Schema: public; Owner: teselagen; T=
ablespace:<br>
--<br>
<br>
CREATE TABLE sequence_feature (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 flag character varying(255),<br>
=A0 =A0 description text,<br>
=A0 =A0 feature_end integer,<br>
=A0 =A0 feature_start integer,<br>
=A0 =A0 genbank_type character varying(127),<br>
=A0 =A0 name character varying(127),<br>
=A0 =A0 strand integer,<br>
=A0 =A0 feature_id bigint,<br>
=A0 =A0 sequence_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.sequence_feature OWNER TO teselagen;<br>
<br>
--<br>
-- Name: sequence_feature_attribute; Type: TABLE; Schema: public; Owner: te=
selagen; Tablespace:<br>
--<br>
<br>
CREATE TABLE sequence_feature_attribute (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 &quot;key&quot; character varying(511),<br>
=A0 =A0 quoted boolean NOT NULL,<br>
=A0 =A0 value character varying(4095),<br>
=A0 =A0 sequence_feature_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.sequence_feature_attribute OWNER TO teselagen;<br>
<br>
--<br>
-- Name: sequence_feature_attribute_id_seq; Type: SEQUENCE; Schema: public;=
 Owner: teselagen<br>
--<br>
<br>
CREATE SEQUENCE sequence_feature_attribute_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.sequence_feature_attribute_id_seq OWNER TO teselagen;<br=
>
<br>
--<br>
-- Name: sequence_feature_id_seq; Type: SEQUENCE; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
CREATE SEQUENCE sequence_feature_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.sequence_feature_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: sequences; Type: TABLE; Schema: public; Owner: teselagen; Tablespa=
ce:<br>
--<br>
<br>
CREATE TABLE sequences (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 fwd_hash character varying(40),<br>
=A0 =A0 rev_hash character varying(40),<br>
=A0 =A0 &quot;sequence&quot; text,<br>
=A0 =A0 sequence_user text,<br>
=A0 =A0 entries_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.sequences OWNER TO teselagen;<br>
<br>
--<br>
-- Name: sequences_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen=
<br>
--<br>
<br>
CREATE SEQUENCE sequences_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.sequences_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: session_data; Type: TABLE; Schema: public; Owner: teselagen; Table=
space:<br>
--<br>
<br>
CREATE TABLE session_data (<br>
=A0 =A0 session_key character varying(40) NOT NULL,<br>
=A0 =A0 session_data bytea,<br>
=A0 =A0 expire_date bigint,<br>
=A0 =A0 accounts_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.session_data OWNER TO teselagen;<br>
<br>
--<br>
-- Name: storage; Type: TABLE; Schema: public; Owner: teselagen; Tablespace=
:<br>
--<br>
<br>
CREATE TABLE &quot;storage&quot; (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 description character varying(1023),<br>
=A0 =A0 &quot;index&quot; character varying(31),<br>
=A0 =A0 name character varying(255) NOT NULL,<br>
=A0 =A0 owner_email character varying(255) NOT NULL,<br>
=A0 =A0 schemes oid,<br>
=A0 =A0 storage_type character varying(255),<br>
=A0 =A0 uuid character varying(36) NOT NULL,<br>
=A0 =A0 parent_id bigint<br>
);<br>
<br>
<br>
ALTER TABLE public.&quot;storage&quot; OWNER TO teselagen;<br>
<br>
--<br>
-- Name: storage_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen<b=
r>
--<br>
<br>
CREATE SEQUENCE storage_id_seq<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.storage_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: strains; Type: TABLE; Schema: public; Owner: teselagen; Tablespace=
:<br>
--<br>
<br>
CREATE TABLE strains (<br>
=A0 =A0 genotype_phenotype character varying(255),<br>
=A0 =A0 host character varying(255),<br>
=A0 =A0 plasmids character varying(512),<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.strains OWNER TO teselagen;<br>
<br>
--<br>
-- Name: trace_sequence; Type: TABLE; Schema: public; Owner: teselagen; Tab=
lespace:<br>
--<br>
<br>
CREATE TABLE trace_sequence (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 creation_time timestamp without time zone NOT NULL,<br>
=A0 =A0 depositor character varying(255) NOT NULL,<br>
=A0 =A0 file_id character varying(36) NOT NULL,<br>
=A0 =A0 filename character varying(255) NOT NULL,<br>
=A0 =A0 &quot;sequence&quot; text NOT NULL,<br>
=A0 =A0 entries_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.trace_sequence OWNER TO teselagen;<br>
<br>
--<br>
-- Name: trace_sequence_alignments; Type: TABLE; Schema: public; Owner: tes=
elagen; Tablespace:<br>
--<br>
<br>
CREATE TABLE trace_sequence_alignments (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 modification_time timestamp without time zone NOT NULL,<br>
=A0 =A0 query_alignment text NOT NULL,<br>
=A0 =A0 query_end integer NOT NULL,<br>
=A0 =A0 query_start integer NOT NULL,<br>
=A0 =A0 score integer NOT NULL,<br>
=A0 =A0 sequence_hash character varying(40),<br>
=A0 =A0 strand integer NOT NULL,<br>
=A0 =A0 subject_alignment text NOT NULL,<br>
=A0 =A0 subject_end integer NOT NULL,<br>
=A0 =A0 subject_start integer NOT NULL,<br>
=A0 =A0 trace_sequence_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.trace_sequence_alignments OWNER TO teselagen;<br>
<br>
--<br>
-- Name: trace_sequence_alignments_id_seq; Type: SEQUENCE; Schema: public; =
Owner: teselagen<br>
--<br>
<br>
CREATE SEQUENCE trace_sequence_alignments_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.trace_sequence_alignments_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: trace_sequence_id_seq; Type: SEQUENCE; Schema: public; Owner: tese=
lagen<br>
--<br>
<br>
CREATE SEQUENCE trace_sequence_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.trace_sequence_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: workspace; Type: TABLE; Schema: public; Owner: teselagen; Tablespa=
ce:<br>
--<br>
<br>
CREATE TABLE workspace (<br>
=A0 =A0 id bigint NOT NULL,<br>
=A0 =A0 date_added bigint,<br>
=A0 =A0 date_visited bigint,<br>
=A0 =A0 in_workspace boolean NOT NULL,<br>
=A0 =A0 number_visited bigint NOT NULL,<br>
=A0 =A0 starred boolean NOT NULL,<br>
=A0 =A0 account_id bigint NOT NULL,<br>
=A0 =A0 entry_id bigint NOT NULL<br>
);<br>
<br>
<br>
ALTER TABLE public.workspace OWNER TO teselagen;<br>
<br>
--<br>
-- Name: workspace_id_seq; Type: SEQUENCE; Schema: public; Owner: teselagen=
<br>
--<br>
<br>
CREATE SEQUENCE workspace_id_seq<br>
=A0 =A0 START WITH 1<br>
=A0 =A0 INCREMENT BY 1<br>
=A0 =A0 NO MAXVALUE<br>
=A0 =A0 NO MINVALUE<br>
=A0 =A0 CACHE 1;<br>
<br>
<br>
ALTER TABLE public.workspace_id_seq OWNER TO teselagen;<br>
<br>
--<br>
-- Name: account_entry_relationship_pkey; Type: CONSTRAINT; Schema: public;=
 Owner: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY account_entry_relationship<br>
=A0 =A0 ADD CONSTRAINT account_entry_relationship_pkey PRIMARY KEY (id);<br=
>
<br>
<br>
--<br>
-- Name: account_group_pkey; Type: CONSTRAINT; Schema: public; Owner: tesel=
agen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY account_group<br>
=A0 =A0 ADD CONSTRAINT account_group_pkey PRIMARY KEY (account_id, group_id=
);<br>
<br>
<br>
--<br>
-- Name: account_preferences_accounts_id_key; Type: CONSTRAINT; Schema: pub=
lic; Owner: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY account_preferences<br>
=A0 =A0 ADD CONSTRAINT account_preferences_accounts_id_key UNIQUE (accounts=
_id);<br>
<br>
<br>
--<br>
-- Name: account_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner:=
 teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY account_preferences<br>
=A0 =A0 ADD CONSTRAINT account_preferences_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: accounts_funding_source_pkey; Type: CONSTRAINT; Schema: public; Ow=
ner: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY accounts_funding_source<br>
=A0 =A0 ADD CONSTRAINT accounts_funding_source_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;=
 Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY accounts<br>
=A0 =A0 ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: arabidopsis_seed_pkey; Type: CONSTRAINT; Schema: public; Owner: te=
selagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY arabidopsis_seed<br>
=A0 =A0 ADD CONSTRAINT arabidopsis_seed_pkey PRIMARY KEY (entries_id);<br>
<br>
<br>
--<br>
-- Name: assembly_relationship_pkey; Type: CONSTRAINT; Schema: public; Owne=
r: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY assembly_relationship<br>
=A0 =A0 ADD CONSTRAINT assembly_relationship_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: teselag=
en; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY attachments<br>
=A0 =A0 ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: bulk_upload_entry_entry_id_key; Type: CONSTRAINT; Schema: public; =
Owner: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY bulk_upload_entry<br>
=A0 =A0 ADD CONSTRAINT bulk_upload_entry_entry_id_key UNIQUE (entry_id);<br=
>
<br>
<br>
--<br>
-- Name: bulk_upload_pkey; Type: CONSTRAINT; Schema: public; Owner: teselag=
en; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY bulk_upload<br>
=A0 =A0 ADD CONSTRAINT bulk_upload_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: comments_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;=
 Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY comments<br>
=A0 =A0 ADD CONSTRAINT comments_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: configuration_key_key; Type: CONSTRAINT; Schema: public; Owner: te=
selagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY configuration<br>
=A0 =A0 ADD CONSTRAINT configuration_key_key UNIQUE (&quot;key&quot;);<br>
<br>
<br>
--<br>
-- Name: configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: tesel=
agen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY configuration<br>
=A0 =A0 ADD CONSTRAINT configuration_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: entries_funding_source_pkey; Type: CONSTRAINT; Schema: public; Own=
er: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY entries_funding_source<br>
=A0 =A0 ADD CONSTRAINT entries_funding_source_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: entries_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen; =
Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY entries<br>
=A0 =A0 ADD CONSTRAINT entries_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: entries_record_id_key; Type: CONSTRAINT; Schema: public; Owner: te=
selagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY entries<br>
=A0 =A0 ADD CONSTRAINT entries_record_id_key UNIQUE (record_id);<br>
<br>
<br>
--<br>
-- Name: entry_entry_assembly_relationship_pkey; Type: CONSTRAINT; Schema: =
public; Owner: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY entry_entry_assembly_relationship<br>
=A0 =A0 ADD CONSTRAINT entry_entry_assembly_relationship_pkey PRIMARY KEY (=
id);<br>
<br>
<br>
--<br>
-- Name: entry_labels_pkey; Type: CONSTRAINT; Schema: public; Owner: tesela=
gen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY entry_labels<br>
=A0 =A0 ADD CONSTRAINT entry_labels_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: feature_feature_relationship_pkey; Type: CONSTRAINT; Schema: publi=
c; Owner: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY feature_feature_relationship<br>
=A0 =A0 ADD CONSTRAINT feature_feature_relationship_pkey PRIMARY KEY (id);<=
br>
<br>
<br>
--<br>
-- Name: feature_relationship_pkey; Type: CONSTRAINT; Schema: public; Owner=
: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY feature_relationship<br>
=A0 =A0 ADD CONSTRAINT feature_relationship_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: features_hash_sha_key; Type: CONSTRAINT; Schema: public; Owner: te=
selagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY features<br>
=A0 =A0 ADD CONSTRAINT features_hash_sha_key UNIQUE (hash_sha);<br>
<br>
<br>
--<br>
-- Name: features_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;=
 Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY features<br>
=A0 =A0 ADD CONSTRAINT features_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: folder_entry_pkey; Type: CONSTRAINT; Schema: public; Owner: tesela=
gen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY folder_entry<br>
=A0 =A0 ADD CONSTRAINT folder_entry_pkey PRIMARY KEY (folder_id, entry_id);=
<br>
<br>
<br>
--<br>
-- Name: folder_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen; T=
ablespace:<br>
--<br>
<br>
ALTER TABLE ONLY folder<br>
=A0 =A0 ADD CONSTRAINT folder_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: funding_source_pkey; Type: CONSTRAINT; Schema: public; Owner: tese=
lagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY funding_source<br>
=A0 =A0 ADD CONSTRAINT funding_source_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: groups_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen; T=
ablespace:<br>
--<br>
<br>
ALTER TABLE ONLY groups<br>
=A0 =A0 ADD CONSTRAINT groups_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: labels_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen; T=
ablespace:<br>
--<br>
<br>
ALTER TABLE ONLY labels<br>
=A0 =A0 ADD CONSTRAINT labels_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: links_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen; Ta=
blespace:<br>
--<br>
<br>
ALTER TABLE ONLY links<br>
=A0 =A0 ADD CONSTRAINT links_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: moderator_account_id_key; Type: CONSTRAINT; Schema: public; Owner:=
 teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY moderator<br>
=A0 =A0 ADD CONSTRAINT moderator_account_id_key UNIQUE (account_id);<br>
<br>
<br>
--<br>
-- Name: moderator_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen=
; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY moderator<br>
=A0 =A0 ADD CONSTRAINT moderator_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: names_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen; Ta=
blespace:<br>
--<br>
<br>
ALTER TABLE ONLY &quot;names&quot;<br>
=A0 =A0 ADD CONSTRAINT names_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: news_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen; Tab=
lespace:<br>
--<br>
<br>
ALTER TABLE ONLY news<br>
=A0 =A0 ADD CONSTRAINT news_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: parameters_pkey; Type: CONSTRAINT; Schema: public; Owner: teselage=
n; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY parameters<br>
=A0 =A0 ADD CONSTRAINT parameters_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: part_numbers_pkey; Type: CONSTRAINT; Schema: public; Owner: tesela=
gen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY part_numbers<br>
=A0 =A0 ADD CONSTRAINT part_numbers_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: parts_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen; Ta=
blespace:<br>
--<br>
<br>
ALTER TABLE ONLY parts<br>
=A0 =A0 ADD CONSTRAINT parts_pkey PRIMARY KEY (entries_id);<br>
<br>
<br>
--<br>
-- Name: permission_read_groups_pkey; Type: CONSTRAINT; Schema: public; Own=
er: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY permission_read_groups<br>
=A0 =A0 ADD CONSTRAINT permission_read_groups_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: permission_read_users_pkey; Type: CONSTRAINT; Schema: public; Owne=
r: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY permission_read_users<br>
=A0 =A0 ADD CONSTRAINT permission_read_users_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: permission_write_groups_pkey; Type: CONSTRAINT; Schema: public; Ow=
ner: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY permission_write_groups<br>
=A0 =A0 ADD CONSTRAINT permission_write_groups_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: permission_write_users_pkey; Type: CONSTRAINT; Schema: public; Own=
er: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY permission_write_users<br>
=A0 =A0 ADD CONSTRAINT permission_write_users_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: plasmids_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;=
 Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY plasmids<br>
=A0 =A0 ADD CONSTRAINT plasmids_pkey PRIMARY KEY (entries_id);<br>
<br>
<br>
--<br>
-- Name: projects_accounts_id_key; Type: CONSTRAINT; Schema: public; Owner:=
 teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY projects<br>
=A0 =A0 ADD CONSTRAINT projects_accounts_id_key UNIQUE (accounts_id);<br>
<br>
<br>
--<br>
-- Name: projects_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen;=
 Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY projects<br>
=A0 =A0 ADD CONSTRAINT projects_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: samples_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen; =
Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY samples<br>
=A0 =A0 ADD CONSTRAINT samples_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: selection_markers_pkey; Type: CONSTRAINT; Schema: public; Owner: t=
eselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY selection_markers<br>
=A0 =A0 ADD CONSTRAINT selection_markers_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: sequence_annotation_location_pkey; Type: CONSTRAINT; Schema: publi=
c; Owner: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY sequence_annotation_location<br>
=A0 =A0 ADD CONSTRAINT sequence_annotation_location_pkey PRIMARY KEY (id);<=
br>
<br>
<br>
--<br>
-- Name: sequence_feature_attribute_pkey; Type: CONSTRAINT; Schema: public;=
 Owner: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY sequence_feature_attribute<br>
=A0 =A0 ADD CONSTRAINT sequence_feature_attribute_pkey PRIMARY KEY (id);<br=
>
<br>
<br>
--<br>
-- Name: sequence_feature_pkey; Type: CONSTRAINT; Schema: public; Owner: te=
selagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY sequence_feature<br>
=A0 =A0 ADD CONSTRAINT sequence_feature_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: sequences_entries_id_key; Type: CONSTRAINT; Schema: public; Owner:=
 teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY sequences<br>
=A0 =A0 ADD CONSTRAINT sequences_entries_id_key UNIQUE (entries_id);<br>
<br>
<br>
--<br>
-- Name: sequences_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen=
; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY sequences<br>
=A0 =A0 ADD CONSTRAINT sequences_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: session_data_pkey; Type: CONSTRAINT; Schema: public; Owner: tesela=
gen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY session_data<br>
=A0 =A0 ADD CONSTRAINT session_data_pkey PRIMARY KEY (session_key);<br>
<br>
<br>
--<br>
-- Name: storage_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen; =
Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY &quot;storage&quot;<br>
=A0 =A0 ADD CONSTRAINT storage_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: strains_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen; =
Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY strains<br>
=A0 =A0 ADD CONSTRAINT strains_pkey PRIMARY KEY (entries_id);<br>
<br>
<br>
--<br>
-- Name: trace_sequence_alignments_pkey; Type: CONSTRAINT; Schema: public; =
Owner: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY trace_sequence_alignments<br>
=A0 =A0 ADD CONSTRAINT trace_sequence_alignments_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: trace_sequence_alignments_trace_sequence_id_key; Type: CONSTRAINT;=
 Schema: public; Owner: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY trace_sequence_alignments<br>
=A0 =A0 ADD CONSTRAINT trace_sequence_alignments_trace_sequence_id_key UNIQ=
UE (trace_sequence_id);<br>
<br>
<br>
--<br>
-- Name: trace_sequence_file_id_key; Type: CONSTRAINT; Schema: public; Owne=
r: teselagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY trace_sequence<br>
=A0 =A0 ADD CONSTRAINT trace_sequence_file_id_key UNIQUE (file_id);<br>
<br>
<br>
--<br>
-- Name: trace_sequence_pkey; Type: CONSTRAINT; Schema: public; Owner: tese=
lagen; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY trace_sequence<br>
=A0 =A0 ADD CONSTRAINT trace_sequence_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: workspace_pkey; Type: CONSTRAINT; Schema: public; Owner: teselagen=
; Tablespace:<br>
--<br>
<br>
ALTER TABLE ONLY workspace<br>
=A0 =A0 ADD CONSTRAINT workspace_pkey PRIMARY KEY (id);<br>
<br>
<br>
--<br>
-- Name: fk1b57c1eafc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY parameters<br>
=A0 =A0 ADD CONSTRAINT fk1b57c1eafc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fk33ca506ce9cfa5bf; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY entry_labels<br>
=A0 =A0 ADD CONSTRAINT fk33ca506ce9cfa5bf FOREIGN KEY (labels_id) REFERENCE=
S labels(id);<br>
<br>
<br>
--<br>
-- Name: fk33ca506cfc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY entry_labels<br>
=A0 =A0 ADD CONSTRAINT fk33ca506cfc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fk41a99a8a58ae3ff6; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY feature_feature_relationship<br>
=A0 =A0 ADD CONSTRAINT fk41a99a8a58ae3ff6 FOREIGN KEY (relationship) REFERE=
NCES feature_relationship(id);<br>
<br>
<br>
--<br>
-- Name: fk41a99a8a7c20ba5; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY feature_feature_relationship<br>
=A0 =A0 ADD CONSTRAINT fk41a99a8a7c20ba5 FOREIGN KEY (&quot;object&quot;) R=
EFERENCES features(id);<br>
<br>
<br>
--<br>
-- Name: fk41a99a8ad56bbd92; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY feature_feature_relationship<br>
=A0 =A0 ADD CONSTRAINT fk41a99a8ad56bbd92 FOREIGN KEY (subject) REFERENCES =
features(id);<br>
<br>
<br>
--<br>
-- Name: fk4217ec959dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY workspace<br>
=A0 =A0 ADD CONSTRAINT fk4217ec959dc7ff20 FOREIGN KEY (account_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fk4217ec95fa53045; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY workspace<br>
=A0 =A0 ADD CONSTRAINT fk4217ec95fa53045 FOREIGN KEY (entry_id) REFERENCES =
entries(id);<br>
<br>
<br>
--<br>
-- Name: fk43bacc3715846c7; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY account_entry_relationship<br>
=A0 =A0 ADD CONSTRAINT fk43bacc3715846c7 FOREIGN KEY (accounts_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fk43bacc37fc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY account_entry_relationship<br>
=A0 =A0 ADD CONSTRAINT fk43bacc37fc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fk453a8b389dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY permission_write_users<br>
=A0 =A0 ADD CONSTRAINT fk453a8b389dc7ff20 FOREIGN KEY (account_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fk453a8b38fa53045; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY permission_write_users<br>
=A0 =A0 ADD CONSTRAINT fk453a8b38fa53045 FOREIGN KEY (entry_id) REFERENCES =
entries(id);<br>
<br>
<br>
--<br>
-- Name: fk4a2982a42beaf6ca; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY permission_write_groups<br>
=A0 =A0 ADD CONSTRAINT fk4a2982a42beaf6ca FOREIGN KEY (group_id) REFERENCES=
 groups(id);<br>
<br>
<br>
--<br>
-- Name: fk4a2982a4fa53045; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY permission_write_groups<br>
=A0 =A0 ADD CONSTRAINT fk4a2982a4fa53045 FOREIGN KEY (entry_id) REFERENCES =
entries(id);<br>
<br>
<br>
--<br>
-- Name: fk6234fb9fc51d767; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY links<br>
=A0 =A0 ADD CONSTRAINT fk6234fb9fc51d767 FOREIGN KEY (entries_id) REFERENCE=
S entries(id);<br>
<br>
<br>
--<br>
-- Name: fk63bd748fc51d767; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY &quot;names&quot;<br>
=A0 =A0 ADD CONSTRAINT fk63bd748fc51d767 FOREIGN KEY (entries_id) REFERENCE=
S entries(id);<br>
<br>
<br>
--<br>
-- Name: fk6581ae0fc51d767; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY parts<br>
=A0 =A0 ADD CONSTRAINT fk6581ae0fc51d767 FOREIGN KEY (entries_id) REFERENCE=
S entries(id);<br>
<br>
<br>
--<br>
-- Name: fk6ab9bfc6fc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY selection_markers<br>
=A0 =A0 ADD CONSTRAINT fk6ab9bfc6fc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fk6f2740092fbae9d0; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY samples<br>
=A0 =A0 ADD CONSTRAINT fk6f2740092fbae9d0 FOREIGN KEY (location_id) REFEREN=
CES &quot;storage&quot;(id);<br>
<br>
<br>
--<br>
-- Name: fk6f274009fc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY samples<br>
=A0 =A0 ADD CONSTRAINT fk6f274009fc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fk6fb26759fc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY plasmids<br>
=A0 =A0 ADD CONSTRAINT fk6fb26759fc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fk7563ebe615846c7; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY account_preferences<br>
=A0 =A0 ADD CONSTRAINT fk7563ebe615846c7 FOREIGN KEY (accounts_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fk7a9c1ac122d9eea6; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY bulk_upload_entry<br>
=A0 =A0 ADD CONSTRAINT fk7a9c1ac122d9eea6 FOREIGN KEY (bulk_upload_id) REFE=
RENCES bulk_upload(id);<br>
<br>
<br>
--<br>
-- Name: fk7a9c1ac1fa53045; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY bulk_upload_entry<br>
=A0 =A0 ADD CONSTRAINT fk7a9c1ac1fa53045 FOREIGN KEY (entry_id) REFERENCES =
entries(id);<br>
<br>
<br>
--<br>
-- Name: fk8882a5059dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY moderator<br>
=A0 =A0 ADD CONSTRAINT fk8882a5059dc7ff20 FOREIGN KEY (account_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fk8a386a8f9dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY permission_read_users<br>
=A0 =A0 ADD CONSTRAINT fk8a386a8f9dc7ff20 FOREIGN KEY (account_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fk8a386a8ffa53045; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY permission_read_users<br>
=A0 =A0 ADD CONSTRAINT fk8a386a8ffa53045 FOREIGN KEY (entry_id) REFERENCES =
entries(id);<br>
<br>
<br>
--<br>
-- Name: fk8fb0427b8a35e0bb; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY &quot;storage&quot;<br>
=A0 =A0 ADD CONSTRAINT fk8fb0427b8a35e0bb FOREIGN KEY (parent_id) REFERENCE=
S &quot;storage&quot;(id);<br>
<br>
<br>
--<br>
-- Name: fk8fd2ed9efc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY strains<br>
=A0 =A0 ADD CONSTRAINT fk8fd2ed9efc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fk9c4df034da7bb7f5; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY trace_sequence_alignments<br>
=A0 =A0 ADD CONSTRAINT fk9c4df034da7bb7f5 FOREIGN KEY (trace_sequence_id) R=
EFERENCES trace_sequence(id);<br>
<br>
<br>
--<br>
-- Name: fka06ad5e1fc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY arabidopsis_seed<br>
=A0 =A0 ADD CONSTRAINT fka06ad5e1fc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fka395b795d31bc3a7; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY sequence_feature_attribute<br>
=A0 =A0 ADD CONSTRAINT fka395b795d31bc3a7 FOREIGN KEY (sequence_feature_id)=
 REFERENCES sequence_feature(id);<br>
<br>
<br>
--<br>
-- Name: fka4e78e2d2beaf6ca; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY permission_read_groups<br>
=A0 =A0 ADD CONSTRAINT fka4e78e2d2beaf6ca FOREIGN KEY (group_id) REFERENCES=
 groups(id);<br>
<br>
<br>
--<br>
-- Name: fka4e78e2dfa53045; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY permission_read_groups<br>
=A0 =A0 ADD CONSTRAINT fka4e78e2dfa53045 FOREIGN KEY (entry_id) REFERENCES =
entries(id);<br>
<br>
<br>
--<br>
-- Name: fka787a547d31bc3a7; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY sequence_annotation_location<br>
=A0 =A0 ADD CONSTRAINT fka787a547d31bc3a7 FOREIGN KEY (sequence_feature_id)=
 REFERENCES sequence_feature(id);<br>
<br>
<br>
--<br>
-- Name: fkb45d1c6edae0334a; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY folder<br>
=A0 =A0 ADD CONSTRAINT fkb45d1c6edae0334a FOREIGN KEY (parent_id) REFERENCE=
S folder(id);<br>
<br>
<br>
--<br>
-- Name: fkb63dd9d4d2678899; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY groups<br>
=A0 =A0 ADD CONSTRAINT fkb63dd9d4d2678899 FOREIGN KEY (parent) REFERENCES g=
roups(id);<br>
<br>
<br>
--<br>
-- Name: fkb63dd9d4f2398153; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY groups<br>
=A0 =A0 ADD CONSTRAINT fkb63dd9d4f2398153 FOREIGN KEY (fk_parent) REFERENCE=
S groups(id);<br>
<br>
<br>
--<br>
-- Name: fkb75a651615846c7; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY accounts_funding_source<br>
=A0 =A0 ADD CONSTRAINT fkb75a651615846c7 FOREIGN KEY (accounts_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fkb75a65161b5673e5; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY accounts_funding_source<br>
=A0 =A0 ADD CONSTRAINT fkb75a65161b5673e5 FOREIGN KEY (funding_source_id) R=
EFERENCES funding_source(id);<br>
<br>
<br>
--<br>
-- Name: fkbd9e80d2fc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY sequences<br>
=A0 =A0 ADD CONSTRAINT fkbd9e80d2fc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fkbdd05fff15846c7; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY labels<br>
=A0 =A0 ADD CONSTRAINT fkbdd05fff15846c7 FOREIGN KEY (accounts_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fkbe89f32c1b5673e5; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY entries_funding_source<br>
=A0 =A0 ADD CONSTRAINT fkbe89f32c1b5673e5 FOREIGN KEY (funding_source_id) R=
EFERENCES funding_source(id);<br>
<br>
<br>
--<br>
-- Name: fkbe89f32cfc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY entries_funding_source<br>
=A0 =A0 ADD CONSTRAINT fkbe89f32cfc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fkc468557bfc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY trace_sequence<br>
=A0 =A0 ADD CONSTRAINT fkc468557bfc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fkc479187a15846c7; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY projects<br>
=A0 =A0 ADD CONSTRAINT fkc479187a15846c7 FOREIGN KEY (accounts_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fkc8dc1ce2beaf6ca; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY bulk_upload<br>
=A0 =A0 ADD CONSTRAINT fkc8dc1ce2beaf6ca FOREIGN KEY (group_id) REFERENCES =
groups(id);<br>
<br>
<br>
--<br>
-- Name: fkc8dc1ce9dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY bulk_upload<br>
=A0 =A0 ADD CONSTRAINT fkc8dc1ce9dc7ff20 FOREIGN KEY (account_id) REFERENCE=
S accounts(id);<br>
<br>
<br>
--<br>
-- Name: fkc9d348783bc5f36a; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY sequence_feature<br>
=A0 =A0 ADD CONSTRAINT fkc9d348783bc5f36a FOREIGN KEY (feature_id) REFERENC=
ES features(id);<br>
<br>
<br>
--<br>
-- Name: fkc9d3487885308eaa; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY sequence_feature<br>
=A0 =A0 ADD CONSTRAINT fkc9d3487885308eaa FOREIGN KEY (sequence_id) REFEREN=
CES sequences(id);<br>
<br>
<br>
--<br>
-- Name: fkcbe4fd617eea5906; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY folder_entry<br>
=A0 =A0 ADD CONSTRAINT fkcbe4fd617eea5906 FOREIGN KEY (folder_id) REFERENCE=
S folder(id);<br>
<br>
<br>
--<br>
-- Name: fkcbe4fd61fa53045; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY folder_entry<br>
=A0 =A0 ADD CONSTRAINT fkcbe4fd61fa53045 FOREIGN KEY (entry_id) REFERENCES =
entries(id);<br>
<br>
<br>
--<br>
-- Name: fkd3f3cbb0fc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY attachments<br>
=A0 =A0 ADD CONSTRAINT fkd3f3cbb0fc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fkd568f5fefc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY part_numbers<br>
=A0 =A0 ADD CONSTRAINT fkd568f5fefc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fkd71153b315846c7; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY session_data<br>
=A0 =A0 ADD CONSTRAINT fkd71153b315846c7 FOREIGN KEY (accounts_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fkdc17ddf415846c7; Type: FK CONSTRAINT; Schema: public; Owner: tes=
elagen<br>
--<br>
<br>
ALTER TABLE ONLY comments<br>
=A0 =A0 ADD CONSTRAINT fkdc17ddf415846c7 FOREIGN KEY (accounts_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fkdc17ddf4fc51d767; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY comments<br>
=A0 =A0 ADD CONSTRAINT fkdc17ddf4fc51d767 FOREIGN KEY (entries_id) REFERENC=
ES entries(id);<br>
<br>
<br>
--<br>
-- Name: fkdff9cded2beaf6ca; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY account_group<br>
=A0 =A0 ADD CONSTRAINT fkdff9cded2beaf6ca FOREIGN KEY (group_id) REFERENCES=
 groups(id);<br>
<br>
<br>
--<br>
-- Name: fkdff9cded9dc7ff20; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY account_group<br>
=A0 =A0 ADD CONSTRAINT fkdff9cded9dc7ff20 FOREIGN KEY (account_id) REFERENC=
ES accounts(id);<br>
<br>
<br>
--<br>
-- Name: fkede3f5971d1a4969; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY entry_entry_assembly_relationship<br>
=A0 =A0 ADD CONSTRAINT fkede3f5971d1a4969 FOREIGN KEY (subject) REFERENCES =
entries(id);<br>
<br>
<br>
--<br>
-- Name: fkede3f5974f70977c; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY entry_entry_assembly_relationship<br>
=A0 =A0 ADD CONSTRAINT fkede3f5974f70977c FOREIGN KEY (&quot;object&quot;) =
REFERENCES entries(id);<br>
<br>
<br>
--<br>
-- Name: fkede3f5974fe93e06; Type: FK CONSTRAINT; Schema: public; Owner: te=
selagen<br>
--<br>
<br>
ALTER TABLE ONLY entry_entry_assembly_relationship<br>
=A0 =A0 ADD CONSTRAINT fkede3f5974fe93e06 FOREIGN KEY (relationship) REFERE=
NCES assembly_relationship(id);<br>
<br>
<br>
--<br>
-- Name: public; Type: ACL; Schema: -; Owner: postgres<br>
--<br>
<br>
REVOKE ALL ON SCHEMA public FROM PUBLIC;<br>
REVOKE ALL ON SCHEMA public FROM postgres;<br>
GRANT ALL ON SCHEMA public TO postgres;<br>
GRANT ALL ON SCHEMA public TO PUBLIC;<br>
<br>
<br>
--<br>
-- PostgreSQL database dump complete<br>
--<br>
<br>
</div><br>

--089e01160dde5e856604d886cd32--

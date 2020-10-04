-- we don't know how to generate root <with-no-name> (class Root) :(
create table users
(
	id serial not null
		constraint users_pk
			primary key,
	username varchar(255) not null,
	password_hash varchar(512),
    profile_picture uuid,
    google_id text
);

alter table users owner to flowcharts_dev_user;

create unique index users_id_uindex
	on users (id);

create unique index users_username_uindex
	on users (username);

--

create type chart_state as enum ('open', 'completed');

create table chart
(
  id                    uuid              not null
    constraint chart_pkey
    primary key,
  goal_id               uuid              not null,
  head_stage_id     uuid              ,
  direction_angle       smallint  not null ,
  is_public             boolean default false not null ,
  status                chart_state default 'open' not null,
  background            uuid,
  is_archived           boolean default false not null,
  is_default_head_stage boolean default false not null
);

comment on column chart.is_public
is 'Is accessible to non-participants';

alter table chart
  owner to flowcharts_dev_user;

create unique index chart_id_uindex
  on chart (id);

create unique index chart_goal_id_uindex
  on chart (goal_id);

create unique index chart_last_container_id_uindex
  on chart (head_stage_id);

--

create type user_role as enum ('guest', 'editor', 'owner');

create table user_charts
(
  user_id     integer           not null,
  chart_id    uuid          not null,
  user_role user_role default 'guest' not null,
  invited_by integer not null,
  notifications_on      boolean default true not null,
  notification_interval smallint not null,

  constraint user_charts_pk
  unique (user_id, chart_id)
);

comment on column user_charts.notification_interval
is 'Number of days in advance when to notify user of upcoming deadline';

alter table user_charts
  owner to flowcharts_dev_user;

--

create type task_state as enum ('notStarted', 'inProgress', 'completed');

create table task
(
  id          uuid                not null
    constraint task_pkey
    primary key,
  task_name   varchar(255)          not null,
  task_state   task_state default 'notStarted' not null,
  task_desc   varchar(512),
  deadline    timestamp,
  is_optional boolean default false not null
);

alter table task
  owner to flowcharts_dev_user;

create unique index task_id_uindex
  on task (id);

--

create table user_tasks
(
  task_id uuid not null,
  user_id integer not null,
  constraint user_tasks_pk
  unique (task_id, user_id)
);

alter table user_tasks
  owner to flowcharts_dev_user;

--

create type node_type as enum ('step', 'branch', 'stage');

create table node
(
  id           uuid                not null
    constraint node_pkey
    primary key,
  task_id      uuid               not null,
  chart_id     uuid               not null,
  container_id uuid,
  node_type    node_type default 'step' not null,
  color        varchar(255),
  is_head      boolean default false not null
);

alter table node
  owner to flowcharts_dev_user;

create unique index node_id_uindex
  on node (id);

create unique index node_task_id_uindex
  on node (task_id);

--

create table node_connection
(
  node_id      uuid not null,
  next_node_id uuid not null,
  chart_id     uuid not null,
  constraint node_connection_pk
  unique (node_id, next_node_id)
);

alter table node_connection
  owner to flowcharts_dev_user;

create table uploaded_backgrounds
(
	background_id uuid not null
		constraint uploaded_backgrounds_pk
			primary key,
	uploaded_by integer not null
);

create unique index uploaded_backgrounds_background_id_uindex
	on uploaded_backgrounds (background_id);

create table uploaded_profile_pictures
(
	picture_id uuid not null
		constraint uploaded_profile_pictures_pk
			primary key,
	uploaded_by integer not null
);

create unique index uploaded_profile_pictures_picture_id_uindex
	on uploaded_profile_pictures (picture_id);


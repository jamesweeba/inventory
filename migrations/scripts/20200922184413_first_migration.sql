--
--    Copyright 2010-2016 the original author or authors.
--
--    Licensed under the Apache License, Version 2.0 (the "License");
--    you may not use this file except in compliance with the License.
--    You may obtain a copy of the License at
--
--       http://www.apache.org/licenses/LICENSE-2.0
--
--    Unless required by applicable law or agreed to in writing, software
--    distributed under the License is distributed on an "AS IS" BASIS,
--    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
--    See the License for the specific language governing permissions and
--    limitations under the License.
--

-- // First migration.
-- Migration SQL that makes the change goes here.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE products(
 id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
 product_id uuid NOT NULL,
 item varchar NOT NULL,
 code  varchar NOT NULL,
 description varchar NOT NULL,
 company varchar not null,
 status varchar  default 'notscanned',
 gis json,
 posted_ts timestamptz default CURRENT_DATE
);
 
CREATE INDEX ON products(product_id);
CREATE INDEX ON products (code);
CREATE INDEX ON products(status);
CREATE INDEX ON products (company);
CREATE UNIQUE INDEX product_idx ON products (product_id);

-- //@UNDO
-- SQL to undo the change goes here.
DROP TABLE products;



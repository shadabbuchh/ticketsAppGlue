-- Custom SQL migration file, put your code below! --
INSERT INTO "users" ("id","email","first_name","last_name","is_active")
VALUES (gen_random_uuid(),'john.miller@example.com','John','Miller', true);

INSERT INTO "users" ("id","email","first_name","last_name","is_active")
VALUES (gen_random_uuid(),'emily.johnson@example.com','Emily','Johnson', true);

INSERT INTO "users" ("id","email","first_name","last_name","is_active")
VALUES (gen_random_uuid(),'michael.smith@example.com','Michael','Smith', false);

INSERT INTO "users" ("id","email","first_name","last_name","is_active")
VALUES (gen_random_uuid(),'jessica.williams@example.com','Jessica','Williams', true);

INSERT INTO "users" ("id","email","first_name","last_name","is_active")
VALUES (gen_random_uuid(),'david.brown@example.com','David','Brown', true);

INSERT INTO "users" ("id","email","first_name","last_name","is_active")
VALUES (gen_random_uuid(),'ashley.davis@example.com','Ashley','Davis', false);

INSERT INTO "users" ("id","email","first_name","last_name","is_active")
VALUES (gen_random_uuid(),'christopher.wilson@example.com','Christopher','Wilson', true);

INSERT INTO "users" ("id","email","first_name","last_name","is_active")
VALUES (gen_random_uuid(),'amanda.taylor@example.com','Amanda','Taylor', true);

INSERT INTO "users" ("id","email","first_name","last_name","is_active")
VALUES (gen_random_uuid(),'matthew.anderson@example.com','Matthew','Anderson', false);

INSERT INTO "users" ("id","email","first_name","last_name","is_active")
VALUES (gen_random_uuid(),'nicole.thompson@example.com','Nicole','Thompson', true);
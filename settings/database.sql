create TABLE Customer(
    idCustomer SERIAL PRIMARY KEY,
    name CHARACTER VARYING(50),
    email CHARACTER VARYING(50),
    password VARCHAR(255)
);

create TABLE Point(
    idPoint SERIAL PRIMARY KEY,
    name CHARACTER VARYING(50),
    address CHARACTER VARYING(100)
);

create TABLE Business(
    idBusiness SERIAL PRIMARY KEY,
    name CHARACTER VARYING(50),
    path CHARACTER VARYING(200),
);

create TABLE FeedBack(
    idFeedback SERIAL PRIMARY KEY,
    idCustomer INTEGER REFERENCES Customer (idCustomer),
    idPoint INTEGER REFERENCES Point (idPoint),
    date timestamp (2) with time zone,
    rating SMALLINT,
    notes text
);

create TABLE user_right(
    idright SERIAL PRIMARY KEY,
    name CHARACTER VARYING(25)
);

create TABLE manager(
    idmanager SERIAL PRIMARY KEY UNIQUE,
    idCustomer INTEGER REFERENCES Customer (idCustomer) UNIQUE,
    idBusiness INTEGER REFERENCES Business (idBusiness)
);

idCustomer INTEGER REFERENCES Customer (idCustomer) UNIQUE,

ALTER TABLE feedback ADD COLUMN path CHARACTER VARYING(200);

ALTER TABLE Customers ADD UNIQUE (idCustomer);

UPDATE point SET idbusiness = 255 WHERE idpoint > 50;
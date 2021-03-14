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
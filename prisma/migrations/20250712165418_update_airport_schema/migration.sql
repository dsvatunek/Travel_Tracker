-- CreateTable
CREATE TABLE "Airport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "icaoCode" TEXT,
    "iataCode" TEXT,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "altitude" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flightNumber" TEXT,
    "airline" TEXT,
    "aircraftType" TEXT,
    "aircraftRegistration" TEXT,
    "seatNumber" TEXT,
    "flightClass" TEXT,
    "reason" TEXT,
    "comments" TEXT,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "departureAirportId" TEXT NOT NULL,
    "arrivalAirportId" TEXT NOT NULL,
    CONSTRAINT "Flight_departureAirportId_fkey" FOREIGN KEY ("departureAirportId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_arrivalAirportId_fkey" FOREIGN KEY ("arrivalAirportId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FlightImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flightId" TEXT NOT NULL,
    CONSTRAINT "FlightImage_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "visitedAt" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "visitedAt" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "countryId" TEXT NOT NULL,
    CONSTRAINT "City_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Airport_icaoCode_key" ON "Airport"("icaoCode");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_iataCode_key" ON "Airport"("iataCode");

-- CreateIndex
CREATE INDEX "Airport_iataCode_idx" ON "Airport"("iataCode");

-- CreateIndex
CREATE INDEX "Airport_icaoCode_idx" ON "Airport"("icaoCode");

-- CreateIndex
CREATE INDEX "Airport_name_idx" ON "Airport"("name");

-- CreateIndex
CREATE INDEX "Airport_city_idx" ON "Airport"("city");

-- CreateIndex
CREATE INDEX "Airport_country_idx" ON "Airport"("country");

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

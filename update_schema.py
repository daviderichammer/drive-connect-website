import re

with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

renter_models = """
model RenterAccount {
  id                   Int             @id @default(autoincrement())
  email                String          @unique @db.VarChar(255)
  passwordHash         String          @db.VarChar(255)
  firstName            String          @db.VarChar(100)
  lastName             String          @db.VarChar(100)
  phone                String?         @db.VarChar(50)
  profileImageUrl      String?         @db.VarChar(500)
  licenseNumber        String?         @db.VarChar(100)
  licenseState         String?         @db.VarChar(50)
  licenseVerified      Boolean         @default(false)
  resetToken           String?         @db.VarChar(255)
  resetTokenExpiry     DateTime?
  isActive             Boolean         @default(true)
  lastLoginAt          DateTime?
  createdAt            DateTime        @default(now())
  updatedAt            DateTime        @updatedAt
  sessions             RenterSession[]
  favorites            Favorite[]
  reviews              Review[]
  @@map("renter_accounts")
}

model RenterSession {
  id           Int           @id @default(autoincrement())
  renterId     Int
  sessionToken String        @unique @db.VarChar(255)
  expiresAt    DateTime
  createdAt    DateTime      @default(now())
  renter       RenterAccount @relation(fields: [renterId], references: [id], onDelete: Cascade)
  @@map("renter_sessions")
}

model Favorite {
  id        Int           @id @default(autoincrement())
  renterId  Int
  vehicleId Int
  createdAt DateTime      @default(now())
  renter    RenterAccount @relation(fields: [renterId], references: [id], onDelete: Cascade)
  vehicle   Vehicle       @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  @@unique([renterId, vehicleId])
  @@map("favorites")
}

model Review {
  id        Int           @id @default(autoincrement())
  renterId  Int
  bookingId Int           @unique
  vehicleId Int
  rating    Int
  text      String?       @db.Text
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  renter    RenterAccount @relation(fields: [renterId], references: [id], onDelete: Cascade)
  booking   Booking       @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  vehicle   Vehicle       @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
  @@map("reviews")
}
"""

# Insert renter models before the first relation to them, or at the end
if "model Favorite" not in content:
    content += "\n" + renter_models

# Update Vehicle model to include Favorites and Reviews
if "favorites            Favorite[]" not in content:
    content = content.replace("@@map(\"vehicles\")", "favorites Favorite[]\n  reviews Review[]\n  @@map(\"vehicles\")")

# Update Booking model to include Reviews
if "review Review?" not in content:
    content = content.replace("@@map(\"bookings\")", "review Review?\n  @@map(\"bookings\")")

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)

print("Schema updated")

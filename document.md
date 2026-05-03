# Smart Waste Management System

## What is this project?
This is a **Smart Waste Management System**. It helps cities or organizations monitor their garbage bins in real-time. Instead of checking every bin manually, the system tells you exactly how full each bin is, so you can empty them only when needed.

## Key Features
- **Real-Time Monitoring:** See the fill level of dustbins live on a dashboard.
- **Smart Alerts:** The system knows when a bin is full, empty, or critical.
- **History Tracking:** Keeps a record of past garbage levels.
- **Manage Bins:** You can easily add, remove, or update dustbin details.
- **Modern Design:** A clean, easy-to-use interface with Dark Mode support.

---

## How it Works
The system allows the hardware (dustbin) to talk to the software (dashboard).

### 1. The Hardware (The "Eyes")
- We attach a **Sensor** (Ultrasonic HC-SR04) to the lid of the dustbin.
- It measures the distance to the trash.
- An **ESP32 chip** (a small computer with Wi-Fi) calculates the percentage:
  - If the distance is large, the bin is **Empty**.
  - If the distance is small, the bin is **Full**.
- This data is sent over Wi-Fi to our server.

### 2. The Backend (The "Brain")
- The server receives the data from the dustbin.
- It checks which bin sent the data.
- It saves this information securely in a **Database** (Supabase).

### 3. The Dashboard (The "Face")
- A website shows all this data beautifully.
- You can spot which bins are overflowing instantly.
- It has animations that show the trash level rising or falling.

---

## Technologies Used
- **Frontend (Website):** React.js, Tailwind CSS (for styling), Vite.
- **Backend (Server):** Node.js running on Vercel Serverless Functions.
- **Database:** Supabase (PostgreSQL).
- **Hardware:** ESP32 Microcontroller, C++ (Arduino code).

---

## Project Structure
Here is a simple explanation of the folders in this project:

- **`src/`**: Contains the website code (React).
  - **`components/`**: The visual parts like the Dashboard, Charts, and Bin Animations.
- **`api/`**: The server code that handles data from the dustbin.
  - **`bin/`**: Updates receiving bin status.
  - **`registry/`**: Code to add or delete bins from the system.
- **`hardware/`**: Contains the code that goes inside the physical ESP32 chip.
- **`supabase_schema.sql`**: The blueprint for setting up the database.

---

## How to Run It
1. **Database Setup:** Create a project on Supabase and run the provided SQL script.
2. **Configuration:** Add your database keys to a `.env` file.
3. **Install:** Run `npm install` to download necessary tools.
4. **Start:** Run `npm run dev` to launch the website.

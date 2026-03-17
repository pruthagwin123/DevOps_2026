# Smart Building Energy Management System (SBEMS)

Full-stack web application simulating the forecasting and scheduling framework from the IEEE paper **"Deep Learning in Energy Modeling: Application in Smart Buildings With Distributed Energy Generation"**.

## Features

- JWT + bcrypt authentication (register/login/profile)
- Interactive dashboard with real-time simulation
- SDI gauge, storage trend, tariff-based cost breakdown
- Analytics with CSV upload + report download
- DWT-LSTM style forecast simulation (wind/solar/demand)
- Building CRUD management (MongoDB)
- Financial analysis (NPV, breakeven scenarios)
- Contact form persistence with admin-only inbox

## Project Structure

```text
smart-building-energy/
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── EnergyReading.js
│   │   ├── Building.js
│   │   └── ContactMessage.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── energy.js
│   │   ├── buildings.js
│   │   └── contact.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── energyController.js
│   │   └── contactController.js
│   └── middleware/auth.js
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── analytics.html
│   ├── forecast.html
│   ├── buildings.html
│   ├── financial.html
│   ├── contact.html
│   └── about.html
├── public/
│   ├── css/style.css
│   └── js/
│       ├── auth.js
│       ├── ui.js
│       ├── charts.js
│       ├── dashboard.js
│       ├── analytics.js
│       ├── forecast.js
│       ├── buildings.js
│       ├── financial.js
│       ├── contact.js
│       └── landing.js
├── dataset/sample_energy_data.csv
├── seed.js
├── package.json
└── README.md
```

## Environment Variables

Create `.env` from `.env.example`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/smart_building_energy
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

## Setup and Run

1. Install dependencies:

```bash
npm install
```

2. Seed database:

```bash
npm run seed
```

3. Start server:

```bash
npm start
```

4. Open app:

```text
http://localhost:5000
```

## Demo Credentials (after seed)

- Admin: `admin@sbes.local` / `Admin@123`
- User: `user@sbes.local` / `User@1234`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Energy
- `GET /api/energy/readings`
- `POST /api/energy/readings`
- `GET /api/energy/readings/:buildingId`
- `DELETE /api/energy/readings/:id`
- `POST /api/energy/upload` (CSV via Multer)
- `GET /api/energy/forecast?type=demand|solar|wind`
- `GET /api/energy/schedule`
- `GET /api/energy/financial?scenario=with_wind|without_wind`

### Buildings
- `GET /api/buildings`
- `POST /api/buildings`
- `PUT /api/buildings/:id`
- `DELETE /api/buildings/:id`

### Contact
- `POST /api/contact`
- `GET /api/contact` (admin only)

## Paper-Based Simulation Targets Included

- Grid reduction indicator: 84%
- Cost savings indicator: 87%
- Best forecast accuracy: 3.63% MAPE
- Peak threshold: 22.1918 kWh
- Storage capacity: 40.5 kWh
- Tariffs: 0.0941 and 0.141 USD/kWh
- Forecast table values from paper Table 6 included in UI
- Financial scenarios matching reported breakeven behavior (8-9 years)

## Screenshots Description

- **Landing (`frontend/index.html`)**: hero, feature cards, animated result counters, CTA.
- **Login/Register**: authentication forms with validation and remember-me.
- **Dashboard**: KPI cards, real-time line chart, SDI gauge, storage area chart, tariff cost bars.
- **Analytics**: annual/monthly charting, hourly averages, CSV upload, report download.
- **Forecast**: parameterized multi-horizon DWT-LSTM simulation and model metrics table.
- **Buildings**: editable building cards and per-building consumption charts.
- **Financial**: NPV curve for two scenarios, breakeven and summary tables.
- **Contact/About**: contact persistence, map placeholder, paper citation and findings.

## Notes

- This implementation is a simulation framework inspired by the paper, not the exact training pipeline.
- Replace map API key placeholder in `frontend/contact.html` for production use.

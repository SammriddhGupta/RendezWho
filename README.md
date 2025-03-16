# SpotSync
##### From plans to places in seconds 

#### Requirements
- Node.js v22 (download from https://nodejs.org/en)
- Firebase project with a firestore database


#### How to get started locally: 

1. Clone this repo: `git clone https://github.com/SammriddhGupta/RendezWho.git` or use SSH clone method as per your preference

<br>

2. **Setup Backend** 
By navigating to the backend directory:
```bash
cd backend
```
3. Install backend dependencies:
```bash
npm install
```

4. **Create a `.env` file**
Create a file named `.env` in the `backend directory` and add your Firebase configuration:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

```

5. Start the backend server
```bash
node server.js
```
By default, the server will run on **port 5001**.


6. **Setup Frontend**
Open a new terminal and stay at the root folder

7. Install frontend dependencies:
```bash
npm install
```

7. Run `npm install` 

8.  start the frontend server by running
```bash
npm run dev
```
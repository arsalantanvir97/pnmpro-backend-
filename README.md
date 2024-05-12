# PNMPro Backend

Welcome to the backend repository for PNMPro, a platform similar to Uber, connecting users with nearby drivers for rides. Our Node.js backend powers an efficient and real-time ride-hailing experience, enabling seamless communication between users and drivers.

## Features

- **User Registration**:
  - Drivers can register on the app to offer rides, while users can sign up to request rides.
- **Real-Time Location Tracking**:
  - Continuous socket-based location tracking for drivers within a 5 km radius.
- **Push Notifications**:
  - Users receive push notifications when nearby drivers are available for a ride.
- **Ride Request and Acceptance**:
  - Users can request rides from their current location, and drivers can accept ride requests in real-time.
- **Ride Status Updates**:
  - Users are notified when a driver accepts their ride request and when the driver is en route.
- **Live Ride Tracking**:
  - Users can track the driver's location and estimated time of arrival in real-time.
- **Wallet System**:
  - Integrated wallet system for users to pay for rides and top up their wallet with cash.
- **Driver Availability Management**:
  - Drivers can mark themselves as available or unavailable for rides.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for Node.js, used for routing and middleware.
- **MongoDB**: NoSQL database used for storing user and driver data, ride details, and wallet transactions.
- **Socket.io**: Real-time bidirectional event-based communication library for implementing sockets.
- **Push Notification Service**: Integration for sending push notifications to users and drivers.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization.
- **Bcrypt**: Hashing library for securing user passwords.
- **Other Dependencies**: Check `package.json` for a full list.

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/pnmpro-backend.git
    ```

2. **Install dependencies:**
    ```bash
    cd pnmpro-backend
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following:

    ```
    PORT=3000
    MONGODB_URI=<your_mongodb_uri>
    JWT_SECRET=<your_jwt_secret>
    PUSH_NOTIFICATION_SERVICE=<your_push_notification_service_credentials>
    ```

    Make sure to replace `<your_mongodb_uri>`, `<your_jwt_secret>`, and `<your_push_notification_service_credentials>` with your actual MongoDB URI, JWT secret, and push notification service credentials respectively.

4. **Run the server:**
    ```bash
    npm start
    ```

## Usage

Once the server is running, users can register, request rides, and track their ride's status in real-time. Drivers can register, mark themselves as available, and accept ride requests. Users and drivers will receive push notifications for ride updates.


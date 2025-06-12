# Yoga Parvatha 🧘

A web application designed to support yoga practitioners with timers and practice documents for various yoga techniques.

## 🌟 Features

### Timers
- **Shanmukhi Timer**: A specialized timer for Shanmukhi mudra practice
- **Shambhavi Timer**: A dedicated timer for Shambhavi mahamudra practice
- Interactive controls with play, pause, resume, and stop functionality
- Visual feedback with intuitive icons
- Responsive design that works on all devices

### Documents
- Access to practice documents and guidelines
- Easy navigation through the documentation section

## 🛠️ Technical Details

### Project Structure
```
yoga-parvatha/
├── assets/
│   └── images/
│       ├── icons/
│       └── favicon/
├── timer/
│   ├── styles.css
│   ├── shanmukhi.html
│   └── shambhavi.html
├── index.html
├── documents.html
├── robots.txt
└── CNAME
```

### Technologies Used
- HTML5
- CSS3
- JavaScript
- Responsive Web Design
- Custom timer implementation

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- Live Server extension for VS Code (for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yoga-parvatha.git
   ```

2. Open the project in VS Code

3. Install Live Server extension if not already installed

### Running the Application

1. Open the project in VS Code
2. Right-click on `index.html` and select "Open with Live Server"
3. The application will open in your default browser

### Accessing from Mobile Devices

To access the timer from your mobile device on the same network:

1. Configure Live Server to be accessible over the network:
   - Open VS Code
   - Press `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows/Linux)
   - Type: `Preferences: Open Settings (JSON)` and select it
   - Add this setting to the JSON file:
   ```json
   "liveServer.settings.host": "0.0.0.0"
   ```

2. Find your computer's IP address:
   - On Mac: Open Terminal and run:
     ```bash
     ipconfig getifaddr en0
     ```
   - On Windows: Open Command Prompt and run:
     ```bash
     ipconfig
     ```
     Look for "IPv4 Address" under your active network adapter

3. On your mobile device:
   - Connect to the same WiFi network as your computer
   - Open a web browser
   - Enter the URL: `http://YOUR_COMPUTER_IP:5500`
   - Example: `http://192.168.1.100:5500`

Note: The default port is 5500. If you've configured a different port in Live Server settings, use that port number instead.

## 💻 Usage

1. **Using the Timers**:
   - Select the desired timer (Shanmukhi or Shambhavi)
   - Use the control buttons to:
     - Start the practice
     - Pause when needed
     - Resume the session
     - Stop the practice
   - The timer will display the remaining time

2. **Accessing Documents**:
   - Click on "View Practice Documents" to access the documentation
   - Browse through the available practice materials

## 🎨 UI Features

- Clean and minimalist design
- Responsive layout that adapts to different screen sizes
- Intuitive navigation
- Visual feedback for user interactions
- Custom button animations and hover effects

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🔒 Privacy

- The application runs entirely in the browser
- No data is stored or transmitted
- No tracking or analytics

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Made with ❤️ for yoga practitioners

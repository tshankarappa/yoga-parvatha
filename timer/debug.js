// Set to true to enable debug messages
window.DEBUG_MODE = false;

// Debug function to show messages on screen
window.debug = function(msg) {
    if (!window.DEBUG_MODE) return;
    
    let debugDiv = document.getElementById('debug');
    if (!debugDiv) {
        // Create debug panel if it doesn't exist
        debugDiv = document.createElement('div');
        debugDiv.id = 'debug';
        debugDiv.style.cssText = `
            display: none;
            position: fixed;
            bottom: 10px;
            left: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            max-height: 100px;
            overflow-y: auto;
            z-index: 1000;
        `;
        document.body.appendChild(debugDiv);
    }
    
    debugDiv.style.display = 'block';
    const time = new Date().toLocaleTimeString();
    debugDiv.innerHTML = `[${time}] ${msg}<br>` + debugDiv.innerHTML;
}; 